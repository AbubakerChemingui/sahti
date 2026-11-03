"""Illness classifier, question selection, screening gate and reasons (SRS AI-CAP-01/02, FR-16, FR-21, FR-47).

MVP model: a naive Bayes classifier whose per-illness symptom probabilities come from the
clinical bundle (`symptom_likelihoods.csv`, DRAFT demo values). It plays the role of the
"trained, fast classifier" of design ADR-04 until a model is trained on the case set (SRS §10.4).
It outputs only probabilities over illness codes — never a medicine, dose or remedy.
"""
from __future__ import annotations

import math

from app.clinical import NO, OUT_OF_SCOPE, YES, Snapshot


def probabilities(snap: Snapshot, answers: dict) -> dict:
    """Posterior P(class | answers). UNSURE and numeric answers carry no evidence."""
    oos_prior = snap.setting("outOfScopePrior")
    n = len(snap.illnesses)
    log_p = {c: math.log((1 - oos_prior) / n) for c in snap.illnesses}
    log_p[OUT_OF_SCOPE] = math.log(oos_prior)
    for question, value in answers.items():
        table = snap.likelihoods.get(question)
        if table is None or value not in (YES, NO):
            continue
        for c in log_p:
            p_yes = table[c]
            log_p[c] += math.log(p_yes if value == YES else 1 - p_yes)
    top = max(log_p.values())
    weights = {c: math.exp(v - top) for c, v in log_p.items()}
    total = sum(weights.values())
    return {c: w / total for c, w in weights.items()}


def _entropy(probs: dict) -> float:
    return -sum(p * math.log2(p) for p in probs.values() if p > 0)


def expected_gain(snap: Snapshot, answers: dict, question: str) -> float:
    """Expected reduction of entropy (bits) if `question` is asked next."""
    now = probabilities(snap, answers)
    p_yes = sum(now[c] * snap.likelihoods[question][c] for c in now)
    after_yes = probabilities(snap, {**answers, question: YES})
    after_no = probabilities(snap, {**answers, question: NO})
    return _entropy(now) - (p_yes * _entropy(after_yes) + (1 - p_yes) * _entropy(after_no))


def still_likely(probs: dict, mass: float) -> list:
    """Smallest set of illnesses whose probabilities add up to >= mass (PD-18)."""
    chosen, total = [], 0.0
    for c, p in sorted(probs.items(), key=lambda kv: kv[1], reverse=True):
        if c == OUT_OF_SCOPE:
            continue
        chosen.append(c)
        total += p
        if total >= mass:
            break
    return chosen


def missing_screening(snap: Snapshot, answers: dict, probs: dict) -> list:
    """Required screening questions not yet answered: general first, then still-likely illnesses (FR-47)."""
    required = list(snap.screening.get("ALL", []))
    for illness in still_likely(probs, snap.setting("stillLikelyMass")):
        required += [q for q in snap.screening.get(illness, []) if q not in required]
    return [q for q in required if q not in answers]


def next_step(snap: Snapshot, answers: dict, asked: set) -> dict:
    """Return {"action": "ASK", "question": code} or {"action": "CLASSIFY", "stopReason": ...}.

    Order (FR-47, FR-16): general screening first; then expected-gain questions until the stop rule;
    then the screening questions of every still-likely illness; only then CLASSIFY.
    """
    probs = probabilities(snap, answers)
    general = [q for q in snap.screening.get("ALL", []) if q not in answers]
    if general:
        return {"action": "ASK", "question": general[0]}

    confidence = max(p for c, p in probs.items() if c != OUT_OF_SCOPE)
    candidates = [q for q in snap.likelihoods if q not in answers and q not in asked]
    stop_reason = None
    if confidence * 100 >= snap.setting("stopTarget"):
        stop_reason = "target reached"
    elif not candidates:
        stop_reason = "bank exhausted"
    else:
        gains = {q: expected_gain(snap, answers, q) for q in candidates}
        best = max(gains, key=gains.get)
        if gains[best] < snap.setting("epsilon"):
            stop_reason = "no useful question"
        else:
            return {"action": "ASK", "question": best}

    missing = missing_screening(snap, answers, probs)
    if missing:
        return {"action": "ASK", "question": missing[0]}
    return {"action": "CLASSIFY", "stopReason": stop_reason}


def classify(snap: Snapshot, answers: dict) -> dict:
    """Result object of AI-CAP-02: illness or out of scope, confidence 0–100, probabilities, reasons."""
    probs = probabilities(snap, answers)
    best = max(probs, key=probs.get)
    illness_probs = {c: p for c, p in probs.items() if c != OUT_OF_SCOPE}
    top_illness = max(illness_probs, key=illness_probs.get)
    return {
        "illness": None if best == OUT_OF_SCOPE else top_illness,
        "outOfScope": best == OUT_OF_SCOPE,
        "confidence": round(illness_probs[top_illness] * 100),
        "probabilities": probs,
        "reasons": reasons(snap, answers, top_illness),
    }


def reasons(snap: Snapshot, answers: dict, illness: str, limit: int = 4) -> list:
    """Answered questions whose removal lowers the top illness's probability most (leave-one-out, FR-21)."""
    base = probabilities(snap, answers)[illness]
    drops = []
    for q in answers:
        if q not in snap.likelihoods or answers[q] not in (YES, NO):
            continue
        without = {k: v for k, v in answers.items() if k != q}
        drop = base - probabilities(snap, without)[illness]
        if drop > 0:
            drops.append((drop, q))
    return [q for _, q in sorted(drops, reverse=True)[:limit]]
