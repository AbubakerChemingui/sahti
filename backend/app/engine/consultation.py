"""Consultation orchestrator (SRS FR-13 – FR-23, FR-41 – FR-43, FR-46, FR-47; SDD SD-01, SD-02).

Works on a plain `state` dict that the API stores encrypted. Every path that adds answers goes
through `_after_answers()`: store → danger check → next step (SDD DR-01). A danger sign raises a
persistent notice; the consultation continues (FR-18, owner's decision I7-Q4).
"""
from __future__ import annotations

from datetime import date

from app.clinical import NO, OUT_OF_SCOPE, UNSURE, YES, Snapshot
from app.engine import classifier, danger, reader, rules

MODEL_VERSION = "naive-bayes-demo-1 + keyword-reader-1"
DISCLAIMER = {
    "fr": "Votre premier pas vers le mieux-être, pas un remplacement de votre médecin. Quand Sahti dit « consultez un médecin », faites-le.",
    "ar": "خطوتك الأولى نحو الشعور بالتحسن، وليست بديلًا عن طبيبك. عندما يقول صحتي «استشر طبيبًا»، افعل ذلك.",
}
NOTICE = {
    "URGENT": {"fr": "Consultez un médecin rapidement.", "ar": "استشر طبيبًا في أقرب وقت."},
    "EMERGENCY": {"fr": "Cette situation est dangereuse. Appelez le 190 (SAMU) ou le 198 (Protection civile).",
                  "ar": "هذا الوضع خطير. اتصل بـ 190 (الإسعاف) أو 198 (الحماية المدنية)."},
}
REFERRAL_MESSAGES = {
    "REFERRAL_AGE": {"fr": "Vous devez consulter un médecin — ne comptez pas sur cette application pour la santé de votre bébé.",
                     "ar": "يجب أن تستشير طبيبًا — لا تعتمد على هذا التطبيق في صحة طفلك الرضيع."},
    "REFERRAL_OUT_OF_SCOPE": {"fr": "Vos symptômes ne correspondent pas aux cas traités. Consultez un médecin.",
                              "ar": "أعراضك لا تتوافق مع الحالات التي يعالجها التطبيق. استشر طبيبًا."},
    "REFERRAL_FAILURE": {"fr": "Le service n'a pas pu répondre. Par sécurité, consultez un pharmacien ou un médecin.",
                         "ar": "تعذر على الخدمة الرد. للسلامة، استشر صيدليًا أو طبيبًا."},
}
UNCERTAIN_MESSAGE = {"fr": "Résultat incertain. Demandez conseil à un pharmacien.", "ar": "النتيجة غير مؤكدة. اطلب نصيحة صيدلي."}
RX_MESSAGE = {"fr": "Cela peut nécessiter un traitement que seul un médecin peut prescrire — consultez un médecin.",
              "ar": "قد يتطلب هذا علاجًا لا يصفه إلا الطبيب — استشر طبيبًا."}


class ConsultationError(Exception):
    """Maps to an SRS error code (§14)."""

    def __init__(self, code: str, status: int, message: str):
        super().__init__(message)
        self.code, self.status, self.message = code, status, message


def age_in_months(birth: str, on: date | None = None) -> int:
    born, today = date.fromisoformat(birth), on or date.today()
    months = (today.year - born.year) * 12 + (today.month - born.month)
    return months - (1 if today.day < born.day else 0)


# ----------------------------------------------------------------------------- start
def start(snap: Snapshot, profile: dict, language: str, pregnancy_reconfirmed: str | None = None) -> dict:
    """FR-13 / FR-14: create the state; under 2 years → referral without any question."""
    if pregnancy_reconfirmed:
        profile = {**profile, "pregnancy": pregnancy_reconfirmed}
    state = {
        "status": "IN_PROGRESS", "pendingStep": "NONE", "language": language,
        "dataVersion": snap.version, "dataStatus": snap.review_status, "modelVersion": MODEL_VERSION,
        "profile": profile, "ageMonths": age_in_months(profile["dateOfBirth"]),
        "answers": {}, "log": [], "asked": [], "currentQuestion": None,
        "ownWordsText": None, "pendingDanger": [], "converted": [],
        "dangerSignCodes": [], "dangerLevel": "NONE", "newDanger": [], "result": None,
    }
    if state["ageMonths"] < 24:
        _finish_referral(state, "REFERRAL_AGE")
        return state
    _advance(snap, state)
    return state


