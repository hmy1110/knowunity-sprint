# Scorecard 05

**Date:** 2026-09-23. **Rubric:** `eval/rubric.md` (7 dimensions). **Evidence:** `eval/evidence-05/` (script `capture/capture.mjs`).
**Scope:** the whole free voice/type flow: `/`, `/primer`, `/session`, `/summary`, `/summary?variant=review`. Disabled controls are not evaluated (Mia, 2026-09-21), so no disabled control counts against contrast, hit area or Accessibility in this run.
**Run:** 70 states rendered at 390px dark by driving the real UI (fake mic): voice run, typed run, review run, early close, Redo/Resume, denied mic mid-session, denied mic at the Primer, a `prefers-reduced-motion: reduce` pass, nine Summary variants covering every headline tier and both percent captions, and a 390x664 viewport. Four critics (system, craft, ux, ambition) in fresh contexts, each blind to scores and to every earlier scorecard. Nothing was fixed after the run.
**The 7-point cap is gone.** Scorecard-04 capped every dimension at 7 because its critics could not verify anything by rendering or measuring. This run captured screenshots, per-state measurement JSON, accessibility trees and four command logs first, so rubric rule 2 is satisfiable and three dimensions scored 8. That is the single biggest reason this total is not comparable to 04's.

## Result

**Weighted total: 6.6 / 10** — as graded. Four findings have been fixed since (see "Fixed and verified after this run"), including both that capped UX judgment; none of those dimensions has been re-graded, so the total below is the honest one and is stale in the build's favour. `(3·7 + 3·8 + 3·7 + 3·5 + 2·5 + 2·7 + 1·8) / 17 = 113 / 17 = 6.65`.

| Dimension | Weight | Score | 04 | Critic | Basis |
| --- | --- | --- | --- | --- | --- |
| System fidelity | 3 | **7** | 6 | system | `check:tokens` EXIT=0, baseline disclosed at 135. One binding traced to Figma's own bound variable (node `13622:16490`). Held at 7 by three 9-anchor misses: five untagged `rgba()`, 124 px-literals, one stale ledger entry. |
| Coherence | 3 | **8** | 6 | system | One scaffold, tokens and voice across five routes; nine Summary variants read as one screen. A 9 with two named flaws: the mic and mascot move inside the loop, and the apostrophe glyph drifts within single screens. |
| Craft | 3 | **7** | 6 | craft | Four loop states differ by shape, layout, label and chrome, not hue; processing is a designed calm state. Held at 7 by zero motion anywhere, an invisible Primary Pressed, and an 8px rhythm break on one result state. |
| UX judgment | 3 | **5 at the time of grading** | 7 | ux | Capped by the rubric's §4 clause ("a control that looks live but does nothing counts as missing and caps this at 5"). **Both triggering controls are now fixed** (2026-09-23, both verified live): `/`'s "More options" kebab renders as decoration, and a denied mic inside `/session` reaches a real screen. **The cap no longer applies, but this dimension has not been re-graded** — the 5 is what the critic scored against the code as it was captured, and it stands in the total below until a critic re-reads it. |
| Accessibility | 2 | **5** | 6 | ux | **Capped by rubric §5** ("a failed G1 or G2 caps this at 5"). Both failed, on measurement. The cap does **not** lift from the 2026-09-23 field fix: G1 stands as accepted-not-fixed and G2 still fails at 664. Tab order matched visual order on all five walked states and every icon-only control is named. |
| Feedback honesty | 2 | **7** | 6 | ux | Every headline, percent, SCORE, XP and pace across nine Summary variants traced to the record. Two named flaws: BLAZING rewards skipping, and `/session`'s XP badge and `/summary`'s XP mean different things. |
| Structure | 1 | **8** | 6 | craft | `build`, `lint`, `tsc`, `check:tokens` all EXIT=0; zero console errors and zero hydration warnings across 70 states; no horizontal scroll and nothing offscreen in any of the 68 states at 390x844. A 9 with one flaw: no safe-area handling. |
| Ambition (not in total) | | **7** | 6 | ambition | Two routes have a real point of view; elsewhere it reproduces the frame and stops. |

