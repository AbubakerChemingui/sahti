"""Step 1 — Type-code / flag argument: proc(d, t) split into two functions.
Nothing else changed (same names inside, same globals, same prints)."""
data = []

def order_total(d):
    global data
    x = d["price"] * d["qty"]
    if d["qty"] > 10:
        x = x - (x * 0.1)
    else:
        if d["qty"] > 5:
            x = x - (x * 0.05)
    if d["customer_type"] == "vip":
        x = x - (x * 0.15)
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