# ----------------------------------------------------------------------------- own words
def describe(snap: Snapshot, state: dict, text: str, known_names: list) -> dict:
    """FR-41 / FR-42: danger words are confirmed BEFORE any conversion (pending state, ADR-20)."""
    _require_in_progress(state)
    if not 1 <= len(text.strip()) <= 1000:
        raise ConsultationError("E-VAL-001", 400, "text must be 1–1,000 characters")
    if any(e["source"] == "BUTTON" for e in state["log"]) or state["ownWordsText"] is not None:
        raise ConsultationError("E-CONS-006", 409, "own words are only possible before the first answer")
    state["ownWordsText"] = text
    state["redactedText"] = reader.redact(text, known_names)
    signs = danger.scan_text(snap, text)
    if signs:
        state["pendingStep"] = "DANGER_CONFIRMATION"
        state["pendingDanger"] = signs
        state["currentQuestion"] = _sign(snap, signs[0]).question
        return {"pendingStep": "DANGER_CONFIRMATION",
                "dangerConfirmations": [{"dangerSignCode": s, "question": _question_view(snap, state, _sign(snap, s).question)}
                                        for s in signs]}
    return _convert(snap, state)


def _convert(snap: Snapshot, state: dict) -> dict:
    try:
        items = [i for i in reader.convert(snap, state["redactedText"]) if i["questionCode"] not in state["answers"]]
    except Exception:  # conversion failure → fall back to button questions (E-AI-004), never a referral
        items = []
    if not items:
        state["pendingStep"] = "NONE"
        _advance(snap, state)
        return {"pendingStep": "NONE", "fallback": True, "converted": [], "step": step_view(snap, state)}
    lang = state["language"]
    state["converted"] = items
    state["pendingStep"] = "CONVERTED_CONFIRMATION"
    state["currentQuestion"] = None
    return {"pendingStep": "CONVERTED_CONFIRMATION",
            "converted": [{**i, "label": _answer_label(snap, i["questionCode"], i["value"], lang)} for i in items],
            "step": step_view(snap, state)}


def confirm_converted(snap: Snapshot, state: dict, confirmed: list) -> dict:
    """API-28: confirmed items become answers; omitted items count as rejected."""
    _require_in_progress(state)
    if state["pendingStep"] != "CONVERTED_CONFIRMATION":
        raise ConsultationError("E-CONS-006", 409, "no converted answers are waiting for confirmation")
    offered = {i["questionCode"]: i["value"] for i in state["converted"]}
    unknown = [c for c in confirmed if c not in offered]
    if unknown:
        raise ConsultationError("E-VAL-001", 400, f"not in the conversion result: {unknown}")
    for code in confirmed:
        _store(state, code, offered[code], "CONVERTED_CONFIRMED")
    state["converted"], state["pendingStep"] = [], "NONE"
    return _after_answers(snap, state)


# ----------------------------------------------------------------------------- answers
def answer(snap: Snapshot, state: dict, question: str, value) -> dict:
    """FR-15 / FR-17: validate, store, danger check, then next step."""
    _require_in_progress(state)
    if state["pendingStep"] == "CONVERTED_CONFIRMATION":
        raise ConsultationError("E-CONS-006", 409, "confirm the converted answers first")
    if question != state["currentQuestion"]:
        raise ConsultationError("E-VAL-001", 400, "this is not the current question")
    value = _validate_value(snap.questions[question], value)
    _store(state, question, value, "BUTTON")
    if state["pendingStep"] == "DANGER_CONFIRMATION":
        state["pendingDanger"] = [s for s in state["pendingDanger"] if _sign(snap, s).question != question]
        _check_danger(snap, state)
        if state["pendingDanger"]:
            state["currentQuestion"] = _sign(snap, state["pendingDanger"][0]).question
            return step_view(snap, state)
        state["pendingStep"] = "NONE"
        result = _convert(snap, state)  # every matched sign answered → now convert the text
        return result["step"]
    return _after_answers(snap, state)


