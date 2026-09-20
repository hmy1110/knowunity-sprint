# Changes since run 2

Neutral list of every state whose render or behaviour differs between `eval/evidence-02/` (run 2) and this folder (run 3). Facts and numbers only. No scores, no opinions on whether a change is good.

Code between the two runs: commit `55d1f5f` (every S button gets a 48px hit area; the exam-score chip on `/` is static), plus `99c01af` which touches only `eval/rubric.md`. `git diff --stat 9c5f1dd HEAD -- src` lists `src/app/page.tsx` and `src/components/Button/Button.tsx` only. Run 3 uses the same 61 state ids as run 2 and adds ids listed in `INDEX.md` (`-664` short-viewport states, `H` honesty-run states, `R` review-run states); those have no run 2 twin and are not compared here.

## How the comparison was made

- **Pixel**: each shared screenshot compared with its run 2 twin (same viewport, 780x1688), per-channel tolerance 8. Diff images: `diffs/vs-run2/<id>.png` (red = changed pixel). Full-page twins are compared where both runs have one.
- **Measure**: `measure/<id>.json` of run 2 against run 3. Controls are matched by tag and name, text runs by their first 80 characters. Rects match within 0.15 px (controls) or 0.6 px (text); effective hit boxes within 2 px (the grid step). Raw result: `measure/run-comparison.json`.
- **Aria**: `aria/<id>.txt` compared line by line.
- **Noise floor**: the capture scripts are run 2's, with paths and baselines changed. As a check on the method, the states whose screenshots are pixel-identical to run 2 were also compared by measure: 61 states are pixel-identical and 50 of them have 0 measure differences (A01-studyplan-notStarted-default, A02-studyplan-notStarted-speak-pressed, A03-studyplan-kebab-tap-settled, A04-studyplan-topicnode-tap-settled, A05-studyplan-bottomnav-tap-settled, A06-studyplan-state-bogus, A07-studyplan-inProgress-REFERENCE, A08-studyplan-finish-REFERENCE, B07-summary-back-destination, B08-summary-continue-destination, F02-close-X-at-Hinted1).
- The effective hit box is read on a 2 px grid, so it can move by 2 px without the element moving.

## Summary by state

Pixel columns are the viewport screenshot vs run 2. "measure" is the number of differing measure items (controls + text runs + visible-text line). Full-page pixel column shows only where both runs have a full-page image.

