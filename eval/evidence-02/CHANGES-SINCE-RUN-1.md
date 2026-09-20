# Changes since run 1

Neutral list of every state whose render or behaviour differs between `eval/evidence-01/` (run 1) and this folder (run 2). Facts and numbers only. No scores, no opinions on whether a change is good.

Code between the two runs: commits `c807145` (MicButton, SpeechBubble, Steps, InlineAlert, AudioScrubber synced to Figma) and `8bac949` (term 2 has no typed-answer entry; "Type instead" stays visible but has no handler on term 2). Both runs use the same 59 state ids. Run 2 adds two ids (`X01`, `X02`, term 1 typing) because `F05`/`F05b` cannot reach a text field on term 2 any more.

## How the comparison was made

- **Pixel**: each shared screenshot compared with its run 1 twin (same viewport, 780x1688), per-channel tolerance 8. Diff images: `diffs/vs-run1/<id>.png` (red = changed pixel). Full-page twins are compared where both runs have one.
- **Measure**: `measure/<id>.json` of run 1 against run 2. Controls are matched by tag and name, text runs by their first 80 characters. Rects match within 0.15 px (controls) or 0.6 px (text); effective hit boxes within 2 px (the grid step). Raw result: `measure/run-comparison.json`.
- **Aria**: `aria/<id>.txt` compared line by line.
- **Noise floor**: the capture script is new (run 1's was lost). To check the method, the states whose screenshots are pixel-identical to run 1 were also compared by measure: 20 states are pixel-identical and 20 of them have 0 measure differences (no exceptions).
- The effective hit box is read on a 2 px grid, so it can move by 2 px without the element moving.

## Summary by state

Pixel columns are the viewport screenshot vs run 1. "measure" is the number of differing measure items (controls + text runs + visible-text line). Full-page pixel column shows only where both runs have a full-page image.

| id | pixel rgb% | pixel luma% | changed box (css px) | full-page rgb% | measure items | common changes |
|---|---|---|---|---|---|---|
| A01-studyplan-notStarted-default | 0 | 0 | - | - | 0 | - |
| A02-studyplan-notStarted-speak-pressed | 0 | 0 | - | - | 0 | - |
| A03-studyplan-kebab-tap-settled | 0 | 0 | - | - | 0 | - |
| A04-studyplan-topicnode-tap-settled | 0 | 0 | - | - | 0 | - |
| A05-studyplan-bottomnav-tap-settled | 0 | 0 | - | - | 0 | - |
| A06-studyplan-state-bogus | 0 | 0 | - | - | 0 | - |
| A07-studyplan-inProgress-REFERENCE | 0 | 0 | - | - | 0 | - |
| A08-studyplan-finish-REFERENCE | 0 | 0 | - | - | 0 | - |
| A09-studyplan-speak-destination-primer | 0 | 0 | - | - | 0 | - |
| B01-summary-mixed-default | 0 | 0 | - | 0 | 0 | - |
| B02-summary-bottom-baseline | 0 | 0 | - | - | 0 | - |
| B02b-summary-review-pressed-scrolled | 0 | 0 | - | - | 0 | - |
| B03b-summary-continue-pressed-scrolled | 0 | 0 | - | - | 0 | - |
| B04-summary-all-recalled | 0 | 0 | - | 0 | 0 | - |
| B05-summary-variant-bogus | 0 | 0 | - | 0 | 0 | - |
| B06-summary-scrolled-bottom | 0 | 0 | - | - | 0 | - |
| B07-summary-back-destination | 0 | 0 | - | - | 0 | - |
| B08-summary-continue-destination | 0 | 0 | - | - | 0 | - |
| B09-summary-review-destination | 5.831 | 5.826 | 16,114 358x652.5 | - | 10 | K06 K08 K01 K02 K03 K04 K07 K05 K13 K09 |
| C01-t1-idle | 5.872 | 5.867 | 16,114 358x652.5 | - | 10 | K06 K08 K01 K02 K03 K04 K10 K05 K14 K09 |
| C02-t1-idle-mic-pressed | 5.872 | 5.867 | 16,114 358x652.5 | - | 10 | K06 K08 K01 K02 K03 K04 K10 K05 K14 K09 |
| C03-t1-recording-a | 5.569 | 5.561 | 16,114 358x146 | - | 8 | K06 K01 K02 K03 K04 K10 K05 K14 |
| C03-t1-recording-b | 5.569 | 5.561 | 16,114 358x146 | - | 8 | K06 K01 K02 K03 K04 K10 K05 K14 |
| C04-t1-readyToSend | 7.045 | 7.04 | 16,114 358x565 | - | 9 | K06 K19 K01 K02 K03 K04 K10 K05 K14 |
| C05-t1-after-redo | 5.872 | 5.867 | 16,114 358x652.5 | - | 10 | K06 K08 K01 K02 K03 K04 K10 K05 K14 K09 |
| C06-t1-processing | 11.614 | 11.569 | 16,114 358x701 | - | 11 | K06 K11 K01 K02 K03 K04 K10 K05 |
| C07-t1-resultRecalled | 14.082 | 13.96 | 16,114 358x327 | - | 12 | K06 K01 K02 K03 K04 K10 K05 |
| C08-t2-idle | 5.831 | 5.826 | 16,114 358x652.5 | - | 11 | K06 K08 K18 K01 K02 K03 K04 K07 K05 K13 K09 |
| C09-t2-recording | 5.525 | 5.517 | 16,114 358x146 | - | 8 | K06 K01 K02 K03 K04 K07 K05 K13 |
| C10-t2-readyToSend | 7.004 | 6.999 | 16,114 358x565 | - | 9 | K06 K19 K01 K02 K03 K04 K07 K05 K13 |
| C11-t2-processing | 11.615 | 11.571 | 16,114 358x701 | - | 11 | K06 K11 K01 K02 K03 K04 K07 K05 K12 |
| C12-t2-resultHinted1 | 11.898 | 11.891 | 16,114 358x653 | - | 15 | K06 K11 K18 K01 K02 K03 K04 K07 K05 K12 K15 K16 K17 |
| C12b-t2-hinted1-idontknow-tap-settled | 11.898 | 11.891 | 16,114 358x653 | - | 15 | K06 K11 K18 K01 K02 K03 K04 K07 K05 K12 K15 K16 K17 |
| C13-t2-Hinted1-recording | 10.789 | 10.779 | 16,114 358x327 | - | 12 | K06 K11 K01 K02 K03 K04 K07 K05 K12 K15 K16 K17 |
| D01-t2-Hinted1-readyToSend | 13.12 | 13.112 | 16,114 358x565 | 13.12 | 13 | K06 K11 K19 K01 K02 K03 K04 K07 K05 K12 K15 K16 K17 |
| D02-t2-Hinted1-readyToSend-resume-tap-settled | 13.12 | 13.112 | 16,114 358x565 | - | 13 | K06 K11 K19 K01 K02 K03 K04 K07 K05 K12 K15 K16 K17 |
| D03-t2-Hinted1-readyToSend-send-pressed | 13.12 | 13.112 | 16,114 358x565 | - | 13 | K06 K11 K19 K01 K02 K03 K04 K07 K05 K12 K15 K16 K17 |
| D04-t2-Hinted1-readyToSend-redo-pressed | 13.12 | 13.112 | 16,114 358x565 | - | 13 | K06 K11 K19 K01 K02 K03 K04 K07 K05 K12 K15 K16 K17 |
| D05-t2-Hinted1-processing | 20.552 | 20.466 | 16,114 358x701 | - | 15 | K06 K11 K01 K02 K03 K04 K07 K05 K12 |
| E01-t2-Hinted1-recalled | 22.638 | 22.502 | 16,114 358x548 | 22.638 | 16 | K06 K11 K01 K02 K03 K04 K07 K05 K12 |
| E02-t2-Hinted1-recalled-continue-pressed | 22.638 | 22.502 | 16,114 358x548 | - | 16 | K06 K11 K01 K02 K03 K04 K07 K05 K12 |
| F01-reload-after-Hinted1-recalled | 5.872 | 5.867 | 16,114 358x652.5 | - | 10 | K06 K08 K01 K02 K03 K04 K10 K05 K14 K09 |
| C17-t3-idle | 5.785 | 5.781 | 16,114 358x652.5 | - | 10 | K06 K08 K01 K02 K03 K04 K05 K09 |
| C18-t3-resultRevealed | 8.068 | 8.055 | 16,114 358x293 | - | 11 | K06 K01 K02 K03 K04 K05 |
| C19-t4-idle | 5.774 | 5.77 | 16,114 358x652.5 | - | 11 | K08 K01 K02 K03 K04 K05 K09 |
| B10-summary-after-real-session | 0 | 0 | - | 0 | 0 | - |
| F02-close-X-at-Hinted1 | 0 | 0 | - | - | 0 | - |
| F03-t2-idle-before-type | 5.831 | 5.826 | 16,114 358x652.5 | - | 11 | K06 K08 K18 K01 K02 K03 K04 K07 K05 K13 K09 |
| F04-t2-idle-idontknow-tap-settled | 5.831 | 5.826 | 16,114 358x652.5 | - | 11 | K06 K08 K18 K01 K02 K03 K04 K07 K05 K13 K09 |
| F05-t2-typeInput | 21.051 | 21.046 | 16,114 358x702 | - | 32 | K20 K21 K22 K06 K01 K02 K23 K24 K25 K03 K04 K07 K05 K13 K26 K27 K28 K29 K30 |
| F05b-t2-typeInput-filled | 21.051 | 21.046 | 16,114 358x702 | - | 33 | K20 K21 K22 K06 K01 K02 K23 K24 K25 K03 K04 K07 K05 K13 K26 K27 K28 K29 K30 |
| F06-t2-typeProcessing-0.5s | 26.549 | 26.446 | 16,114 358x702 | - | 31 | K20 K21 K22 K06 K01 K02 K23 K24 K25 K03 K04 K07 K05 K26 K27 K28 K29 K30 |
| F06b-t2-typeProcessing-7s | 26.549 | 26.446 | 16,114 358x702 | - | 31 | K20 K21 K22 K06 K01 K02 K23 K24 K25 K03 K04 K07 K05 K26 K27 K28 K29 K30 |
| F07-t1-typeProcessing | 10.667 | 10.656 | 16,114 358x300 | - | 11 | K06 K01 K02 K03 K04 K10 K05 |
| F08-t1-typeResultRecalled | 10.417 | 10.408 | 16,114 358x352 | - | 13 | K06 K01 K02 K03 K04 K10 K05 |
| F09-t1-mic-denied-settled | 5.872 | 5.867 | 16,114 358x652.5 | - | 10 | K06 K08 K01 K02 K03 K04 K10 K05 K14 K09 |
| F10-t2-tryagain-mic-denied-settled | 11.898 | 11.891 | 16,114 358x653 | - | 15 | K06 K11 K18 K01 K02 K03 K04 K07 K05 K12 K15 K16 K17 |
| F11-Hinted1-ready-Redo-result | 5.831 | 5.826 | 16,114 358x652.5 | - | 11 | K06 K08 K18 K01 K02 K03 K04 K07 K05 K13 K09 |
| F12-reload-at-Hinted1-ready | 5.872 | 5.867 | 16,114 358x652.5 | - | 10 | K06 K08 K01 K02 K03 K04 K10 K05 K14 K09 |

## States with no difference

Pixel-identical to run 1 (rgb 0%) and no measure difference: A01-studyplan-notStarted-default, A02-studyplan-notStarted-speak-pressed, A03-studyplan-kebab-tap-settled, A04-studyplan-topicnode-tap-settled, A05-studyplan-bottomnav-tap-settled, A06-studyplan-state-bogus, A07-studyplan-inProgress-REFERENCE, A08-studyplan-finish-REFERENCE, A09-studyplan-speak-destination-primer, B01-summary-mixed-default, B02-summary-bottom-baseline, B02b-summary-review-pressed-scrolled, B03b-summary-continue-pressed-scrolled, B04-summary-all-recalled, B05-summary-variant-bogus, B06-summary-scrolled-bottom, B07-summary-back-destination, B08-summary-continue-destination, B10-summary-after-real-session, F02-close-X-at-Hinted1.

Pixel-identical to run 1 with only a capture-method text-split difference in the measure: none.

## Changes that recur across states (K-list)

Each line is one measured change that appears in 4 or more states. Values are run 1 -> run 2.

- **K01** (39 states) text added: "of" 12px/600, y 120, nominal 17.63
  - B09-summary-review-destination, C01-t1-idle, C02-t1-idle-mic-pressed, C03-t1-recording-a, C03-t1-recording-b, C04-t1-readyToSend, C05-t1-after-redo, C06-t1-processing, C07-t1-resultRecalled, C08-t2-idle, C09-t2-recording, C10-t2-readyToSend, C11-t2-processing, C12-t2-resultHinted1, C12b-t2-hinted1-idontknow-tap-settled, C13-t2-Hinted1-recording, D01-t2-Hinted1-readyToSend, D02-t2-Hinted1-readyToSend-resume-tap-settled, D03-t2-Hinted1-readyToSend-send-pressed, D04-t2-Hinted1-readyToSend-redo-pressed, D05-t2-Hinted1-processing, E01-t2-Hinted1-recalled, E02-t2-Hinted1-recalled-continue-pressed, F01-reload-after-Hinted1-recalled, C17-t3-idle, C18-t3-resultRevealed, C19-t4-idle, F03-t2-idle-before-type, F04-t2-idle-idontknow-tap-settled, F05-t2-typeInput, F05b-t2-typeInput-filled, F06-t2-typeProcessing-0.5s, F06b-t2-typeProcessing-7s, F07-t1-typeProcessing, F08-t1-typeResultRecalled, F09-t1-mic-denied-settled, F10-t2-tryagain-mic-denied-settled, F11-Hinted1-ready-Redo-result, F12-reload-at-Hinted1-ready
- **K02** (39 states) text added: "4" 12px/600, y 120, nominal 17.63
  - B09-summary-review-destination, C01-t1-idle, C02-t1-idle-mic-pressed, C03-t1-recording-a, C03-t1-recording-b, C04-t1-readyToSend, C05-t1-after-redo, C06-t1-processing, C07-t1-resultRecalled, C08-t2-idle, C09-t2-recording, C10-t2-readyToSend, C11-t2-processing, C12-t2-resultHinted1, C12b-t2-hinted1-idontknow-tap-settled, C13-t2-Hinted1-recording, D01-t2-Hinted1-readyToSend, D02-t2-Hinted1-readyToSend-resume-tap-settled, D03-t2-Hinted1-readyToSend-send-pressed, D04-t2-Hinted1-readyToSend-redo-pressed, D05-t2-Hinted1-processing, E01-t2-Hinted1-recalled, E02-t2-Hinted1-recalled-continue-pressed, F01-reload-after-Hinted1-recalled, C17-t3-idle, C18-t3-resultRevealed, C19-t4-idle, F03-t2-idle-before-type, F04-t2-idle-idontknow-tap-settled, F05-t2-typeInput, F05b-t2-typeInput-filled, F06-t2-typeProcessing-0.5s, F06b-t2-typeProcessing-7s, F07-t1-typeProcessing, F08-t1-typeResultRecalled, F09-t1-mic-denied-settled, F10-t2-tryagain-mic-denied-settled, F11-Hinted1-ready-Redo-result, F12-reload-at-Hinted1-ready
- **K03** (39 states) text removed: "of 4" 12px/600, y 112, nominal 17.63
  - B09-summary-review-destination, C01-t1-idle, C02-t1-idle-mic-pressed, C03-t1-recording-a, C03-t1-recording-b, C04-t1-readyToSend, C05-t1-after-redo, C06-t1-processing, C07-t1-resultRecalled, C08-t2-idle, C09-t2-recording, C10-t2-readyToSend, C11-t2-processing, C12-t2-resultHinted1, C12b-t2-hinted1-idontknow-tap-settled, C13-t2-Hinted1-recording, D01-t2-Hinted1-readyToSend, D02-t2-Hinted1-readyToSend-resume-tap-settled, D03-t2-Hinted1-readyToSend-send-pressed, D04-t2-Hinted1-readyToSend-redo-pressed, D05-t2-Hinted1-processing, E01-t2-Hinted1-recalled, E02-t2-Hinted1-recalled-continue-pressed, F01-reload-after-Hinted1-recalled, C17-t3-idle, C18-t3-resultRevealed, C19-t4-idle, F03-t2-idle-before-type, F04-t2-idle-idontknow-tap-settled, F05-t2-typeInput, F05b-t2-typeInput-filled, F06-t2-typeProcessing-0.5s, F06b-t2-typeProcessing-7s, F07-t1-typeProcessing, F08-t1-typeResultRecalled, F09-t1-mic-denied-settled, F10-t2-tryagain-mic-denied-settled, F11-Hinted1-ready-Redo-result, F12-reload-at-Hinted1-ready
- **K04** (39 states) text "Topics": rect y 112->120
  - B09-summary-review-destination, C01-t1-idle, C02-t1-idle-mic-pressed, C03-t1-recording-a, C03-t1-recording-b, C04-t1-readyToSend, C05-t1-after-redo, C06-t1-processing, C07-t1-resultRecalled, C08-t2-idle, C09-t2-recording, C10-t2-readyToSend, C11-t2-processing, C12-t2-resultHinted1, C12b-t2-hinted1-idontknow-tap-settled, C13-t2-Hinted1-recording, D01-t2-Hinted1-readyToSend, D02-t2-Hinted1-readyToSend-resume-tap-settled, D03-t2-Hinted1-readyToSend-send-pressed, D04-t2-Hinted1-readyToSend-redo-pressed, D05-t2-Hinted1-processing, E01-t2-Hinted1-recalled, E02-t2-Hinted1-recalled-continue-pressed, F01-reload-after-Hinted1-recalled, C17-t3-idle, C18-t3-resultRevealed, C19-t4-idle, F03-t2-idle-before-type, F04-t2-idle-idontknow-tap-settled, F05-t2-typeInput, F05b-t2-typeInput-filled, F06-t2-typeProcessing-0.5s, F06b-t2-typeProcessing-7s, F07-t1-typeProcessing, F08-t1-typeResultRecalled, F09-t1-mic-denied-settled, F10-t2-tryagain-mic-denied-settled, F11-Hinted1-ready-Redo-result, F12-reload-at-Hinted1-ready
- **K05** (39 states) text "Skip": rect x 342.8->330.8, y 111->118
  - B09-summary-review-destination, C01-t1-idle, C02-t1-idle-mic-pressed, C03-t1-recording-a, C03-t1-recording-b, C04-t1-readyToSend, C05-t1-after-redo, C06-t1-processing, C07-t1-resultRecalled, C08-t2-idle, C09-t2-recording, C10-t2-readyToSend, C11-t2-processing, C12-t2-resultHinted1, C12b-t2-hinted1-idontknow-tap-settled, C13-t2-Hinted1-recording, D01-t2-Hinted1-readyToSend, D02-t2-Hinted1-readyToSend-resume-tap-settled, D03-t2-Hinted1-readyToSend-send-pressed, D04-t2-Hinted1-readyToSend-redo-pressed, D05-t2-Hinted1-processing, E01-t2-Hinted1-recalled, E02-t2-Hinted1-recalled-continue-pressed, F01-reload-after-Hinted1-recalled, C17-t3-idle, C18-t3-resultRevealed, C19-t4-idle, F03-t2-idle-before-type, F04-t2-idle-idontknow-tap-settled, F05-t2-typeInput, F05b-t2-typeInput-filled, F06-t2-typeProcessing-0.5s, F06b-t2-typeProcessing-7s, F07-t1-typeProcessing, F08-t1-typeResultRecalled, F09-t1-mic-denied-settled, F10-t2-tryagain-mic-denied-settled, F11-Hinted1-ready-Redo-result, F12-reload-at-Hinted1-ready
- **K06** (38 states) control "Skip": own x 342.8->318.8, w 31.2->55.2, h 16->32; union x 334.4->318.8, y 96->104, w 48->55.2; effectiveHit x 334->318, y 96->104, w 50->56
  - B09-summary-review-destination, C01-t1-idle, C02-t1-idle-mic-pressed, C03-t1-recording-a, C03-t1-recording-b, C04-t1-readyToSend, C05-t1-after-redo, C06-t1-processing, C07-t1-resultRecalled, C08-t2-idle, C09-t2-recording, C10-t2-readyToSend, C11-t2-processing, C12-t2-resultHinted1, C12b-t2-hinted1-idontknow-tap-settled, C13-t2-Hinted1-recording, D01-t2-Hinted1-readyToSend, D02-t2-Hinted1-readyToSend-resume-tap-settled, D03-t2-Hinted1-readyToSend-send-pressed, D04-t2-Hinted1-readyToSend-redo-pressed, D05-t2-Hinted1-processing, E01-t2-Hinted1-recalled, E02-t2-Hinted1-recalled-continue-pressed, F01-reload-after-Hinted1-recalled, C17-t3-idle, C18-t3-resultRevealed, F03-t2-idle-before-type, F04-t2-idle-idontknow-tap-settled, F05-t2-typeInput, F05b-t2-typeInput-filled, F06-t2-typeProcessing-0.5s, F06b-t2-typeProcessing-7s, F07-t1-typeProcessing, F08-t1-typeResultRecalled, F09-t1-mic-denied-settled, F10-t2-tryagain-mic-denied-settled, F11-Hinted1-ready-Redo-result, F12-reload-at-Hinted1-ready
- **K07** (23 states) text "2": rect y 112->120
  - B09-summary-review-destination, C08-t2-idle, C09-t2-recording, C10-t2-readyToSend, C11-t2-processing, C12-t2-resultHinted1, C12b-t2-hinted1-idontknow-tap-settled, C13-t2-Hinted1-recording, D01-t2-Hinted1-readyToSend, D02-t2-Hinted1-readyToSend-resume-tap-settled, D03-t2-Hinted1-readyToSend-send-pressed, D04-t2-Hinted1-readyToSend-redo-pressed, D05-t2-Hinted1-processing, E01-t2-Hinted1-recalled, E02-t2-Hinted1-recalled-continue-pressed, F03-t2-idle-before-type, F04-t2-idle-idontknow-tap-settled, F05-t2-typeInput, F05b-t2-typeInput-filled, F06-t2-typeProcessing-0.5s, F06b-t2-typeProcessing-7s, F10-t2-tryagain-mic-denied-settled, F11-Hinted1-ready-Redo-result
- **K08** (13 states) control "Tap to speak": own x 151->157, y 688->687, w 88->76, h 80->81; union x 151->157, y 688->687, w 88->76, h 80->81; effectiveHit x 150->156, w 90->78
  - B09-summary-review-destination, C01-t1-idle, C02-t1-idle-mic-pressed, C05-t1-after-redo, C08-t2-idle, F01-reload-after-Hinted1-recalled, C17-t3-idle, C19-t4-idle, F03-t2-idle-before-type, F04-t2-idle-idontknow-tap-settled, F09-t1-mic-denied-settled, F11-Hinted1-ready-Redo-result, F12-reload-at-Hinted1-ready
- **K09** (13 states) text "Tap to speak": rect x 151->157, w 88->76
  - B09-summary-review-destination, C01-t1-idle, C02-t1-idle-mic-pressed, C05-t1-after-redo, C08-t2-idle, F01-reload-after-Hinted1-recalled, C17-t3-idle, C19-t4-idle, F03-t2-idle-before-type, F04-t2-idle-idontknow-tap-settled, F09-t1-mic-denied-settled, F11-Hinted1-ready-Redo-result, F12-reload-at-Hinted1-ready
- **K10** (13 states) text "1": rect y 112->120
  - C01-t1-idle, C02-t1-idle-mic-pressed, C03-t1-recording-a, C03-t1-recording-b, C04-t1-readyToSend, C05-t1-after-redo, C06-t1-processing, C07-t1-resultRecalled, F01-reload-after-Hinted1-recalled, F07-t1-typeProcessing, F08-t1-typeResultRecalled, F09-t1-mic-denied-settled, F12-reload-at-Hinted1-ready
- **K11** (13 states) control "Play recording": own x 117->111.5, y 208->224, w 257->262.5, h 32->44; union x 117->111.5, y 208->224, w 257->262.5, h 32->44; effectiveHit x 117->112, y 208->224, w 258->262, h 32->44
  - C06-t1-processing, C11-t2-processing, C12-t2-resultHinted1, C12b-t2-hinted1-idontknow-tap-settled, C13-t2-Hinted1-recording, D01-t2-Hinted1-readyToSend, D02-t2-Hinted1-readyToSend-resume-tap-settled, D03-t2-Hinted1-readyToSend-send-pressed, D04-t2-Hinted1-readyToSend-redo-pressed, D05-t2-Hinted1-processing, E01-t2-Hinted1-recalled, E02-t2-Hinted1-recalled-continue-pressed, F10-t2-tryagain-mic-denied-settled
- **K12** (12 states) text "Explain the term “Divergent thinking” out loud, in your own words.": rect y 150->166
  - C11-t2-processing, C12-t2-resultHinted1, C12b-t2-hinted1-idontknow-tap-settled, C13-t2-Hinted1-recording, D01-t2-Hinted1-readyToSend, D02-t2-Hinted1-readyToSend-resume-tap-settled, D03-t2-Hinted1-readyToSend-send-pressed, D04-t2-Hinted1-readyToSend-redo-pressed, D05-t2-Hinted1-processing, E01-t2-Hinted1-recalled, E02-t2-Hinted1-recalled-continue-pressed, F10-t2-tryagain-mic-denied-settled
- **K13** (9 states) text "Explain the term “Divergent thinking” out loud, in your own words.": rect y 166->182, w 137.1->229.5
  - B09-summary-review-destination, C08-t2-idle, C09-t2-recording, C10-t2-readyToSend, F03-t2-idle-before-type, F04-t2-idle-idontknow-tap-settled, F05-t2-typeInput, F05b-t2-typeInput-filled, F11-Hinted1-ready-Redo-result
- **K14** (9 states) text "Let’s start. Explain the term “Inspiration” out loud, in your own words.": rect y 166->182, w 185.9->230.6
  - C01-t1-idle, C02-t1-idle-mic-pressed, C03-t1-recording-a, C03-t1-recording-b, C04-t1-readyToSend, C05-t1-after-redo, F01-reload-after-Hinted1-recalled, F09-t1-mic-denied-settled, F12-reload-at-Hinted1-ready
- **K15** (8 states) text "Not quite yet.": rect y 272->300
  - C12-t2-resultHinted1, C12b-t2-hinted1-idontknow-tap-settled, C13-t2-Hinted1-recording, D01-t2-Hinted1-readyToSend, D02-t2-Hinted1-readyToSend-resume-tap-settled, D03-t2-Hinted1-readyToSend-send-pressed, D04-t2-Hinted1-readyToSend-redo-pressed, F10-t2-tryagain-mic-denied-settled
- **K16** (8 states) text "Hint 1 of 2": color rgba(245, 243, 255, 0.68)->rgb(244, 242, 255); nominalRatio 7.26->13.95; rect y 300->326
  - C12-t2-resultHinted1, C12b-t2-hinted1-idontknow-tap-settled, C13-t2-Hinted1-recording, D01-t2-Hinted1-readyToSend, D02-t2-Hinted1-readyToSend-resume-tap-settled, D03-t2-Hinted1-readyToSend-send-pressed, D04-t2-Hinted1-readyToSend-redo-pressed, F10-t2-tryagain-mic-denied-settled
- **K17** (8 states) text "No worries. Think about the very first step, before you start narrowing down to ": rect y 317->343, w 199.1->231.7
  - C12-t2-resultHinted1, C12b-t2-hinted1-idontknow-tap-settled, C13-t2-Hinted1-recording, D01-t2-Hinted1-readyToSend, D02-t2-Hinted1-readyToSend-resume-tap-settled, D03-t2-Hinted1-readyToSend-send-pressed, D04-t2-Hinted1-readyToSend-redo-pressed, F10-t2-tryagain-mic-denied-settled
- **K18** (7 states) control "Type instead": hasOnClick true->false; hotspotMarked true->false
  - C08-t2-idle, C12-t2-resultHinted1, C12b-t2-hinted1-idontknow-tap-settled, F03-t2-idle-before-type, F04-t2-idle-idontknow-tap-settled, F10-t2-tryagain-mic-denied-settled, F11-Hinted1-ready-Redo-result
- **K19** (6 states) control "Play recording": own x 66.5->63.8, y 647->635, w 257->262.5, h 32->44; union x 66.5->63.8, y 647->635, w 257->262.5, h 32->44; effectiveHit y 647->636, w 258->264, h 32->44
  - C04-t1-readyToSend, C10-t2-readyToSend, D01-t2-Hinted1-readyToSend, D02-t2-Hinted1-readyToSend-resume-tap-settled, D03-t2-Hinted1-readyToSend-send-pressed, D04-t2-Hinted1-readyToSend-redo-pressed
- **K20** (4 states) control added: "Tap to speak" (button) own 76x81@157,687, hit 78x80, onClick true
  - F05-t2-typeInput, F05b-t2-typeInput-filled, F06-t2-typeProcessing-0.5s, F06b-t2-typeProcessing-7s
- **K21** (4 states) control added: "Type instead" (button) own 113.3x32@72,784, hit 114x48, onClick false
  - F05-t2-typeInput, F05b-t2-typeInput-filled, F06-t2-typeProcessing-0.5s, F06b-t2-typeProcessing-7s
- **K22** (4 states) control added: "I don’t know" (button) own 108.6x32@209.4,784, hit 108x48, onClick false
  - F05-t2-typeInput, F05b-t2-typeInput-filled, F06-t2-typeProcessing-0.5s, F06b-t2-typeProcessing-7s
- **K23** (4 states) text added: "Tap to speak" 14px/600, y 751, nominal 8.4
  - F05-t2-typeInput, F05b-t2-typeInput-filled, F06-t2-typeProcessing-0.5s, F06b-t2-typeProcessing-7s
- **K24** (4 states) text added: "Type instead" 14px/600, y 790, nominal 17.63
  - F05-t2-typeInput, F05b-t2-typeInput-filled, F06-t2-typeProcessing-0.5s, F06b-t2-typeProcessing-7s
- **K25** (4 states) text added: "I don’t know" 14px/600, y 790, nominal 17.63
  - F05-t2-typeInput, F05b-t2-typeInput-filled, F06-t2-typeProcessing-0.5s, F06b-t2-typeProcessing-7s
- **K26** (4 states) aria line only in run 1: - paragraph: A couple of sentences is enough, you don't need to retype the full explanation.
  - F05-t2-typeInput, F05b-t2-typeInput-filled, F06-t2-typeProcessing-0.5s, F06b-t2-typeProcessing-7s
- **K27** (4 states) aria line only in run 2: - button "Tap to speak":
  - F05-t2-typeInput, F05b-t2-typeInput-filled, F06-t2-typeProcessing-0.5s, F06b-t2-typeProcessing-7s
- **K28** (4 states) aria line only in run 2: - paragraph: Tap to speak
  - F05-t2-typeInput, F05b-t2-typeInput-filled, F06-t2-typeProcessing-0.5s, F06b-t2-typeProcessing-7s
- **K29** (4 states) aria line only in run 2: - button "Type instead"
  - F05-t2-typeInput, F05b-t2-typeInput-filled, F06-t2-typeProcessing-0.5s, F06b-t2-typeProcessing-7s
- **K30** (4 states) aria line only in run 2: - button "I don’t know"
  - F05-t2-typeInput, F05b-t2-typeInput-filled, F06-t2-typeProcessing-0.5s, F06b-t2-typeProcessing-7s

## State-specific changes

Only changes not listed in the K-list. States with nothing extra are omitted.

### C06-t1-processing

- control "Processing…": own x 150.8->156.3, y 736->735, w 88.5->77.5, h 80->81; union x 150.8->156.3, y 736->735, w 88.5->77.5, h 80->81; effectiveHit x 150->156, w 90->78
- text "Let’s start. Explain the term “Inspiration” out loud, in your own words.": rect y 150->166
- text "Processing…": rect x 150.8->156.3, w 88.5->77.5

### C07-t1-resultRecalled

- control "Play recording": own x 117->111.5, y 208->232, w 257->262.5, h 32->44; union x 117->111.5, y 208->232, w 257->262.5, h 32->44; effectiveHit x 117->112, y 208->232, w 258->262, h 32->44
- text "Let’s start. Explain the term “Inspiration” out loud, in your own words.": rect y 150->174
- text "Nice!": rect y 272->308
- text "Unaided": color rgba(245, 243, 255, 0.68)->rgb(244, 242, 255); nominalRatio 7.26->13.95; rect y 300->334
- text "You said: 'It’s the spark that makes you want to create something'": rect y 319->353, w 191.1->230.6

### C11-t2-processing

- control "Processing…": own x 150.8->156.3, y 736->735, w 88.5->77.5, h 80->81; union x 150.8->156.3, y 736->735, w 88.5->77.5, h 80->81; effectiveHit x 150->156, w 90->78
- text "Processing…": rect x 150.8->156.3, w 88.5->77.5

### C12-t2-resultHinted1

- control "Try again": own x 163.4->167, y 688->687, w 63.2->56, h 80->81; union x 163.4->167, y 688->687, w 63.2->56, h 80->81; effectiveHit x 163->168, w 64->56
- text "Try again": rect x 163.4->167.9, w 63.2->54.2

### C12b-t2-hinted1-idontknow-tap-settled

- control "Try again": own x 163.4->167, y 688->687, w 63.2->56, h 80->81; union x 163.4->167, y 688->687, w 63.2->56, h 80->81; effectiveHit x 163->168, w 64->56
- text "Try again": rect x 163.4->167.9, w 63.2->54.2

### D05-t2-Hinted1-processing

- control "Play recording": own x 117->111.5, y 377->405, w 257->262.5, h 32->44; union x 117->111.5, y 377->405, w 257->262.5, h 32->44; effectiveHit x 117->112, y 377->406, w 258->262, h 32->44
- control "Processing…": own x 150.8->156.3, y 736->735, w 88.5->77.5, h 80->81; union x 150.8->156.3, y 736->735, w 88.5->77.5, h 80->81; effectiveHit x 150->156, w 90->78
- text "Not quite yet.": rect y 256->284
- text "Hint 1 of 2": rect y 282->310
- text "No worries. Think about the very first step, before you start narrowing down to ": rect y 299->327
- text "Processing…": rect x 150.8->156.3, w 88.5->77.5

### E01-t2-Hinted1-recalled

- control "Play recording": own x 117->111.5, y 377->405, w 257->262.5, h 32->44; union x 117->111.5, y 377->405, w 257->262.5, h 32->44; effectiveHit x 117->112, y 377->406, w 258->262, h 32->44
- text "Not quite yet.": rect y 256->284
- text "Hint 1 of 2": rect y 282->310
- text "No worries. Think about the very first step, before you start narrowing down to ": rect y 299->327
- text "Nice!": rect y 441->481
- text "Hint 1 of 2": color rgba(245, 243, 255, 0.68)->rgb(244, 242, 255); nominalRatio 7.26->13.95; rect y 469->507
- text "Divergent thinking is generating as many different ideas as possible before narr": rect y 488->526

### E02-t2-Hinted1-recalled-continue-pressed

- control "Play recording": own x 117->111.5, y 377->405, w 257->262.5, h 32->44; union x 117->111.5, y 377->405, w 257->262.5, h 32->44; effectiveHit x 117->112, y 377->406, w 258->262, h 32->44
- text "Not quite yet.": rect y 256->284
- text "Hint 1 of 2": rect y 282->310
- text "No worries. Think about the very first step, before you start narrowing down to ": rect y 299->327
- text "Nice!": rect y 441->481
- text "Hint 1 of 2": color rgba(245, 243, 255, 0.68)->rgb(244, 242, 255); nominalRatio 7.26->13.95; rect y 469->507
- text "Divergent thinking is generating as many different ideas as possible before narr": rect y 488->526

### C17-t3-idle

- text "3": rect y 112->120
- text "Explain the term “Visual hierarchy” out loud, in your own words.": rect y 166->182

### C18-t3-resultRevealed

- text "3": rect y 112->120
- text "Explain the term “Visual hierarchy” out loud, in your own words.": rect y 150->166
- text "Here’s the answer.": rect y 224->240
- text "Revealed": color rgba(245, 243, 255, 0.68)->rgb(244, 242, 255); nominalRatio 7.26->13.95; rect y 252->266
- text "Visual hierarchy arranges elements to guide attention and show what matters most": rect y 271->285, w 134.3->212.2

### C19-t4-idle

- control removed: "" (span) own 48x48@334.4,96, hit 50x48, onClick false
- control "Skip": own x 342.8->318.8, w 31.2->55.2, h 16->32; union x 334.4->318.8, y 96->104, w 48->55.2; effectiveHit x 334->318, y 96->104, w 50->56; hotspotMarked false->true
- text "4": rect y 112->120
- text "Explain the term “Visual research” out loud, in your own words.": rect y 166->182

### F05-t2-typeInput

- visible text: removed [Type a short answer... | A couple of sentences is enough, you don't need to retype the full explanation. | Submit | Switch to voice]; added [Tap to speak | Type instead | I don’t know]
- control removed: "Type a short answer" (input) own 358x42@16,260, hit 358x42, onClick false
- control removed: "Submit" (button) own 334x56@28,696, hit 334x56, onClick true
- control removed: "Switch to voice" (button) own 334x56@28,760, hit 334x56, onClick true
- text removed: "Type a short answer..." 14px/600, y 272, nominal 7.75
- text removed: "A couple of sentences is enough, you don't need to retype the full explanation." 12px/400, y 304, nominal 4.65
- text removed: "Submit" 20px/700, y 710, nominal 17.63
- text removed: "Switch to voice" 20px/700, y 774, nominal 13.95
- aria line only in run 1: - paragraph: Type a short answer...
- aria line only in run 1: - textbox "Type a short answer":
- aria line only in run 1: - /placeholder: Type a short answer...
- aria line only in run 1: - button "Submit"
- aria line only in run 1: - button "Switch to voice"

### F05b-t2-typeInput-filled

- visible text: removed [Type a short answer... | A couple of sentences is enough, you don't need to retype the full explanation. | Submit | Switch to voice]; added [Tap to speak | Type instead | I don’t know]
- control removed: "Type a short answer" (input) own 358x42@16,260, hit 358x42, onClick false
- control removed: "Submit" (button) own 334x56@28,696, hit 334x56, onClick true
- control removed: "Switch to voice" (button) own 334x56@28,760, hit 334x56, onClick true
- text removed: "Type a short answer..." 14px/600, y 272, nominal 7.75
- text removed: "A couple of sentences is enough, you don't need to retype the full explanation." 12px/400, y 304, nominal 4.65
- text removed: "Submit" 20px/700, y 710, nominal 17.63
- text removed: "Switch to voice" 20px/700, y 774, nominal 13.95
- aria line only in run 1: - paragraph: Type a short answer...
- aria line only in run 1: - textbox "Type a short answer":
- aria line only in run 1: - /placeholder: Type a short answer...
- aria line only in run 1: - text: Divergent thinking is coming up with lots of ideas
- aria line only in run 1: - button "Submit"
- aria line only in run 1: - button "Switch to voice"

### F06-t2-typeProcessing-0.5s

- visible text: removed [You typed | Divergent thinking is coming up with lots of ideas | A couple of sentences is enough, you don't need to retype the full explanation. | Submit | Switch to voice]; added [Tap to speak | Type instead | I don’t know]
- control removed: "Submit" (button) own 334x56@28,696, hit 334x56, onClick false
- control removed: "Switch to voice" (button) own 334x56@28,760, hit 334x56, onClick false
- text removed: "You typed" 14px/600, y 207, nominal 17.63
- text removed: "Divergent thinking is coming up with lots of ideas" 14px/400, y 245, nominal 15.34
- text removed: "A couple of sentences is enough, you don't need to retype the full explanation." 12px/400, y 277, nominal 4.65
- text removed: "Submit" 20px/700, y 710, nominal 3.69
- text removed: "Switch to voice" 20px/700, y 774, nominal 3.69
- text "Explain the term “Divergent thinking” out loud, in your own words.": nominalRatio 17.63->13.95; rect x 16->117, y 150->182, w 341.6->229.5
- aria line only in run 1: - paragraph: You typed
- aria line only in run 1: - paragraph: Divergent thinking is coming up with lots of ideas
- aria line only in run 1: - button "Submit" [disabled]
- aria line only in run 1: - button "Switch to voice" [disabled]

### F06b-t2-typeProcessing-7s

- visible text: removed [You typed | Divergent thinking is coming up with lots of ideas | A couple of sentences is enough, you don't need to retype the full explanation. | Submit | Switch to voice]; added [Tap to speak | Type instead | I don’t know]
- control removed: "Submit" (button) own 334x56@28,696, hit 334x56, onClick false
- control removed: "Switch to voice" (button) own 334x56@28,760, hit 334x56, onClick false
- text removed: "You typed" 14px/600, y 207, nominal 17.63
- text removed: "Divergent thinking is coming up with lots of ideas" 14px/400, y 245, nominal 15.34
- text removed: "A couple of sentences is enough, you don't need to retype the full explanation." 12px/400, y 277, nominal 4.65
- text removed: "Submit" 20px/700, y 710, nominal 3.69
- text removed: "Switch to voice" 20px/700, y 774, nominal 3.69
- text "Explain the term “Divergent thinking” out loud, in your own words.": nominalRatio 17.63->13.95; rect x 16->117, y 150->182, w 341.6->229.5
- aria line only in run 1: - paragraph: You typed
- aria line only in run 1: - paragraph: Divergent thinking is coming up with lots of ideas
- aria line only in run 1: - button "Submit" [disabled]
- aria line only in run 1: - button "Switch to voice" [disabled]

### F07-t1-typeProcessing

- text "Let’s start. Explain the term “Inspiration” out loud, in your own words.": rect y 150->166
- text "You typed": rect y 207->223
- text "Inspiration is where ideas come from": rect y 245->261
- text "A couple of sentences is enough, you don't need to retype the full explanation.": rect y 277->293

### F08-t1-typeResultRecalled

- text "Let’s start. Explain the term “Inspiration” out loud, in your own words.": rect y 150->166
- text "You typed": color rgba(245, 243, 255, 0.68)->rgb(244, 242, 255); nominalRatio 7.26->13.95; rect y 224->240
- text "Inspiration is where ideas come from": rect y 241->257, w 164->308.9
- text "Nice!": rect y 331->327
- text "Unaided": color rgba(245, 243, 255, 0.68)->rgb(244, 242, 255); nominalRatio 7.26->13.95; rect y 359->353
- text "You said: 'It’s the spark that makes you want to create something'": rect y 378->372, w 191.1->230.6

### F10-t2-tryagain-mic-denied-settled

- control "Try again": own x 163.4->167, y 688->687, w 63.2->56, h 80->81; union x 163.4->167, y 688->687, w 63.2->56, h 80->81; effectiveHit x 163->168, w 64->56
- text "Try again": rect x 163.4->167.9, w 63.2->54.2

## Behaviour: state pairs whose identical / not-identical result flipped

Pairs from `pixel-diffs.md` where run 1 and run 2 disagree on "the two screens are pixel-identical". A pair that stays identical or stays different is not listed (percent values for those moved because the Steps row and other components moved; see the tables above).

| group | A | B | run 1 | run 2 |
|---|---|---|---|---|
| voice vs text path | F05-t2-typeInput | F05b-t2-typeInput-filled | 0.516% | identical |
| voice vs text path | F05b-t2-typeInput-filled | F06-t2-typeProcessing-0.5s | 22.797% | identical |
| primary button | F05b-t2-typeInput-filled | F06-t2-typeProcessing-0.5s | 22.797% | identical |

## Behaviour: term 2 typing (F03 to F06b) and denied mic (F09, F10)

Facts from `measure/capture-notes.json`, the aria snapshots and the pixel-diff rows:

- Run 1: on term 2 idle, "Type instead" opened a `typeInput` screen (text field, Submit, Switch to voice); Submit led to `typeProcessing`, which stayed there at 0.5 s and at 7 s (`F06` and `F06b` identical).
- Run 2: on term 2 idle, tapping "Type instead" changes nothing. After the tap there are 0 `input`/`textarea` elements and 0 "Submit" buttons (`F05`), and `F05`, `F05b`, `F06`, `F06b` are each pixel-identical to `F03` (0%). "Type instead" on term 2 has `hasOnClick` false and is not marked as a live hotspot (run 1: true and true). States where the "Type instead" control's handler flipped from present to absent: C08-t2-idle, C12-t2-resultHinted1, C12b-t2-hinted1-idontknow-tap-settled, F03-t2-idle-before-type, F04-t2-idle-idontknow-tap-settled, F10-t2-tryagain-mic-denied-settled, F11-Hinted1-ready-Redo-result.
- Term 1 is unchanged in behaviour: "Type instead" opens the text field, Submit leads to `typeProcessing` and then `typeResultRecalled` (`F07`, `F08`). `X01` and `X02` are the run 2 additions for term 1's empty and filled input; `measure/submit-default-vs-disabled.json` now compares `X02` (Default) with `F07` (Disabled) on term 1 instead of `F05b` / `F06` on term 2.
- Denied mic at term 1 (`F09`): screenshot pixel-identical to `C01` (0%); visible text and aria snapshot unchanged; no console entry mentions the denial (the whole run logged 17 console warnings, all Next.js image warnings, and no errors or page errors; see the console section below). Denied mic at Hinted1 "Try again" (`F10`): pixel-identical to `C12` (0%), same result. This matches run 1, where both were also identical (`startRecording` has an empty `catch`).

## Contrast rows (runs compared with the same two methods)

Rows under 4.5:1 on either number: run 1 16 (59 states), run 2 12 (61 states). Rows are keyed by state, first 80 characters of the text and font size.

In run 1 only (4):

- F06-t2-typeProcessing-0.5s "Submit" 20px/700: nominal 3.69, rendered 3.66
- F06-t2-typeProcessing-0.5s "Switch to voice" 20px/700: nominal 3.69, rendered 3.66
- F06b-t2-typeProcessing-7s "Submit" 20px/700: nominal 3.69, rendered 3.66
- F06b-t2-typeProcessing-7s "Switch to voice" 20px/700: nominal 3.69, rendered 3.66

In run 2 only (0):

none

In both runs, numbers moved (1):

- C13-t2-Hinted1-recording "Hint 1 of 2": nominal 7.26 -> 13.95, rendered 2.74 -> 4.45

## Hit areas

Elements with an effective hit under 44x44: run 1 47 state-element rows over 6 distinct element sizes; run 2 24 rows over 5 distinct sizes.

Under 44 in run 1 and not in run 2: Play recording.

Under 44 in run 2 and not in run 1: none.

Same-named controls whose size changed (own box or effective hit):

- Skip: own 31.2x16 -> 55.2x32; effective hit 50x48 -> 56x48 (39 states: B09-summary-review-destination, C01-t1-idle, C02-t1-idle-mic-pressed, C03-t1-recording-a, C03-t1-recording-b, C04-t1-readyToSend, C05-t1-after-redo, C06-t1-processing, C07-t1-resultRecalled, C08-t2-idle, C09-t2-recording, C10-t2-readyToSend, C11-t2-processing, C12-t2-resultHinted1, C12b-t2-hinted1-idontknow-tap-settled, C13-t2-Hinted1-recording, D01-t2-Hinted1-readyToSend, D02-t2-Hinted1-readyToSend-resume-tap-settled, D03-t2-Hinted1-readyToSend-send-pressed, D04-t2-Hinted1-readyToSend-redo-pressed, D05-t2-Hinted1-processing, E01-t2-Hinted1-recalled, E02-t2-Hinted1-recalled-continue-pressed, F01-reload-after-Hinted1-recalled, C17-t3-idle, C18-t3-resultRevealed, C19-t4-idle, F03-t2-idle-before-type, F04-t2-idle-idontknow-tap-settled, F05-t2-typeInput, F05b-t2-typeInput-filled, F06-t2-typeProcessing-0.5s, F06b-t2-typeProcessing-7s, F07-t1-typeProcessing, F08-t1-typeResultRecalled, F09-t1-mic-denied-settled, F10-t2-tryagain-mic-denied-settled, F11-Hinted1-ready-Redo-result, F12-reload-at-Hinted1-ready)
- Tap to speak: own 88x80 -> 76x81; effective hit 90x80 -> 78x80 (13 states: B09-summary-review-destination, C01-t1-idle, C02-t1-idle-mic-pressed, C05-t1-after-redo, C08-t2-idle, F01-reload-after-Hinted1-recalled, C17-t3-idle, C19-t4-idle, F03-t2-idle-before-type, F04-t2-idle-idontknow-tap-settled, F09-t1-mic-denied-settled, F11-Hinted1-ready-Redo-result, F12-reload-at-Hinted1-ready)
- Play recording: own 257x32 -> 262.5x44; effective hit 258x32 -> 264x44 (2 states: C04-t1-readyToSend, C10-t2-readyToSend)
- Play recording: own 257x32 -> 262.5x44; effective hit 258x32 -> 262x44 (14 states: C06-t1-processing, C07-t1-resultRecalled, C11-t2-processing, C12-t2-resultHinted1, C12b-t2-hinted1-idontknow-tap-settled, C13-t2-Hinted1-recording, D01-t2-Hinted1-readyToSend, D02-t2-Hinted1-readyToSend-resume-tap-settled, D03-t2-Hinted1-readyToSend-send-pressed, D04-t2-Hinted1-readyToSend-redo-pressed, D05-t2-Hinted1-processing, E01-t2-Hinted1-recalled, E02-t2-Hinted1-recalled-continue-pressed, F10-t2-tryagain-mic-denied-settled)
- Try again: own 63.2x80 -> 56x81; effective hit 64x80 -> 56x80 (3 states: C12-t2-resultHinted1, C12b-t2-hinted1-idontknow-tap-settled, F10-t2-tryagain-mic-denied-settled)

Native buttons with no onClick, by name (states in run 1 / run 2):

- More options: 11 / 11
- 🔥 +20% exam score: 11 / 11
- Skip: 38 / 40
- Type instead: 3 / 14
- I don’t know: 15 / 19
- Resume: 6 / 6
- Tap to speak: 2 / 2
- Switch to voice: 1 / 1

## Structure

scrollHeight and scrollWidth are the same in every shared state; no horizontal scroll in either run.

## Animations

See `measure/R-reduced-motion-animations.json`. Run 1: no running animation at any of the 10 loop states, with or without `prefers-reduced-motion`. Run 2: 0 running animations across the 10 loop states without the preference, 0 with it. Per-state `animations` arrays in `measure/<id>.json`: 0 shared states differ in count.

## Command logs

| log | run 1 | run 2 |
|---|---|---|
| check:tokens exit | EXIT=0 | EXIT=0 |
| lint exit | EXIT=0 | EXIT=0 |
| build exit | EXIT=0 | EXIT=0 |
| grep-rgba-hsla.txt matching lines | 16 | 16 |
| grep-hex-raw.txt matching lines | 2 | 2 |
| grep-var-fallback.txt matching lines | 0 | 0 |
| grep-primitives.txt matching lines | 0 | 0 |
| check:tokens summary lines | No token rule violations in src/. | No token rule violations in src/. / Known deviations still unmarked (grandfathered in scripts/check-tokens.baseline.json): 138 (color-fn 5, px-token 127, font-family 5, font-stretch 1). |

### Console warnings and errors

- warning: Image with src "/images/standby.svg" was detected as the Largest Conte: run 1 7, run 2 7
- warning: Image with src "http://localhost:3000/images/thinking.svg" has either : run 1 10, run 2 10
