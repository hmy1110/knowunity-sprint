# Evidence 02: raw renders and measurements

Captured against the running dev server (`http://localhost:3000`), headless Chromium, viewport 390x844 at 2x device scale, dark colour scheme. No code was changed. Nothing in this folder is a score or an opinion; it is screenshots, measurements and command output. This is the second run, made after commits `c807145` (MicButton, SpeechBubble, Steps, InlineAlert, AudioScrubber synced to Figma) and `8bac949` (term 2 has no typed-answer entry). Every state that differs from run 1 is listed in `CHANGES-SINCE-RUN-1.md`.

The capture script is saved in `capture/` (run 1's was lost). `capture/run-all.sh` gives the order: `capture.mjs`, `analyze.mjs`, `compare.mjs`, `logs.sh`, `build.sh` (last), `changes-md.mjs`.

## Capture conditions

- Mic path: Chromium fake audio device, permission granted. Denied-mic states replace `navigator.mediaDevices.getUserMedia` with a rejection (`NotAllowedError`).
- The Next.js dev-tools badge is hidden with CSS in screenshots. Console output was captured separately (`logs/console.json`).
- `HotspotHints` (a prototype overlay) flashes outlines for about 0.75 s after a tap on a non-live target. Shots named `*-settled` were taken 1.3 s after the tap, after the overlay has gone.
- "Pressed" shots hold the mouse button down on the control, then slide off so no click fires.
- Recording shots: `C03-a` 0.9 s and `C03-b` 2.2 s after the mic tap; processing shots about 0.3 s after Send; result shots after the Continue or Try again control appears plus 0.7 s.
- Every state was reached by driving the real UI (taps, the fake microphone, reloads). No state was injected.
- The two screens `StudyPlan-inProgress` and `StudyPlan-finish` are rendered as **reference only** (`A07`, `A08`), for comparing the Speak / Review / Redo buttons. They are not among the screens under review.
- Same ids and folder layout as run 1 (59 states). Two ids are added, `X01` and `X02` (term 1 typing), because `F05` / `F05b` cannot reach a text field on term 2 any more. 61 states in total.

## The four screens under review, and the ids that show them

| Screen | Primary id | Related ids |
| --- | --- | --- |
| StudyPlan-notStarted (`/`) | `A01-studyplan-notStarted-default` | `A02` Speak held down, `A03` kebab tap, `A04` topic-node tap, `A05` bottom-nav tap, `A06` `?state=bogus`, `A09` Speak destination (`/primer`) |
| Summary (`/summary`) | `B01-summary-mixed-default` (+ `-full`) | `B04` `?variant=all-recalled`, `B05` `?variant=bogus`, `B02b` / `B03b` buttons held down at bottom of page (baseline `B02`), `B06` scrolled to bottom, `B07` to `B09` destinations of Back / Continue / Review, `B10` reached from a real session run, `B01-tag-<status>` crops of the four status tags |
| Learning-topic 2-result-Hinted1-ready to send (`/session`, sub-state `hinted2ReadyToSend`) | `D01-t2-Hinted1-readyToSend` (+ `-full`) | `D02` Resume tap, `D03` Send held down, `D04` Redo held down, `C13` the recording that precedes it, `F11` Redo result, `F12` reload here |
| Learning-topic 2-result-Hinted1-recalled (`/session`, sub-state `resultHinted1Recalled`) | `E01-t2-Hinted1-recalled` (+ `-full`) | `E02` Continue held down, `D05` the processing state that precedes it, `F01` reload here, `F02` Close X pressed on Hinted1 |

## Loop context (same session walk, so the states around the two Session screens can be compared)

`C01` term 1 idle, `C02` mic held down, `C03-a` / `C03-b` recording 0.9 s and 2.2 s in, `C04` ready to send, `C05` after Redo, `C06` processing, `C07` result Recalled, `C08` term 2 idle, `C09` recording, `C10` ready to send, `C11` processing, `C12` result Hinted1 (`C12b` "I don't know" tap), `C13` Hinted1 recording, `C17` term 3 idle, `C18` term 3 result Revealed, `C19` term 4 idle.

## Failure paths

`F01` reload at Hinted1-recalled, `F02` Close X at Hinted1, `F03` to `F06b` term 2 "Type instead" (in run 2 the tap changes nothing, so `F05`, `F05b`, `F06`, `F06b` show term 2 idle; the manifest `desc` says so), `F07` / `F08` typing on term 1 (control), `X01` / `X02` term 1 text input empty and filled (added in run 2), `F09` mic denied at term 1, `F10` mic revoked at "Try again", `F11` Redo from Hinted1 ready-to-send, `F12` reload at Hinted1 ready-to-send.

## Files

| File | What it is |
| --- | --- |
| `screens/<id>.png` | Viewport screenshot (780x1688). `-full.png` = full-page. `-tab1.png` = first Tab focus. |
| `gray/<id>.png` | The same screenshot converted to greyscale, for reading state without colour. |
| `manifest.json` | id, group, route, description, file paths for every state (61). |
| `pixel-diffs.md`, `measure/pixel-diffs.json`, `diffs/` | Pair-wise pixel diffs, RGB and luminance-only. Same pairs as run 1 plus five run 2 additions. Tolerance 8 per channel. |
| `CHANGES-SINCE-RUN-1.md`, `measure/run-comparison.json`, `diffs/vs-run1/` | Every shared state compared with its run 1 twin by pixel diff and by measure JSON. Diff images for each pair that is not identical. |
| `contrast.md`, `measure/contrast-per-state.json` | Text contrast per text run, two methods (see file header). |
| `hit-areas.md`, `measure/hit-areas.json` | Tappable area of every interactive element, plus native buttons with no click handler. |
| `structure.md` | Scroll width vs client width and scroll height per state. |
| `measure/<id>.json` | Per-state raw data: interactive elements, text runs (one per text node), animations running, tab order where captured. |
| `aria/<id>.txt` | Accessibility-tree snapshot per state. |
| `measure/R-reduced-motion-animations.json` | Running Web Animations at each loop state, with and without `prefers-reduced-motion`. |
| `measure/submit-default-vs-disabled.json` | Crop diff of the Submit button, Default (`X02`) vs Disabled (`F07`), both on term 1: the Primary Default-vs-Disabled pair for G4. Run 1 used the term 2 pair `F05b` / `F06`. |
| `measure/tag-fills.json`, `measure/B01-tag-rects.json` | Fill colour and luminance of the four status tags, pairwise luminance ratios, and the tag boxes used for the crops. |
| `measure/capture-notes.json` | Counts of `input` / `textarea` and "Submit" after the term 2 "Type instead" tap. |
| `measure/submit-box-t1.json` | Bounding box of the term 1 Submit button used for the crop pair. |
| `logs/check-tokens.txt`, `logs/lint.txt`, `logs/build.txt` | Command output with exit codes. |
| `logs/grep-*.txt` | Greps over `src/` (excluding `*.stories.*` and `*.mdx`) for `rgba(` / `hsla(`, hex on non-comment lines (`grep-hex-raw.txt`) and on every line (`grep-hex-all-lines.txt`), `var()` fallbacks, `--color-primitives-` reads. |
| `logs/console.json` | Console warnings and errors across the run. Each entry carries the id of the last state captured in that browser session (`null` before its first capture). |
| `logs/dev-server-after-build.txt` | HTTP status of `http://localhost:3000/` right after `npm run build`. |
| `capture/` | The scripts that produced everything above. |

## Command results

| Command | Exit code | Note |
| --- | --- | --- |
| `npm run check:tokens` | 0 | "No token rule violations in src/." 138 grandfathered deviations reported. |
| `npm run lint` | 0 | No warnings. |
| `npm run build` | 0 | Run after all captures. `http://localhost:3000/` returned 200 afterwards, and `/session`, `/summary`, `/primer` returned 200; a headless load of `/session` after the build rendered the term 1 idle screen with no console error. |
| grep `rgba(` / `hsla(` | 0 | 16 matching lines (run 1: 16). |
| grep hex, non-comment lines | 0 | 2 matching lines (run 1: 2). |
| grep `var()` fallback | 1 | 0 matches. |
| grep `--color-primitives-` | 1 | 0 matches. |

## Limits of these measurements

- Contrast "rendered" samples the glyph core from the screenshot, so thin or small text can read slightly low. "Nominal" follows CSS colours down the DOM chain and does not see scrims, overlays or images. Where the two disagree, the rendered figure is the one that reflects what is on screen.
- Hit areas come from `elementFromPoint` on a 2 px grid. Elements below the fold cannot be hit-tested at the scroll position of the capture and are flagged `offscreen` in the JSON, not counted as failures.
- Animation counts come from `document.getAnimations()`, which sees CSS animations and transitions and Web Animations, not `requestAnimationFrame` or SVG SMIL.
- No pixel diff against the live Figma frames was made. Use the Figma tools for that.
- The capture script was rewritten for run 2. To keep the two runs comparable it uses run 1's measure schema; where run 1's routine is unknown it was checked on the 20 states that are pixel-identical between the runs, all of which have 0 measure differences.

## Not captured

- The Primer screens beyond their load state (`A09` is the destination of Speak only); `/session?entry=text` (the Primer "I can't talk right now" entry) was not driven.
- The typed path on term 2 (there is no text field to reach: `F05`, `F05b`, `F06`, `F06b` show term 2 idle) and on terms 3 and 4 (the "Type instead" control has no handler there).
- The `?review=1` run beyond its first screen (`B09`); its result frames and `Summary-all recalled` by a real walk.
- The 0.75 s hotspot-hint overlay itself; only settled shots (1.3 s after a tap) exist.
- Long-content stress (the app shows no transcript and accepts no long term), real screen-reader output, hover states, and a non-fake microphone.
- The mic prompt flow (OS-level permission dialog); the denied paths use a rejected `getUserMedia`, not a real browser prompt.
- Anything below the fold in states with no `-full` screenshot has no rendered contrast figure (`n/a` in `contrast.md`); it does have a nominal figure.
