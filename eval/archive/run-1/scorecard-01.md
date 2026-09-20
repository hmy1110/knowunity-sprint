# Scorecard 01

**Date:** 2026-09-19. **Rubric:** `eval/rubric.md`. **Evidence:** `eval/evidence-01/` (start at `INDEX.md`).

**Screens graded (four):**
1. StudyPlan-notStarted, `/`
2. Summary, `/summary`
3. Learning-topic 2-result-Hinted1-ready to send, `/session` (`hinted2ReadyToSend`)
4. Learning-topic 2-result-Hinted1-recalled, `/session` (`resultHinted1Recalled`)

**How it was run.** Every state of the four screens was rendered at 390px in dark mode first, including failure paths (56 states, 62 pixel-diff pairs). Then four critics ran in separate contexts. Each was given only the four screens, the rubric, the evidence folder and its own dimensions. No critic received another critic's output or any score. All four reported receiving none. Nothing was fixed.

---

## Result

**Weighted total: 5.1 / 10.** `(3·5 + 3·5 + 3·5 + 3·5 + 2·5 + 1·7) / 15 = 77 / 15 = 5.13`, using the rubric's High = 3, Medium = 2, Low = 1 mapping.

**Hard gates: three of four failed (G1, G2, G4). Per the rubric, a failed gate fails the run whatever the total.**

## Per-dimension table

| Dimension | Weight | Score /10 | Critic | Basis |
| --- | --- | --- | --- | --- |
| System fidelity | High (3) | **5** | critic-system | Read-only plus opened evidence and two Figma `get_variable_defs` traces. Below 6: unbound `rgba()` literals, a logged decision contradicted, a hero mascot at a size other than the documented one. |
| Coherence | High (3) | **5** | critic-system | Numbers do not reconcile across session and Summary; casing and mascot size drift. |
| Craft | High (3) | **5** | critic-craft | Verified from screenshots, pixel diffs and Figma comparison by eye. Below 6: no pressed feedback, no motion, layout drift against Figma. |
| UX judgment | High (3) | **5** | critic-ux | Verified from screenshots and diffs. Below 6: a silent denied-mic dead end, a text path that hangs, a summary that flatters. |
| Accessibility | Medium (2) | **5** | critic-ux | Contrast passes on the four screens; two 32px targets; no announcement of state changes. |
| Structure | Low (1) | **7** | critic-craft | `build` and `lint` exit 0, no horizontal scroll in any state. Capped below 8: no long-content run, safe area untested, reload restarts the loop. |

No dimension scored 8 or above, so rule 2 (8+ needs cited evidence) was not triggered. Every score at or below 7 is stated by its critic as either verified or read-only.

---

## Hard gates

| Gate | Result | Evidence |
| --- | --- | --- |
| **G1 Contrast** | **FAIL** in states adjacent to the four screens. **Pass** on the four screens' own resting states. | `contrast.md`, `measure/contrast-per-state.json`. No text run under 4.5:1 on `A01`, `B01`, `D01`, `E01` on either method. Failing: under the recording scrim (`C03`, `C09`, `C13`): "Hint 1 of 2" 2.74, "Not quite yet." 3.61, the prompt 4.45, the XP "8" 2.77. "Processing…" 3.77 on `C06`, `C11`, `D05` (nominal 3.79, the two methods agree). Disabled "Submit" and "Switch to voice" 3.66 on `F06`, `F07`. The 4.45 is inside measurement noise (thin glyphs read slightly low on the rendered method); the others are not. Disabled controls carry a WCAG exemption, and whether scrim-dimmed history text counts is a judgement call. Both are flagged, not resolved. `D05` is the state directly before target 4. |
| **G2 Touch targets** | **FAIL** (measured) | `hit-areas.md`, `measure/hit-areas.json`. `A01` "Speak" 90×32. `A01` "🔥 +20% exam score" 98×20, and it is a `<button>` with no handler. `D01` and `E01` "Play recording" 258×32, twice per screen. Passing: Close 48×48, Redo, Send, Resume 56×56, Continue 334×56, Summary Back 48×48 and both Summary buttons 334×58 (measured in `B06`, scrolled). Header "Skip" reads 50×48 through an `aria-hidden` child span but has no handler, so that hit area triggers nothing. |
| **G3 No raw hex in component source** | **PASS** | `logs/check-tokens.txt`: "No token rule violations in src/." `EXIT=0`. Run by the panel lead; the critics could not run it. `rgba()` literals are outside G3's definition and are counted under System fidelity (finding 12). |
| **G4 States that should differ** | **FAIL** | `pixel-diffs.md`, `diffs/`. **Fails:** `micButton` Idle vs Pressed (`C01` vs `C02`, 0.000%), and Primary button Default vs Pressed on six pairs (`A01`/`A02`, `D01`/`D03`, `D01`/`D04`, `E01`/`E02`, `B02`/`B02b`, `B02`/`B03b`, all 0.000%). **Passes:** the four loop states (idle vs recording 11.4% RGB / 11.3% luma, not hue-only), the four result outcomes (9.8–32% luma), Idle vs Recording vs Processing, voice vs text path (23.6% and 26.5%), the four tag statuses (label text differs; fill luminance ratios 1.21–6.23, `measure/tag-fills.json`), and Primary Default vs Disabled (Submit crop, `F05b` vs `F06`: 96.5% of pixels differ, checked by the panel lead because the craft critic left it unverified). **Caveat:** held-mouse is not a touch `:active`, but `src/` has no `:active` styling to test. |

