---
tags: [projects/sahti, sahti/design]
created: 2026-11-03
---
# SDD — Architecture Decisions and Quality Scenarios

**Version:** 0.6 · **Date:** 2026-11-03 · **v0.6:** product owner's own review (LOG round 7): ADR-31 danger notice without stopping (`I7-Q4`, against the analyst's recommendation), ADR-32 undo of the last answer; QAS-01′ and ASR-01 reworded; risk AR-8 · **v0.5:** fixes from [[SDD — Evaluation Run 1]] (EV1, `I6-Q0`): corrected scenarios QAS-01′, -05′, -06′, -09′, -12′ and a clarified QAS-03; ADR-19 – ADR-30 added; second rejected alternatives for ADR-07, ADR-16, ADR-18; ADR-06/ADR-07 status aligned with SRS PD-13/PD-16; TriageModel references replaced · **v0.4:** quality checklist applied (negative consequences on every ADR; ADR-14 – ADR-18 added; quality report updated) · **Companion to:** [[SDD — Software Design Document]] v0.6 · **v0.3:** round 5 (ADR-13 database, trims, photos → v2) · **v0.2:** decisions of round 4 (LOG I4-Q1 – I4-Q5) recorded; C-1 and C-2 resolved.
**Audience:** course instructor and jury (Labs 4–5) **[ASSUMPTION — audience not confirmed]**; secondarily the product owner deciding the open ADRs.
**Decision this enables:** ADR-03, -04, -05, -10, -13 decided on 2026-11-03; photo feature → v2 (RE F-06). Earlier: the 4 open ADRs were decided on 2026-11-03 (ADR-03, ADR-04, ADR-05, ADR-10). Remaining: approve the Proposed decisions (§8 C-3) and choose the base model to fine-tune (OQ-07).

**Labels.** **FACT** = stated in a source, cited as *document §section* (RE = [[RE — Requirements Elicitation Document]] v0.4, SRS = [[SRS — Software Requirements and System Specification]] v0.4, SDD = [[SDD — Software Design Document]] v0.6, EV1 = [[SDD — Evaluation Run 1]], DR = [[SDD — Design Review 1]], LOG = [[RE — Interview Log]]). **INFERENCE** = my reasoning from facts. **ASSUMPTION** = unverified. **RECOMMENDATION** = my judgement. **[ESTIMATE]** = a number with its estimation method stated. **[UNKNOWN]** = no source; the resolution is named.

---

## 1. Deliverable and acceptance criteria
- Architecturally significant requirements (ASRs) derived from the SRS, each with a six-part quality-attribute scenario and a response measure taken from the SRS.
- One ADR per architectural decision, each with ≥ 2 rejected alternatives, consequences, reversal cost and status.
- Sensitivity points, trade-off points, risks and non-risks; view audiences; interface failure behaviour; data ownership gaps.
- Traceability of every SDD element to an ASR or constraint, with orphans listed; a complexity bill.
- Cross-document conflicts flagged, not resolved silently.

## 2. Inputs and known gaps
**Inputs:** RE v0.4, SRS v0.4, SDD v0.6, DR, EV1, LOG (rounds 1–7), the Lab 4 and Lab 5 documents.
**Gaps:**
- No ASR catalogue exists in the course material or the project; §3 is **derived** (INFERENCE).
- No measured inference speed, size or accuracy for any candidate model: base model not chosen (SRS §19.6, OQ-07). Every latency number below is an [ESTIMATE].
- Decisions D-1 and D-2: answered 2026-11-03 (ADR-03, ADR-04).
- Hosting (OQ-08) is open; sign-up method decided (ADR-17), free email service still open (OQ-13 remainder).

---

## 3. Architecturally significant requirements (ASRs)

ASRs are the requirements that most constrain the architecture. Selection is INFERENCE: requirements whose failure would force a structural change, or cause harm.

| ASR | Quality attribute | Driven by (FACT) | Why architecturally significant (INFERENCE) |
|---|---|---|---|
| ASR-01 | Safety — danger notice | SRS FR-17, FR-18, FR-42, FR-47, BR-02, AC-08, AC-25, AC-30 | Must hold on every input path (buttons and own words) and whatever the AI returns; since `I7-Q4` the notice does not stop the consultation |
| ASR-02 | Safety — AI containment | SRS AI-03, AI-08, BR-06, BR-16; LOG K3, I2-Q1 | Decides where the AI sits and what it may influence |
| ASR-03 | Safety — fail-safe | SRS NFR-17, BR-15, AC-24 | Every component needs a defined failure outcome |
| ASR-04 | Performance on weak networks | SRS NFR-01, NFR-02, NFR-02a, NFR-03 | Bounds the number of model calls and round trips per step |
| ASR-05 | Privacy of health data | SRS NFR-07, NFR-09, NFR-10, AI-02, AI-16, FR-44 | Decides where data is encrypted, what reaches the AI, what is logged |
| ASR-06 | Modifiability of clinical content | SRS FR-39, NFR-15, PD-16; LOG I3-Q1 | 20 illnesses now, more later, without code changes |
| ASR-07 | Testability / evaluability | SRS NFR-16, AI-06, AC-19, AC-22 | Safety suite must run without the model; model must be comparable to a baseline |
| ASR-08 | Usability for non-technical users, FR/AR | SRS NFR-11 – NFR-14, AI-11; LOG I3-Q15 | Drives the input mode (own words + buttons) and RTL |
| ASR-09 | Cost and operability | SRS NFR-24; RE C-01, C-04, C-08 | Zero budget, one developer, ~6 GB free disk |

---

## 4. Quality-attribute scenarios (six-part)

Response measures are FACTS from the SRS unless labelled. A prime (′) marks a scenario corrected after EV1 §2.

