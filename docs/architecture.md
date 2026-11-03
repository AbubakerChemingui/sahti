# Architecture

> Living summary of the Lab 4/5 design. The full design is [reference/SDD.md](reference/SDD.md) (v0.6) and the decisions are in [reference/decisions-and-quality-scenarios.md](reference/decisions-and-quality-scenarios.md). When code and this file disagree, fix one of them in the same PR.

## 1. Overview

Sahti is a **client–server** system: a Flutter Android app talks over HTTPS/JSON (`/api/v1`) to one Python **modular monolith** (FastAPI) with a relational database (SQLite for the course demo, PostgreSQL from the pilot). The backend has four layers:
1. an API layer;
2. application services (auth, profiles, consultation orchestrator, history, clinical data);
3. a **deterministic domain core** (danger-sign checker and rules engine, no AI);
4. an **AI module** (text reader + illness classifier), with infrastructure (repositories with field encryption, audit log, logs/metrics, scheduled jobs).

All medical content — illnesses, questions, danger signs, medicines, dose bands, rules, remedies — is **versioned data**, imported as a CSV bundle and activated only after the safety test suite passes.

## 2. Component diagram

```mermaid
flowchart LR
  user([Adult user / parent])
  admin([Administrator — command-line tool])
  subgraph phone["Android phone (client)"]
    ui["Screens SCR-02 – SCR-15"]
    vm["View models"]
    client["API client + current-question cache"]
    ui --> vm --> client
  end
  subgraph backend["Sahti backend — modular monolith"]
    api["API layer<br/>auth check · validation · rate limits"]
    subgraph app["Application services"]
      auth["Auth & consent service"]
      prof["Profile service"]
      cons["Consultation orchestrator"]
      hist["History service"]
      clin["Clinical data service<br/>import · bundle validator ·<br/>activation gate (DRAFT, coverage,<br/>model compatibility, safety suite)"]
    end
    subgraph domain["Domain core (deterministic, no AI)"]
      danger["Danger-sign checker<br/>signs · danger words · age"]
      rules["Rules engine<br/>safety filters · dose bands · remedies"]
      snap["Clinical data snapshot<br/>(active version)"]
    end
    subgraph ai["AI"]
      red["Redaction service"]
      tri["Triage service<br/>convert · screening gate · next · classify"]
      conv["Fine-tuned text converter"]
      clf["Trained illness classifier"]
      base["Rule-based baseline<br/>(evaluation only)"]
    end
    subgraph infra["Infrastructure"]
      repo["Repositories + field encryption"]
      audit["Audit log"]
      obs["Logs · basic metrics"]
      jobs["Scheduled jobs<br/>expiry · retention · token purge"]
    end
    db[("SQLite (demo)<br/>PostgreSQL (pilot)")]
    model[("Model runtime + registry<br/>(versions pinned per consultation)")]
  end
  email[["Email service (free tier)"]]
  dialer[["Phone dialer — 190"]]

  user --> ui
  admin --> api
  client -- "HTTPS JSON /api/v1" --> api
  api --> auth
  api --> prof
  api --> cons
  api --> hist
  api --> clin
  cons --> danger
  cons --> red --> tri
  cons --> rules
  tri --> conv --> model
  tri --> clf --> model
  tri -.-> base
  danger --> snap
  rules --> snap
  clin --> snap
  clin -. "bank compatibility" .-> model
  auth --> repo
  prof --> repo
  cons --> repo
  hist --> repo
  clin --> repo
  repo --> db
  cons --> audit
  clin --> audit
  auth --> audit
  jobs --> repo
  auth -. "password reset" .-> email
  ui -. "tel: link" .-> dialer
```

## 3. Key modules

| Module (planned package) | Responsibility | Requirements | Lives in |
|---|---|---|---|
| API layer | Auth check, consent/disclaimer gates, schema validation, rate limits, error format | NFR-08, SEC-01 – SEC-09 | `backend/app/` (`main.py` today) |
| `auth` | Accounts (email + password), tokens, consent, disclaimer, deletion | FR-01 – FR-05 | `backend/app/auth/` |
| `profiles` | Patient profiles, encrypted health fields, uncertain child weight | FR-06 – FR-12, FR-44 | `backend/app/profiles/` |
| `consultation` | Orchestrator: every answer → store → danger check → next step; pending confirmations; undo | FR-13 – FR-23, FR-41 – FR-43, FR-47 | `backend/app/consultation/` |
| `danger_signs` | Deterministic danger signs, danger words, age rule; persistent notice | FR-14, FR-17, FR-18, FR-42, AI-09 | `backend/app/danger_signs/` |
| `triage` (AI) | Redaction, text reader, classifier, screening gate, stop rule, question selection, reasons | AI-01 – AI-20, FR-16, FR-21, FR-47 | `backend/app/triage/` |
| `rules_engine` | Safety filters, dose bands, remedies, uncertain path, prescription patterns, remedies first | FR-22, FR-24 – FR-34, FR-43, FR-45, FR-46 | `backend/app/rules_engine/` |
| `clinical_data` | Bundle import, validation, activation gate (DRAFT, coverage, model compatibility, safety suite) | FR-39, FR-40, NFR-15, NFR-16 | `backend/app/clinical_data/` |
| `history`, `audit`, `observability` | Past consultations; append-only audit; logs and metrics without personal data | FR-35 – FR-37, FR-40, NFR-09 | `backend/app/…` |
| Mobile app | Screens SCR-02 – SCR-15, RTL Arabic, current-question cache | FR-38, NFR-11 – NFR-14 | `mobile/` |

