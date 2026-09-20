# Pixel diffs (390px @2x, dark)

Per-channel tolerance 8. `rgb%` = share of pixels that differ; `luma%` = share that differ in luminance alone. `hue-only` = colour changes with almost no luminance change. Diff images are in `diffs/` (red = changed pixel).

| group | A | B | rgb% | luma% | identical | hue-only | changed box (css px) |
|---|---|---|---|---|---|---|---|
| loop-states t1 | C01-t1-idle | C03-t1-recording-a | 11.336 | 11.288 | no | no | 16,18 357x796.5 |
| loop-states t1 | C01-t1-idle | C06-t1-processing | 13.336 | 13.23 | no | no | 16,152 358x663 |
| loop-states t1 | C01-t1-idle | C07-t1-resultRecalled | 25.319 | 25.19 | no | no | 16.5,152 357.5x664 |
| loop-states t1 | C03-t1-recording-a | C04-t1-readyToSend | 14.845 | 14.135 | no | no | 16,18 357x796.5 |
| loop-states t1 | C03-t1-recording-a | C06-t1-processing | 14.962 | 13.156 | no | no | 16,18 358x797 |
| loop-states t1 | C04-t1-readyToSend | C06-t1-processing | 16.77 | 15.961 | no | no | 16,152 358x663 |
| loop-states t1 | C06-t1-processing | C07-t1-resultRecalled | 15.551 | 15.439 | no | no | 16,256 346x560 |
| loop-states t2 | C08-t2-idle | C09-t2-recording | 11.341 | 11.293 | no | no | 16,18 357x796.5 |
| loop-states t2 | C09-t2-recording | C10-t2-readyToSend | 14.85 | 14.139 | no | no | 16,18 357x796.5 |
| loop-states t2 | C10-t2-readyToSend | C11-t2-processing | 16.79 | 15.983 | no | no | 16,152 358x663 |
| loop-states t2 | C11-t2-processing | C12-t2-resultHinted1 | 14.051 | 13.945 | no | no | 16,256 328x559 |
| loop-states t2 | C12-t2-resultHinted1 | C13-t2-Hinted1-recording | 20.719 | 20.638 | no | no | 16,18 358x796.5 |
| loop-states t2 | C13-t2-Hinted1-recording | D01-t2-Hinted1-readyToSend | 24.224 | 23.478 | no | no | 16,18 358x796.5 |
| loop-states t2 | D01-t2-Hinted1-readyToSend | D05-t2-Hinted1-processing | 23.332 | 22.519 | no | no | 16,256 358x559 |
| loop-states t2 | D05-t2-Hinted1-processing | E01-t2-Hinted1-recalled | 19.28 | 19.169 | no | no | 16,425 346x391 |
| loop-states t2 | C12-t2-resultHinted1 | E01-t2-Hinted1-recalled | 33.982 | 33.849 | no | no | 16,256 358x560 |
| loop-states t2 | C08-t2-idle | E01-t2-Hinted1-recalled | 32.599 | 32.47 | no | no | 16,152 358x664 |
| ready-to-send siblings | D01-t2-Hinted1-readyToSend | C10-t2-readyToSend | 21.35 | 21.222 | no | no | 17,152 357x283 |
| ready-to-send siblings | D01-t2-Hinted1-readyToSend | C04-t1-readyToSend | 21.728 | 21.6 | no | no | 17,64 357x371 |
| result outcomes | C07-t1-resultRecalled | C12-t2-resultHinted1 | 12.038 | 12.029 | no | no | 16.5,64 345.5x752 |
| result outcomes | C07-t1-resultRecalled | E01-t2-Hinted1-recalled | 28.791 | 28.671 | no | no | 16,64 358x560 |
| result outcomes | C07-t1-resultRecalled | C18-t3-resultRevealed | 8.034 | 7.98 | no | no | 16.5,64 357.5x323.5 |
| result outcomes | C12-t2-resultHinted1 | C18-t3-resultRevealed | 15.728 | 15.598 | no | no | 19,64 355x752 |
| result outcomes | E01-t2-Hinted1-recalled | C18-t3-resultRevealed | 31.932 | 31.8 | no | no | 16,64 358x560 |
| result outcomes | F08-t1-typeResultRecalled | C07-t1-resultRecalled | 25.834 | 25.703 | no | no | 16,208 358x608 |
| micButton | C01-t1-idle | C02-t1-idle-mic-pressed | 0 | 0 | YES | no | - |
| micButton | C01-t1-idle | C03-t1-recording-a | 11.336 | 11.288 | no | no | 16,18 357x796.5 |
| micButton | C01-t1-idle | C06-t1-processing | 13.336 | 13.23 | no | no | 16,152 358x663 |
| micButton | C02-t1-idle-mic-pressed | C03-t1-recording-a | 11.336 | 11.288 | no | no | 16,18 357x796.5 |
| voice vs text path | C06-t1-processing | F07-t1-typeProcessing | 23.675 | 23.6 | no | no | 16,208 358x608 |
| voice vs text path | C01-t1-idle | F07-t1-typeProcessing | 26.482 | 26.375 | no | no | 16,152 358x664 |
| voice vs text path | C01-t1-idle | F05-t2-typeInput | 16.487 | 16.486 | no | no | 16,64 358x752 |
| voice vs text path | F05-t2-typeInput | F05b-t2-typeInput-filled | 0.516 | 0.516 | no | no | 29.5,275 331x14 |
| voice vs text path | F05b-t2-typeInput-filled | F06-t2-typeProcessing-0.5s | 22.797 | 22.687 | no | no | 16,152 358x640.5 |
| primary button | A01-studyplan-notStarted-default | A02-studyplan-notStarted-speak-pressed | 0 | 0 | YES | no | - |
| primary button | B02-summary-bottom-baseline | B02b-summary-review-pressed-scrolled | 0 | 0 | YES | no | - |
| primary button | B02-summary-bottom-baseline | B03b-summary-continue-pressed-scrolled | 0 | 0 | YES | no | - |
| primary button | E01-t2-Hinted1-recalled | E02-t2-Hinted1-recalled-continue-pressed | 0 | 0 | YES | no | - |
| primary button | D01-t2-Hinted1-readyToSend | D03-t2-Hinted1-readyToSend-send-pressed | 0 | 0 | YES | no | - |
| primary button | D01-t2-Hinted1-readyToSend | D04-t2-Hinted1-readyToSend-redo-pressed | 0 | 0 | YES | no | - |
| primary button | F05b-t2-typeInput-filled | F06-t2-typeProcessing-0.5s | 22.797 | 22.687 | no | no | 16,152 358x640.5 |
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
| failure: Redo from Hinted1 ready | C12-t2-resultHinted1 | F11-Hinted1-ready-Redo-result | 21.486 | 21.359 | no | no | 17,152 357x615 |
| motion (same state, time apart) | C03-t1-recording-a | C03-t1-recording-b | 0 | 0 | YES | no | - |
