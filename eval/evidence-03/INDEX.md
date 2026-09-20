# Evidence 03: raw renders and measurements

Captured against the running dev server (`http://localhost:3000`), headless Chromium, viewport 390x844 at 2x device scale, dark colour scheme (plus four states at 390x664, see below). No code was changed. Nothing in this folder is a score or an opinion; it is screenshots, measurements and command output. This is the third run, made after commit `55d1f5f` (every S button gets a 48px hit area; the exam-score chip on `/` is static) and `99c01af` (rubric only; adds section 7, Feedback honesty). `git diff --stat 9c5f1dd HEAD -- src` lists `src/app/page.tsx` and `src/components/Button/Button.tsx` only. Every state that differs from run 2 is listed in `CHANGES-SINCE-RUN-2.md`.

The capture scripts are run 2's, copied to `capture/` with paths (`evidence-02` to `evidence-03`) and the comparison baseline (run 1 to run 2) changed, plus the new sections described below. `capture/run-all.sh` gives the order: `capture.mjs`, `analyze.mjs`, `compare.mjs`, `logs.sh`, `build.sh` (last), `changes-md.mjs`. In this run `logs.sh` was run a second time after two lint findings in the capture scripts were fixed (the lint log is from that second run).

## Capture conditions

Same as run 2, unchanged:

- Mic path: Chromium fake audio device, permission granted. Denied-mic states replace `navigator.mediaDevices.getUserMedia` with a rejection (`NotAllowedError`).
- The Next.js dev-tools badge is hidden with CSS in screenshots. Console output was captured separately (`logs/console.json`).
- `HotspotHints` flashes outlines for about 0.75 s after a tap on a non-live target. Shots named `*-settled` were taken 1.3 s after the tap.
- "Pressed" shots hold the mouse button down on the control, then slide off so no click fires.
- Recording shots: `C03-a` 0.9 s and `C03-b` 2.2 s after the mic tap; processing shots about 0.3 s after Send; result shots after the Continue or Try again control appears plus 0.7 s.
- Every state was reached by driving the real UI (taps, the fake microphone, reloads). No state was injected.
- `A07` and `A08` (`StudyPlan-inProgress`, `StudyPlan-finish`) are reference only, for comparing the Speak / Review / Redo buttons.
- Same 61 ids as run 2 (59 from run 1, plus `X01`, `X02`).

## New in run 3

| Ids | What | Files |
| --- | --- | --- |
| `H01` to `H06` | Feedback-honesty run (rubric section 7): one real session on `/session` driven through all four terms as the app scripts them. Term 1: one voice attempt, Send (result shows "Nice!" / "Unaided"). Term 2: one voice attempt, Send (result "Not quite yet." / "Hint 1 of 2"), Try again, one voice attempt, Send (result "Nice!" / "Hint 1 of 2"). Term 3: "I don't know" (result "Here's the answer." / "Revealed"). Term 4: Skip. `H06` is the Summary reached at the end (viewport + full page). | `screens/H0*.png`, `logs/session-log.txt` |
| `R01` to `R07` | `?review=1` entry and run. `R01` is the first screen (counter text "Topics 2 of 4"), then a real voice attempt at each of terms 2, 3, 4 with `R02` to `R06`, ending at `/summary?variant=all-recalled` (`R07`). | `screens/R0*.png`, `logs/review-log.txt` |
| `A01-...-664`, `B01-...-664`, `D01-...-664`, `E01-...-664` | The four screens under review at a short viewport, 390x664 at 2x (screenshots are 780x1328), each with a `-full` page shot. Ids: `A01-studyplan-notStarted-default-664`, `B01-summary-mixed-default-664`, `D01-t2-Hinted1-readyToSend-664`, `E01-t2-Hinted1-recalled-664`. Measured scrollHeight / clientHeight: 844 / 664, 1216 / 664, 844 / 664, 844 / 664; scrollWidth equals clientWidth (390) in all four. | `screens/*-664*.png` |

`logs/session-log.txt` holds, per step, the action, the screen reached and every visible text line in DOM order; the final section repeats the Summary's visible text. `logs/review-log.txt` does the same for the review run and lists any visible text line matching "N of M". Neither file interprets the text against the Summary. The 664 states and the H and R states have no run 2 twin, so they are not in `CHANGES-SINCE-RUN-2.md`; they are in `manifest.json`, `contrast.md`, `hit-areas.md` and `structure.md`.

