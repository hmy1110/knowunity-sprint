@AGENTS.md

# Knowunity voice active-recall sprint

Mocked iOS prototype of a voice-in / text-out active-recall step, built in Next.js against the "Yummy__Knowie Design System" Figma file (`Km4r5Waxhm1bysmCcFNYiB`).

## Always true

- The recall is mocked. No speech-to-text, no audio, no model calls.
- Knowie replies in text and never speaks. Voice is input only.
- Mobile only. 390px, dark mode only.
- Build from the components that already exist. A gap gets named and flagged, not filled.
- Every value comes from `tokens/tokens.json`, every behavior and naming rule from `docs/design-system.md`. Figma wins when they disagree.
- `build/css/tokens.css` is generated. Never edit it. Edit `tokens/tokens.json` and run `npm run tokens`.
- Sentence case on every label, button, and heading.
- Design a distinct visual for each of `idle → recording → processing → result`.

## Never

- Never invent a token value or a new component. Say what's missing, let Mia decide.
- Never use a CSS fallback like `var(--token, #333)`.
- Never read a primitive (`color/*`, `space/*`, `font/*`) from a component. Bind the semantic layer.
- Never ship an untested state pairing without screenshotting it first.
- Never add voice output, auto-endpointing, or a tutoring branch.
- Never edit `AGENTS.md`.
- Full list: `docs/design-system.md` §4.

## Files

- `docs/design-brief.md` — mandate, hard constraints, success metrics. Before any design decision.
- `docs/sprint-context.md` — committed concept, logged decisions, out of scope. Before proposing or reopening anything.
- `docs/design-system.md` — components, scaffold slots, naming, the six recall-loop components. Before touching UI.
- `docs/voice-ux-reference.md` — voice traps, state triage table. When designing a loop screen.
- `tokens/tokens.json` — every color, size, type, and spacing value. `npm run tokens` builds it into `build/css/tokens.css`, imported by `globals.css`.
- `reference/*.PNG` — 30 screenshots of the real flow, explain-out-loud is 20-28. When matching real behavior or copy.
- `public/images/*.svg` — Knowie expressions. When a screen needs a mascot state.
- `src/app/` — `page.tsx` root screen, `layout.tsx` shell and fonts, `globals.css` Tailwind entry and theme vars.
- `.claude/skills/` — `ux-designer` flows, `ui-designer` visual craft, `ux-motion` transitions, `interactive-prototype` clickable build.
- `package.json` — `npm run dev | build | start | lint | tokens`. `style-dictionary.config.mjs` — token build config. `tsconfig.json` — `@/*` maps to `./src/*`.
- Remaining root files are scaffold config. `README.md` is not project documentation.
