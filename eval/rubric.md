# Prototype rubric

Grades the voice active-recall prototype (`/`, `/primer`, `/session`, `/summary`) at 390px, dark mode.

Sources for the anchors: `docs/design-brief.md` (hard constraints, mandate), `docs/voice-ux-reference.md` (six principles, states triage table), `docs/design-system.md` (component selection, naming, §4 never-do list), `docs/sprint-context.md` (logged decisions), `CLAUDE.md`, `component-gaps.md`.

## Scope

The prototype is a scripted flow, not a working MVP: term 1 recalled, term 2 hinted, term 3 revealed, term 4 skipped, and Summary is fixed data. Grade the designed flow. A control that does nothing, a state that doesn't persist, or a screen that doesn't read the session because of that script is by design. Do not list it as a finding or let it lower a score. Only a state that Figma designs and the prototype fails to show counts against it.

## Dimensions

Each dimension is scored 0–10 as a whole number. Anchors are given at 4, 6 and 9. Scores between anchors are interpolated. A 7 is a 6 with a specific, named strength beyond it. An 8 is a 9 with one named flaw.

| Dimension | What it asks | Weight |
| --- | --- | --- |
| System fidelity | Does every value trace back to a token, and every component to the library | High |
| Coherence | Does it read as one product, or as screens that arrived separately | High |
| Craft | Spacing, rhythm, states, the small deliberate decisions | High |
| UX judgment | Are the states handled, the hierarchy clear, the failure paths designed | High |
| Accessibility | Contrast, touch targets, whether meaning ever rests on color alone | Medium |
| Structure | Does the layout hold together and the thing render | Low |
| Feedback honesty | Does every label, count and score claim only what happened | Medium |

**Weighted total.** The table gives weights as High / Medium / Low, not numbers. Until you set numbers, the total uses High = 3, Medium = 2, Low = 1 (denominator 17): `(3·SF + 3·Co + 3·Cr + 3·UX + 2·A11y + 2·FH + 1·St) / 17`. Change the mapping here if you meant something else.

## Scoring rules

1. **"Looks good" is a 6, not a 9.** A 9 survives a senior critique untouched: someone who knows the Figma file, the voice-UX reference and the brief goes through it and finds nothing to mark up. If you can imagine a specific piece of feedback, it is not a 9.
2. **A dimension scores 8 or above only if it was verified by rendering, measuring or testing. Never from reading code.** Acceptable verification: a screenshot of the running app at 390px, a measured value (computed contrast, bounding box, pixel diff), or a test or command output. Every score of 8 or more must cite its evidence (screenshot path, measured number, command output). No cited evidence means the score is capped at 7, however good the code reads.

Gates (below) are reported separately and are not averaged into the score.

## Calibration (reference set)

Mia's hand scores for one set of four screens: `/`, `/summary`, `/session` hinted2ReadyToSend, `/session` resultHinted1Recalled. When unsure between two scores, compare the screen against these and take the nearer one.

| Dimension | Score | Reason |
| --- | --- | --- |
| System fidelity | 7 | `check:tokens` clean, two bindings traced to Figma; baseline and five `rgba()` bevels remain. |
| Coherence | 7 | One scaffold, tokens and voice across all four; only small seams (mascot size, scripted Summary). |
| Craft | 6 | Looks right, four loop states differ; no motion, no Pressed feedback, no Figma pixel diff. |
| UX judgment | 7 | Hard constraints hold, every result has a next step; inert Skip and "Type instead" are covered by the hotspot hint. |
| Accessibility | 7 | Text at least 4.5:1 on all four, statuses labelled; scrim-state contrast and duplicate "Play recording" names remain. |
| Structure | 8 | All routes render at 390px, no scroll; build, lint and `check:tokens` pass; safe area untested. |
| Feedback honesty | not scored | New dimension. |

---

## 1. System fidelity (High)

**Scoring:** whether the build is made of the system. Every color, size, type and spacing value comes from `tokens/tokens.json` through the semantic layer. Every component comes from the library. Gaps are named and flagged in `component-gaps.md`, not silently filled. Figma wins where it disagrees with prose.