**Gates**

| Gate | Result | Basis |
| --- | --- | --- |
| G1 Contrast | **Fail (measured)** | Under the recording scrim (`B02`, `B08`, `I03`): prompt body text 18px/400 at **4.45:1**, below the 4.5 floor; XP badge `8` 18px/600 at **2.77:1** (18px semibold is not WCAG large text). `logs/scrim-contrast.json`, sampled from rendered pixels per `logs/scrim-contrast-method.md`, whose method validated to within 0.12 against a known-correct non-scrim state. Everything not under the scrim passes: all 28 composited ratios below 4.5 belong to disabled controls, which are excluded. **Scorecard-04 estimated this pair at ~4.45 by hand and left the gate unresolved; it is now measured.** **Accepted, not fixed** (Mia, 2026-09-23): the scrim is the existing design system's — see `component-gaps.md`. The gate still reports what was measured. |
| G2 Touch targets | **Fail — one of its two causes fixed after the run** | The typed-answer field measured `effectiveHit` **358x42** in all four typed states (`measure/D01,D02,D07,D10`) — 2px under the rubric's hard floor of 44, on the one control a student who cannot speak must use. **Fixed and re-measured live at 358x48** (see below). The gate still fails on its second cause: at 390x664 the mic, both text fallbacks and both Summary buttons report `effectiveHit: null` / `offscreen: true`. Everything else clears 44: close X 48x48, Skip 56x48, mic 78x80, Tertiary/S 114x48 and 108x48, Redo/Send/Resume 56x56. |
| G3 No raw hex | **Pass** | `logs/check-tokens.txt`: no violations, EXIT=0 — which is the gate's literal definition. The system critic declined to certify it over five untagged `rgba()` literals; the rubric's own G3 note says those *do not* fail this gate and count against System fidelity instead, which is where they are scored. |
| G4 States that should differ | **Fail (measured)** | Primary `Default` vs `Pressed` is **0.00% different** at S, M and L (`eval/evidence-03/addendum-g4-component-states/pixel-diffs.md:7,9,11`, tolerance 8) — `interactive/pressed` is 10% white over a near-white fill. Tertiary and both ButtonIcon variants are identical too. Everything else passes: the four loop states, the three result outcomes, both processing screens, the four MicButton states (8.15–44.91%), the four tag statuses, and Default vs Disabled (23.01–33.08%). **Scorecard-04 recorded this as "not formally verified"; it is now a measured fail.** |

`build`: EXIT=0 (never run before this scorecard). `lint`: 0 errors, 8 warnings, all in `eval/**/capture` scripts. `tsc --noEmit`: clean. `check:tokens`: EXIT=0, 135 grandfathered deviations disclosed.

## Read the movement correctly

**The total rose from 6.2 to 6.6 while two gates went from "unresolved" to "failed".** Both facts come from the same cause and neither is a change in the work:

- **Nothing regressed.** No dimension dropped because the build got worse. UX judgment and Accessibility fell because this run *measured* things scorecard-04 could only estimate or skip. The same code would have failed G1, G2 and G4 in the 04 run if 04 had measured them.
- **Nothing was inflated.** Coherence, Craft and Structure rose because rendered and measured evidence finally existed to satisfy rubric rule 2. Under 04's conditions they would still have been capped at 7 no matter how good they were.
- **Two dimensions are held down by a cap, not by their own anchors.** UX judgment at 5 and Accessibility at 5 are both the rubric's own ceiling clauses firing, each on a small number of triggering findings rather than on the dimension's own quality.
  - **UX judgment** was capped by two inert controls, and **both were fixed on 2026-09-23**, after grading. The cap's trigger is gone; the score is not, because a score is a critic's reading and no critic has re-read it. On the anchors this dimension would now be argued on its own merits — every triage-table Must row reachable, no dead end, both failure paths designed — rather than held at a ceiling. Re-grading it is the single largest move left: each point is worth **+0.18 on the total**, and the gap between a capped 5 and an uncapped score is plausibly two or three of them.
  - **Accessibility** is capped by G1 and G2. Its most actionable half is now **closed** (the field, 42 → 48), but the cap does not lift: G1 stands as accepted-not-fixed by design-system decision, and G2 still fails at 664. On the current decisions this cap only lifts if the 664 frame height changes *and* Mia revisits the scrim — so treat Accessibility 5 as the settled score for this build, not as pending work.
