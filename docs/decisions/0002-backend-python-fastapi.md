# 2. Backend in Python with FastAPI (app in Flutter)

- **Status:** Accepted (2026-11-03, product owner — Lab 6; was Proposed as design ADR-14 / SRS PD-03)
- **Date:** 2026-11-03

## Context

- The AI components (fine-tuned text reader, trained classifier) are trained and served with the Python ecosystem; serving them from another language would need a second runtime or bindings (design ADR-14).
- One developer, zero budget, a deadline: one server language keeps the work small (RE C-01, C-02, C-04).
- The API is REST/JSON with about 29 endpoints and schema validation on every request (SRS §9, SEC-08).
- The mobile app is already decided: Flutter, Android first, iPhone later, right-to-left Arabic (design ADR-10, `I4-Q4`).
- Alternatives considered in the design: Node.js (Express/NestJS) and Java/Kotlin (Spring) — both rejected (two server languages, or a heavier setup).

## Decision

The backend is **Python (3.12 in CI, 3.10+ supported) with FastAPI**, served by Uvicorn, tested with **pytest**. The mobile app is **Flutter**. The database is SQLite for the demo and PostgreSQL from the pilot (design ADR-13).

## Consequences

- ✅ Models and API share one language; the safety suite can call the orchestrator directly with a stubbed AI.
- ✅ FastAPI validates request bodies from type hints, which matches SEC-08, and generates the OpenAPI document that NFR-19a asks for.
- ⚠️ Python web servers need care with concurrency (worker processes) at pilot scale (100 concurrent consultations, NFR-05).
- ⚠️ Two languages in the repo (Python, Dart): the CI must run both test suites once the Flutter app exists.
- Reversal cost: high for the backend (rewrite), so revisit only if a measured requirement fails.
