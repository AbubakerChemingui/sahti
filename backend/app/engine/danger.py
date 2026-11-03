"""Deterministic danger detection (SRS FR-17, FR-18, FR-42, AI-09). No AI involved."""
from __future__ import annotations

import re
import unicodedata

from app.clinical import Snapshot

LEVEL_ORDER = {"NONE": 0, "URGENT": 1, "EMERGENCY": 2}


def check_answers(snap: Snapshot, answers: dict) -> list:
    """Codes of every danger sign whose rule matches the answers (OR across rules)."""
    return [d.code for d in snap.danger_signs if d.matches(answers)]


def highest_level(snap: Snapshot, codes: list, current: str = "NONE") -> str:
    """Highest level among `codes` and `current` — a danger level only ever goes up."""
    level = current
    for d in snap.danger_signs:
        if d.code in codes and LEVEL_ORDER[d.level] > LEVEL_ORDER[level]:
            level = d.level
    return level


def normalise(text: str) -> str:
    """Lower case, strip accents and Arabic diacritics, unify Arabic letter variants (FR-42)."""
    text = unicodedata.normalize("NFKD", text.lower())
    text = "".join(c for c in text if not unicodedata.combining(c))
    for variants, plain in (("أإآ", "ا"), ("ى", "ي"), ("ة", "ه")):
        for v in variants:
            text = text.replace(v, plain)
    text = text.replace("’", "'")
    return re.sub(r"\s+", " ", text)


def scan_text(snap: Snapshot, text: str) -> list:
    """Danger signs whose lexicon phrase appears in the raw own-words text."""
    norm = normalise(text)
    found = []
    for code, _language, phrase in snap.danger_terms:
        if normalise(phrase) in norm and code not in found:
            found.append(code)
    return found
