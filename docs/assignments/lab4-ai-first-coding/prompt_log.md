# Prompt log — Lab 4 AI-First Coding

Every prompt below is copied exactly as I sent it. "AI answer" is a short summary; the code is in the exercise folders. "What I changed / checked" is my own.

## Exercise 1 — Function generation

> **How these prompts were written:** at my request, Claude drafted the prompts from the function choices I approved (latest record per key, truncate at word, prime check); I approved them and they were then run. The code is Claude's; the checks below were run and their results recorded.

### Data processing — `latest_per_key`
- **Prompt 1:** "Write a Python function called latest_per_key that takes a list of consultation records (dictionaries) and returns one record per profile_id, keeping the most recent one according to the created_at field. Include a docstring and type hints, and return an empty list for an empty input. Do not use any external libraries."
- **AI answer (summary):** first draft in `utils_v1_first_drafts.py` — compares `created_at` as text; a missing field crashes with a bare KeyError.
- **Prompt 2 (iteration):** "Compare created_at as real ISO 8601 dates, not as strings. Make the key and the date field parameters with profile_id and created_at as defaults. If two records of the same profile have the same date, keep the one that comes later in the list. Raise a clear error when a record has no key or no valid date, keep the order in which each profile first appears, and don't modify the input list."
- **What I checked:** the first draft picks the wrong record for `"2026-11-03T09:00:00"` vs `"2026-11-03 14:30:00"` (text comparison: `"T"` > `" "`); the final version picks 14:30. 8 tests (empty list, equal dates, missing key, bad date, custom fields, input unchanged).

### String manipulation — `truncate_at_word`
- **Prompt 1:** "Write a Python function called truncate_at_word that shortens a text to at most max_length characters without cutting a word in half and adds '…' at the end when it cuts. Include a docstring and type hints, and return the text unchanged if it is already short enough. No external libraries."
- **AI answer (summary):** first draft uses `text[:max_length].rsplit(" ", 1)[0] + "…"`.
- **Prompt 2 (iteration):** "The result including the '…' must never be longer than max_length. Don't remove the last word when the cut already falls exactly on a space. If the first word alone is longer than the space available, cut inside it so something is shown. Raise a ValueError when max_length is below 1, and handle max_length smaller than the ellipsis."
- **What I checked:** the first draft returns `"Parace…"` (7 characters) for `max_length = 6`: the "…" is not counted, so the limit is broken, and with `max_length = 0` it returns `"…"` instead of refusing. The final version returns `"Parac…"` (6), refuses `0` with a ValueError, and cuts `"Take one tablet after dinner"` at 12 to `"Take one…"`. 9 tests, including 2,000 random texts checking: never too long, always the start of the text, never a word cut when it can be avoided.

### Mathematical — `is_prime`
- **Prompt 1:** "Write a Python function called is_prime that returns True if an integer n is prime. Make it efficient: only test divisors up to the square root of n. Include a docstring and type hints; 0, 1 and negative numbers are not prime. No external libraries."
- **AI answer (summary):** first draft — trial division with the 6k ± 1 trick, O(√n).
- **Prompt 2 (iteration):** "Make it efficient for very large inputs too, such as 2**61 − 1, using a deterministic Miller-Rabin test, and say in the docstring up to which size the answer is exact. Raise a TypeError for anything that is not an int, including True and False."
- **What I checked:** the first draft takes **40.6 s** for 2**61 − 1 on the test machine; the final version takes **0.00015 s** (same machine, one run each). First draft silently accepts `True`. Final version agrees with a slow reference method for every n from −5 to 19,999 and for 3,000 random numbers between 10^9 and 10^10; Carmichael numbers (561, 1105, …) and strong pseudoprimes (3215031751) are correctly reported composite. Exactness bound (n < 3.3 × 10^24 with the first 12 prime bases) is a published result, stated in the docstring.

## Exercise 2 — Class design

> Prompts drafted by Claude at my request and approved by me (same as Exercise 1). Pattern: **Factory**. Domain: Sahti safety rules read from a CSV file (matches the `RuleFactory` of the Sahti SDD §7.1).

