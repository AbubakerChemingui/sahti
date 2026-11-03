# AI Context — Single Source of Truth

> Every AI tool config in this repo (`CLAUDE.md`, `.github/copilot-instructions.md`,
> `.cursor/rules/`, `.cursorrules`) points here. Update this file in the same commit
> when the project changes.

---

## 1. Project summary

**Name:** Sahti (صحتك — "your health")
**One-liner:** An Android app that helps adults in Tunisia handle the 20 most common minor illnesses for themselves or their children (2–17). It shows natural remedies first, then safe over-the-counter medicines with exact doses, and a clear "see a doctor" whenever something is serious, unclear or out of scope.
**Primary users:** adults 18+ in Tunisia (emphasis 40+, many non-technical, weak 3G internet), in French or Modern Standard Arabic; parents answer for children.
**The AI-assisted component:** two models run on the project's own server:
1. a fine-tuned multilingual **encoder** (mmBERT-base or XLM-R-base, chosen by bake-off) that reads the user's own words into yes / no / not-mentioned answers to the question bank, each confirmed by the user;
2. a **trained, fast classifier** that decides the illness probabilities, picks the next question by expected information gain, and gives the reasons.

**The AI never chooses a medicine, dose or remedy** — a deterministic rules engine does.

Design documents (source of truth for behaviour):
- Requirements: [`docs/reference/SRS.md`](docs/reference/SRS.md) (FR / NFR / AI / BR IDs, APIs, data model, tests)
- Architecture: [`docs/architecture.md`](docs/architecture.md) · full design: [`docs/reference/SDD.md`](docs/reference/SDD.md)
- Decisions: [`docs/decisions/`](docs/decisions/) and [`docs/reference/decisions-and-quality-scenarios.md`](docs/reference/decisions-and-quality-scenarios.md) (ADR-01 – ADR-32)

## 2. Tech stack

| Layer | Choice |
|---|---|
| Mobile app | Flutter (Dart), Android first, full right-to-left Arabic (design ADR-10) — project not generated yet (`mobile/`) |
| Backend language | Python 3.12 (CI); code must also run on Python 3.10+ |
| Backend framework | FastAPI served by Uvicorn; REST JSON under `/api/v1` ([ADR 0002](docs/decisions/0002-backend-python-fastapi.md)) |
| Database | SQLite for the course demo, PostgreSQL from the pilot, one data-access layer, **no database-specific SQL** (design ADR-13) |
| Package manager | pip + venv, `requirements.txt` |
| Testing | pytest — run `pytest` at the repo root (config in `pytest.ini`) |
| AI | fine-tuned encoder (text reader) + classical trained classifier, both served on our own server; trained on free cloud GPUs (not added yet) |
| Deploy | local laptop for the course demo; free-tier hosting later (OQ-08) |

## 3. Project structure

- `backend/app/` — FastAPI application. Planned modules (SDD §2.3): `auth`, `profiles`, `consultation` (orchestrator), `danger_signs`, `triage` (AI), `rules_engine`, `clinical_data`, `history`, `audit`, `observability`.
- `backend/tests/` — pytest tests, incl. the safety suite `TC-SAFE-*` (SRS §16.2), which runs with the AI replaced by a stub.
- `mobile/` — Flutter app (to be generated).
- `docs/` — architecture, decisions (ADRs), setup, changelog; `reference/` holds the full requirements and design documents.
- `scripts/` — setup, docs check, structure generator.

## 4. Conventions the assistant MUST follow

- **Naming:**
  - Python: `snake_case` for functions and variables, `PascalCase` for classes.
  - Dart: `lowerCamelCase`.
  - API JSON fields: `camelCase` (as in SRS §9).
- **Requirement IDs:** cite the SRS ID in docstrings and test names (e.g. `"""SRS FR-28 …"""`, `test_fr28_…`).
- **Comments:** explain *why*, not *what*.
- **Dependencies:** standard library first. No new library without a note in the PR. No paid services of any kind (zero budget).
- **Secrets:** never in code, logs or the app binary — environment variables only (`.env`, see `.env.example`).
- **Tests first for safety code:** every rule, dose band, danger sign and screening question has tests before it is used (NFR-16).
- **Personal data:** never in logs, metrics or AI inputs (NFR-09, AI-02). Health fields are encrypted per field (AES-256-GCM).
- **Commits:** small, Conventional Commits style (`feat:`, `fix:`, `docs:`, `test:`, `chore:`). Update `docs/CHANGELOG.md` when behaviour changes.

## 5. What NOT to do (safety rules — non-negotiable)

- ❌ Any path where the AI outputs or chooses a medicine, dose, timing or remedy.
- ❌ Naming or dosing any prescription medicine (incl. antibiotics) — only the "see a doctor" message.
- ❌ Any calculated or interpolated dose. Exact band lookup only, by age × weight; an uncertain child weight uses the band for weight − 3 kg.
- ❌ Using a converted own-words answer before the user confirms it, or converting text before a matched danger word is confirmed.
- ❌ An ILLNESS or UNCERTAIN result before every required danger-screening question is answered (FR-47).
- ❌ Removing, hiding or lowering a danger notice once shown, by undo or by the AI. A danger sign shows a persistent notice and the consultation continues (FR-18, owner's decision `I7-Q4`).
- ❌ Hard-coding illnesses, questions, medicines, doses, rules, danger signs or thresholds. They are **data** (versioned CSV bundle).
- ❌ Inventing clinical data or presenting it as validated. The AI is never the clinical reviewer.
- ❌ External AI services, AI agents or autonomous actions.
- ❌ Voice, offline mode, photo upload, Darija or English UI (future features).
- Don't invent requirements: if the SRS is silent, leave a `TODO(abubaker):` and ask.

## 6. Glossary / domain terms

- **Profile** — one patient (the adult user, or a child 2–17 handled by a parent). Health data lives here.
- **Consultation** — one session for one profile: own words and/or button questions → result.
- **Own words** — free text the user types, converted into answers the user must confirm (FR-41).
- **Question bank** — the reviewed, bilingual list of questions. The AI may only answer or ask these.
- **Danger sign** — an answer pattern that triggers a danger notice: URGENT ("see a doctor") or EMERGENCY ("this situation is dangerous" + 190 SAMU, 198 civil protection).
- **Screening questions** — danger questions that must be answered before any result (FR-47).
- **Still-likely set** — the smallest set of illnesses reaching 90 % probability; used when confidence < 60 % (uncertain path, FR-22).
- **Dose band** — validated (medicine, age range, weight range) → dose, times per day, moments, max days. Never calculated.
- **Clinical data bundle** — versioned CSV files (illnesses, questions, danger signs, medicines, bands, rules, remedies). Imported, validated, gated by the safety suite, then activated (FR-39).
- **DRAFT / VALIDATED** — review status of a bundle. DRAFT shows a banner and is refused in a public deployment.
- **OTC** — over-the-counter medicine (no prescription needed). The only medicines Sahti may show.
- **Referral** — a "see a doctor" result with no medicines (age < 2, out of scope, failure).

---

_Last updated: 2026-11-03 by Abubaker (with Claude). Review at the start of every work session._