| QAS | ASR | Source | Stimulus | Environment | Artifact | Response | Response measure |
|---|---|---|---|---|---|---|---|
| QAS-01′ | ASR-01 | Patient or parent | Answers a question, or confirms an own-words answer, that matches a danger sign; or reaches the stop target before any danger question | Any point in the consultation; any model confidence | ConsultationOrchestrator `afterAnswersAdded()`, DangerSignChecker, ScreeningGate | Danger notice at once (EMERGENCY: 190 and 198), kept on every later step and on the result; consultation continues (`I7-Q4`); no result before screening | 100 % of TC-SAFE-DANGER and TC-SAFE-DANGERWORD cases show the notice at the triggering step and on every later step and the result, and no case loses it (undo, AI output) (SRS AC-08, AC-25); **no RESULT is produced before every screening question of the still-likely illnesses is answered** (SRS FR-47, AC-30; EV1) |
| QAS-02 | ASR-01 | Patient | Types a danger phrase ("I can't breathe") in own words | Model returns no danger-related answer, or times out | DangerSignChecker `scanText()` | Danger confirmation asked before any conversion is used | 100 % of lexicon entries in FR and MSA trigger the confirmation (SRS FR-42, TC-SAFE-DANGERWORD) |
| QAS-03 | ASR-02 | Fine-tuned model | Output names a medicine, an unknown code, or free text | Normal operation, any model version | OutputValidator | Output rejected → REFERRAL_FAILURE (classification) or fallback to questions (conversion) | 0 medicine names or doses in **validated outputs that reach the user or the rules engine**, on ≥ 50 sampled outputs + the full test set; 100 % schema-invalid raw outputs rejected (SRS AI-17, TC-AI-01, TC-AI-06). Clarified after EV1: "outputs" means validated outputs; raw outputs are counted separately (relevant only to a generative reader) |
| QAS-04 | ASR-03 | Model runtime | Crashes or exceeds its timeout | During a consultation step | TriageService, ConsultationOrchestrator | REFERRAL_FAILURE, 0 medicines | Within 10 s, in 100 % of fault-injection runs per component (SRS NFR-17, TC-REL-01) |
| QAS-05′ | ASR-04 | Patient on a 3G-profile network | Submits an answer | **Demo:** 1 worker, SQLite, 1 user on the laptop · **Pilot:** PostgreSQL, 100 concurrent consultations | API-18 path | Next question displayed | Demo: server-side p95 ≤ 800 ms (SRS NFR-02a, TC-PERF-04). Pilot: p95 ≤ 3 s end-to-end and server-side p95 ≤ 800 ms at 100 concurrent (SRS NFR-01, NFR-05, TC-PERF-05) (split after EV1; ADR-13) |
| QAS-06′ | ASR-04 | Patient on 3G | Submits an own-words description | Normal load | API-27 path | Converted answers displayed for confirmation | p95 ≤ 5 s on the 3G profile (SRS NFR-02b, `I6-Q9`) with conversion precision ≥ 0.90 (SRS AI-20) |
| QAS-07 | ASR-05 | Any consultation | Profile, answers and own-words text processed | Normal operation, incl. errors | Repositories, RedactionService, logging, audit | No personal data in logs, metrics or AI inputs (names redacted best effort); P3 fields encrypted at rest; audit actor unlinkable after deletion | 0 hits of seeded marker values (incl. third-party names, EV1) in logs and outbound payloads; P3 unreadable in a raw database dump (SRS TC-SEC-03, TC-SEC-05, TC-SEC-06) |
| QAS-08 | ASR-06 | Administrator | Adds an illness or corrects a dose band | Production, consultations open | ClinicalDataService, SafetySuiteRunner, ModelRegistry, SnapshotProvider | Import → validate → activation gate (DRAFT, coverage, compatibility, suite) → activate; open consultations keep their version | < 30 min, 0 code changes, 0 app releases (SRS NFR-15); 100 % safety suite with full coverage before activation (SRS NFR-16, FR-39) |
| QAS-09′ | ASR-07 | Developer | New model version or new clinical data | CI / evaluation | `TextConverter` and `IllnessClassifier` interfaces (Strategy), safety suite with a stub | Same pipeline runs with the model and with the baseline; safety suite runs without the model | Safety suite 100 % (AC-19); macro-F1 with 95 % CI reported for both (SRS AI-05, AI-06) |
| QAS-10 | ASR-08 | First-time user aged 40+ who has never created an online account | Installs the app and needs advice | Phone, French or Arabic | Screens SCR-02, SCR-05, SCR-13, SCR-14 | Completes sign-up, profile and a consultation | ≥ 4 of 5 complete sign-up and profile without help; median consultation ≤ 5 min; SUS ≥ 75 (SRS NFR-11, NFR-12) |
| QAS-11 | ASR-08 | Arabic-speaking user | Uses the app in MSA | Normal operation | Screens, conversion model | Full RTL; digits 0–9 for doses; conversion as good as French | FR–AR gap ≤ 5 points on macro-F1 and conversion precision (SRS AI-11, NFR-14) |
| QAS-12′ | ASR-09 | Product owner | Runs the course demo for a month | Laptop, free tiers | Whole system | System runs | Running cost 0 per month (SRS NFR-24); model files ≤ 2 GB (AR-2) and total footprint **measured** on the demo laptop (replaces "fits in the free disk", EV1) |

---

## 5. Architecture decision records

Status: **Accepted** = decided by the stakeholder (cited); **Proposed** = design choice awaiting approval; **Open** = needs a decision now.

### ADR-01 — Architectural style
- **Context:** stored profiles and history (SRS FR-35); solo developer, zero budget (RE C-01, C-04); 100 concurrent consultations (SRS NFR-05).
- **Decision:** client–server; backend as a layered modular monolith (SDD §2.1). **Status: Proposed** (SRS PD-01).

| Option | ASR-04 Performance | ASR-07 Testability | ASR-09 Cost/operability | Verdict |
|---|---|---|---|---|
| **Modular monolith** | One process; no network hops between modules | Modules tested in isolation in one code base | One deployable; free-tier friendly (INFERENCE) | Chosen |
| Microservices | Extra network hop per module call | Contract tests needed | Several deployables, monitoring, networking — conflicts with C-01/C-04 (INFERENCE) | Rejected |
| Backend-as-a-service + serverless functions | Cold starts on free tiers **[UNKNOWN — vendor-specific]** | Rules engine split across functions | Vendor lock-in; free-tier limits **[UNKNOWN]** | Rejected |

- **Consequences:** + simplest to build and defend; − one bad deploy affects everything; scaling is vertical first.
- **Reversal cost:** Medium — module boundaries (SDD §2.3) allow extracting a service later (INFERENCE).

### ADR-02 — Where the AI sits (containment)
- **Context:** LOG K3 (rules engine has the final say), I2-Q1 (no prescription medicines named), SRS AI-03, BR-06.
- **Decision:** the AI converts text and predicts illness probabilities; deterministic code decides danger, medicines, doses and remedies. **Status: Accepted** (LOG K3, I2-Q1).

| Option | ASR-01/02 Safety | ASR-07 Testability | Legal exposure | Verdict |
|---|---|---|---|---|
| **AI proposes, rules decide** | AI cannot cause a medicine to appear | Safety suite runs with a stub | App never prescribes (BR-16) | Chosen |
| AI recommends medicines, rules post-filter | A filter gap = unsafe output | Safety depends on the model | Higher (INFERENCE) | Rejected |
| AI only | No deterministic guarantee | Untestable for 100 % recall | Highest | Rejected |

- **Consequences:** + safety provable by tests; − medicines limited to what the clinical data contains.
- **Reversal cost:** High — and reversal is not recommended.

### ADR-03 — Keeping question selection fast (D-1) — **Accepted** (LOG I4-Q1: option a)
- **Context:** expected-information-gain selection needs ≈ (allowed questions × answer values) predictions per step. [ESTIMATE: 100 questions × 3 values = 300 predictions; at an assumed 20–50 ms per fine-tuned-model call on a laptop CPU → 6–15 s per step. Method: count × per-call time; per-call time **[UNKNOWN]** until the base model is chosen.] Budget: 800 ms server-side (SRS NFR-02a).

