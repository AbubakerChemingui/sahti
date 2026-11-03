"""Tests for Exercise 3. Run: python -m unittest -v (inside this folder)."""
import random
import unittest

from merge_sort import merge, merge_sort


class TestMergeSort(unittest.TestCase):
    def test_hand_traced_example(self):
        self.assertEqual(merge_sort([5, 2, 4, 1, 3]), [1, 2, 3, 4, 5])

    def test_empty_and_single(self):  # edge cases
        self.assertEqual(merge_sort([]), [])
        self.assertEqual(merge_sort([7]), [7])

    def test_duplicates_and_negatives(self):
        self.assertEqual(merge_sort([3, -1, 3, 0, -1]), [-1, -1, 0, 3, 3])

    def test_already_sorted_and_reversed(self):
        self.assertEqual(merge_sort([1, 2, 3, 4]), [1, 2, 3, 4])
        self.assertEqual(merge_sort([4, 3, 2, 1]), [1, 2, 3, 4])

    def test_input_not_modified(self):
        data = [3, 1, 2]
        merge_sort(data)
        self.assertEqual(data, [3, 1, 2])

    def test_stable_with_key(self):
        people = [("Sami", 40), ("Ali", 30), ("Mona", 40), ("Rim", 30)]
        self.assertEqual(merge_sort(people, key=lambda p: p[1]),
                         [("Ali", 30), ("Rim", 30), ("Sami", 40), ("Mona", 40)])

    def test_matches_python_sorted_on_random_lists(self):
        rng = random.Random(7)
        for _ in range(500):
            data = [rng.randint(-50, 50) for _ in range(rng.randint(0, 60))]
            self.assertEqual(merge_sort(data), sorted(data))

    def test_merge_two_sorted_lists(self):
        self.assertEqual(merge([1, 4, 6], [2, 3, 7, 8]), [1, 2, 3, 4, 6, 7, 8])

    def test_trace_for_hand_example(self):
        steps = []
        merge_sort([5, 2, 4, 1, 3], trace=steps)
        self.assertEqual(steps[0], "split  [5, 2, 4, 1, 3] -> [5, 2] | [4, 1, 3]")
        self.assertEqual(steps[-1], "merge  [2, 5] + [1, 3, 4] -> [1, 2, 3, 4, 5]")


if __name__ == "__main__":
    unittest.main()