- **Today's copy work is scored, and it scored well.** Feedback honesty 6 → 7, with the review Summary's re-scoped caption and row titles named as the reason. The ambition critic judged the same change "good, disciplined work" that "raises honesty, not reach" — a fair read: it stops the screen over-claiming, it does not make it say anything new.

**Not like for like with scorecard-04** on two independent axes: 45 states vs 70, and a hard 7-cap vs none. Compare the findings, not the numbers.

## Independently confirmed

Two findings were reached by two critics working blind to each other, which raises confidence well above a single report:

- **A denied mic inside `/session` does nothing.** `src/app/session/page.tsx:306-308` swallows it. `screens/F04-mic-denied-after-tap.png` is pixel-identical to idle and `aria/F04...txt` lists the same nodes. Both critics noted the prototype already renders a designed denied state one route over (`screens/J02`), which is what makes this count against the build rather than being an unbuilt gap.
- **At a 664-tall viewport `/session` and `/summary` lose their only primary action.** The frame is a literal `height: 844` with `overflow-hidden` at `src/app/page.tsx:227`, `session/page.tsx:740`, `summary/page.tsx:272`. Both proposed the same fix, `height: min(844px, 100dvh)`. Neither could confirm whether a whole-page scroll rescues the controls — the capture never scrolled the window.

## Verified by hand after the reports

Each of these was re-checked directly, not taken on the critic's word:

- Typed field `effectiveHit` 358x42 across `D01`, `D02`, `D07`, `D10` — confirmed.
- `height: 844` hard-coded in all three route files — confirmed.
- `/` renders `AppBar variant="rightIconButtonOnly" rightLabel="More options"` with no `onRightClick` (`src/app/page.tsx:230`), producing an enabled, focusable, announced `<button>` with no handler — confirmed. CLAUDE.md: a control that does nothing is a defect.
- The 8px rhythm break: `session/page.tsx:832` gives `resultRecalled` `space-600` top padding and every other sub-state `space-400` — confirmed.
- Zero motion in `src/`: no `@keyframes`, no `animation:`, no `transition:`, no `prefers-reduced-motion` — confirmed. The reduced-motion run therefore proves nothing; there is nothing to reduce.
- Primary Default vs Pressed at 0.00% — confirmed in the diff table.
- `MascotSlot`'s `pose` is a documented 7-value enum with its own stories, and `amazed`/`confused`/`dazed`/`determined` all ship as SVGs, but `src/app/` uses only `approving` (x8), `standby` (x4) and `thinking` (x1) — confirmed.
- The rubric clauses driving both caps exist as quoted (`rubric.md:157`, `rubric.md:185`), and G2's floor is 44, not 48 (`rubric.md:267`) — confirmed.

## Findings, in priority order