| id | pixel rgb% | pixel luma% | changed box (css px) | full-page rgb% | measure items | common changes |
|---|---|---|---|---|---|---|
| A01-studyplan-notStarted-default | 0 | 0 | - | - | 4 | K01 K04 K02 K03 |
| A02-studyplan-notStarted-speak-pressed | 0 | 0 | - | - | 4 | K01 K04 K02 K03 |
| A03-studyplan-kebab-tap-settled | 0 | 0 | - | - | 4 | K01 K04 K02 K03 |
| A04-studyplan-topicnode-tap-settled | 0 | 0 | - | - | 4 | K01 K04 K02 K03 |
| A05-studyplan-bottomnav-tap-settled | 0 | 0 | - | - | 4 | K01 K04 K02 K03 |
| A06-studyplan-state-bogus | 0 | 0 | - | - | 4 | K01 K04 K02 K03 |
| A07-studyplan-inProgress-REFERENCE | 0 | 0 | - | - | 4 | K01 K02 K03 |
| A08-studyplan-finish-REFERENCE | 0 | 0 | - | - | 3 | K01 K02 K03 |
| A09-studyplan-speak-destination-primer | 0 | 0 | - | - | 0 | - |
| B01-summary-mixed-default | 0 | 0 | - | 0 | 0 | - |
| B02-summary-bottom-baseline | 0 | 0 | - | - | 0 | - |
| B02b-summary-review-pressed-scrolled | 0 | 0 | - | - | 0 | - |
| B03b-summary-continue-pressed-scrolled | 0 | 0 | - | - | 0 | - |
| B04-summary-all-recalled | 0 | 0 | - | 0 | 0 | - |
| B05-summary-variant-bogus | 0 | 0 | - | 0 | 0 | - |
| B06-summary-scrolled-bottom | 0 | 0 | - | - | 0 | - |
| B07-summary-back-destination | 0 | 0 | - | - | 4 | K01 K04 K02 K03 |
| B08-summary-continue-destination | 0 | 0 | - | - | 4 | K01 K02 K03 |
| B09-summary-review-destination | 0 | 0 | - | - | 0 | - |
| C01-t1-idle | 0 | 0 | - | - | 0 | - |
| C02-t1-idle-mic-pressed | 0 | 0 | - | - | 0 | - |
| C03-t1-recording-a | 0 | 0 | - | - | 0 | - |
| C03-t1-recording-b | 0 | 0 | - | - | 0 | - |
| C04-t1-readyToSend | 0 | 0 | - | - | 0 | - |
| C05-t1-after-redo | 0 | 0 | - | - | 0 | - |
| C06-t1-processing | 0 | 0 | - | - | 0 | - |
| C07-t1-resultRecalled | 0 | 0 | - | - | 0 | - |
| C08-t2-idle | 0 | 0 | - | - | 0 | - |
| C09-t2-recording | 0 | 0 | - | - | 0 | - |
| C10-t2-readyToSend | 0 | 0 | - | - | 0 | - |
| C11-t2-processing | 0 | 0 | - | - | 0 | - |
| C12-t2-resultHinted1 | 0 | 0 | - | - | 0 | - |
| C12b-t2-hinted1-idontknow-tap-settled | 0 | 0 | - | - | 0 | - |
| C13-t2-Hinted1-recording | 0 | 0 | - | - | 0 | - |
| D01-t2-Hinted1-readyToSend | 0 | 0 | - | 0 | 0 | - |
| D02-t2-Hinted1-readyToSend-resume-tap-settled | 0 | 0 | - | - | 0 | - |
| D03-t2-Hinted1-readyToSend-send-pressed | 0 | 0 | - | - | 0 | - |
| D04-t2-Hinted1-readyToSend-redo-pressed | 0 | 0 | - | - | 0 | - |
| D05-t2-Hinted1-processing | 0 | 0 | - | - | 0 | - |
| E01-t2-Hinted1-recalled | 0 | 0 | - | 0 | 0 | - |
| E02-t2-Hinted1-recalled-continue-pressed | 0 | 0 | - | - | 0 | - |
| F01-reload-after-Hinted1-recalled | 0 | 0 | - | - | 0 | - |
| C17-t3-idle | 0 | 0 | - | - | 0 | - |
| C18-t3-resultRevealed | 0 | 0 | - | - | 0 | - |
| C19-t4-idle | 0 | 0 | - | - | 0 | - |
| B10-summary-after-real-session | 0 | 0 | - | 0 | 0 | - |
| F02-close-X-at-Hinted1 | 0 | 0 | - | - | 4 | K01 K04 K02 K03 |
| F03-t2-idle-before-type | 0 | 0 | - | - | 0 | - |
| F04-t2-idle-idontknow-tap-settled | 0 | 0 | - | - | 0 | - |
| F05-t2-typeInput | 0 | 0 | - | - | 0 | - |
| F05b-t2-typeInput-filled | 0 | 0 | - | - | 0 | - |
| F06-t2-typeProcessing-0.5s | 0 | 0 | - | - | 0 | - |
| F06b-t2-typeProcessing-7s | 0 | 0 | - | - | 0 | - |
| F07-t1-typeProcessing | 0 | 0 | - | - | 0 | - |
| F08-t1-typeResultRecalled | 0 | 0 | - | - | 0 | - |
| F09-t1-mic-denied-settled | 0 | 0 | - | - | 0 | - |
| F10-t2-tryagain-mic-denied-settled | 0 | 0 | - | - | 0 | - |
| F11-Hinted1-ready-Redo-result | 0 | 0 | - | - | 0 | - |
| F12-reload-at-Hinted1-ready | 0 | 0 | - | - | 0 | - |
| X01-t1-typeInput | 0 | 0 | - | - | 0 | - |
| X02-t1-typeInput-filled | 0 | 0 | - | - | 0 | - |

## States with no difference

