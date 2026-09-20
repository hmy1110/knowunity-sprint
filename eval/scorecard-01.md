# Scorecard 01

**Date:** 2026-09-19. **Rubric:** `eval/rubric.md`. **Evidence:** `eval/evidence-01/` (start at `INDEX.md`).

**Screens graded (four):**
1. StudyPlan-notStarted, `/`
2. Summary, `/summary`
3. Learning-topic 2-result-Hinted1-ready to send, `/session` (`hinted2ReadyToSend`)
4. Learning-topic 2-result-Hinted1-recalled, `/session` (`resultHinted1Recalled`)

**How it was run.** Every state of the four screens was rendered at 390px in dark mode first, including failure paths (59 states, 62 pixel-diff pairs). Then four critics ran in separate, fresh contexts. Each was given only the four screens, the rubric, the evidence folder and its own dimensions. No critic received another critic's output or any score, and all four reported receiving none. Nothing was fixed.

---

## Result

**Weighted total: 5.5 / 10.** `(3·6 + 3·6 + 3·5 + 3·5 + 2·5 + 1·6) / 15 = 82 / 15 = 5.47`, using the rubric's High = 3, Medium = 2, Low = 1 mapping.

**Hard gates: three of four failed (G1, G2, G4). Per the rubric, a failed gate fails the run whatever the total is.**

## Per-dimension table

| Dimension | Weight | Score /10 | Weighted | Critic | Basis |
| --- | --- | --- | --- | --- | --- |
| System fidelity | High (3) | **6** | 18 | critic-system | `check:tokens` clean; two Figma `get_variable_defs` traces; Storybook queried. Held at 6 by an unbound bevel colour that Figma binds to a real variable, an unexplained hand-built hint block, and literal px where tokens exist. |
| Coherence | High (3) | **6** | 18 | critic-system | Read against screenshots `A01`, `B01`, `D01`, `D05`, `E01`. A full session-to-Summary-to-study-plan reconciliation was not run by the critic. |
| Craft | High (3) | **5** | 15 | critic-craft | Verified from screenshots, diffs and Figma comparison by eye. Below 6: no pressed feedback, no motion, layout drift against Figma. No app-vs-Figma pixel diff exists, so it could not exceed 7 regardless. |
| UX judgment | High (3) | **5** | 15 | critic-ux | Verified from screenshots and diffs. Below 6: silent dead ends (denied mic, term-2 text path), controls that do nothing, Redo and reload lose progress. |
| Accessibility | Medium (2) | **5** | 10 | critic-ux | Contrast passes on the four screens; two of them have 32px targets; identical accessible names on two scrubbers; no state announcements. |
| Structure | Low (1) | **6** | 6 | critic-craft | `build` and `lint` exit 0, no horizontal scroll in any state. Held at 6: reload and deep link do not resume, fixed 844px frame with no safe-area handling, console warnings. |

No dimension scored 8 or above, so rule 2 (8+ needs cited evidence) was not triggered. Every score is at or below 7.

---

## Hard gates

| Gate | Result | Evidence |
| --- | --- | --- |
| **G1 Contrast** | **FAIL** on the rubric's literal reading ("every route and every state"). **Pass** on the four screens at rest. | `contrast.md`, `measure/contrast-per-state.json`. No text run is under 4.5:1 on `A01`, `B01`, `B04`, `D01` or `E01`, by either the composited nominal or the rendered method. Failing states are adjacent: under the recording scrim (`C03`, `C09`, `C13`, the state directly before target 3) "Hint 1 of 2" measures 2.74, the XP "8" 2.77, "Not quite yet." 3.61 (20px bold, so a 3:1 large-text bar), the prompt 4.45. Disabled "Submit" and "Switch to voice" measure 3.66 (`F06`, `F06b`, `F07`). **Judgement calls, not resolved here:** disabled controls carry a WCAG exemption, and whether scrim-dimmed history text counts as inactive is arguable (the scrim is specified in Figma). The 4.45 is inside measurement noise on thin glyphs. The critic's verdict was "pass on the four screens only", which agrees with this reading. Non-text contrast (the Redo icon on dark red) was not measured. |
| **G2 Touch targets** | **FAIL** (measured) | `hit-areas.md`, `measure/hit-areas.json`. `A01` "Speak" 90×32. `A01` "🔥 +20% exam score" 104×20, a `<button>` with no handler. `D01` and `E01` "Play recording" 258×32, twice per screen. Passing: Close and Back 48×48, Redo, Send and Resume 56×56, Continue and "Review what you missed" 334×56. Header "Skip" reads 50×48 through an `aria-hidden` child span but has no handler, so it triggers nothing; whether a tap on that span reaches the button was not verified. |
| **G3 No raw hex in component source** | **PASS** | `logs/check-tokens.txt`: "No token rule violations in src/." `EXIT=0`. Run by the panel lead; the critics cannot run it. `rgba()` literals are outside G3's definition and count under System fidelity (finding 11). |
| **G4 States that should differ** | **FAIL** | `pixel-diffs.md`, `diffs/`. **Fails:** `micButton` Idle vs Pressed (`C01` vs `C02`, 0.000%) and Primary button Default vs Pressed on six pairs (`A01`/`A02`, `B02`/`B02b`, `B02`/`B03b`, `E01`/`E02`, `D01`/`D03`, `D01`/`D04`, all 0.000%). **Passes:** the four loop states (idle vs recording 11.4% RGB / 11.3% luma, not hue-only), result outcomes Recalled, Hinted, Hinted-recalled and Revealed (8% to 32% luma), Idle vs Recording and vs Processing, voice vs text path (23.7% and 26.5%), Primary Default vs Disabled (Submit crop 96.6%, `measure/submit-default-vs-disabled.json`), and the four tag statuses. **Caveats:** held-mouse is not a touch `:active`, but `src/` has no `:active` styling to test (grep, this run). Skipped has no in-session result screen (term 4 goes straight to `/summary`), so that outcome was verified only as a Summary tag. Recalled vs Hinted and Recalled vs Revealed tag fills differ by only 1.26:1 and 1.21:1 in luminance; they differ by hue plus the label word. |