1. ~~**A mic denial inside `/session` does nothing** — two critics, and the cap on UX judgment.~~ **Fixed 2026-09-23** by reusing `/primer`'s denied treatment whole; no new component. Verified live on both the first-run and hint-retry paths.
2. ~~**The typed-answer field is 358x42, 2px under the G2 floor**, on the accessibility fallback path.~~ **Fixed 2026-09-23**, re-measured live at 358x48 in both the first-attempt and retry fields. Its `outline: 'none'` on focus (`session/page.tsx`), which leaves a keyboard user no focus indicator (WCAG 2.4.7), is **accepted, not fixed** — the design system's own focus handling (Mia, 2026-09-23).
3. **The recording scrim puts body text below 4.5:1** (prompt 4.45, XP badge 2.77). The scrim darkens the text along with the field behind it, which is why the CSS-composited numbers look fine and the rendered pixels do not. **Accepted, not fixed** (Mia, 2026-09-23): the scrim is the existing design system's.
4. ~~**`/` ships an enabled, named, inert "More options" button** — the second half of the UX cap, and the pattern `SPEC.md:190` declares extinct.~~ **Fixed 2026-09-23**: rendered as decoration, verified live on all three study-plan states.
5. **Primary Pressed is invisible and never wired.** 0.00% pixel difference, and `Pressed` appears nowhere in `src/app/**`. Every CTA tap on the main path is silent. Secondary Pressed reads at 20.67–29.98%, so the system already proves the fix works.
6. **Nothing in the build moves.** All 70 `animations` arrays are empty. Sharpest instance: `SpeechBubble`'s own verbatim Figma component description says Loading is "three **animated** dots", and `SpeechBubble.tsx:112-116` freezes them on the reasoning that the static artboard shows equal opacity — a component description is a spec, an artboard is a still, so "Figma wins" was applied to the wrong artefact here. `tokens/tokens.json` has no motion group at all, so any duration would be an unbound literal until one exists.
7. **At 664 the primary action is off-screen** on `/session` and `/summary` — two critics.
8. **The typed path has no reveal escape.** Voice idle carries "I don't know" → Revealed; `typeInput` carries only Submit and "Switch to voice", so the student who cannot speak can only Skip, which shows them nothing. `typeResultRevealed` is already built.
9. **BLAZING rewards the student who tried least.** 0 of 4 renders **0:27**, 4 of 4 renders **1:20** (`logs/notes.json`). Skipped costs 4s, Recalled 20s (`recall-session.ts:103-110`), so the derivation is inverted against the brief's "overconfidence has to cost something". The decision to derive rather than time is settled; this is about the numbers it produces. Mia's call — the two Figma-confirmed readings (1:09 mixed, 2:09 review) constrain any change.
10. **No safe-area handling.** No `env(safe-area-inset-*)` anywhere, no `viewport` export in `layout.tsx`. `/session`'s "I don't know" ends 20px above the frame edge against a 34pt home indicator; `/summary`'s Continue ends 2px above it.
11. **Five untagged `rgba()` literals** (`Button.tsx:181`, `ButtonIcon.tsx:134`, `page.tsx:395`, `session/page.tsx:1262`, `TableCell.tsx:114`). Seven other deviations in this codebase do carry `[gap:]` tags, which makes these read as forgotten rather than deliberate. `TableCell.tsx:114` is the sharpest: `--semantic-color-border-default` resolves to exactly that value.
12. **124 px-literals equal to a token value**, four of them on `/summary`, the confirmed reference screen, beside correctly-bound siblings in the same file.
13. **Smaller:** `typeResultRecalled` hand-stacks two Buttons where `ButtonGroup` Vertical/L exists and its ledger reason is superseded; `TableCell.tsx:63-73` and `design-system.md` §5 still claim a tokens-vs-Figma drift that was resolved on 2026-09-19; `ScoreBreakdown.tsx:166` writes `borderRadius: 9999` while `:145` binds the token; the apostrophe glyph drifts within single screens, and `InlineAlert.tsx:100` and `session/page.tsx:1170` spell the same sentence two ways; two duplicated `STATUS_RANK` maps are a latent drift risk; `AudioScrubber` Playing still has no screenshot on disk; `layout.tsx` still ships the "Create Next App" title; the text input is 14px, so iOS zooms on focus.

## Fixed and verified after this run

