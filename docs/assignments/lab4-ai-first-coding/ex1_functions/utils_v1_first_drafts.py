"""First drafts returned for Prompt 1 of each function (kept to show the iteration).
Superseded by utils.py — do not import in tests."""
from typing import Any


def latest_per_key(records: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Keep the record with the largest created_at for each profile_id."""
    latest = {}
    for r in records:
        pid = r["profile_id"]
        if pid not in latest or r["created_at"] > latest[pid]["created_at"]:
            latest[pid] = r
    return list(latest.values())


def truncate_at_word(text: str, max_length: int) -> str:
    """Cut text to max_length at a word boundary and add '…'."""
    if len(text) <= max_length:
        return text
    return text[:max_length].rsplit(" ", 1)[0] + "…"


def is_prime(n: int) -> bool:
    """Trial division by 2, 3 and numbers of the form 6k ± 1 up to sqrt(n)."""
    if n < 2:
        return False
    if n < 4:
        return True
    if n % 2 == 0 or n % 3 == 0:
        return False
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6
    return True