## 4. Data model

Full attributes in [SRS §8](reference/SRS.md). Overview:

```mermaid
erDiagram
  USER ||--o{ CONSENT : gives
  USER ||--o{ DISCLAIMER_ACK : acknowledges
  USER ||--|{ PATIENT_PROFILE : owns
  PATIENT_PROFILE ||--o{ PROFILE_ITEM : lists
  PATIENT_PROFILE ||--o{ CONSULTATION : has
  CONSULTATION ||--o{ CONSULTATION_ANSWER : contains
  CLINICAL_DATA_VERSION ||--o{ CONSULTATION : "used by"
  CLINICAL_DATA_VERSION ||--|{ ILLNESS : defines
  CLINICAL_DATA_VERSION ||--|{ QUESTION : defines
  CLINICAL_DATA_VERSION ||--|{ MEDICINE : defines
  ILLNESS ||--o{ DANGER_SIGN : "has"
  ILLNESS ||--|{ SCREENING_QUESTION : "screened by"
  QUESTION ||--o{ SCREENING_QUESTION : "used as"
  ILLNESS }o--o{ MEDICINE : "treated by"
  ILLNESS }o--o{ NATURAL_REMEDY : "eased by"
  ILLNESS ||--o{ PRESCRIPTION_PATTERN : "flags"
  MEDICINE ||--|{ DOSE_RULE : "dosed by"
  MEDICINE ||--o{ CONTRAINDICATION_RULE : "blocked by"
  USER {
    uuid id PK
    string email
    enum language
    enum role
  }
  PATIENT_PROFILE {
    uuid id PK
    uuid userId FK
    enum relation
    string fullName "encrypted"
    date dateOfBirth "encrypted"
    decimal weightKg "encrypted"
    int version
  }
  CONSULTATION {
    uuid id PK
    uuid profileId FK
    int dataVersion FK
    enum status
    enum pendingStep
    string modelVersion
    enum resultType
    string illnessCode
    int confidence
  }
  DOSE_RULE {
    string medicineCode FK
    int minAgeMonths
    int maxAgeMonths
    decimal minWeightKg
    decimal maxWeightKg
    decimal doseQuantity
    enum doseUnit
    int timesPerDay
    int maxDays
  }
```

## 5. Key flows

**Button answers → result (SD-01, UC-03).** Every answer goes through the same path: store, then danger check, then the next step. Danger questions come first (screening gate). A danger sign adds a notice that stays on every later screen.

```mermaid
sequenceDiagram
  autonumber
  actor U as User
  participant App as Mobile app
  participant API as API layer
  participant O as ConsultationOrchestrator
  participant R as ConsultationRepository
  participant D as DangerSignChecker
  participant T as TriageService
  participant M as IllnessClassifier
  participant RE as RulesEngine
  U->>App: taps an answer
  App->>API: POST /consultations/{id}/answers (Idempotency-Key)
  API->>O: submitAnswer(id, questionCode, value)
  Note over O: afterAnswersAdded() — same path for button<br/>answers and confirmed own-words answers
  O->>R: save answer (transaction, optimistic lock)
  O->>D: check(answers, profileSnapshot)
  alt danger sign found
    D-->>O: sign codes + level
    Note over O: raiseDanger(): dangerLevel only goes up ·<br/>audit DangerNotice · every following step and the result<br/>carry the notice (EMERGENCY: 190, 198) · consultation continues (ADR-31)
  else none
    D-->>O: no danger sign
  end
  O->>T: nextStep(answers, profile)
  T->>M: predict(de-identified answers)
  M-->>T: calibrated probabilities
  Note over T: validate output · ScreeningGate.missing() first:<br/>unanswered general or still-likely-illness screening<br/>questions are asked before anything else (FR-47) ·<br/>StopPolicy.shouldStop() · QuestionSelector.best()<br/>(expected information gain, same classifier) ·<br/>ReasonExplainer at the result
  alt screening incomplete, or not confident enough and a useful question remains
    T-->>O: ASK questionCode
    O-->>API: step QUESTION
    API-->>App: next question
  else screening complete and stop rule reached
    T-->>O: valid Result(illness, confidence, probabilities, reasons)
    O->>RE: recommend(result, profileSnapshot, snapshot)
    Note over RE: candidates (approved, OTC) → safety filters →<br/>dose band → remedies → prescription patterns →<br/>remedies first · uncertain path if confidence < 60
    RE-->>O: Recommendation (+ exclusions)
    O->>R: complete(consultation, result)
    O-->>API: step RESULT
    API-->>App: RESULT
    App->>API: GET /consultations/{id}/result
    API-->>App: danger notice (if any) on top, then remedies, medicines, exclusions, follow-up, disclaimer
    Note over API,App: if the stored result cannot be read or assembled:<br/>REFERRAL_FAILURE view with guidance (E-SYS-003), 0 medicines
  end
```

