# Scorecard 04

**Date:** 2026-09-21. **Rubric:** `eval/rubric.md` (7 dimensions). **Scope:** whole prototype, `/`, `/primer`, `/session`, `/summary`.
**Run:** three critics (system, craft, ux) in fresh, separate contexts, blind to scores. **Read-only: code and docs only, no screenshots, no rendered pixels, no Figma diff.** Every dimension is capped at 7 by that method. Ambition critic not run. Nothing fixed.
**Caller-verified:** `npm run check:tokens` 0 violations (135 grandfathered: color-fn 5, px-token 124, font-family 5, font-stretch 1). `npm run lint` 0 errors, 1 warning in `eval/`. `tsc --noEmit` clean.

## Result

**Weighted total: 6.2 / 10.** `(3·6 + 3·7 + 3·6 + 3·6 + 2·5 + 2·7 + 1·6) / 17 = 105 / 17 = 6.18`.
Scorecard-03 was 6.5 with screenshots. The two runs are not like for like: 03 had 78 rendered states, this run had none. Read the change as "not measured", not "regressed".

**Gates:** G3 pass (`check:tokens` exits 0). G1, G2, G4 **not verified** this run (no screenshots). Source shows no definite fail on G2 (48px hit children on Skip and close, 56px on mic and Redo).

| Dimension | Weight | Score | Critic | Basis |
| --- | --- | --- | --- | --- |
| System fidelity | 3 | **6** | system | Steps and Table match their Storybook docs, Steps 48px is tagged `[gap:steps-height]`. Five `rgba()` literals and `Table.tsx:77` `borderRadius: 16` carry no `[gap:]` tag. |
| Coherence | 3 | **7** | system | Mascot sizes, appBar and XP numbers follow documented roles. Three copies of the XP badge (Mia-approved). Stale entries in `component-gaps.md`. |
| Craft | 3 | **6** | craft | Recording is a static frame, no reduced-motion handling, state swaps are instant, inline Redo has no pressed style. Unchanged from 03. |
| UX judgment | 3 | **6** | ux | Hard constraints hold, no dead end after a hint. Silent mic failure mid-session. |
| Accessibility | 2 | **5** | ux | No `aria-live`, focus drops to body on state change, hand-estimated scrim contrast about 2.8:1 on "Hint 1 of 2". |
| Feedback honesty | 2 | **7** | ux | XP, SCORE and percent derive from the session. Hinted and Revealed count zero. |
| Structure | 1 | **6** | craft | Hydration guarded, but a blank flash until mount, fixed 844px frame, no safe area, `/primer` scaffold differs. |

## Findings, in priority order

1. **Silent mic failure.** `session/page.tsx:306-308` swallows a `getUserMedia` rejection; the comment says "no built destination for it". Tap does nothing and says nothing. Confirmed by reading the code. Open question for Mia: does Figma design a mid-session denied state? `/primer` has one. If not, this is a gap to name, not fill.
2. **No live region, focus loss.** No `aria-live` anywhere in `src/` (grep confirmed). The 1.5 s auto-advance (`session/page.tsx:539`) swaps screens silently.
3. **Scrim contrast.** Recording scrim `rgba(10,10,10,.5)` (`:1179-1181`) over `text/secondary`. Hand estimate about 2.8:1, **not measured**. Needs one screenshot and a contrast reading to confirm.
4. **Untagged deviations.** `rgba()` at `TableCell.tsx:114`, `Button.tsx:181`, `ButtonIcon.tsx:134`, `page.tsx:394`, `session/page.tsx:1250`; `Table.tsx:77` radius 16. Fix by tagging `[gap:]` plus a `component-gaps.md` entry, or ask Mia for tokens.
5. **Fixed 844px frame.** `session/page.tsx:735-736`, `summary/page.tsx:265-269`, `page.tsx:226-227`. Bottom actions fall below the fold at about 664px.
6. **Stale docs.** `component-gaps.md` (hotspot hint, "Skip wired only on term 4") and the CLAUDE.md script note describe the old fixed script. Not re-verified line by line.

## Judgment calls, not scored as defects

- **Empty typed submit**: Mia decided 2026-09-21 that Submit is disabled while the answer is empty. Applied on `typeInput` and `typeRetryInput` in `session/page.tsx`. Not screenshotted.
- **Reload restarts at term 1** (`:264-268`) and **progress not persisting**: by design.
- **Static XP goal 8**, **three XP lightning copies**: Mia-decided.
- **"Good session, Mia."** shows at 1 of 4 recalled. Figma copy, exempt.

## What this run cannot say

No pixels were seen, so: Recording, Pressed and Processing visuals, spacing, contrast, and hit areas are inferred from source. `ButtonIcon`, `AudioScrubber`, `SpeechBubble`, `Tag` and `/` (`page.tsx`) were not fully read by the UX critic. Storybook `test-run` was not run, and the earlier `skipDisabled` run at `component-gaps.md:352` timed out. **To turn 3 and the gates from "unverified" to graded, one screenshot pass over the changed states is needed.**
