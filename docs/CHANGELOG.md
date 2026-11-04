# Changelog

All notable changes to this project. Newest at the top. Based on [Keep a Changelog](https://keepachangelog.com).

Categories: **Added**, **Changed**, **Fixed**, **Removed**.

## [Unreleased]

### Added
- **Landing page** for logged-out visitors, before sign-up or login:
  - **3D hero:** floating capsules and tablets that follow the pointer and spread out on scroll (three.js r180).
  - **Pinned "three steps" story:** a phone mock-up types a Tunisian sentence, answers a question, then shows a result (GSAP ScrollTrigger).
  - **Dose-label showcase:** the day strip lights up slot by slot.
  - **Safety section:** an example of the danger notice with the 190 and 198 numbers.
  - **Join section:** the sign-up or login form.
  - **Behaviour:** smooth scrolling (Lenis) on this page only, and language buttons in the top bar.
  - **Fallbacks:** reduced motion gives a still 3D frame and no scroll effects; without WebGL the hero is a plain gradient.
- Vendored (served locally, so the demo works offline): three.js 0.180.0 (MIT), Lenis 1.3.27 (MIT), and GSAP ScrollTrigger and SplitText 3.15.0 (GreenSock standard no-charge license).

### Changed
- **Web client redesign.** New visual system: Sidi Bou Said blue on whitewash; green only for remedies and safe medicines; red only for danger. One typeface for French and Arabic (IBM Plex Sans Arabic).
  - Welcome screen with sign-up side by side.
  - People cards on the home screen.
  - Large answer buttons with a progress bar.
  - A result headline with a confidence bar.
  - Each medicine is shown as a **dose label** with a morning/midday/evening/night strip.
  - Inline SVG icons instead of emoji.
  - Buttons show progress while a request runs.
  - One short animation on the result (GSAP), skipped when the user asks for reduced motion.
- Fonts and GSAP are served from `backend/web/` (no internet needed for the demo): IBM Plex Sans Arabic under the SIL Open Font License (`fonts/OFL-LICENSE.txt`), GSAP 3.15.0 under GreenSock's standard no-charge license.

### Changed
- README run steps: a separate Windows block that calls `.venv\Scripts\python` directly, so the steps work in PowerShell and in cmd without activating the virtual environment; `.env` and the git-hook setup moved to an optional section.

## [0.1.0] — 2026-11-03 — MVP for the course demo

### Added
- **Web client** (`backend/web/`), served at `http://127.0.0.1:8000/`, in French and Arabic (RTL). Screens: sign-up with the language choice at the bottom, login, home, profile editor, "Before we start", own words, confirmation of converted answers, questions with undo, danger notice, result, history and settings ([ADR 0004](decisions/0004-mvp-web-client-and-technical-choices.md)).
- **API** (SRS §9): auth (register, login, logout), `/me` (language, consent, delete account), reference terms, profiles (CRUD, encrypted), consultations (start, own words, confirmations, answers, undo, result, acknowledgement) and history. Errors use the SRS §14 format and codes.
- **Consultation engine:**
  - general screening first, then the screening of each still-likely illness before any result (FR-47);
  - danger signs give a persistent notice and the consultation continues (FR-17, FR-18, `I7-Q4`); danger words are confirmed before any conversion (FR-42);
  - converted answers are used only after confirmation (FR-41);
  - referrals for under 2 years, out of scope, age limits and component failure (FR-14, FR-46, NFR-17).
- **Stand-in AI** with the planned interfaces: a naive Bayes classifier with expected-information-gain question choice and leave-one-out reasons, and a keyword text reader with French/Arabic negation and a number reader.
- **Rules engine:**
  - contraindications, duplicate active ingredients and exact dose bands, with the lower band for an uncertain child weight (`I7-Q1`);
  - an uncoded medication or allergy blocks all medicines (`I6-Q2`);
  - remedies first, with their own rules (FR-45);
  - prescription-need patterns (FR-43); follow-up advice.
- **DRAFT demo clinical data** (`backend/clinical_data/demo_v1`, 5 illnesses), validated at start-up (§8.7) and refused when `SAHTI_PUBLIC_DEPLOYMENT=true`.
- **Security:** scrypt password hashing, hashed session tokens, AES-256-GCM for health data, and logs without personal data.
- **Tests:** a safety suite (`test_safety_engine.py`), bundle validation tests and end-to-end API tests (67 tests).
- **Docs:** [backlog with MVP status](backlog.md), [AI usage log](ai-usage-log.md), [course assignments](assignments/) (including Lab 4), ADR 0004, and README "What the MVP covers" and "Try it".

### Changed
- `requirements.txt`: added `cryptography`.
- `GET /api/v1/health` now reports the active data version, its review status and the model version.

### Added
- Project scaffold from the CS 488 starter template (Lab 6).
- `AI_CONTEXT.md` filled in for Sahti, with the safety rules every AI assistant must follow.
- Backend skeleton: FastAPI app with `GET /api/v1/health` (SRS API-26), settings from environment variables, 4 tests.
- Architecture summary with diagrams; ADR 0002 (Python + FastAPI, Flutter) and ADR 0003 (design-phase decisions); full requirements and design documents in `docs/reference/`.
