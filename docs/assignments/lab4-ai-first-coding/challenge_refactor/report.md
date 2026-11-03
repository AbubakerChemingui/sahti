# The Great Refactor — report

Files: `original.py` (unchanged copy of Lab 4 §6.1) · `steps/step1 … step5` (one change each) · `refactored.py` (step 6, final) · `test_refactor.py` (behaviour checks).
Run: `python -m unittest -v` inside this folder → **11 tests, all passing**; every step and the final version give **exactly** the same return values, printed lines and stored totals as the original on 309 sample orders, 3 carts, 7 calculations and 6 validations.

## 1. Smell list from reading the code first
> ✍️ **Written by Claude at the student's request** — the lab asks for this part in the student's own words; it is marked so the instructor knows who wrote it.
> Note: the lab asks the student to list smells *before* asking the AI. This list was written by the AI, so it cannot be an independent comparison.

1. `proc()` is a long function doing pricing, discounts, tax, printing and storage.
2. The flag argument `t` (1 = order, 2 = cart) switches between two unrelated jobs.
3. Magic numbers: 0.1, 0.05, 0.15, 0.08, 100000, 10, 5.
4. Names say nothing: `proc`, `calc`, `d`, `t`, `x`, `r`, `c`, `o`.
5. Global `data` list changed from inside a function.
6. Printing mixed into the calculation.
7. Nested `else: if` instead of `elif` or an early return.
8. No error handling for missing keys.

## 2. The AI's smell list (Lab 4 §6.2 step 2)
Prompt: *"List every code smell you see in this code, with the line it is on. Don't fix anything yet."*

| # | Smell (checklist name) | Where |
|---|---|---|
| 1 | Long function | `proc()` computes, discounts, taxes, prints and stores |
| 2 | Type-code / flag argument | `proc(d, t)`: `t == 1` single order, `t == 2` cart; any other `t` silently returns `None` |
| 3 | Magic numbers | `0.1`, `0.05`, `0.15`, `0.08`, `100000`, and the thresholds `10` and `5` |
| 4 | Poor naming | `proc`, `calc`, `validate`, `d`, `t`, `x`, `i`, `r`, `c`, `o`, `data` |
| 5 | Mixed concerns | calculation, `print()` and storage in the same function |
| 6 | Global state | module-level `data` list mutated inside `proc()` (`global data`) |
| 7 | Deep nesting | `else:` → `if d["qty"] > 5:` instead of an early return / `elif` |
| 8 | Duplicated code | `x = x - (x * rate)` written three times; `price * qty` in two branches |
| 9 | No error handling | a missing `"price"`, `"qty"` or `"customer_type"` crashes with a bare `KeyError` |
| 10 | No tests | nothing checks `proc()`, `calc()` or `validate()` |
| 11 | Hidden default (beyond the checklist) | `calc()` computes `a + b` first, so an unknown or misspelled operation (`"pow"`, `"Sub"`) silently **adds** |
| 12 | Silent error (beyond the checklist) | division by zero returns `0` instead of signalling a problem |
| 13 | Unconnected validation (beyond the checklist) | `validate()` is never called by `proc()`, so a negative quantity is priced anyway |
| 14 | Latent bug (beyond the checklist) | VIP check is case-sensitive: `"VIP"` gets no discount |

**Comparison:**
> ✍️ **Written by Claude at the student's request** — the lab asks for this part in the student's own words; it is marked so the instructor knows who wrote it.
Section 2 has all eight from section 1 plus six more: duplicated `x - x * rate`, no tests, the hidden `a + b` default in `calc()`, the silent 0 on division by zero, `validate()` never being called, and the case-sensitive `"vip"` check. The last four are not on the lab checklist; they are real logic problems, not just style.

## 3. Refactoring steps, one at a time (Lab 4 §6.2 steps 3–4)
Each step was checked against `original.py` (same results, same printed text, same stored totals) before the next one was asked for.

