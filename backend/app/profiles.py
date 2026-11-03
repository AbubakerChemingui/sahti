"""Profile validation (SRS FR-08 – FR-12, FR-44, §8.5) and conversion to the rules engine's view."""
from __future__ import annotations

import re
from datetime import date

from app.clinical import Snapshot
from app.engine.consultation import ConsultationError, age_in_months

_NAME = re.compile(r"^[A-Za-zÀ-ÿ؀-ۿ' -]{2,80}$")
LIST_KINDS = {"allergies": "ALLERGY", "conditions": "CONDITION", "medications": "MEDICATION"}


def _bad(field: str, issue: str, code: str = "E-VAL-001") -> ConsultationError:
    err = ConsultationError(code, 400, f"{field}: {issue}")
    err.details = [{"field": field, "issue": issue}]
    return err


def _choice(body: dict, field: str, options: tuple, required: bool = True):
    value = body.get(field)
    if value is None and not required:
        return None
    if value not in options:
        raise _bad(field, f"must be one of {', '.join(options)}")
    return value


def validate(body: dict, snap: Snapshot, relation: str | None = None) -> dict:
    """Return the cleaned profile (API field names) or raise E-VAL-001 / E-VAL-002."""
    relation = relation or _choice(body, "relation", ("SELF", "CHILD"))
    name = str(body.get("fullName", "")).strip()
    if not _NAME.match(name):
        raise _bad("fullName", "2–80 letters, spaces, hyphens or apostrophes")
    try:
        born = date.fromisoformat(str(body.get("dateOfBirth")))
    except ValueError:
        raise _bad("dateOfBirth", "use YYYY-MM-DD") from None
    if born > date.today():
        raise _bad("dateOfBirth", "cannot be in the future", "E-VAL-002")
    years = age_in_months(born.isoformat()) // 12
    if relation == "SELF" and not 18 <= years <= 120:
        raise _bad("dateOfBirth", "your own profile must be 18–120 years old", "E-VAL-002")
    if relation == "CHILD" and years >= 18:
        raise _bad("dateOfBirth", "a child profile must be under 18", "E-VAL-002")
    sex = _choice(body, "sex", ("F", "M"))

    try:
        weight = float(body.get("weightKg"))
    except (TypeError, ValueError):
        raise _bad("weightKg", "a number is required (FR-09)") from None
    low, high = (8, 150) if relation == "CHILD" else (30, 300)  # §8.5 defaults (OQ-14)
    if not low <= weight <= high:
        raise _bad("weightKg", f"must be {low}–{high} kg", "E-VAL-002")
    height = body.get("heightCm")
    if height not in (None, ""):
        try:
            height = float(height)
        except (TypeError, ValueError):
            raise _bad("heightCm", "must be a number") from None
        low, high = (50, 200) if relation == "CHILD" else (120, 230)
        if not low <= height <= high:
            raise _bad("heightCm", f"must be {low}–{high} cm", "E-VAL-002")
    else:
        height = None

    clean = {
        "relation": relation, "fullName": name, "dateOfBirth": born.isoformat(), "sex": sex,
        "weightKg": weight, "weightUncertain": bool(body.get("weightUncertain", False)), "heightCm": height,
        "smokingStatus": _choice(body, "smokingStatus", ("NEVER", "FORMER", "CURRENT")),
        "alcoholUse": _choice(body, "alcoholUse", ("NONE", "OCCASIONAL", "REGULAR")),
    }
    if sex == "F" and 12 <= years <= 55:  # FR-12: required iff F and 12–55
        clean["pregnancyStatus"] = _choice(body, "pregnancyStatus", ("YES", "NO", "NOT_SURE"))
        clean["breastfeedingStatus"] = _choice(body, "breastfeedingStatus", ("YES", "NO", "NOT_SURE"))

    for field, kind in LIST_KINDS.items():
        items = body.get(field) or []
        if not isinstance(items, list) or len(items) > 30:
            raise _bad(field, "must be a list of at most 30 items")
        cleaned = []
        for item in items:
            code, text = (item or {}).get("termCode"), str((item or {}).get("freeText") or "").strip()
            if bool(code) == bool(text):
                raise _bad(field, "each item needs exactly one of termCode or freeText")
            if code:
                term = snap.terms.get(code)
                if term is None or term.kind != kind:
                    raise _bad(field, f"unknown {kind.lower()} code {code}")
                cleaned.append({"termCode": code})
            else:
                if len(text) > 100:
                    raise _bad(field, "free text must be 1–100 characters")
                cleaned.append({"freeText": text})
        none_flag = bool(body.get(field + "None", False))
        if none_flag and cleaned:
            raise _bad(field + "None", "cannot be true when items are listed")
        clean[field], clean[field + "None"] = cleaned, none_flag
    return clean


def for_engine(profile: dict) -> dict:
    """The rules engine's view: coded facts only, no name."""
    items = [{"kind": kind, **item} for field, kind in LIST_KINDS.items() for item in profile.get(field, [])]
    return {
        "dateOfBirth": profile["dateOfBirth"], "sex": profile["sex"], "weightKg": profile["weightKg"],
        "weightUncertain": profile.get("weightUncertain", False),
        "smoking": profile.get("smokingStatus"),
        "alcohol": profile.get("alcoholUse"),
        "pregnancy": profile.get("pregnancyStatus"),
        "breastfeeding": profile.get("breastfeedingStatus"),
        "items": items,
    }


def summary(profile_id: str, profile: dict, snap: Snapshot) -> dict:
    """Card view for the home screen."""
    months = age_in_months(profile["dateOfBirth"])
    return {"profileId": profile_id, "relation": profile["relation"], "fullName": profile["fullName"],
            "ageYears": months // 12, "ageMonths": months, "sex": profile["sex"],
            "eligible": months >= 24,
            "uncodedItems": sum(1 for f in LIST_KINDS for i in profile.get(f, []) if "freeText" in i),
            "needsPregnancyCheck": "pregnancyStatus" in profile,
            "isChild": profile["relation"] == "CHILD"}
