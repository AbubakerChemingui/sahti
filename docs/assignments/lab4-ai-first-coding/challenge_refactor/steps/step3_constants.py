"""Step 3 — Magic numbers replaced by named constants."""
BULK_QUANTITY = 10            # more than this -> bulk discount
BULK_DISCOUNT = 0.10
MEDIUM_QUANTITY = 5           # more than this -> medium discount
MEDIUM_DISCOUNT = 0.05
VIP_DISCOUNT = 0.15
TAX_RATE = 0.08
MAX_UNIT_PRICE = 100_000      # prices must be below this

data = []

def apply_discount(x, rate):
    return x - (x * rate)

def quantity_discount_rate(qty):
    if qty > BULK_QUANTITY:
        return BULK_DISCOUNT
    if qty > MEDIUM_QUANTITY:
        return MEDIUM_DISCOUNT
    return 0.0

def order_total(d):
    global data
    x = d["price"] * d["qty"]
    rate = quantity_discount_rate(d["qty"])
    if rate:
        x = apply_discount(x, rate)
    if d["customer_type"] == "vip":
        x = apply_discount(x, VIP_DISCOUNT)
    data.append(x)
    print("Total for order: " + str(x))
    return x

def cart_total_with_tax(d):
    total = 0
    for i in d:
        total = total + i["price"] * i["qty"]
    tax = total * TAX_RATE
    total = total + tax
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
