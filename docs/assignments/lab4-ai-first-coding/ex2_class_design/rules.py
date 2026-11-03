"""Lab 4 — Exercise 2: Factory pattern + data model (Sahti domain).

A clinical data file (CSV) contains one safety rule per row, e.g.

    code,medicine_code,target_type,target_value,reason
    R1,MED-IBU,ALLERGY_GROUP,NSAID,Allergy to anti-inflammatory medicines
    R2,MED-IBU,AGE_BELOW_MONTHS,72,Not for children under 6 years
    R3,MED-PSE,CONDITION,HYPERTENSION,Not with high blood pressure
    R4,MED-IBU,PREGNANT,,Not during pregnancy

`RuleFactory.create()` turns one row into the right rule object based on the
`target_type` string. Every rule answers the same question:
"does this rule block this medicine for this patient?"

Python 3.9+, standard library only.
"""
from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Callable


# ---------------------------------------------------------------------------
# Data model: the patient the rules are checked against
# ---------------------------------------------------------------------------
PREGNANCY_VALUES = ("YES", "NO", "NOT_SURE")


@dataclass(frozen=True)
class Patient:
    """Health facts of one patient, as used by the safety rules.

    Raises ValueError on invalid data (negative age, unknown pregnancy value).
    """

    age_months: int
    allergy_groups: frozenset[str] = field(default_factory=frozenset)
    conditions: frozenset[str] = field(default_factory=frozenset)
    pregnancy: str = "NO"

    def __post_init__(self) -> None:
        if isinstance(self.age_months, bool) or not isinstance(self.age_months, int):
            raise ValueError("age_months must be an integer")
        if self.age_months < 0:
            raise ValueError("age_months cannot be negative")
        if self.pregnancy not in PREGNANCY_VALUES:
            raise ValueError(f"pregnancy must be one of {PREGNANCY_VALUES}")
        # Accept any iterable but store immutable, upper-case sets.
        object.__setattr__(self, "allergy_groups", frozenset(g.upper() for g in self.allergy_groups))
        object.__setattr__(self, "conditions", frozenset(c.upper() for c in self.conditions))


# ---------------------------------------------------------------------------
# Products: the rule classes (shared base + type-specific attributes)
# ---------------------------------------------------------------------------
@dataclass(frozen=True)
class SafetyRule(ABC):
    """Shared attributes of every rule: which medicine, and why it is blocked."""

    code: str
    medicine_code: str
    reason: str

    def __post_init__(self) -> None:
        for name in ("code", "medicine_code", "reason"):
            if not str(getattr(self, name)).strip():
                raise ValueError(f"{name} must not be empty")

    @abstractmethod
    def blocks(self, patient: Patient) -> bool:
        """True if this rule forbids the medicine for this patient."""


@dataclass(frozen=True)
class AllergyRule(SafetyRule):
    allergy_group: str = ""

    def blocks(self, patient: Patient) -> bool:
        return self.allergy_group.upper() in patient.allergy_groups


@dataclass(frozen=True)
class ConditionRule(SafetyRule):
    condition: str = ""

    def blocks(self, patient: Patient) -> bool:
        return self.condition.upper() in patient.conditions


@dataclass(frozen=True)
class MinimumAgeRule(SafetyRule):
    min_age_months: int = 0

    def blocks(self, patient: Patient) -> bool:
        return patient.age_months < self.min_age_months


@dataclass(frozen=True)
class PregnancyRule(SafetyRule):
    def blocks(self, patient: Patient) -> bool:
        # "Not sure" is treated as "yes": the safest case (Sahti FR-12).
        return patient.pregnancy in ("YES", "NOT_SURE")


# ---------------------------------------------------------------------------
# Factory
# ---------------------------------------------------------------------------
def _text_value(value: str, target_type: str) -> str:
    if not value or not value.strip():
        raise ValueError(f"{target_type} needs a target_value")
    return value.strip().upper()


def _months_value(value: str, target_type: str) -> int:
    try:
        months = int(value)
    except (TypeError, ValueError):
        raise ValueError(f"{target_type} needs a whole number of months, got {value!r}") from None
    if months < 0:
        raise ValueError(f"{target_type} cannot be negative")
    return months


class RuleFactory:
    """Creates the right SafetyRule subclass from a target_type string."""

    # target_type -> function(common fields, target_value) -> rule
    _builders: dict[str, Callable[[dict, str], SafetyRule]] = {
        "ALLERGY_GROUP": lambda common, value: AllergyRule(
            **common, allergy_group=_text_value(value, "ALLERGY_GROUP")),
        "CONDITION": lambda common, value: ConditionRule(
            **common, condition=_text_value(value, "CONDITION")),
        "AGE_BELOW_MONTHS": lambda common, value: MinimumAgeRule(
            **common, min_age_months=_months_value(value, "AGE_BELOW_MONTHS")),
        "PREGNANT": lambda common, value: PregnancyRule(**common),
    }

    @classmethod
    def create(cls, target_type: str, *, code: str, medicine_code: str,
               reason: str, target_value: str = "") -> SafetyRule:
        """Build one rule.

        Raises:
            ValueError: unknown target_type, or invalid/missing values.
        """
        builder = cls._builders.get(str(target_type).strip().upper())
        if builder is None:
            known = ", ".join(sorted(cls._builders))
            raise ValueError(f"unknown target_type {target_type!r} (known: {known})")
        common = {"code": code, "medicine_code": medicine_code, "reason": reason}
        return builder(common, target_value)

    @classmethod
    def from_row(cls, row: dict[str, str]) -> SafetyRule:
        """Build a rule from one CSV row (as read by csv.DictReader)."""
        required = ("code", "medicine_code", "target_type", "reason")
        missing = [name for name in required if name not in row]
        if missing:
            raise ValueError(f"row is missing columns: {missing}")
        return cls.create(row["target_type"], code=row["code"],
                          medicine_code=row["medicine_code"], reason=row["reason"],
                          target_value=row.get("target_value", ""))

    @classmethod
    def known_types(cls) -> list[str]:
        return sorted(cls._builders)


def blocking_reasons(medicine_code: str, rules: list[SafetyRule], patient: Patient) -> list[str]:
    """Reasons why ``medicine_code`` is blocked for ``patient`` (empty = allowed)."""
    return [r.reason for r in rules if r.medicine_code == medicine_code and r.blocks(patient)]