---

## Render pass: states that should differ but rendered identically

Flagged, not fixed. All are 0.000% RGB and luma difference at 8/255 tolerance (`pixel-diffs.md`).

| What was compared | Ids | Reading |
| --- | --- | --- |
| Every control, at rest vs held down | `A01`/`A02`, `C01`/`C02`, `D01`/`D03`, `D01`/`D04`, `E01`/`E02`, Summary `B02`/`B02b`/`B03b` | Pressed exists as a `state` prop only. Nothing renders it on a real press. |
| Recording, 0.9 s in vs 2.2 s in | `C03-a`/`C03-b` | Nothing moves during recording. `document.getAnimations()` is empty in every loop state. |
| Term 2 typed answer: 0.5 s vs 7 s after Submit | `F06`/`F06b` | The text path never resolves on a Hinted term. |
| Mic tap with `getUserMedia` rejected, vs idle | `F09` vs `C01` | Silent failure. No message, no route to text. |
| "Try again" with mic revoked, vs Hinted1 | `F10` vs `C12` | Same. |
| Reload at Hinted1-recalled / Hinted1-ready, vs term 1 idle | `F01`, `F12` vs `C01` | Progress is lost. Lands on term 1. |
| Tap on: kebab, topic node, bottom nav, "I don't know" (Hinted1 and term 2 idle), Resume | `A03`, `A04`, `A05`, `C12b`, `F04`, `D02` (each settled 1.3 s after tap) | Nothing happens. The prototype's hotspot overlay flashes for 0.75 s and clears. |
| Summary loaded directly vs after a real session run | `B01-full` vs `B10-full` | Summary does not read the session. It is hardcoded. |
| `?state=bogus`, `?variant=bogus` vs the default screens | `A06`, `B05` | Silent fallback to the default. |
| Redo from Hinted1-ready-to-send, vs a fresh term 2 idle | `F11` vs `C08` | Redo discards both takes and the hint context. May be intended; noted. |

Two captures were wrong and were replaced: my first Summary "pressed" shots were taken at a shifted scroll position after a full-page screenshot, giving a false 78% diff. They were deleted and recaptured at a fixed scroll (`B02`, `B02b`, `B03b`).

---

## Findings

Reconciled across the three adversarial critics, ranked by effect on the student and on the gates. Each keeps its evidence and the critic's exact fix. "Source" gives the critic and their own numbering. Where a fix needs something that does not exist, the decision is Mia's.

