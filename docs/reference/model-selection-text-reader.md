---
tags: [projects/sahti, sahti/ai]
created: 2026-11-03
---
# Model Selection — Text Reader (OQ-07)

**Decision this enables:** choose the base model to fine-tune for reading own-words descriptions (French + MSA) into question-bank answers — open question OQ-07 ([[SRS — Software Requirements and System Specification]] §19, [[SDD — Architecture Decisions and Quality Scenarios]] ADR-04).
**Labels:** FACT (with source) · INFERENCE · ASSUMPTION · RECOMMENDATION · [ESTIMATE] (method stated) · [UNKNOWN].

## 1. What the model must do (FACT, from the project documents)
| Requirement | Source |
|---|---|
| Read a description of 1–1,000 characters in French or MSA, incl. French words inside Arabic | SRS FR-41 |
| Output only answers to questions of the active question bank (codes + values) | SRS §10.0, AI-08 |
| Precision ≥ 0.90 (wrong answers worse than missed ones); recall ≥ 0.70 [Proposed] | RE AI-20, LOG I3-Q22; SRS §10.0 |
| Arabic as good as French: gap ≤ 5 points | RE AI-11, LOG I3-Q4 |
| Trained and run for free; runs on own server; laptop demo with ~6 GB free disk | RE C-01, C-08; LOG I4-Q3 |
| Never names medicines or gives advice | SRS AI-03 |

## 2. Reframing the task (RECOMMENDATION)
The model does not need to *generate* text. For every question in the bank it only has to decide **yes / no / not mentioned** (or pick a band for numbers, e.g. "duration: 1 day / 2–3 days / > 3 days"). That is **multi-label classification**, not text generation.

Why it matters (INFERENCE):
- Outputs are always inside the question bank → no invented codes; AI-08 holds by construction.
- Each question gets its own decision threshold → precision can be pushed to ≥ 0.90 per question.
- The encoder candidates have about 2–13× fewer parameters than the small generative models in §3 (mmBERT-base 307M vs 0.6B–4B; computed from the sizes in §3), and are fast on a laptop CPU [INFERENCE — not benchmarked].
- Free-text numbers ("since 3 days", "39.5") can be read by simple deterministic patterns, then confirmed by the user (FR-41).

**Cost of this choice:** paraphrases the training data never covered may be missed (lower recall); a generative model can be more flexible. Hence the comparison in §5.

## 3. Candidates

| Model | Family | Size | Licence | Arabic / French | Source (confidence) |
|---|---|---|---|---|---|
| **mmBERT-base** | Encoder (classifier) | 307M total parameters | MIT (stated on the mmBERT-small card; base not separately confirmed) | Trained on 1,800+ languages; Arabic/French performance not reported separately | HF blog, HF model card (high for size; medium for licence of base) |
| **mmBERT-small** | Encoder | 140M | MIT | As above | HF model card (high) |
| **XLM-RoBERTa-base** | Encoder | ~280M [general knowledge, not verified in this search] | MIT | Arabic and French both in its training languages | HF model card (high for licence and languages) |
| **Qwen3-1.7B** (LoRA) | Small generative model | 1.7B | Apache 2.0 | 119 languages incl. Standard Arabic and Tunisian Arabic, French | Secondary sources (medium — the official Qwen documentation was not fetched) |
| Qwen3-0.6B (LoRA) | Small generative | 0.6B | Apache 2.0 | As above | Secondary sources (medium) |
| Gemma 3 1B / 4B | Small generative | 1B / 4B | Gemma terms (not verified here) | "Over 140 languages" for the family; not stated whether 1B covers all | Google developer blog (high for the family claim; [UNKNOWN] for 1B) |
| Llama 3.2 1B / 3B | Small generative | 1B / 3B | Llama 3.2 Community License | **Arabic not officially supported**; French is | Model card copy on Replicate (high) |
| Phi-4 Mini | Small generative | 3.8B | MIT | Training described as heavily English-focused | Prem AI article (medium) |

**Excluded (INFERENCE):** Llama 3.2 (no official Arabic, conflicts with AI-11); Phi-4 Mini (English-focused); anything ≥ 4B (disk, see §4).

## 4. Fit against Sahti's constraints

[ESTIMATE] disk = parameters × bytes per parameter (2 bytes in 16-bit, ~0.5 byte at 4-bit quantisation), weights only.