## The four screens under review, and the ids that show them

| Screen | Primary id | Related ids |
| --- | --- | --- |
| StudyPlan-notStarted (`/`) | `A01-studyplan-notStarted-default` (+ `-664`) | `A02` Speak held down, `A03` kebab tap, `A04` topic-node tap, `A05` bottom-nav tap, `A06` `?state=bogus`, `A09` Speak destination (`/primer`) |
| Summary (`/summary`) | `B01-summary-mixed-default` (+ `-full`, `-664`) | `B04` `?variant=all-recalled`, `B05` `?variant=bogus`, `B02b` / `B03b` buttons held down at bottom of page (baseline `B02`), `B06` scrolled to bottom, `B07` to `B09` destinations of Back / Continue / Review, `B10` and `H06` reached from a real session run, `B01-tag-<status>` crops of the four status tags |
| Learning-topic 2-result-Hinted1-ready to send (`/session`, sub-state `hinted2ReadyToSend`) | `D01-t2-Hinted1-readyToSend` (+ `-full`, `-664`) | `D02` Resume tap, `D03` Send held down, `D04` Redo held down, `C13` the recording that precedes it, `F11` Redo result, `F12` reload here |
| Learning-topic 2-result-Hinted1-recalled (`/session`, sub-state `resultHinted1Recalled`) | `E01-t2-Hinted1-recalled` (+ `-full`, `-664`) | `E02` Continue held down, `D05` the processing state that precedes it, `F01` reload here, `F02` Close X pressed on Hinted1, `H03` the same state in the honesty run |

## Loop context

`C01` term 1 idle, `C02` mic held down, `C03-a` / `C03-b` recording 0.9 s and 2.2 s in, `C04` ready to send, `C05` after Redo, `C06` processing, `C07` result Recalled, `C08` term 2 idle, `C09` recording, `C10` ready to send, `C11` processing, `C12` result Hinted1 (`C12b` "I don't know" tap), `C13` Hinted1 recording, `C17` term 3 idle, `C18` term 3 result Revealed, `C19` term 4 idle.

## Failure paths

Same as run 2: `F01` reload at Hinted1-recalled, `F02` Close X at Hinted1, `F03` to `F06b` term 2 "Type instead" (the tap changes nothing; input/textarea count 0, Submit count 0), `F07` / `F08` and `X01` / `X02` term 1 typing, `F09` mic denied at term 1, `F10` mic revoked at "Try again", `F11` Redo from Hinted1 ready-to-send, `F12` reload at Hinted1 ready-to-send.

## Files

| File | What it is |
| --- | --- |
| `screens/<id>.png` | Viewport screenshot (780x1688; the `-664` ids are 780x1328). `-full.png` = full-page. `-tab1.png` = first Tab focus. |
| `gray/<id>.png` | The same screenshot in greyscale. |
| `manifest.json` | id, group, route, description, file paths for every state (78). |
| `pixel-diffs.md`, `measure/pixel-diffs.json`, `diffs/` | Pair-wise pixel diffs, RGB and luminance-only. The pair list is run 2's (67 pairs). Tolerance 8 per channel. |
| `CHANGES-SINCE-RUN-2.md`, `measure/run-comparison.json`, `diffs/vs-run2/` | Each of the 61 shared states compared with its run 2 twin by pixel diff and by measure JSON. `diffs/vs-run2/` is empty because all 61 screenshots are pixel-identical to run 2 (0 differing pixels at tolerance 8; full-page twins included). |
| `contrast.md`, `measure/contrast-per-state.json` | Text contrast per text run, two methods (see file header). |
| `hit-areas.md`, `measure/hit-areas.json` | Tappable area of every interactive element, plus native buttons with no click handler. |
| `structure.md` | Scroll width vs client width and scroll height per state. |
| `measure/<id>.json` | Per-state raw data: interactive elements, text runs, animations running, tab order where captured. |
| `aria/<id>.txt` | Accessibility-tree snapshot per state. |
| `measure/R-reduced-motion-animations.json` | Running Web Animations at each loop state, with and without `prefers-reduced-motion`. |
| `measure/submit-default-vs-disabled.json` | Crop diff of the Submit button, Default (`X02`) vs Disabled (`F07`), both on term 1. |
| `measure/tag-fills.json`, `measure/B01-tag-rects.json` | Fill colour and luminance of the four status tags, pairwise ratios, and the tag boxes used for the crops. |
| `measure/capture-notes.json`, `measure/submit-box-t1.json` | Term 2 "Type instead" counts; Submit box used for the crop pair. |
| `logs/session-log.txt`, `logs/review-log.txt` | The honesty run and review run text logs (see above). |
| `logs/check-tokens.txt`, `logs/lint.txt`, `logs/build.txt` | Command output with exit codes. |
| `logs/grep-*.txt` | Greps over `src/` (excluding `*.stories.*` and `*.mdx`) for `rgba(` / `hsla(`, hex on non-comment lines and on every line, `var()` fallbacks, `--color-primitives-` reads. |
| `logs/console.json` | Console warnings and errors across the run. |
| `logs/dev-server-after-build.txt` | HTTP status of `http://localhost:3000/` right after `npm run build`. |
| `capture/` | The scripts that produced everything above. |