**4:**
- `check:tokens` passes but the binding is by coincidence: a token chosen because its value matches Figma's (the `text/error` vs `feedback/error/bold` mistake in `design-system.md` §5 textField is the model failure).
- Components are rebuilt inline where the library already has one.
- Literal px sizes and `rgba()` values sit in component source with no note.
- Gaps are filled quietly instead of logged.

**6:**
- `check:tokens` is clean and the grandfathered-baseline count is stated. An undisclosed baseline caps this at 5.
- Library components are used, and inline builds have a `component-gaps.md` entry.
- Bindings were chosen by role and by reading the token's USE / DON'T / PAIR description, but not confirmed against the live Figma bound variable.
- Variants with no real Figma instance (MicButton Pressed, AudioScrubber Playing, Button Disabled) are used without being screenshotted first.

**9:**
- `check:tokens` is clean, and a grep for `rgb(a)`/`hsl(a)` literals in `src/` is clean or each hit is documented. The checker does not scan those.
- Sampled bindings are traced to Figma's own bound variable, not to a matching value.
- Every inline build has a `component-gaps.md` entry naming what is missing and what it would be called.
- Every untested state pairing was screenshotted before a screen depends on it (§4 item 11).
- Nothing is invented: no token value, no component, no prop.
- Figma-vs-`tokens.json` disagreements (for example Body S Bold at 14px in Figma vs 15px in the export) are flagged, not silently resolved.
- Where Figma's frame is larger than the visible shape (48px hit areas around a 32px button or a text link), the built hit area matches the Figma frame, with the visible size unchanged.

**Verify by:** `npm run check:tokens`, `grep -rnE "rgba?\(|hsla?\(" src`, `get_variable_defs` on sampled Figma nodes, a screenshot of each previously untested variant.

---

## 2. Coherence (High)

**Scoring:** whether primer → session → summary → study plan reads as one product. The loop's four states should read as one screen changing state, not four screens.

**4:**
- Routes look like separate builds.
- The same role is rendered at different sizes (mascot hero at different dimensions per route).
- The XP badge has different spacing on each screen.
- Copy voice shifts between screens, and casing drifts from sentence case (copy that matches Figma is exempt).
- The appBar shape (X + progress vs plain back arrow) is used arbitrarily.

**6:**
- Shared tokens and components make every route look related.
- Small seams remain: the mic button or Knowie moves between idle, recording and processing; a headline is styled differently on two routes; the summary and the session tally disagree at the edges.
- `/summary` is the confirmed reference pattern, and the other routes are close to it but not equal.

**9:**
- Every route uses the same scaffold shape (`appBar` / `middleContent` / `bottomContent`).
- Mascot size and pose follow the documented role: 2XL standby on hero screens, XL in the loop, thinking pose on processing.
- The XP badge is pixel-identical wherever it appears.
- Sentence case and Knowie's text-only voice hold on every label.
- In the loop, the mic and the mascot stay put across idle → recording → processing → result, so only the state changes.

**Verify by:** screenshots of all routes and loop states side by side, measured positions of mic and mascot across states, a full scripted run start to finish (SPEC.md step 6).

---

## 3. Craft (High)

**Scoring:** spacing, rhythm, the states themselves, and the small deliberate decisions that separate built-to-spec from designed.

**4:**
- Spacing is on the token scale but the rhythm is uneven: gaps between groups look arbitrary.
- States are color swaps only (recording = red instead of idle = purple, nothing else changes).
- Processing is a dead spinner or blank.
- Long terms or long transcripts break the layout.
- An icon renders wrong (a corrupted SVG path passes lint and build silently).

**6:**
- It looks good: consistent spacing, all four loop states present and visually different, icons render.
- Not yet pixel-checked against Figma.
- State changes cut instantly, with no motion.
- Edge content (long term, three-line transcript) was not tried.
- Hover and Pressed feedback is missing, or tuned for desktop.

**9:**
- Pixel-diff against the live Figma frame is within a stated tolerance for each built screen, with the diffs kept.
- Recording is unmistakable and carries more than a color change: `statusIndicator` label ("Tap to stop"), shape, and motion.
- Processing covers the few-second wait with a calm designed state (thinking pose plus the Loading bubble, per the logged decision), not a blank.
- The XP counter animates once per result and settles to Summary's static value.
- Motion respects `prefers-reduced-motion`.
- Long content wraps cleanly.
- Row dividers follow the position rule (every row except the last), not the status.
- Every icon was screenshotted and checked.
- Every tap gets visible acknowledgement (pressed state or a loading beat).
- The small decisions are deliberate: the "one beat of acknowledgment, then next prompt" rhythm, and Continue as the primary action on Summary.

