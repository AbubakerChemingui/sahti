"""Tests for Exercise 2. Run: python -m unittest discover (from the lab folder)."""
import csv
import io
import unittest

from rules import (AllergyRule, ConditionRule, MinimumAgeRule, Patient, PregnancyRule,
                   RuleFactory, blocking_reasons)

CSV_TEXT = """code,medicine_code,target_type,target_value,reason
R1,MED-IBU,ALLERGY_GROUP,NSAID,Allergy to anti-inflammatory medicines
R2,MED-IBU,AGE_BELOW_MONTHS,72,Not for children under 6 years
R3,MED-PSE,CONDITION,HYPERTENSION,Not with high blood pressure
R4,MED-IBU,PREGNANT,,Not during pregnancy
"""


def load_rules():
    return [RuleFactory.from_row(row) for row in csv.DictReader(io.StringIO(CSV_TEXT))]


class TestFactory(unittest.TestCase):
    def test_creates_the_right_class_for_each_type(self):
        rules = load_rules()
        self.assertEqual([type(r) for r in rules],
                         [AllergyRule, MinimumAgeRule, ConditionRule, PregnancyRule])
        self.assertEqual(rules[1].min_age_months, 72)

    def test_type_string_is_case_insensitive(self):
        rule = RuleFactory.create("condition", code="R", medicine_code="M",
                                  reason="r", target_value="asthma")
        self.assertIsInstance(rule, ConditionRule)
        self.assertEqual(rule.condition, "ASTHMA")

    def test_unknown_type_rejected(self):  # validation
        with self.assertRaises(ValueError):
            RuleFactory.create("SMELL", code="R", medicine_code="M", reason="r")

    def test_negative_or_non_numeric_age_rejected(self):  # validation
        for bad in ("-1", "six", ""):
            with self.assertRaises(ValueError):
                RuleFactory.create("AGE_BELOW_MONTHS", code="R", medicine_code="M",
                                   reason="r", target_value=bad)

    def test_missing_target_value_rejected(self):  # validation
        with self.assertRaises(ValueError):
            RuleFactory.create("ALLERGY_GROUP", code="R", medicine_code="M", reason="r")

    def test_empty_reason_rejected(self):  # validation
        with self.assertRaises(ValueError):
            RuleFactory.create("PREGNANT", code="R", medicine_code="M", reason="  ")

    def test_row_with_missing_column_rejected(self):
        with self.assertRaises(ValueError):
            RuleFactory.from_row({"code": "R", "target_type": "PREGNANT"})


class TestPatientModel(unittest.TestCase):
    def test_valid_patient(self):
        p = Patient(age_months=360, allergy_groups={"nsaid"}, pregnancy="NOT_SURE")
        self.assertIn("NSAID", p.allergy_groups)

    def test_negative_age_rejected(self):
        with self.assertRaises(ValueError):
            Patient(age_months=-1)

    def test_unknown_pregnancy_value_rejected(self):
        with self.assertRaises(ValueError):
            Patient(age_months=300, pregnancy="MAYBE")

    def test_patient_is_immutable(self):
        p = Patient(age_months=300)
        with self.assertRaises(Exception):
            p.age_months = 10


class TestRulesTogether(unittest.TestCase):
    def setUp(self):
        self.rules = load_rules()

    def test_healthy_adult_can_take_ibuprofen(self):
        self.assertEqual(blocking_reasons("MED-IBU", self.rules, Patient(age_months=480)), [])

    def test_child_under_six_is_blocked(self):
        reasons = blocking_reasons("MED-IBU", self.rules, Patient(age_months=48))
        self.assertEqual(reasons, ["Not for children under 6 years"])

    def test_exactly_six_years_is_allowed(self):  # boundary
        self.assertEqual(blocking_reasons("MED-IBU", self.rules, Patient(age_months=72)), [])

    def test_not_sure_pregnant_is_treated_as_pregnant(self):
        p = Patient(age_months=360, pregnancy="NOT_SURE")
        self.assertEqual(blocking_reasons("MED-IBU", self.rules, p), ["Not during pregnancy"])

    def test_several_reasons_are_all_listed(self):
        p = Patient(age_months=48, allergy_groups={"NSAID"})
        self.assertEqual(len(blocking_reasons("MED-IBU", self.rules, p)), 2)

    def test_rule_only_applies_to_its_medicine(self):
        p = Patient(age_months=480, conditions={"hypertension"})
        self.assertEqual(blocking_reasons("MED-IBU", self.rules, p), [])
        self.assertEqual(blocking_reasons("MED-PSE", self.rules, p), ["Not with high blood pressure"])


if __name__ == "__main__":
    unittest.main()