def undo(snap: Snapshot, state: dict) -> dict:
    """API-29 (RV-35): remove the last button answer; danger signs already found stay."""
    _require_in_progress(state)
    if state["pendingStep"] != "NONE":
        raise ConsultationError("E-CONS-006", 409, "a confirmation is pending")
    buttons = [e for e in state["log"] if e["source"] == "BUTTON"]
    if not buttons:
        raise ConsultationError("E-VAL-001", 400, "nothing to undo")
    last = buttons[-1]
    state["log"].remove(last)
    state["answers"].pop(last["questionCode"], None)
    state["currentQuestion"] = last["questionCode"]
    state["newDanger"] = []
    return step_view(snap, state)


def acknowledge(state: dict) -> None:
    if state["status"] != "AWAITING_ACK":
        raise ConsultationError("E-CONS-005", 409, "nothing to acknowledge")
    state["status"] = "COMPLETED"


# ----------------------------------------------------------------------------- internals
def _require_in_progress(state: dict) -> None:
    if state["status"] != "IN_PROGRESS":
        raise ConsultationError("E-CONS-005", 409, "this consultation is finished")


def _sign(snap: Snapshot, code: str):
    return next(d for d in snap.danger_signs if d.code == code)


def _validate_value(question, value):
    if question.answer_type == "YES_NO_UNSURE":
        if value not in (YES, NO, UNSURE):
            raise ConsultationError("E-VAL-001", 400, "answer must be YES, NO or UNSURE")
        return value
    try:
        number = float(value)
    except (TypeError, ValueError):
        raise ConsultationError("E-VAL-001", 400, "a number is expected") from None
    if (question.min is not None and number < question.min) or (question.max is not None and number > question.max):
        raise ConsultationError("E-VAL-002", 400, "value out of range")
    return int(number) if number.is_integer() else number


def _store(state: dict, question: str, value, source: str) -> None:
    state["answers"][question] = value
    state["log"].append({"seq": len(state["log"]) + 1, "questionCode": question, "value": value, "source": source})
    if question not in state["asked"]:
        state["asked"].append(question)


def _check_danger(snap: Snapshot, state: dict) -> None:
    """FR-17 / FR-18: new signs raise the persistent notice; the level never goes down."""
    found = danger.check_answers(snap, state["answers"])
    new = [c for c in found if c not in state["dangerSignCodes"]]
    state["dangerSignCodes"] += new
    state["dangerLevel"] = danger.highest_level(snap, state["dangerSignCodes"], state["dangerLevel"])
    state["newDanger"] = new


def _after_answers(snap: Snapshot, state: dict) -> dict:
    _check_danger(snap, state)
    _advance(snap, state)
    return step_view(snap, state)


def _advance(snap: Snapshot, state: dict) -> None:
    try:
        decision = classifier.next_step(snap, state["answers"], set(state["asked"]))
        if decision["action"] == "ASK":
            state["currentQuestion"] = decision["question"]
            return
        state["stopReason"] = decision["stopReason"]
        _finish(snap, state)
    except ConsultationError:
        raise
    except Exception:  # NFR-17: any component failure → referral, never a partial recommendation
        _finish_referral(state, "REFERRAL_FAILURE")


def _finish(snap: Snapshot, state: dict) -> None:
    result = classifier.classify(snap, state["answers"])
    lang, profile, age = state["language"], state["profile"], state["ageMonths"]
    if result["outOfScope"]:
        return _finish_referral(state, "REFERRAL_OUT_OF_SCOPE", result)
    if result["confidence"] < snap.setting("uncertainThreshold"):
        group = classifier.still_likely(result["probabilities"], snap.setting("stillLikelyMass"))
        result_type = "UNCERTAIN"
    else:
        group = [result["illness"]]
        result_type = "ILLNESS"
    if any(rules.outside_limits(snap, ill, age, profile["sex"]) for ill in group):  # FR-46
        return _finish_referral(state, "REFERRAL_OUT_OF_SCOPE", result)
    recommendation = rules.recommend(snap, group, profile, age, state["answers"], lang)
    state["result"] = {"resultType": result_type, "classification": result, "group": group,
                       "recommendation": recommendation}
    state["status"], state["currentQuestion"] = "COMPLETED", None


def _finish_referral(state: dict, result_type: str, classification: dict | None = None) -> None:
    state["result"] = {"resultType": result_type, "classification": classification, "group": [],
                       "recommendation": None}
    state["status"], state["currentQuestion"] = "AWAITING_ACK", None


