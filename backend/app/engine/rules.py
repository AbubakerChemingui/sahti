"""Deterministic rules engine (SRS §6.4, FR-22, FR-24 – FR-34, FR-43, FR-45, FR-46). No AI.

Fixed order: candidates (approved OTC, linked to the illness) → safety filters (contraindications,
duplicates) → exact dose band (no calculation) → remedies with their own safety rules →
prescription-need patterns → remedies first.
"""
from __future__ import annotations

from app.clinical import DoseRule, Snapshot

_UNIT_TEXT = {
    "TABLET": ("comprimé", "comprimés", "قرص", "أقراص"),
    "ML": ("ml", "ml", "مل", "مل"),
    "SACHET": ("sachet", "sachets", "كيس", "أكياس"),
    "SPRAY": ("pulvérisation dans chaque narine", "pulvérisations dans chaque narine", "بخة في كل فتحة أنف", "بخات في كل فتحة أنف"),
}
_MOMENT_TEXT = {"MORNING": ("matin", "صباحًا"), "MIDDAY": ("midi", "ظهرًا"), "EVENING": ("soir", "مساءً"), "NIGHT": ("nuit", "ليلًا")}
_MEAL_TEXT = {"AFTER_MEAL": ("après le repas", "بعد الأكل"), "BEFORE_MEAL": ("avant le repas", "قبل الأكل"),
              "WITH_MEAL": ("pendant le repas", "مع الأكل"), "ANY": ("", "")}


def _number(value: float) -> str:
    return str(int(value)) if float(value).is_integer() else str(value)


def render_dose(rule: DoseRule, language: str) -> dict:
    """FR and AR text are rendered from the same numbers, so they can't disagree (ADR-22). Digits 0–9 in both."""
    fr_one, fr_many, ar_one, ar_many = _UNIT_TEXT[rule.unit]
    plural = rule.quantity > 1
    i = 0 if language == "fr" else 1
    unit = (fr_many if plural else fr_one) if language == "fr" else (ar_many if plural else ar_one)
    moments = [_MOMENT_TEXT[m][i] for m in rule.moments]
    meal = _MEAL_TEXT.get(rule.meal, ("", ""))[i]
    if language == "fr":
        schedule = f"{rule.times_per_day} fois par jour : " + ", ".join(moments) + (f" — {meal}" if meal else "")
        limits = f"au moins {rule.min_hours_between} h entre deux prises · {rule.max_days} jours maximum"
    else:
        schedule = f"{rule.times_per_day} مرات في اليوم: " + "، ".join(moments) + (f" — {meal}" if meal else "")
        limits = f"{rule.min_hours_between} ساعات على الأقل بين جرعتين · {rule.max_days} أيام كحد أقصى"
    return {"dose": f"{_number(rule.quantity)} {unit}", "schedule": schedule, "limits": limits}


def _profile_facts(profile: dict, snap: Snapshot) -> dict:
    """Coded facts used by the rules: allergy groups, conditions, current ingredients and classes."""
    allergy_groups, conditions, ingredients, classes, uncoded = set(), set(), set(), set(), []
    for item in profile.get("items", []):
        term = snap.terms.get(item.get("termCode") or "")
        if term is None:
            uncoded.append(item)
            continue
        if term.kind == "ALLERGY":
            allergy_groups.add(term.allergy_group)
        elif term.kind == "CONDITION":
            conditions.add(term.code)
        elif term.kind == "MEDICATION":
            ingredients.update(term.ingredients)
            classes.add(term.medicine_class)
    return {"allergy_groups": allergy_groups, "conditions": conditions, "ingredients": ingredients,
            "classes": classes, "uncoded": uncoded}


def _rule_blocks(rule, facts: dict, profile: dict, age_months: int) -> bool:
    t, v = rule.target_type, rule.target_value
    if t == "ALLERGY_GROUP":
        return v in facts["allergy_groups"]
    if t == "CONDITION":
        return v in facts["conditions"]
    if t == "MEDICINE_CLASS":
        return v in facts["classes"]
    if t == "PREGNANT":
        # "Not sure" counts as yes (FR-12)
        return profile.get("pregnancy") in ("YES", "NOT_SURE")
    if t == "BREASTFEEDING":
        return profile.get("breastfeeding") in ("YES", "NOT_SURE")
    if t == "AGE_BELOW_MONTHS":
        return age_months < int(v)
    if t == "ALCOHOL_REGULAR":
        return profile.get("alcohol") == "REGULAR"
    if t == "SMOKING_CURRENT":
        return profile.get("smoking") == "CURRENT"
    return False


