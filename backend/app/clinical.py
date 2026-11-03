"""Clinical data bundle: load, validate and hold one immutable version (SRS FR-39, §8.7).

All medical content lives in CSV files under ``backend/clinical_data/<bundle>/`` —
nothing medical is hard-coded (AI_CONTEXT §5). The MVP ships one DRAFT demo bundle.
"""
from __future__ import annotations

import csv
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional

BUNDLE_DIR = Path(__file__).resolve().parent.parent / "clinical_data"
DEFAULT_BUNDLE = "demo_v1"
OUT_OF_SCOPE = "OUT_OF_SCOPE"
YES, NO, UNSURE = "YES", "NO", "UNSURE"


class BundleError(ValueError):
    """The bundle is invalid (SRS E-DATA-001)."""


@dataclass(frozen=True)
class Question:
    code: str
    text: dict  # {"fr": ..., "ar": ...}
    label: dict
    answer_type: str  # YES_NO_UNSURE | NUMBER
    min: Optional[float] = None
    max: Optional[float] = None
    unit: str = ""


@dataclass(frozen=True)
class Illness:
    code: str
    label: dict
    min_age_months: int
    max_age_months: int
    sex: str  # ANY | F | M
    follow_up_days: int


@dataclass(frozen=True)
class DangerSign:
    code: str
    level: str  # EMERGENCY | URGENT
    question: str
    operator: str  # IN | GT
    value: str
    message: dict

    def matches(self, answers: dict) -> bool:
        if self.question not in answers:
            return False
        given = answers[self.question]
        if self.operator == "IN":
            return str(given) in self.value.split("|")
        if self.operator == "GT":
            try:
                return float(given) > float(self.value)
            except (TypeError, ValueError):
                return False
        return False


@dataclass(frozen=True)
class Medicine:
    code: str
    label: dict
    ingredients: tuple
    medicine_class: str
    form: str
    otc: bool


@dataclass(frozen=True)
class DoseRule:
    medicine: str
    min_age_months: int
    max_age_months: int
    min_weight: float
    max_weight: float
    quantity: float
    unit: str
    times_per_day: int
    moments: tuple
    meal: str
    min_hours_between: int
    max_days: int

    def matches(self, age_months: int, weight: float) -> bool:
        return (self.min_age_months <= age_months <= self.max_age_months
                and self.min_weight <= weight <= self.max_weight)


@dataclass(frozen=True)
class Rule:
    """A contraindication or remedy rule; the action is always BLOCK."""
    code: str
    subject_type: str  # MEDICINE | MEDICINE_CLASS | REMEDY
    subject: str
    target_type: str
    target_value: str
    reason: dict


@dataclass(frozen=True)
class Remedy:
    code: str
    label: dict
    instructions: dict


@dataclass(frozen=True)
class Term:
    code: str
    kind: str
    label: dict
    allergy_group: str
    ingredients: tuple
    medicine_class: str
    synonyms: tuple


@dataclass
class Snapshot:
    """Read-only view of one clinical data version."""
    version: str
    review_status: str
    settings: dict
    illnesses: dict = field(default_factory=dict)
    questions: dict = field(default_factory=dict)
    likelihoods: dict = field(default_factory=dict)  # question -> {class: P(YES)}
    screening: dict = field(default_factory=dict)    # illness or ALL -> [question codes]
    danger_signs: list = field(default_factory=list)
    danger_terms: list = field(default_factory=list)  # (sign code, language, phrase)
    terms: dict = field(default_factory=dict)
    medicines: dict = field(default_factory=dict)
    illness_medicines: dict = field(default_factory=dict)
    dose_rules: list = field(default_factory=list)
    contraindications: list = field(default_factory=list)
    remedies: dict = field(default_factory=dict)
    illness_remedies: dict = field(default_factory=dict)
    remedy_rules: list = field(default_factory=list)
    prescription_patterns: list = field(default_factory=list)  # (code, illness, {q: value})

    @property
    def classes(self) -> list:
        return list(self.illnesses) + [OUT_OF_SCOPE]

    def setting(self, key: str) -> float:
        return float(self.settings[key])