- **A denied mic inside `/session` now reaches a real screen.** `src/app/session/page.tsx` gains a `micDenied` subState; the `catch` that swallowed the refusal now remembers where the tap came from and shows Primer-micDenied's own content inside this route's chrome (Mia, 2026-09-23, choosing whole-screen reuse over an inline alert). Rendered as a real branch, not an overlay, so the mic, Skip and the text fallbacks leave the DOM rather than sitting focusable behind it. Verified live on two paths: denial on a first-run idle tap (the `Steps` row is gone, the only controls are Close plus the two buttons) into "Continue with text" landing on that same term's typing screen; and denial on a hint retry, then granting, returning to the hint retry screen with its recording and "Try again" intact. The appBar keeps this run's real progress and XP rather than Primer's hardcoded 25 / 8. Logged as `[gap:session-mic-denied]`. **This was the last of the two findings capping UX judgment.**
- **`/`'s "More options" kebab renders as decoration, not a control.** `AppBar` gains `rightDecorative`; the icon renders `<span aria-hidden>` instead of `<button>`, same box and same glyph. Found by the ux critic as enabled, named, 48x48 and `hasOnClick: false` across seven captured states. Verified live at `/`, `/?state=inProgress` and `/?state=finish`: "More options" is gone from the button list and from the accessibility tree, the 48x48 wrapper carries `aria-hidden`, and each screen's tab order is now its one real action. Screenshot confirms the row is visually unchanged. Story `AppBar / Right Icon Decorative` sits next to the button version for comparison. Logged in `component-gaps.md`. **This is one of the two findings that capped UX judgment at 5; the other, the mic under a denied permission, is still open, so the cap has not lifted.**
- **The typed-answer field is 358x48, was 358x42.** `src/app/session/page.tsx`, a `minHeight` on the field's own wrapper, tagged `[gap:type-field-height]` and logged in `component-gaps.md`. Measured at 42 by the ux critic in all four typed states; re-measured live through the real typed flow at **358x48** on both the first-attempt and the retry field, and screenshot to confirm the placeholder still centres and nothing below it moved. This closes one of G2's two causes; the gate still fails on the other.

## Accepted, not fixed (Mia, 2026-09-23)

Recorded so the next reviewer does not re-raise them, and so the gate results above are read as measurements rather than as open work. Both are logged in `component-gaps.md`.

- **No focus indicator on the typed-answer field** (`outline: 'none'`, WCAG 2.4.7). The design system's own focus handling; a fix is a system-level decision, not a per-screen patch, and there is no `border/focus` token bound for it.
- **The recording scrim's contrast** (prompt 4.45:1, XP badge 2.77:1). The scrim is the existing system's.

G1 therefore stays **fail** and Accessibility stays capped at 5. A gate records what was measured; accepting a measurement does not change it.

## Where the critics reached (ambition, not scored)

- `/session`'s pre-answer states hold ~425px of empty column between the prompt (y=182) and the mic (y=687) — half the frame, on the screen that asks the student to talk into silence.
- Knowie wears `approving` on every result, including the red reveal. Four documented poses with shipped SVGs go unused.
- `/summary` is the same composition at 0% as at 100%; only a string and the digits move. The purple BLAZING badge glows either way.
- `/primer` carries all of the brief's activation number and shows neither a real term nor how long this takes. Proposed: render `TERMS[0].prompt` there through the same `MascotSlot` + `SpeechBubble` row `/session` idle already uses, so the two can never drift.

All three proposals use existing components and documented props, and all three diverge from what Figma draws — so they are Mia's call and need `component-gaps.md` entries, not silent adoption.

## Decided by Mia, not defects

Static XP goal 8, three XP lightning copies, "Good session, Mia." at 1 of 4 (Figma copy), the typed hinted/retry/revealed states having no Figma frame, reload restarting at term 1, the 1,500ms processing → result pace, the scripted-by-term-number outcome, and the review Summary keeping subset numbers while re-labelling what they count (2026-09-23).

## What this run cannot say

No pixel diff against Figma for any built screen — `eval/evidence-05/diffs/` is empty, so every "matches Figma" claim in the ledger is taken on trust except the one binding traced to node `13622:16490` and the handful of re-measured values. Whether a whole-page scroll actually rescues the off-screen controls at 664 was never exercised; the capture only scrolled `<main>`. No real-device tap on the 42px field (Chrome hit-tests it at 42; iOS may extend it). No VoiceOver rotor pass. No mid-term reload. No over-long term or three-line transcript. The mic's y-shift between idle and recording is untraced against Figma — the recording and processing frame node ids were not located, so it is genuinely unresolved whether Figma draws that shift or the build introduced it.