- **Prompt 1:** "Implement the Factory pattern in Python for the safety rules of my medicine app. Each CSV row has code, medicine_code, target_type, target_value and reason; target_type is ALLERGY_GROUP, CONDITION, AGE_BELOW_MONTHS or PREGNANT. The factory must return the right rule class for the type string, each with the shared attributes and its own attribute, and a method blocks(patient). Include a simple Patient data model with basic validation: reject a negative age, an unknown pregnancy value and an unknown rule type. Standard library only."
- **AI answer (summary):** `rules.py` — abstract `SafetyRule` (code, medicine_code, reason) with four subclasses; `RuleFactory.create(target_type, …)` and `from_row(row)` using a dictionary from type string to builder; frozen `Patient` dataclass with validation; helper `blocking_reasons()`.
- **Prompt 2:** "Explain why you structured this as a Factory rather than just calling the constructor directly — what problem does the pattern solve here?"
- **AI answer (summary):** the code that reads the CSV only knows a type *string*; the factory is the one place that turns that string into the right class and checks its value, so the reading code does not need an if/else per rule type, and the unknown-type error is raised in one place. Callers depend only on `SafetyRule.blocks()`.
- **Prompt 3:** "What would break or get harder to maintain if I added a new rule type, for example 'not with regular alcohol', to this design?"
- **AI answer (summary):** nothing that already exists breaks: add one subclass and one entry in `_builders`; the CSV reader, `blocking_reasons()` and the existing tests stay unchanged. What gets harder: the `Patient` model needs a new field (alcohol use), and every new type needs its own tests; if many types share logic, the builders dictionary grows and may need splitting.
- **What I checked:** 17 tests — each type string gives the right class; unknown type, negative or non-numeric age, missing value, empty reason and missing column are rejected; the Patient model rejects a negative age and an unknown pregnancy value and cannot be modified; boundary case: a child of exactly 72 months (6 years) is allowed, 48 months is blocked; "not sure" pregnant is treated as pregnant.

## Exercise 3 — Algorithm

> Prompts drafted by Claude at my request and approved by me. Algorithm: **merge sort with a step-by-step trace** (Lab 4 §5.1, sorting / searching).

- **Prompt 1:** "Implement merge sort in Python as a function merge_sort(items, key=None, trace=None) that returns a new sorted list without changing the input. Keep it stable, accept an optional key function like sorted(), and when a trace list is given, append one line for every split and every merge, indented by recursion depth, so I can follow it step by step. Comment each part (divide, conquer, combine). Standard library only."
- **AI answer (summary):** `merge_sort.py` — `merge()` (stable, uses `<` so equal items keep their order) and recursive `merge_sort()` with an optional trace; running the file prints the trace for `[5, 2, 4, 1, 3]`.
- **Complexity analysis:** `analysis.md` §1 — written by Claude at my request (marked ✍️), not an independent guess made before Prompt 2.
- **Prompt 2:** "Explain the time and space complexity of this merge sort, best, average and worst case, and where the extra memory comes from."
- **AI answer (summary):** `ai_complexity_answer.md` — O(n log n) time in every case; O(n) extra space (new lists from merge and slicing) plus O(log n) recursion depth; measured comparison counts below n log₂ n.
- **What I checked:** 9 tests (hand example, empty, one item, duplicates, negatives, already sorted, reversed, input unchanged, stability with a key, 500 random lists against Python's `sorted`, the first and last trace lines); hand trace compared with the program in `analysis.md` §3.

## Challenge — The Great Refactor

> Prompts drafted by Claude at my request and approved by me. All prompts, steps and checks are in `challenge_refactor/report.md` §2–§3 (one change per prompt, behaviour checked after each).

- **Prompt (smells):** "List every code smell you see in this code, with the line it is on. Don't fix anything yet." → 14 smells (`report.md` §2).
- **Prompts (steps 1–6):** see the table in `report.md` §3.
- **Prompt (tests):** "Suggest a small unit test file that proves the refactored code gives exactly the same results, printed output and stored totals as the original for at least 3 sample orders." → `test_refactor.py` (also checks every intermediate step).
- **What I checked:** all 11 tests pass; exact equality (not approximate) on 309 orders; the floating-point trap `amount * (1 - rate)` changes 61 of 210 VIP totals checked; swapping it in makes `test_orders` fail, so it was not used.

