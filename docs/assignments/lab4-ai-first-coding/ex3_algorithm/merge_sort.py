"""Lab 4 — Exercise 3: merge sort with a step-by-step trace.

merge_sort(items)            -> new sorted list (the input is not changed)
merge_sort(items, trace=log) -> same, and appends one line per step to `log`

Run this file to print the trace for a small example:
    python merge_sort.py
"""
from __future__ import annotations

from typing import Any, Callable, Optional

Key = Optional[Callable[[Any], Any]]


def merge(left: list, right: list, key: Key = None) -> list:
    """Merge two lists that are already sorted into one sorted list.

    Stable: when two items are equal, the one from `left` comes first.
    """
    k = key or (lambda item: item)
    result = []
    i = j = 0
    # Repeatedly take the smaller front item of the two lists.
    while i < len(left) and j < len(right):
        if k(right[j]) < k(left[i]):   # strictly smaller -> keeps equal items in order
            result.append(right[j])
            j += 1
        else:
            result.append(left[i])
            i += 1
    # One list is empty now; the rest of the other is already sorted.
    result.extend(left[i:])
    result.extend(right[j:])
    return result


def merge_sort(items: list, key: Key = None, trace: Optional[list[str]] = None,
               _depth: int = 0) -> list:
    """Return a new list with the items of `items` in ascending order.

    Args:
        items: the list to sort (not modified).
        key: optional function giving the value to compare (like sorted()).
        trace: optional list; if given, one text line per split and merge is
            appended, indented by recursion depth, to follow the algorithm.
    """
    indent = "  " * _depth
    # Base case: 0 or 1 item is already sorted.
    if len(items) <= 1:
        if trace is not None:
            trace.append(f"{indent}base   {items}")
        return list(items)

    # Divide: split in two halves (the left half gets the smaller part).
    middle = len(items) // 2
    left_half, right_half = items[:middle], items[middle:]
    if trace is not None:
        trace.append(f"{indent}split  {items} -> {left_half} | {right_half}")

    # Conquer: sort each half recursively.
    left_sorted = merge_sort(left_half, key, trace, _depth + 1)
    right_sorted = merge_sort(right_half, key, trace, _depth + 1)

    # Combine: merge the two sorted halves.
    merged = merge(left_sorted, right_sorted, key)
    if trace is not None:
        trace.append(f"{indent}merge  {left_sorted} + {right_sorted} -> {merged}")
    return merged


if __name__ == "__main__":
    example = [5, 2, 4, 1, 3]
    steps: list[str] = []
    print("input :", example)
    print("output:", merge_sort(example, trace=steps))
    print("\n".join(steps))