def outside_limits(snap: Snapshot, illness: str, age_months: int, sex: str) -> bool:
    """FR-46: the patient is outside the age/sex limits of this illness."""
    ill = snap.illnesses[illness]
    if not ill.min_age_months <= age_months <= ill.max_age_months:
        return True
    return ill.sex != "ANY" and ill.sex != sex


def recommend(snap: Snapshot, illnesses: list, profile: dict, age_months: int, answers: dict,
              language: str) -> dict:
    """Remedies and medicines allowed for EVERY illness in `illnesses` (one illness, or the still-likely set)."""
    facts = _profile_facts(profile, snap)
    weight = float(profile["weightKg"])
    uncertain_weight = age_months < 216 and profile.get("weightUncertain")
    if uncertain_weight:  # I7-Q1: use the band of the lower weight so the dose cannot be too high
        weight -= snap.setting("uncertainWeightMarginKg")

    # A medication or allergy typed as free text can't be checked → no medicine (I6-Q2).
    blocking_uncoded = [i for i in facts["uncoded"] if i.get("kind") in ("MEDICATION", "ALLERGY")]

    candidate_codes = set(snap.illness_medicines.get(illnesses[0], []))
    for ill in illnesses[1:]:
        candidate_codes &= set(snap.illness_medicines.get(ill, []))

    medicines, exclusions = [], []
    for code in sorted(candidate_codes):
        med = snap.medicines[code]
        label = med.label[language]
        if not med.otc:
            continue
        if blocking_uncoded:
            exclusions.append({"code": code, "label": label, "reason": {
                "fr": "Un élément de votre profil n'a pas pu être vérifié.",
                "ar": "تعذر التحقق من عنصر في ملفك."}[language]})
            continue
        blocked = [r for r in snap.contraindications
                   if ((r.subject_type == "MEDICINE" and r.subject == code)
                       or (r.subject_type == "MEDICINE_CLASS" and r.subject == med.medicine_class))
                   and _rule_blocks(r, facts, profile, age_months)]
        if blocked:
            exclusions.append({"code": code, "label": label, "reason": blocked[0].reason[language]})
            continue
        if set(med.ingredients) & facts["ingredients"]:
            exclusions.append({"code": code, "label": label, "reason": {
                "fr": "Vous prenez déjà ce principe actif.", "ar": "أنت تتناول هذه المادة الفعالة بالفعل."}[language]})
            continue
        bands = [r for r in snap.dose_rules if r.medicine == code and r.matches(age_months, weight)]
        if len(bands) != 1:
            continue  # no band for this age/weight (or a data error, prevented at import) → not shown
        band = bands[0]
        medicines.append({"code": code, "label": label, **render_dose(band, language),
                          "timesPerDay": band.times_per_day, "moments": list(band.moments),
                          "meal": band.meal, "minHoursBetween": band.min_hours_between, "maxDays": band.max_days})

    remedy_codes = [c for c in snap.illness_remedies.get(illnesses[0], [])
                    if all(c in snap.illness_remedies.get(i, []) for i in illnesses[1:])]
    remedies = []
    for code in remedy_codes:
        rem = snap.remedies[code]
        blocked = [r for r in snap.remedy_rules if r.subject == code and _rule_blocks(r, facts, profile, age_months)]
        if blocked:
            exclusions.append({"code": code, "label": rem.label[language], "reason": blocked[0].reason[language]})
            continue
        remedies.append({"code": code, "label": rem.label[language], "instructions": rem.instructions[language]})

    prescription = any(ill == p_ill and all(answers.get(q) == v for q, v in cond.items())
                       for _, p_ill, cond in snap.prescription_patterns for ill in illnesses)
    days = min([m["maxDays"] for m in medicines] or [min(snap.illnesses[i].follow_up_days for i in illnesses)])
    follow_up = {"fr": f"Si cela ne va pas mieux après {days} jours, ou si cela s'aggrave, consultez un médecin.",
                 "ar": f"إذا لم تتحسن بعد {days} أيام، أو إذا ساءت الحالة، استشر طبيبًا."}[language]
    return {
        "remedies": remedies,          # remedies always come first (FR-45)
        "medicines": medicines,
        "exclusions": exclusions,
        "noSafeMedicine": not medicines,
        "prescriptionMayBeNeeded": prescription,
        "followUp": follow_up,
        "uncheckedProfileItems": [i.get("freeText") for i in facts["uncoded"]],
        "weightUncertainUsed": bool(uncertain_weight),
    }
