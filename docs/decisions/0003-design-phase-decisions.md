# 3. Adopt the design-phase decisions (ADR-01 – ADR-32)

- **Status:** Accepted
- **Date:** 2026-11-03

## Context

The design labs (4–5), an independent design evaluation and the owner's own review produced 32 architecture decisions, each with alternatives, negative consequences and a reversal cost. They live in [`../reference/decisions-and-quality-scenarios.md`](../reference/decisions-and-quality-scenarios.md). Copying all 32 into separate files would duplicate them.

## Decision

The design ADRs apply to this repository as written. The ones that shape the code most:

| Design ADR | Decision | Status |
|---|---|---|
| ADR-01 | Client–server, backend as a modular monolith | Proposed |
| ADR-02 | The AI proposes; deterministic rules decide medicines, doses, remedies | Accepted |
| ADR-03 / ADR-04 | Fine-tuned model reads text only; a fast trained classifier decides and picks questions | Accepted |
| ADR-05 | Models run on our own server | Accepted |
| ADR-06 | Clinical content is versioned data (CSV bundle) | Accepted / format Proposed |
| ADR-07 | Danger detection by rules and a lexicon, outside the AI | Accepted |
| ADR-13 | SQLite for the demo, PostgreSQL from the pilot | Accepted |
| ADR-19 / ADR-20 | Mandatory danger screening; danger confirmation before conversion | Accepted |
| ADR-21 | Activation gate: DRAFT block, safety-case coverage, model compatibility, safety suite | Accepted |
| ADR-22 | Doses stored as numbers, rendered in FR/AR | Accepted |
| ADR-31 | Danger sign → persistent notice, consultation continues | Accepted (owner, against the analyst's advice) |

New implementation-level decisions get their own file here (0004 onward).

## Consequences

- One place to read the reasons behind the design; this folder holds only decisions made during implementation.
- When a design ADR changes, the reference copy must be refreshed from the vault in the same PR.
