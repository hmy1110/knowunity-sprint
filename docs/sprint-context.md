# Sprint Context

Voice-based active-recall feature for Knowunity. A student speaks a term out loud from memory and Knowie replies in text only, judged generously, with a hint-then-reveal ladder so no attempt is a dead end.

**Committed concept:** A 3 to 5 term voice-in, text-out recall session that never gates section progress, earns its summary by tracking exactly how each term was answered (Recalled, hinted, revealed, or skipped).

**Where it lives:** Final placement is still open per the brief, so the entry screen's "back to" destination isn't locked yet.

## Decisions logged

- Merge partial and fail into one surfaced "needs practice" result state, because the distinction isn't legible to a student in the moment (the judge still tracks it internally to size the hint).
- Cut the hint ladder to one hint plus reveal as the built path, second hint is if-time only, because one hint plus reveal already satisfies "every required action has a way out."
- Declining the module never gates section completion.
- Keep the XP/lightning badge separate from the chips component.
- Build tag as its own new component for the summary's per-term status labels (Recalled/Hinted/Revealed/Skipped), because chips can't take that shape without forcing it.
- Name stroke tokens semantically (stroke/Border, stroke/Heavy-Border) instead of a numbered step.
- Both processing screens (Learning-processing, Learning-typeProcessing) cover the wait with button/Disabled plus speechBubble/Loading, not button/Loading, because that pairing already has real instances on the text path while button/Loading has none, and Disabled keeps the button's label readable so the wait doesn't erase what the student just did.

## Explicitly not building

- No tutoring branch. If a student asks Knowie a question mid-recall, it doesn't turn into a conversation.
- No auto-endpointing. Push-to-talk with an explicit stop and send, never a guessed cutoff.
- No voice output. Knowie never speaks, every response is on screen.
- No real STT or AI judging. Transcript and verdict are hardcoded this sprint.
- No native permission sheets, haptics, or nav transitions. This is a web app built to look like iOS, so anything native gets rebuilt by hand.
- No mic-busy handling, no mid-answer language switching, no pause/resume into one take. Flagged out of scope in Voice UX Reference.
- No Android, web, tablet, or light mode. iPhone at 390px, dark mode only.
- No button/Loading. All 9 Loading variants still sit in the button component set, but nothing uses them and nothing will this sprint. Treat the state as unavailable.
