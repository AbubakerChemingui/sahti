# AI usage log

Sahti is built AI-first: an AI assistant (Claude) did most of the drafting and the coding. The product owner, Abubaker, made every product and safety decision and reviewed the results. This log says what the AI did in each phase, what the human decided, and where the detailed records are.

| Phase | What the AI did | What the human did | Detailed record |
|---|---|---|---|
| Requirements (Lab 3) | Acted as business analyst: asked questions in rounds and drafted the RE and SRS documents. Also found conflicts and turned vague statements into measurable requirements | Answered every question; decided the scope, the users, the outputs and the safety rules | [Interview log](reference/interview-log.md): every decision has an ID (`I1-Q1` … `I7-Q7`) that the requirements cite |
| Design (Labs 4–5) | Drafted the SDD, the 32 ADRs and the UML diagrams (components, domain, sequences, ER, screens) | Chose between the alternatives in each round | [SDD](reference/SDD.md), [decisions](reference/decisions-and-quality-scenarios.md), [diagrams](diagrams/) |
| Independent evaluation | A separate AI review (EV1) checked the design against the requirements and found contradictions and safety gaps; all were fixed | Approved the 10 resulting proposals (`I6-Q1` – `I6-Q10`) | SDD review log; interview log round 6 |
| Owner review | Ran a walk-through prompt that explained each finding in plain words | Changed several decisions himself in round 7. Example: a danger sign now gives a persistent notice and the consultation **continues** (`I7-Q4`). He made this choice against the analyst's advice; it is recorded with its risk | Interview log round 7; design ADR-31 |
| AI-first coding exercises (Lab 4) | Generated the code, the tests and the refactoring steps from logged prompts. At the owner's request it also wrote the "own words" parts, which are marked ✍️ | Asked for each exercise and ran the tests on his own machine | [Lab 4 folder](assignments/lab4-ai-first-coding/) and its [prompt log](assignments/lab4-ai-first-coding/prompt_log.md) |
| Repository setup (Lab 6) | Filled `AI_CONTEXT.md`, `CLAUDE.md`, CI and the ADRs, and opened the first PRs | Created the GitHub repo, granted access, and checked the merged PR and the green CI | [Setup report](setup-report.md) |
| MVP (this release) | Wrote the backend, the web client, the DRAFT demo data and the tests, following `AI_CONTEXT.md` and the SRS. It ran the tests and a browser run-through before claiming anything worked | Chose a web client for the MVP, the 5 demo illnesses and the DRAFT labelling; he records the demo video himself | [ADR 0004](decisions/0004-mvp-web-client-and-technical-choices.md), [backlog](backlog.md), PR history |

## Rules the AI had to follow

These come from [`AI_CONTEXT.md`](../AI_CONTEXT.md) §5:
- the AI inside the product never chooses a medicine, a dose or a remedy;
- AI-written code that touches safety is covered by tests that run with the AI stubbed;
- the AI never invents clinical data. The demo data is labelled DRAFT and refused in a public deployment;
- AI-written text that a course asks to be "in my own words" is labelled as AI-written.

## What the AI got wrong (and how it was caught)

- **Design phase.** The evaluation run found contradictions between the SRS and the SDD: danger confirmation versus conversion order, and the screening gate. These were fixed before coding.
- **Lab 4.** A wrong merge count in the hand trace was corrected to 4 merges and 8 comparisons.
- **MVP: out-of-scope answers.** The first version of the demo likelihoods classified "no to every symptom" as an illness instead of out of scope. The safety suite caught it, and the out-of-scope likelihood was corrected.
- **MVP: negation.** The keyword reader read "je ne tousse pas" as cough = yes. The browser run-through caught it. French "ne … pas" negation was added, with tests.