| Option | ASR-04 Performance | Accuracy of question choice | Complexity | Consistency with SRS |
|---|---|---|---|---|
| **(a) A fast trained model ranks questions; the fine-tuned model is not called per step** — chosen. With ADR-04 this fast model *is* the illness classifier | 300 × < 1 ms ≈ within budget [ESTIMATE; per-call time of a classical classifier on structured answers, not benchmarked] | Ranking and decision by the same model | No extra model (ADR-04) | SRS updated (C-1 resolved) |
| (b) Fine-tuned model, but only the top 10–15 candidate questions | 30–45 calls × 20–50 ms = 0.6–2.3 s [ESTIMATE] — may exceed 800 ms | Candidate pre-filter may drop the best question | Needs a pre-filter rule | Consistent with SRS |
| (c) Fine-tuned model is itself a small, fast classifier (batched calls) | Feasible if one batched call of 300 inputs ≤ 800 ms **[UNKNOWN]** | Same model chooses and decides | Lowest | Consistent with SRS |

- **Outcome:** accepted (a). Combined with ADR-04, question choice, decision and reasons all use the same trained classifier.
- **Negative consequences:** Questions are chosen by a classical classifier, so question choice can only be as good as that classifier on unseen symptom combinations [INFERENCE]; the fine-tuned model's language ability does not help question choice.
- **Reversal cost:** Low — `QuestionSelector` hides the choice (SDD §3.1b).

### ADR-04 — One fine-tuned model or two (D-2) — **Accepted** (LOG I4-Q2: fine-tuned model reads text; a simpler trained classifier decides)
- **Context:** the model must (1) read free text into answers and (2) classify structured answers (SRS AI-01, AI-19, AI-20); target precision ≥ 0.90 for (1) (LOG I3-Q22).

| Option | Accuracy | Training effort (solo, free GPU) | Disk (~6 GB free, RE C-08) | Verdict |
|---|---|---|---|---|
| One model, two outputs | Tasks compete during training [INFERENCE] | One training run | One set of weights | Viable |
| Two models from the same base | Each tuned to its task [INFERENCE] | Two runs | Two sets of weights, or one base + two small adapters [INFERENCE] | Viable |
| Fine-tuned model for text only; classical classifier for classification | Classification can be very good on structured answers [INFERENCE]; meets "fine-tuned model" only for (1) | Lowest | Smallest | Needs your confirmation that it fits I2-Q5/I2-Q6 |

- **Outcome:** accepted option 3. Consequences: + fast, explainable, small classifier; + one fine-tuned model to train (text reading), within free GPU and disk limits [INFERENCE]; − the fine-tuned model is no longer involved in deciding the illness — the course's AI contribution is the text reader plus the trained classifier (RE AI-19 updated). Classifier family (e.g. logistic regression, gradient-boosted trees) chosen by validation results [Proposed].
- **Reversal cost:** Medium — the `TextConverter` and `IllnessClassifier` interfaces already separate `convert()` and `predict()`.

