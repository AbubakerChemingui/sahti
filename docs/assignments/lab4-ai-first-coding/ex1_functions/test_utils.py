"""Tests for Exercise 1. Run: python -m unittest discover (from the lab folder)."""
import random
import unittest

from utils import is_prime, latest_per_key, truncate_at_word


class TestLatestPerKey(unittest.TestCase):
    def test_keeps_newest_per_profile(self):
        records = [
            {"profile_id": "A", "created_at": "2026-11-01"},
            {"profile_id": "A", "created_at": "2026-11-03"},
            {"profile_id": "B", "created_at": "2026-10-20"},
        ]
        self.assertEqual(
            latest_per_key(records),
            [
                {"profile_id": "A", "created_at": "2026-11-03"},
                {"profile_id": "B", "created_at": "2026-10-20"},
            ],
        )

    def test_empty_list(self):  # edge case
        self.assertEqual(latest_per_key([]), [])

    def test_same_date_later_record_wins(self):  # edge case
        records = [
            {"profile_id": "A", "created_at": "2026-11-03", "n": 1},
            {"profile_id": "A", "created_at": "2026-11-03", "n": 2},
        ]
        self.assertEqual(latest_per_key(records)[0]["n"], 2)

    def test_dates_with_time_are_compared_as_dates_not_text(self):
        records = [
            {"profile_id": "A", "created_at": "2026-11-03T09:00:00"},
            {"profile_id": "A", "created_at": "2026-11-03T14:30:00"},
            {"profile_id": "A", "created_at": "2026-11-02T23:59:59"},
        ]
        self.assertEqual(latest_per_key(records)[0]["created_at"], "2026-11-03T14:30:00")

    def test_custom_key_and_date_field(self):
        records = [{"user": 1, "t": "2026-01-02"}, {"user": 1, "t": "2026-01-01"}]
        self.assertEqual(latest_per_key(records, key="user", date_field="t"), [records[0]])

    def test_input_not_modified(self):
        records = [{"profile_id": "A", "created_at": "2026-11-01"}]
        copy = [dict(r) for r in records]
        latest_per_key(records)
        self.assertEqual(records, copy)

    def test_missing_key_raises(self):  # edge case
        with self.assertRaises(KeyError):
            latest_per_key([{"created_at": "2026-11-01"}])

    def test_bad_date_raises(self):  # edge case
        with self.assertRaises(ValueError):
            latest_per_key([{"profile_id": "A", "created_at": "yesterday"}])


class TestTruncateAtWord(unittest.TestCase):
    def test_short_text_unchanged(self):
        self.assertEqual(truncate_at_word("Sore throat", 20), "Sore throat")

    def test_exact_length_unchanged(self):  # edge case
        self.assertEqual(truncate_at_word("abcde", 5), "abcde")

    def test_cuts_at_word_boundary(self):
        self.assertEqual(truncate_at_word("Take one tablet after dinner", 16), "Take one tablet…")

    def test_does_not_cut_a_word_in_half(self):
        # 12 chars: "Take one tab" would cut "tablet"
        self.assertEqual(truncate_at_word("Take one tablet after dinner", 12), "Take one…")

    def test_first_word_too_long_is_cut(self):  # edge case
        self.assertEqual(truncate_at_word("Paracetamol 500 mg", 6), "Parac…")

    def test_max_length_smaller_than_ellipsis(self):  # edge case
        self.assertEqual(truncate_at_word("Hello world", 2, ellipsis="..."), "..")

    def test_invalid_max_length(self):  # edge case
        with self.assertRaises(ValueError):
            truncate_at_word("Hello", 0)

    def test_empty_text(self):  # edge case
        self.assertEqual(truncate_at_word("", 5), "")

    def test_properties_on_random_texts(self):
        """Result never too long; it is the text start; no word cut when avoidable."""
        rng = random.Random(42)
        words = ["a", "to", "fever", "paracetamol", "x", "throat", "dinner"]
        for _ in range(2000):
            text = " ".join(rng.choice(words) for _ in range(rng.randint(0, 8)))
            n = rng.randint(1, 40)
            out = truncate_at_word(text, n)
            self.assertLessEqual(len(out), n)
            if len(text) <= n:
                self.assertEqual(out, text)
                continue
            body = out[:-1] if out.endswith("…") else out
            self.assertTrue(text.startswith(body), (text, n, out))
            if body and " " in text[: n - 1]:
                # body must end exactly where a word ends
                self.assertTrue(len(body) == len(text) or text[len(body)] == " ", (text, n, out))


def _slow_is_prime(n: int) -> bool:
    if n < 2:
        return False
    d = 2
    while d * d <= n:
        if n % d == 0:
            return False
        d += 1
    return True


class TestIsPrime(unittest.TestCase):
    def test_small_numbers(self):
        self.assertTrue(is_prime(2))
        self.assertTrue(is_prime(97))
        self.assertFalse(is_prime(91))  # 7 * 13

    def test_zero_one_negative(self):  # edge case
        for n in (0, 1, -1, -7):
            self.assertFalse(is_prime(n))

    def test_matches_slow_method_up_to_20000(self):
        for n in range(-5, 20_000):
            self.assertEqual(is_prime(n), _slow_is_prime(n), n)

    def test_carmichael_numbers_are_composite(self):  # fool simple tests
        for n in (561, 1105, 1729, 2465, 2821, 6601, 8911):
            self.assertFalse(is_prime(n), n)

    def test_large_numbers(self):
        self.assertTrue(is_prime(2**61 - 1))          # Mersenne prime
        self.assertFalse(is_prime(2**67 - 1))         # = 193707721 * 761838257287
        self.assertTrue(is_prime(1_000_000_007))
        self.assertFalse(is_prime(1_000_000_007 * 998_244_353))

    def test_rejects_non_integers(self):  # edge case
        for bad in (7.0, "7", True, None):
            with self.assertRaises(TypeError):
                is_prime(bad)


if __name__ == "__main__":
    unittest.main()
