"""Own-words text reader (SRS FR-41, AI-CAP-00) — MVP stand-in.

The design's text reader is a fine-tuned multilingual encoder (ADR-04), chosen by a bake-off
that has not run yet (OQ-07). Until then this **rule-based keyword reader** (the "rule-based
baseline" of AI-06) fills the same interface: text in, yes/no labels for question-bank
questions out, each one confirmed by the user before use. It can only output codes of the
active question bank; it never names a medicine, dose or remedy.
"""
from __future__ import annotations

import csv
import re

from app.clinical import BUNDLE_DIR, NO, YES, Snapshot
from app.engine.danger import normalise

_NEGATIONS = ("pas de ", "pas d'", "sans ", "aucun", "aucune", "ni ", "لا ", "ليس ", "بدون ", "ما عنديش", "ماعنديش", "مافماش")
_ARABIC_DIGITS = str.maketrans("٠١٢٣٤٥٦٧٨٩", "0123456789")
_EMAIL = re.compile(r"\S+@\S+")
_PHONE = re.compile(r"(?:\+?216[\s.-]?)?\b\d{2}[\s.-]?\d{3}[\s.-]?\d{3}\b")


def _keywords(snap: Snapshot) -> list:
    path = BUNDLE_DIR / snap.version / "reader_keywords.csv"
    with path.open(encoding="utf-8", newline="") as handle:
        return [(r["questionCode"], normalise(r["keyword"])) for r in csv.DictReader(handle)
                if r["questionCode"] in snap.questions]


def redact(text: str, known_names: list) -> str:
    """Remove emails, phone numbers and the names in the user's profiles (FR-41 step 2, best effort)."""
    text = _EMAIL.sub("[…]", text)
    text = _PHONE.sub("[…]", text)
    for name in known_names:
        for part in (name or "").split():
            if len(part) >= 3:
                text = re.sub(re.escape(part), "[…]", text, flags=re.IGNORECASE)
    return text


_FR_NE = re.compile(r"(?:^|\s)(?:ne\s|n')")


def _negated(clause: str, position: int) -> bool:
    """Negation just before the keyword: "pas de fièvre", "je ne tousse pas", "ما عنديش سخانة"."""
    before = clause[max(0, position - 25):position]
    return any(neg in before for neg in _NEGATIONS) or bool(_FR_NE.search(before))


def read_numbers(text: str) -> dict:
    """Deterministic number reader: symptom duration in days (FR-41 step 3b)."""
    norm = normalise(text).translate(_ARABIC_DIGITS)
    match = re.search(r"(\d{1,2})\s*(jours?|jrs?|يوم|ايام|أيام)", norm)
    if match:
        return {"Q_DURATION_DAYS": int(match.group(1))}
    if re.search(r"depuis hier|من البارح|منذ الأمس|من امس", norm):
        return {"Q_DURATION_DAYS": 1}
    return {}


def convert(snap: Snapshot, text: str) -> list:
    """Labels for bank questions found in the text: [{"questionCode", "value"}], first match wins."""
    norm = normalise(text)
    clauses = re.split(r"[.,;!?؟،]| mais | et | و", norm)
    found: dict = {}
    for code, keyword in _keywords(snap):
        if code in found:
            continue
        for clause in clauses:
            position = clause.find(keyword)
            if position >= 0:
                found[code] = NO if _negated(clause, position) else YES
                break
    found.update({k: v for k, v in read_numbers(text).items() if k in snap.questions})
    return [{"questionCode": q, "value": v} for q, v in found.items()]