### 1. A denied or revoked mic silently dead-ends the student, and Hinted1 has no exit. UX judgment
- **Source:** critic-ux #1.
- **Evidence:** `src/app/session/page.tsx:282-284` (empty `catch`). `F09` and `F10` are pixel-identical to their before-states. `page.tsx:1394`, "I don't know" on Hinted1 has no `onClick`; `C12b` is identical to `C12`.
- **Case:** The student taps "Try again" and nothing happens, with no message. "I don't know" looks live and does nothing. The brief says never trap the student and design the denied state.
- **Fix:** In the catch, set a sub-state that reuses `InlineAlert` and the `typeInput` route, with copy such as "Mic is off. Type your answer or turn it on in Settings." Wire Hinted1's "I don't know" to `resultRevealed`, which already exists.

### 2. The text fallback hangs forever on term 2. UX judgment
- **Source:** critic-ux #2.
- **Evidence:** `page.tsx:466` (only `outcome === 'Recalled'` advances). `F06` vs `F06b` at 0.5 s and 7 s identical. Both buttons are disabled while it hangs. Route `/session`, term 2, Hinted1 → "Type instead" → Submit.
- **Case:** The student who cannot speak is who the fallback is for. They get an infinite "Processing…" and only Close as an exit, which loses progress (finding 6).
- **Fix:** For `Hinted`, route `typeProcessing` to `resultHinted1`, or `resultHinted1Recalled` on a retry. For `Revealed`, route to `resultRevealed`. If no built screen exists, log it in `component-gaps.md` rather than leaving a spinner with no timeout.

### 3. Summary numbers are hardcoded, contradict each other, and flatter. UX judgment, Coherence
- **Source:** critic-ux #3, critic-system #1 and #2. Craft raised the XP mismatch as outside its dimensions.
- **Evidence:**
  - `B01-full` shows "Good session, Mia." and "50% recalled this session" over "1 Recalled / 1 Hinted / 1 Revealed / 1 Skipped", with Score 2/4.
  - `summary/page.tsx:417` `percent={50}`, `:81-83` XP `'4'`, Score `'2/4'`, pace `'2:09'` are literals. The same `2:09` is in the all-recalled variant (`:51`).
  - `session/page.tsx:640` is a literal `8` in the appBar badge, shown from term 1 idle (`C01`), `D01` and `E01`. Summary shows 4 (`B01`, and `B10` after a real run). The all-recalled variant shows 8 (`summary/page.tsx:49`).
  - `B10` is pixel-identical to `B01`.
- **Case:** One term was recalled unaided, so "50% recalled" and Score 2/4 count the Hinted term as a full point. Overconfidence costs nothing. The XP badge reads 8 before the student has answered anything, then Summary says 4. Score, 50% and the legend agree only by coincidence.
- **Fix:** Derive percent, score and XP from `TERM_RESULTS` with the existing `countByStatus` (`summary/page.tsx:244`). Use one XP source for both the badge and `StatBox`. Either label the percentage "recalled or hinted", or use Recalled ÷ total (25%). Make the headline depend on the mix. If the 8 is Figma sample copy, log the mismatch in `component-gaps.md` as a deliberate mock and make Summary's mixed value match.
- **For Mia:** the 50% comes from the live Figma instance (`SPEC.md`: `percent` is a plain prop, formula untested). This is a Figma-versus-rubric conflict, not only a build error. Headline copy for the mostly-hinted tiers is also unverified in source.

### 4. No pressed feedback on any control. Craft, and gate G4
- **Source:** critic-craft #1.
- **Evidence:** the seven Pressed pairs above, all 0.000%. A grep of `src/` for `:active|onPointerDown|pressed` returns matches in `Button.tsx`, `MicButton.tsx`, `buttonVariants.ts` and `HotspotHints`, none of which changes pixels on a press.
- **Case:** Send, Continue, Speak, Redo and the mic show nothing on touch. The Pressed variants Figma defines exist only in Storybook. It is the missing-Pressed-feedback the rubric names.
- **Fix:** Wire the `state="Pressed"` styles to `:active` or `onPointerDown/Up` inside `Button`, `ButtonIcon` and `MicButton`, using the existing Pressed tokens. Screenshot each before it ships (design-system §4 item 11). The inline Redo circle (`session/page.tsx` ~1307) needs its own pressed style, which is a gap for Mia to name.

