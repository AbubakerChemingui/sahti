# Sahti-صحتي

> An Android app that helps adults in Tunisia handle the 20 most common minor illnesses for themselves or their children. It shows natural remedies first, then safe over-the-counter medicines with exact doses, and refers to a doctor whenever something is serious or unclear.

**Team:** Abubaker ([@AbubakerChemingui](https://github.com/AbubakerChemingui)) — solo project: product owner and developer
**Course:** CS 488 — AI-First Software Engineering, MUST University
**Status:** 🚧 MVP ready for the course demo. It runs as a web app with **DRAFT demo data for 5 illnesses — not for real use**. The Flutter app, the trained models and the full set of 20 illnesses come next ([backlog](docs/backlog.md)).

---

## What it does

People with a minor illness often pick medicines without checking them against their allergies, chronic illnesses and current medicines. In Sahti, the user describes how they feel in French or Modern Standard Arabic, in their own words or by answering simple button questions. The app then suggests the likely illness with a confidence level, and a fixed rules engine selects remedies and over-the-counter medicines with exact doses that are safe for that patient's profile.

The AI-assisted part works like this:
- a fine-tuned model reads the user's own words;
- a trained classifier decides the illness and chooses the next question.

The AI never chooses a medicine or a dose.

## What the MVP covers

The MVP is a web app served by the FastAPI backend. The v1 target is the Flutter Android app; see [ADR 0004](docs/decisions/0004-mvp-web-client-and-technical-choices.md) for why. It covers the core user stories ([backlog](docs/backlog.md)):

- **Sign-up and login.** The sign-up screen has the 18+ check, consent and the disclaimer, and the language choice (Français / العربية, right-to-left) at the bottom.
- **Profiles.** You can create a profile for yourself and for children: allergies, conditions and current medicines. For a child, the app asks "Are you sure of this weight?".
- **Consultations.** "Before we start" checks come first. Then you describe how you feel in your own words, and confirm what the app understood, or you answer the button questions. You can go back one question at any time.
- **Danger notices.** URGENT says "see a doctor"; EMERGENCY says "dangerous" and gives 190 (SAMU) and 198 (civil protection). The notice stays on every screen, and the consultation continues.
- **Result.** It shows the likely illness, the confidence level and the reasons. Natural remedies come first, then over-the-counter medicines with the exact dose, schedule and maximum days. Medicines that are unsafe for the profile are listed as excluded, with the reason, and the result ends with follow-up advice. The app gives a referral when the child is under 2, the case is out of scope or the result is uncertain.
- **History.** You can re-open past consultations. A consultation left unfinished for 24 hours expires with a one-time message.

**Demo data:** cold, sore throat, tension headache, diarrhoea and heartburn. These values are made up for the demo and were **not** reviewed by a pharmacist. Every screen says so.

## Tech stack

Flutter (Android) app (v1) · web client for the MVP · Python 3.12 + FastAPI backend · SQLite (demo) / PostgreSQL (pilot) · pytest · a fine-tuned multilingual encoder and a trained classifier on our own server. See [`AI_CONTEXT.md`](AI_CONTEXT.md) and [ADR 0002](docs/decisions/0002-backend-python-fastapi.md).

## Getting started

```bash
# 1. Clone and enter the repo
git clone https://github.com/AbubakerChemingui/sahti.git
cd sahti

# 2. One-time setup (enables the git hooks) — on Windows use Git Bash
./scripts/setup.sh

# 3. Copy the environment template (your .env is never committed)
cp .env.example .env               # Windows (cmd): copy .env.example .env

# 4. Install dependencies (Python 3.10+)
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# 5. Run the app, then open http://127.0.0.1:8000/ in your browser
#    (API health check: http://127.0.0.1:8000/api/v1/health)
uvicorn app.main:app --reload --app-dir backend

# 6. Run the tests (in a second terminal, with the virtual environment active)
pytest
```

Step 2 is optional: it only turns on the git hooks for contributors.

### Try it (2 minutes)

1. Open http://127.0.0.1:8000/ and create an account. Any email works, because nothing is sent.
2. Create your profile, then click **I feel sick**.
3. Type, for example, *« J'ai mal à la gorge et de la fièvre depuis 2 jours, je ne tousse pas »*. Confirm what the app understood, then answer the questions. The result is a sore throat with a "may need a prescription" message.
4. To see a danger notice, answer **Yes** to "Do you have difficulty breathing right now?".
5. Switch to العربية at the bottom of the sign-up screen, or in Settings, to use the app in Arabic.

Data is stored in `sahti.db` in the repo folder. Delete that file to start again.

## Project structure

<!-- STRUCTURE:START (auto-generated by scripts/update-structure.sh — do not edit by hand) -->
```
.
.cursor
.cursor/rules
.cursorrules
.editorconfig
.env.example
.githooks
.githooks/pre-push
.github
.github/ISSUE_TEMPLATE
.github/copilot-instructions.md
.github/pull_request_template.md
.github/workflows
.gitignore
.vscode
.vscode/extensions.json
.vscode/settings.sample.json
AI_CONTEXT.md
CLAUDE.md
CONTRIBUTING.md
LICENSE
README.md
backend
backend/app
backend/clinical_data
backend/tests
backend/web
docs
docs/CHANGELOG.md
docs/README.md
docs/ai-usage-log.md
docs/architecture.md
docs/assignments
docs/backlog.md
docs/decisions
docs/diagrams
docs/images
docs/reference
docs/setup-report.md
docs/setup.md
mobile
mobile/README.md
pytest.ini
requirements.txt
scripts
scripts/check-docs.sh
scripts/setup.sh
scripts/update-structure.sh
```
<!-- STRUCTURE:END -->

## Documentation

- [Architecture](docs/architecture.md) — how the system is put together
- [Setup details](docs/setup.md) — full environment setup
- [Decisions (ADRs)](docs/decisions/) — why we chose what we chose
- [Requirements and design (full)](docs/reference/) — RE, SRS, SDD, decisions and quality scenarios
- [Changelog](docs/CHANGELOG.md) — what changed, when
- [Contributing / workflow](CONTRIBUTING.md) — branches, commits, PRs
- [AI assistant context](AI_CONTEXT.md) — how our AI tools are configured
- [Setup report (Lab 6)](docs/setup-report.md)
- [Backlog and MVP status](docs/backlog.md) · [AI usage log](docs/ai-usage-log.md) · [All course assignments](docs/assignments/)

## Workflow (short version)

1. Never push to `main`. Create a branch: `git checkout -b feat/short-name`.
2. Commit small, with clear messages.
3. Open a Pull Request; CI must be green before merging (solo project: self-review with the PR checklist).

Full details in [CONTRIBUTING.md](CONTRIBUTING.md).
