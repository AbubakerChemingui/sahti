"""Order pricing — refactored version of original.py (Lab 4, The Great Refactor).

Calculation functions are pure (no printing, no global state). Printing and
storing happen only in process_order() / process_cart(), and the order history
is passed in explicitly instead of living in a global list.

Behaviour is identical to original.py for every valid input (checked by
test_refactor.py). Deliberate changes, for invalid input only:
  * a missing field raises InvalidOrderError (naming the field) instead of a bare KeyError;
  * calculate() with an unknown operation raises ValueError instead of silently adding.
"""
from __future__ import annotations

import operator
from typing import Any, Callable, Iterable, Mapping

Number = float  # prices and totals; ints are accepted as well

# --- Business constants (were magic numbers) --------------------------------
BULK_QUANTITY = 10          # more than this many items -> bulk discount
BULK_DISCOUNT = 0.10
MEDIUM_QUANTITY = 5         # more than this many items -> medium discount
MEDIUM_DISCOUNT = 0.05
VIP_DISCOUNT = 0.15         # applied after the quantity discount
VIP_CUSTOMER = "vip"
TAX_RATE = 0.08
MAX_UNIT_PRICE = 100_000    # a valid unit price is strictly below this


class InvalidOrderError(ValueError):
    """An order (or cart item) is missing a required field."""


def _field(order: Mapping[str, Any], name: str) -> Any:
    """Return order[name], or raise InvalidOrderError naming the missing field."""
    try:
        return order[name]
    except KeyError:
        raise InvalidOrderError(f"order is missing the field {name!r}") from None


# --- Pure calculations -------------------------------------------------------
def apply_discount(amount: Number, rate: float) -> Number:
    """Return ``amount`` reduced by ``rate`` (0.1 = 10 %)."""
    return amount - (amount * rate)


def quantity_discount_rate(quantity: int) -> float:
    """Discount rate for a quantity: >10 items -> 10 %, >5 items -> 5 %, else 0."""
    if quantity > BULK_QUANTITY:
        return BULK_DISCOUNT
    if quantity > MEDIUM_QUANTITY:
        return MEDIUM_DISCOUNT
    return 0.0


def order_total(order: Mapping[str, Any]) -> Number:
    """Total of one order line: price x quantity, quantity discount, then VIP discount.

    Raises:
        InvalidOrderError: "price", "qty" or "customer_type" is missing.
    """
    price, quantity = _field(order, "price"), _field(order, "qty")
    customer_type = _field(order, "customer_type")

    amount = price * quantity
    rate = quantity_discount_rate(quantity)
    if rate:
        amount = apply_discount(amount, rate)
    if customer_type == VIP_CUSTOMER:
        amount = apply_discount(amount, VIP_DISCOUNT)
    return amount


def cart_total_with_tax(items: Iterable[Mapping[str, Any]]) -> Number:
    """Sum of price x quantity over all items, plus tax (TAX_RATE).

    Raises:
        InvalidOrderError: an item has no "price" or "qty".
    """
    subtotal: Number = 0
    for item in items:
        subtotal = subtotal + _field(item, "price") * _field(item, "qty")
    return subtotal + subtotal * TAX_RATE


def is_valid_order(order: Mapping[str, Any]) -> bool:
    """True if price and quantity are positive and the price is below MAX_UNIT_PRICE.

    Raises:
        InvalidOrderError: "price" or "qty" is missing.
    """
    price, quantity = _field(order, "price"), _field(order, "qty")
    return price > 0 and quantity > 0 and price < MAX_UNIT_PRICE


def _divide_or_zero(a: Number, b: Number) -> Number:
    """a / b, or 0 when b is 0 (kept from the original behaviour)."""
    return a / b if b != 0 else 0


_OPERATIONS: dict[str, Callable[[Number, Number], Number]] = {
    "add": operator.add,
    "sub": operator.sub,
    "mul": operator.mul,
    "div": _divide_or_zero,
}


def calculate(a: Number, b: Number, operation: str = "add") -> Number:
    """Apply ``operation`` ("add", "sub", "mul" or "div") to a and b.

    Division by zero returns 0, as in the original code.

    Raises:
        ValueError: unknown operation (the original silently added instead).
    """
    try:
        return _OPERATIONS[operation](a, b)
    except KeyError:
        known = ", ".join(_OPERATIONS)
        raise ValueError(f"unknown operation {operation!r} (use one of: {known})") from None


# --- Side effects: reporting and storage -------------------------------------
def process_order(order: Mapping[str, Any], history: list[Number],
                  output: Callable[[str], None] = print) -> Number:
    """Compute an order total, add it to ``history`` and report it via ``output``."""
    total = order_total(order)
    history.append(total)
    output("Total for order: " + str(total))
    return total


def process_cart(items: Iterable[Mapping[str, Any]],
                 output: Callable[[str], None] = print) -> Number:
    """Compute a cart total with tax and report it via ``output``."""
    total = cart_total_with_tax(items)
    output("Total with tax: " + str(total))
    return total
