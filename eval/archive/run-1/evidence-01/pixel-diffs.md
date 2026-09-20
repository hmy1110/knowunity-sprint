# Pixel diffs (390px @2x, dark)

Per-channel tolerance 8. `rgb%` = share of pixels that differ; `luma%` = share that differ in luminance alone. `hue-only` = colour changes with almost no luminance change. Diff images are in `diffs/` (red = changed pixel).

| group | A | B | rgb% | luma% | identical | hue-only | changed box (css px) |
|---|---|---|---|---|---|---|---|
| loop-states t1 | C01-t1-idle | C03-t1-recording-a | 11.393 | 11.347 | no | no | 16,18 358x797 |
| loop-states t1 | C01-t1-idle | C06-t1-processing | 13.404 | 13.296 | no | no | 16,152 358x663 |
| loop-states t1 | C01-t1-idle | C07-t1-resultRecalled | 25.312 | 25.181 | no | no | 17,152 357x664 |
| loop-states t1 | C03-t1-recording-a | C04-t1-readyToSend | 14.88 | 14.168 | no | no | 16,18 358x797 |
| loop-states t1 | C03-t1-recording-a | C06-t1-processing | 15.033 | 13.178 | no | no | 16,18 358x797 |
| loop-states t1 | C04-t1-readyToSend | C06-t1-processing | 16.833 | 16.022 | no | no | 16,152 358x663 |
| loop-states t1 | C06-t1-processing | C07-t1-resultRecalled | 15.539 | 15.427 | no | no | 16,256 346x560 |
| loop-states t2 | C08-t2-idle | C09-t2-recording | 11.396 | 11.35 | no | no | 16,18 358x797 |
| loop-states t2 | C09-t2-recording | C10-t2-readyToSend | 14.883 | 14.171 | no | no | 16,18 358x797 |
| loop-states t2 | C10-t2-readyToSend | C11-t2-processing | 16.856 | 16.047 | no | no | 16,152 358x663 |
| loop-states t2 | C11-t2-processing | C12-t2-resultHinted1 | 12.487 | 12.38 | no | no | 16,256 328x559 |
| loop-states t2 | C12-t2-resultHinted1 | C13-t2-Hinted1-recording | 19.338 | 19.258 | no | no | 16,18 358x797 |
| loop-states t2 | C13-t2-Hinted1-recording | D01-t2-Hinted1-readyToSend | 22.821 | 22.071 | no | no | 16,18 358x797 |
| loop-states t2 | D01-t2-Hinted1-readyToSend | D05-t2-Hinted1-processing | 21.837 | 21.047 | no | no | 16,256 358x559 |
| loop-states t2 | D05-t2-Hinted1-processing | E01-t2-Hinted1-recalled | 19.268 | 19.157 | no | no | 16,425 346x391 |
| loop-states t2 | C12-t2-resultHinted1 | E01-t2-Hinted1-recalled | 33.757 | 33.646 | no | no | 16,256 358x560 |
| loop-states t2 | C08-t2-idle | E01-t2-Hinted1-recalled | 32.591 | 32.46 | no | no | 16,152 358x664 |
| ready-to-send siblings | D01-t2-Hinted1-readyToSend | C10-t2-readyToSend | 19.937 | 19.808 | no | no | 16.5,152 357.5x263 |
| ready-to-send siblings | D01-t2-Hinted1-readyToSend | C04-t1-readyToSend | 20.321 | 20.191 | no | no | 16.5,64 357.5x351 |
| result outcomes | C07-t1-resultRecalled | C12-t2-resultHinted1 | 10.175 | 10.166 | no | no | 16.5,64 347.5x752 |
| result outcomes | C07-t1-resultRecalled | E01-t2-Hinted1-recalled | 28.736 | 28.625 | no | no | 16,64 358x560 |
| result outcomes | C07-t1-resultRecalled | C18-t3-resultRevealed | 9.93 | 9.805 | no | no | 16,64 358x343 |
| result outcomes | C12-t2-resultHinted1 | C18-t3-resultRevealed | 16.198 | 16.065 | no | no | 16,64 358x752 |
| result outcomes | E01-t2-Hinted1-recalled | C18-t3-resultRevealed | 32.095 | 31.974 | no | no | 16,64 358x560 |
| result outcomes | F08-t1-typeResultRecalled | C07-t1-resultRecalled | 25.758 | 25.626 | no | no | 16,208 358x608 |
| micButton | C01-t1-idle | C02-t1-idle-mic-pressed | 0 | 0 | YES | no | - |
| micButton | C01-t1-idle | C03-t1-recording-a | 11.393 | 11.347 | no | no | 16,18 358x797 |
| micButton | C01-t1-idle | C06-t1-processing | 13.404 | 13.296 | no | no | 16,152 358x663 |
| micButton | C02-t1-idle-mic-pressed | C03-t1-recording-a | 11.393 | 11.347 | no | no | 16,18 358x797 |
| voice vs text path | C06-t1-processing | F07-t1-typeProcessing | 23.647 | 23.572 | no | no | 16,208 358x608 |
| voice vs text path | C01-t1-idle | F07-t1-typeProcessing | 26.504 | 26.394 | no | no | 16,152 358x664 |
| voice vs text path | C01-t1-idle | F05-t2-typeInput | 16.837 | 16.836 | no | no | 16,64 358x752 |
| voice vs text path | F05-t2-typeInput | F05b-t2-typeInput-filled | 0.574 | 0.574 | no | no | 29,275 332x14 |
| voice vs text path | F05b-t2-typeInput-filled | F06-t2-typeProcessing-0.5s | 22.838 | 22.726 | no | no | 16,152 358x640.5 |
| primary button | A01-studyplan-notStarted-default | A02-studyplan-notStarted-speak-pressed | 0 | 0 | YES | no | - |
| primary button | B02-summary-bottom-baseline | B02b-summary-review-pressed-scrolled | 0 | 0 | YES | no | - |
| primary button | B02-summary-bottom-baseline | B03b-summary-continue-pressed-scrolled | 0 | 0 | YES | no | - |
| primary button | E01-t2-Hinted1-recalled | E02-t2-Hinted1-recalled-continue-pressed | 0 | 0 | YES | no | - |
| primary button | D01-t2-Hinted1-readyToSend | D03-t2-Hinted1-readyToSend-send-pressed | 0 | 0 | YES | no | - |
| primary button | D01-t2-Hinted1-readyToSend | D04-t2-Hinted1-readyToSend-redo-pressed | 0 | 0 | YES | no | - |
| primary button | F05b-t2-typeInput-filled | F06-t2-typeProcessing-0.5s | 22.838 | 22.726 | no | no | 16,152 358x640.5 |
| studyplan states | A01-studyplan-notStarted-default | A07-studyplan-inProgress-REFERENCE | 3.443 | 3.443 | no | no | 16,625 358x137 |
| studyplan states | A01-studyplan-notStarted-default | A08-studyplan-finish-REFERENCE | 4.056 | 4.056 | no | no | 16,625 358x137 |
| studyplan states | A07-studyplan-inProgress-REFERENCE | A08-studyplan-finish-REFERENCE | 1.534 | 1.532 | no | no | 30,625 332x52 |
| summary variants | B01-summary-mixed-default-full | B04-summary-all-recalled-full | size mismatch 780x2488 vs 780x2168 | | no | | |
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
| failure: Redo from Hinted1 ready | C12-t2-resultHinted1 | F11-Hinted1-ready-Redo-result | 20.086 | 19.957 | no | no | 16.5,152 357.5x615 |
| motion (same state, time apart) | C03-t1-recording-a | C03-t1-recording-b | 0 | 0 | YES | no | - |