Pixel-identical to run 2 (rgb 0%) and no measure difference: A09-studyplan-speak-destination-primer, B01-summary-mixed-default, B02-summary-bottom-baseline, B02b-summary-review-pressed-scrolled, B03b-summary-continue-pressed-scrolled, B04-summary-all-recalled, B05-summary-variant-bogus, B06-summary-scrolled-bottom, B09-summary-review-destination, C01-t1-idle, C02-t1-idle-mic-pressed, C03-t1-recording-a, C03-t1-recording-b, C04-t1-readyToSend, C05-t1-after-redo, C06-t1-processing, C07-t1-resultRecalled, C08-t2-idle, C09-t2-recording, C10-t2-readyToSend, C11-t2-processing, C12-t2-resultHinted1, C12b-t2-hinted1-idontknow-tap-settled, C13-t2-Hinted1-recording, D01-t2-Hinted1-readyToSend, D02-t2-Hinted1-readyToSend-resume-tap-settled, D03-t2-Hinted1-readyToSend-send-pressed, D04-t2-Hinted1-readyToSend-redo-pressed, D05-t2-Hinted1-processing, E01-t2-Hinted1-recalled, E02-t2-Hinted1-recalled-continue-pressed, F01-reload-after-Hinted1-recalled, C17-t3-idle, C18-t3-resultRevealed, C19-t4-idle, B10-summary-after-real-session, F03-t2-idle-before-type, F04-t2-idle-idontknow-tap-settled, F05-t2-typeInput, F05b-t2-typeInput-filled, F06-t2-typeProcessing-0.5s, F06b-t2-typeProcessing-7s, F07-t1-typeProcessing, F08-t1-typeResultRecalled, F09-t1-mic-denied-settled, F10-t2-tryagain-mic-denied-settled, F11-Hinted1-ready-Redo-result, F12-reload-at-Hinted1-ready, X01-t1-typeInput, X02-t1-typeInput-filled.

Pixel-identical to run 2 with a measure difference (listed per state below): A01-studyplan-notStarted-default, A02-studyplan-notStarted-speak-pressed, A03-studyplan-kebab-tap-settled, A04-studyplan-topicnode-tap-settled, A05-studyplan-bottomnav-tap-settled, A06-studyplan-state-bogus, A07-studyplan-inProgress-REFERENCE, A08-studyplan-finish-REFERENCE, B07-summary-back-destination, B08-summary-continue-destination, F02-close-X-at-Hinted1.

## Changes that recur across states (K-list)

Each line is one measured change that appears in 4 or more states. Values are run 2 -> run 3.

- **K01** (11 states) control "🔥 +20% exam score": effectiveHit x 28->0, y 598->0, w 104->0, h 20->0
  - A01-studyplan-notStarted-default, A02-studyplan-notStarted-speak-pressed, A03-studyplan-kebab-tap-settled, A04-studyplan-topicnode-tap-settled, A05-studyplan-bottomnav-tap-settled, A06-studyplan-state-bogus, A07-studyplan-inProgress-REFERENCE, A08-studyplan-finish-REFERENCE, B07-summary-back-destination, B08-summary-continue-destination, F02-close-X-at-Hinted1
- **K02** (11 states) aria line only in run 2: - button "🔥 +20% exam score"
  - A01-studyplan-notStarted-default, A02-studyplan-notStarted-speak-pressed, A03-studyplan-kebab-tap-settled, A04-studyplan-topicnode-tap-settled, A05-studyplan-bottomnav-tap-settled, A06-studyplan-state-bogus, A07-studyplan-inProgress-REFERENCE, A08-studyplan-finish-REFERENCE, B07-summary-back-destination, B08-summary-continue-destination, F02-close-X-at-Hinted1
- **K03** (11 states) aria line only in run 3: - note: 🔥 +20% exam score
  - A01-studyplan-notStarted-default, A02-studyplan-notStarted-speak-pressed, A03-studyplan-kebab-tap-settled, A04-studyplan-topicnode-tap-settled, A05-studyplan-bottomnav-tap-settled, A06-studyplan-state-bogus, A07-studyplan-inProgress-REFERENCE, A08-studyplan-finish-REFERENCE, B07-summary-back-destination, B08-summary-continue-destination, F02-close-X-at-Hinted1
- **K04** (8 states) control "Speak": union y 625->617, h 32->48; effectiveHit y 626->618, h 32->48
  - A01-studyplan-notStarted-default, A02-studyplan-notStarted-speak-pressed, A03-studyplan-kebab-tap-settled, A04-studyplan-topicnode-tap-settled, A05-studyplan-bottomnav-tap-settled, A06-studyplan-state-bogus, B07-summary-back-destination, F02-close-X-at-Hinted1

## State-specific changes

Only changes not listed in the K-list. States with nothing extra are omitted.

### A07-studyplan-inProgress-REFERENCE

- control "Review": union y 625->617, h 32->48; effectiveHit y 626->618, h 32->48

### B08-summary-continue-destination

- control "Review": union y 625->617, h 32->48; effectiveHit y 626->618, h 32->48

## Behaviour: state pairs whose identical / not-identical result flipped

Pairs from `pixel-diffs.md` where run 2 and run 3 disagree on "the two screens are pixel-identical". A pair that stays identical or stays different is not listed (percent values for those moved because the Steps row and other components moved; see the tables above).

