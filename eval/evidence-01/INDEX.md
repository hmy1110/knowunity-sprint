# Evidence 01: raw renders and measurements

Captured against the running dev server (`http://localhost:3000`), headless Chromium, viewport 390x844 at 2x device scale, dark colour scheme. No code was changed. Nothing in this folder is a score or an opinion; it is screenshots, measurements and command output.

## Capture conditions

- Mic path: Chromium fake audio device, permission granted. Denied-mic states replace `navigator.mediaDevices.getUserMedia` with a rejection (`NotAllowedError`).
- The Next.js dev-tools badge is hidden with CSS in screenshots. Console output was captured separately (`logs/console.json`).
- `HotspotHints` (a prototype overlay) flashes outlines for about 0.75 s after a tap on a non-live target. Shots named `*-settled` were taken 1.3 s after the tap, after the overlay has gone.
- "Pressed" shots hold the mouse button down on the control, then slide off so no click fires.
- The two screens `StudyPlan-inProgress` and `StudyPlan-finish` are rendered as **reference only** (`A07`, `A08`), for comparing the Speak / Review / Redo buttons. They are not among the screens under review.

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

`F01` reload at Hinted1-recalled, `F02` Close X at Hinted1, `F03` to `F06b` typing on term 2 (Submit at 0.5 s and at 7 s), `F07` / `F08` typing on term 1 (control), `F09` mic denied at term 1, `F10` mic revoked at "Try again", `F11` Redo from Hinted1 ready-to-send, `F12` reload at Hinted1 ready-to-send.

## Files

| File | What it is |
| --- | --- |
| `screens/<id>.png` | Viewport screenshot (780x1688). `-full.png` = full-page. `-tab1.png` = first Tab focus. |
| `gray/<id>.png` | The same screenshot converted to greyscale, for reading state without colour. |
| `manifest.json` | id, route, description for every state. |
| `pixel-diffs.md`, `measure/pixel-diffs.json`, `diffs/` | Pair-wise pixel diffs, RGB and luminance-only. Tolerance 8 per channel. |
| `contrast.md`, `measure/contrast-per-state.json` | Text contrast per text run, two methods (see file header). |
| `hit-areas.md`, `measure/hit-areas.json` | Tappable area of every interactive element, plus native buttons with no click handler. |
| `structure.md` | Scroll width vs client width and scroll height per state. |
| `measure/<id>.json` | Per-state raw data: interactive elements, text runs, animations running, tab order where captured. |
| `aria/<id>.txt` | Accessibility-tree snapshot per state. |
| `measure/R-reduced-motion-animations.json` | Running Web Animations at each loop state, with and without `prefers-reduced-motion`. |
| `measure/submit-default-vs-disabled.json` | Crop diff of the Submit button, Default (`F05b`) vs Disabled (`F06`): the Primary Default-vs-Disabled pair for G4. |
| `measure/tag-fills.json` | Fill colour and luminance of the four status tags, and pairwise luminance ratios. |
| `logs/check-tokens.txt`, `logs/lint.txt`, `logs/build.txt` | Command output with exit codes. |
| `logs/grep-*.txt` | Greps over `src/` (excluding stories) for `rgba(` / `hsla(`, hex, `var()` fallbacks, primitive reads. |
| `logs/console.json` | Console warnings and errors across the run. |

## Limits of these measurements

- Contrast "rendered" samples the glyph core from the screenshot, so thin or small text can read slightly low. "Nominal" follows CSS colours down the DOM chain and does not see scrims, overlays or images. Where the two disagree, the rendered figure is the one that reflects what is on screen.
- Hit areas come from `elementFromPoint` on a 2 px grid. Elements below the fold cannot be hit-tested at scroll 0 and are flagged `offscreen` in the JSON, not counted as failures.
- Animation counts come from `document.getAnimations()`, which sees CSS animations and transitions and Web Animations, not `requestAnimationFrame` or SVG SMIL.
- No pixel diff against the live Figma frames was made. Use the Figma tools for that.
- Not captured: the Primer screens, typed paths on terms 3 and 4, long-content stress (the app shows no transcript and accepts no long term), real screen-reader output, hover states.