def _read(folder: Path, name: str) -> list:
    path = folder / name
    if not path.exists():
        raise BundleError(f"missing file {name}")
    with path.open(encoding="utf-8", newline="") as handle:
        return list(csv.DictReader(handle))


def _fr_ar(row: dict, prefix: str) -> dict:
    fr, ar = row.get(prefix + "Fr", "").strip(), row.get(prefix + "Ar", "").strip()
    if not fr or not ar:
        raise BundleError(f"{row.get('code', row)}: {prefix} must exist in French and Arabic")
    return {"fr": fr, "ar": ar}


def _split(value: str) -> tuple:
    return tuple(v.strip().lower() for v in (value or "").split("|") if v.strip())


def load_bundle(name: str = DEFAULT_BUNDLE) -> Snapshot:
    """Load and validate a bundle; raise BundleError on the first problem found."""
    folder = BUNDLE_DIR / name
    manifest = _read(folder, "manifest.csv")[0]
    status = manifest["reviewStatus"].strip()
    if status not in ("DRAFT", "VALIDATED"):
        raise BundleError("reviewStatus must be DRAFT or VALIDATED")
    if status == "VALIDATED" and not manifest.get("reviewerName", "").strip():
        raise BundleError("a VALIDATED bundle needs a reviewer name (§8.7 rule 8)")
    snap = Snapshot(version=name, review_status=status,
                    settings={r["key"]: r["value"] for r in _read(folder, "settings.csv")})

    for r in _read(folder, "illnesses.csv"):
        snap.illnesses[r["code"]] = Illness(r["code"], _fr_ar(r, "label"), int(r["minAgeMonths"]),
                                            int(r["maxAgeMonths"]), r["sexRestriction"], int(r["followUpDays"]))
    for r in _read(folder, "questions.csv"):
        snap.questions[r["code"]] = Question(
            r["code"], _fr_ar(r, "text"), _fr_ar(r, "label"), r["answerType"],
            float(r["min"]) if r["min"] else None, float(r["max"]) if r["max"] else None, r["unit"])
    for r in _read(folder, "symptom_likelihoods.csv"):
        q = r.pop("questionCode")
        if q not in snap.questions:
            raise BundleError(f"likelihood for unknown question {q}")
        probs = {c: float(v) for c, v in r.items()}
        if set(probs) != set(snap.classes):
            raise BundleError(f"likelihood row {q} must cover every illness and {OUT_OF_SCOPE}")
        if not all(0 < p < 1 for p in probs.values()):
            raise BundleError(f"likelihoods of {q} must be strictly between 0 and 1")
        snap.likelihoods[q] = probs
    for r in sorted(_read(folder, "screening_questions.csv"), key=lambda x: int(x["order"])):
        if r["questionCode"] not in snap.questions:
            raise BundleError(f"screening question {r['questionCode']} unknown")
        snap.screening.setdefault(r["illnessCode"], []).append(r["questionCode"])
    for r in _read(folder, "danger_signs.csv"):
        if r["questionCode"] not in snap.questions:
            raise BundleError(f"danger sign {r['code']} uses unknown question")
        snap.danger_signs.append(DangerSign(r["code"], r["level"], r["questionCode"], r["operator"],
                                            r["value"], _fr_ar(r, "message")))
    sign_codes = {d.code for d in snap.danger_signs}
    for r in _read(folder, "danger_terms.csv"):
        if r["dangerSignCode"] not in sign_codes:
            raise BundleError(f"danger term for unknown sign {r['dangerSignCode']}")
        snap.danger_terms.append((r["dangerSignCode"], r["language"], r["phrase"].strip()))
    for r in _read(folder, "terms.csv"):
        snap.terms[r["code"]] = Term(r["code"], r["kind"], _fr_ar(r, "label"), r["allergyGroup"],
                                     _split(r["activeIngredients"]), r["medicineClass"], _split(r["synonyms"]))
    for r in _read(folder, "medicines.csv"):
        if not r.get("source", "").strip():
            raise BundleError(f"medicine {r['code']} has no source")
        snap.medicines[r["code"]] = Medicine(r["code"], _fr_ar(r, "label"), _split(r["activeIngredients"]),
                                             r["medicineClass"], r["form"], r["otc"] == "true")
    for r in _read(folder, "illness_medicines.csv"):
        med = snap.medicines.get(r["medicineCode"])
        if med is None or r["illness"] not in snap.illnesses:
            raise BundleError(f"bad illness-medicine link {r}")
        if not med.otc:
            raise BundleError(f"{med.code} is not OTC and cannot be linked to an illness (FR-25)")
        snap.illness_medicines.setdefault(r["illness"], []).append(med.code)
    for r in _read(folder, "dose_rules.csv"):
        if r["medicineCode"] not in snap.medicines or not r.get("source", "").strip():
            raise BundleError(f"dose rule for {r['medicineCode']} is invalid")
        rule = DoseRule(r["medicineCode"], int(r["minAgeMonths"]), int(r["maxAgeMonths"]),
                        float(r["minWeightKg"]), float(r["maxWeightKg"]), float(r["doseQuantity"]),
                        r["doseUnit"], int(r["timesPerDay"]), tuple(r["moments"].split("|")),
                        r["mealRelation"], int(r["minHoursBetween"]), int(r["maxDays"]))
        if rule.quantity <= 0 or rule.times_per_day < 1 or rule.max_days < 1 or not rule.moments:
            raise BundleError(f"dose rule for {rule.medicine} is incomplete (§8.7 rule 5)")
        snap.dose_rules.append(rule)
    _check_no_overlap(snap.dose_rules)
    for r in _read(folder, "contraindication_rules.csv"):
        snap.contraindications.append(Rule(r["code"], r["subjectType"], r["subjectCode"], r["targetType"],
                                           r["targetValue"], _fr_ar(r, "reason")))
    for r in _read(folder, "natural_remedies.csv"):
        snap.remedies[r["code"]] = Remedy(r["code"], _fr_ar(r, "label"), _fr_ar(r, "instructions"))
    for r in _read(folder, "illness_remedies.csv"):
        if r["remedyCode"] not in snap.remedies:
            raise BundleError(f"unknown remedy {r['remedyCode']}")
        snap.illness_remedies.setdefault(r["illness"], []).append(r["remedyCode"])
    for r in _read(folder, "remedy_rules.csv"):
        snap.remedy_rules.append(Rule(r["code"], r["subjectType"], r["subjectCode"], r["targetType"],
                                      r["targetValue"], _fr_ar(r, "reason")))
    for r in _read(folder, "prescription_patterns.csv"):
        conditions = dict(part.split("=") for part in r["conditions"].split("&"))
        snap.prescription_patterns.append((r["code"], r["illnessCode"], conditions))

    _check_screening(snap)
    return snap


def _check_no_overlap(rules: list) -> None:
    for i, a in enumerate(rules):
        for b in rules[i + 1:]:
            if (a.medicine == b.medicine
                    and a.min_age_months <= b.max_age_months and b.min_age_months <= a.max_age_months
                    and a.min_weight <= b.max_weight and b.min_weight <= a.max_weight):
                raise BundleError(f"overlapping dose bands for {a.medicine} (§8.7 rule 5)")


def _check_screening(snap: Snapshot) -> None:
    """§8.7 rule 9: general screening exists, every illness has screening, each is used by a danger sign."""
    if not snap.screening.get("ALL"):
        raise BundleError("at least one general (ALL) screening question is required")
    used = {d.question for d in snap.danger_signs}
    for illness in snap.illnesses:
        if not snap.screening.get(illness):
            raise BundleError(f"illness {illness} has no screening question (FR-47)")
    for questions in snap.screening.values():
        for q in questions:
            if q not in used:
                raise BundleError(f"screening question {q} is not used by any danger sign")
