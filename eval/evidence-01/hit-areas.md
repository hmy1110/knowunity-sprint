# Hit areas (interactive elements, enabled only)

"effective hit" = bounding box of every 2px grid point inside the element's own box plus its descendants' boxes where `elementFromPoint` lands inside the element. That is the tappable area, not the glyph. "under 44" is w<44 or h<44 CSS px. A native `<button>` with no React `onClick` is listed as inert. Full data: `measure/hit-areas.json`.

## Under 44x44 (one row per element per state, deduplicated by name+size)

| element | tag | own | union | effective hit | states seen |
|---|---|---|---|---|---|
| 🔥 +20% exam score | button | 102.8x20 | 102.8x20 | 104x20 | A01-studyplan-notStarted-default, A02-studyplan-notStarted-speak-pressed, A03-studyplan-kebab-tap-settled, A04-studyplan-topicnode-tap-settled, A05-studyplan-bottomnav-tap-settled, A06-studyplan-state-bogus (+5) |
| Speak | button | 89.6x32 | 89.6x32 | 90x32 | A01-studyplan-notStarted-default, A02-studyplan-notStarted-speak-pressed, A03-studyplan-kebab-tap-settled, A04-studyplan-topicnode-tap-settled, A05-studyplan-bottomnav-tap-settled, A06-studyplan-state-bogus (+2) |
| Review | button | 95x32 | 95x32 | 96x32 | A07-studyplan-inProgress-REFERENCE, B08-summary-continue-destination |
| Redo | button | 81.3x32 | 81.3x32 | 82x32 | A08-studyplan-finish-REFERENCE |
| Play recording | button (aria-label="Play recording") | 257x32 | 257x32 | 258x32 | C04-t1-readyToSend, C06-t1-processing, C07-t1-resultRecalled, C10-t2-readyToSend, C11-t2-processing, C12-t2-resultHinted1 (+17) |
| Type a short answer | input (aria-label="Type a short answer") | 358x42 | 358x42 | 358x42 | F05-t2-typeInput, F05b-t2-typeInput-filled |

## Native <button> with no onClick handler

| state | name | marked as live (data-hotspot*) |
|---|---|---|
| A01-studyplan-notStarted-default, A02-studyplan-notStarted-speak-pressed, A03-studyplan-kebab-tap-settled, A04-studyplan-topicnode-tap-settled, A05-studyplan-bottomnav-tap-settled (+6) | More options | false |
| A01-studyplan-notStarted-default, A02-studyplan-notStarted-speak-pressed, A03-studyplan-kebab-tap-settled, A04-studyplan-topicnode-tap-settled, A05-studyplan-bottomnav-tap-settled (+6) | 🔥 +20% exam score | false |
| B09-summary-review-destination, C01-t1-idle, C02-t1-idle-mic-pressed, C03-t1-recording-a, C03-t1-recording-b (+33) | Skip | false |
| B09-summary-review-destination, C17-t3-idle, C19-t4-idle | Type instead | false |
| B09-summary-review-destination, C01-t1-idle, C02-t1-idle-mic-pressed, C05-t1-after-redo, C08-t2-idle (+10) | I don’t know | false |
| C04-t1-readyToSend, C10-t2-readyToSend, D01-t2-Hinted1-readyToSend, D02-t2-Hinted1-readyToSend-resume-tap-settled, D03-t2-Hinted1-readyToSend-send-pressed (+1) | Resume | false |
| C17-t3-idle, C19-t4-idle | Tap to speak | false |
| F08-t1-typeResultRecalled | Switch to voice | false |
