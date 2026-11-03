"""Step 5 — Poor naming + deep nesting: clear names, early returns, calc as a
lookup table of operations (unknown operations still add, as in the original)."""
import operator

BULK_QUANTITY = 10
BULK_DISCOUNT = 0.10
MEDIUM_QUANTITY = 5
MEDIUM_DISCOUNT = 0.05
VIP_DISCOUNT = 0.15
TAX_RATE = 0.08
MAX_UNIT_PRICE = 100_000

def apply_discount(amount, rate):
    return amount - (amount * rate)

def quantity_discount_rate(quantity):
    if quantity > BULK_QUANTITY:
        return BULK_DISCOUNT
    if quantity > MEDIUM_QUANTITY:
        return MEDIUM_DISCOUNT
    return 0.0

def order_total(order):
    amount = order["price"] * order["qty"]
    rate = quantity_discount_rate(order["qty"])
    if rate:
        amount = apply_discount(amount, rate)
    if order["customer_type"] == "vip":
        amount = apply_discount(amount, VIP_DISCOUNT)
    return amount

def cart_total_with_tax(items):
    subtotal = 0
    for item in items:
        subtotal = subtotal + item["price"] * item["qty"]
    return subtotal + subtotal * TAX_RATE

def process_order(order, history):
    total = order_total(order)
    history.append(total)
    print("Total for order: " + str(total))
    return total

def process_cart(items):
    total = cart_total_with_tax(items)
    print("Total with tax: " + str(total))
    return total

def _safe_divide(a, b):
    return a / b if b != 0 else 0

_OPERATIONS = {"sub": operator.sub, "mul": operator.mul, "div": _safe_divide}

def calculate(a, b, operation):
    return _OPERATIONS.get(operation, operator.add)(a, b)

def is_valid_order(order):
    return order["price"] > 0 and order["qty"] > 0 and order["price"] < MAX_UNIT_PRICE