### 5. Two controls on the four screens are under 44px, and the entry CTA is 32px high. Accessibility, gate G2
- **Source:** critic-ux #5.
- **Evidence:** `A01` "Speak" 90×32. `A01` chip 98×20. `D01` and `E01` "Play recording" 258×32, twice per screen (`hit-areas.md`).
- **Case:** Speak is the only activation path from `/`, on the screen that carries the 25% activation metric. The scrubbers are under the floor on screens used one-handed.
- **Fix:** Add the 48px hit area used for Tertiary/S (commit `12a4862`) to Primary/S and to `AudioScrubber`: a transparent 48px-high child span, visible size unchanged. Whether the Figma frames already carry 48 is not verified. The chip is a `<button>` with no handler and no visible affordance to justify one; decide whether it should be a button at all.

### 6. Controls that look live do nothing, and Close or reload loses progress. UX judgment, Accessibility
- **Source:** critic-ux #4; critic-craft #6 (reload half).
- **Evidence:** `D01` "Resume" (`page.tsx:1341`, no `onClick`; `D02` identical to `D01`). Header "Skip" on terms 1–3 (`hasOnClick: false`). "+20% exam score" and "More options" on `/` (`hit-areas.md`, native buttons with no `onClick`). `F01` and `F12` are pixel-identical to `C01`. `F02` Close X goes straight to `/` with no confirm.
- **Case:** The ready-to-send row shows three actions and two are live. Native buttons with no disabled state are focusable and announced as actionable. Reloading at term 2 returns to term 1, which fails "resume at the same term". The hotspot overlay is a prototype aid, not an accessible state.
- **Fix:** Render non-live buttons with the existing `Button` `state="Disabled"`, or `disabled` and `aria-disabled`, or remove them. Persist `{termIndex, subState}` in `sessionStorage` or the query string the file already reads. Whether a Disabled `ButtonIcon` variant exists is not verified (Storybook was down); Mia decides.

### 7. No motion anywhere, and no reduced-motion handling. Craft
- **Source:** critic-craft #4.
- **Evidence:** `C03-a` vs `C03-b` 0%. `measure/R-reduced-motion-animations.json` is `[]` at every loop state, with and without `prefers-reduced-motion`. A grep of `src/` for `@keyframes|animation|<animate|setInterval|requestAnimationFrame` finds nothing. The only `prefers-reduced-motion` check is in `HotspotHints.tsx:85`, a prototype overlay. `D05` shows the Loading dots static.
- **Case:** Recording is distinguishable by label and shape, but the waveform is frozen. The processing wait is a still pose and three static dots. State changes cut instantly and there is no XP counter animation.
- **Fix:** Animate the `MicButton` Recording waveform bars and the `SpeechBubble` Loading dots with CSS keyframes, inside `@media (prefers-reduced-motion: reduce)` fallbacks to the static frame. Duration and easing values are not in `tokens.json`; that is a gap for Mia.

