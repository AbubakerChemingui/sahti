"""Step 4 — Mixed concerns + global state: calculation is pure; printing and
storing moved to process_* functions; the history list is passed in."""
BULK_QUANTITY = 10
BULK_DISCOUNT = 0.10
MEDIUM_QUANTITY = 5
MEDIUM_DISCOUNT = 0.05
VIP_DISCOUNT = 0.15
TAX_RATE = 0.08
MAX_UNIT_PRICE = 100_000

def apply_discount(x, rate):
    return x - (x * rate)

def quantity_discount_rate(qty):
    if qty > BULK_QUANTITY:
        return BULK_DISCOUNT
    if qty > MEDIUM_QUANTITY:
        return MEDIUM_DISCOUNT
    return 0.0

def order_total(d):
    x = d["price"] * d["qty"]
    rate = quantity_discount_rate(d["qty"])
    if rate:
        x = apply_discount(x, rate)
    if d["customer_type"] == "vip":
        x = apply_discount(x, VIP_DISCOUNT)
    return x

def cart_total_with_tax(d):
    total = 0
    for i in d:
        total = total + i["price"] * i["qty"]
    tax = total * TAX_RATE
    return total + tax

def process_order(d, history):
    x = order_total(d)
    history.append(x)
    print("Total for order: " + str(x))
    return x

def process_cart(d):
    total = cart_total_with_tax(d)
    print("Total with tax: " + str(total))
    return total

def calc(a, b, c):
    r = a + b
    if c == "sub":
        r = a - b
    if c == "mul":
        r = a * b
    if c == "div":
        if b != 0:
            r = a / b
        else:
            r = 0
    return r

def validate(o):
    if o["price"] > 0 and o["qty"] > 0 and o["price"] < MAX_UNIT_PRICE:
        return True
    return False
