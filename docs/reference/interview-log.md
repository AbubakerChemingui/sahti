---
tags: [projects/sahti, sahti/requirements]
created: 2026-11-02
---
# RE — Interview Log

Elicitation interview held in chat. Claude acts as business analyst; Abubaker is the product owner and, for now, the **only stakeholder source**. Every requirement in [[RE — Requirements Elicitation Document]] cites an answer ID from this log (e.g. `I1-Q2`), a lab, or a marked assumption.

## Kickoff statements — 2026-11-02
- **K1:** Sahti is an AI-first engineering course project; the goal is to scale it into a real product later.
- **K2:** Rebuild from scratch; only the idea and scope carry over (see [[Decision — Rebuild from scratch]]).
- **K3 (scope, presented and not corrected):** adults with emphasis on 40+; the AI interviews the user and suggests the likely illness; a deterministic rules engine (no AI) has the final say on every medicine.

## Round 1 — 2026-11-02

| ID | Question | Answer (stakeholder statement) |
|---|---|---|
| I1-Q1 | Who holds the phone: the sick person, a family member helping them, or both? Can it be used for a child with a parent answering? | **Both.** Yes, a parent can answer for a child. |
| I1-Q2 | What does the user get at the end? (a) likely illness (b) + advice (c) + safe medicine names (d) + exact doses | **(a) and (d):** the likely illness **and** exact doses, **plus when to take them** (e.g. 3 times a day: morning after breakfast, afternoon after lunch, night after dinner), **plus natural remedies** to get better. |
| I1-Q3 | Has anyone besides you given input (pharmacist, doctor, family, teacher)? | **No — I am the only source for now.** |
| I1-Q4 | How young can a child be, and would you ask for the child's weight? | **The person using the app must be 18+.** For anyone under 18, a **parent** uses the app on their behalf. *(Minimum child age and weight not yet answered — follow-up I1-Q7.)* |
| I1-Q5 | Where do doses, timing and natural remedies come from? | **No source yet.** Asked for guidance on where to find a reliable one. |
| I1-Q6 | Phone app, website, or both? Must it work on weak or no internet? | **Phone app.** Must work on **weak** internet; **no offline** mode required. |
| I1-Q7 | When a parent uses the app for a child: minimum age? Ask for the child's weight? | **Yes, there must be a minimum age**, because babies are too fragile to handle like older children. **Yes, the app must ask for the child's weight.** *(Exact minimum age not given — follow-up I1-Q10 → 2 years.)* |
| I1-Q8 | Accounts with saved health info and past consultations, or one-off use? | **Accounts, yes.** Save health info (**allergies, chronic illnesses, current medicines**) and **past consultations**. |
| I1-Q9 | Voice (speak to the app, hear answers) in the first version? | **Later** — not in the first version. |
| I1-Q10 | Exact minimum age? Proposed: under 2 years → see a doctor, no medicine. | **Yes, 2 years works.** (To be confirmed by a pharmacist.) |
| I1-Q11 | Confirm scope: only rhume, grippe, angine, allergie; anything else or any danger sign → see a doctor, no medicine; French and Modern Standard Arabic only. | **Yes** to all three. *(Danger-sign part changed by I7-Q4: notice + consultation continues; illness scope changed by I3-Q1.)* |
| I1-Q12 | Does the course require a specific AI technique? Budget? | **No specific requirement**, but wants to make a real effort on the AI part. **Budget: 0** for now; maybe later. |
| I1-Q13 | Deadline and document language? | **English.** All the labs sent must be done by **Wednesday (2026-11-04)**. |

### Analyst notes on round 1 (to resolve, not requirements yet)
- **Exact doses for children** are weight- and age-dependent and are the highest-risk output of the system. Needs a validated dosing source and a decision on a minimum age.
- **Dose timing** ("after breakfast" etc.) differs per medicine; it must come from the medicine's data, not one generic schedule.
- **Natural remedies** need a source too; some are unsafe for certain groups (e.g. infants, pregnancy, some conditions).
- **"Everything is on the internet"** — not reliably. Doses must come from official medicine information (product leaflet / SmPC) and the official Tunisian list of authorised medicines, then be checked by a pharmacist. Random websites are not acceptable for doses. Candidate sources noted in [[Sahti — Open Questions]].
- **18+ operator rule** implies the app needs a way to state who the patient is (self vs. child) and the child's age/weight when a parent answers.
- **Single stakeholder** → every clinical rule needs later validation by a pharmacist or doctor; recorded as a risk.