def _answer_label(snap: Snapshot, question: str, value, lang: str) -> str:
    label = snap.questions[question].label[lang]
    words = {YES: {"fr": "oui", "ar": "نعم"}, NO: {"fr": "non", "ar": "لا"}, UNSURE: {"fr": "je ne sais pas", "ar": "لا أعرف"}}
    shown = words[value][lang] if value in words else value
    return f"{label} : {shown}" if lang == "fr" else f"{label}: {shown}"


def _question_view(snap: Snapshot, state: dict, code: str) -> dict:
    q = snap.questions[code]
    lang = state["language"]
    return {"code": q.code, "text": q.text[lang], "answerType": q.answer_type, "min": q.min, "max": q.max,
            "unit": q.unit, "important": state["pendingStep"] == "DANGER_CONFIRMATION"}


def danger_notice(state: dict) -> dict | None:
    level = state["dangerLevel"]
    if level == "NONE":
        return None
    notice = {"level": level, "message": NOTICE[level][state["language"]], "signCodes": list(state["dangerSignCodes"]),
              "newSigns": list(state.get("newDanger", []))}
    if level == "EMERGENCY":
        notice["emergencyNumbers"] = [190, 198]
    return notice


def step_view(snap: Snapshot, state: dict) -> dict:
    """What the app shows next (API-16/17/18 `step`)."""
    view = {"status": state["status"], "pendingStep": state["pendingStep"], "dangerNotice": danger_notice(state)}
    if state["status"] != "IN_PROGRESS":
        view["type"] = "RESULT"
    elif state["pendingStep"] == "CONVERTED_CONFIRMATION":
        lang = state["language"]
        view["type"] = "CONFIRM_CONVERTED"
        view["converted"] = [{**i, "label": _answer_label(snap, i["questionCode"], i["value"], lang)} for i in state["converted"]]
    else:
        view["type"] = "QUESTION"
        view["question"] = _question_view(snap, state, state["currentQuestion"])
        view["index"] = len(state["log"]) + 1
        view["canUndo"] = state["pendingStep"] == "NONE" and any(e["source"] == "BUTTON" for e in state["log"])
        view["canDescribe"] = state["ownWordsText"] is None and not state["log"]
    return view


def result_view(snap: Snapshot, state: dict) -> dict:
    """API-19: what was decided, in the user's language; remedies before medicines (FR-45)."""
    lang = state["language"]
    res = state["result"]
    out = {"resultType": res["resultType"], "dangerNotice": danger_notice(state), "disclaimer": DISCLAIMER[lang],
           "dataStatus": state["dataStatus"], "dataVersion": state["dataVersion"],
           "remedies": [], "medicines": [], "exclusions": []}
    cls = res.get("classification")
    if res["resultType"] in ("ILLNESS", "UNCERTAIN"):
        top = res["group"][0]
        rec = res["recommendation"]
        out.update({
            "illness": {"code": top, "label": snap.illnesses[top].label[lang]},
            "stillLikely": [{"code": c, "label": snap.illnesses[c].label[lang]} for c in res["group"]],
            "confidence": cls["confidence"],
            "reasons": [_answer_label(snap, q, state["answers"][q], lang) for q in cls["reasons"]],
            "remedies": rec["remedies"], "medicines": rec["medicines"], "exclusions": rec["exclusions"],
            "noSafeMedicine": rec["noSafeMedicine"], "followUp": rec["followUp"],
            "prescriptionMayBeNeeded": rec["prescriptionMayBeNeeded"],
            "uncheckedProfileItems": rec["uncheckedProfileItems"],
            "weightUncertainUsed": rec["weightUncertainUsed"],
        })
        if rec["prescriptionMayBeNeeded"]:
            out["prescriptionMessage"] = RX_MESSAGE[lang]
        if res["resultType"] == "UNCERTAIN":
            out["message"] = UNCERTAIN_MESSAGE[lang]
    else:
        out["message"] = REFERRAL_MESSAGES[res["resultType"]][lang]
        if cls and not cls["outOfScope"] and res["resultType"] == "REFERRAL_OUT_OF_SCOPE":
            out["outsideLimits"] = True
    return out