---

## Render pass: states that should differ but rendered identically

Flagged, not fixed. All are 0.000% RGB and luma difference at 8/255 tolerance (`pixel-diffs.md`).

| What was compared | Ids | Reading |
| --- | --- | --- |
| Every control, at rest vs held down | `A01`/`A02`, `C01`/`C02`, `D01`/`D03`, `D01`/`D04`, `E01`/`E02`, `B02`/`B02b`/`B03b` | Pressed exists as a `state` prop only. Nothing renders it on a real press. |
| Recording, 0.9 s in vs 2.2 s in | `C03-a`/`C03-b` | Nothing moves during recording. `document.getAnimations()` is empty in every loop state, with and without `prefers-reduced-motion`. |
| Term 2 typed answer: 0.5 s vs 7 s after Submit | `F06`/`F06b` | The text path never resolves on a Hinted term. |
| Mic tap with `getUserMedia` rejected, vs idle | `F09` vs `C01` | Silent failure. No message, no route to text. |
| "Try again" with the mic revoked, vs Hinted1 | `F10` vs `C12` | Same. |
| Reload at Hinted1-recalled or Hinted1-ready, vs term 1 idle | `F01`, `F12` vs `C01` | Progress is lost; lands on term 1. |
| Tap on: kebab, topic node, bottom nav, "I don't know" (Hinted1 and term 2 idle), Resume | `A03`, `A04`, `A05`, `C12b`, `F04`, `D02` (each settled 1.3 s after the tap) | Nothing happens. |
| Summary loaded directly vs after a real session run | `B01-full` vs `B10-full` | Summary does not read the session; its data is a fixed script. |
| `?state=bogus`, `?variant=bogus` vs the default screens | `A06`, `B05` | Silent fallback to the default. |
| Redo from Hinted1-ready-to-send, vs a fresh term 2 idle | `F11` vs `C08` | Redo discards the hint and the first take. |

---

## Findings

Reconciled across the three adversarial critics and ranked by effect on the student and on the gates. Each keeps its evidence and the critic's exact fix. "Source" names the critic and their own numbering. Where a fix needs something that does not exist, the decision is Mia's.

### 1. A denied or revoked mic silently dead-ends the student. UX judgment
- **Source:** critic-ux #2 (first half). critic-craft raised it under "outside my dimensions".
- **Evidence:** `src/app/session/page.tsx:282-284` (empty `catch`, comment: "Denied mid-session isn't handled yet"). `F09` and `F10` are pixel-identical to their before-states.
- **Case:** A student with no mic taps the mic or "Try again" and nothing happens: no message, no route to text. The brief says never trap the student and design the denied state.
- **Fix:** In the catch, go to `typeInput` and show an `InlineAlert` (`src/components/InlineAlert/InlineAlert.tsx`) with copy such as "Microphone is off. You can type your answer, or turn it on in Settings." The critic did not query Storybook, so the exact `InlineAlert` props are not verified.

