# 4. MVP: web client, stand-in models, DRAFT demo data and technical choices

- **Status:** Accepted
- **Date:** 2026-11-03

## Context

The course requires a runnable MVP covering the core user stories, which can be installed by following the README alone, plus a demo video (deadline 2026-11-04). The v1 design targets a Flutter Android app (design ADR-10), a fine-tuned text reader chosen by a bake-off (OQ-07) and a classifier trained on a case set (SRS §10.4). None of these can be built, trained and validated in the time left. There is also no pharmacist-reviewed clinical data yet (OQ-01 – OQ-05).

## Decision

1. **Web client for the MVP.** A plain HTML/CSS/JavaScript client (`backend/web/`) is served by the FastAPI backend at `http://127.0.0.1:8000/`. It uses the same API (SRS §9) that the Flutter app will use. Flutter stays the v1 target.
2. **Stand-in AI with the same interfaces** (the AI still never names a medicine, dose or remedy):
   - *classifier and question choice:* naive Bayes. Per-illness symptom probabilities come from the clinical bundle (`symptom_likelihoods.csv`). The next question is the one with the highest expected information gain. The engine stops at 85 % confidence, when the bank is exhausted, or when the best gain is below 0.01 bits. Reasons are found by leave-one-out;
   - *own-words reader:* the rule-based keyword baseline of AI-06 (`reader_keywords.csv`), with French and Arabic negation handling. A deterministic number reader handles durations;
   - both are replaced by the trained models once OQ-07 and §10.4 are done.
3. **DRAFT demo data.** The bundle `backend/clinical_data/demo_v1` has 5 illnesses: cold, sore throat, tension headache, diarrhoea and heartburn. Its `reviewStatus` is `DRAFT`, and every screen shows "DEMO DATA — NOT FOR REAL USE". The values are illustrative and have not been reviewed by a pharmacist. With `SAHTI_PUBLIC_DEPLOYMENT=true`, the server refuses the bundle (FR-39), and every data endpoint returns E-DATA-002.
4. **Security choices for the MVP:**
   - passwords: scrypt from the Python standard library (OWASP parameters N=2^17, r=8, p=1) instead of Argon2id. This avoids a native dependency;
   - sessions: an opaque random token stored as a SHA-256 hash, with a 12 h lifetime. There is no refresh token yet (API-03 is deferred);
   - health data: profiles and consultation state are stored with AES-256-GCM (`cryptography` package). The key comes from `SAHTI_FIELD_ENCRYPTION_KEY`;
   - logs: method, path with ids hashed, status and latency only. They never contain request bodies.
5. **Deferred in the MVP (still required for v1):**
   - refresh tokens and rate limits;
   - `Idempotency-Key` handling;
   - the admin import and activation API (API-22 – API-25) and the activation gate. The bundle is loaded at start-up and validated with the same §8.7 checks;
   - the first-name lexicon for redaction. Only the profile names, emails and phone numbers are removed;
   - one-question-per-step profile editing;
   - the password-reset flow (OQ-13).
6. **New error code [Proposed]:** `E-CONS-004` (404, profile not found or not owned). The SRS only says "404" for this case.

## Consequences

- The MVP can be installed with `pip install -r requirements.txt` and run with one command, with no Android SDK. It can be demonstrated in any browser, in French and in Arabic (RTL).
- Safety behaviour is implemented in the backend and covered by the safety suite (`backend/tests/test_safety_engine.py`), so it carries over to the Flutter client unchanged:
  - danger notices that persist and are never removed;
  - the screening gate;
  - confirmation of own-words answers before use;
  - exact dose bands, with the lower band for an uncertain child weight;
  - contraindications, and no medicine when a profile item is uncoded;
  - referrals.
- The stand-in models are much weaker than the planned ones, especially the keyword reader. Classification quality figures from the MVP must not be reported as model results.
- The demo data must never be used for real advice. Replacing it needs a pharmacist-reviewed `VALIDATED` bundle (§8.7 rule 8).
- A web client and a Flutter client must be kept in step until the web client is retired.
