# Sahti — Design system (MASTER)

Single source of truth for the web client's presentation layer. Business logic, API and safety behaviour are out of scope here: they are defined by the SRS and must not change for visual reasons.

Status: v1, 2026-11-04. Written by hand: the ui-ux-pro-max generator script (`search.py`) is not installed in this environment, only its rule set. Its accessibility and structure rules are applied below.

## 1. Concept

**"La boîte et la notice."** Sahti is the medicine box and its folded leaflet: the interface is printed packaging. It uses a condensed label typeface, monospace lot and dose codes, hairline rules, and fold lines. The one green that means something is the green cross of a Tunisian *pharmacie*.

Why it fits: people already trust two objects at the pharmacy, the box and the notice. Sahti's job is to give them the notice that fits *their* profile, so the UI borrows that physical language instead of tech-site aesthetics.

## 2. Reference mechanics we borrow (not looks)

| Mechanic | Source | Our use |
|---|---|---|
| Hero as a stage, one focal object | Agrumea (the jar on the arch) | One 3D medicine box, DOM/CSS 3D, rotating slowly in the first viewport |
| Circular text badge rotating with scroll | Agrumea (arched "WE GROW · WE SERVE") | The pharmacy-cross stamp ringed with "PHARMACIE DE POCHE · صيدلية في جيبك" |
| A pinned scene driven by scroll | Nexora (dot field morphing between statements) | The box opens and the notice unfolds panel by panel (describe, questions, dose), with `scrub: 1` |
| Type-driven hierarchy | Both | Display type at 9–15vw in Archivo condensed; mono labels for structure |
| Chapter rhythm, background value shifts | Both | Paper, then night green (full bleed), then paper, then signal red (the danger chapter), then paper |
| Giant wordmark footer | Agrumea | "SAHTI" set at 22vw with the Arabic wordmark beside it |

## 3. Palette (7)

| Token | Hex | Role |
|---|---|---|
| `--paper` | `#F3F5F2` | Base: leaflet paper, cool. Deliberately **not** cream |
| `--box` | `#FFFFFF` | Surface: the carton |
| `--ink` | `#0F1F1A` | Text and rules |
| `--muted` | `#56655F` | Secondary text (5.6:1 on paper) |
| `--cross` | `#00A651` | **Accent with meaning:** pharmacy cross, "safe to use", the active step. Never decorative |
| `--night` | `#0B3328` | Full-bleed chapter surface (deep pharmacy green) |
| `--signal` | `#C8221A` | Danger only: the notice, 190/198 |

Contrast pairs (computed, WCAG 2.x):
- ink/paper: 15.6:1;
- muted/paper: 5.6:1;
- paper/night: 12.6:1;
- white/signal: 5.7:1;
- `#9FB5AC` muted-on-night: 6.4:1.
- `--cross` on paper is only 2.9:1, so it is never used for text there: it marks icons and large shapes only. Green text on paper uses `#007A3C` (5.0:1). `--cross` on night is 4.3:1, which is allowed for large display type only.

## 4. Typography

- **Display:** Archivo variable (wdth 62–125, wght 100–900), set condensed (`font-stretch: 68%`) and heavy (800), like a pharmaceutical label.
- **Text:** IBM Plex Sans Arabic (Latin + Arabic, 400–700).
- **Mono:** IBM Plex Mono 400/500, for lot numbers, doses, timings and section labels.
- **Arabic display:** Plex Sans Arabic 700. Archivo has no Arabic, and Arabic never gets negative tracking.

| Role | Size | Line-height | Tracking |
|---|---|---|---|
| display | `clamp(3.5rem, 13vw, 13rem)` | 0.86 | -0.01em (condensed) |
| h1 | `clamp(2.4rem, 6vw, 5.5rem)` | 0.92 | -0.005em |
| h2 | `clamp(1.8rem, 3.6vw, 3rem)` | 1.0 | 0 |
| h3 | `1.35rem` | 1.2 | 0 |
| h4 | `1.1rem` | 1.3 | 0 |
| body | `1.05rem` (17 px) | 1.6 (Arabic 1.8) | 0 |
| caption | `0.9rem` | 1.5 | 0 |
| mono-label | `0.78rem`, uppercase for Latin | 1.4 | +0.08em |