### 2. The text fallback hangs forever on term 2. UX judgment
- **Source:** critic-ux #2 (second half).
- **Evidence:** `session/page.tsx:466` (only `outcome === 'Recalled'` advances). `F06` and `F06b` at 0.5 s and 7 s are identical. Both buttons are disabled while it hangs. Route `/session`, term 2, Hinted1 → "Type instead" → Submit.
- **Case:** The student who cannot speak is who the fallback exists for. They get an endless "Processing…" and only Close as an exit.
- **Fix:** Resolve `typeProcessing` for every outcome: route to `resultHinted1` (or `resultHinted1Recalled` on a retry) for Hinted, and to `resultRevealed` for Revealed. If no built screen exists, log it in `component-gaps.md` instead of leaving a spinner with no timeout.

### 3. Controls that look live do nothing, and Hinted1 has no exit. UX judgment
- **Source:** critic-ux #1; critic-system and critic-craft each noted individual instances.
- **Evidence:** `session/page.tsx:1341` (Resume has no `onClick`; `D02` identical to `D01`), `:1394` ("I don't know" on Hinted1 has no handler; `C12b` identical to `C12`), `:668-670` (header Skip inert on terms 1-3). On `/`: the "+20% exam score" chip and "More options" are native buttons with no `onClick` (`hit-areas.md`, "Native button with no onClick").
- **Case:** On target 3 the ready-to-send row shows three actions and two work. "Hint → reveal with no exit" is the dead end the brief bans. Native buttons with no disabled state are focusable and announced as actionable.
- **Fix:** Wire Resume to `handleTogglePlayback`. Wire Hinted1 "I don't know" to `resultRevealed`, which exists. Wire Skip to the Skipped flow term 4 uses. Otherwise render the controls with `Button state="Disabled"`, or remove them. Whether `ButtonIcon` has a Disabled state is not verified.

### 4. Redo and reload destroy progress. UX judgment, Structure
- **Source:** critic-ux #3; critic-craft #5 (reload half).
- **Evidence:** `handleRedo`, `session/page.tsx:366-375`. `F11` is identical to `C08`: Redo on Hinted1-ready-to-send returns a cold term-2 idle. `F01` and `F12` are identical to `C01`: reload at term 2 returns to term 1 idle. `page.tsx:210-212` initialises `subState` from `?entry` only. `F02`: Close X goes straight to `/` with no confirm.
- **Case:** Redo reads as punishment for re-recording: it wipes the hint and the first take. Reload and Close lose the term. The brief says progress saves and returning resumes.
- **Fix:** In the retry state, Redo should re-enter `hinted2Recording` and keep the hint. Persist `{termIndex, subState, outcomes}` to `sessionStorage`, or add a `?state=` param as `/` already has. Deep-link behaviour is a UX call for Mia.