**Verify by:** screenshot + pixel-diff per screen, a recording or frame sequence of state transitions, a run with an over-long term and transcript, a reduced-motion emulation pass.

---

## 4. UX judgment (High)

**Scoring:** whether the loop is worth staying inside and never traps the student. Anchored on the six principles and the "States to design" triage in `voice-ux-reference.md`, plus the brief's hard constraints (voice in / text out, explicit push-to-talk, recall only, never trap, judge generously, expect a wait). Violating a hard constraint (Knowie speaks, auto-endpointing, a tutoring branch) puts this dimension at 4 or below.

**4:**
- Only the happy path exists.
- Recording and idle are hard to tell apart, so the student can't tell whether it's listening.
- After stopping, the screen goes blank or static, so the student would tap again.
- A "not quite" gives the student nowhere to go.
- The text fallback is missing, or a denied mic dead-ends.
- Skip and cancel are absent.

**6:**
- All four states (idle → recording → processing → result) exist and differ.
- A text fallback and a mic primer exist.
- The result offers a next step.
- Gaps against the "Must" rows remain: cancel-and-re-record before send is hard to find; Skip is missing on some states; the verdict reads as a grade instead of a nudge; the transcript is not shown back; the summary's claim is not derived from what the student did.
- A control that looks live but does nothing is acceptable only if tapping it fires the hotspot hint (`HotspotHints`) and a live way forward exists. With no feedback, or no live route, it counts as missing and caps this at 5.

**9:**
- Every "Must" row in the triage table is reachable and demonstrated: idle, recording, processing, result, cancel and re-record before send, text fallback in one tap, mic primer, denied → text with what to do next, skip.
- Start and stop are explicit, with no auto-endpointing.
- The transcript is shown back, so a mishearing reads as a mishearing.
- Judging is generous: partial and fail are merged into one "needs practice" result, the hint nudges without giving the answer, and hint → reveal leaves no dead end.
- Every screen has one clear primary action and a way out, including for a student who can't speak.
- The summary is earned: per-term status is exact, headline numbers derive from the session, hinted and revealed terms visibly count for less than recalled ones, and a student who struggled is not flattered.
- Reloading mid-session resumes at the same term.
- "If time" rows (silent recording, slow judge) are either built or noted as known gaps, not ignored.

**Verify by:** walking the loop by hand and by script through every triage-table row, plus the failure paths (skip, deny mic, type instead, cancel recording, reveal, reload mid-session), with a screenshot per state.

---

## 5. Accessibility (Medium)

**Scoring:** contrast, touch targets, and whether meaning ever rests on color alone. The hard gates for contrast and touch targets sit below. This score covers everything the gates don't: the wider set of pairs and targets, non-color meaning, and labelling.

**4:**
- Body text passes but captions, disabled text, and text on the tag "bold" fills were never checked.
- Status meaning rests on hue (Recalled / Hinted / Revealed / Skipped told apart by color, or recording by a red dot alone).
- Some targets are 32–40px.
- Icon-only buttons have no accessible name.

**6:**
- Main-path text and targets clear the gates.
- A failed G1 or G2 caps this at 5.
- The main-path entry is at least 44×44.
- Statuses carry a text label as well as color.
- Icon-only buttons are named.
- Semi-transparent text tokens (`text/secondary`, `text/tertiary`) were checked by eye, not composited and measured.
- Reduced motion is not honored, and focus and reading order were not checked.

**9:**
- Every text/background pair in every state and route is measured from rendered, composited pixels, including the alpha text tokens and text on tag fills.
- Every interactive element's hit area is measured, especially the smaller ones: the Tertiary/S "Type instead" and "I don't know" buttons, the close X, and buttonIcon.
- Every state is distinguishable without color: recording by label, shape and motion; results by tag text and icon; the ready-to-send state by its label.
- Icon-only controls have accessible names.
- `prefers-reduced-motion` is honored.
- Focus and reading order follow the visual order.

