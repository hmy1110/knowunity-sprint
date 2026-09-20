# Scorecard 02

**Date:** 2026-09-20. **Rubric:** `eval/rubric.md`. **Evidence:** `eval/evidence-02/` (start at `INDEX.md`; capture scripts in `capture/`).

**Screens graded (the same four as run 1):**
1. StudyPlan-notStarted, `/`
2. Summary, `/summary`
3. Learning-topic 2-result-Hinted1-ready to send, `/session` (`hinted2ReadyToSend`)
4. Learning-topic 2-result-Hinted1-recalled, `/session` (`resultHinted1Recalled`)

**How it was run.** Every state was rendered at 390px in dark mode first (61 states; run 1's 59 ids plus `X01`/`X02`, term 1 typing, added because term 2 typing is no longer reachable). Run 1's capture script was lost, so it was rewritten and kept in `evidence-02/capture/`. Then four critics ran in separate, fresh contexts (critic-system, critic-craft, critic-ux, critic-ambition). Each got only the four screens, the rubric, the evidence folder and its own dimensions. All four reported receiving no scores and reading no earlier scorecard, archive, or run 1 evidence. Nothing was fixed and nothing was committed.

**The build changed between the runs.** Commit `c807145` (MicButton, SpeechBubble, Steps, InlineAlert, AudioScrubber synced to Figma) and `8bac949` (term 2 no longer has a typed-answer entry). `evidence-02/CHANGES-SINCE-RUN-1.md` lists every state that differs. A01 and B01 are pixel-identical to run 1. D01 and E01 are not.

---

## Result

**Weighted total: 5.5 / 10.** `(3·6 + 3·5 + 3·6 + 3·5 + 2·5 + 1·7) / 15 = 83 / 15 = 5.53`, using the rubric's High = 3, Medium = 2, Low = 1 mapping.

**Hard gates: three of four failed (G1, G2, G4). G3 passed.** Per the rubric, a failed gate fails the run whatever the total is.

**Against run 1 (5.47, same three gates failed):** essentially unchanged. The total moved 0.06. Coherence fell 6 to 5, Craft rose 5 to 6, Structure rose 6 to 7, and the other three held. These are different critic instances reading different states, so a one-point move is inside what I would expect from re-grading alone. I would not read any of the three as evidence that the code got better or worse.

## Per-dimension table

| Dimension | Weight | Score /10 | Weighted | Critic | Basis |
| --- | --- | --- | --- | --- | --- |
| System fidelity | High (3) | **6** | 18 | critic-system | `check:tokens` exits 0. Two Figma `get_variable_defs` traces agree with the code. Held at 6 by 138 grandfathered deviations with no `[gap:]` tag, five literal `rgba()` bevels, inline patterns with no gap entry, and Pressed variants never rendered. |
| Coherence | High (3) | **5** | 15 | critic-system | Read against the four screenshots. Seams: study-plan mascot is XL cropped where the doc says 2XL, casing drift from sentence case on `/` and the Summary stat labels, Summary numbers are constants rather than read from the session. |
| Craft | High (3) | **6** | 18 | critic-craft | Verified from screenshots and measure JSON, no Figma pixel diff exists. Recording and processing are designed states, not colour swaps. Held below 7 by no motion, no Pressed feedback, and two Figma deviations seen by eye. |
| UX judgment | High (3) | **5** | 15 | critic-ux | Hard constraints hold and the four loop states differ. Pulled down by inert Skip, "I don't know" and "Type instead", a silent denied mic, no resume on reload, and a scripted Summary. |
| Accessibility | Medium (2) | **5** | 10 | critic-ux | No text run on the four screens is under 4.5:1. Held down by the 32px primary entry, native buttons that announce as live but do nothing, and two identically named "Play recording" buttons. |
| Structure | Low (1) | **7** | 7 | critic-craft | `build`, `lint`, `check:tokens` all exit 0. No horizontal scroll in any of the 61 states. No console errors. Held below 8 by fixed 844px frames with no safe-area handling and untested long content. |

**Ambition (not in the total): 6 / 10**, critic-ambition. One real point of view (Knowie peeking over the study-plan card). The screens that carry the brief's metrics behave like any recall app.

No dimension scored 8 or above, so rule 2 (8+ needs cited evidence) was not triggered.

---

## Hard gates

| Gate | Result | Evidence |
| --- | --- | --- |
| **G1 Contrast** | **FAIL** on the literal reading. **Pass** on the four screens at rest. | `contrast.md`: 12 rows under 4.5:1 across 61 states. Under the recording scrim (`C03-a`, `C03-b`, `C09`, `C13`, and `C13` is the state directly before target 3) the XP "8" is 2.77, "Not quite yet." 3.61 (20px bold, so 3:1 applies), and the prompt and "Hint 1 of 2" 4.45. Disabled "Submit" and "Switch to voice" (`F07`) are 3.66. Judgement calls left open: disabled controls carry a WCAG exemption, and whether scrim-dimmed history text counts as inactive is arguable. 4.45 is inside measurement noise on thin glyphs. On the four target states no text run is under 4.5:1. |
| **G2 Touch targets** | **FAIL** (measured) | `hit-areas.md`. `A01` "Speak" 90×32 is the only entry into the feature. `A01` "🔥 +20% exam score" 104×20, a `<button>` with no handler. On `B01`, `D01` and `E01` nothing measured is under 44: Close 48×48, "Play recording" now 262×44, Redo, Send and Resume 56×56, and Skip 56×48 through its child span. Not judged: the mic button in every state. Reference-only states `A07`/`A08` also list "Review" 94×32 and "Redo" 82×32. |
| **G3 No raw hex in component source** | **PASS** | `logs/check-tokens.txt`: "No token rule violations in src/." `EXIT=0`. It also reports 138 grandfathered deviations (color-fn 5, px-token 127, font-family 5, font-stretch 1) that are not failures. Critic-system's own greps found the same: no raw hex outside comments, no `var()` fallback, no primitive read, and five `rgba()` literals outside comments. |
| **G4 States that should differ** | **FAIL** | `pixel-diffs.md`. **Fails, all 0.000%:** `micButton` Idle vs Pressed (`C01`/`C02`) and Primary Default vs Pressed on six pairs (`A01`/`A02`, `B02`/`B02b`, `B02`/`B03b`, `E01`/`E02`, `D01`/`D03`, `D01`/`D04`). **Passes:** the four loop states (12% to 37% RGB, not hue-only), result outcomes Recalled, Hinted, Hinted-recalled and Revealed, mic Idle vs Recording (12.4%) and vs Processing (15.6%), voice vs text processing (25%), Primary Default vs Disabled (96.6%). **Not verified by any critic:** the four `tag` statuses (measured fill luminance ratios: Recalled/Hinted 1.26, Recalled/Revealed 1.21, Hinted/Revealed 1.53, Skipped 4.1 to 6.2 against the rest, so the first three differ by hue plus the label word), and Skipped as a result (term 4 goes straight to `/summary`). **Caveat:** a held mouse is not a touch `:active`, but `src/` has no `:active` styling to test. |

---

## Findings

Reconciled across the critics and ranked by effect on the student and on the gates. "Source" names the critic and their own numbering. Where a fix needs something that does not exist, the decision is Mia's.

### 1. Controls that look live but do nothing. UX judgment, Accessibility
- **Source:** critic-ux #1 and #6, critic-craft #6.
- **Evidence:** `hit-areas.md` (native `<button>` with no `onClick`): Skip in 40 states, "Type instead" in 14, "I don't know" in 19, Resume, "More options", "+20% exam score". Skip is wired only on term 4 idle (`session/page.tsx:663-668`), "I don't know" only on term 3 idle (`:1236`), "Type instead" only on term 1. `C12b`, `F04`, `D02`, `A03` to `A05` are all 0.000% after a tap.
- **Case:** A student on term 2 who can't or won't answer again can only tap the mic. A screen reader announces four live "Skip" buttons that do nothing. The brief says Skip is available throughout and never trap the student.
- **What changed since run 1:** commit `8bac949` removed term 2's typed path, so the endless "Processing…" hang no longer exists. The control is still visible and inert.
- **Fix:** wire Skip everywhere and "I don't know" in the idle and hint states to a Skipped or Revealed outcome. Until then render them as `Button` `state="Disabled"` or hide them. Whether a mock sprint should implement this is Mia's call.

### 2. A denied mic is silent, and term 2 has no text route. UX judgment
- **Source:** critic-ux #2.
- **Evidence:** `session/page.tsx:285-287` (empty `catch`, comment "Denied mid-session isn't handled yet"). `F09` and `F10` render the same screen as before the tap. `CHANGES-SINCE-RUN-1.md` confirms nothing changed here.
- **Case:** The student taps, nothing happens, no reason, no next step. The brief names this exact dead end.
- **Fix:** an `InlineAlert` on denial with a route to text, for example "Mic is blocked. Type instead, or turn it on in Settings." Not verified: the critic did not open the `InlineAlert` docs, so the props need a Storybook check first. Term 2 needs a typed-result frame that Figma does not have, so that part is Mia's.

### 3. Reload and Close lose all progress. UX judgment
- **Source:** critic-ux #3.
- **Evidence:** `F01` and `F12` land on "Topics 1 of 4" with the first term. `F02` (Close X) goes to `/` with no confirmation.
- **Case:** The brief says progress saves and returning resumes.
- **Fix:** persist term index and outcomes in `sessionStorage` and resume at the idle state of the same term. No new component.

### 4. The Summary is a script, and the copy claims more than the data. UX judgment, Coherence, Ambition
- **Source:** critic-ux #4 and #5, critic-system #5, critic-ambition #1 and #2.
- **Evidence:** `summary/page.tsx:63-84` (fixed `TERM_RESULTS`), `:88` (`SESSION_PACE = '1:09'`), `:325` (headline is a fixed "Good session, Mia." over 25% and 1 of 4). `B10` (after a real run) is 0.000% different from `B01`. `?review=1` resolves every term to "Nice! Unaided" (`session/page.tsx:447-449`), and the all-recalled Summary says "first try" for terms that needed a hint or a reveal (`summary/page.tsx:35,41,46`). On `/session`, a hinted pass reads "Nice!" exactly like an unaided one, with only a 12px "Hint 1 of 2" subtitle (`session/page.tsx:699-705`).
- **Case:** The brief says overconfidence must cost something or the screen is flattery. Under the fixed script the numbers do reconcile (1 Recalled gives XP 2, 1/4, 25%, and the plan card shows "1 OF 4"), so this is about execution, not the XP rule Mia settled on 2026-09-19.
- **Fix:** pass outcomes to `/summary` and derive tags, XP, score and percent from them (formulas exist at `:261-268`). Vary the headline by tier and drop "first try" where a hint may have happened. Critic-ambition's version: `"${n} of ${total} on your own, Mia."` for a mixed result, and "Got it with a hint" on the hinted success. Both change Figma copy and need Mia's sign-off, and any non-`standby` 2XL mascot pose needs a screenshot first (§4 item 11).

### 5. The primary entry is a 32px target, and inert chips announce as buttons. Accessibility (G2)
- **Source:** critic-ux #6.
- **Evidence:** `hit-areas.md`: "Speak" 90×32, chip 104×20 with no handler.
- **Fix:** extend Speak's hit area to 44×44 with the same hit-child pattern Skip already uses, visible size unchanged. Render the chip as a non-interactive element.

### 6. No Pressed feedback anywhere. Craft, System fidelity (G4)
- **Source:** critic-craft #2, critic-system #6.
- **Evidence:** every held-down pair is 0.000% (`pixel-diffs.md`). `Button.tsx:80-84` says Pressed is a prop, and nothing maps a real tap to it. `src/` has no `:active`.
- **Fix:** drive the existing `state="Pressed"` from pointer-down in `Button`, `ButtonIcon` and `MicButton`, then screenshot each held state before a screen depends on it.

### 7. No motion, so a frozen "Recording…" carries the wait. Craft
- **Source:** critic-craft #1.
- **Evidence:** `R-reduced-motion-animations.json` lists zero running animations in every loop state, and `C03-a` vs `C03-b` (0.9 s vs 2.2 s) are identical. I also grepped `src/` (excluding stories) for `@keyframes`, `animation:`, SMIL `<animate`, `requestAnimationFrame` and `transition`. The only hits are `HotspotHints.tsx:109` (the prototype's own overlay) and `LoadingSpinner.tsx:43` (`animate-spin`, unused). So `getAnimations()` is not missing anything here. The Loading bubble dots are static, though Figma's own description says animated.
- **Fix:** a pulse on the recording dot, a waveform loop, a sequential fade on the Loading dots, and a short state-swap transition, all inside `@media (prefers-reduced-motion: no-preference)`. Duration values need a token that does not exist, so they are Mia's to choose.

### 8. Two Figma deviations seen by eye on the study plan and the mascot. Craft, Coherence
- **Source:** critic-craft #3 and #4, critic-system #2. **These are unverified estimates.** No pixel diff against Figma exists, and the critics read only two Figma frames, from inline screenshots at different scales.
- **Claims:** the study-plan card and dividers run wider than Figma (358 vs about 326 wide) and the roadmap sits about 10px high (`page.tsx:290`). The mascot renders about 45% bigger than Figma inside its slot, with a suspected root cause in `MascotSlot.tsx:113-123` (`<Image fill>` ignores the wrapper's padding), which would mean `component-gaps.md`'s "asset gap" entry is a misdiagnosis. Critic-system separately notes the study-plan hero is XL cropped to 52×40 where `design-system.md` §1 says 2XL.
- **Fix:** pixel-diff `A01`, `D01`, `E01` and `B01` against their live Figma frames first. Do not change the shared `MascotSlot` until Mia confirms.

### 9. Recording-scrim text fails contrast. Accessibility (G1)
- **Source:** critic-ux (gate).
- **Evidence:** numbers in the G1 row. The scrim itself is specified in Figma, so this is a design call: the values may be right and the 4.5 bar may not apply to history text behind a scrim.

### 10. System fidelity debt. System fidelity, Coherence
- **Source:** critic-system #1, #3, #4, #6.
- **Evidence:** 138 grandfathered deviations, with the four screens contributing unrecorded ones (`session/page.tsx:510` a literal 20px equal to `Headline S`, `:521` a hard-coded `Inter`, `summary/page.tsx:237-239` `fontStretch: 'condensed'`, `page.tsx:488` `borderRadius: 100`). Only three `[gap:]` tags exist in `src/`. `SectionDivider`, the home indicator and the bottom nav have no `component-gaps.md` entry. The `rgba(0,0,0,0.15)` bevel appears in five places. Title-case labels on `/` ("Grade Goal: A", "Section 1: Finding Ideas") and upper-case Summary stat labels ("XP", "SCORE", "BLAZING") against the sentence-case rule. That may be Figma's own copy, and no exception is logged.
- **Fix:** bind the 20px title to `--type-scale-headline-s-*`, tag the rest `[gap:<id>]` with matching entries, and log or fix the casing.

### 11. Structure: fixed 844px frames, no safe area, TableCell divider keyed to status. Structure, Craft
- **Source:** critic-craft #5 and #6.
- **Evidence:** `height: 844` with `overflow-hidden` at `session/page.tsx:566`, `page.tsx:211,224`. No `viewport-fit` or `env(safe-area-inset-*)`. On a real Safari viewport (about 664 tall) the bottom actions clip with no scroll. `TableCell.tsx:87` shows the divider by status, not position, and the all-recalled Summary works around it with a hand-rolled table. Console holds 17 warnings and no errors (10 Next `<Image>` width/height on `thinking.svg`, 7 LCP on `standby.svg`).
- **Fix:** `min-height: 100dvh` with a scrolling middle, a safe-area bottom pad, and an `isLast` prop on `TableCell` set from position.

---

## Ambition (not scored into the total)

Critic-ambition's three proposed patterns, all built from existing components: a Summary headline that states the earned fact and a mascot pose that follows the outcome, a hinted pass that carries its consequence through `SpeechBubble` and an `InlineAlert` "Counts as hinted", and a study-plan chip that names the size of the ask ("4 terms"). Each changes Figma copy and needs Mia's sign-off. Two gaps it did not fill: an attempt caption for the two stacked scrubbers, and an outcome-to-pose mapping. Its own caveat: it leans toward honest feedback over warmth, and the brief's "judge generously" pulls the other way.

## Limits of this run

- No critic could run the app. Every rendered claim comes from the captured PNGs, JSON and aria dumps. State transitions, real tap feedback, the real mic prompt and a real screen reader were not exercised.
- No pixel diff against the live Figma frames exists, which caps Craft at 7 whatever else is true.
- Critic-craft and critic-ux each said they did not open every screenshot. Critic-craft did not open `C18` (Revealed), `B04`, or the tag crops, so G4 is partly numbers only.
- Not captured: term 2 typed path (unreachable), `?entry=text`, long-content stress, hover states, and the `?review=1` run beyond its first screen.
- Run 1's exact hex-grep pattern was not recorded. The result was reproduced with a non-comment filter and matches (2 lines in both runs).
- `eval/evidence-*/` is excluded from git by `.git/info/exclude`, so `evidence-02/` will not appear in `git status`. This scorecard will.
