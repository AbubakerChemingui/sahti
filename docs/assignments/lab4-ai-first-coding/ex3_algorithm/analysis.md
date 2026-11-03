# Exercise 3 — Merge sort: complexity and hand trace

## 1. Complexity analysis
> ✍️ **Written by Claude at the student's request** — the lab asks for this part in the student's own words; it is marked so the instructor knows who wrote it.
> Note: the lab asks for a guess written *before* reading the AI's answer. This section was written by the same AI, so it is an analysis, not an independent guess.

- **Time:** O(n log n). Halving n items until single items takes about log₂ n levels (8 items → 3 levels: 8 → 4 → 2 → 1). On each level, the merges together look at every item once, which is about n steps. So the total is about n × log₂ n, whatever the input order.
- **Space:** O(n). The code builds new lists (slices and merged results) instead of sorting in place; the recursion is only about log₂ n calls deep.

## 2. Side by side with `ai_complexity_answer.md`

| | Section 1 | `ai_complexity_answer.md` | Same? |
|---|---|---|---|
| Time | O(n log n) | O(n log n), best, average and worst case | Yes |
| Space | O(n) | O(n) extra + O(log n) recursion stack | Yes |

Measured check (in `ai_complexity_answer.md`): comparisons stay below n log₂ n (n = 8: 17 vs 24; n = 64: 307 vs 384; n = 1,024: 8,971 vs 10,240).

## 3. Hand trace of `[5, 2, 4, 1, 3]` (on paper, then typed or photographed)
> **To do yourself (Lab 4 §5.2 step 4).** On paper: split the list into halves until each piece has one number, then merge back up, writing each merged list. Then run `python merge_sort.py` and compare with the printed trace.

My trace:
> ✍️ **Written by Claude at the student's request** — the lab asks for this part in the student's own words; it is marked so the instructor knows who wrote it.

```
[5, 2, 4, 1, 3]
split  -> [5, 2] | [4, 1, 3]          (middle = 5 // 2 = 2)
  split [5, 2] -> [5] | [2]
  merge [5] + [2]: 2 < 5 → take 2, then 5           -> [2, 5]
  split [4, 1, 3] -> [4] | [1, 3]     (middle = 3 // 2 = 1)
    split [1, 3] -> [1] | [3]
    merge [1] + [3]: 1 < 3 → take 1, then 3         -> [1, 3]
  merge [4] + [1, 3]: 1 < 4 → 1; 3 < 4 → 3; then 4  -> [1, 3, 4]
merge [2, 5] + [1, 3, 4]:
  1 < 2 → 1 | 2 < 3 → 2 | 3 < 5 → 3 | 4 < 5 → 4 | then 5 -> [1, 2, 3, 4, 5]
```

- **Result of the trace:** `[1, 2, 3, 4, 5]` after 4 merges and 8 comparisons (1 + 1 + 2 + 4).
- **Program output:** `[1, 2, 3, 4, 5]`; the printed trace of `python merge_sort.py` shows the same splits and merges in the same order.
- **Mismatch:** none. One point to watch: the left half is the smaller one (`len // 2`), so `[4, 1, 3]` splits as `[4] | [1, 3]`, not `[4, 1] | [3]`.
