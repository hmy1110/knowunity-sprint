# Knowunity voice active-recall sprint

A mobile-only, dark-mode Next.js prototype of a **voice-in / text-out active-recall** step for Knowunity, built against the "Yummy__Knowie Design System" Figma file (`Km4r5Waxhm1bysmCcFNYiB`).

After revising a section, a student explains a handful of art & design terms out loud (or types, if they can't speak). Knowie — the app's mascot — always replies in **text**. The recall itself is mocked: there's no real speech-to-text and no model judging what was said. What *is* real is the flow around it — every control is live, the session records what actually happened, and the summary and study-plan state are derived from that record, not from a fixed script.

## What's mocked vs. real

| Mocked | Real |
| --- | --- |
| Speech-to-text | Every control does something — no dead buttons |
| Judging what was said | Input mode (voice/text) persists per term |
| Voice output — Knowie never speaks | Attempt outcomes are recorded per term (`src/lib/recall-session.ts`) |
| The model's "verdict" text (hardcoded per term) | Summary, XP, score and the study-plan card all read that recorded session |
| | "Review what you missed" re-attempts only the terms not yet recalled |

## Screens

| Route | Screen |
| --- | --- |
| `/` | Study plan entry |
| `/primer` | Primer / mic permission |
| `/session` | The recall loop — cycles through terms via client-side state |
| `/summary` | Session summary, derived from the recorded run |

## Tech stack

- **Next.js 16** (App Router) + **React 19** + TypeScript
- **Storybook** — the component catalog; every component's states are built and screenshotted here, never navigated to
- **Tailwind** for utility classes, styled entirely through design tokens (no raw hex/px in components)
- **Style Dictionary** — compiles `tokens/tokens.json` into `build/css/tokens.css`
- **Vitest + Playwright** (via Storybook's test addon) for component tests
- **Chromatic** for visual regression on Storybook

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
npm run storybook    # http://localhost:6006 — component catalog
```

Other scripts:

```bash
npm run build          # production build
npm run lint            # eslint
npm run tokens          # rebuild build/css/tokens.css from tokens/tokens.json
npm run check:tokens    # fail on raw hex, var() fallbacks, primitive reads, unrecorded deviations
npm run build-storybook
npm run chromatic
```

`npm run check:tokens` is the guardrail for this project's core rule: **every value comes from `tokens/tokens.json`**. It fails the build on a raw hex color, a `var(--token, fallback)`, a primitive-token read (`color/*`, `space/*`, `font/*`) outside the semantic layer, or a new undocumented deviation (`rgba()`/`hsla()` literals, hardcoded font-family, non-`normal` `font-stretch`, or a px literal that duplicates a token value). A pre-existing baseline of known deviations is tracked in `scripts/check-tokens.baseline.json`; new ones must be tagged `[gap:<id>]` in code and logged in `component-gaps.md`.

## Project structure

```
src/
  app/                # routes: /, /primer, /session, /summary
  components/         # the component library (Button, MicButton, SpeechBubble, Table, Tag, ...)
  lib/recall-session.ts   # the recorded session: per-term outcomes, derived summary/XP/BLAZING/study-plan state
  stories/            # Storybook-only foundation stories
tokens/tokens.json     # every color, size, type, spacing value (source of truth)
build/css/tokens.css   # generated — never edit directly
docs/                  # design brief, sprint decisions, design-system rules, voice-UX reference
component-gaps.md      # running log of things built inline because no Storybook component existed
eval/                  # rubric + scorecards from design-quality review passes
reference/              # screenshots of the real shipped flow, for behavior/copy reference
public/images/          # Knowie's mascot expression SVGs
.claude/                # agent/skill definitions used to build and review this project
```

## Docs

Read these in order before making a design decision:

1. [`docs/design-brief.md`](docs/design-brief.md) — mandate, hard constraints, success metrics
2. [`docs/sprint-context.md`](docs/sprint-context.md) — the committed concept and every logged decision (including what's explicitly out of scope)
3. [`docs/design-system.md`](docs/design-system.md) — component inventory, naming rules, the recall-loop-specific components
4. [`docs/voice-ux-reference.md`](docs/voice-ux-reference.md) — voice-interaction traps and the states-to-design checklist
5. [`docs/interview-guide.md`](docs/interview-guide.md) — script used for usability testing sessions
6. [`component-gaps.md`](component-gaps.md) — everything built inline because Storybook had no matching component

## Design-quality review

`eval/` holds a repeatable review process: a shared [`rubric.md`](eval/rubric.md) (7 weighted dimensions plus pass/fail gates), scored independently by several blind AI critics per run, with raw evidence (screenshots, contrast, hit areas, pixel diffs) captured before each score. See [`eval/scorecard-03.md`](eval/scorecard-03.md) for the latest result.

## Conventions

- Mobile only, 390px, dark mode only
- Sentence case on every label, button, and heading
- Build only from components that already exist in Storybook — a missing one gets flagged in `component-gaps.md`, not invented
- `AGENTS.md` documents a from-scratch-training-data-diverging fork of Next.js used for this sprint; read it (and `node_modules/next/dist/docs/`) before writing Next.js code that relies on prior training knowledge of the framework
