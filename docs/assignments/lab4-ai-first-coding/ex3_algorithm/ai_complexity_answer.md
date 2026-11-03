# AI's complexity answer (Prompt 2 of Exercise 3)

> Read this only after writing your own guess in `analysis.md` §1.

**Time: O(n log n)** in the best, average and worst case.
- The list is halved until pieces have one item: about log₂ n levels of recursion.
- On each level, all merges together touch every item once: about n steps per level.
- So about n × log₂ n steps. Measured on this code with shuffled lists: 17 comparisons for n = 8 (n log₂ n = 24), 307 for n = 64 (384), 8,971 for n = 1,024 (10,240) — always below n log₂ n, as expected.
- Unlike quicksort, the order of the input does not change this (no bad case).

**Space: O(n)** extra memory.
- `merge` builds a new result list, and slicing (`items[:middle]`) copies the halves; at any moment the lists alive along one recursion path add up to about 2n items → O(n).
- The recursion depth is about log₂ n calls → O(log n) stack, which is smaller than O(n).
- This version does not sort in place; the input list is left unchanged.
