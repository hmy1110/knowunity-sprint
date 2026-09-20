# Pixel diffs (390px @2x, dark)

Per-channel tolerance 8. `rgb%` = share of pixels that differ; `luma%` = share that differ in luminance alone. `hue-only` = colour changes with almost no luminance change. Diff images are in `diffs/` (red = changed pixel); an identical pair has no image.

| group | A | B | rgb% | luma% | identical | hue-only | changed box (css px) |
|---|---|---|---|---|---|---|---|
| loop-states t1 | C01-t1-idle | C03-t1-recording-a | 12.363 | 12.316 | no | no | 16,18 358x796.5 |
| loop-states t1 | C01-t1-idle | C06-t1-processing | 15.595 | 15.488 | no | no | 16,168 358x647 |
| loop-states t1 | C01-t1-idle | C07-t1-resultRecalled | 28.683 | 28.569 | no | no | 16.5,168 357.5x648 |
| loop-states t1 | C03-t1-recording-a | C04-t1-readyToSend | 16.797 | 16.085 | no | no | 16,18 358x796.5 |
| loop-states t1 | C03-t1-recording-a | C06-t1-processing | 17.213 | 14.726 | no | no | 16,18 358x797 |
| loop-states t1 | C04-t1-readyToSend | C06-t1-processing | 19.957 | 19.148 | no | no | 16,168 358x647 |
| loop-states t1 | C06-t1-processing | C07-t1-resultRecalled | 19.078 | 18.96 | no | no | 16,170 358x646 |
| loop-states t2 | C08-t2-idle | C09-t2-recording | 12.368 | 12.321 | no | no | 16,18 358x796.5 |
| loop-states t2 | C09-t2-recording | C10-t2-readyToSend | 16.802 | 16.089 | no | no | 16,18 358x796.5 |
| loop-states t2 | C10-t2-readyToSend | C11-t2-processing | 19.967 | 19.16 | no | no | 16,168 358x647 |
| loop-states t2 | C11-t2-processing | C12-t2-resultHinted1 | 12.918 | 12.812 | no | no | 16,284 358x531 |
| loop-states t2 | C12-t2-resultHinted1 | C13-t2-Hinted1-recording | 21.809 | 21.724 | no | no | 16,18 358x796.5 |
| loop-states t2 | C13-t2-Hinted1-recording | D01-t2-Hinted1-readyToSend | 26.249 | 25.497 | no | no | 16,18 358x796.5 |
| loop-states t2 | D01-t2-Hinted1-readyToSend | D05-t2-Hinted1-processing | 25.565 | 24.768 | no | no | 16,284 358x531 |
| loop-states t2 | D05-t2-Hinted1-processing | E01-t2-Hinted1-recalled | 20.235 | 20.126 | no | no | 16,465 358x351 |
| loop-states t2 | C12-t2-resultHinted1 | E01-t2-Hinted1-recalled | 37.65 | 37.532 | no | no | 16,284 358x532 |
| loop-states t2 | C08-t2-idle | E01-t2-Hinted1-recalled | 36.813 | 36.683 | no | no | 16,168 358x648 |
| ready-to-send siblings | D01-t2-Hinted1-readyToSend | C10-t2-readyToSend | 22.743 | 22.615 | no | no | 17,168 357x273 |
| ready-to-send siblings | D01-t2-Hinted1-readyToSend | C04-t1-readyToSend | 23.121 | 22.993 | no | no | 17,64 357x377 |
| result outcomes | C07-t1-resultRecalled | C12-t2-resultHinted1 | 12.464 | 12.455 | no | no | 16.5,64 357.5x752 |
| result outcomes | C07-t1-resultRecalled | E01-t2-Hinted1-recalled | 34.411 | 34.284 | no | no | 16,64 358x598 |
| result outcomes | C07-t1-resultRecalled | C18-t3-resultRevealed | 14.261 | 14.129 | no | no | 16.5,64 357.5x377 |
| result outcomes | C12-t2-resultHinted1 | C18-t3-resultRevealed | 18.715 | 18.584 | no | no | 19,64 355x752 |
| result outcomes | E01-t2-Hinted1-recalled | C18-t3-resultRevealed | 36.5 | 36.367 | no | no | 16,64 358x598 |
| result outcomes | F08-t1-typeResultRecalled | C07-t1-resultRecalled | 24.862 | 24.843 | no | no | 16,170 358x646 |
| micButton | C01-t1-idle | C02-t1-idle-mic-pressed | 0 | 0 | YES | no | - |
| micButton | C01-t1-idle | C03-t1-recording-a | 12.363 | 12.316 | no | no | 16,18 358x796.5 |
| micButton | C01-t1-idle | C06-t1-processing | 15.595 | 15.488 | no | no | 16,168 358x647 |
| micButton | C02-t1-idle-mic-pressed | C03-t1-recording-a | 12.363 | 12.316 | no | no | 16,18 358x796.5 |
| voice vs text path | C06-t1-processing | F07-t1-typeProcessing | 25.232 | 25.154 | no | no | 16,224 358x592 |
| voice vs text path | C01-t1-idle | F07-t1-typeProcessing | 28.363 | 28.256 | no | no | 16,168 358x648 |
| voice vs text path | C01-t1-idle | F05-t2-typeInput | 1.377 | 1.376 | no | no | 59,64 287x178.5 |
| voice vs text path | F05-t2-typeInput | F05b-t2-typeInput-filled | 0 | 0 | YES | no | - |
| voice vs text path | F05b-t2-typeInput-filled | F06-t2-typeProcessing-0.5s | 0 | 0 | YES | no | - |
| primary button | A01-studyplan-notStarted-default | A02-studyplan-notStarted-speak-pressed | 0 | 0 | YES | no | - |
| primary button | B02-summary-bottom-baseline | B02b-summary-review-pressed-scrolled | 0 | 0 | YES | no | - |
| primary button | B02-summary-bottom-baseline | B03b-summary-continue-pressed-scrolled | 0 | 0 | YES | no | - |
| primary button | E01-t2-Hinted1-recalled | E02-t2-Hinted1-recalled-continue-pressed | 0 | 0 | YES | no | - |
| primary button | D01-t2-Hinted1-readyToSend | D03-t2-Hinted1-readyToSend-send-pressed | 0 | 0 | YES | no | - |
| primary button | D01-t2-Hinted1-readyToSend | D04-t2-Hinted1-readyToSend-redo-pressed | 0 | 0 | YES | no | - |
| primary button | F05b-t2-typeInput-filled | F06-t2-typeProcessing-0.5s | 0 | 0 | YES | no | - |
| studyplan states | A01-studyplan-notStarted-default | A07-studyplan-inProgress-REFERENCE | 3.358 | 3.358 | no | no | 16,625 358x137 |
| studyplan states | A01-studyplan-notStarted-default | A08-studyplan-finish-REFERENCE | 3.991 | 3.991 | no | no | 16,625 358x137 |
| studyplan states | A07-studyplan-inProgress-REFERENCE | A08-studyplan-finish-REFERENCE | 1.542 | 1.54 | no | no | 30,625 332x52 |
| summary variants | B01-summary-mixed-default-full | B04-summary-all-recalled-full | size mismatch 780x2432 vs 780x2208 | | no | | |
| tap: kebab | A01-studyplan-notStarted-default | A03-studyplan-kebab-tap-settled | 0 | 0 | YES | no | - |
| tap: topic node | A01-studyplan-notStarted-default | A04-studyplan-topicnode-tap-settled | 0 | 0 | YES | no | - |
| tap: bottom nav | A01-studyplan-notStarted-default | A05-studyplan-bottomnav-tap-settled | 0 | 0 | YES | no | - |
| tap: "I don’t know" on Hinted1 | C12-t2-resultHinted1 | C12b-t2-hinted1-idontknow-tap-settled | 0 | 0 | YES | no | - |
| tap: Resume on Hinted1 ready-to-send | D01-t2-Hinted1-readyToSend | D02-t2-Hinted1-readyToSend-resume-tap-settled | 0 | 0 | YES | no | - |
| tap: "I don’t know" on term 2 idle | F03-t2-idle-before-type | F04-t2-idle-idontknow-tap-settled | 0 | 0 | YES | no | - |
| invalid param | A01-studyplan-notStarted-default | A06-studyplan-state-bogus | 0 | 0 | YES | no | - |
| invalid param | B01-summary-mixed-default-full | B05-summary-variant-bogus-full | 0 | 0 | YES | no | - |
| summary derivation | B01-summary-mixed-default-full | B10-summary-after-real-session-full | 0 | 0 | YES | no | - |
| failure: reload | C01-t1-idle | F01-reload-after-Hinted1-recalled | 0 | 0 | YES | no | - |
| failure: reload | C01-t1-idle | F12-reload-at-Hinted1-ready | 0 | 0 | YES | no | - |
| failure: mic denied t1 | C01-t1-idle | F09-t1-mic-denied-settled | 0 | 0 | YES | no | - |
| failure: mic denied Try again | C12-t2-resultHinted1 | F10-t2-tryagain-mic-denied-settled | 0 | 0 | YES | no | - |
| failure: text path stuck | F06-t2-typeProcessing-0.5s | F06b-t2-typeProcessing-7s | 0 | 0 | YES | no | - |
| failure: Redo from Hinted1 ready | C08-t2-idle | F11-Hinted1-ready-Redo-result | 0 | 0 | YES | no | - |
| failure: Redo from Hinted1 ready | C12-t2-resultHinted1 | F11-Hinted1-ready-Redo-result | 22.876 | 22.749 | no | no | 17,168 357x599 |
| motion (same state, time apart) | C03-t1-recording-a | C03-t1-recording-b | 0 | 0 | YES | no | - |
| run-2 addition: term 1 typeInput vs filled | X01-t1-typeInput | X02-t1-typeInput-filled | 0.458 | 0.458 | no | no | 29.5,291 282.5x14 |
| run-2 addition: term 1 Submit Default vs Disabled | X02-t1-typeInput-filled | F07-t1-typeProcessing | 24.641 | 24.53 | no | no | 16,168 358x624.5 |
| run-2 addition: term 1 idle vs typeInput | C01-t1-idle | X01-t1-typeInput | 15.466 | 15.466 | no | no | 16,276 358x540 |
| run-2 addition: term 2 idle vs after "Type instead" tap | F03-t2-idle-before-type | F05-t2-typeInput | 0 | 0 | YES | no | - |
| run-2 addition: term 2 idle vs 7s after "Type instead" tap | F03-t2-idle-before-type | F06b-t2-typeProcessing-7s | 0 | 0 | YES | no | - |