### 5. Summary does not read the session, and its framing flatters. UX judgment, Coherence
- **Source:** critic-ux #4; critic-system #3; critic-ambition (settling item 2).
- **Evidence:**
  - `B10` (after a real run) is pixel-identical to `B01`: the data is the fixed `TERM_RESULTS` script (`summary/page.tsx`).
  - The headline is a binary on `?variant=all-recalled`: "Good session, Mia." over "25% recalled", 1/4 and three terms that need work (`B01-full`, `summary/page.tsx:324-326`; the file's own comment at `:315-318` says the other outcome tiers are unbuilt).
  - `<Table style=.../>` at `summary/page.tsx:449` passes no `rows`, so it renders `DEFAULT_ROWS` (`Table.tsx:59,74`) while the counts, XP and score come from `TERM_RESULTS` (`:265-268`). Two sources that agree only today.
  - The primary button is "Review what you missed" and Continue is secondary (`:468-469`).
- **Case:** The percentage, score and XP are now derived correctly (Recalled ÷ total, 2 XP per Recalled), but the tag column is a separate source, the headline is praise the numbers below contradict, and nothing the student did reaches the screen.
- **Fix:** Pass `rows={TERM_RESULTS.map(r => ({ label: r.term, status: r.status }))}` to `Table` (documented prop). Have Session hand its outcomes to Summary. Derive the headline from the outcome mix; the final wording is Mia's.
- **For Mia:** the rubric's Craft anchor reads "Continue as the primary action on Summary", while the live build follows Figma (`design-system.md`, 2026-09-18). Not scored either way.

### 6. No pressed feedback on any control. Craft, and gate G4
- **Source:** critic-craft #1.
- **Evidence:** the seven Pressed pairs above, all 0.000%. A grep of non-story `src/` for `:active`, `active:`, `onPointerDown` and `onMouseDown` finds only comments and a function named `getFill`. `Button.tsx` takes `state` as a prop only.
- **Case:** Send, Continue, Speak, Review, Redo and the mic show nothing on touch, where there is no hover to fall back on. The Pressed fill is authored in `getFill` (`buttonVariants.ts:65,86`) and nothing ever reaches it.
- **Fix:** Drive `state="Pressed"` from `onPointerDown/Up/Leave` (or `:active`) in `Button`, `ButtonIcon` and `MicButton`, reusing the existing Pressed fill and overlay, then re-screenshot Default vs Pressed and keep the diff. The MicButton Pressed variant has no real Figma instance (`design-system.md` §5), so it needs a screenshot first (§4 item 11). The inline Redo circle (`session/page.tsx:1293`) needs its own pressed style, a gap for Mia to name.

### 7. Touch targets under 44px, including the entry CTA. Accessibility, gate G2
- **Source:** critic-ux #6 (first half); critic-system #4.
- **Evidence:** `hit-areas.md`: "Speak" 90×32, "Review" 96×32, "Redo" 82×32 (`A07`, `A08`, references), chip 104×20, "Play recording" 258×32 twice on `D01` and twice on `E01`. `component-gaps.md:278`: "Primary/Secondary at S and M... still have no outer tap area."
- **Case:** Speak is the only activation path from `/`, on the screen that carries the 25% activation metric. The scrubbers are under the floor on screens used one-handed. The 48px child span was added only for Tertiary/S.
- **Fix:** Check the Primary/S frame in Figma with `get_design_context`. If it is 48, extend the `Button.tsx` hit-area child to Primary and Secondary at S, and add the same transparent 48px-high span to `AudioScrubber`, visible size unchanged. Whether the Figma frames already carry 48 is not verified. The chip should not be a button unless it has a job.

### 8. No motion anywhere, and no reduced-motion handling. Craft
- **Source:** critic-craft #4; critic-ux #6 (second half).
- **Evidence:** `C03-a` vs `C03-b` 0.000%. `measure/R-reduced-motion-animations.json` is `[]` at every loop state, with and without `prefers-reduced-motion`. A grep of `src/` finds `prefers-reduced-motion` only in `HotspotHints.tsx:85`, a prototype overlay. `SpeechBubble.tsx:112-116` documents the Loading dots as static on purpose; `D05` shows a still pose, still dots and a "Processing…" mic. The thinking mascot is 70px (`session/page.tsx:717`) and the result mascot is 58px (`MascotSlot XL`), so it jumps when the result lands.
- **Case:** Recording is distinguishable by label, shape and scrim, but the waveform is frozen and the processing wait is a still picture, so a student may tap again. The logged decision (thinking pose plus Loading bubble) is respected; its execution is inert. State changes cut instantly.
- **Fix:** Animate the Loading dots and the Recording waveform bars, with an `@media (prefers-reduced-motion: reduce)` fallback to the static frame. Add a short fade for state swaps and render the thinking pose at the same size as `XL`. Duration and easing values are not in `tokens.json`; that is a gap for Mia.

### 9. `SpeechBubble` is fixed at 237px, so it does not fill the row on either Session screen. Craft
- **Source:** critic-craft #2.
- **Evidence:** `SpeechBubble.tsx:329` `width: 237` inside a `shrink-0` box (confirmed by the panel lead), so the callers' `className="flex-1"` (`session/page.tsx:556,724`) does nothing. `D01`: bubble spans x=101 to 338 against x=373 in Figma 13728:15886. Hint text wraps to 5 lines against 4 in Figma; the `E01` Success bubble also wraps to 5 against 4 (Figma 13673:13893), about 179px tall against 157px on `D01`.
- **Case:** The bubble stops about 35px short of the right edge and the taller bubble pushes everything below it. The right edge no longer lines up with the scrubbers.
- **Fix:** Let the bubble fill its container when the caller passes `flex-1`, keeping 237 only as the intrinsic default (for example a `fill` prop or `width: 100%` under a flex parent). That is a component change, so it is Mia's call. The critic could not verify whether Figma's wider instance is an instance override. Re-shoot `D01` and `E01` and diff against Figma.

### 10. Vertical rhythm is off Figma, cumulatively on the Hinted1-recalled screen; no pixel diff is kept for any screen. Craft
- **Source:** critic-craft #3.
- **Evidence:** by eye from two screenshots, not a computed diff. `D01` against Figma 13728:15886: "Topics 2 of 4" row y≈119 vs 128, prompt 161 vs 177, top scrubber 223 vs 245; the built pill is about 32px tall (`AudioScrubber.tsx:183-184`) against about 42px. `E01` against 13673:13893: second scrubber y≈393 vs 427, mascot row 525 vs 553, so the drift grows from about 9px to about 34px down the stack. `A01` against 13622:13162: header rows match, but from the "Section 1" divider down everything sits about 10-11px higher (divider 267 vs 278, card 585 vs 596, nav strip 762 vs 778). `pixel-diffs.md` has no pair against any Figma frame.
- **Case:** The group gaps read as arbitrary against the frame, and the built screens do not match the frames they are graded against. The rubric asks for a stated tolerance and kept diffs per built screen. There are none.
- **Fix:** Pixel-diff each of the four screens against its Figma node at a stated tolerance and keep the diffs. Then correct the `main` top padding (`session/page.tsx:647`), the stack gaps (16px `space-400` at `:712,751` against the 24px the unaided branches use at `:1091`) and the `AudioScrubber` pill height. Confirm against Figma's bound values first.
- **Confidence:** direction is reliable; magnitudes are ±2px.

### 11. The bevel shadow is an unbound `rgba()` literal on all four screens, and no gap entry names it. System fidelity
- **Source:** critic-system #1; critic-craft #6 (last sentence).
- **Evidence:** live literals at `Button.tsx:180`, `ButtonIcon.tsx:134`, `session/page.tsx:1307`, `page.tsx:359`, and `TableCell.tsx:114` (`logs/grep-rgba-hsla.txt`; `check:tokens` does not scan `rgba()`). `get_variable_defs` on 13728:15886 (critic's trace) returns `Inset Edge/200` = INNER_SHADOW, colour `Black/300` = `#0c0c0d26`, offset `depth/negative-100`. `tokens/tokens.json` has `Black/100`, `Black/200`, `Black/400` and no `Black/300`. `component-gaps.md` has no entry for it; the literal is explained only in code comments.
- **Case:** Figma binds a named effect built from `Black/300`. The literal is `#000` at 15%, not `#0c0c0d` at 15%, and `-4px` rather than a depth token. A Figma-versus-export disagreement is resolved silently.
- **Fix:** Log a `component-gaps.md` entry: "tokens.json is missing primitive `Black/300` and there is no semantic token for the `Inset Edge/200` effect." Mia decides whether to export both. Only then can the five literals be rebound. Bind the `TableCell` divider to `--semantic-color-border-default`. The critic did not check whether the depth tokens are emitted into `tokens.css`.

### 12. The collapsed hint block on target 4 is hand-built from literals, not `InlineAlert`. System fidelity
- **Source:** critic-system #2.
- **Evidence:** `session/page.tsx:499-522` (`hintedHistory`, shown on `resultHinted1Recalled` and `hinted2Processing`): `fontSize: 20`, `fontSize: 12`, `gap: 2`, `gap: 4`, a local `AlertCircleIcon` (`:176-185`), and font families hardcoded. Storybook `components-inlinealert` documents `variant="Warning"`, `title` and `descriptor`. `design-system.md` §5 says `inlineAlert` was extracted from exactly this icon-plus-title-plus-secondary-text pattern. `component-gaps.md:99` justifies the inline build only by "not adding a prop to SpeechBubble" and never names `InlineAlert`.
- **Case:** A library component was rebuilt inline with no reason recorded.
- **Fix:** Render `<InlineAlert variant="Warning" title="Not quite yet." descriptor="Hint 1 of 2" />` above the hint message, or add a `component-gaps.md` line saying why it does not fit. The critic could not confirm whether `InlineAlert` lays its descriptor out in a row or stacked under the title, and Figma stacks it.

### 13. Literal px where a token exists and is named in the repo. System fidelity
- **Source:** critic-system #5.
- **Evidence:** `session/page.tsx:648` `gap: 24`; `component-gaps.md:183` says the same 24px is `--size-space-600`, and `build/css/tokens.css:148` has `--size-space-600: 24px`. Also `summary/page.tsx:300` (`gap: 32`) and `:329` (`gap: 16`), and `Table.tsx:81` (`borderRadius: 16` next to the existing `--size-radius-400`).
- **Case:** Values chosen by matching pixels with the right token named in the same repo are what the rubric calls "literal px sizes in component source with no note".
- **Fix:** `gap: 'var(--size-space-600)'` at `session/page.tsx:648`. The `gap: 2` and `gap: 4` at `:500-501` have no matching token the critic found, so they need a gap entry instead.

### 14. Title Case on `/` against sentence case elsewhere, with no gap entry. Coherence
- **Source:** critic-system #6.
- **Evidence:** `page.tsx:244, 283, 291, 293-294, 454, 456` ("Art & Design", "Grade Goal: A", "Section 1: Finding Ideas", "Choosing Subjects", "Section 2: Mixed Media", "Artwork Planning"). Session and Summary copy is sentence case. `design-system.md` §4 item 3 and CLAUDE.md say sentence case on every label.
- **Case:** The copy comes from the Figma frame and may be intentional legacy roadmap content, but no `component-gaps.md` entry says so. The first and last screens read like different products.
- **Fix:** Add a `component-gaps.md` note ("roadmap copy is Figma Title Case, left as-is"), or lower-case per §4 item 3. Mia decides which.

### 15. Result and hint framing is ambiguous, and the two scrubbers are indistinguishable. UX judgment, Accessibility
- **Source:** critic-ux #5 and #6; critic-ambition (settling items 1 and 4, and a gap).
- **Evidence:** `E01`, `session/page.tsx:723-730`: the success bubble reads "Nice!" with a green check and only a grey "Hint 1 of 2" subtitle. The word "Hinted" appears on Summary but not here. No transcript is shown on the hinted attempts, though Recalled shows "You said…" (`:823`). `aria/D01.txt` and `aria/E01.txt`: both scrubbers are named "Play recording", and neither screen has an `aria-live` region.
- **Case:** After a hint the student cannot tell whether "Nice!" counts as unaided, and a mishearing cannot be told from a miss. A screen-reader student who taps Send hears nothing, and on `E01` cannot tell attempt 1 from attempt 2.
- **Fix:** Change the bubble subtitle to something like "With a hint" (Mia to confirm the Figma copy may change), and drop "of 2" while the second hint is out of scope (`docs/sprint-context.md`). Give the scrubbers distinct `aria-label`s ("Play your first attempt", "Play your second attempt"). Wrap the result bubble and `StatusIndicator` in `role="status"`. Showing the heard text would need `SpeechBubble state="Input"`, which the critic did not verify.

### 16. Table row dividers still follow status, not position. Craft
- **Source:** critic-craft #6.
- **Evidence:** `TableCell.tsx:84-92,114` (`SHOWS_DIVIDER`), `Table.tsx` passes no position. `design-system.md` §5 records Mia's 2026-09-18 rule "every row except the last" and says the code does not follow it yet.
- **Case:** Correct on `B01` only because Skipped sorts last; a list with no Skipped row gets a stray trailing divider. `B04` is correct only through an inline override.
- **Fix:** Add an `isLast` prop to `TableCell` (a Figma-modelled gap for Mia to approve) and have `Table` pass `index < rows.length - 1`. Not tested with another row list.

### 17. Layout and structure: fixed 844px frame, no safe-area handling, and a default page title. Structure
- **Source:** critic-craft #5.
- **Evidence:** `session/page.tsx:563` `height: 844` with `overflow-hidden`; the bottom container uses uniform `padding: space-700` (`:1223`). A grep for `safe-area` and `env(` in `src/` finds none. `layout.tsx:17` still reads `title: "Create Next App"`. `structure.md`: 390/390 with no horizontal scroll in all 59 states.
- **Case:** On any viewport shorter than 844 the bottom action row clips silently with no scroll. Long content was not tried (the app accepts no long term or transcript).
- **Fix:** `min-height: 100dvh` with a scrollable middle content, `padding-bottom: max(var(--size-space-700), env(safe-area-inset-bottom))`, and set the page title. Resume behaviour is finding 4.

### 18. Console warnings on processing paths and on `/summary`. Structure
- **Source:** critic-craft (basis of the Structure score); the panel lead's own capture.
- **Evidence:** `logs/console.json`, 17 entries: a Next `Image` warning for `thinking.svg` ("has either width or height modified, but not the other", 10 entries) and an LCP warning for `standby.svg` (7 entries). Dev-mode warnings, not errors; `build` and `lint` exit 0.
- **Fix:** Add `style={{ width: 'auto', height: 'auto' }}` to the bare `thinking.svg` `<Image>` (`session/page.tsx:717`) and `loading="eager"` to the hero mascot on `/summary`.

### Withdrawn, not a finding
- **The session XP badge reads "8" while Summary reads "2".** Mia confirmed this 2026-09-19: the badge is the session's XP goal (4 terms × 2, reached at 100%), Summary shows XP earned. Logged in `SPEC.md:207` and `component-gaps.md:285`. critic-ux (#4) and critic-craft and critic-system (outside their dimensions) noted the difference; none scored it, and it is not counted here.

### Open questions for Mia (raised, not resolved by any critic)
- The Summary primary action: Continue (the rubric's Craft anchor) or "Review what you missed" (Figma and the live build) (finding 5).
- The result subtitle "Hint 1 of 2" is Figma copy; may it change (finding 15)?
- Whether `SpeechBubble` should grow a fill width (finding 9).
- Motion duration and easing tokens (finding 8).
- Whether the Figma frames already carry 48px hit areas on Primary/S and `AudioScrubber` (finding 7).
- Whether tokens.json should gain `Black/300` and an inset-edge effect token (finding 11).

---

## Blind spots, per critic (verbatim)

**critic-craft.** I never saw the app run, and my Figma comparisons are estimated from two screenshots rather than computed as diffs. The y-offsets and the 237 vs 272 bubble widths should be confirmed with an actual pixel diff. I did not open the `diffs/` images, `gray/`, or the other evidence JSON. I did not open Summary's source, the `/summary` all-recalled variant or the second-variant screenshots, so my Summary findings rest on `TableCell.tsx`, `Table.tsx` and `B01-summary-mixed-default-full.png` only. I did not verify contrast, hit areas or accessibility. I did not check the SVG icon paths in `session/page.tsx` for corruption beyond the screenshots, where every icon on D01, E01 and A01 rendered correctly. No long-term or long-transcript stress evidence exists (the app has no transcript input), so wrapping under long content is not verified. I made no Storybook call, so I did not confirm whether a bubble width prop or `TableCell` `isLast` exists in Storybook; I checked the source only.

**critic-ux.** I could not run the app, so tab and focus order, real screen-reader output and rendered non-text contrast are unverified. I did not open the Primer or Skipped states, so the mic primer and "denied → text" rows may exist elsewhere. Reading the `data-hotspot` gating as "inert" comes from `hit-areas.md` and source, and the "Redo returns to cold idle" claim rests on a pixel-identical diff, so a subtle difference could hide inside the 8-per-channel tolerance. I did not query Storybook, so component-prop suggestions are unverified. Contrast "rendered" samples can read low on thin glyphs, so the G1 pass for the four reviewed screens rests on that limit. No Figma comparison was made.

**critic-system.** I did not diff any screen against its live Figma frame. Only two `get_variable_defs` samples were traced, so bindings on `Chips`, `TopicNode` and the Summary stat boxes are read-only. I did not open `tokens.css` to check emitted depth tokens. I did not check the Primer screens, and no scripted end-to-end run was available to test whether the session outcome carries into the summary and study plan. `inlineAlert`'s row-versus-stacked layout is unverified from Storybook prose. I read `src/app/session/page.tsx` lines 991-1179 only via grep, not in full.

---

## critic-ambition's read (kept separate; not part of the total)

**Reach: 7 / 10.** Not part of the weighted total. This critic is non-adversarial. It confirmed the component props below in Storybook (`components-tag`, `components-chips`). It read `component-gaps.md` only to line 167 of 296.

Summary is the one place with a point of view: the headline number is Recalled ÷ total, so it reads 25% and 1/4 (`summary/page.tsx:261-268`), and each term gets a status-tinted explanation ("Needed a hint", "Revealed", `B01-summary-mixed-default-full.png`). The two Session screens and StudyPlan are faithful, competent reproductions of the Figma frames and carry no stance of their own. Hinted1-recalled greets a hinted success with the same green "Nice!" as an unaided one (`session/page.tsx:723-729`, `E01`).

**What it is settling for**
1. **Session, `resultHinted1Recalled`.** The bubble reads "Nice!" with a green check, and only the small grey "Hint 1 of 2" says this was not unaided (`session/page.tsx:723-729`, `E01`). The safe choice was to copy Figma's celebration. The student is told "Nice!" here, then finds a "Hinted" tag and 25% on Summary.
2. **Summary, mixed default.** The headline is a binary switch on `?variant=all-recalled`: "Good session, Mia." for every non-perfect run (`summary/page.tsx:324-326`, `B01`), a warm, generic line not derived from the run, unlike every number under it. The code comment at `:315-318` admits the other tiers are unbuilt.
3. **StudyPlan-notStarted, `/`.** The activation card is one chip ("+20% exam score"), a title and Speak, under two large pink roadmap nodes that pull the eye (`page.tsx:319-336`, `A01`). The safe choice was to sell the outcome, not the task. The card does not say how much the student is signing up for, and the 25% activation metric lives on this card.
4. **Session, `hinted2ReadyToSend`.** Two identical scrubbers (first take at top, second at bottom) have no attempt labelling and no transcript, so the student cannot tell "my first try" from "the one I am about to send" (`D01`). Keeping the hint on screen is a good instinct and the strongest thing on this screen.

**Stronger patterns** (all built from existing components)
1. **Result ledger tag: the Session speaks Summary's vocabulary.** Moment: `/session`, `resultHinted1Recalled` (the same slot also fits `resultRecalled` and `resultRevealed`). Built from `Tag` (`status`: 'Recalled' | 'Hinted' | 'Revealed' | 'Skipped'; `className`, `style`) beside the unchanged `SpeechBubble` (`state`, `title`, `subtitle`, `message`). The student sees the same pill they will meet on Summary, so Summary confirms a ledger they watched being written instead of revealing a lower number. Change: at `session/page.tsx:731`, after the mascot and bubble row inside the `items-end` column, add `<Tag status="Hinted" />`, and the matching `Tag` after the Recalled and Revealed bubbles. No new tokens. `Tag` has never been placed on a Session screen (all 8 real instances are on Summary), so it needs a screenshot on the `background/page` canvas first (§4 item 11). It adds to the Figma frame, so Mia decides.
2. **Headline derived from the run.** Moment: `/summary`, mixed default. Built from the existing headline `<p>` with `HEADLINE_TEXT_STYLE`. The top line and the primary button say the same thing: instead of praise the 25% contradicts, the headline states the task and "Review what you missed" answers it. The all-recalled variant keeps "Nice work, Mia!". Change: `summary/page.tsx:325`, replace the binary with copy keyed to `SESSION_COUNTS` (missed = Hinted + Revealed + Skipped). Sentence case, wording is Mia's. It departs from Figma's "Good session, Mia." on the mixed frame, so it needs sign-off.
3. **Say what "Speak" costs.** Moment: `/`, notStarted card. Built from `Chips` (`text`, `size`, `color`, `active`, `showLeftIcon`, `showRightIcon`), a second chip beside "+20% exam score". The card states the size of the commitment ("4 terms") next to the reward. Change: `page.tsx:319`, add `<Chips size="XXS" color="Primary" active={false} text="4 terms" showLeftIcon={false} showRightIcon={false} />` in the same row, with the count from `TERMS.length`. Not in the Figma frame, so it is Mia's call; Primary/inactive/XXS exists only as a story, so screenshot it beside the pro chip first. No time estimate, none exists in the source.

**Gaps I did not fill**
- No component for a "hinted or revealed counts less" cue such as an XP or score delta at the result moment (something like `resultDelta`). It would touch the static XP badge Mia fixed on 2026-09-19.
- No labelling for the two stacked scrubbers on the retry screens (something like `attemptLabel`). `AudioScrubber` has `state` as its only prop.

**Blind spot (critic-ambition).** I could not drive the app, so I judged motion and timing (the 1.5s processing beat, the XP animation) from source and stills only, and Reach may be higher there than I saw. I read `component-gaps.md` only to line 167 (of 296). A later entry may already answer the Session-to-Summary ledger idea. My taste leans toward honest scoring at the moment of result. The brief and Mia's logged "judge generously" decision may prefer the unmixed warm "Nice!", and the Figma frames are the source of truth. Treat proposals 1 to 3 as questions for Mia, not corrections.

---

## Method notes and limits

- **Captured with:** Playwright, headless Chromium, 390×844 at 2x, dark scheme, against the dev server on `:3000`. A fake audio device was used for the granted-mic path; denied paths replace `getUserMedia` with a rejection. `npm run build`, `npm run lint` and `npm run check:tokens` all exited 0 (`logs/`).
- **Not done:** no pixel diff against the live Figma frames (the Figma comparisons in findings 9 and 10 are by eye at 1x); no long-content run; Primer screens, typed paths on terms 3 and 4, hover, real screen-reader output and real touch were not captured.
- **Storybook** was reachable this run. critic-system and critic-ambition queried it; critic-craft and critic-ux did not, so component and prop suggestions in findings 1, 3, 5, 6, 9, 15 and 16 are unverified by Storybook.
- **Measurement caveats:** rendered contrast samples glyph cores, so thin text can read slightly low. Hit areas come from `elementFromPoint` on a 2px grid; below-the-fold elements were re-measured scrolled (`B06`). `getAnimations()` does not see `requestAnimationFrame` or SMIL; a grep of `src/` finds neither. Held-mouse Pressed captures are not touch `:active`.
- **Blindness:** each critic's prompt named only the four screens, the rubric path, the evidence folder and its own dimensions. Each confirmed in its report that it received no score or other critic's output. The earlier run's scorecard was moved out of `eval/` before the critics started, so they could not open it. This scorecard was written after all four reports were in and is the only file that combines them.
- **Earlier run.** An earlier run of this same panel exists in `eval/archive/run-1/` (scorecard and evidence). It graded code that has since changed, so it is not comparable line by line. Keep critics away from that folder in later runs, since it contains scores. Between the two runs: Summary's XP, score and percent now derive from the term results (25% / 1/4 / XP 2) instead of being hardcoded at 50% / 2/4 / XP 4, and "Processing…" now measures 8.4:1 (was 3.77:1). Per-dimension scores moved System fidelity 5 → 6, Coherence 5 → 6, Structure 7 → 6, with Craft, UX judgment and Accessibility unchanged at 5. The total moved 5.1 → 5.5. The gate outcomes are unchanged: G1, G2 and G4 fail, G3 passes.