Mono labels carry real metadata: `LOT 2026-11`, `ÉTAPE 1/3`, `3× / JOUR`, `MAX 3 J`. They are not used as decorative eyebrows.

## 5. Space, radius, elevation, border

- **Space:** 4 px base; steps 4 · 8 · 12 · 16 · 24 · 32 · 48 · 72 · 120.
- **Radius:** **sharp** editorial. 0 for packaging, panels and buttons; 2 px only on inputs; 999 px only for the stamp and the dose pills.
- **Borders:** 1 px `--ink` at 16 % for hairlines; 1.5 px solid `--ink` for "printed" boxes such as the dose label and the notice.
- **Elevation:** one shadow only, for the 3D box (`0 40px 80px -30px rgba(15,31,26,.45)`). Flat everywhere else.
- **Texture:** 4 % paper grain (an inline SVG noise filter) on paper chapters only, and fold lines on the notice.

## 6. Motion tokens

| Context | Duration | Ease |
|---|---|---|
| Hover / UI feedback | 150 ms | `power2.out` |
| Element entrance | 700 ms, stagger 70 ms | `expo.out` |
| Scroll reveal | 1.0 s, trigger at 85 % | `power3.out` |
| Pinned beat | 120vh per beat | `scrub: 1` |
| Screen change (app) | 700 ms wipe | `power4.inOut` |

- **Lenis:** `autoRaf: false`, `lerp: 0.1`, driven by `gsap.ticker`. It runs on the landing only.
- **Reduced motion:** opacity-only fades, no pin, no parallax, no rotation loop, and no Lenis.
- **Breakpoints:** below 768 px, the pinned scene unpins into a vertical sequence.

### Screen transitions (app)

| Navigation | Effect | Duration |
|---|---|---|
| Card to detail (profile → history, history row → result) | GSAP Flip: the clicked element becomes the next hero | 750 ms; the rest fades in after 250 ms |
| Other screens, ≥ 768 px | The old screen is wiped upward over the new one | wipe 520 ms, new screen 700 ms |
| Other screens, < 768 px | Short fade | 220–300 ms |
| Consultation steps | Forward slide (mirrored in Arabic) | out 400 ms, in 600 ms |
| First load, back/forward, reduced motion | None (back/forward restores the scroll position) | 0 |

The new screen is interactive at once: the outgoing copy lives in `#transition-layer` with `pointer-events: none`.

## 7. Effects budget

- **Per viewport:** at most **one** moving focal element, plus one micro-detail (the stamp rotation).
- **Signature moment (one per page):** the box opening into the notice.
- **WebGL:** none. 3D is CSS `preserve-3d` driven by GSAP. three.js is removed.

## 8. Anti-slop list (forbidden)

- Centered headline over a blue or purple gradient blob; any gradient-clipped text.
- Floating 3D objects with no story role (the previous pill cloud is cut).
- Numbered step cards with an icon in a rounded square.
- Section labels such as "Features", "How it works", "Testimonials".
- One fade-up applied to every section.
- Rounded-2xl glass cards, `border-white/10`, soft grey shadow under every container.
- Cream background with a serif display and a terracotta accent.
- Near-black with neon green.
- Fake stats, fake logos, fake testimonials; text baked into canvas.
- Emoji as icons; bounce or elastic easing on UI.

## 9. Components (presentation only)

- **Box:** a 3D cuboid (front, back, sides, top flap). The front carries the wordmark and a profile-free example label.
- **Notice:** three folded panels separated by hairline fold lines; each panel is one beat of the story.
- **Dose label:** the existing component (header, then the day strip, then the limits), restyled sharp, with mono figures.
- **Stamp:** the green cross inside a circular mono text ring.
- **Buttons:**
  - primary: ink on paper or paper on night, sharp, 52 px tall;
  - secondary: 1.5 px outline;
  - danger: signal red.
- **States:** hover inverts; focus-visible is a 3 px `--cross` outline with a 2 px offset; active is translateY(1 px); disabled is 45 % opacity with `cursor: not-allowed`.
