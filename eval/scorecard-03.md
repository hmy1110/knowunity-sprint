# Scorecard 03

**Date:** 2026-09-20. **Rubric:** `eval/rubric.md` (now 7 dimensions, with Feedback honesty and a calibration table). **Evidence:** `eval/evidence-03/` (start at `INDEX.md`).
**Screens (same four):** `/`, `/summary`, `/session` hinted2ReadyToSend, `/session` resultHinted1Recalled.
**Run:** 78 states rendered at 390px dark, plus the four screens at 390×664, a scripted four-term honesty run and a `?review=1` run. Four critics in fresh, separate contexts (system, craft, ux, ambition). Each saw no scores and no earlier scorecard (the rubric's calibration table was allowed). Nothing fixed.

## Result

**Weighted total: 6.1 / 10.** `(3·6 + 3·7 + 3·6 + 3·6 + 2·7 + 2·4 + 1·7) / 17 = 104 / 17 = 6.12`. Old six-dimension formula, for comparison with run 2 (5.53): `96 / 15 = 6.4`.

**Gates: G1, G2, G4 fail on a literal run-wide reading. G3 passes.** On the four screens themselves, G1 and G2 pass.

| Dimension | Weight | Score | Critic | Basis |
| --- | --- | --- | --- | --- |
| System fidelity | 3 | **6** | system | `check:tokens` exits 0 and the 138-deviation baseline is disclosed. Five untagged `rgba(0,0,0,0.15)` bevels, Redo gap not named. |
| Coherence | 3 | **7** | system | Shared tokens, Steps row and AppBar. Seams: mascot XL on `/` and `/session` vs 2XL on `/summary`, three XP lightning copies. |
| Craft | 3 | **6** | craft | Matches the calibration row: no motion, no Pressed feedback, no Figma pixel diff. |
| UX judgment | 3 | **6** | ux | Hard constraints hold, every result has a next step. Denied mic silent, no live text route past term 1, reload loses progress. |
| Accessibility | 2 | **7** | ux | Contrast and hit areas clean on the four screens. Duplicate "Play recording" names, scrim states under 4.5:1. |
| Feedback honesty | 2 | **4** | ux | Mixed Summary matches the session log. The review run claims 4/4, XP 8 and "first try" for a term never attempted. |
| Structure | 1 | **7** | craft | Build, lint and `check:tokens` exit 0, no horizontal scroll in 82 states. Held by the 664px viewport and no safe area. |
| Ambition (not in total) | | **6** | ambition | Honest numbers under a generic voice. |

**Against run 2 (read carefully).** All 61 shared screenshots are pixel-identical to run 2. The only code change was commit `55d1f5f` (48px hit area on S buttons, static exam-score chip). Rubric anchors also changed (inert controls covered by the hotspot hint no longer cap UX, copy that matches Figma is exempt from casing drift). So the score rises (Coherence 5→7, UX 5→6, Accessibility 5→7) come mostly from the new rubric, not from a changed UI. The one real fix is G2 on `A01`.

## Gates

| Gate | Result | Evidence |
| --- | --- | --- |
| G1 Contrast | **Pass on the four screens. Fail run-wide.** | `contrast.md`: 12 rows under 4.5:1. Recording scrim (`C03`, `C09`, `C13`): XP "8" 2.77, "Not quite yet." 3.61, prompt and hint 4.45. Disabled Submit and "Switch to voice" 3.66 (`F07`). Disabled and scrim exemptions still arguable. |
| G2 Touch targets | **Pass on the four screens** (Speak, Review and the other S buttons now 48 tall). **Literal fail:** Redo on reference `A08` is 82×32 and the term 1 text input is 358×42. | `hit-areas.md`. The chip on `/` is now a non-interactive note. The mic button in every state was not judged. |
| G3 No raw hex | **Pass** | `logs/check-tokens.txt`, `EXIT=0`. Five `rgba()` literals outside G3's definition: `TableCell.tsx:114`, `Button.tsx:181`, `ButtonIcon.tsx:134`, `page.tsx:372`, `session/page.tsx:1283`. |
| G4 States differ | **Fail** | `pixel-diffs.md`: mic Idle vs Pressed and Primary Default vs Pressed on six pairs are all 0.000%. Loop states, result outcomes, mic Idle/Recording/Processing, voice vs text path and Primary Default vs Disabled pass. The four `tag` statuses were not verified by any critic. |

## Findings, ranked

1. **The review run's Summary claims more than happened.** Feedback honesty. `R07` shows 4/4, XP 8, pace 2:09 and "first try" for term 1, which was never attempted. The entry counter reads "Topics 2 of 4" with no stated scope (`review-log.txt`). Fix: derive rows, score and pace from recorded attempts, or label the run "Review of 3 topics".
2. **A denied mic is silent.** UX. `F09`, `F10`: no message, no route to text (`session/page.tsx:285-287`). Fix: an inline alert with a live "Type instead" and how to re-enable the mic. Check the `InlineAlert` docs first.
3. **"Type instead" and Skip are live only on term 1 and term 4, and reload loses the term.** UX. `F03`–`F06b`, `F01`, `F12`. The hotspot hint covers the inert taps under the new rubric, but no live route exists at term 2. Fix: wire them on every term, or hide them, and persist term and sub-state in `sessionStorage`.
4. **No Pressed feedback, no motion.** Craft, G4. Held-down pairs 0.000%, `C03-a` vs `C03-b` 0.000%, no running animations in any loop state. Fix: drive `state="Pressed"` from pointer-down, animate the recording waveform under `prefers-reduced-motion`. Motion durations need a token Mia has to choose.
5. **The fixed 844px frame does not fit a 664px viewport.** Structure. `D01-664`, `E01-664`: Send and Continue sit about 180px below the fold, and `A01-664` hides the bottom nav. No `safe-area` handling in `src/`. Fix: `100dvh` with a flexible middle and `env(safe-area-inset-bottom)`.
6. **System debt.** Five untagged bevel `rgba()` sites, Redo built inline with a "no variant" gap note, `LightningIcon` copied three times, mascot at XL 64px where `design-system.md` §1 says 2XL 86px. Fix: `[gap:bevel-shadow]` tags plus an entry, name the missing `buttonIcon` variant, move `LightningIcon` to `shared/icons.tsx`. Decisions are Mia's.
7. **Two "Play recording" buttons have the same name on `D01` and `E01`.** Accessibility. Fix: distinct aria-labels ("Play your first try", "Play your second try").

## Ambition (not scored in)

"Good session, Mia." sits over 25% and 1 of 4 (`summary/page.tsx:325`), and a hinted pass reads "Nice!" with only a "Hint 1 of 2" subtitle (`session/page.tsx:702`). Proposed: a headline that owns the number ("1 of 4 on your own"), and "After a hint" as the bubble's subtitle. Both change Figma copy and need Mia's sign-off.

## Limits

No critic ran the app. No Figma pixel diff exists, so Craft cannot pass 7. Not captured: `?entry=text`, typing on terms 2 to 4, hover, long content. Two critics did not open every screenshot. Mia's calibration scores were visible to the critics through the rubric.