### 8. `SpeechBubble` is fixed at 237px, so it does not fill the row on either Session screen. Craft
- **Source:** critic-craft #2.
- **Evidence:** `src/components/SpeechBubble/SpeechBubble.tsx:329` `width: 237` (confirmed by the panel lead). In `D01` and `E01` the bubble ends at x≈338 against a 374 right margin. Figma `13728:15908` and `13673:13915` use `flex-[1_0_0]`.
- **Case:** In `E01` the Success message wraps to 5 lines with an orphan "one." and the bubble is ≈199px tall against ≈146px in Figma. The right edge no longer lines up with the scrubbers and the prompt. 237 is a Pixel-frame literal; this frame is 390px wide.
- **Fix:** Make the bubble body `flex: 1 1 0; min-width: 0` (Figma's behaviour) and drop `shrink-0` and `width: 237`. Re-run the `D01`, `E01` and `C12` screenshots against Figma.

### 9. Session content sits about 16px higher than Figma, and the header gap is a literal. Craft
- **Source:** critic-craft #3.
- **Evidence:** `session/page.tsx:648` `gap: 24`, and `:668-691` (Skip carries a 48px absolutely-positioned tap span, so the "Topics / Skip" row collapses to text height). Measured against Figma (1x, ±2px, by eye): "Topics 2 of 4" y≈119 vs 128, prompt line 1 at 161 vs 178, first scrubber 224 vs 240, bubble top 256 vs 272. Bottom controls match.
- **Case:** Figma `middleContent` uses `gap: space-400` (16px) and a 48px Skip row. The build uses an untokened 24px and a shorter row, shifting the middle stack up. The prompt also breaks differently ("out loud," on line 1 vs Figma's "out / loud"); cause not verified.
- **Fix:** Give the row `min-height` of the 48px token and set the stack gap to `var(--size-space-400)`. Keep the Skip hit area inside that 48px row instead of an absolute child.
- **Confidence:** offsets are by eye from 1x renders. Treat the direction as reliable and the magnitudes as ±2px.

### 10. StudyPlan drifts from Figma, and no pixel diff against Figma is kept for any of the four screens. Craft
- **Source:** critic-craft #5.
- **Evidence:** `A01` vs Figma `13622:13162` (1x, by eye): "Section 1" divider y≈267 vs 278, Section 2 at 708 vs 719, card 585–677 vs 596–688, nav icons 790 vs 800, mascot x≈48–100 vs 66–130. Figma's card title has a double space ("Explain it  to Knowie", `whitespace-pre`); the build has one. `pixel-diffs.md` has no Figma pair; `INDEX.md` says none was made.
- **Case:** The roadmap block sits about 11px high, the mascot is smaller and offset, the nav bar sits higher. The rubric asks for a stated tolerance and kept diffs per built screen. There are none.
- **Fix:** Export the Figma frames at 2x, diff them against `A01`, `B01`, `D01`, `E01` at a stated tolerance, keep the diffs, then fix the header-to-roadmap gap and mascot offset. The mascot size is logged in `component-gaps.md`; the 16px horizontal offset is not.

### 11. State changes are not announced, and repeated labels are ambiguous. Accessibility
- **Source:** critic-ux #6.
- **Evidence:** `aria/E01.txt` and `aria/D01.txt` show only an empty `alert` (Next's route announcer) and no `aria-live` region. The prompt, "Not quite yet.", "Nice!" and "Ready to send" are plain `<p>`. Both scrubbers are named "Play recording". `aria/A01.txt` does not expose the bottom nav; whether it is a real control is not verified.
- **Case:** A screen-reader student who taps Send hears nothing, and the result appears silently. On `E01` they cannot tell attempt 1 from attempt 2.
- **Fix:** Wrap the result bubble and the `StatusIndicator` in `role="status"`. Label the scrubbers "Play first attempt" and "Play second attempt", with `aria-pressed` for playing.

### 12. The bevel shadow is an unbound `rgba()` literal on all four screens, and the gap note is misleading. System fidelity
- **Source:** critic-system #4.
- **Evidence:** live literals `Button.tsx:180`, `ButtonIcon.tsx:134`, `session/page.tsx:1307`, `page.tsx:359`, `TableCell.tsx:114` (`logs/grep-rgba-hsla.txt`). Figma's `get_variable_defs` on `13728:15886` returns `"Inset Edge/200": Effect(INNER_SHADOW, color: Black/300, offset: (depth-0, depth-negative-100)…)` and `"Black/300":"#0c0c0d26"` (as reported by the critic; the panel lead did not re-run the trace). `tokens/tokens.json` has `Black/100`, `Black/200`, `Black/400` and no `Black/300` (confirmed by the panel lead), but does have `depth/negative-100`. `component-gaps.md` has no entry for the `0.15` literal or the inset-edge effect.
- **Case:** Figma binds a named effect built from `Black/300`. The literal is `#000` at 15%, not `#0c0c0d` at 15%, so it does not even match the value. A Figma-versus-`tokens.json` disagreement is resolved silently. The `TableCell` divider (`rgba(255,255,255,0.1)`) is documented in `design-system.md` but not in `component-gaps.md`.
- **Fix:** Add a `component-gaps.md` entry naming the missing `Black/300` primitive and an inset-edge effect token (for example `depth/inset-edge`), then bind it. Leave the decision to Mia. Use `border/default` for the divider, which Figma shows at `#ffffff1a`.

### 13. StudyPlan's mascot is a different size from every other hero screen. Coherence, System fidelity
- **Source:** critic-system #3.
- **Evidence:** `page.tsx:306` `MascotSlot size="XL"` inside a 52×40 `overflow-hidden` box with `left: -6`. `A01` shows a cropped head only. Summary (`summary/page.tsx:295`) and Primer (`primer/page.tsx:153`) use `2XL`. `design-system.md` §1 lists 2XL (86px) for the study plan screens. `component-gaps.md` calls it an approximation.
- **Case:** The documented role is 2XL standby on hero screens. The literal box (`52`, `40`, `-6`, `45`, `64`) is a hand-tuned crop with no token.
- **Fix:** Ask Mia whether 86px needs a token. Until then use `size="2XL"`, the documented one, or name the crop as a gap. Do not invent the size.

### 14. `font-stretch: condensed` on Summary's StatBox contradicts a logged decision. System fidelity, Coherence
- **Source:** critic-system #5.
- **Evidence:** `summary/page.tsx:229`. `docs/sprint-context.md:22` logs "Use the Standard width (wdth 100) … everywhere, pinned as `font-stretch: normal`" (confirmed by the panel lead). `B01` shows visibly narrow numerals. `fontSize: 24`, `lineHeight: '20px'`, `fontWeight: 700` (lines 230–232) are also literals.
- **Case:** A settled decision, so the execution is attacked. It is the only condensed text on the four screens, and `component-gaps.md` explains the approximation without mentioning the conflict.
- **Fix:** Drop `fontStretch` and let the numeral inherit `normal`, or log the exception in `sprint-context.md` for Mia. Bind a real text style (`--type-scale-headline-m-*` or nearest) or name the gap.

### 15. Casing and other literal drift on the StudyPlan screen and in `TermResultList`. Coherence, System fidelity
- **Source:** critic-system #6.
- **Evidence:** `A01` and `page.tsx:266, 283, 291, 293, 294, 454, 456` in Title Case ("Grade Goal: A", "Section 1: Finding Ideas", "Choosing Subjects", "Mixed Media", "Artwork Planning"; confirmed present). `page.tsx:447` "1 OF 4"; Summary "SCORE" and "BLAZING" in caps. Literals in `page.tsx`: `fontSize: 48`, `marginTop: 45`, `padding: '0 48px'`, `131×5`, `borderRadius: 100`, `paddingBottom: 8`, `height: 34`. In `summary/page.tsx`: `borderRadius: 16`, `gap: 32/16/6`, `fontSize: 14` with `'Greed VF-TRIAL'` hard-coded (lines 368, 407).
- **Case:** CLAUDE.md says sentence case on every label. Most strings are Figma copy but were never flagged as exceptions. Several px values have token equivalents; the critic did not confirm which tokens exist.
- **Fix:** Log the Title Case labels as Figma-copy exceptions in `component-gaps.md`, or lower-case them. Replace px literals with the matching `--size-*` tokens where they exist; where Figma is the source of the literal, name it in the gaps file.

### 16. Console warnings on every processing path and on `/summary`. Structure
- **Source:** critic-craft #6 (second half).
- **Evidence:** `logs/console.json`: a Next `Image` warning for `thinking.svg` ("has either width or height modified, but not the other") on every processing state, and an LCP warning for `standby.svg` on `/summary`. Dev-mode warnings, not errors; `build` and `lint` exit 0.
- **Fix:** Add `style={{ width: 'auto', height: 'auto' }}` to the bare `thinking.svg` `<Image>` (`session/page.tsx:717`) and `loading="eager"` to the hero mascot on `/summary`.

### 17. Table row dividers are keyed to status, not position. Craft
- **Source:** critic-craft (basis for the Craft score, `TableCell.tsx:87,114`; not in its top-six).
- **Evidence:** `TableCell.tsx:114`. `SPEC.md` records the rule as position ("every row except the last") and records the component as still keyed to `status`. `B01` and `B04` look right only because the last row is Skipped or is overridden inline.
- **Case:** Correct on the fixed script, wrong for any list without a Skipped row. The rubric's Craft anchor names this rule.
- **Fix:** Key the divider to position in `TableCell`/`Table` and remove the inline override in `summary/page.tsx:375`. Judged from code only; not tested with another row list.

### Open questions for Mia (raised, not resolved by any critic)
- The Summary primary action. The rubric's Craft anchor reads "Continue as the primary action on Summary". The live build and Figma (per `design-system.md`, 2026-09-18) have "Review what you missed" as primary and "Continue" as secondary. Raised in passing by critic-ambition; no adversarial critic scored it, so the total is unaffected.
- The `percent` formula on Summary (finding 3).
- Whether 86px needs a mascot size token (finding 13).
- Motion duration and easing tokens (finding 7).
- Whether the Figma frames already carry 48px hit areas on Primary/S and `AudioScrubber` (finding 5).

---

## Blind spots, per critic (verbatim)

**critic-craft.** The Figma comparisons were by eye from 1x screenshots. I could not download the Figma PNGs to run a numeric diff, so the 11px and 16px offsets carry about ±2px of error. I did not open the Storybook MCP (it was unavailable), so component-prop claims are not verified. I did not compare `/summary` to its Figma frame or open the long-content or typed-path screens (INDEX.md says they were not captured). I did not open `hit-areas.md` or `contrast.md`. Real touch pressed behavior on a device, hover, and actual animation on the recording and processing screens could not be observed. `document.getAnimations()` would miss SMIL or `requestAnimationFrame` animation, but the grep of `src/` finds none. The row divider rule was judged from code only; the `B01` and `B04` screenshots happen to look right because the last row is `Skipped`.

**critic-ux.** I could not drive the app or open Storybook, so I have not verified any component claim. `/primer`, the mic-primer screen and its denied state were not captured, so the primer and denied-to-text rows are unverified. I did not open `SPEC.md`. I did not read `TableCell`, `ScoreBreakdown` or `Tag` source, so tag contrast rests on `contrast-per-state.json` and `tag-fills.json`. Keyboard focus order and real screen-reader output were not tested (only the accessibility-tree order). Hover and pixel-diff against Figma were not captured. The rendered contrast figures are sampled from glyph cores, so thin text can read slightly low. Whether the tap-through on the Skip child span works was not verified. The `?variant=all-recalled` summary and the failure paths on `/` (`A03`-`A06`) were only skimmed via the diff table, not opened.

**critic-system.** I could not reach Storybook, so I did not verify whether inline builds have library equivalents (the Redo `ButtonIcon`, the StudyPlan Redo, the `TextBlock` headline). The Redo pair are logged in `component-gaps.md`, so I left them unscored. I did not pixel-diff any screen against Figma and did not walk the loop, so mic and mascot positions are judged only from `C01`, `D01` and `E01` at rest. I traced only two nodes' variables. Not traced: the tag fills, `TermResultList` colours, `ScoreBreakdown` colours and the `StatBox` accents. A score of 5 could move up 1 to 2 points if those trace clean. I did not check `Primer` beyond its mascot size.

---

## critic-ambition's read (kept separate; not part of the total)

**Reach: 6 / 10.** Not part of the weighted total. Storybook was unreachable, so **all three proposals below are unverified**; props are taken from how the components are already used in `src/`. This critic is non-adversarial. It read `component-gaps.md` lines 1–169 of 280.

The retry screens show real craft in one place: the hint stays on screen and the student's first take is kept as history (`E01`, `D05`), and Summary's per-term copy looks ahead ("worth a real attempt next time it comes up", `B01-full`). The two moments that carry the brief's metrics are the safe ones: the study-plan card, which decides activation, is a generic CTA (`A01`), and Summary's headline, meant to give an earned "I know this" signal, is a fixed string (`src/app/summary/page.tsx:308`).

**What it is settling for**
1. **StudyPlan-notStarted, `/`.** The card says "Explain it to Knowie" with "Speak" and a "+20% exam score" chip (`page.tsx:319, 336, 385`, `A01`). It never says what the student will explain, though the roadmap above lists "Finding Ideas" and "Choosing Subjects" and the primer promises "Explain 4 topics from section 1" (`component-gaps.md:19`). The card is the entry to the activation metric and it sells a percentage, not a task.
2. **Summary, mixed default.** A fixed "Good session, Mia." (`summary/page.tsx:308`) over one unaided term of four, plus a hint, a reveal and a skip (`B01-full`). It is the headline a flawless run would nearly get. The brief says the signal "has to be earned rather than asserted".
3. **`resultHinted1Recalled`.** The bubble is titled "Nice!" with "Hint 1 of 2" (`session/page.tsx:725-726`, `E01`). The title is identical to the unaided result (`:821-822`), and the subtitle names a hint-ladder position rather than an outcome; "of 2" implies another hint on a terminal screen.
4. **`hinted2ReadyToSend`.** The bottom block is identical to the first-attempt ready-to-send (`D01`). Two unlabelled, identical waveform bars sit either side of the hint bubble, with nothing saying which is the first take. This is the highest-risk completion moment.

**Stronger patterns** (all copy-only; existing components; unverified)
1. **Earned headline** (`/summary`, mixed). Replace `summary/page.tsx:308` with copy built from the status counts that already drive the table, for example "1 on your own, 1 with a nudge.", and optionally set the primary `cta` at `:438` to name the open work ("Review 2 terms"). Same `--type-scale-headline-l-*` tokens. Needs Mia's sign-off that Figma's fixed string may vary, and a wrap check at 390px.
2. **Honest success label** (`resultHinted1Recalled`). Change the `SpeechBubble` `title` and `subtitle` at `session/page.tsx:725-726`, for example "Got it." / "Needed one hint", matching Summary's "Needed a hint" tag. Do not touch the unaided results at `:821`. Needs Mia to confirm the Figma frame's "Nice!" and "Hint 1 of 2" may be reworded.
3. **Card that names the section** (`/` notStarted). Change the title at `page.tsx:336` ("Explain Finding Ideas to Knowie") and/or the chip at `:319` ("4 topics from section 1"). Departs from Figma text, so Mia decides; a longer title may wrap beside Speak, so screenshot it first.

**Gaps I did not fill**
- The XP badge stays at 8 on `hinted2ReadyToSend` and `resultHinted1Recalled`, so no reward beat marks the result. Any change needs an XP-badge component and a motion spec; neither exists.
- The two waveform scrubbers on the retry screens have no attempt label. That would need an `audioScrubber` caption or label prop, and none is documented.

**Blind spot (critic-ambition).** I judged from still screenshots and source. I did not see motion, transitions or the real Figma frames, so some of what looks safe may be more considered in motion. The three proposals are copy-only edits, so they may under-reach if Mia's real question is structure. I had no Storybook access, so every component claim rests on existing usage in `src/`. My taste favors honest labels and specific copy, and the hinted-versus-unaided distinction may matter more to me than to students who just want to move on. Two things I saw but left to other critics: the XP badge reads 8 in the session but 4 on Summary, and Summary's primary button is "Review what you missed" where the brief says Continue.

---

## Method notes and limits

- **Captured with:** Playwright, headless Chromium, 390×844 at 2x, dark scheme, against the dev server on `:3000`. A fake audio device was used for the granted-mic path. Denied paths replace `getUserMedia` with a rejection. `npm run build`, `npm run lint` and `npm run check:tokens` all exited 0 (`logs/`).
- **Not done:** no pixel diff against the live Figma frames (Figma comparisons in findings 8–10 are by eye at 1x); no long-content run (the app shows no transcript and accepts no long term); Primer screens, typed paths on terms 3 and 4, hover, real screen-reader output and real touch were not captured.
- **Storybook MCP was unreachable for the whole run**, so no critic could confirm that a component or prop exists or is missing. Component claims in findings 1, 4, 6 and the ambition proposals are unverified for that reason.
- **Measurement caveats:** rendered contrast samples glyph cores, so thin text can read slightly low. Hit areas come from `elementFromPoint` on a 2px grid; below-the-fold elements were re-measured scrolled (`B06`). `getAnimations()` does not see `requestAnimationFrame` or SMIL; a grep of `src/` finds neither.
- **Blindness:** each critic's prompt named only the four screens, the rubric path, the evidence folder and its own dimensions. Each confirmed in its report that it received no score or other critic's output. This scorecard was written after all four reports were in, and is the only file here that combines them.
