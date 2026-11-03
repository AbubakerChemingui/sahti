# CLAUDE.md

This file gives Claude (Claude Code, the Claude desktop/web app, and the Claude
VS Code extension) context about this repository.

**Read [`AI_CONTEXT.md`](AI_CONTEXT.md) first — it is the single source of truth**
for the project summary, tech stack, structure, conventions and the safety rules.
Everything below just adds Claude-specific working notes.

## How to work in this repo

- Follow every rule in `AI_CONTEXT.md`, especially §5 (safety rules).
- Before changing behaviour, find the requirement in `docs/reference/SRS.md` (FR / NFR / AI / BR IDs) and the design in `docs/architecture.md`. If they are silent, ask instead of inventing.
- Safety code (danger signs, rules engine, dose bands, screening gate) is written test-first; the safety suite runs with the AI stubbed.
- Keep changes small and focused. Explain non-obvious choices in the PR description.
- When behaviour changes, update `docs/CHANGELOG.md` in the same change.
- Run the tests before claiming something works; report the real output.

## Useful commands

```bash
# install deps:   python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt
#                 (Windows: .venv\Scripts\activate)
# run the app:    uvicorn app.main:app --reload --app-dir backend   →  http://127.0.0.1:8000/api/v1/health
# run tests:      pytest
# lint/format:    not set up yet (ruff planned)
```

## Project-specific guidance

- The AI module (`triage`) may only return question-bank labels and illness probabilities — never medicine, dose or remedy names.
- Every API response and log line must be free of personal data; logs carry `consultationHash`, never `userHash`.
- Use the SRS error codes (`E-VAL-001`, `E-CONS-006`, …) and error body format of SRS §14.