### ADR-05 — Where the model runs — **Accepted** (LOG I4-Q3: own server)
- **Context:** privacy (SRS AI-16), zero cost (NFR-24), weak internet (NFR-01), modest phones of target users [ASSUMPTION — no source on target users' phones].

| Option | Privacy | Cost | Performance | Verdict |
|---|---|---|---|---|
| **Own backend (local for the demo)** | Data stays in the backend | 0 for the demo; hosting later [UNKNOWN] | One server call per step | Recommended |
| On the phone | Best: data never leaves the phone | 0 | Depends on phone; app size grows; NFR-20 ≤ 50 MB at risk [INFERENCE] | Rejected for v1 |
| External AI API | Data leaves the backend; terms must forbid retention (AI-16) | Free tiers have limits [UNKNOWN — vendor-specific] | Network hop | Rejected for v1 |

- **Negative consequences:** The project must run and secure its own server (hosting still open, OQ-08); no phone works without internet (accepted: no offline mode, LOG I1-Q6).
- **Reversal cost:** Low — `FineTunedConverter` is an adapter (SDD §7.1).

### ADR-06 — Clinical content as versioned data
- **Decision:** clinical content is an imported, validated, immutable data bundle; illnesses are rows (SRS PD-07, PD-16). **Status: Accepted** for "update without code" (LOG I2-Q18, I3-Q1); illnesses as rows (SRS PD-16) and the bundle format (PD-07) **Proposed** — aligned with SRS §19.6 after EV1 X-11.

| Option | ASR-06 Modifiability | ASR-01 Safety | Effort |
|---|---|---|---|
| **Versioned CSV bundle + safety gate** | No code change (NFR-15) | Safety suite before activation (DR-04 fix) | Import validator to build |
| Rules hard-coded | Code change per update | Reviewable in code, but needs a developer | Lowest now, highest later |
| Admin CRUD screens editing live data | No code change | Edits bypass a release gate unless added [INFERENCE] | Most UI work |

- **Negative consequences:** Every content change needs a full bundle, a validation pass and a safety-suite run; small fixes are slower than editing a row [INFERENCE].
- **Reversal cost:** Medium.

### ADR-07 — Danger detection outside the AI
- **Decision:** deterministic rules on answers + deterministic lexicon on text (SRS AI-09, FR-42). **Status: Accepted** (SRS AI-09, derived from LOG K3 and I1-Q11; FR-42 derived from I1-Q11, I2-Q5). SRS PD-13 now cites this derivation instead of "Proposed" (EV1 X-11).

| Option | ASR-01 | Coverage of free text | Verdict |
|---|---|---|---|
| **Rules + lexicon (+ confirmation question)** | Cannot be talked out of a danger sign | Limited to listed phrases → false negatives possible [INFERENCE] | Chosen |
| Model detects danger | Can miss; not provable | Better on paraphrases [INFERENCE] | Rejected as sole method |
| Ask every danger-sign question in every consultation (no lexicon) | Complete for listed signs | Typed text ignored for danger | Rejected: dozens of extra questions per consultation for 20 illnesses, against NFR-12 (median ≤ 5 min) [INFERENCE]; FR-47 asks only the screening set |
| Both, with OR logic | Best recall | Best | Deferred (not rejected) — **RECOMMENDATION for v2**: add model detection as an extra trigger, never as a filter |

- **Note (v0.6):** detection is unchanged; what happens after detection is ADR-31.
- **Negative consequences:** A danger phrased in words missing from the lexicon is not caught in typed text; since v0.5 the mandatory screening questions (ADR-19) ask about it before any result (risk AR-3).
- **Reversal cost:** Low (additive).

### ADR-08 — Input mode
- **Decision:** own words + buttons, every converted answer confirmed (LOG I2-Q5). **Status: Accepted.**
- **Alternatives rejected:** buttons only (simpler, safer, weaker for non-technical users — LOG I3-Q15); free text only (no confirmation step → unconfirmed answers drive decisions; conflicts with SRS FR-41).
- **Negative consequences:** Two extra screens, an extra endpoint pair, a privacy surface (typed health text) and a model to train; users may expect understanding of anything they type.
- **Reversal cost:** Low — own words is an optional first step (SDD SD-02).

### ADR-09 — Dose representation
- **Decision:** age × weight bands copied from official leaflets; no calculation (LOG I2-Q7, SRS PD-12). **Status: Accepted.**
- **Alternatives rejected:** mg/kg calculation (flexible, but a computed dose is not a validated value — BR-06); fixed adult doses only (cannot serve children 2–17, RE UN-04).
- **Negative consequences:** A patient outside every band gets no dose for that medicine (excluded), and band data is laborious to prepare and validate.
- **Reversal cost:** Medium (data migration).

### ADR-10 — Mobile technology — **Accepted: Flutter** (LOG I4-Q4: "the best one for my project" — decided by delegation)
| Option | iPhone later (RE F-04) | RTL support | Learning cost for the developer |
|---|---|---|---|
| Cross-platform (Flutter suggested, SRS PD-02) | Same code base | Built in [ASSUMPTION — not verified for this project] | [UNKNOWN — developer's experience not stated] |
| Native Android (Kotlin) | Rewrite needed | Built in | [UNKNOWN] |
| Progressive web app | Works on both | Browser-based | [UNKNOWN — developer's web experience not stated in the sources] |
- **Negative consequences:** The developer must learn Dart if not already known [UNKNOWN — skills not stated]; app size depends on the framework runtime.
- **Why Flutter (RECOMMENDATION, accepted):** the only option that meets all three facts: a *phone app* (LOG I1-Q6 rules out a web app), Android first with iPhone later from the same code (RE F-04, LOG I2-Q23 — rules out native Kotlin), and full right-to-left Arabic (SRS NFR-14; Flutter's built-in RTL support is general knowledge, **not verified for this project**). **Condition:** if you already know JavaScript/React well and not Dart, React Native meets the same three facts and may be faster for you to learn — say so and this ADR switches. **Reversal cost:** High (client rewrite).

### ADR-11 — Protecting health data at rest
- **Decision:** field-level AES-256-GCM in the repository layer (SRS PD-09). **Status: Proposed.**
- **Alternatives rejected:** disk encryption only (a database dump exposes data — fails TC-SEC-03); database-native column encryption (ties to one database product [INFERENCE]).
- **Negative consequences:** Key management becomes the developer's responsibility; a lost key makes health data unreadable [INFERENCE].
- **Consequence:** encrypted fields cannot be searched in SQL — acceptable, no requirement searches health fields (INFERENCE from SRS §9.2). **Reversal cost:** Medium.

### ADR-12 — Audit writes
- **Decision:** audit in the same transaction as the action (DR-05). **Status: Proposed.**
- **Alternatives rejected:** asynchronous events (cannot roll back an import — conflicts with SRS FR-40); transactional outbox (correct, but more machinery for one developer [INFERENCE]).
- **Negative consequences:** Each audited action takes slightly longer and fails as a whole if the audit write fails (intended by SRS FR-40).
- **Reversal cost:** Low.

### ADR-13 — Database — **Accepted by delegation** (LOG I5-Q3)
- **Context:** demo on a laptop with ~6 GB free (RE C-08); 100 concurrent consultations only once hosted (RE ASM-21); stakeholder preferred SQLite and delegated the final choice.

| Option | Demo setup and disk | Concurrency (NFR-05, hosted) | Path to the real product |
|---|---|---|---|
| **SQLite for the demo, PostgreSQL from the pilot (same data-access layer)** | One file, no server | Not needed for the demo | Switch by configuration plus a migration [INFERENCE: moderate effort] |
| PostgreSQL from the start | Server install on a tight disk | Ready | No switch needed |
| SQLite everywhere | Simplest | One writer at a time limits concurrent writes [INFERENCE] | Would not meet NFR-05 at pilot scale |

- **Consequences:** + fastest demo setup; − features must stay portable between both databases (no database-specific SQL).
- **Reversal cost:** Low–medium.

### ADR-14 — Backend language and framework — **Proposed** (SRS PD-03)
- **Context:** one developer; AI components in Python (training ecosystem); zero cost (RE C-01, C-04).

| Option | AI integration | Developer effort | Verdict |
|---|---|---|---|
| **Python + FastAPI** | Same language as model training and serving | One language end to end on the server | Proposed |
| Node.js (Express/NestJS) | Model must be served separately or via bindings [INFERENCE] | Two server languages | Rejected |
| Java/Kotlin (Spring) | Same as Node | Heavier setup for one person [INFERENCE] | Rejected |

- **Negative consequences:** Python web servers need care for concurrency (worker processes) at pilot scale [INFERENCE].
- **Reversal cost:** High (server rewrite).

### ADR-15 — Session tokens — **Proposed** (SRS PD-08)
| Option | Mobile fit | Revocation | Verdict |
|---|---|---|---|
| **Short access token (15 min) + rotating refresh token (30 days)** | Standard for mobile apps [INFERENCE] | Refresh tokens stored hashed and revocable | Proposed |
| Server-side sessions with a cookie | Cookies are awkward in native apps [INFERENCE] | Simple | Rejected |
| Long-lived single token | Simplest | Hard to revoke; stolen token valid for long | Rejected |
- **Negative consequences:** token refresh logic in the app; 15 min and 30 days are [Proposed] values without a source.
- **Reversal cost:** Low.

### ADR-16 — Confidence, stopping and uncertainty rules — **Accepted** (LOG I2-Q2, I2-Q15, I3-Q11, I5-Q6, I5-Q9; SRS PD-14, PD-17, PD-18)
| Decision | Chosen | Alternatives rejected | Why |
|---|---|---|---|
| When to stop asking | Confidence ≥ 85 % or no useful question left — and only after the screening set (ADR-19) | Fixed number of questions (first proposal, ASM-13 — replaced by I2-Q15); confidence target only, without the ε floor (may keep asking useless questions until the bank is exhausted [INFERENCE]) | Stakeholder asked for confidence-based questioning; ε guarantees a short ending |
| Uncertain path (< 60 %) | Remedies + OTC items suitable for every illness in the 90 % set | No medicine at all (ASM-14 original — replaced by I2-Q2); top illness only (unsafe when unsure [INFERENCE]) | Stakeholder decision |
| Confidence value | Calibrated top-class probability (temperature scaling) [Proposed] | Raw model score (not calibrated; AI-07 requires calibration); isotonic regression (needs more data [INFERENCE]) | Simplest method meeting AI-07 |
- **Negative consequences:** 85 %, 60 % and 90 % are starting values, not validated; wrong values give either too many questions or too-early answers.
- **Reversal cost:** Low (configuration values in the clinical data bundle).

### ADR-17 — Sign-up method — **Accepted** (LOG I5-Q4)
| Option | Cost | Ease for non-technical users (LOG I3-Q15) | Verdict |
|---|---|---|---|
| **Email + password** | 0 except a free email service for reset [UNKNOWN which] | Requires an email address | Chosen |
| Phone number + SMS code | SMS usually paid [UNKNOWN — Tunisian prices not checked] | Familiar | Rejected (C-01) |
| Phone number + PIN, no verification | 0 | Easiest | Rejected by stakeholder choice; weaker account recovery [INFERENCE] |
| Account created by a family member | 0 | Easiest for the user | Not chosen |
- **Negative consequences:** users without an email address cannot sign up; tension with LOG I3-Q15 recorded (Interview Log round 5 notes).
- **Reversal cost:** Medium (account migration).

### ADR-18 — Reading numbers in typed text — **Proposed** (SRS FR-41 step 3b)
| Option | Precision (AI-20) | Effort | Verdict |
|---|---|---|---|
| **Deterministic patterns (digits in both scripts, unit words) + user confirmation** | Predictable; easy to test | Small | Proposed |
| Fine-tuned model also extracts numbers | Generative or span extraction needed — conflicts with the classifier framing (Model Selection §2) | Higher | Rejected |
| Never read numbers from text; always ask them as button questions | Highest | None | Fallback when patterns find nothing (not chosen as the main path: users would re-type what they already wrote) |
| Patterns used without user confirmation | Unconfirmed values drive decisions | Smallest | Rejected — conflicts with SRS FR-41 |
- **Negative consequences:** unusual phrasings ("since the day before yesterday") are missed and asked as questions instead.
- **Reversal cost:** Low.

### ADR-19 — Mandatory danger screening before any result — **Accepted by delegation** (EV1 F-01; LOG I6-Q0)
- **Note (v0.6):** since ADR-31 a danger sign no longer stops the consultation; the gate now guarantees that the danger notice is shown **before** any result.
- **Context:** EV1 traced a path where 3–4 confirmed own-words answers push confidence ≥ 85 % and a RESULT is produced before any danger sign is asked about (SD-02 → SD-01). Expected-gain selection does not guarantee danger questions are asked.

| Option | ASR-01 Safety | ASR-08 Usability (questions asked) | Verdict |
|---|---|---|---|
| **Screening gate: general screening first; no RESULT until every still-likely illness's screening questions are answered (SRS FR-47)** | Danger sign asked on every path | A few extra questions per consultation [INFERENCE: size depends on the screening set, OQ-05] | Chosen |
| "First 3 questions include screening" (earlier [Proposed] rule) | Covers general signs only; illness-specific signs can still be skipped | Fewest questions | Rejected |
| Raise the stop target or bonus danger questions in expected gain | Probabilistic, not a guarantee | Unpredictable | Rejected |

- **Negative consequences:** consultations get longer; a large screening set could threaten NFR-12 (median ≤ 5 min); the gate depends on clinical data that does not exist yet (OQ-05).
- **Reversal cost:** Low (one class, `ScreeningGate`; data file `screening_questions.csv`) — reversal not recommended.

### ADR-20 — Own-words pending-confirmation state — **Accepted by delegation** (EV1 F-02, X-09; LOG I6-Q0)
- **Context:** API-27 returned danger confirmations and converted answers together; a client could call API-28 without answering the danger confirmation (EV1 I2).

| Option | ASR-01 Safety | Complexity | Verdict |
|---|---|---|---|
| **`Consultation.pendingStep`: danger confirmation first, conversion only after "no"; any other input → 409 E-CONS-006; omitted items = rejected** | Server enforces the order | One enum and two checks | Chosen |
| Return both lists; trust the app to show the danger question first | Depends on the client | Lowest | Rejected (client is untrusted) |
| Any danger-word match → immediate referral without confirmation | Safest for true matches | Lowest | Rejected: contradicts SRS FR-42 (confirmation question) and would refer users who wrote "no fever, no breathing problem" [INFERENCE: negation is not handled by a lexicon] |

- **Negative consequences:** one more state to test; conversion runs later (after the confirmation), so a user who denied the danger waits for it then.
- **Reversal cost:** Low.

### ADR-21 — Activation gate for clinical data — **Accepted by delegation** (EV1 F-04, F-07a; RV-04; LOG I6-Q0)
| Option | Safety | Effort | Verdict |
|---|---|---|---|
| **Automatic gate at activation: DRAFT refused when `publicDeployment = true`; every item has its minimum safety cases; question-bank hash matches the deployed models; suite 100 %** | Cannot be forgotten; suite cannot pass vacuously | Coverage index and hash check to build | Chosen |
| Suite run only (v0.4) | Passes when cases are missing (EV1 I7) | Built already | Rejected |
| Manual checklist signed by the administrator | Can be skipped | None in code | Rejected (NFR-16 is a release gate) |
- **Negative consequences:** every new data item needs its test cases before activation, which slows content updates; on a one-person project the cases are written by the bundle author, so they test application, not clinical correctness (SRS §16.2).
- **Reversal cost:** Low.

### ADR-22 — Doses stored as numbers and rendered — **Accepted** (`I6-Q3`; EV1 F-04)
| Option | FR/AR consistency | Expressiveness | Verdict |
|---|---|---|---|
| **`doseQuantity` + `doseUnit`; FR and AR text rendered from them** | Same numbers in both languages by construction | Unusual instructions need a new unit value | Chosen |
| Two free-text columns + import check that both contain the same digits | Catches most mismatches | Free | Rejected: a check on digits misses units and fractions [INFERENCE] |
| Two free-text columns, presence check only (v0.4) | None | Free | Rejected (EV1 I4) |
- **Negative consequences:** rendering templates in two languages to write and review; leaflet wording is not copied word for word.
- **Reversal cost:** Medium (data migration).

### ADR-23 — Model versions pinned per consultation — **Accepted** (`I6-Q6`; EV1 F-07b)
| Option | Consistency of one consultation | Resources | Verdict |
|---|---|---|---|
| **`ModelRegistry` keeps the version a consultation started with until no open consultation uses it (≤ 24 h, FR-23)** | Same model from first to last question | Two versions in memory and on disk for ≤ 24 h (~1.2 GB for two encoders [ESTIMATE, Model Selection §4]) | Chosen |
| Redeploy only when no consultation is open | Same | One version | Rejected: needs a maintenance window [INFERENCE] |
| End open consultations with REFERRAL_FAILURE on redeploy | Safe | One version | Rejected: punishes users for a deployment |
- **Negative consequences:** memory and disk for a second version; registry code.
- **Reversal cost:** Low.

### ADR-24 — Per-illness limits: referral, no classifier filter — **Accepted by delegation** (EV1 F-06, X-10)
| Option | ASR-01 Safety | Verdict |
|---|---|---|
| **Check limits after classification → REFERRAL_OUT_OF_SCOPE (SRS FR-46)** | A patient outside the limits is referred | Chosen |
| Classifier input filter (probability 0) — earlier [Proposed] | The referral can never fire; the next illness's medicines are shown instead (EV1 I1) | Rejected |
| Both | The filter still hides the referral | Rejected |
- **Negative consequences:** some patients get a referral where another covered illness might have fitted [INFERENCE].
- **Reversal cost:** Low.

### ADR-25 — Redacting own-words text — **Accepted** (`I6-Q4`; EV1 F-05a)
| Option | Privacy | Cost | Verdict |
|---|---|---|---|
| **Profile names + first-name lexicon + phone/email patterns, plus a hint "do not write names or addresses"** | Removes most names [INFERENCE]; addresses partly | A name list to maintain | Chosen |
| Profile names, phones, emails only (v0.4) | Third-party names pass (EV1 I6) | Lowest | Rejected |
| Named-entity recognition model | Better recall [INFERENCE] | Another model to train for FR + MSA; disk | Rejected for v1 |
- **Negative consequences:** symptom words that are also first names may be removed (false positives) [INFERENCE]; redaction stays best effort, so the text never leaves the backend (ADR-05).
- **Reversal cost:** Low.

### ADR-26 — Audit actor unlinked on account deletion — **Accepted** (`I6-Q5`; EV1 F-05b)
| Option | FR-04 (delete all) | FR-40 (append-only audit) | Verdict |
|---|---|---|---|
| **`actorHash` = HMAC with a per-user key; delete the key with the account** | Events can no longer be linked to the person | Rows untouched | Chosen |
| Rewrite `actorHash` to "DELETED" | Unlinked | Breaks append-only | Rejected |
| Keep the plain hash (v0.4) | Linkable by anyone holding the user id | Kept | Rejected (EV1 I6) |
- **Negative consequences:** key handling per user; after deletion an investigation cannot tie past events to the account (intended). Whether this satisfies the law is still OQ-12.
- **Reversal cost:** Low.

### ADR-27 — Consultation state on the server — **Proposed** (SRS PD-11)
| Option | Resume (FR-23) | Safety checks | Verdict |
|---|---|---|---|
| **Store every answer on the server; the app caches only the current question** | Any device, after any crash | Server runs every check on stored answers | Proposed |
| State in the app, sent with each request | Lost with the phone | Server must trust client state | Rejected |
| State in memory on the server | Lost on restart | Same as chosen while running | Rejected |
- **Negative consequences:** one database write per answer (latency, NFR-02a); no offline use (accepted, C-05).
- **Reversal cost:** High.

### ADR-28 — Optimistic locking on Consultation — **Proposed** (DR-12)
| Option | Correct order with two devices | Cost | Verdict |
|---|---|---|---|
| **`Consultation.version`; stale write → 409** | Yes | One column | Proposed |
| Database row lock for the whole step | Yes | Locks held during model calls; SQLite locks the whole file [INFERENCE] | Rejected |
| No protection | No | None | Rejected |
- **Negative consequences:** the second device gets a 409 and must reload. Traces to SRS §8.1 `version` and NFR-18; no SRS requirement asks for two-device use (SG-2), so this is defensive design.
- **Reversal cost:** Low.

### ADR-29 — Idempotency keys on answers — **Proposed** (SRS §9.3, FR-23)
| Option | Retries on weak networks (NFR-01) | Verdict |
|---|---|---|
| **`Idempotency-Key` header, unique per consultation** | A retried answer is stored once | Proposed |
| Detect duplicates by question code only | Fails if the user changes the answer before the retry [INFERENCE] | Rejected |
| No retries | Users on 3G lose answers | Rejected |
- **Negative consequences:** the app must keep the key until the server confirms; one unique index.
- **Reversal cost:** Low.

### ADR-30 — Scheduled jobs inside the backend process — **Proposed** (DR-06)
| Option | Operability (ASR-09) | Verdict |
|---|---|---|
| **One in-process scheduler (expiry 24 h, deletion 30 days, token purge, log retention)** | Nothing extra to run | Proposed |
| Operating-system cron calling a script | Separate setup per host | Rejected for the demo |
| Hosted scheduler service | Vendor-specific; may cost money | Rejected (C-01) |
- **Negative consequences:** with several workers (pilot) the jobs must run in only one of them [INFERENCE]; a stopped laptop runs no jobs.
- **Reversal cost:** Low.

### ADR-31 — Danger sign: persistent notice, consultation continues — **Accepted by the stakeholder** (LOG `I7-Q4`; reopens `I1-Q11`, BR-02)
- **Context:** owner's review (RV-30): "tell them to see a doctor but continue with them … do not stop the consultation"; both levels continue, "remembering the danger of the situation"; the result "should not change".

| Option | ASR-01 Safety (as defined before v0.6) | ASR-08 Usability / the owner's goal | Verdict |
|---|---|---|---|
| **Notice (URGENT "see a doctor"; EMERGENCY "dangerous" + 190/198) on every later screen and the result; consultation and result unchanged** | Weaker: medicines can be shown next to a danger sign [INFERENCE] | The user is never left without help | **Chosen by the stakeholder** |
| Stop with referral, no medicine, no remedy (v0.5, `I1-Q11`) | Strongest; was the analyst's recommendation | User may feel abandoned | Rejected by the stakeholder |
| Stop + short approved "while you get help" advice, no medicine | Strong | Some help without medicines | Rejected by the stakeholder |

- **Negative consequences:** a user may take the shown medicine and delay care; an OTC painkiller or fever reducer can mask a serious symptom [INFERENCE — no clinical source]; legal exposure is higher (RE R-17, AR-8); the safety invariant I2 is weaker than before. Mitigations: notice on every screen and on the result, emergency numbers, a counter of results under a notice (SRS §15.2), review with the clinical reviewer (OQ-01).
- **Reversal cost:** Low — one switch in `ConsultationOrchestrator` (stop vs continue) and the result view; the danger detection is unchanged.

### ADR-32 — Undo the last answer — **Accepted** (LOG `I7-Q7`, RV-35)
| Option | Correcting a wrong tap | Safety | Verdict |
|---|---|---|---|
| **API-29 removes the last button answer; danger signs already found stay; full checks rerun on the new answer** | Yes, one step at a time | Notice cannot be removed by undo | Chosen |
| No back button (v0.5) | No | Same | Rejected (RV-35) |
| Free editing of any earlier answer | Yes | Harder to keep checks consistent; easier to "shop" for a result [INFERENCE] | Rejected |
- **Negative consequences:** one more endpoint and state change to test; a user can still go back and change symptom answers (but not erase a danger notice).
- **Reversal cost:** Low.

---

## 6. Sensitivity points, trade-off points, risks, non-risks

**Sensitivity points** (one parameter strongly affects one quality):
| ID | Parameter | Affects | Source of value |
|---|---|---|---|
| SP-1 | Uncertain threshold (default 60 %) | Safety vs usefulness of results | LOG I2-Q2; SRS FR-22 |
| SP-2 | Stop target (default 85 %) and ε (0.01 bits) | Number of questions (NFR-12) vs accuracy | SRS PD-17 [Proposed] |
| SP-3 | Still-likely mass (90 %) | How many OTC items an uncertain user gets | SRS PD-18 [Proposed] |
| SP-4 | Extraction confidence floor (0.7) | Conversion precision vs recall (AI-20) | SRS §10.0 [Proposed] |
| SP-5 | Snapshot refresh interval (≤ 5 s) | Consistency across workers after activation | SDD §2.4 [Proposed] |

**Trade-off points** (one decision affects several qualities in opposite directions):
| ID | Decision | Improves | Worsens |
|---|---|---|---|
| TP-1 | ADR-03 + ADR-04: trained classifier decides and chooses | Performance (ASR-04), consistency, explainability | The fine-tuned model's language ability is not used for deciding; accuracy depends on the classifier [INFERENCE] |
| TP-2 | ADR-08, own words | Usability (ASR-08) | Privacy surface (ASR-05), attack surface (prompt injection, SRS SEC-10) |
| TP-3 | ADR-11, field encryption | Privacy (ASR-05) | Query flexibility; small CPU cost [INFERENCE] |
| TP-4 | ADR-04: fine-tuned model only for text | Disk and training effort (ASR-09) | Text-reading errors must be caught by user confirmation (FR-41) |
| TP-5 | Reasons computed by leave-one-out on the deciding classifier | Faithfulness (SRS AI-CAP-02) | ~10–15 extra classifier calls at the result [ESTIMATE; negligible for a classical classifier] |

**Risks:**
| ID | Risk | Evidence | Mitigation |
|---|---|---|---|
| AR-1 | Model latency unknown; ADR-03 may still miss NFR-02a | No benchmark (SRS OQ-07) | Benchmark the base model first; budget per step |
| AR-2 | Model + database + backend exceed ~6 GB free disk | RE C-08; model size [UNKNOWN] | Small quantised model; disk budget ≤ 2 GB for the model [RECOMMENDATION] |
| AR-3 | Danger lexicon misses paraphrases, dialect or Latin-script spellings | ADR-07; EV1 P5 | Mandatory screening questions before any result (ADR-19, SRS FR-47); dialect/Arabizi detection terms [Approved `I6-Q7`]; v2 OR-model trigger |
| AR-4 | Synthetic training data does not match real phrasing | RE R-10 | Report as limitation; precision measured per language |
| AR-5 | No clinical data source or reviewer | RE OQ-01 – OQ-04 | DRAFT banner (SRS NFR-23); no public release |
| AR-6 | Stale profile data (child weight, new medicines) gives a wrong band or misses an interaction | EV1 P3; RE R-15 | Re-confirmation at consultation start [Approved `I6-Q1`] |
| AR-7 | Brand names stay uncoded, so duplicate and interaction checks cannot run | EV1 P4; RE R-16 | Brand synonyms; no medicine while a medication or allergy item is uncoded [Approved `I6-Q2`] |
| AR-8 | A user with a danger sign follows the medicines shown under the notice and delays care | ADR-31; RE R-17 | Notice on every screen and result; 190/198; monitored counter; clinical review of the rule (OQ-01) |

**Non-risks** (decisions examined and judged sound, with confidence):
| ID | Non-risk | Reason | Confidence |
|---|---|---|---|
| NR-1 | 100 concurrent consultations on one modular monolith | Per step: one model call + rule evaluation in memory + a few DB writes (INFERENCE) | Medium — confirm with TC-PERF-05 |
| NR-2 | Safety suite independent of the model | Stub `IllnessClassifier` and `TextConverter` (SDD §3.1b) | High |
| NR-3 | Clinical data updates without code | ADR-06, SD-03 | High |

---

## 7. Views, interfaces, data

### 7.1 Views and their audiences
| View (SDD) | Audience | Concern addressed |
|---|---|---|
| Component diagram §2.2 | Jury, developer | Where safety decisions are made; what the AI can reach |
| Class diagrams §3.1 | Developer, AI coding agent | Responsibilities, interfaces, patterns |
| ER diagram §4.1 | Developer | Persistence, versioning, encryption |
| Screen flow §5.1 | Jury, usability testers | Path for non-technical users; referrals cannot be skipped |
| Sequence SD-01 / SD-02 / SD-03 §6 | Safety reviewer, developer | Order of checks; failure branches |
| Deployment §2.4 | Product owner | Demo feasibility on one laptop |
| This note | Product owner, jury | Why each decision was taken and what it costs |

### 7.2 Interface failure behaviour
| Interface | Failure | Behaviour | Source |
|---|---|---|---|
| API-16 start consultation | No active clinical data | 503 E-DATA-002 | SRS §9.3 |
| API-18 submit answer | Stale version (second device) | 409; app reloads state | DR-12 (SRS: SRS gap SG-2) |
| API-18 submit answer | Any component failure | 200 with REFERRAL_FAILURE, 0 medicines | SRS NFR-17 |
| API-27 own words | Conversion timeout/invalid | 200, `fallback: true`, button questions | SRS FR-41, E-AI-004 |
| API-28 / API-18 | Called out of order while a confirmation is pending | 409 E-CONS-006; app reloads the pending step (API-17) | SRS §9.3, ADR-20 |
| API-19 result | Stored result unreadable or assembly fails | 200 REFERRAL_FAILURE guidance view (E-SYS-003), alert | SRS NFR-17, EV1 F-08 |
| API-24 activate data | DRAFT in public deployment, missing cases, incompatible bank or suite failure | 409 E-DATA-003, version stays inactive | SDD SD-03, ADR-21 |
| `TextConverter.convert` / `IllnessClassifier.predict` | Timeout (3 s / 2 s) or schema violation | Rejected by OutputValidator; conversion → fallback to questions, classification → REFERRAL_FAILURE | SRS §10, AI-08 |
| `SnapshotProvider.get(version)` | Version not cached | Load from database; if missing → REFERRAL_FAILURE | DR-03 [INFERENCE for the missing case] |
| Repository write | Database error | Transaction rolled back; E-SYS-001 or REFERRAL_FAILURE inside a consultation | SRS §14.3 |
| Audit write | Failure | Whole action rolled back | SRS FR-40 |
| Phone dialer (`tel:190`) | No dialer / no signal | Number shown as text as well [RECOMMENDATION — not in SRS] | — |
| Email (password reset) | Service down | API-04 still returns 202; retry queue [UNKNOWN — OQ-13] | SRS §9.3 |

### 7.3 Data ownership, lifecycle, retention
FACT: owners, lifecycle and retention are specified in SRS §8.3, §8.4, §8.6. Gaps:
- Own-words text and substance use have no **separate** retention rule; they follow the consultation/profile (INFERENCE). **[ASSUMPTION]** acceptable; to confirm with the legal check (OQ-12).
- Whether a hashed actor in audit events is personal data: **[UNKNOWN]** (SRS §19.4 #3, OQ-12); ADR-26 (accepted, `I6-Q5`) makes it unlinkable after account deletion.
- Retention values in SRS §8.6 are all [Proposed].

---

## 8. Cross-document conflicts (flagged, not resolved)

| ID | Conflict | Where | Which is current? |
|---|---|---|---|
| C-1 | Question selection: SRS said expected gain over the fine-tuned model's probabilities; SDD v0.2 used a separate fast model | SRS PD-06, §10.1 | **Resolved 2026-11-03** by ADR-03 + ADR-04: one trained classifier; SRS PD-06, AI-CAP-01/02 and the coding context updated |
| C-2 | Reasons computed by a different model from the one deciding | SRS AI-CAP-02; SDD ReasonExplainer | **Resolved 2026-11-03**: the deciding classifier also produces the reasons |
| C-3 | The design builds on decisions still marked Proposed: PD-01, PD-03, PD-07 – PD-09, PD-11, PD-14 – PD-16, PD-19, PD-20 (the EV1 suggestions were approved 2026-11-03, `I6-Q1` – `I6-Q10`) | SRS §1.6, §19.6 (updated 2026-11-03, v0.3) | Not a contradiction; the design rests on unapproved choices — approve them or name changes |
| C-4 | 17 contradictions found by EV1 (X-01 – X-17) | RE, SRS, SDD, this note | **Resolved 2026-11-03** (`I6-Q0`); outcome per item in [[SDD — Evaluation Run 1]] §3 |

---

## 9. Traceability and orphans

| SDD element | ASR / constraint |
|---|---|
| API layer | ASR-05, ASR-04 |
| Auth & consent service | ASR-05 (SRS FR-03, FR-04) |
| Profile service | ASR-01 (inputs to rules), ASR-05 |
| Consultation orchestrator (`afterAnswersAdded`) | ASR-01, ASR-03 |
| DangerSignChecker, DangerTerm | ASR-01 |
| TriageService, OutputValidator, RedactionService | ASR-02, ASR-05 |
| FineTunedConverter | ASR-08 (own words), SRS AI-19, AI-20 |
| TrainedClassifier, Calibrator | ASR-04, SRS AI-05, AI-07 |
| QuestionSelector, StopPolicy, ReasonExplainer | ASR-04, SRS FR-16, FR-21 (C-2 resolved) |
| ScreeningGate, ScreeningQuestion | ASR-01, SRS FR-47 (ADR-19) |
| Consultation.pendingStep | ASR-01, SRS FR-41, FR-42 (ADR-20) |
| ModelRegistry | ASR-09, ASR-06, SRS FR-39, FR-13 (ADR-23) |
| ResultAssembler (`failureView`) | ASR-03, SRS NFR-17, FR-45 |
| BundleValidator, SafetySuiteRunner | ASR-06, ASR-07, SRS FR-39, NFR-16 (ADR-21) |
| RulesEngine, SafetyFilters, DoseBandResolver | ASR-01, ASR-02 |
| ClinicalDataService, SnapshotProvider, safety-suite gate | ASR-06, ASR-07 |
| RuleBasedBaseline | ASR-07 (SRS AI-06) |
| Repositories + field encryption | ASR-05 |
| Audit log | SRS FR-40, SEC-14 |
| Scheduled jobs | SRS FR-23, §8.6 |
| Observability | SRS AI-13, NFR-OBS (Proposed) |

**Orphans or weakly traced elements:**
| Element | Status |
|---|---|
| Optimistic locking (DR-12) | Now recorded as ADR-28 (defensive design; traces to SRS §8.1 `version` and NFR-18); no SRS requirement asks for two-device use (SG-2) |
| Multi-worker snapshot refresh (DR-04) | **Deferred to the pilot** (LOG I5-Q7) |
| Admin web page (SRS PD-10) | **Removed** — command-line tool (LOG I5-Q7) |
| Email service | Traces to API-04; sign-up by email confirmed (LOG I5-Q4); free sending service still to choose |

---

## 10. Complexity bill

| Component / technology | Buys | Costs | Keep for the course version? (RECOMMENDATION) |
|---|---|---|---|
| Fine-tuned model | Own-words input; the course's AI contribution (LOG I2-Q5, I2-Q6) | Training data (~1,050 cases + ~1,000 descriptions, SRS §10.4), GPU time, disk | Yes |
| Trained illness classifier | Fast decisions, question choice, faithful reasons (ADR-03/04) | Training and calibration on the case set | Yes |
| Rule-based baseline | Honest evaluation (AI-06) | Small | Yes |
| Own-words conversion + redaction + confirmation screen | Usability for non-technical users | Two extra screens, extra endpoint pair, privacy surface | Yes (decided) |
| Field-level encryption | Privacy if the database leaks | Key handling, no SQL search on fields | Yes |
| Versioned clinical data + import validator + safety gate | Updates without code; safety gate | Import code, validation rules | Yes — core safety |
| Snapshot cache by version + multi-worker refresh | Open consultations keep their data; consistency across workers | Cache code | Version cache yes; multi-worker refresh deferred to the pilot (LOG I5-Q7) |
| Scheduled jobs | Expiry and retention | A scheduler | Yes (small) |
| Screening gate (ADR-19) | No result without danger screening | A few extra questions; screening data per illness | Yes — core safety |
| Pending-confirmation state (ADR-20) | Danger confirmation cannot be skipped | One enum, one error code | Yes — core safety |
| Activation gate: coverage + compatibility (ADR-21) | Suite cannot pass vacuously; models match the bank | Coverage index, hash check | Yes |
| Model registry (ADR-23) | Same model for a whole consultation | Second version in memory ≤ 24 h | Yes if redeploys happen during the demo; otherwise optional [RECOMMENDATION] |
| Observability (logs, basic metrics) | Debugging, AI monitoring (AI-13) | Setup time | Yes; **tracing removed** (LOG I5-Q7) |
| SQLite (demo) / PostgreSQL (pilot) | Integrity, versioning | Portability discipline | Decided — ADR-13 |

---

## 11. What to do next
1. Choose the base model to fine-tune for reading French and MSA text (OQ-07) — method and candidates in [[Model Selection — Text Reader]]; measure its speed and size.
2. Approve or change the remaining Proposed decisions (§8 C-3).
3. Done 2026-11-03: SRS PD-06, §10.1/§10.2, RE AI-19 and the coding context updated to match ADR-03/ADR-04; decisions recorded in SDD v0.3.
4. Build EV1 experiment 1 first: orchestrator tests showing no RESULT without screening and no API-28 with a pending confirmation ([[SDD — Evaluation Run 1]] §4).

**What is missing to make this final:** your answers to step 1; a benchmark of the chosen base model (latency, size), which turns every [ESTIMATE] in ADR-03/ADR-04/C-2 into a measurement.

---

## QUALITY REPORT

**Strengths**
- Every scenario's response measure is a cited SRS figure, except QAS-06 (marked UNKNOWN).
- 32 ADRs. Each has negative consequences and a reversal cost. After EV1, each also has at least 2 rejected alternatives, except where an option is explicitly **deferred** (ADR-07's OR-trigger is marked as such). This was checked by script on 2026-11-03.
- Cross-document conflicts C-1 and C-2 were surfaced, then resolved by the stakeholder, with the resolution recorded.

**Weaknesses**
- All latency figures are estimates without a benchmark (no model chosen yet).
- The ASR selection is my inference, not a course-provided catalogue.
- Several values are design proposals without an external source: token lifetimes (ADR-15), test network upload/latency (SRS NFR-01), screen sizes and app size (SRS NFR-20).
- ADR-10 and ADR-17 were decided with an unresolved tension (developer skills unknown; email may exclude some users).

**Assumptions:** jury audience; per-call model time 20–50 ms; ~100 bank questions × 3 answer values; target users' phones are modest; Flutter RTL support adequate (not verified).

**Open questions:** OQ-07 (base model for text reading), OQ-08 (hosting), OQ-12 (legal), OQ-13 remainder (free email service); Proposed decisions in §8 C-3.

**Top 3 ways this could be wrong**
1. Per-call latency is off by an order of magnitude, which would change ADR-03 and ADR-05.
2. The chosen text-reader model is less precise in MSA than in French by more than 5 points, which would break AI-11 and force a different base model.
3. The lexicon approach (ADR-07) misses common phrasings of danger signs in MSA/French.

**Owner's review (round 7):** ADR-31 changes the danger behaviour against the analyst's recommendation; the decision is the stakeholder's and its risk is recorded (AR-8).

**EV1 (2026-11-03):** the independent-session evaluation found 2 Critical safety gaps (ADR-19, ADR-20 fix them in the design) and 17 contradictions (resolved, §8 C-4). None of the fixes is implemented or tested yet.

**Confidence:** medium overall — high on ADR-02 – ADR-09, ADR-13, ADR-16, ADR-17 (stakeholder decisions with sources); medium on ADR-10 (delegated); low on every latency estimate.

Back to [[SDD — Software Design Document]] · [[Sahti — Home]]