| Criterion | mmBERT-base | XLM-R-base | Qwen3-1.7B (LoRA) | Gemma 3 4B |
|---|---|---|---|---|
| Disk on the laptop | ~0.6 GB | ~0.56 GB | ~3.4 GB 16-bit / ~1 GB 4-bit | ~8 GB 16-bit / ~2.5 GB 4-bit → too large with the rest (C-08) |
| Can only output bank answers | Yes (by design) | Yes | No — must be validated (AI-08); invalid output → fallback | No |
| Precision control per question | Thresholds per question | Same | Indirect | Indirect |
| Speed on a laptop CPU | Fast [INFERENCE; mmBERT claims 2–4× faster than earlier multilingual encoders — HF blog] | Fast [INFERENCE] | Slower: generates token by token [INFERENCE; not benchmarked] | Slowest |
| Fine-tuning on a free GPU | Easy: full fine-tune, minutes–hours [ESTIMATE] | Easy | LoRA needed; feasible on a free GPU [ASSUMPTION — free-tier limits not verified] | Hardest |
| Flexibility with unseen phrasing and numbers | Lower | Lower | Higher [INFERENCE] | Higher |
| Tunisian phrasing mixed into input (see §6) | Unknown | Unknown | Tunisian Arabic listed in training languages (medium confidence) | Unknown |
| Licence for a future product | MIT | MIT | Apache 2.0 | Gemma terms (to check) |

## 5. How to choose: a small bake-off (RECOMMENDATION)

A measured decision on your own data beats any general ranking. Plan:

1. **Data first:** write 300 labelled descriptions (150 French, 150 MSA) for the first 3–4 illnesses, each labelled with its question-bank answers (SRS §10.4 format). Add 30 with French words inside Arabic, and 20 with typos.
2. **Split:** 200 train / 100 test, test set frozen (SRS AI-12).
3. **Candidates:** mmBERT-base and XLM-R-base (as multi-label classifiers, §2) — and Qwen3-1.7B with LoRA producing the JSON of SRS §10.3, if time allows.
4. **Train** on a free cloud GPU (Google Colab or Kaggle).
5. **Measure on the frozen test set:** precision and recall per language; FR–MSA gap; invalid outputs (Qwen only); time per description on your laptop CPU; disk size.
6. **Decision rule:** among models with precision ≥ 0.90 in **both** languages and gap ≤ 5 points, pick the highest recall; if tied, pick the smaller. If none reaches 0.90, raise per-question thresholds and re-measure before switching model.
7. Record the winner and the numbers in ADR-04 and close OQ-07.

Effort [ESTIMATE, from task count, not measured]: 1 day to write and label 300 descriptions; half a day per encoder run; one more day for the Qwen challenger. Not needed for the 2026-11-04 deadline — the course documents only need the selection method, which this note provides.

## 6. Risks
| ID | Risk | Evidence | Mitigation |
|---|---|---|---|
| MS-1 | Users type Tunisian dialect (Arabic script or Latin letters with digits) although the app supports French and MSA only | Scope: LOG I1-Q11 (input languages); dialect usage is INFERENCE | Do not widen scope; add 30 dialect-style descriptions to the **test** set only, to measure the drop; dialect input that is not understood falls back to button questions (FR-41). Danger phrases in dialect and Latin script go into the danger-word lexicon for detection only [Approved `I6-Q7`]; mandatory screening (SRS FR-47) is the backstop |
| MS-2 | mmBERT's token-level results (NER/POS) are not better than older models | HF blog | The §2 framing uses sentence-level classification, not token tagging |
| MS-3 | Qwen3 facts come from secondary sources | §3 | Check the official model card before training |
| MS-4 | 300 descriptions too few for 20 illnesses | SRS §10.4 asks ≥ 1,000 | Bake-off decides the model only; then scale data illness by illness |

## 7. Recommendation
**Start with mmBERT-base as a multi-label classifier, with XLM-R-base as its direct rival; keep Qwen3-1.7B as the challenger if time allows.** Confidence: **medium** — strong fit on outputs, size, licence and speed; unknown real accuracy on your French/MSA descriptions until the bake-off.

## Sources
- [mmBERT: ModernBERT goes Multilingual — Hugging Face blog](https://huggingface.co/blog/mmbert)
- [mmBERT-small model card](https://huggingface.co/jhu-clsp/mmBERT-small)
- [XLM-RoBERTa-base model card](https://huggingface.co/FacebookAI/xlm-roberta-base/blob/main/README.md)
- [Introducing Gemma 3 — Google Developers Blog](https://developers.googleblog.com/introducing-gemma3/)
- [Llama 3.2 1B model information (Replicate copy of the model card)](https://replicate.com/justmalhar/meta-llama-3.2-1b/readme)
- [Qwen3 4B — licence, languages, release date](https://thegtmdirectory.com/models/qwen-qwen3/qwen3-4b)
- [Qwen3: 119 languages and dialects (DEV Community, AI-generated article)](https://dev.to/projedefteri/qwen3-hybrid-thinking-and-superior-performance-in-119-languages-proje-defteri-56d2)
- [15 Best Lightweight Language Models Worth Running in 2026 — Prem AI](https://www.premai.io/blog/best-lightweight-language-models-worth-running/)

Back to [[Sahti — Home]] · [[SDD — Architecture Decisions and Quality Scenarios]]
