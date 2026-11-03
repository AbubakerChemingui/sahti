"""Safety suite for the consultation engine (SRS §16.2). No network, no outside AI.

Each test names the requirement it protects. The data is the DRAFT demo bundle.
"""
from datetime import date

import pytest

from app.clinical import load_bundle
from app.engine import classifier, consultation as cons, danger, rules
from app.engine.consultation import ConsultationError

SNAP = load_bundle("demo_v1")
SYMPTOMS = {
    "COLD": {"Q_RUNNY_NOSE", "Q_SNEEZING", "Q_COUGH", "Q_SORE_THROAT"},
    "SORE_THROAT": {"Q_SORE_THROAT", "Q_PAIN_SWALLOWING", "Q_FEVER"},
    "TENSION_HEADACHE": {"Q_HEADACHE", "Q_HEAD_BAND"},
    "DIARRHOEA": {"Q_LOOSE_STOOLS", "Q_STOMACH_CRAMPS"},
    "HEARTBURN": {"Q_BURNING_AFTER_MEALS", "Q_SOUR_TASTE"},
}


def born(years: int, months: int = 0) -> str:
    today = date.today()
    total = today.year * 12 + today.month - 1 - years * 12 - months
    return date(total // 12, total % 12 + 1, 1).isoformat()


def profile(years=30, sex="M", weight=70, **extra):
    base = {"dateOfBirth": born(years), "sex": sex, "weightKg": weight, "weightUncertain": False,
            "smoking": "NEVER", "alcohol": "NONE", "pregnancy": None, "breastfeeding": None, "items": []}
    return {**base, **extra}


def run(state, yes=(), duration=3, special=None):
    """Answer every question: YES for `yes`, NO otherwise; `special` overrides single answers."""
    special = special or {}
    while state["status"] == "IN_PROGRESS" and state["pendingStep"] == "NONE":
        q = state["currentQuestion"]
        value = special.get(q, duration if q == "Q_DURATION_DAYS" else ("YES" if q in yes else "NO"))
        cons.answer(SNAP, state, q, value)
    return state


# ----------------------------------------------------------------------------- classification paths
@pytest.mark.parametrize("illness", sorted(SYMPTOMS))
def test_each_demo_illness_is_reached_with_medicines_and_remedies(illness):
    state = run(cons.start(SNAP, profile(), "fr"), SYMPTOMS[illness])
    result = cons.result_view(SNAP, state)
    assert result["resultType"] == "ILLNESS"
    assert result["illness"]["code"] == illness
    assert result["remedies"] and result["medicines"]
    assert result["dataStatus"] == "DRAFT"


def test_fr45_remedies_come_before_medicines_in_the_result():
    state = run(cons.start(SNAP, profile(), "fr"), SYMPTOMS["COLD"])
    keys = list(cons.result_view(SNAP, state))
    assert keys.index("remedies") < keys.index("medicines")


def test_no_symptom_matches_gives_out_of_scope_referral_without_medicines():
    state = run(cons.start(SNAP, profile(), "fr"), yes=())
    result = cons.result_view(SNAP, state)
    assert result["resultType"] == "REFERRAL_OUT_OF_SCOPE"
    assert result["medicines"] == [] and result["remedies"] == []


def test_fr14_under_two_years_is_referred_without_any_question():
    state = cons.start(SNAP, profile(years=1, weight=10), "fr")
    assert state["status"] == "AWAITING_ACK"
    assert state["log"] == []
    assert cons.result_view(SNAP, state)["resultType"] == "REFERRAL_AGE"


def test_fr46_age_limit_gives_referral_not_a_filtered_illness():
    # Heartburn is limited to 12 years and older in the demo data.
    state = run(cons.start(SNAP, profile(years=8, weight=26), "fr"), SYMPTOMS["HEARTBURN"])
    assert cons.result_view(SNAP, state)["resultType"] == "REFERRAL_OUT_OF_SCOPE"


# ----------------------------------------------------------------------------- screening gate (FR-47)
def test_fr47_general_screening_comes_first():
    state = cons.start(SNAP, profile(), "fr")
    assert state["currentQuestion"] == "Q_BREATHING_DIFFICULTY"


@pytest.mark.parametrize("illness", sorted(SYMPTOMS))
def test_fr47_no_result_before_screening_of_the_illness(illness):
    state = run(cons.start(SNAP, profile(), "fr"), SYMPTOMS[illness])
    for q in SNAP.screening["ALL"] + SNAP.screening[illness]:
        assert q in state["answers"], f"{q} was not asked before the result"


# ----------------------------------------------------------------------------- danger notice (FR-17, FR-18, I7-Q4)
def test_emergency_notice_persists_and_consultation_continues():
    state = cons.start(SNAP, profile(), "fr")
    step = cons.answer(SNAP, state, "Q_BREATHING_DIFFICULTY", "YES")
    assert step["type"] == "QUESTION"  # continues (owner's decision I7-Q4)
    assert step["dangerNotice"]["level"] == "EMERGENCY"
    assert step["dangerNotice"]["emergencyNumbers"] == [190, 198]
    run(state, SYMPTOMS["COLD"])
    assert cons.result_view(SNAP, state)["dangerNotice"]["level"] == "EMERGENCY"


def test_unsure_counts_as_a_danger_answer():
    state = cons.start(SNAP, profile(), "fr")
    cons.answer(SNAP, state, "Q_BREATHING_DIFFICULTY", "UNSURE")
    assert state["dangerLevel"] == "EMERGENCY"


def test_urgent_notice_has_no_emergency_numbers():
    state = cons.start(SNAP, profile(), "fr")
    cons.answer(SNAP, state, "Q_BREATHING_DIFFICULTY", "NO")
    step = cons.answer(SNAP, state, "Q_DURATION_DAYS", 10)
    assert step["dangerNotice"]["level"] == "URGENT"
    assert "emergencyNumbers" not in step["dangerNotice"]


def test_danger_level_never_goes_down():
    assert danger.highest_level(SNAP, ["DS_LONG_DURATION"], "EMERGENCY") == "EMERGENCY"


def test_undo_keeps_the_danger_notice():
    state = cons.start(SNAP, profile(), "fr")
    cons.answer(SNAP, state, "Q_BREATHING_DIFFICULTY", "YES")
    step = cons.undo(SNAP, state)
    assert step["question"]["code"] == "Q_BREATHING_DIFFICULTY"
    assert state["dangerLevel"] == "EMERGENCY"
    assert step["dangerNotice"]["level"] == "EMERGENCY"


# ----------------------------------------------------------------------------- own words (FR-41, FR-42)
def test_own_words_are_only_used_after_confirmation():
    state = cons.start(SNAP, profile(), "fr")
    out = cons.describe(SNAP, state, "J'ai le nez qui coule et j'éternue depuis 2 jours", [])
    assert out["pendingStep"] == "CONVERTED_CONFIRMATION"
    assert state["answers"] == {}
    with pytest.raises(ConsultationError) as err:
        cons.answer(SNAP, state, "Q_BREATHING_DIFFICULTY", "NO")
    assert err.value.code == "E-CONS-006"
    cons.confirm_converted(SNAP, state, ["Q_RUNNY_NOSE"])  # the others are omitted → rejected
    assert state["answers"] == {"Q_RUNNY_NOSE": "YES"}
    assert state["log"][0]["source"] == "CONVERTED_CONFIRMED"


def test_danger_words_are_confirmed_before_any_conversion():
    state = cons.start(SNAP, profile(), "ar")
    out = cons.describe(SNAP, state, "ما نجمش نتنفس و عندي سخانة", [])
    assert out["pendingStep"] == "DANGER_CONFIRMATION"
    assert "converted" not in out
    assert state["answers"] == {}
    step = cons.answer(SNAP, state, "Q_BREATHING_DIFFICULTY", "NO")
    assert step["type"] in ("CONFIRM_CONVERTED", "QUESTION")
    assert state["dangerLevel"] == "NONE"


def test_names_and_phone_numbers_are_removed_before_conversion():
    state = cons.start(SNAP, profile(), "fr")
    cons.describe(SNAP, state, "Yassine a mal à la gorge, appelez le 22 123 456", ["Yassine Ben Salah"])
    assert "Yassine" not in state["redactedText"] and "123" not in state["redactedText"]


def test_own_words_refused_after_a_button_answer():
    state = cons.start(SNAP, profile(), "fr")
    cons.answer(SNAP, state, "Q_BREATHING_DIFFICULTY", "NO")
    with pytest.raises(ConsultationError):
        cons.describe(SNAP, state, "mal à la tête", [])


def test_nothing_understood_falls_back_to_questions():
    state = cons.start(SNAP, profile(), "fr")
    out = cons.describe(SNAP, state, "bonjour", [])
    assert out["fallback"] is True and out["pendingStep"] == "NONE"


# ----------------------------------------------------------------------------- rules engine (FR-24 – FR-34)
def _recommend(illness, prof, answers=None):
    months = cons.age_in_months(prof["dateOfBirth"])
    return rules.recommend(SNAP, [illness], prof, months, answers or {}, "fr")


def test_allergy_blocks_the_whole_medicine_class():
    prof = profile(items=[{"kind": "ALLERGY", "termCode": "ALG_NSAID"}])
    rec = _recommend("TENSION_HEADACHE", prof)
    assert "MED_IBU_200" not in [m["code"] for m in rec["medicines"]]
    assert "MED_IBU_200" in [e["code"] for e in rec["exclusions"]]


@pytest.mark.parametrize("status", ["YES", "NOT_SURE"])
def test_pregnancy_yes_or_not_sure_blocks_nsaids(status):
    prof = profile(sex="F", weight=60, pregnancy=status, breastfeeding="NO")
    assert "MED_IBU_200" not in [m["code"] for m in _recommend("TENSION_HEADACHE", prof)["medicines"]]


def test_anticoagulant_blocks_nsaids():
    prof = profile(items=[{"kind": "MEDICATION", "termCode": "MDT_WARFARIN"}])
    assert "MED_IBU_200" not in [m["code"] for m in _recommend("SORE_THROAT", prof)["medicines"]]


def test_same_active_ingredient_is_not_given_twice():
    prof = profile(items=[{"kind": "MEDICATION", "termCode": "MDT_PARACETAMOL"}])
    rec = _recommend("COLD", prof)
    assert "MED_PARA_500" not in [m["code"] for m in rec["medicines"]]


def test_uncoded_medication_blocks_every_medicine_but_keeps_remedies():
    prof = profile(items=[{"kind": "MEDICATION", "freeText": "un sirop du voisin"}])
    rec = _recommend("COLD", prof)
    assert rec["medicines"] == [] and rec["noSafeMedicine"] is True
    assert rec["remedies"]


def test_child_gets_the_exact_syrup_band():
    prof = profile(years=5, weight=17)
    meds = {m["code"]: m for m in _recommend("COLD", prof)["medicines"]}
    assert "MED_PARA_500" not in meds
    assert meds["MED_PARA_SYRUP"]["dose"] == "7.5 ml"


def test_uncertain_child_weight_uses_the_lower_band():
    prof = profile(years=5, weight=17, weightUncertain=True)
    rec = _recommend("COLD", prof)
    meds = {m["code"]: m for m in rec["medicines"]}
    assert meds["MED_PARA_SYRUP"]["dose"] == "5 ml"  # band for 14 kg, not 17 kg
    assert rec["weightUncertainUsed"] is True


def test_no_dose_band_means_the_medicine_is_not_shown():
    prof = profile(years=13, weight=35)  # no demo band for 13 years and 35 kg
    assert "MED_PARA_500" not in [m["code"] for m in _recommend("COLD", prof)["medicines"]]


def test_steam_is_blocked_for_young_children():
    prof = profile(years=4, weight=16)
    rec = _recommend("COLD", prof)
    assert "REM_STEAM" not in [r["code"] for r in rec["remedies"]]


def test_prescription_pattern_sets_the_flag():
    answers = {"Q_FEVER": "YES", "Q_PAIN_SWALLOWING": "YES", "Q_COUGH": "NO"}
    assert _recommend("SORE_THROAT", profile(), answers)["prescriptionMayBeNeeded"] is True


def test_uncertain_result_only_gives_items_common_to_the_still_likely_set():
    rec = rules.recommend(SNAP, ["COLD", "DIARRHOEA"], profile(), 360, {}, "fr")
    assert rec["medicines"] == []  # no medicine is linked to both
    assert [r["code"] for r in rec["remedies"]] == ["REM_FLUIDS"]


def test_classifier_output_contains_only_illness_codes():
    out = classifier.classify(SNAP, {"Q_FEVER": "YES"})
    assert set(out["probabilities"]) == set(SNAP.illnesses) | {"OUT_OF_SCOPE"}
    assert all(q in SNAP.questions for q in out["reasons"])


def test_component_failure_ends_with_referral_failure(monkeypatch):
    state = cons.start(SNAP, profile(), "fr")

    def broken(*args, **kwargs):
        raise RuntimeError("model down")

    monkeypatch.setattr(classifier, "next_step", broken)
    step = cons.answer(SNAP, state, "Q_BREATHING_DIFFICULTY", "NO")
    assert step["type"] == "RESULT"
    result = cons.result_view(SNAP, state)
    assert result["resultType"] == "REFERRAL_FAILURE" and result["medicines"] == []


def test_answer_validation():
    state = cons.start(SNAP, profile(), "fr")
    with pytest.raises(ConsultationError) as err:
        cons.answer(SNAP, state, "Q_FEVER", "YES")  # not the current question
    assert err.value.code == "E-VAL-001"
    cons.answer(SNAP, state, "Q_BREATHING_DIFFICULTY", "NO")
    with pytest.raises(ConsultationError) as err:
        cons.answer(SNAP, state, "Q_DURATION_DAYS", 99)
    assert err.value.code == "E-VAL-002"


@pytest.mark.parametrize("text, expected", [
    ("je ne tousse pas", {"Q_COUGH": "NO"}),
    ("je n'ai pas de fièvre", {"Q_FEVER": "NO"}),
    ("une fièvre et une toux", {"Q_FEVER": "YES", "Q_COUGH": "YES"}),
    ("ما عنديش سخانة و عندي كحة", {"Q_FEVER": "NO", "Q_COUGH": "YES"}),
    ("mal à la gorge depuis 3 jours", {"Q_SORE_THROAT": "YES", "Q_DURATION_DAYS": 3}),
])
def test_text_reader_handles_negation_and_numbers(text, expected):
    from app.engine import reader
    got = {i["questionCode"]: i["value"] for i in reader.convert(SNAP, text)}
    assert got == expected
