---
name: build-screen
description: Use when building or editing a screen in this prototype — a route under src/app/ (`/`, `/primer`, `/summary`, `/session`) that the student reaches by tapping through the flow. A component or state that only exists as a Storybook story is not a built screen; this skill is what turns SPEC.md into a real page.
---

# Building a screen

A screen is a page at its own route in `src/app/`, reached by clicking from the screen before it (see SPEC.md's "build order" and each screen's "where it leads"). Storybook is the component catalog only — it is where a component's states get built and screenshotted in isolation, never where the student navigates. If the only place a state lives is a `.stories.tsx` file, the screen isn't built yet.

## Method

1. **Read SPEC.md for this screen.** Find its numbered section, its states, its component list with the exact variant/prop values already confirmed, and its "what the student can do / where it leads" list. Also check the Open section at the bottom for anything still unresolved on this screen.

2. **Check whether this screen has a frame in the Figma file** (`Yummy__Knowie Design System`, fileKey `Km4r5Waxhm1bysmCcFNYiB`) using the Figma MCP tools (`get_design_context`, `get_screenshot`, `get_metadata`). Some screens have a real instance in Figma (e.g. Primer-intro, Learning-result-Hinted2-succeed); some are marked in SPEC.md/design-system.md as non-Figma or inferred-from-structure-only (e.g. `ScoreBreakdown`, `TermResultList`, the badge/XP counter). This changes what "done" means:
   - **Has a frame:** match it exactly — layout, spacing, copy, states. Pull the real values via the Figma tools rather than eyeballing a screenshot.
   - **No frame:** there's nothing to match. Go read `docs/design-brief.md` and `docs/voice-ux-reference.md` instead, for how the state should look and behave.

3. **Query the Storybook MCP for every component before using it.** Call `docs-list` to find its id, then `docs-show` (and `docs-show-story` for a variant not covered in the main docs) for every component this screen needs. Never assume a prop exists — including props that sound obvious or that another screen already used successfully; each component's own doc is the source of truth, not memory of a sibling screen. If a prop you need isn't documented, stop and flag it (see step 5) rather than passing it anyway.

4. **Compose the screen from what's actually in Storybook.** That is the only place to look for something reusable — most of the Figma library was never built in code, so "it's in Figma" is not a reason to assume it's available as a component. Import real components from `src/components/`, bind every value through the semantic token layer (never a primitive, never a raw hex/px, never a `var(--x, fallback)`), and keep the page mobile-only at 390px, dark mode only.

5. **When something this screen needs isn't in Storybook, build it inline first.**
   - Build it directly inside the screen file, from tokens, scoped to this screen — not as a new shared component yet.
   - Add one line to `component-gaps.md` at the project root (create the file if it doesn't exist) naming what was built and which screen it's for. Don't stop to ask first — that's the whole point of flagging instead of blocking.
   - Before adding a new line, check whether the same gap is already listed against a *different* screen. If so, this is now a repeated pattern (design-system.md §1's own rule: something genuinely missing a real component, e.g. the badge/XP counter across 9 screens) — build it properly this time, as a real component under `src/components/` with its own Storybook story, and update both screens to use it instead of their inline copies.

6. **Every value comes from the generated tokens.** No raw hex, no raw px, nothing read off a primitive layer (`color/*`, `space/*`, `font/*`) — bind the semantic layer only, per CLAUDE.md. If `tokens/tokens.json` is missing a value this screen needs, that's a gap to name (step 5's process), not a number to invent.

7. **Build every state SPEC.md lists for this screen, including the failure ones.** A screen is not done with only its happy path — `micDenied` on Primer, every `result` branch on Session (Recalled/Hinted/Revealed/Skipped, including the Hinted2-succeed re-attempt), every study-plan-entry state (`notStarted`/`inProgress`/`finish`) all count. Give each state its own distinct visual per CLAUDE.md's "idle → recording → processing → result" rule where that pipeline applies.

8. **Wire every action to where SPEC.md says it goes.** Walk this screen's "what the student can do / where it leads" list and confirm each tap has a real destination — a route via Next.js navigation, or an internal `subState` transition for Session. A button that leads nowhere means the screen isn't finished, even if every state renders correctly in isolation.

9. **Screenshot before calling a state done.** Per CLAUDE.md, never ship an untested state pairing without screenshotting it first — this applies doubly to any state SPEC.md or design-system.md already flags as untested/unconfirmed (e.g. `ProgressIndicator` progress="0", `MicButton` Pressed, `ButtonGroup` Vertical). Use the Storybook `test-run` tool after any visual change, and `stories-preview` to get a real preview URL.

## When you're done

- **If the screen had a Figma frame:** list every difference between what you built and the frame — anything you couldn't match exactly, any prop Storybook didn't support, any spacing/copy you had to infer.
- **If the screen had no Figma frame:** report what you had to decide that wasn't written down anywhere in `docs/design-brief.md` or `docs/voice-ux-reference.md` — the judgment calls, not just the fact that you made them.
- Either way, mention any new lines you added to `component-gaps.md`, and run `npm run lint` before handing back.
