"""FastAPI application: Sahti MVP API (SRS §9) and the web client.

Run locally:  uvicorn app.main:app --reload --app-dir backend --port 8001   →  http://127.0.0.1:8001/
"""
from __future__ import annotations

import hashlib
import os
import logging
import re
import time
import uuid
from datetime import datetime, timedelta, timezone
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import FileResponse, JSONResponse, Response
from fastapi.staticfiles import StaticFiles

from app import __version__, profiles
from app.clinical import BundleError, Snapshot, load_bundle
from app.config import Settings
from app.db import Database
from app.engine import consultation as cons
from app.engine.consultation import ConsultationError
from app.security import FieldCipher, hash_password, new_token, token_hash, verify_password

CONSENT_VERSION, DISCLAIMER_VERSION = "c-1", "d-1"
SESSION_HOURS, EXPIRY_HOURS = 12, 24
WEB_SRC = Path(__file__).resolve().parent.parent / "web"


def _web_dir() -> Path:
    """The un-built client is the default. SAHTI_WEB_DIST=1 serves the optional build, unless it is stale."""
    dist = WEB_SRC / "dist"
    if os.getenv("SAHTI_WEB_DIST", "").lower() not in {"1", "true", "yes"}:
        return WEB_SRC
    if not (dist / "index.html").exists():
        log.warning("SAHTI_WEB_DIST is set but backend/web/dist is missing; serving the source")
        return WEB_SRC
    newest_src = max(f.stat().st_mtime for f in WEB_SRC.rglob("*") if f.is_file() and dist not in f.parents)
    if newest_src > (dist / "build.json").stat().st_mtime:
        log.warning("backend/web/dist is older than the source; serving the source (run scripts/build_web.py)")
        return WEB_SRC
    return dist
_EMAIL = re.compile(r"^[^@\s]{1,64}@[^@\s]+\.[^@\s]+$")
MESSAGES = {  # SRS §14.2 (drafts; Arabic needs native review, DQ-03)
    "E-VAL-001": ("Vérifiez ce champ.", "يرجى التحقق من هذا الحقل."),
    "E-VAL-002": ("Cette valeur n'est pas acceptée.", "هذه القيمة غير مقبولة."),
    "E-VAL-003": ("Langue non prise en charge.", "اللغة غير مدعومة."),
    "E-AUTH-001": ("Veuillez vous reconnecter.", "يرجى تسجيل الدخول مجددًا."),
    "E-AUTH-003": ("Email ou mot de passe incorrect.", "البريد الإلكتروني أو كلمة المرور غير صحيحة."),
    "E-AUTH-004": ("Ce compte existe déjà.", "هذا الحساب موجود بالفعل."),
    "E-AUTH-005": ("Cette application est réservée aux adultes.", "هذا التطبيق مخصص للبالغين فقط."),
    "E-CONS-001": ("Votre accord est nécessaire pour enregistrer vos données de santé.", "موافقتك ضرورية لحفظ بياناتك الصحية."),
    "E-CONS-002": ("Veuillez lire et accepter l'avertissement.", "يرجى قراءة التنبيه والموافقة عليه."),
    "E-CONS-003": ("Consultation introuvable.", "الاستشارة غير موجودة."),
    "E-CONS-004": ("Profil introuvable.", "الملف غير موجود."),
    "E-CONS-005": ("Cette consultation est terminée.", "هذه الاستشارة منتهية."),
    "E-CONS-006": ("Veuillez d'abord terminer la confirmation.", "يرجى إكمال التأكيد أولًا."),
    "E-DATA-002": ("Service temporairement indisponible.", "الخدمة غير متاحة مؤقتًا."),
    "E-SYS-001": ("Erreur technique. Réessayez.", "خطأ تقني. حاول مرة أخرى."),
}
log = logging.getLogger("sahti")
_HASHED = re.compile(r"\.[0-9a-f]{8}\.(?:js|css)$")


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _iso(dt: datetime) -> str:
    return dt.isoformat(timespec="seconds")


def _short_hash(value: str) -> str:
    """consultationHash for logs (SRS §14.4): never the raw id, never a user id."""
    return hashlib.sha256(value.encode()).hexdigest()[:12]


