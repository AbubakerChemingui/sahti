---
tags: [projects/sahti, sahti/requirements]
created: 2026-11-02
---
# RE — Requirements Elicitation Document

**Project:** Sahti (صحتك) — AI health assistant for benign illnesses in Tunisia
**Version:** 0.4 · **Date:** 2026-11-03 (v0.1: 2026-11-02) · **v0.4:** product owner's own review (LOG round 7, `I7-Q1` – `I7-Q7`): **a danger sign now gives a persistent notice and the consultation continues** (FR-17, FR-18, BR-02, AI-09, AI-17, UC-04, US-05 changed by `I7-Q4`; risk R-17); uncertain child weight (FR-09); expiry notice (FR-23); undo (FR-15); future F-07, F-08 · **v0.3:** independent design-phase evaluation ([[SDD — Evaluation Run 1]], EV1) fixes adopted on the product owner's instruction "fix it" (`I6-Q0`): FR-47 mandatory danger screening; FR-42 confirmation before conversion; AI-16 and OQ-07 updated to the own-server decision (`I4-Q3`); risks R-14 – R-16 · v0.2.1: round 5 answers (FR-46, OQ-04/OQ-13 resolved, CF-08 resolved — photos in v2)
**Author:** Abubaker (product owner), with Claude as AI business analyst
**Status:** Elicited from a single stakeholder. All assumptions reviewed and approved or replaced by the stakeholder on 2026-11-02/03 (interview rounds 2–3). **Not validated by any clinician.**

**Changes in v0.2:** scope widened from 4 to **20 common illnesses** (§1.1, CF-07); prescription medicines handled by referral only (FR-43); new uncertain path with limited safe treatment (FR-22); confidence-based questioning (FR-16); own-words symptom input with a fine-tuned model (FR-41, AI-19); extended profile incl. full name, height, smoking, alcohol and substance use (FR-08, FR-44); disclaimer text (FR-05); natural remedies shown first (FR-45); exclusions shown is now Must (FR-34); future items (§17).

## How to read this document

Every item cites where it came from:

| Tag | Meaning |
|---|---|
| `K1`–`K3` | Kickoff statements in [[RE — Interview Log]] |
| `I1-Q1`–`I1-Q13` | Interview answers, round 1, in [[RE — Interview Log]] |
| `I2-Q*`, `I3-Q*` | Approvals and decisions, rounds 2–3, in [[RE — Interview Log]] |
| `LAB` | Required by the course lab ([[Lab — AI-First Requirements Engineering]]) |
| `ASM-n` | An analyst **assumption**; in v0.2 each one is marked approved, replaced or open in §12. |
| `DER` | **Inferred** from one or more stakeholder statements; the statements are cited next to it. |

Priorities use MoSCoW: **M** = Must, **S** = Should, **C** = Could, **W** = Won't (this version).

---

## 1. Executive Summary

**Project purpose.** Sahti is a phone app that helps Tunisian adults handle the **20 most common minor illnesses** (§1.1) for themselves or their children. Users answer questions or describe how they feel in their own words; the app suggests the likely illness and gives natural remedies first, then safe over-the-counter medicines with exact doses and timing. When anything looks serious, unclear, out of scope, or may need a prescription medicine, it tells the user to see a doctor. (`K3`, `I1-Q1`, `I1-Q2`, `I2-Q1`, `I2-Q5`, `I3-Q1`, `I3-Q8`)

**Business problem.** People with a minor illness often either pay for a consultation or choose medicines at the pharmacy without checking them against their allergies, chronic illnesses and current medicines. The second option can cause harm (for example, a decongestant for someone with high blood pressure). (`K3`; stated as a belief to be proven with figures later — `ASM-01`, approved `I3-Q13`)

**Target users.** Adults aged 18+ in Tunisia, with emphasis on people aged 40+ and on **non-technical users, including people who cannot create a social-media account on their own**, using the app for themselves or as a parent for a child. (`K3`, `I1-Q4`, `I1-Q10`, `I3-Q15`)

**Expected value.**
- Safe, personalised first-line guidance for common minor illnesses without a consultation.
- Every suggested medicine and remedy is checked against the patient's health profile, and the user sees what was ruled out and why (`I2-Q13`).
- Serious, unclear or prescription-needing cases are pushed toward a doctor instead of being guessed.
- For the course: a complete AI-first engineering deliverable with a fine-tuned model. For later: a product that can grow with doctors working through it (§17). (`K1`, `I2-Q5`)

### 1.1 Illnesses in scope (v0.2)

Accepted by the stakeholder (`I3-Q1`, `I3-Q9`). Ordered approximately from most to least common; the order must be confirmed with a Tunisian source or a pharmacist (OQ-16). Each illness needs its own validated questions, danger signs, medicines, doses and remedies (C-07).

| # | Illness | # | Illness |
|---|---|---|---|
| 1 | Common cold (rhume) | 11 | Period pain |
| 2 | Flu (grippe) | 12 | Acute sinusitis |
| 3 | Sore throat (angine) | 13 | Itchy / allergic eyes (allergic conjunctivitis) |
| 4 | Seasonal allergy (allergic rhinitis) | 14 | Travel sickness / nausea |
| 5 | Acute cough | 15 | Mouth ulcers |
| 6 | Tension-type headache | 16 | Insect bites and stings |
| 7 | Heartburn / indigestion | 17 | Sunburn and minor burns |
| 8 | Acute diarrhoea | 18 | Athlete's foot / ringworm |
| 9 | Constipation | 19 | Mild acne |
| 10 | Muscle and back pain, minor sprains | 20 | Dandruff |