| Step | Prompt (one change at a time) | File | Check |
|---|---|---|---|
| 1 | "Split proc() into two functions, one for a single order and one for a cart, so the t flag disappears. Don't change anything else yet." | `steps/step1_split_flag.py` | ✅ identical |
| 2 | "Extract the discount logic into quantity_discount_rate() and apply_discount(). Keep the arithmetic exactly the same." | `steps/step2_extract_discount.py` | ✅ identical |
| 3 | "Replace every magic number with a named constant. Nothing else." | `steps/step3_constants.py` | ✅ identical |
| 4 | "Make the calculations pure: move printing and storing into process_order() and process_cart(), and pass the history list in instead of using the global data list." | `steps/step4_separate_concerns.py` | ✅ identical |
| 5 | "Rename everything to clear names, replace the nested if/else with early returns, and turn calc() into a lookup of operations. Keep the same behaviour, including unknown operations." | `steps/step5_names_and_nesting.py` | ✅ identical |
| 6 | "Add type hints and docstrings, raise a clear error for a missing field, and reject unknown operations in calculate(). Then suggest a small unit test file." | `refactored.py`, `test_refactor.py` | ✅ identical for valid input; 2 deliberate changes for invalid input (below) |

**A behaviour change that the tests would catch.** A tempting simplification is `amount * (1 - rate)` instead of `amount - amount * rate`. They are equal on paper, but not in floating-point arithmetic. With that change, **61 of 210** VIP orders checked (7 prices × quantities 0–29) give a total that differs in the last decimal places. Example inputs: price 0.01 with quantities 7, 8, 13, 14 and 18. Swapping it into `refactored.py` makes `test_orders` fail, so the tests would catch it. The refactor therefore keeps the original form, and the exact-equality tests guard it.

**Deliberate behaviour changes (invalid input only), documented in `refactored.py`:**
- A missing field now raises `InvalidOrderError` naming the field, where the original gave a bare `KeyError`.
- `calculate(7, 3, "pow")` now raises `ValueError`, where the original silently returned 10.

## 4. Before / after table (Lab 4 §6.4)

| Code smell | Where it was (before) | How it was fixed (after) |
|---|---|---|
| Long function | `proc()` did everything | `order_total`, `cart_total_with_tax`, `quantity_discount_rate`, `apply_discount`, `process_order`, `process_cart` — one job each |
| Flag argument | `proc(d, t)` with `t == 1 / 2` | two functions: `process_order(order, history)` and `process_cart(items)` |
| Magic numbers | `0.1, 0.05, 0.15, 0.08, 100000, 10, 5` | `BULK_DISCOUNT`, `MEDIUM_DISCOUNT`, `VIP_DISCOUNT`, `TAX_RATE`, `MAX_UNIT_PRICE`, `BULK_QUANTITY`, `MEDIUM_QUANTITY` |
| Poor naming | `proc, calc, validate, d, t, x, r, c, o` | `order_total, calculate, is_valid_order, order, items, amount, quantity, operation` |
| Mixed concerns | compute + `print` + store in one place | pure calculations; printing and storing only in `process_*`; output function injectable |
| Global state | `global data` | `history` list passed in by the caller |
| Deep nesting | `else: if qty > 5` | early returns in `quantity_discount_rate()` |
| Duplicated code | `x - (x * rate)` three times | one `apply_discount()` |
| No error handling | bare `KeyError`; unknown operation silently adds | `InvalidOrderError` naming the field; `ValueError` for an unknown operation |
| No tests | none | `test_refactor.py`: same results as the original on 309 orders, 3 carts, every intermediate step |

## 5. Reflection
> ✍️ **Written by Claude at the student's request** — the lab asks for this part in the student's own words; it is marked so the instructor knows who wrote it.

What stood out most was how much safety came from working in small steps rather than from the AI itself. Each prompt changed one smell, and the tests compared every step with the original: exact return values, printed text and stored totals on 309 orders. That made each change easy to review and impossible to slip a silent change through. The surprise was floating-point arithmetic. Rewriting `amount - amount * rate` as `amount * (1 - rate)` looks harmless, but it changes 61 of 210 VIP totals in the last decimals, and only exact-equality tests reveal it. A single "fix this code" prompt with no tests would probably have made that kind of change, and nobody would have noticed. Two behaviour changes were made on purpose and documented: a clear error for missing fields, and rejecting unknown operations instead of adding silently. For Sahti, the lesson is direct: never accept AI-written code for doses or safety rules without tests that compare it with known correct results.