None.

## Behaviour: term 2 typing (F03 to F06b) and denied mic (F09, F10)

Facts from `measure/capture-notes.json`, the pixel-diff rows and the command logs:

- Term 2 "Type instead" tap: input/textarea count 0, Submit count 0 in run 3; run 2 recorded 0 and 0.
- Pixel-diff rows for the F03 to F06b group are in the flip table above (only rows whose identical / not-identical result changed are listed there) and in `pixel-diffs.md`.
- Denied mic at term 1 (`F09`) against `C01`: pixel-identical. Denied mic at Hinted1 "Try again" (`F10`) against `C12`: pixel-identical.

## Contrast rows (runs compared with the same two methods)

Rows under 4.5:1 on either number: run 2 12 (61 states), run 3 12 (78 states). Rows are keyed by state, first 80 characters of the text and font size.

In run 2 only (0):

none

In run 3 only (0):

none

In both runs, numbers moved (0):

none

## Hit areas

Elements with an effective hit under 44x44: run 2 24 state-element rows over 5 distinct element sizes; run 3 15 rows over 3 distinct sizes.

Under 44 in run 2 and not in run 3: Speak; Review.

Under 44 in run 3 and not in run 2: none.

Same-named controls whose size changed (own box or effective hit):

- 🔥 +20% exam score: own 102.8x20 -> 102.8x20; effective hit 104x20 -> 0x0 (11 states: A01-studyplan-notStarted-default, A02-studyplan-notStarted-speak-pressed, A03-studyplan-kebab-tap-settled, A04-studyplan-topicnode-tap-settled, A05-studyplan-bottomnav-tap-settled, A06-studyplan-state-bogus, A07-studyplan-inProgress-REFERENCE, A08-studyplan-finish-REFERENCE, B07-summary-back-destination, B08-summary-continue-destination, F02-close-X-at-Hinted1)
- Speak: own 89.6x32 -> 89.6x32; effective hit 90x32 -> 90x48 (8 states: A01-studyplan-notStarted-default, A02-studyplan-notStarted-speak-pressed, A03-studyplan-kebab-tap-settled, A04-studyplan-topicnode-tap-settled, A05-studyplan-bottomnav-tap-settled, A06-studyplan-state-bogus, B07-summary-back-destination, F02-close-X-at-Hinted1)
- Review: own 95x32 -> 95x32; effective hit 94x32 -> 94x48 (2 states: A07-studyplan-inProgress-REFERENCE, B08-summary-continue-destination)

Native buttons with no onClick, by name (states in run 2 / run 3):

- More options: 11 / 12
- 🔥 +20% exam score: 11 / 12
- Skip: 40 / 52
- Type instead: 14 / 19
- I don’t know: 19 / 24
- Resume: 6 / 7
- Tap to speak: 2 / 3
- Switch to voice: 1 / 1
- Play recording: 0 / 3

## Structure

scrollHeight and scrollWidth are the same in every shared state; no horizontal scroll in either run.

## Animations

See `measure/R-reduced-motion-animations.json`. Run 2: 0 running animations across the 10 loop states without the preference, 0 with it. Run 3: 0 running animations across the 10 loop states without the preference, 0 with it. Per-state `animations` arrays in `measure/<id>.json`: 0 shared states differ in count.

## Command logs

| log | run 2 | run 3 |
|---|---|---|
| check:tokens exit | EXIT=0 | EXIT=0 |
| lint exit | EXIT=0 | EXIT=0 |
| build exit | EXIT=0 | EXIT=0 |
| grep-rgba-hsla.txt matching lines | 16 | 16 |
| grep-hex-raw.txt matching lines | 2 | 2 |
| grep-var-fallback.txt matching lines | 0 | 0 |
| grep-primitives.txt matching lines | 0 | 0 |
| check:tokens summary lines | No token rule violations in src/. / Known deviations still unmarked (grandfathered in scripts/check-tokens.baseline.json): 138 (color-fn 5, px-token 127, font-family 5, font-stretch 1). | No token rule violations in src/. / Known deviations still unmarked (grandfathered in scripts/check-tokens.baseline.json): 138 (color-fn 5, px-token 127, font-family 5, font-stretch 1). |

### Console warnings and errors

- warning: Image with src "/images/standby.svg" was detected as the Largest Conte: run 2 7, run 3 8
- warning: Image with src "http://localhost:3000/images/thinking.svg" has either : run 2 10, run 3 13
