"""Lab 4 — Exercise 1: three utility functions (data processing, string, math).

Python 3.9+, standard library only.
"""
from __future__ import annotations

from datetime import datetime
from typing import Any


# ---------------------------------------------------------------------------
# 1. Data processing
# ---------------------------------------------------------------------------
def latest_per_key(
    records: list[dict[str, Any]],
    key: str = "profile_id",
    date_field: str = "created_at",
) -> list[dict[str, Any]]:
    """Keep only the most recent record for each value of ``key``.

    Example: consultations of several patient profiles -> one (the newest)
    consultation per profile.

    Args:
        records: list of dictionaries. Each must contain ``key`` and
            ``date_field``; ``date_field`` is an ISO 8601 string
            (e.g. "2026-11-03" or "2026-11-03T14:30:00").
        key: field used to group records (default "profile_id").
        date_field: field that decides which record is the most recent
            (default "created_at").

    Returns:
        A new list with one record per key, in the order in which each key
        first appears in ``records``. The input list is not modified.

    Rules:
        * Empty input -> empty list.
        * Two records of the same key with the same date -> the one that
          appears LATER in the input wins (it is treated as the newer entry).

    Raises:
        KeyError: a record has no ``key`` or no ``date_field``.
        ValueError: a date is not a valid ISO 8601 string.
    """
    latest: dict[Any, tuple[datetime, dict[str, Any]]] = {}
    for index, record in enumerate(records):
        if key not in record:
            raise KeyError(f"record {index} has no field {key!r}")
        if date_field not in record:
            raise KeyError(f"record {index} has no field {date_field!r}")
        try:
            moment = datetime.fromisoformat(str(record[date_field]))
        except ValueError as error:
            raise ValueError(
                f"record {index}: {date_field!r} is not an ISO 8601 date: "
                f"{record[date_field]!r}"
            ) from error

        current = latest.get(record[key])
        # ">=" so that, on equal dates, the later record in the list wins.
        if current is None or moment >= current[0]:
            latest[record[key]] = (moment, record)

    # dict keeps insertion order = order of first appearance of each key.
    return [record for _, record in latest.values()]


# ---------------------------------------------------------------------------
# 2. String manipulation
# ---------------------------------------------------------------------------
def truncate_at_word(text: str, max_length: int, ellipsis: str = "…") -> str:
    """Shorten ``text`` to at most ``max_length`` characters without cutting a word.

    If the text is already short enough it is returned unchanged. Otherwise
    the text is cut at the last space that fits and ``ellipsis`` is appended;
    the result (ellipsis included) is never longer than ``max_length``.

    Args:
        text: the text to shorten.
        max_length: maximum length of the result, ellipsis included (>= 1).
        ellipsis: marker added when the text is cut (default "…").

    Returns:
        The shortened text.

    Rules:
        * A first word longer than the space available is cut inside the word
          (there is no word boundary to cut at), so something is still shown.
        * If ``max_length`` is not larger than the ellipsis, only (the start
          of) the ellipsis is returned.
        * Trailing spaces before the ellipsis are removed.

    Raises:
        ValueError: ``max_length`` is smaller than 1.
    """
    if max_length < 1:
        raise ValueError("max_length must be at least 1")
    if len(text) <= max_length:
        return text
    if max_length <= len(ellipsis):
        return ellipsis[:max_length]

    limit = max_length - len(ellipsis)          # room left for the text itself
    cut = text[:limit]
    next_char_starts_word = not text[limit].isspace()
    if next_char_starts_word and any(c.isspace() for c in cut):
        # We would cut a word in half: go back to the last whitespace.
        last_space = max(i for i, c in enumerate(cut) if c.isspace())
        cut = cut[:last_space]
    cut = cut.rstrip()
    if not cut:                                  # only spaces fitted
        cut = text[:limit].strip() or text.lstrip()[:limit]
    return cut + ellipsis


# ---------------------------------------------------------------------------
# 3. Mathematical calculation
# ---------------------------------------------------------------------------
# With these 12 bases, Miller-Rabin gives an exact answer for every
# n < 3,317,044,064,679,887,385,961,981 (about 3.3 * 10**24).
_MR_BASES = (2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37)
_MR_EXACT_LIMIT = 3_317_044_064_679_887_385_961_981


def is_prime(n: int) -> bool:
    """Return True if ``n`` is a prime number.

    Uses trial division by small primes, then the Miller-Rabin test with the
    first 12 primes as bases. Time: O(k * log^3 n) with k = 12 bases, instead
    of O(sqrt(n)) for plain trial division, so it stays fast for very large n.

    Exactness: the answer is exact for every n < 3.3 * 10**24
    (``_MR_EXACT_LIMIT``). Above that, a True answer means "strong probable
    prime for 12 bases" — wrong only for specially built numbers.

    Args:
        n: the integer to test. 0, 1 and negative numbers are not prime.

    Returns:
        True if prime, False otherwise.

    Raises:
        TypeError: ``n`` is not an int (bool is rejected too).
    """
    if isinstance(n, bool) or not isinstance(n, int):
        raise TypeError("n must be an int")
    if n < 2:
        return False
    for p in _MR_BASES:                 # small primes and quick divisibility
        if n == p:
            return True
        if n % p == 0:
            return False

    # Write n - 1 = d * 2**s with d odd.
    d, s = n - 1, 0
    while d % 2 == 0:
        d //= 2
        s += 1

    for a in _MR_BASES:
        x = pow(a, d, n)
        if x in (1, n - 1):
            continue
        for _ in range(s - 1):
            x = pow(x, 2, n)
            if x == n - 1:
                break
        else:
            return False                # a is a witness: n is composite
    return True