## Round 2 — Approvals — 2026-11-02

Approval of the assumptions and proposed decisions listed in [[SRS — Software Requirements and System Specification#19.7 Requires stakeholder approval]].

| ID | Item | Answer | Status |
|---|---|---|---|
| I2-Q1 | ASM-16 — OTC only, never prescription medicines or antibiotics | First answer: **No** — prescription medicines including antibiotics "only when needed". **Revised (2026-11-03): accepts the alternative** — the app never names or doses a prescription medicine; when one may be needed (e.g. signs of bacterial angine) it says "this may need a treatment only a doctor can prescribe — see a doctor". **Future goal:** find a legal path to prescriptions when scaling (e.g. licence / Ministry of Health). | ✅ Approved (alternative) · future item F-01 |
| I2-Q2 | ASM-14 — confidence < 60 % → no medicine | First answer: **No** (< 60 % → remedies + OTC; ≥ 60 % → also prescription). **Revised (2026-11-03): accepts the alternative** — < 60 %: natural remedies + only OTC medicines safe and suitable for **all** illnesses still likely + "ask a pharmacist"; ≥ 60 %: OTC medicines + natural remedies, "in order" (display order not yet specified). | ✅ Approved (alternative) · order open |
| I2-Q3 | ASM-12 — pregnancy/breastfeeding asked for F 12–55; "not sure" = yes | **Yes.** | ✅ Approved |
| I2-Q4 | ASM-07 — consent before health data; full deletion | **Yes.** | ✅ Approved |
| I2-Q5 | PD-05 — fixed questions, button answers | Will implement a **fine-tuned model**. Chose **option B: buttons plus own words** — the user may describe symptoms in their own words; the fine-tuned model turns them into structured answers; the user confirms with buttons. | ✅ Decided — replaces PD-05 |
| I2-Q6 | PD-06 — main AI and comparison | Main AI = **his fine-tuned model** (option B). It is compared against a simple rule-based baseline (AI-06). | ✅ Decided — replaces PD-06 |
| I2-Q7 | PD-12 — doses from age/weight bands copied from official leaflets, never calculated | **Yes.** | ✅ Approved |
| I2-Q8 | ASM-30 — baby (< 2) profile can be saved, no consultation | **Yes, with a message:** the app must say "you must see a doctor — do not rely on this app for your baby's health". | ✅ Approved (with message) |
| I2-Q9 | Remaining assumptions | Go through them one by one. | ⏳ In progress |
| I2-Q10 | ASM-08 — disclaimer accepted on first use, shown on results | **Yes**, with his wording: "For now, this app doesn't replace a doctor." | ✅ Approved (wording to review) |
| I2-Q11 | ASM-17 — "if not better after N days or worse, see a doctor" | **Yes.** | ✅ Approved |
| I2-Q12 | ASM-18 — all medicines unsafe → "ask a pharmacist", still show safe remedies | **Yes.** | ✅ Approved |
| I2-Q13 | ASM-19 — show excluded medicines and why | **Yes** — so the user sees the impact of the app and the difference it makes. Raises FR-34 from Could to Must. | ✅ Approved · FR-34 → M |
| I2-Q14 | ASM-15 — show main reasons | **Yes.** | ✅ Approved |
| I2-Q15 | ASM-13 — max 10 questions | **Change:** keep asking until the confidence is strong enough — **confidence-based, not a fixed number**. | ✅ Direction approved · cap value pending |
| I2-Q16 | ASM-04 — call button for 190 (SAMU) on emergency signs | **Yes.** | ✅ Approved |
| I2-Q17 | ASM-09/10 — sex and weight for adults | **Yes, broader:** at install, everyone fills a profile: **full name, age, sex, weight, height** — "every metric the app can use". | ✅ Approved · exact field list pending (data minimisation) |
| I2-Q17b | Addition to the profile | Add a section asking whether the person **uses recreational or misused substances** (examples given: THC, pregabalin, LSD). | ✅ Requested · handling of this sensitive data pending |
| I2-Q18 | ASM-02 — admin updates medicine data by uploading files, no new app version | **Yes.** | ✅ Approved |
| I2-Q19 | ASM-03 — clinical reviewer checks data offline, no login in v1 | Did not understand. | ⏳ Re-asked in plain words |
| I2-Q20 | ASM-11 — list + "other" free text for allergies, illnesses, medicines | **Yes.** | ✅ Approved |
| I2-Q21 | ASM-20 — weak internet = 3G level | Keep data use to what the app needs; **3G is OK**. | ✅ Approved |
| I2-Q22 | ASM-22 — doses always in digits 0–9, also in Arabic | Answered "no", then stated: **"even in Arabic use the digits 0 to 9 for doses"** — same as the assumption. | ✅ Approved (answer matches the assumption) |
| I2-Q23 | ASM-24 — Android first, iPhone later | **Yes.** | ✅ Approved |
| I2-Q24 | ASM-26 — AI target ~8/10 across the four illnesses | Did not understand the target. **Scope statement:** "I'm not working for 4 illnesses only — all possible illnesses a human can have, except fatal ones like cancer or Alzheimer." | ⚠️ **Contradicts I1-Q11** (confirmed four illnesses only) — decision needed |
| I2-Q25 | ASM-27 — Arabic at most 10 points worse than French | **No.** | ⏳ Clarifying: no gap at all, or a smaller gap? |

## Round 3 — 2026-11-03

| ID | Item | Answer | Status |
|---|---|---|---|
| I3-Q1 | Scope (resolves CF-07 between I1-Q11 and I2-Q24) | **20 illnesses**, the **most common** ones, chosen and ordered by how common they are. Not 8–10, not "all". | ✅ Decided · list proposed in chat, pending confirmation |
| I3-Q2 | Recreational/misused substances section — handling | **Approved:** optional, "prefer not to say" allowed, encrypted, used only for safety checks; "prefer not to say" → avoid risky medicines. | ✅ Approved |
| I3-Q3 | Who checks the medical data (ASM-03) | "The model I'm going to use." Later: scale to **doctors who cannot afford their own practice working inside the app**. | ⚠️ Misunderstanding — an AI model cannot validate medical data; re-explained in chat · future item F-02 |
| I3-Q4 | Arabic vs French (ASM-27) | **Arabic must work as well as French.** Target accepted: difference ≤ 5 points. | ✅ Approved (≤ 5 points) |
| I3-Q5 | Question limit (ASM-13) | When unsure, the app **keeps asking until the confidence is optimal** — no fixed number. | ✅ Approved · stop rule proposed in chat |
| I3-Q6 | Name field | **Full name.** | ✅ Approved |
| I3-Q7 | Disclaimer wording | Asked for suggestions that fit his vision. | ⏳ Options proposed in chat |
| I3-Q8 | Display order | **Natural remedies first**, then medicines. | ✅ Approved |
| I3-Q9 | The 20-illness list proposed in chat | **Accepted.** | ✅ Approved |
| I3-Q10 | Data validation by a pharmacist/doctor, not by the model; course data = DRAFT | **OK.** | ✅ Approved |
| I3-Q11 | Stop rule: stop when confident enough, or when no remaining question can raise confidence | **"It's confident enough."** | ✅ Approved |
| I3-Q12 | Disclaimer wording | **Option C:** "Your first step to feeling better, not a replacement for your doctor. When Sahti says *see a doctor*, please do." | ✅ Approved |
| I3-Q13 | ASM-01 — the self-medication problem is real (to be proven with numbers later) | **Yes.** | ✅ Approved |
| I3-Q14 | ASM-05 — pilot: ≥ 6 in 10 testers would use Sahti instead of an unnecessary visit | **Yes.** | ✅ Approved |
| I3-Q15 | ASM-06 — SUS ≥ 75 with ≥ 5 testers aged 40+; consultation ≤ 5 min | **Yes** — and easy for **non-technical users, including people who struggle to create a Facebook account on their own.** | ✅ Approved (strengthened) |
| I3-Q16 | ASM-26 — right illness ≥ 80 of 100 test cases, not much worse on any one illness | **Yes.** | ✅ Approved |
| I3-Q17 | ASM-28 — learn from labelled example cases from official guides; test on unseen cases | **Yes.** | ✅ Approved |
| I3-Q18 | ASM-25 — AI never receives name or contact; names removed from typed text | **Yes.** | ✅ Approved |
| I3-Q19 | ASM-23 — safety tests pass 100 % before every version | **Yes.** | ✅ Approved |
| I3-Q20 | ASM-21 — once hosted: 99 % availability, 100 simultaneous users | **Yes.** | ✅ Approved |
| I3-Q21 | ASM-29 — performance monitoring without personal data | **Yes.** | ✅ Approved |
| I3-Q22 | ASM-31 — own-words conversion precision ≥ 90 % (wrong answers worse than missed ones) | **Yes, I want it like that.** | ✅ Approved |

### Analyst notes on round 2
- **I2-Q1/Q2 conflict with:** Tunisian rules on prescription-only medicines (prescribing requires a doctor); antibiotic resistance; the product's own safety principle (`K3`, BR-06). For the four illnesses, antibiotics are only relevant for **bacterial** angine, which cannot be told apart from viral angine reliably from symptoms alone (doctors use a rapid throat test). A 60 % threshold also means up to 40 % of those results could be wrong. Alternatives proposed in chat; decision pending.
- **Future item F-01 (scaling):** Tunisia legalised telemedicine in 2022, with implementing texts on telemedicine acts in 2024. A realistic path to prescriptions is a **licensed doctor in the loop** (teleconsultation through the app), not the app prescribing by itself. To investigate with the Ministry of Health before scaling.
- **I2-Q5:** a fine-tuned model is compatible with button answers; a hybrid (user may describe symptoms in their own words, the fine-tuned model turns them into the structured answers, user confirms with buttons) is also possible. Decision pending.
- **I2-Q24 vs I1-Q11 (conflict CF-07):** on 2026-11-02 the stakeholder confirmed scope = four illnesses; on 2026-11-03 he stated scope = all non-fatal illnesses. Options presented in chat; decision pending.
- **I2-Q17b:** use of illegal substances is highly sensitive (legal risk to the user if leaked). Proposed handling in chat: optional, "prefer not to say" allowed, encrypted, used only for safety checks.

### Analyst notes on round 3
- **Future item F-02:** doctors without the budget for their own practice work through the app (pairs with F-01 telemedicine).
- **I3-Q3:** the AI model is what the clinical data is meant to *constrain*; it cannot be its validator. For the course, data prepared from official sources and labelled DRAFT; for real use, a licensed pharmacist or doctor must validate it (NFR-23).
- **I3-Q1 candidate list** drawn from NHS self-care / pharmacy minor-ailment lists plus the original four; frequency ranking approximate until a Tunisian source or a pharmacist confirms it.

## Round 4 — Architecture decisions — 2026-11-03

From [[SDD — Architecture Decisions and Quality Scenarios]].

| ID | Decision | Answer | Status |
|---|---|---|---|
| I4-Q1 | ADR-03 — keep question selection fast | **(a)** a fast trained model picks the questions | ✅ Decided |
| I4-Q2 | ADR-04 — one model or two | **His fine-tuned model reads the text; a simpler classifier decides** | ✅ Decided |
| I4-Q3 | ADR-05 — where the model runs | **His own server** | ✅ Decided |
| I4-Q4 | ADR-10 — mobile technology | **"The best one for my project"** → Flutter recommended and recorded (switch to React Native if he knows React better) | ✅ Decided by delegation |
| I4-Q5 | C-2 — reasons from the deciding model | Asked for an explanation; resolved by I4-Q2 (the classifier that decides also gives the reasons) | ✅ Resolved |

## Round 5 — Consistency audit answers — 2026-11-03

From [[SDD — Consistency Audit 1]].

| ID | Item | Answer | Status |
|---|---|---|---|
| I5-Q0 | Fixes CA-01 – CA-05 (classifier framing, number reader, two data fields, home note) | "Yes" to the text reader as a sorting task (previous message); fixes applied as consequences | ✅ Applied |
| I5-Q1 | SC-01 — diarrhoea in children | **Only adults (18+) use the app; for a child, the parent handles it** (the parent is the user). | ✅ Recorded — combined with I5-Q2: the minimum age for diarrhoea advice is set per illness in the clinical data by the reviewer |
| I5-Q2 | V-2 — age and sex limits per illness | **Yes.** | ✅ Approved |
| I5-Q3 | V-3 — database for the demo | **SQLite**, "but the choice is yours; if PostgreSQL is best, go with it". | ✅ Decided by delegation: SQLite for the course demo, PostgreSQL from the pilot (same data-access layer) |
| I5-Q4 | V-4 — sign-up | **Email + password.** | ✅ Approved (note: tension with I3-Q15, see analyst notes) |
| I5-Q5 | V-5 — natural remedies | **Herbal products plus home care** (rest, fluids, steam, gargles…). | ✅ Approved — resolves OQ-04 (definition) |
| I5-Q6 | V-6 — starting values | **Stop at 85 % confidence** (starting value). The 90 % "still likely" value was not commented. | ✅ 85 % approved · 90 % stays Proposed |
| I5-Q7 | V-7 — trim additions | **Keep if they optimise the project, otherwise remove.** | ✅ Decided by delegation: remove tracing and the admin web page; defer multi-worker support to the pilot |
| I5-Q8 | V-8 — skin and eye problems | First: use a photo feature with the questions. **Final (2026-11-03): option (a)** — questions only in v1; photos as a future feature. | ✅ Decided — future item F-06 |
| I5-Q9 | V-6 — "still likely" = 90 % for the uncertain path | **OK with 90 %.** | ✅ Approved |

### Analyst notes on round 5
- **I5-Q4 vs I3-Q15:** email sign-up may be hard for users who cannot create a social-media account alone. Mitigations without scope change: one-screen sign-up, no email verification step required to start [Proposed], help text in FR/MSA.
- **I5-Q8:** photos were never excluded by any document (the audit's citation of "SRS §2.2 no imaging" was an error and is corrected). Photos conflict with the 500 KB data budget per consultation (SRS NFR-03), add highly sensitive images (faces, eyes, skin), need a labelled image dataset and an image model, and fall outside the 2026-11-04 deadline.

## Round 6 — Independent design-phase evaluation — 2026-11-03

From [[SDD — Evaluation Run 1]] (EV1), produced in a fresh session with [[Prompt — Architecture Evaluation (Design Phase)]].

| ID | Item | Answer | Status |
|---|---|---|---|
| I6-Q0 | EV1 findings (2 Critical, 17 contradictions, red-team P1 – P5) | **"fix it do not make any mistakes"** | ✅ Fixes adopted by delegation where EV1 names a specific fix (FR-47 screening gate, pending-confirmation state, activation gate, FR-46 referral kept, API-19 failure guidance, privacy fixes, contradictions X-01 – X-17). Where EV1 offers a choice or adds new behaviour (P2 duration red flags, P3 re-confirmation, P4 uncoded items, P5 dialect terms, name lexicon, structured doses, audit-key deletion, model pinning), the change was written as a proposal and then approved in I6-Q1 – I6-Q10 |

| I6-Q1 | P3 — re-confirm a child's weight and ask "any new medicines?" at each consultation start | **Yes, both.** | ✅ Approved |
| I6-Q2 | P4 — uncoded medication or allergy item | **No medicines shown** (remedies + "ask a pharmacist"); brand names as synonyms. | ✅ Approved — closes OQ-15 for v1 |
| I6-Q3 | Dose stored as number + unit, FR/AR text generated | **Yes.** | ✅ Approved (ADR-22) |
| I6-Q4 | First-name list for redaction | **Yes.** | ✅ Approved (ADR-25) |
| I6-Q5 | Audit entries unlinkable after account deletion (per-user key) | **Yes.** | ✅ Approved (ADR-26); legal check OQ-12 still open |
| I6-Q6 | Same model version for a whole consultation | **Yes.** | ✅ Approved (ADR-23) |
| I6-Q7 | Dialect / Arabizi danger phrases, detection only | **Yes, detection only.** | ✅ Approved |
| I6-Q8 | Age/sex limits checked for every still-likely illness on an uncertain result | **Yes.** | ✅ Approved (FR-46) |
| I6-Q9 | Own-words speed target | **95 % within 5 s** on the 3G profile. | ✅ Approved → SRS NFR-02b |
| I6-Q10 | "More than N days → see a doctor" rule per illness | **Yes** (N set by the clinical reviewer). | ✅ Approved (SRS §8.7 rule 10) |

### Analyst notes on round 6
- Every EV1 finding was checked against the documents before fixing (an evaluator can be wrong): all 17 contradictions and the F-findings were confirmed at their cited lines. Outcome per finding: [[SDD — Evaluation Run 1]] §3.
- EV1 came from the same model family that wrote the design, so it is not an independent human review (EV1's own disclosure).

## Round 7 — Product owner's own design review — 2026-11-03

Walk-throughs with [[Prompt — Owner Review (Walk-through)]] (first-time user, parent in Arabic, danger sign in own words, returning user). Findings logged in SDD §8.3 as RV-27 – RV-35.

| ID | Item | Answer | Status |
|---|---|---|---|
| I7-Q1 | Child's weight not known exactly (RV-27) | Children are most at risk: "a kid's weight is 10 but the user typed 7 or 6". After the weight is entered ask **"Are you sure?"**; if **no**, "always count for the least" so the dose does not harm him. Typical error **± 2–3 kg** ("not everyone weighs himself daily"). | ✅ Decided — clinical reviewer to confirm the lower-band rule per medicine |
| I7-Q2 | Screens before the first question (RV-28) | **Merge the language and sign-up screens**, language choice **at the bottom**; keep the profile steps; ~15 screens on first use is acceptable "for someone who installs the app because they feel sick right now". | ✅ Decided |
| I7-Q3 | Emergency numbers (RV-29) | **190 is SAMU; 198 is civil protection.** Nearest night pharmacy / nearest hospital emergency: **later** (option b). | ✅ Decided — both numbers on emergency notices; "nearest place" → future F-07 |
| I7-Q4 | Danger sign behaviour (RV-30) — **reopens I1-Q11 (danger → no medicine), BR-02, FR-18** | "When the situation is dangerous you can tell them to see a doctor but **continue** with them … give a notice so they know it requires a doctor but **do not stop the consultation**." Both levels continue, "remembering the danger of the situation": URGENT → red "see a doctor"; EMERGENCY → "the situation is dangerous" + numbers of SAMU and civil protection. The result "should not change". Analyst's recommendation (keep stopping) was given and declined. | ✅ Decided by the stakeholder against the analyst's recommendation — risk recorded (RE R-17) |
| I7-Q5 | Tunisian dialect in own words (RV-31) | Understanding dialect: **yes, but later**; keep v1 as it is. | ✅ Future F-08 |
| I7-Q6 | Expired consultation (RV-32) | After it expires, when he opens the app **it should tell him what happened**. History list and same-illness-again handling: fine as they are. | ✅ Decided |
| I7-Q7 | Facilitator observations (AI) | Accepted all three: Home target mismatch (RV-33), missing screens for danger confirmation and start checks (RV-34), undo a wrong tap (RV-35). | ✅ Accepted by the owner |

Answers judged fine as designed (no change): sign-up email (people in his family have one), question wording for a child ("هل لديك حمى؟" is fine), "I feel sick" label, creating a child profile first, result layout with Western digits, history list, connection-lost message.

Back to [[Sahti — Home]].
