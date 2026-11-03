"""Step 2 — Long function / duplicated discount code: discount logic extracted.
Arithmetic kept identical (x - x * rate) so floats are bit-for-bit the same."""
data = []

def apply_discount(x, rate):
    return x - (x * rate)

def quantity_discount_rate(qty):
    if qty > 10:
        return 0.1
    if qty > 5:
        return 0.05
    return 0.0

def order_total(d):
    global data
    x = d["price"] * d["qty"]
    rate = quantity_discount_rate(d["qty"])
    if rate:
        x = apply_discount(x, rate)
    if d["customer_type"] == "vip":
        x = apply_discount(x, 0.15)
    data.append(x)
    print("Total for order: " + str(x))
    return x

def cart_total_with_tax(d):
    total = 0
    for i in d:
        total = total + i["price"] * i["qty"]
    tax = total * 0.08
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
    if o["price"] > 0 and o["qty"] > 0 and o["price"] < 100000:
        return True
    return False