**Verify by:** computed-style extraction with alpha compositing, bounding-box measurement of every interactive element, a grayscale screenshot pass of each state, and an accessibility-tree dump.

---

## 6. Structure (Low)

**Scoring:** whether the layout holds together and the thing renders at all.

**4:**
- A route errors or hydrates with warnings.
- Content overflows at 390px or scrolls horizontally.
- Fixed bottom actions cover content in some state.
- Build or lint fails.

**6:**
- All four routes render.
- The happy path shows no console errors.
- The layout holds at 390px.
- Long content, reload and deep links, and the safe areas at the bottom edge were not tried.

**9:**
- `npm run build` and `npm run lint` are clean.
- Every route renders in every state at 390px with no horizontal scroll, no clipped content, and no overlap between bottom actions and content.
- Deep-linking and reloading mid-session work.
- There are no console errors or hydration warnings on any path.
- The layout holds with the longest term and transcript.
- Checked at 390 wide and at a short real viewport (about 664 tall) with the safe area.
- Any 8 or above cites the measurement.

**Verify by:** `npm run build`, `npm run lint`, and a scripted browser pass at 390px over every route and state with console capture and a scroll-width check.

---

## 7. Feedback honesty (Medium)

**Scoring:** whether every label, tag, count and headline claims only what happened in the session, and whether a score reflects what the student knew, not what the prototype failed to do.

**4:**
- A label claims more than happened ("first try" after a hint).
- A control failure is scored as not knowing.
- A counter's scope is unclear ("2 of 4" on review entry).

**6:**
- Numbers come from the session.
- Small mismatches remain (a hinted pass reads like an unaided one).

**9:**
- Every label, tag, count and headline is derived from the session.
- Hinted and revealed terms visibly count for less than recalled ones.
- A skip is labelled a skip.
- Counters state their scope.

**Verify by:** a scripted mixed-outcome run, then compare Summary to the session log.

---

# Hard gates

Reported separately from the score. A failed gate fails the run whatever the weighted total is. Every gate is verified by measuring or running, never by reading code.

| # | Gate | Pass condition | How it is checked |
| --- | --- | --- | --- |
| G1 | Contrast | Body text is at least 4.5:1 against its actual background, on every route and in every state. | Computed color of each text node, composited over the real rendered background (the alpha tokens such as `text/secondary` must be composited, not read as their nominal hex), ratio calculated per pair. |
| G2 | Touch targets | Every interactive element has a hit area of at least 44×44pt (44 CSS px at the 390px viewport). | Bounding-box measurement of the tappable area, not the glyph or visible circle, for every button, icon button, close X, tag-like control and the mic button in every state. |
| G3 | No raw hex in component source | `npm run check:tokens` exits 0: no raw hex, no `var()` fallback, no `--color-primitives-*` read in `src/` outside comments. | Run the script and attach the output. |
| G4 | No two states that should differ render identically | Every pair below renders visibly different. Not just in color, per the voice-UX reference. | Screenshot both members of each pair at 390px and pixel-diff them, then check that the difference is not a hue shift alone. |

**G2 notes.** 44 is the hard floor. Figma specifies 48 for most controls, and matching that is scored under System fidelity, not here. Some hit areas are an absolutely-positioned child of the control, not the control's own box (the Skip link in the session header uses a 48×48 child span). Measure the union of the control and its children, and check that a tap on the child triggers the control.

**G4 pairs to check** (at minimum): the four loop states (idle, recording, processing, result); the result outcomes (Recalled, Hinted, Revealed, Skipped; needs-practice); the micButton states (Idle, Pressed, Recording, Processing); the voice-path and text-path processing screens against their idle screens; Primary button Default vs Pressed vs Disabled; the four `tag` statuses.

**Known blind spot in G3.** `check:tokens` catches hex only. At the time of writing, `rgba()` literals also exist in `src/` (for example `TableCell.tsx` divider, `ButtonIcon.tsx` bevel, `page.tsx` and `session/page.tsx` bevel shadows) and pass the gate. They do not fail G3 as defined, but each one counts against System fidelity unless it is documented in `component-gaps.md` as a token gap.