## Command results

| Command | Exit code | Note |
| --- | --- | --- |
| `npm run check:tokens` | 0 | "No token rule violations in src/." 138 grandfathered deviations reported (run 2: 138). |
| `npm run lint` | 0 | No warnings. |
| `npm run build` | 0 | Run after all captures. `http://localhost:3000/` returned 200 afterwards, and `/session`, `/summary`, `/primer` returned 200. The dev server was not restarted. |
| grep `rgba(` / `hsla(` | 0 | 16 matching lines (run 2: 16). |
| grep hex, non-comment lines | 0 | 2 matching lines (run 2: 2). |
| grep `var()` fallback | 1 | 0 matches. |
| grep `--color-primitives-` | 1 | 0 matches. |

## Measured differences from run 2 (details in `CHANGES-SINCE-RUN-2.md`)

- All 61 shared screenshots are pixel-identical to run 2.
- `Speak` (8 states) and `Review` (2 states): own box 32px tall in both runs; effective hit height 32 to 48.
- The exam-score chip (`🔥 +20% exam score`, 11 states): aria role `button` to `note`; effective hit 104x20 to 0x0. The DOM tag stays `button`.
- Elements with effective hit under 44x44: run 2 24 rows over 5 sizes, run 3 15 rows over 3 sizes. Run 3 list: the chip (0x0), `Redo` on `A08` (82x32), the term 1 text input (358x42).
- Rows under 4.5:1 contrast: 12 in each run, none added or removed.
- Console: 21 warnings, no errors (run 2: 17 warnings). All are Next.js image warnings.

## Limits of these measurements

- Contrast "rendered" samples the glyph core from the screenshot, so thin or small text can read slightly low. "Nominal" follows CSS colours down the DOM chain and does not see scrims, overlays or images.
- Hit areas come from `elementFromPoint` on a 2 px grid. Elements below the fold cannot be hit-tested at the scroll position of the capture and are flagged `offscreen` in the JSON.
- Animation counts come from `document.getAnimations()`, not `requestAnimationFrame` or SVG SMIL.
- No pixel diff against the live Figma frames was made.
- The state names in `logs/session-log.txt` ("Recalled path", "Hinted path", "Revealed path") come from the driving script and the controls on screen, not from an app-exposed state value.

## Not captured

- The Primer screens beyond their load state (`A09` is the destination of Speak only); `/session?entry=text`.
- The typed path on terms 2, 3 and 4.
- The `-664` viewport for any state other than the four named ones; `H` and `R` states at 664.
- The 0.75 s hotspot-hint overlay itself; only settled shots exist.
- Long-content stress, real screen-reader output, hover states, a non-fake microphone, the OS mic permission prompt.
- Anything below the fold in states with no `-full` screenshot has no rendered contrast figure (`n/a` in `contrast.md`); it does have a nominal figure.
- A session with a different outcome order than the app's scripted one (Recalled, Hinted, Revealed, Skipped by term index); the app does not offer one.
