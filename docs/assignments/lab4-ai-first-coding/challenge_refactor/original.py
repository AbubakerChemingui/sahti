# Original messy code from Lab 4 §6.1 — kept UNCHANGED for comparison.
data = []

def proc(d, t):
    global data
    if t == 1:
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
    elif t == 2:
        total = 0
        for i in d:
            total = total + i["price"] * i["qty"]
        tax = total * 0.08
        total = total + tax
        print("Total with tax: " + str(total))
        return total
    else:
        return None

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