**Own words (SD-02, UC-03/UC-04).** A matched danger word is confirmed **before** any conversion. Converted answers are used only after the user confirms them.

```mermaid
sequenceDiagram
  autonumber
  actor U as User
  participant App as Mobile app
  participant O as ConsultationOrchestrator
  participant D as DangerSignChecker
  participant T as TriageService
  participant M as FineTunedConverter
  participant A as Audit log
  U->>App: types "I can't breathe and my lips are swelling"
  App->>O: POST /description {text} (API-27)
  O->>D: scanText(raw text)
  alt danger word found
    D-->>O: danger sign DS-BREATHING
    Note over O: pendingStep = DANGER_CONFIRMATION<br/>no conversion yet · API-28 refused (E-CONS-006)
    O-->>App: confirmation question for DS-BREATHING only
    U->>App: answers the confirmation
    App->>O: POST /answers (DS-BREATHING question) (API-18)
    O->>D: check(answers, profile)
    alt "Yes" or "Not sure"
      D-->>O: EMERGENCY
      O->>A: DangerNotice event (sign code only)
      O-->>App: danger notice: "this situation is dangerous" · 190 · 198
      U->>App: "I understand" (or calls)
      Note over O: dangerLevel = EMERGENCY, kept to the end ·<br/>consultation continues (ADR-31, I7-Q4)
    else "No" to every matched sign
      Note over O: danger_word_denied logged (no text)
    end
    Note over O: pendingStep = NONE → conversion below
  end
  O->>T: convert(stored text, profile)
  Note over T: RedactionService removes profile names,<br/>first-name lexicon words, phone numbers and emails
  T->>M: convert(redacted text, question bank)
  M-->>T: CONVERTED labels (+ NumberReader values)
  Note over T: OutputValidator: schema and bank codes
  T-->>O: valid items
  Note over O: pendingStep = CONVERTED_CONFIRMATION<br/>other answers refused (E-CONS-006)
  O-->>App: items to confirm (API-27 response, or CONFIRM_CONVERTED step after a denial)
  U->>App: ✓ / ✗ on each item
  App->>O: POST /description/confirmations (API-28)
  Note over O: afterAnswersAdded(): store only confirmed items<br/>(source = CONVERTED_CONFIRMED) · omitted items = rejected ·<br/>pendingStep = NONE
  O->>D: check(all answers, profile)
  alt danger sign in confirmed answers
    D-->>O: danger sign
    Note over O: raiseDanger() → notice now and on every later step
  else none
    D-->>O: no danger sign
  end
  O->>T: nextStep(answers, profile)
  Note over T: ScreeningGate: required screening questions<br/>are asked before any RESULT (FR-47)
  T-->>O: next question (screening first) or RESULT
  O-->>App: step (+ danger notice if dangerLevel ≠ NONE)
```

Other diagrams (classes, clinical data, data update, screen flow): PNG files in [`docs/diagrams/`](diagrams/) and Mermaid sources in [reference/SDD.md](reference/SDD.md).

## 6. The AI-assisted component

| Model | What goes in | What comes out | If it fails |
|---|---|---|---|
| **Text reader** — fine-tuned multilingual encoder (mmBERT-base vs XLM-R-base, bake-off) | Own-words text with names, phone numbers and emails removed; the question bank | One yes / no / not-mentioned label per bank question (precision ≥ 0.90); numbers read by fixed patterns | Timeout (3 s) or invalid output → fall back to button questions (E-AI-004) |
| **Illness classifier** — fast trained classifier (e.g. logistic regression / gradient boosting), calibrated | Age band, sex, pregnancy, language, confirmed answers (no identity data) | Probabilities over the 20 illnesses + out-of-scope, a confidence of 0–100, 2–4 reasons; next question by expected information gain | Timeout (2 s), exception or invalid output → `REFERRAL_FAILURE`, no medicines (NFR-17) |

Both models run in the backend on our own server; no text or health data goes to an external AI service. Neither model can produce a medicine, dose or remedy: the rules engine chooses those from validated data. Not built yet: the base model is chosen by the bake-off (OQ-07), and the training data doesn't exist yet.

## 7. Known trade-offs / open questions

- **No clinical data yet** (OQ-01 – OQ-05): the code can be built and tested with fixture data only; every bundle is DRAFT until a pharmacist validates it.
- **Danger sign does not stop the consultation** (design ADR-31, owner's decision `I7-Q4`): the notice persists, but medicines can be shown under it — risk RE R-17, to review with the clinical reviewer.
- **No measurements yet**: latency and model size figures are estimates until the bake-off (AR-1, AR-2).
- **SQLite → PostgreSQL** later: no database-specific SQL allowed until then.
- **Flutter project** not generated yet; CI runs backend tests only.