class Api:
    """Holds the settings, the database, the cipher and the active clinical snapshot."""

    def __init__(self, settings: Settings):
        self.settings = settings
        self.db = Database(settings.database_url)
        self.cipher = FieldCipher(settings.encryption_secret)
        self.snap: Snapshot | None = None
        self.data_error = None
        try:
            snap = load_bundle(settings.clinical_bundle)
            if snap.review_status == "DRAFT" and settings.public_deployment:
                raise BundleError("DRAFT clinical data is refused in a public deployment (FR-39, E-DATA-003)")
            self.snap = snap
        except BundleError as exc:
            self.data_error = str(exc)
            log.error("clinical data not active: %s", exc)


def create_app(settings: Settings | None = None) -> FastAPI:
    api = Api(settings or Settings.from_env())
    app = FastAPI(title="Sahti API", version=__version__)
    app.state.api = api
    app.add_middleware(GZipMiddleware, minimum_size=1024)   # text assets and JSON are sent compressed

    # ------------------------------------------------------------------ errors and logging
    def error(code: str, status: int, lang: str = "fr", detail: str | None = None, details=None) -> JSONResponse:
        fr, ar = MESSAGES.get(code, MESSAGES["E-SYS-001"])
        body = {"code": code, "message": ar if lang == "ar" else fr, "traceId": uuid.uuid4().hex[:16]}
        if detail:
            body["detail"] = detail
        if details:
            body["details"] = details
        return JSONResponse({"error": body}, status_code=status)

    @app.exception_handler(ConsultationError)
    async def _cons_error(request: Request, exc: ConsultationError):
        return error(exc.code, exc.status, getattr(request.state, "lang", "fr"), exc.message,
                     getattr(exc, "details", None))

    @app.exception_handler(RequestValidationError)
    async def _validation(request: Request, exc: RequestValidationError):
        return error("E-VAL-001", 400, getattr(request.state, "lang", "fr"))

    @app.exception_handler(Exception)
    async def _unexpected(request: Request, exc: Exception):
        log.exception("unexpected error on %s", request.url.path)
        return error("E-SYS-001", 500, getattr(request.state, "lang", "fr"))

    @app.middleware("http")
    async def _log_requests(request: Request, call_next):
        start = time.perf_counter()
        response = await call_next(request)
        path = request.url.path
        if path.startswith(("/static/vendor/", "/static/fonts/")) or _HASHED.search(path):   # names carry the version
            response.headers["Cache-Control"] = "public, max-age=31536000, immutable"
        elif path.startswith("/static/") or path == "/":
            response.headers["Cache-Control"] = "no-cache"   # revalidate app code on every load
        if request.url.path.startswith("/api/"):
            # Path with ids hashed, status and latency only — never a body (NFR-09).
            path = re.sub(r"[0-9a-f]{32}", lambda m: "#" + _short_hash(m.group(0)), request.url.path)
            log.info("%s %s %s %.0fms", request.method, path, response.status_code,
                     (time.perf_counter() - start) * 1000)
        return response

    # ------------------------------------------------------------------ helpers
    def fail(code: str, status: int, detail: str | None = None):
        raise ConsultationError(code, status, detail or code)

    def need_data() -> Snapshot:
        if api.snap is None:
            fail("E-DATA-002", 503, "no active clinical data")
        return api.snap

    def current_user(request: Request, need_disclaimer: bool = True):
        header = request.headers.get("authorization", "")
        token = header[7:] if header.lower().startswith("bearer ") else ""
        row = api.db.one("SELECT u.* , s.expires_at FROM sessions s JOIN users u ON u.id = s.user_id "
                         "WHERE s.token_hash = ?", (token_hash(token),)) if token else None
        if row is None or row["expires_at"] < _iso(_now()):
            fail("E-AUTH-001", 401)
        request.state.lang = row["language"]
        if need_disclaimer and not row["disclaimer_at"]:
            fail("E-CONS-002", 403)
        return row

    def issue_token(user_id: str) -> dict:
        token = new_token()
        api.db.execute("INSERT INTO sessions VALUES (?, ?, ?)",
                       (token_hash(token), user_id, _iso(_now() + timedelta(hours=SESSION_HOURS))))
        return {"accessToken": token, "expiresIn": SESSION_HOURS * 3600}

    def audit(action: str, summary: str = "") -> None:
        api.db.execute("INSERT INTO audit_events (actor_hash, action, summary, created_at) VALUES (?, ?, ?, ?)",
                       (None, action, summary, _iso(_now())))

    def load_profile(user, profile_id: str) -> dict:
        row = api.db.one("SELECT * FROM profiles WHERE id = ? AND user_id = ?", (profile_id, user["id"]))
        if row is None:
            fail("E-CONS-004", 404, "profile not found")
        return api.cipher.decrypt(row["data_enc"])

    def load_consultation(user, consultation_id: str):
        row = api.db.one("SELECT * FROM consultations WHERE id = ? AND user_id = ?", (consultation_id, user["id"]))
        if row is None:
            fail("E-CONS-003", 404)
        return row, api.cipher.decrypt(row["state_enc"])

    def save_consultation(row_id: str, state: dict, version: int) -> None:
        completed = _iso(_now()) if state["status"] != "IN_PROGRESS" else None
        result_type = (state.get("result") or {}).get("resultType")
        api.db.execute("UPDATE consultations SET status = ?, result_type = ?, completed_at = COALESCE(completed_at, ?), "
                       "state_enc = ?, version = ? WHERE id = ?",
                       (state["status"], result_type, completed, api.cipher.encrypt(state), version + 1, row_id))

    def snap_for(state: dict) -> Snapshot:
        """In-progress consultations keep their data version (FR-39)."""
        snap = need_data()
        if snap.version != state["dataVersion"]:
            return load_bundle(state["dataVersion"])
        return snap

    def known_names(user) -> list:
        rows = api.db.all("SELECT data_enc FROM profiles WHERE user_id = ?", (user["id"],))
        return [api.cipher.decrypt(r["data_enc"])["fullName"] for r in rows]

    def expire_old(user) -> None:
        """FR-23: an unfinished consultation older than 24 h becomes ABANDONED."""
        limit = _iso(_now() - timedelta(hours=EXPIRY_HOURS))
        api.db.execute("UPDATE consultations SET status = 'ABANDONED' WHERE user_id = ? AND status = 'IN_PROGRESS' "
                       "AND started_at < ?", (user["id"], limit))

    # ------------------------------------------------------------------ health and auth
    @app.get("/api/v1/health")
    def health() -> dict:
        """Liveness check (API-26). Never returns personal data."""
        return {"status": "ok", "activeDataVersion": api.snap.version if api.snap else None,
                "dataStatus": api.snap.review_status if api.snap else None, "modelVersion": cons.MODEL_VERSION}

    @app.post("/api/v1/auth/register", status_code=201)
    def register(body: dict, request: Request):
        lang = body.get("language")
        request.state.lang = lang if lang in ("fr", "ar") else "fr"
        if lang not in ("fr", "ar"):
            fail("E-VAL-003", 400)
        email = str(body.get("email", "")).strip().lower()
        password = str(body.get("password", ""))
        if len(email) > 254 or not _EMAIL.match(email):
            fail("E-VAL-001", 400, "email")
        if not 8 <= len(password) <= 128:
            fail("E-VAL-001", 400, "password must be 8–128 characters")
        if body.get("isAdultConfirmed") is not True:
            fail("E-AUTH-005", 403)
        consent = body.get("consent") or {}
        if body.get("disclaimerVersion") != DISCLAIMER_VERSION:
            fail("E-CONS-002", 403)
        if api.db.one("SELECT id FROM users WHERE email = ?", (email,)):
            fail("E-AUTH-004", 409)
        user_id, now = uuid.uuid4().hex, _iso(_now())
        api.db.execute("INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                       (user_id, email, hash_password(password), lang,
                        now if consent.get("granted") is True else None, now, uuid.uuid4().hex, now))
        audit("REGISTER")
        return {"userId": user_id, **issue_token(user_id), "consentActive": consent.get("granted") is True}

    @app.post("/api/v1/auth/login")
    def login(body: dict):
        row = api.db.one("SELECT * FROM users WHERE email = ?", (str(body.get("email", "")).strip().lower(),))
        if row is None or not verify_password(str(body.get("password", "")), row["password_hash"]):
            fail("E-AUTH-003", 401)  # same answer for unknown email and wrong password
        return issue_token(row["id"])

    @app.post("/api/v1/auth/logout", status_code=204)
    def logout(request: Request):
        header = request.headers.get("authorization", "")
        api.db.execute("DELETE FROM sessions WHERE token_hash = ?", (token_hash(header[7:]),))
        return Response(status_code=204)

    @app.get("/api/v1/me")
    def me(request: Request):
        user = current_user(request, need_disclaimer=False)
        return {"userId": user["id"], "email": user["email"], "language": user["language"],
                "consentActive": bool(user["consent_at"]),
                "disclaimerVersionAcknowledged": DISCLAIMER_VERSION if user["disclaimer_at"] else None,
                "currentDisclaimerVersion": DISCLAIMER_VERSION}

    @app.patch("/api/v1/me")
    def update_me(body: dict, request: Request):
        user = current_user(request, need_disclaimer=False)
        if body.get("language") not in ("fr", "ar"):
            fail("E-VAL-003", 400)
        api.db.execute("UPDATE users SET language = ? WHERE id = ?", (body["language"], user["id"]))
        return {"language": body["language"]}

    @app.post("/api/v1/me/consent", status_code=201)
    def give_consent(body: dict, request: Request):
        user = current_user(request, need_disclaimer=False)
        if body.get("granted") is not True:
            fail("E-VAL-001", 400)
        now = _iso(_now())
        api.db.execute("UPDATE users SET consent_at = ? WHERE id = ?", (now, user["id"]))
        return {"consentId": uuid.uuid4().hex, "grantedAt": now}

    @app.post("/api/v1/me/delete")
    def delete_me(body: dict, request: Request):
        """API-09 (POST so the browser can send a body): everything of the user is erased."""
        user = current_user(request, need_disclaimer=False)
        if not verify_password(str(body.get("password", "")), user["password_hash"]):
            fail("E-AUTH-003", 401)
        for table, column in (("consultations", "user_id"), ("profiles", "user_id"), ("sessions", "user_id"),
                              ("users", "id")):
            api.db.execute(f"DELETE FROM {table} WHERE {column} = ?", (user["id"],))
        audit("DELETE_ACCOUNT")
        return Response(status_code=204)

    # ------------------------------------------------------------------ reference data and profiles
    @app.get("/api/v1/reference/terms")
    def terms(request: Request, kind: str, q: str = ""):
        user = current_user(request)
        snap = need_data()
        lang = user["language"]
        q = q.strip().lower()
        items = [{"code": t.code, "label": t.label[lang]} for t in snap.terms.values() if t.kind == kind
                 and (not q or q in t.label["fr"].lower() or q in t.label["ar"] or any(q in s for s in t.synonyms))]
        return {"dataVersion": snap.version, "items": items[:50]}

    @app.get("/api/v1/profiles")
    def list_profiles(request: Request):
        user = current_user(request)
        snap = need_data()
        expire_old(user)
        rows = api.db.all("SELECT * FROM profiles WHERE user_id = ? ORDER BY created_at", (user["id"],))
        items = []
        for row in rows:
            data = api.cipher.decrypt(row["data_enc"])
            expired = api.db.all("SELECT id, started_at FROM consultations WHERE profile_id = ? AND status = 'ABANDONED' "
                                 "AND expiry_notified = 0", (row["id"],))
            api.db.execute("UPDATE consultations SET expiry_notified = 1 WHERE profile_id = ? AND status = 'ABANDONED'",
                           (row["id"],))
            items.append({**profiles.summary(row["id"], data, snap),
                          "expiredConsultations": [{"consultationId": e["id"], "startedAt": e["started_at"]}
                                                   for e in expired]})
        return {"items": items}

    @app.post("/api/v1/profiles", status_code=201)
    def create_profile(body: dict, request: Request):
        user = current_user(request)
        if not user["consent_at"]:
            fail("E-CONS-001", 403)
        clean = profiles.validate(body, need_data())
        if clean["relation"] == "SELF" and api.db.one(
                "SELECT id FROM profiles WHERE user_id = ? AND relation = 'SELF'", (user["id"],)):
            fail("E-VAL-001", 400, "you already have your own profile")
        profile_id, now = uuid.uuid4().hex, _iso(_now())
        api.db.execute("INSERT INTO profiles VALUES (?, ?, ?, ?, 1, ?, ?)",
                       (profile_id, user["id"], clean["relation"], api.cipher.encrypt(clean), now, now))
        return {"profileId": profile_id, "version": 1, **profiles.summary(profile_id, clean, api.snap)}

    @app.get("/api/v1/profiles/{profile_id}")
    def get_profile(profile_id: str, request: Request):
        user = current_user(request)
        return {"profileId": profile_id, **load_profile(user, profile_id)}

    @app.put("/api/v1/profiles/{profile_id}")
    def update_profile(profile_id: str, body: dict, request: Request):
        user = current_user(request)
        if not user["consent_at"]:
            fail("E-CONS-001", 403)
        old = load_profile(user, profile_id)
        clean = profiles.validate(body, need_data(), relation=old["relation"])
        row = api.db.one("SELECT version FROM profiles WHERE id = ?", (profile_id,))
        api.db.execute("UPDATE profiles SET data_enc = ?, version = ?, updated_at = ? WHERE id = ?",
                       (api.cipher.encrypt(clean), row["version"] + 1, _iso(_now()), profile_id))
        return {"version": row["version"] + 1}

    @app.delete("/api/v1/profiles/{profile_id}", status_code=204)
    def delete_profile(profile_id: str, request: Request):
        user = current_user(request)
        load_profile(user, profile_id)
        api.db.execute("DELETE FROM consultations WHERE profile_id = ?", (profile_id,))
        api.db.execute("DELETE FROM profiles WHERE id = ?", (profile_id,))
        return Response(status_code=204)

    # ------------------------------------------------------------------ consultations
    def consultation_reply(consultation_id: str, state: dict, snap: Snapshot, extra: dict | None = None) -> dict:
        return {"consultationId": consultation_id, "status": state["status"], "pendingStep": state["pendingStep"],
                "dataStatus": state["dataStatus"], "step": cons.step_view(snap, state), **(extra or {})}

    @app.post("/api/v1/consultations", status_code=201)
    def start_consultation(body: dict, request: Request):
        user = current_user(request)
        if not user["consent_at"]:
            fail("E-CONS-001", 403)
        snap = need_data()
        profile = load_profile(user, str(body.get("profileId")))
        if body.get("weightKg") is not None:  # SCR-15: weight re-confirmed before this consultation
            try:
                profile["weightKg"] = float(body["weightKg"])
            except (TypeError, ValueError):
                fail("E-VAL-001", 400, "weightKg")
        if "weightUncertain" in body:
            profile["weightUncertain"] = bool(body["weightUncertain"])
        reconfirmed = body.get("pregnancyReconfirmed")
        if reconfirmed not in (None, "YES", "NO", "NOT_SURE"):
            fail("E-VAL-001", 400, "pregnancyReconfirmed")
        state = cons.start(snap, profiles.for_engine(profile), user["language"], reconfirmed)
        consultation_id, now = uuid.uuid4().hex, _iso(_now())
        api.db.execute("INSERT INTO consultations (id, user_id, profile_id, status, result_type, started_at, "
                       "completed_at, state_enc, version) VALUES (?, ?, ?, ?, NULL, ?, NULL, ?, 0)",
                       (consultation_id, user["id"], body["profileId"], "IN_PROGRESS", now, api.cipher.encrypt(state)))
        save_consultation(consultation_id, state, 0)
        log.info("consultation started #%s", _short_hash(consultation_id))
        return consultation_reply(consultation_id, state, snap)

    @app.get("/api/v1/consultations/{consultation_id}")
    def get_consultation(consultation_id: str, request: Request):
        user = current_user(request)
        row, state = load_consultation(user, consultation_id)
        if row["status"] == "ABANDONED":
            state["status"] = "ABANDONED"
            return {"consultationId": consultation_id, "status": "ABANDONED"}
        snap = snap_for(state)
        return consultation_reply(consultation_id, state, snap, {
            "answers": [{"seq": e["seq"], "questionCode": e["questionCode"]} for e in state["log"]]})

    def mutate(consultation_id: str, request: Request, action):
        user = current_user(request)
        row, state = load_consultation(user, consultation_id)
        if row["status"] == "ABANDONED":
            fail("E-CONS-005", 409, "this consultation expired")
        snap = snap_for(state)
        extra = action(snap, state, user) or {}
        save_consultation(consultation_id, state, row["version"])
        return consultation_reply(consultation_id, state, snap, extra)

    @app.post("/api/v1/consultations/{consultation_id}/description")
    def describe(consultation_id: str, body: dict, request: Request):
        def action(snap, state, user):
            out = cons.describe(snap, state, str(body.get("text", "")), known_names(user))
            out.pop("step", None)
            return out
        return mutate(consultation_id, request, action)

    @app.post("/api/v1/consultations/{consultation_id}/description/confirmations")
    def confirm(consultation_id: str, body: dict, request: Request):
        items = body.get("items") or []
        confirmed = [i.get("questionCode") for i in items if i.get("confirmed") is True]
        return mutate(consultation_id, request, lambda snap, state, user: cons.confirm_converted(snap, state, confirmed) and None)

    @app.post("/api/v1/consultations/{consultation_id}/answers")
    def answer(consultation_id: str, body: dict, request: Request):
        return mutate(consultation_id, request,
                      lambda snap, state, user: cons.answer(snap, state, body.get("questionCode"), body.get("value")) and None)

    @app.post("/api/v1/consultations/{consultation_id}/answers/undo")
    def undo(consultation_id: str, request: Request):
        return mutate(consultation_id, request, lambda snap, state, user: cons.undo(snap, state) and None)

    @app.get("/api/v1/consultations/{consultation_id}/result")
    def result(consultation_id: str, request: Request):
        user = current_user(request)
        row, state = load_consultation(user, consultation_id)
        if row["status"] in ("IN_PROGRESS", "ABANDONED"):
            fail("E-CONS-005" if row["status"] == "ABANDONED" else "E-CONS-006", 409, "no result yet")
        try:
            view = cons.result_view(snap_for(state), state)
        except Exception:  # NFR-17 / E-SYS-003: never a bare error screen
            log.exception("result assembly failed #%s", _short_hash(consultation_id))
            lang = state.get("language", "fr")
            view = {"resultType": "REFERRAL_FAILURE", "message": cons.REFERRAL_MESSAGES["REFERRAL_FAILURE"][lang],
                    "remedies": [], "medicines": [], "dangerNotice": cons.danger_notice(state),
                    "disclaimer": cons.DISCLAIMER[lang], "dataStatus": state.get("dataStatus")}
        profile_row = api.db.one("SELECT data_enc FROM profiles WHERE id = ?", (row["profile_id"],))
        name = api.cipher.decrypt(profile_row["data_enc"])["fullName"] if profile_row else ""
        return {**view, "consultationId": consultation_id, "status": row["status"], "startedAt": row["started_at"],
                "completedAt": row["completed_at"], "profileName": name}

    @app.post("/api/v1/consultations/{consultation_id}/acknowledgement")
    def acknowledgement(consultation_id: str, request: Request):
        user = current_user(request)
        row, state = load_consultation(user, consultation_id)
        cons.acknowledge(state)
        save_consultation(consultation_id, state, row["version"])
        return {"status": "COMPLETED"}

    @app.get("/api/v1/profiles/{profile_id}/consultations")
    def history(profile_id: str, request: Request, page: int = 1):
        user = current_user(request)
        load_profile(user, profile_id)
        expire_old(user)
        rows = api.db.all("SELECT * FROM consultations WHERE profile_id = ? ORDER BY started_at DESC",
                          (profile_id,))
        items = []
        for row in rows:
            state = api.cipher.decrypt(row["state_enc"])
            res = state.get("result") or {}
            group = res.get("group") or []
            illness = None
            if group and api.snap and group[0] in api.snap.illnesses:
                illness = api.snap.illnesses[group[0]].label[user["language"]]
            items.append({"consultationId": row["id"], "startedAt": row["started_at"], "status": row["status"],
                          "resultType": row["result_type"], "illness": illness,
                          "dangerLevel": state.get("dangerLevel", "NONE")})
        size = 20
        return {"items": items[(page - 1) * size: page * size], "page": page, "pageSize": size, "total": len(items)}

    # ------------------------------------------------------------------ web client
    web_dir = _web_dir()
    if web_dir.exists():
        app.mount("/static", StaticFiles(directory=web_dir), name="static")

        @app.get("/", include_in_schema=False)
        def index():
            return FileResponse(web_dir / "index.html")

    return app


logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")
app = create_app()