Fatal or serious diseases (e.g. cancer, Alzheimer's) are explicitly excluded (`I2-Q24`).

---

## 2. Stakeholder Identification

| Stakeholder | Role | Needs | Influence | Main Concerns |
|---|---|---|---|---|
| Adult patient (18+) | Primary user; uses the app for themselves | Know the likely illness; safe medicine, dose and timing; natural remedies; simple app in FR or MSA | High | Safety, clarity, trust, privacy |
| Parent | Primary user; uses the app for a child aged 2–17 | Same as above, adapted to the child's age and weight | High | Child safety; correct dose |
| Product owner / developer (Abubaker) | Sole stakeholder source and builder | Feasible scope, zero cost, strong AI component, deliverable by 2026-11-04, path to a real product | High | Time, budget, credibility |
| Pharmacist | Clinical validator (**not yet involved**; the AI model cannot play this role — `I3-Q3`, `I3-Q10`) | Medicine list, doses and rules they can verify | High (once involved) | Liability, correct dosing, availability in Tunisia |
| Doctor | Referral target; possible validator; **future: works through the app** (F-01, F-02) | Receive only patients who genuinely need a doctor | Medium | Missed serious illness, misuse of the app |
| Course instructor / jury | Evaluator | Testable, traceable requirements; honest limits | High | Rigour, AI responsibility |
| Tunisian health authority (DPM) | Regulator of medicines | Only authorised medicines; no illegal prescribing | Medium–High | Medicines outside the authorised list |
| Tunisian data-protection authority (INPDP) | Privacy regulator | Lawful processing of health data, consent | Medium | Health-data leaks |
| AI / hosting providers | Technical dependency (free tiers) | — | Low | Rate limits, terms of use |

Source: `K1`, `K3`, `I1-Q1`, `I1-Q3`, `I1-Q4`, `I1-Q12`, `I1-Q13`; regulators and pharmacist role are `DER` from `I1-Q2` (doses) and `I1-Q8` (health data).

---

## 3. User and System Context

**Primary actors**
- **Adult patient:** uses the app for themselves.
- **Parent:** uses the app for a child aged 2–17.

**Secondary actors**
- **Administrator:** keeps the medicine, dose, interaction and natural-remedy data up to date (`ASM-02`).
- **Clinical reviewer** (pharmacist or doctor): validates that data offline; never logs in to the app in this version (`ASM-03`).

**External systems**
- **AI service:** runs the symptom interview and illness classification. Must cost nothing (`I1-Q12`). Hosted or local — open (`OQ-07`).
- **Hosting / database service:** stores accounts, profiles and history (`I1-Q8`). Must cost nothing.

**External organisations / services**
- DPM (authorised medicines in Tunisia), INPDP (data protection), official medicine information sources (leaflets/SmPC), herbal monograph sources (`I1-Q5`, see [[Sahti — Open Questions]]).
- Emergency services, as a phone number shown to the user (`ASM-04`).

**Main interactions**
1. The user creates an account and profiles (self and/or children).
2. The user starts a consultation for one profile and answers questions.
3. The system checks for danger signs after every answer.
4. The system suggests the likely illness with a confidence level.
5. The rules engine selects safe medicines, doses, timing and natural remedies for that profile — or refers the user to a doctor or pharmacist.
6. The consultation is saved to history.

---

## 4. Business Goals

| ID | Description | Rationale | Success indicator |
|---|---|---|---|
| BG-01 | Give safe first-line guidance for the 20 common illnesses of §1.1 without a consultation | Core idea (`K3`, `I3-Q1`) | In a pilot, ≥ 60 % of test users say they would use the app instead of an unnecessary visit for these illnesses (`ASM-05`, approved `I3-Q14`) |
| BG-02 | Never recommend an unsafe medicine or dose | Doses are the riskiest output (`I1-Q2`, `I1-Q7`) | 100 % of the safety test cases pass (see NFR-16) |
| BG-03 | Be usable by adults aged 40+ in French or Modern Standard Arabic | Target users (`K3`, `I1-Q11`) | SUS score ≥ 75 with ≥ 5 users aged 40+ (`ASM-06`) |
| BG-04 | Deliver the course labs on time with a credible AI component | `I1-Q12`, `I1-Q13` | RE, design and coding deliverables submitted by 2026-11-04 |
| BG-05 | Run at zero cost | `I1-Q12` | Monthly running cost = 0 for the course version |
| BG-06 | Build a foundation that can grow into a real product | `K1` | No requirement in this document blocks a later public release, except the explicitly listed validation steps (C-07) |

---

## 5. User Needs

| ID | Stakeholder | Need | Priority | Source |
|---|---|---|---|---|
| UN-01 | Patient, parent | Find out which of the common illnesses (§1.1) I most likely have | M | `I1-Q2`, `I3-Q1` |
| UN-02 | Patient, parent | Know which medicine to take, the exact dose, and when to take it (times of day, relative to meals) | M | `I1-Q2` |
| UN-03 | Patient, parent | Get natural remedies that help me recover | M | `I1-Q2` |
| UN-04 | Parent | Use the app on behalf of my child, with advice adapted to the child's age and weight | M | `I1-Q1`, `I1-Q4`, `I1-Q7` |
| UN-05 | Patient, parent | Be sure the medicine is safe given allergies, chronic illnesses and current medicines | M | `I1-Q8`, `K3` |
| UN-06 | Patient, parent | Save health information and past consultations so I don't re-enter them | M | `I1-Q8` |
| UN-07 | Patient, parent | Be told clearly to see a doctor when the problem is serious, unclear, not a covered illness, or may need a prescription medicine | M | `I1-Q11`, `I2-Q1` |
| UN-08 | Patient, parent | Use the app in French or Modern Standard Arabic | M | `I1-Q11` |
| UN-09 | Patient, parent | Use the app on my phone, even with a weak internet connection | M | `I1-Q6` |
| UN-10 | Patient, parent | Speak to the app and hear answers | W (later) | `I1-Q9` |
| UN-11 | Product owner | Build and run the system at zero cost | M | `I1-Q12` |
| UN-12 | Product owner | Have a real, measurable AI component, not a thin wrapper | S | `I1-Q12` |
| UN-13 | Product owner | Be able to grow the project into a real product later | S | `K1` |
| UN-14 | Patient, parent | Use the app easily even with very little experience of smartphones — including people who cannot create a social-media account on their own | M | `K3`, `I3-Q15` |
| UN-15 | Patient, parent | Know when my problem may need a medicine that only a doctor can prescribe, without the app prescribing it | M | `I2-Q1` |
| UN-16 | Patient, parent | Describe how I feel in my own words, not only by answering fixed questions | M | `I2-Q5` |

---

## 6. Functional Requirements

### 6.1 Account, consent and disclaimer

| ID | Requirement | Source | Priority | Acceptance Criteria |
|---|---|---|---|---|
| FR-01 | The system shall allow a user to create an account. | UN-06 · `I1-Q8` | M | A new user can register and log in; a second registration with the same identifier is rejected. |
| FR-02 | The system shall require the user to confirm that they are 18 or older before the account is created. | `I1-Q4` | M | Registration cannot complete without the age confirmation; a user who declares under 18 is refused with a message in their language. |
| FR-03 | The system shall record the user's explicit, timestamped consent to the storage of health data before storing any health data. | UN-06 · `ASM-07` | M | No profile data is saved until consent exists; the consent record holds date, time and text version. |
| FR-04 | The system shall allow the user to withdraw consent and delete their account and all associated data. | `ASM-07` | M | After deletion, no profile, consultation or health record for that user can be retrieved. |
| FR-05 | The system shall show the disclaimer "Your first step to feeling better, not a replacement for your doctor. When Sahti says *see a doctor*, please do." and require the user to acknowledge it on first use. | `ASM-08` · `I2-Q10`, `I3-Q12` | M | The app cannot be used before acknowledgement; the acknowledgement is stored with a timestamp; the text appears in FR and MSA. |

### 6.2 Patient profiles

| ID | Requirement | Source | Priority | Acceptance Criteria |
|---|---|---|---|---|
| FR-06 | The system shall ask every new user to create their own patient profile during first setup. | UN-06 · `I1-Q1`, `I1-Q8`, `I2-Q17` | M | After first sign-up, the app opens the profile form; the "self" profile can be viewed and edited later. |
| FR-07 | The system shall allow a user to create patient profiles for their children aged 2 to 17. | UN-04 · `I1-Q1`, `I1-Q4`, `I1-Q10` | M | A child profile with age 2–17 can start consultations; age ≥ 18 for a child profile is rejected; age < 2 is handled per UC-02 (1a). |
| FR-08 | The system shall store, for each patient profile: full name, date of birth, sex, weight, height, allergies, chronic illnesses, current medicines, smoking status and alcohol use. | UN-05 · `I1-Q7`, `I1-Q8`, `I2-Q17`, `I3-Q6` | M | Each field is saved and shown in the profile summary. |
| FR-09 | The system shall require a weight for every patient profile under 18, and ask whether the parent is sure of it; when not sure, the lower dose band is used. | UN-04 · `I1-Q7`, `I7-Q1` | M | A child profile without a weight cannot be saved; a weight marked "not sure" gives the dose of the weight 3 kg lower. |
| FR-10 | The system shall require a weight for adult patient profiles. | `ASM-10` · `I2-Q17` | M | An adult profile without a weight cannot be saved. |
| FR-11 | The system shall let the user select allergies, chronic illnesses and medicines from a list and also enter any item as free text. | UN-05 · `ASM-11` | M | Both a listed item and a free-text item can be saved; free text is never silently discarded. |
| FR-12 | The system shall ask for pregnancy and breastfeeding status in profiles of female patients aged 12 to 55. | UN-05 · `ASM-12` | M | The question appears for those profiles only and must be answered with yes, no or "not sure". |
| FR-44 | The system shall ask, as an optional question, whether the patient uses recreational or misused substances (e.g. cannabis/THC, pregabalin, LSD), allow "prefer not to say", and use the answer only for safety checks; "prefer not to say" shall be treated as a possible use. | UN-05 · `I2-Q17b`, `I3-Q2` | S | The question can be skipped with "prefer not to say"; test cases with use or "prefer not to say" exclude medicines flagged as risky with those substances. |

### 6.3 Consultation and triage

| ID | Requirement | Source | Priority | Acceptance Criteria |
|---|---|---|---|---|
| FR-13 | The system shall let the user start a consultation for one selected patient profile. | UN-01, UN-04 · `I1-Q1` | M | The consultation record names exactly one profile. |
| FR-14 | The system shall refuse to give medicine advice for a patient younger than 2 years and display: "You must see a doctor — do not rely on this app for your baby's health." | `I1-Q7`, `I1-Q10`, `I2-Q8` | M | Any attempt to consult for age < 2 ends at the referral screen with this message and zero medicines. |
| FR-15 | The system shall ask symptom questions one at a time, where each question may depend on the previous answers, and let the user go back to correct the last answer. | UN-01 · `K3`, `I7-Q7` | M | Two consultations with different first answers receive different second questions in at least one tested case; going back re-asks the last question without removing any danger notice. |
| FR-16 | The system shall keep asking questions until the confidence reaches the stop target, and shall stop asking when no remaining question can increase the confidence. | `I2-Q15`, `I3-Q5`, `I3-Q11` | M | In every test consultation, questioning ends either at the stop target or when no question with positive expected gain remains; no consultation loops. |
| FR-17 | The system shall check every answer against the approved danger-sign list before asking the next question. | UN-07 · `I1-Q11` | M | A danger-sign answer at any position shows the danger notice immediately. |
| FR-18 | When a danger sign is detected, the system shall show a danger notice — "see a doctor" for urgent signs; "this situation is dangerous" with the numbers 190 (SAMU) and 198 (civil protection) for emergency signs — keep it visible on every later screen and on the result, and continue the consultation. | UN-07 · `I1-Q11`, `ASM-04`, `I7-Q3`, **`I7-Q4` (changed: previously the consultation stopped with no medicine)** | M | Every danger-sign test case shows the notice at the triggering answer and on every later screen and the result; emergency cases show 190 and 198. |
| FR-19 | When the symptoms do not match any covered illness (§1.1), the system shall tell the user to see a doctor and show no medicine. | UN-07 · `I1-Q11`, `I3-Q1` | M | Out-of-scope test cases end with referral and zero medicines. |
| FR-20 | The system shall display the most likely covered illness (§1.1), with a confidence level from 0 to 100 %. | UN-01 · `I1-Q2`, `I3-Q1`; confidence: `ASM-14` | M | The result shows exactly one primary illness from the active illness list, plus a percentage. |
| FR-21 | The system shall show the main symptoms that led to the suggested illness. | `ASM-15` | S | The result lists at least two of the user's answers as reasons. |
| FR-22 | When the confidence is below 60 %, the system shall show "uncertain result — ask a pharmacist", and may show only natural remedies and only OTC medicines that are safe for the patient and suitable for **every** illness that is still likely. | `I2-Q2` | M | In test cases with confidence < 60 %, every shown medicine is linked to all still-likely illnesses and passes all safety rules; the uncertain message is shown. |
| FR-23 | The system shall save an in-progress consultation so it can be resumed after a lost connection or app closure, and tell the user when an unfinished consultation has expired. | UN-09 · `I1-Q6` (DER), `I7-Q6` | S | Closing the app mid-consultation and reopening resumes at the same question; after expiry, the next opening shows what happened. |
| FR-41 | The system shall let the user describe their symptoms in their own words, convert the description into answers to the question bank, and ask the user to confirm or correct each converted answer with buttons before it is used. | UN-16 · `I2-Q5` | M | No converted answer is used before the user confirms it; a rejected answer is asked again as a normal question. |
| FR-42 | The system shall scan the user's own-words description for danger words with deterministic rules, in addition to the AI conversion, and treat any match as a danger sign to be confirmed. | UN-07 · `I1-Q11`, `I2-Q5` (DER) | M | Every danger-word test text triggers the danger-sign confirmation **before any converted answer is shown**, whatever the AI conversion returns; nothing else can be answered while a confirmation is pending (EV1 F-02). |
| FR-47 | The system shall not show a likely illness or an uncertain result until every required danger-screening question (the general ones and those of every still-likely illness) has been answered. | UN-07 · `I1-Q11`, `I6-Q0` (DER from EV1 F-01) | M | In every test consultation, including ones where the AI is already confident after the own-words answers, no illness or uncertain result appears before the screening questions are answered. |

### 6.4 Recommendation

| ID | Requirement | Source | Priority | Acceptance Criteria |
|---|---|---|---|---|
| FR-24 | The system shall recommend only medicines present in the approved medicine list. | UN-02 · `I1-Q5`, C-07 | M | No recommended medicine is absent from the approved list in any test case. |
| FR-25 | The system shall recommend only over-the-counter (non-prescription) medicines. | `ASM-16` · `I2-Q1` | M | No prescription-only medicine (e.g. antibiotics) appears in any test case. |
| FR-26 | The system shall exclude every medicine contraindicated by the patient's allergies, chronic illnesses, current medicines, age, or pregnancy/breastfeeding status. | UN-05 · `I1-Q8`, `K3`; pregnancy: `ASM-12` | M | 100 % of contraindication test cases exclude the forbidden medicine. |
| FR-27 | The system shall not recommend a medicine that the patient already reports taking. | UN-05 · `I1-Q8` (DER) | M | Duplicate-therapy test cases exclude the medicine already taken. |
| FR-28 | For each recommended medicine, the system shall display the dose taken from the approved dose data for the patient's age and weight. | UN-02 · `I1-Q2`, `I1-Q7` | M | Every displayed dose equals the dose-table value for that age/weight band. |
| FR-29 | For each recommended medicine, the system shall display how many times per day to take it, at which moments (e.g. morning after breakfast), and for how many days. | UN-02 · `I1-Q2` | M | Each recommendation shows frequency, moment relative to meals, and duration, all from the approved data. |
| FR-30 | The system shall display, for each recommendation, the instruction to see a doctor if symptoms have not improved by the end of the stated duration or get worse. | UN-07 · `ASM-17` | M | The instruction appears on every recommendation screen. |
| FR-31 | The system shall display natural remedies for the suggested illness, taken only from the approved natural-remedy list. | UN-03 · `I1-Q2` | M | Every displayed remedy exists in the approved list. |
| FR-32 | The system shall exclude any natural remedy that is unsafe for the patient's age, allergies, chronic illnesses, current medicines, or pregnancy/breastfeeding status. | UN-03, UN-05 · `I1-Q2`, `I1-Q8` (DER) | M | Remedy-safety test cases exclude the forbidden remedy. |
| FR-33 | When no safe medicine remains after the exclusions, the system shall say so and advise the user to ask a pharmacist. | UN-07 · `ASM-18` | M | Test cases where every candidate is excluded show this message and zero medicines. |
| FR-34 | The system shall show which relevant medicines were excluded and why, in plain language. | UN-05 · `ASM-19` · `I2-Q13` | M | Exclusion test cases display the excluded medicine and its reason. |
| FR-43 | When the answers match a pattern in which a prescription treatment may be needed (e.g. signs of bacterial angine), the system shall display "This may need a treatment only a doctor can prescribe — see a doctor", without naming or dosing any prescription medicine. | UN-15 · `I2-Q1` | M | Every test case matching a prescription-need pattern shows the message; no prescription medicine name or dose appears. |
| FR-45 | The system shall display natural remedies before medicines on every result. | `I3-Q8` | M | On every result screen, the remedies section appears above the medicines section. |
| FR-46 | The system shall apply per-illness age and sex limits from the clinical data; outside the limits of the most likely illness, it shall advise seeing a doctor and show no medicine for that illness. | UN-04, UN-07 · `I5-Q1`, `I5-Q2` | M | Test cases outside an illness's limits end in a referral with 0 medicines for that illness. |

### 6.5 History

| ID | Requirement | Source | Priority | Acceptance Criteria |
|---|---|---|---|---|
| FR-35 | The system shall save each completed consultation with date, patient profile, answers, result (illness and confidence, referral, or uncertain) and recommendations. | UN-06 · `I1-Q8` | M | Every finished test consultation appears in history with all listed fields. |
| FR-36 | The system shall list past consultations per patient profile, newest first. | UN-06 · `I1-Q8` | M | The history list for a profile shows only that profile's consultations, in date order. |
| FR-37 | The system shall display the full details of a selected past consultation. | UN-06 · `I1-Q8` | M | Opening an entry shows all fields saved under FR-35. |

### 6.6 Language and data administration

| ID | Requirement | Source | Priority | Acceptance Criteria |
|---|---|---|---|---|
| FR-38 | The system shall let the user choose French or Modern Standard Arabic, and show every screen, question and result in the chosen language. | UN-08 · `I1-Q11` | M | Switching language changes all user-facing text; no screen mixes languages except medicine names. |
| FR-39 | The system shall allow an authorised administrator to update the medicine, dose, interaction, danger-sign and natural-remedy data without changing the app's code. | `ASM-02` | S | A data update is visible in the app after import, with no new app release. |
| FR-40 | The system shall record who changed the clinical data, when, and what changed. | `ASM-02` | S | Each import produces an audit entry with author, date and summary. |

---

## 7. Non-Functional Requirements

| ID | Category | Requirement | Source |
|---|---|---|---|
| NFR-01 | Performance | The system shall display each next question within 3 s for 95 % of requests on a 3G connection (≈ 1 Mbit/s). | `I1-Q6` (DER), `ASM-20` |
| NFR-02 | Performance | The system shall display the final result within 5 s for 95 % of consultations on a 3G connection. | `I1-Q6` (DER), `ASM-20` |
| NFR-03 | Performance | The app's data transfer for one full consultation shall not exceed 500 KB, excluding the first app download. | `I1-Q6` (DER), `ASM-20` |
| NFR-04 | Availability | The service shall be available ≥ 99 % of the time per month, measured on the hosted backend. | `ASM-21` |
| NFR-05 | Scalability | The system shall support 100 simultaneous consultations with NFR-01/NFR-02 still met (tested by load test). | `ASM-21` |
| NFR-06 | Security | Passwords shall be stored only as salted hashes using a modern algorithm (e.g. bcrypt or Argon2). | `I1-Q8` (DER) |
| NFR-07 | Security | All data shall be encrypted in transit (TLS 1.2+) and health data encrypted at rest. | `I1-Q8` (DER) |
| NFR-08 | Security | A user shall be able to access only their own account and their own patient profiles. | `I1-Q8` (DER) |
| NFR-09 | Privacy | Logs shall contain no names, contact details, allergies, illnesses or medicines in readable form. | `I1-Q8` (DER) |
| NFR-10 | Privacy | No data that identifies a user shall be sent to an external AI service. | `I1-Q8`, `I1-Q12` (DER) — see CF-03 |
| NFR-11 | Usability | Users aged 40+ shall reach a System Usability Scale (SUS) score ≥ 75 in a test with ≥ 5 participants. | UN-14, BG-03 · `ASM-06` |
| NFR-12 | Usability | A first-time user shall complete a consultation (from start to result) in a median time ≤ 5 minutes. | UN-14 · `ASM-06`, `I3-Q15` |
| NFR-13 | Accessibility | Text shall be at least 18 sp, contrast ratio ≥ 4.5:1, and touch targets ≥ 48 dp. | BG-03 · `ASM-06` |
| NFR-14 | Accessibility | The Arabic interface shall be fully right-to-left; doses, weights and percentages shall use Western digits (0–9) in both languages. | `I1-Q11` (DER), `ASM-22` |
| NFR-15 | Maintainability | An administrator shall be able to update the clinical data in under 30 minutes, without a code change (see FR-39). | `ASM-02` |
| NFR-16 | Maintainability / Safety | Every business rule in §11 shall have at least one automated test, and the full safety test suite shall pass before any release. | BG-02 · `LAB`, `ASM-23` |
| NFR-17 | Reliability | If the AI service or any component fails or times out, the system shall show a referral message and no medicine — never an empty or invented result. | BG-02 · `K3` (DER) |
| NFR-18 | Reliability | The system shall not lose a saved profile or completed consultation after a crash or lost connection. | UN-06 · `I1-Q6` (DER) |
| NFR-19 | Interoperability | The clinical data shall be importable from UTF-8 CSV files. | `ASM-02` |
| NFR-20 | Interoperability / Platform | The app shall run on Android phones (version to be fixed in design). | `I1-Q6`, `ASM-24` |
| NFR-21 | Compliance | The app shall be described everywhere as an information tool that does not replace a doctor, not as a medical device. | `ASM-08` |
| NFR-22 | Compliance | Processing of health data shall follow Tunisian personal-data law (Loi organique n° 2004-63 — current text to be verified) and INPDP requirements. | `I1-Q8` (DER), `ASM-07` |
| NFR-23 | Compliance | Clinical data (medicines, doses, interactions, danger signs, natural remedies) shall be validated by a licensed pharmacist before any public release. | `I1-Q3`, `I1-Q5` (DER) · C-07 |
| NFR-24 | Cost | The course version shall run with zero monthly cost (free tiers or local resources only). | `I1-Q12` |

---

## 8. AI-Specific Requirements

| ID | Topic | Requirement | Source |
|---|---|---|---|
| AI-01 | AI capabilities | The AI shall (1) convert an own-words description into answers to the question bank, (2) choose the next question from the answers so far, and (3) classify the case into one of the covered illnesses (§1.1) or "out of scope", with a confidence score. | `K3`, `I1-Q2`, `I2-Q5`, `I3-Q1` |
| AI-02 | Inputs and outputs | Input: patient age band, sex, pregnancy status, chosen language, the question/answer history, and the own-words description with names removed — no name or contact details. Output: converted answers, or one next question, or a structured result `{illness, confidence 0–100, out_of_scope, reasons[]}`. | NFR-10 · `ASM-25`, `I3-Q18` |
| AI-03 | Model responsibilities | The AI shall **never** output a medicine name (including prescription medicines), dose, timing or natural remedy. Medicines and remedies are selected only by the deterministic rules engine from approved data. | `K3`, `I2-Q1` |
| AI-04 | Human in the loop | Clinical data used by the rules engine shall be approved by a human clinical reviewer before public release; the AI cannot change it. Danger-sign and uncertain results shall require the user to acknowledge the referral message. | NFR-23 · `ASM-03` |
| AI-05 | Accuracy expectations | On a held-out test set, the AI classifier shall reach macro-F1 ≥ 0.80 across the covered illnesses (about 80 correct out of 100, without being much worse on any one illness), reported with a 95 % confidence interval. | `ASM-26`, `I3-Q16` |
| AI-06 | Accuracy expectations (baseline) | The fine-tuned model shall be compared against a simple rule-based baseline on the same test set; the report shall state honestly whether the model is better. | `I2-Q6` · `LAB` |
| AI-07 | Confidence / uncertainty | Confidence below 60 % shall trigger the uncertain path (FR-22). The confidence score shall be checked for calibration (reliability diagram or expected calibration error reported). | `ASM-14` |
| AI-08 | Hallucination mitigation | Every AI output shall be validated against a fixed schema; any output naming an illness outside the active illness list, naming any medicine, missing a field, or containing text outside the schema shall be rejected and treated as a failure (NFR-17). | `K3` (DER) |
| AI-09 | Danger signs | Danger-sign detection shall be done by deterministic rules on the user's answers, not only by the AI. The AI cannot cancel a danger sign found by the rules or remove its notice. | `I1-Q11`, `K3` (DER), `I7-Q4` |
| AI-10 | Explainability | Each result shall list the user answers that most influenced the classification (FR-21). | `ASM-15` |
| AI-11 | Bias / fairness | Arabic shall work as well as French: macro-F1 in Modern Standard Arabic within 5 points of the French score, for both answer conversion and classification; results also reported per age band (2–11, 12–17, 18–39, 40–64, 65+) and per sex. | `I3-Q4` |
| AI-12 | Data requirements | No real patient data shall be used for training or evaluation. Cases shall be written from public clinical guidance and synthetic variations, each tagged with its origin, in French and MSA. A test set shall be frozen before any model tuning. | `I1-Q3`, `I1-Q12` (DER) · `ASM-28` |
| AI-13 | Model monitoring | The system shall log, without personal data: model version, confidence, result type (illness / uncertain / referral / out of scope), language and latency for each consultation. | NFR-09 · `ASM-29` |
| AI-14 | Model failure handling | Timeout, invalid output or service error → referral message and no medicine (NFR-17). | `K3` (DER) |
| AI-15 | AI safety constraints | The AI shall answer only in the user's chosen language, discuss only the covered illnesses, and refuse any request for diagnosis of other conditions, prescription medicines, or doses. Prompt-injection attempts in typed text shall not change these rules. | `I1-Q11`, `K3`, `I2-Q5` |
| AI-16 | Privacy | Only the fields in AI-02 may be sent to the AI; names are removed from typed text first (best effort). Both models run on the project's own server (`I4-Q3`); no external AI service is used in v1. If one is ever considered, its terms must not allow the provider to train on or keep the submitted data. | NFR-10 · CF-03 · `I3-Q18`, `I4-Q3` |
| AI-17 | Evaluation criteria | Before release: AI-05, AI-06, AI-07, AI-11 and AI-20 reported; 100 % of danger-sign test cases show the danger notice (FR-18); 0 medicine names or doses produced by the AI in a review of ≥ 50 sampled outputs. | BG-02 · `ASM-26` |
| AI-18 | Cost | The AI component shall use only free resources (free API tiers, free cloud notebooks, or local models) for development and running. | `I1-Q12` |
| AI-19 | Model choice | A model fine-tuned by the product owner shall read own-words text into question-bank answers; a simpler trained classifier shall decide the illness, choose questions and give the reasons. Both are trained with free resources and run on the project's own server. | `I2-Q5`, `I2-Q6`, `I4-Q2`, `I4-Q3`, `I1-Q12` |
| AI-20 | Conversion accuracy | On a held-out set of own-words descriptions in French and MSA, the conversion shall reach ≥ 90 % precision on extracted answers (wrong answers are worse than missing ones, because users confirm what is extracted). | `I2-Q5` (DER) · `ASM-31` |

---

## 9. User Stories

**US-01 — Account** (FR-01, FR-02, FR-03, FR-05)
As an adult user, I want to create an account, so that my family's health information is kept for next time.
- Given I am on the sign-up screen, when I confirm I am 18+, accept the consent and acknowledge the disclaimer, then my account is created.
- Given I say I am under 18, when I try to register, then registration is refused.

**US-02 — My profile** (FR-06, FR-08, FR-10, FR-11, FR-12)
As a patient, I want to record my allergies, chronic illnesses and current medicines, so that I am never advised something unsafe for me.
- Given I enter a penicillin allergy and save, when I open my profile, then the allergy is shown.
- Given my allergy is not in the list, when I type it as free text, then it is saved.

**US-03 — Child profile** (FR-07, FR-09, FR-14)
As a parent, I want to add my child with their age and weight, so that advice is adapted to them.
- Given I enter a child aged 5 without a weight, when I save, then the app asks for the weight.
- Given I enter a child aged 1, when I try to start a consultation, then the app explains it cannot give advice under 2 years and suggests a doctor.

**US-04 — Guided questions** (FR-13, FR-15, FR-16, FR-23)
As a sick user, I want simple questions one at a time, so that I can describe my symptoms easily.
- Given the app is not yet confident, when I answer, then it asks another question; when it is confident enough, it stops.
- Given I start a consultation, when I answer a question, then the next question depends on my answer.
- Given my connection drops, when I reopen the app, then I continue from the same question.

**US-05 — Danger signs** (FR-17, FR-18)
As a user, I want to be told immediately when I need a doctor, so that I don't waste time on home treatment.
- Given I report difficulty breathing, when I submit the answer, then a "this situation is dangerous" notice with 190 and 198 appears, and it stays on every screen until my result (`I7-Q4`).

**US-06 — Likely illness** (FR-19, FR-20, FR-21, FR-22)
As a user, I want to see the likely illness, how sure the app is, and why, so that I understand the result.
- Given the questions are finished, when the result appears, then I see one of the covered illnesses, a percentage and the main reasons.
- Given the confidence is below 60 %, when the result appears, then I am told the result is uncertain and to ask a pharmacist, and I see only remedies and medicines safe for every illness still likely.

**US-07 — Safe medicine, dose and timing** (FR-24 – FR-30, FR-33)
As a user, I want to know which medicine to take, how much, and when, so that I can treat myself safely.
- Given I have high blood pressure, when the recommendation is shown, then no medicine contraindicated with high blood pressure appears.
- Given a medicine is recommended, when I read it, then I see the dose, times per day, moment relative to meals and number of days.
- Given my child weighs 18 kg, when a dose is shown, then it is the dose for that weight band.

**US-08 — Natural remedies** (FR-31, FR-32)
As a user, I want natural remedies, so that I can feel better without relying only on medicine.
- Given the likely illness is a cold, when the result is shown, then natural remedies from the approved list appear.
- Given a remedy is unsafe in pregnancy and the patient is pregnant, when the result is shown, then that remedy does not appear.

**US-09 — History** (FR-35 – FR-37)
As a user, I want to see past consultations, so that I can remember what I took last time.
- Given I finished a consultation, when I open history, then it appears with its date and result.

**US-11 — My own words** (FR-41, FR-42)
As a user who finds forms hard, I want to say how I feel in my own words, so that I don't have to understand every question.
- Given I type "I have had a sore throat and fever since yesterday", when the app converts it, then it shows "Sore throat: yes · Fever: yes · Since: 1 day" for me to confirm.
- Given I type "I can't breathe properly", when I send it, then the app asks me to confirm a danger sign and, if confirmed, shows the danger notice before anything else.

**US-12 — Prescription needed** (FR-43)
As a user, I want to know when my problem may need a prescription, so that I see a doctor instead of guessing.
- Given my answers match signs of a bacterial sore throat, when the result appears, then I see "This may need a treatment only a doctor can prescribe — see a doctor" and no prescription medicine is named.

**US-10 — Language** (FR-38)
As an Arabic-speaking user, I want the whole app in Modern Standard Arabic, right-to-left, so that I can use it comfortably.
- Given I choose Arabic, when I open any screen, then all text is Arabic and the layout is right-to-left; doses use 0–9 digits.

---

## 10. Use Cases

### UC-01 — Register
- **Actor:** Adult user
- **Preconditions:** App installed; internet available.
- **Trigger:** User opens the app for the first time.
- **Main flow:** 1. User chooses a language. 2. User enters sign-up details. 3. User confirms they are 18+. 4. System shows the consent text; user accepts. 5. System shows the disclaimer; user acknowledges. 6. System creates the account.
- **Alternative flows:** 3a. User declares under 18 → registration refused. 4a. User refuses consent → no health data is stored and the user is told the app cannot give personalised advice without it (`ASM-07`).
- **Exceptions:** Identifier already used → error message. Network failure → retry message; nothing is half-created.
- **Postconditions:** Account exists with consent and disclaimer records.

### UC-02 — Manage patient profile
- **Actor:** Adult user (for self) or parent (for child)
- **Preconditions:** Logged in; consent recorded.
- **Trigger:** User chooses "add profile" or "edit profile".
- **Main flow:** 1. User chooses "me" or "my child". 2. User enters date of birth, sex, weight. 3. System asks pregnancy/breastfeeding if applicable. 4. User adds allergies, chronic illnesses, current medicines (list or free text). 5. System validates and saves.
- **Alternative flows:** 1a. Child age < 2 → profile saved but marked "doctor only"; no consultation possible (`ASM-30`). 2a. Child weight missing → save blocked.
- **Exceptions:** Value out of range (e.g. weight 0) → field error.
- **Postconditions:** Profile saved and shown in summary.

### UC-03 — Run a consultation
- **Actor:** Adult user or parent
- **Preconditions:** Logged in; at least one valid profile (age ≥ 2).
- **Trigger:** User taps "I feel sick" and selects a profile.
- **Main flow:** 0. User may first describe symptoms in own words; system converts them and the user confirms each answer (FR-41, FR-42). 1. System asks the first (next) question. 2. User answers. 3. System checks danger signs. 4. System asks the next question until confident enough or no useful question remains (FR-16). 5. AI returns illness and confidence. 6. Rules engine selects safe natural remedies and medicines with dose, timing and duration. 7. System shows the result, remedies first, with the disclaimer. 8. System saves the consultation.
- **Alternative flows:** 3a. Danger sign → UC-04. 5a. Out of scope → referral, no medicine. 5b. Confidence < 60 % → uncertain message; only remedies and OTC medicines suitable for every still-likely illness (FR-22). 5c. Prescription-need pattern → "see a doctor" message (FR-43). 6a. No safe medicine left → "ask a pharmacist", remedies only if safe.
- **Exceptions:** Connection lost → consultation saved; resumes later. AI timeout or invalid output → referral, no medicine.
- **Postconditions:** Consultation saved in history with its result.

### UC-04 — Danger-sign notice (changed by `I7-Q4`)
- **Actor:** Adult user or parent
- **Preconditions:** A consultation is in progress.
- **Trigger:** An answer, or a confirmed danger word, matches the danger-sign list.
- **Main flow:** 1. System shows the danger notice: "see a doctor" (urgent) or "this situation is dangerous" with call buttons 190 and 198 (emergency). 2. User acknowledges ("I understand") or calls. 3. The consultation continues; the notice stays on every later screen. 4. The result is shown as usual, with the notice above it.
- **Alternative flows:** None — the notice cannot be removed, also not by going back.
- **Exceptions:** Save fails → notice still shown; save retried.
- **Postconditions:** Danger sign and level recorded with the consultation; audit event written.

### UC-05 — View history
- **Actor:** Adult user or parent
- **Preconditions:** Logged in.
- **Trigger:** User opens "History".
- **Main flow:** 1. User picks a profile. 2. System lists consultations, newest first. 3. User opens one; system shows full details.
- **Alternative flows:** No consultations → empty-state message.
- **Exceptions:** Network error → retry message.
- **Postconditions:** None (read-only).

### UC-06 — Update clinical data
- **Actor:** Administrator (`ASM-02`)
- **Preconditions:** Administrator authenticated; new data validated by a clinical reviewer.
- **Trigger:** New or corrected medicine, dose, interaction, danger-sign or remedy data.
- **Main flow:** 1. Administrator uploads CSV files. 2. System validates format and consistency. 3. System shows a validation report. 4. Administrator confirms. 5. System activates the data and records an audit entry.
- **Alternative flows:** 2a. Errors found → nothing is activated; errors listed per row.
- **Exceptions:** Upload interrupted → previous data stays active.
- **Postconditions:** New data in use; audit entry stored; safety test suite must be re-run (NFR-16).

### UC-07 — Delete account
- **Actor:** Adult user
- **Preconditions:** Logged in.
- **Trigger:** User chooses "delete my account".
- **Main flow:** 1. System asks for confirmation. 2. User confirms. 3. System deletes the account, profiles and history.
- **Alternative flows:** User cancels → nothing changes.
- **Exceptions:** Deletion fails → user told; retried.
- **Postconditions:** No personal data remains retrievable.

---

## 11. Business Rules

| ID | Rule | Source |
|---|---|---|
| BR-01 | The only illnesses handled are the 20 listed in §1.1. Anything else leads to "see a doctor". | `I3-Q1`, `I3-Q9` |
| BR-02 | Any danger sign shows a danger notice that stays on every later screen and on the result (emergency: "this situation is dangerous" + 190 and 198); the consultation continues. *(Until v0.3: stopped the consultation and blocked all advice.)* | `I1-Q11`, **`I7-Q4`** |
| BR-03 | Only adults aged 18+ may use the app. Patients under 18 are handled only through a parent's account. | `I1-Q4` |
| BR-04 | No medicine advice is given for patients younger than 2 years. | `I1-Q10` |
| BR-05 | A weight is mandatory for patients under 18. | `I1-Q7` |
| BR-06 | Doses come only from the approved dose data. The AI never produces a dose, medicine name or remedy. | `I1-Q2`, `K3` |
| BR-07 | Only medicines in the approved list, and only over-the-counter ones, may be recommended. | `I1-Q5` · `ASM-16` |
| BR-08 | A medicine contraindicated by the patient's profile is never recommended. | `I1-Q8`, `K3` |
| BR-09 | A medicine the patient already takes is never recommended again. | `I1-Q8` (DER) |
| BR-10 | Natural remedies come only from the approved list and follow the same safety filtering as medicines. | `I1-Q2` (DER) |
| BR-11 | Below 60 % confidence, only natural remedies and OTC medicines that are safe for the patient and suitable for every still-likely illness may be shown, with "ask a pharmacist". | `I2-Q2` |
| BR-12 | Every recommendation includes "see a doctor if no improvement after N days or if it gets worse". | `ASM-17` |
| BR-13 | Every result screen shows the disclaimer. | `ASM-08` |
| BR-14 | No health data is stored before consent is recorded. | `ASM-07` |
| BR-15 | Any system or AI failure results in a referral, never in medicine advice. | NFR-17 |
| BR-16 | No prescription medicine is ever named or dosed. When one may be needed, the app refers to a doctor. | `I2-Q1` |
| BR-17 | Natural remedies are always shown before medicines. | `I3-Q8` |

---

## 12. Assumptions

Analyst assumptions from v0.1 and their status after the stakeholder review of 2026-11-02/03.

| ID | Assumption (as now approved) | Status | Used by |
|---|---|---|---|
| ASM-01 | Consultation cost and self-medication risk are a real problem; to be proven with figures later. | ✅ Approved `I3-Q13` | §1 |
| ASM-02 | An administrator updates clinical data by uploading files, without a new app version. | ✅ Approved `I2-Q18` | FR-39, FR-40, NFR-15, NFR-19, UC-06 |
| ASM-03 | A pharmacist or doctor validates clinical data offline, without a login in v1; the AI model cannot be the validator. | ✅ Approved `I3-Q10` | §3, AI-04 |
| ASM-04 | Emergency danger signs show a call button for 190 (SAMU). | ✅ Approved `I2-Q16` | FR-18 |
| ASM-05 | Pilot target: ≥ 60 % would avoid an unnecessary visit. | ✅ Approved `I3-Q14` | BG-01 |
| ASM-06 | SUS ≥ 75 with ≥ 5 users aged 40+; median ≤ 5 min per consultation; 18 sp text; usable by non-technical users. | ✅ Approved (5 min) `I3-Q15` | BG-03, NFR-11–NFR-13 |
| ASM-07 | Explicit consent before health data; withdrawal and full deletion. | ✅ Approved `I2-Q4` | FR-03, FR-04, NFR-22, BR-14, UC-01 |
| ASM-08 | A disclaimer must be acknowledged; wording per FR-05. | ✅ Approved `I2-Q10`, `I3-Q12` | FR-05, NFR-21, BR-13 |
| ASM-09 | Sex is collected. | ✅ Approved (wider profile) `I2-Q17` | FR-08 |
| ASM-10 | Weight is also collected for adults. | ✅ Approved `I2-Q17` | FR-10 |
| ASM-11 | List plus free text for allergies, illnesses and medicines. | ✅ Approved `I2-Q18`–`I2-Q20` | FR-11 |
| ASM-12 | Pregnancy and breastfeeding asked for female patients aged 12–55; "not sure" counts as yes. | ✅ Approved `I2-Q3` | FR-12, FR-26 |
| ASM-13 | ~~At most 10 questions.~~ | 🔁 Replaced by confidence-based questioning (FR-16) `I2-Q15`, `I3-Q11` | — |
| ASM-14 | A confidence score is shown; 60 % separates the normal and the uncertain path. | 🔁 Replaced: below 60 % → limited safe treatment (FR-22) `I2-Q2` | FR-20, FR-22, AI-07, BR-11 |
| ASM-15 | Main reasons are shown. | ✅ Approved `I2-Q14` | FR-21, AI-10 |
| ASM-16 | Only OTC medicines are recommended; prescription needs → referral. | ✅ Approved (alternative) `I2-Q1` | FR-25, FR-43, BR-07, BR-16 |
| ASM-17 | Each recommendation has a duration and a "see a doctor if not better" instruction. | ✅ Approved `I2-Q11` | FR-30, BR-12 |
| ASM-18 | All medicines excluded → "ask a pharmacist", safe remedies still shown. | ✅ Approved `I2-Q12` | FR-33 |
| ASM-19 | Excluded medicines and reasons are shown. | ✅ Approved (now Must) `I2-Q13` | FR-34 |
| ASM-20 | "Weak internet" = 3G level; data use kept to what the app needs. | ✅ Approved `I2-Q21` | NFR-01–NFR-03 |
| ASM-21 | 99 % availability and 100 simultaneous users once hosted. | ✅ Approved `I3-Q20` | NFR-04, NFR-05 |
| ASM-22 | Digits 0–9 for every medical number, also in Arabic. | ✅ Approved `I2-Q22` | NFR-14 |
| ASM-23 | A safety test suite must pass 100 % before every version. | ✅ Approved `I3-Q19` | NFR-16 |
| ASM-24 | Android first, iPhone later. | ✅ Approved `I2-Q23` | NFR-20 |
| ASM-25 | The AI never receives identity data; names removed from typed text. | ✅ Approved `I3-Q18` | AI-02 |
| ASM-26 | Macro-F1 ≥ 0.80 target. | ✅ Approved `I3-Q16` | AI-05, AI-17 |
| ASM-27 | ~~FR–AR gap ≤ 10 points.~~ | 🔁 Replaced: Arabic as good as French, gap ≤ 5 points (AI-11) `I3-Q4` | AI-11 |
| ASM-28 | Synthetic and guideline-based cases, labelled, tested on unseen cases. | ✅ Approved `I3-Q17` | AI-12 |
| ASM-29 | Monitoring without personal data. | ✅ Approved `I3-Q21` | AI-13 |
| ASM-30 | A baby profile (< 2) can be saved but cannot start a consultation; shows the FR-14 message. | ✅ Approved `I2-Q8` | UC-02 |
| ASM-31 | Conversion precision ≥ 90 % is the right target for own-words input. | ✅ Approved `I3-Q22` | AI-20 |

---

## 13. Constraints

| ID | Constraint | Source |
|---|---|---|
| C-01 | Budget is zero for development and running. | `I1-Q12` |
| C-02 | All course labs (requirements, design, AI-first coding) are due Wednesday 2026-11-04. | `I1-Q13` |
| C-03 | Deliverables are written in English; the app itself is in French and Modern Standard Arabic only. | `I1-Q11`, `I1-Q13` |
| C-04 | Single developer, single stakeholder source. | `I1-Q3`, `K1` |
| C-05 | Phone app; must work on weak internet; no offline mode required. | `I1-Q6` |
| C-06 | No voice in the first version. | `I1-Q9` |
| C-07 | No validated source exists yet for medicines, doses, timing or natural remedies. Any data used before pharmacist validation is draft and must be labelled as such. | `I1-Q5` |
| C-08 | The development laptop has limited free disk space (about 6–7 GB observed on 2026-11-02), which limits local models and tools. | Observation |
| C-09 | Scope is 20 illnesses (§1.1), but the deadline is 2026-11-04: the course deliverables specify all 20; clinical data and model training can only be prepared in stages. | `I3-Q1`, `I1-Q13` |

---

## 14. Open Questions

| ID | Question | Blocks |
|---|---|---|
| OQ-01 | Who will validate the clinical data (a pharmacist or doctor)? | NFR-23, AI-04, any public release |
| OQ-02 | Which source will be used for authorised medicines in Tunisia, and is the DPM list accessible? | FR-24 |
| OQ-03 | Which source will be used for doses and timing (official leaflets/SmPC)? | FR-28, FR-29 |
| OQ-04 | Which source will be used for natural remedies? (Definition **resolved** `I5-Q5`: herbal products plus home care such as rest, fluids, steam, gargles.) | FR-31, FR-32 |
| OQ-05 | What is the exact danger-sign list, and which signs are "emergency" versus "see a doctor soon"? | FR-17, FR-18 |
| OQ-06 | Is 60 % the right confidence threshold? | FR-22, BR-11 |
| OQ-07 | Which base model to fine-tune for reading own-words text (candidates mmBERT-base and XLM-R-base, chosen by a bake-off — [[Model Selection — Text Reader]])? *Where it runs is decided: the project's own server (`I4-Q3`).* | AI-16, AI-18, AI-19, NFR-01 |
| OQ-08 | Which free hosting and database will store health data securely? | NFR-04, NFR-07, NFR-24 |
| OQ-09 | How does the app confirm that a user is actually the parent of a child profile? Is a self-declaration enough? | FR-07 |
| OQ-10 | How long are consultations kept, and is there an automatic deletion period? | FR-35, NFR-22 |
| OQ-11 | Android only, or Android and iOS? | NFR-20 |
| OQ-12 | What is the current text of Tunisian data-protection law, and is registration with INPDP required? | NFR-22 |
| OQ-13 | ~~Sign-up method~~ — **resolved: email + password** (`I5-Q4`). Remaining: free password-reset email service. | FR-01 |
| OQ-14 | Allowed weight and height ranges for children and adults? | FR-08 – FR-10 |
| OQ-15 | How must recommendations behave when the profile contains free-text (uncoded) items the rules cannot check? **Decided for v1 (`I6-Q2`):** no medicine is shown while a medication or allergy item is uncoded; brand names are stored as synonyms of coded terms. | FR-11, FR-26, FR-27 |
| OQ-16 | Which source confirms the frequency order of the 20 illnesses in Tunisia? | §1.1 |
| OQ-17 | Which substances does the substance-use question list, and which medicine rules depend on each? | FR-44 |

### 14.1 Conflicts and ambiguities found

| ID | Conflict | Statements involved | Proposed resolution |
|---|---|---|---|
| CF-01 | **Exact doses vs. no validated source.** The app must give exact doses, but there is no data source and no clinical reviewer. | `I1-Q2` vs `I1-Q3`, `I1-Q5` | For the course, use clearly labelled draft data. Block any public release until a pharmacist validates it (NFR-23). |
| CF-02 | **Zero budget vs. a strong AI component and a hosted service.** Free tiers have rate limits; local models need hardware. | `I1-Q12` (budget) vs `I1-Q12` (effort), `I1-Q8` | Use a small model and free resources; measure the AI honestly against a baseline (AI-06). Revisit when budget exists. |
| CF-03 | **Health-data privacy vs. free external AI services.** Free APIs may keep or train on submitted data. | `I1-Q8` vs `I1-Q12` | Send no identity (AI-02); choose a service whose terms forbid retention, or a local model (AI-16). |
| CF-04 | **Weak internet vs. AI response time.** | `I1-Q6` vs AI-01 | Small requests (NFR-03), time limits with fail-safe (NFR-17), resume (FR-23). |
| CF-05 | **"Natural" vs. safe.** Natural remedies can be unsafe for some groups or interact with medicines. | `I1-Q2` vs UN-05 | Apply the same safety filtering as medicines (FR-32, BR-10). |
| CF-06 | **Adults only vs. child patients.** | `I1-Q4` vs `I1-Q1` | Resolved: children are profiles under a parent's account (FR-07, BR-03). |
| CF-07 | **Four illnesses vs. all non-fatal illnesses.** Round 1 confirmed four; round 2 asked for all non-fatal illnesses. | `I1-Q11` vs `I2-Q24` | Resolved: **20 most common illnesses** (§1.1) `I3-Q1`; built so illnesses are added as data. |
| CF-08 | **Photo feature** (`I5-Q8`) vs data budget on weak internet (NFR-03, 500 KB per consultation), privacy of face/skin images, need for a labelled image dataset, and the 2026-11-04 deadline. | `I5-Q8` vs `I2-Q21`, `I1-Q8`, `I1-Q13` | **Resolved** (`I5-Q8`): questions only in v1; photos as future item F-06 |

---

## 15. Risks

| ID | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R-01 | A wrong dose is shown, especially for a child | Medium | Severe | Doses only from approved data (BR-06); weight required (BR-05); safety tests (NFR-16); pharmacist validation (NFR-23) |
| R-02 | A serious illness is classified as one of the covered illnesses | Medium | Severe | Deterministic danger signs (AI-09); mandatory screening questions before any result (FR-47); a duration red-flag rule per illness [Approved `I6-Q10`]; out-of-scope path (FR-19); uncertainty threshold (FR-22) |
| R-03 | Requirements reflect one person's view only | High | High | Validate with a pharmacist and 3–5 target users before design is frozen (OQ-01) |
| R-04 | No reliable clinical data source can be obtained | Medium | High | Use official leaflets/SmPC; keep scope to a small set of common OTC medicines |
| R-05 | Deadline (2026-11-04) is too short for all labs | High | Medium | Prioritise Must items; record Should/Could for later |
| R-06 | Zero budget prevents a usable AI or hosting | Medium | Medium | Small models, free tiers, local demo for the course |
| R-07 | Health data leak | Low | Severe | NFR-06–NFR-10; minimal data to AI (AI-02) |
| R-08 | Arabic performance worse than French | Medium | Medium | Parity requirement (AI-11); Arabic test cases |
| R-09 | User ignores a referral | Medium | Severe | Clear urgent message with acknowledgement (UC-04); disclaimer |
| R-10 | Synthetic training data does not match real patients | High | Medium | State the limitation; freeze a reviewed test set (AI-12) |
| R-11 | 20 illnesses multiply the clinical data and the chance of confusing a serious illness with a mild one | High | Severe | Per-illness danger signs; out-of-scope path; staged validation; per-class metrics (AI-05) |
| R-12 | Own-words conversion misreads a symptom | Medium | High | User confirms every converted answer (FR-41); deterministic danger-word scan (FR-42), incl. dialect and Latin-script danger phrasings for detection only [Approved `I6-Q7`]; precision target (AI-20) |
| R-13 | Substance-use data leaks and harms the user legally | Low | Severe | Optional, "prefer not to say", encrypted, used only for safety checks (FR-44) |
| R-14 | The AI is confident after a few own-words answers and a danger sign is never asked about (EV1 P1) | High [INFERENCE (EV1): synthetic training data inflates confidence, R-10] | Severe | Mandatory screening (FR-47); production counter of results with incomplete screening = 0 (SRS §15.2) |
| R-15 | A stored profile is out of date (a child's weight from last year, a new medicine not added) (EV1 P3) | High [INFERENCE: non-technical users rarely edit profiles] | Severe | Re-confirm a child's weight and ask "any new medicines?" at each consultation start [Approved `I6-Q1`] |
| R-16 | A medicine typed as a brand name stays uncoded, so the duplicate and interaction checks cannot run (EV1 P4) | High [INFERENCE] | Severe | Brand names as synonyms of coded terms; no medicine shown while a medication or allergy item is uncoded [Approved `I6-Q2`]; OQ-15 closed for v1 |
| R-17 | A user with a danger sign reads the result's medicines, treats himself and delays care; the app gives medicine advice for a possibly serious case (legal and safety exposure) — consequence of `I7-Q4` | Medium [INFERENCE] | Severe | Notice on every screen and on the result; 190 and 198; counter of results under a danger notice (SRS §15.2); decision recorded as the owner's choice against the analyst's advice; to be re-examined with the clinical reviewer (OQ-01) |

---

## 16. Traceability Matrix

| User need | Functional / AI requirements | Non-functional | User story | Use case | Business rules |
|---|---|---|---|---|---|
| UN-01 Likely illness | FR-13, FR-15, FR-16, FR-20, FR-21, FR-22, AI-01, AI-05, AI-07, AI-08, AI-10 | NFR-01, NFR-02 | US-04, US-06 | UC-03 | BR-01, BR-11 |
| UN-02 Medicine, dose, timing | FR-24, FR-25, FR-28, FR-29, FR-30, AI-03, AI-04 | NFR-16, NFR-23 | US-07 | UC-03 | BR-06, BR-07, BR-12 |
| UN-03 Natural remedies | FR-31, FR-32, FR-45, AI-03 | NFR-23 | US-08 | UC-03 | BR-10, BR-17 |
| UN-04 Use for a child | FR-07, FR-09, FR-14, FR-28, FR-46 | — | US-03 | UC-02, UC-03 | BR-03, BR-04, BR-05 |
| UN-05 Safety vs. profile | FR-08, FR-10, FR-11, FR-12, FR-44, FR-26, FR-27, FR-32, FR-33, FR-34 | NFR-16 | US-02, US-07 | UC-02, UC-03 | BR-08, BR-09 |
| UN-06 Save info and history | FR-01, FR-03, FR-04, FR-06, FR-35, FR-36, FR-37, AI-02, AI-16 | NFR-06, NFR-07, NFR-08, NFR-09, NFR-10, NFR-18, NFR-22 | US-01, US-02, US-09 | UC-01, UC-02, UC-05, UC-07 | BR-14 |
| UN-07 Told to see a doctor | FR-05, FR-17, FR-18, FR-19, FR-22, FR-30, FR-33, FR-42, FR-43, FR-47, AI-09, AI-14 | NFR-17 | US-05, US-06 | UC-03, UC-04 | BR-01, BR-02, BR-11, BR-15, BR-16 |
| UN-08 French or MSA | FR-38, AI-11, AI-15 | NFR-14 | US-10 | UC-01 | — |
| UN-09 Phone, weak internet | FR-23 | NFR-01, NFR-02, NFR-03, NFR-20 | US-04 | UC-03 | — |
| UN-10 Voice | — (later version) | — | — | — | — |
| UN-11 Zero cost | AI-18 | NFR-24 | — | — | — |
| UN-12 Real AI component | AI-01, AI-05, AI-06, AI-07, AI-11, AI-12, AI-13, AI-17, AI-19, AI-20 | — | — | — | — |
| UN-13 Grow into a product | FR-39, FR-40 | NFR-04, NFR-05, NFR-15, NFR-19, NFR-21, NFR-22, NFR-23 | — | UC-06 | — |
| UN-14 Easy for 40+ and non-technical users | FR-06, FR-15, FR-16, FR-41 | NFR-11, NFR-12, NFR-13 | US-04, US-10, US-11 | UC-03 | — |
| UN-15 Prescription may be needed | FR-43, AI-03 | — | US-12 | UC-03 | BR-16 |
| UN-16 Own words | FR-41, FR-42, AI-01, AI-19, AI-20 | — | US-11 | UC-03 | — |

---

## 17. Future Scope (not in v1)

| ID | Item | Source |
|---|---|---|
| F-01 | Prescriptions through a **licensed doctor in the loop** (teleconsultation inside the app), within Tunisia's telemedicine framework (legalised 2022; implementing texts on telemedicine acts 2024). To be investigated with the Ministry of Health before scaling. | `I2-Q1` |
| F-02 | Doctors who cannot afford their own practice work through the app; they could also act as clinical reviewers. | `I3-Q3` |
| F-03 | Voice input and output. | `I1-Q9` |
| F-04 | iPhone version. | `I2-Q23` |
| F-05 | More illnesses, added as validated data, one at a time. | `I3-Q1` |
| F-06 | **Photo feature** for skin and eye problems: an image model as an extra input to the classifier, never the decision alone — once a licensed, labelled photo set is confirmed. | `I5-Q8` |
| F-07 | Nearest night pharmacy / nearest hospital emergency on the danger notice (needs location or a place list). | `I7-Q3` |
| F-08 | Understanding Tunisian dialect (Arabic script and Latin letters) in own-words input. | `I7-Q5` |

## Next steps
1. Answer OQ-13 – OQ-17 when possible.
2. Design lab (Labs 4–5) from [[SRS — Software Requirements and System Specification]] v0.2.
3. Find a clinical reviewer (OQ-01) — required before any real-world use.

Back to [[Sahti — Home]] · Interview: [[RE — Interview Log]]
