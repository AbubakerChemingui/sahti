"""Behaviour tests: refactored.py must give the same results as original.py.

Run inside this folder: python -m unittest -v
Also checks every intermediate step in steps/ the same way.
"""
import contextlib
import importlib.util
import io
import itertools
import pathlib
import unittest

import original
import refactored

HERE = pathlib.Path(__file__).parent

# At least 3 sample orders (Lab 4 §6.5) — here 9 hand-picked + a grid of 300.
SAMPLE_ORDERS = [
    {"price": 20.0, "qty": 1, "customer_type": "regular"},    # no discount
    {"price": 20.0, "qty": 5, "customer_type": "regular"},    # boundary: 5 -> no discount
    {"price": 20.0, "qty": 6, "customer_type": "regular"},    # 5 %
    {"price": 20.0, "qty": 10, "customer_type": "regular"},   # boundary: 10 -> 5 %
    {"price": 20.0, "qty": 11, "customer_type": "regular"},   # 10 %
    {"price": 19.99, "qty": 3, "customer_type": "vip"},       # VIP only
    {"price": 19.99, "qty": 12, "customer_type": "vip"},      # 10 % then VIP 15 %
    {"price": 0.1, "qty": 7, "customer_type": "vip"},         # float rounding case
    {"price": 99999, "qty": 1, "customer_type": "VIP"},       # case-sensitive: not VIP
]
GRID_ORDERS = [
    {"price": p, "qty": q, "customer_type": c}
    for p, q, c in itertools.product([0.01, 1, 9.99, 33.3, 1000], range(0, 30, 1),
                                     ["vip", "regular"])
][:300]
SAMPLE_CARTS = [
    [],
    [{"price": 10, "qty": 2}],
    [{"price": 19.99, "qty": 3}, {"price": 0.1, "qty": 7}, {"price": 5, "qty": 1}],
]
CALC_CASES = [(7, 3, "add"), (7, 3, "sub"), (7, 3, "mul"), (7, 2, "div"), (7, 0, "div"),
              (-1.5, 0.5, "mul"), (0.1, 0.2, "add")]
VALIDATE_CASES = [
    {"price": 1, "qty": 1}, {"price": 0, "qty": 1}, {"price": 1, "qty": 0},
    {"price": 99999.99, "qty": 1}, {"price": 100000, "qty": 1}, {"price": -5, "qty": 2},
]


def run_quiet(func, *args):
    """Call func, capturing what it prints. Returns (result, printed_text)."""
    buffer = io.StringIO()
    with contextlib.redirect_stdout(buffer):
        result = func(*args)
    return result, buffer.getvalue()


def original_order(order):
    original.data.clear()
    result, printed = run_quiet(original.proc, order, 1)
    return result, printed, list(original.data)


def original_cart(items):
    return run_quiet(original.proc, items, 2)


class TestSameBehaviourAsOriginal(unittest.TestCase):
    def test_orders(self):
        for order in SAMPLE_ORDERS + GRID_ORDERS:
            history = []
            new = run_quiet(refactored.process_order, order, history)
            self.assertEqual(original_order(order), (new[0], new[1], history), order)

    def test_carts(self):
        for items in SAMPLE_CARTS:
            self.assertEqual(original_cart(items), run_quiet(refactored.process_cart, items), items)

    def test_calculate(self):
        for a, b, op in CALC_CASES:
            self.assertEqual(original.calc(a, b, op), refactored.calculate(a, b, op), (a, b, op))

    def test_validate(self):
        for order in VALIDATE_CASES:
            self.assertEqual(original.validate(order), refactored.is_valid_order(order), order)

    def test_original_flag_other_than_1_or_2_returns_none(self):
        # The refactor removes the flag: proc(d, 3) had no meaning and returned None.
        self.assertIsNone(original.proc({}, 3))


class TestRefactoredOnly(unittest.TestCase):
    def test_pure_functions_do_not_print_or_store(self):
        result, printed = run_quiet(refactored.order_total, SAMPLE_ORDERS[6])
        self.assertEqual(printed, "")
        self.assertAlmostEqual(result, 19.99 * 12 * 0.9 * 0.85)

    def test_history_is_explicit_not_global(self):
        first, second = [], []
        run_quiet(refactored.process_order, SAMPLE_ORDERS[0], first)
        self.assertEqual(len(first), 1)
        self.assertEqual(second, [])

    def test_missing_field_gives_clear_error(self):  # deliberate change
        with self.assertRaises(refactored.InvalidOrderError) as caught:
            refactored.order_total({"price": 10, "qty": 2})
        self.assertIn("customer_type", str(caught.exception))

    def test_unknown_operation_rejected(self):  # deliberate change
        self.assertEqual(original.calc(7, 3, "pow"), 10)  # original silently added
        with self.assertRaises(ValueError):
            refactored.calculate(7, 3, "pow")

    def test_discount_rates(self):
        self.assertEqual([refactored.quantity_discount_rate(q) for q in (5, 6, 10, 11)],
                         [0.0, 0.05, 0.05, 0.10])


def _load_step(path):
    spec = importlib.util.spec_from_file_location(path.stem, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class TestEveryIntermediateStep(unittest.TestCase):
    """Lab 4 §6.2 step 4: behaviour checked after each refactoring step."""

    def test_steps(self):
        for path in sorted((HERE / "steps").glob("step*.py")):
            step = _load_step(path)
            with self.subTest(step=path.name):
                for order in SAMPLE_ORDERS + GRID_ORDERS:
                    if hasattr(step, "process_order"):
                        history = []
                        result, printed = run_quiet(step.process_order, order, history)
                    else:
                        step.data.clear()
                        result, printed = run_quiet(step.order_total, order)
                        history = list(step.data)
                    self.assertEqual(original_order(order), (result, printed, history))
                for items in SAMPLE_CARTS:
                    cart = getattr(step, "process_cart", None) or step.cart_total_with_tax
                    self.assertEqual(original_cart(items), run_quiet(cart, items))
                calc = getattr(step, "calculate", None) or step.calc
                valid = getattr(step, "is_valid_order", None) or step.validate
                for a, b, op in CALC_CASES:
                    self.assertEqual(original.calc(a, b, op), calc(a, b, op))
                for order in VALIDATE_CASES:
                    self.assertEqual(original.validate(order), valid(order))


if __name__ == "__main__":
    unittest.main()
