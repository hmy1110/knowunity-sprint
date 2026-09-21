# Sprint Context

Voice-based active-recall feature for Knowunity. A student speaks a term out loud from memory and Knowie replies in text only, judged generously, with a hint-then-reveal ladder so no attempt is a dead end.

**Committed concept:** A 3 to 5 term voice-in, text-out recall session that never gates section progress, earns its summary by tracking exactly how each term was answered (Recalled, hinted, revealed, or skipped).

**Where it lives:** Final placement is still open per the brief, so the entry screen's "back to" destination isn't locked yet.

## Decisions logged

- Merge partial and fail into one surfaced "needs practice" result state, because the distinction isn't legible to a student in the moment (the judge still tracks it internally to size the hint).
- Cut the hint ladder to one hint plus reveal as the built path, second hint is if-time only, because one hint plus reveal already satisfies "every required action has a way out."
- Declining the module never gates section completion.
- **2026-09-21, Mia: the session is a freer mocked flow, not a fixed script.** Every term can be answered by voice or by typing, and the mode sticks until switched. A normal attempt resolves by term number (1 Recalled, 2 Hinted, 3 Revealed, 4 Recalled); "I don't know" is Revealed; Skip (only before an attempt) is Skipped. Still mocked: no STT or judging.
- **2026-09-21, Mia: review covers the terms not yet recalled.** A normal attempt in it is Recalled; Skip and "I don't know" work too, so a review can end with terms still missed. After closing the session early, the study plan button reads "Continue" (same run as "Review").
- **2026-09-21, Mia: Summary and the study plan read the recorded session.** Percent and SCORE are Recalled ÷ total, XP is 2 per Recalled term, the study plan state follows how many terms were ever recalled. BLAZING is derived from the statuses, not timed (Recalled 0:20, Hinted 0:30, Revealed 0:15, Skipped 0:04; 0:43 per Recalled review term). No term recalled: headline "Let’s go again, Mia."
- **2026-09-21, Mia: "Resume" continues the same take** (paused, not restarted), reversing the earlier "no pause/resume" cut. The typed Hinted, retry and Revealed states have no Figma frame and were built from the voice frames.
- **2026-09-21, Mia: every control is live.** The hotspot-hint layer that pointed testers to live controls was removed; a control that does nothing is a defect.
- Keep the XP/lightning badge separate from the chips component.
- Build tag as its own new component for the summary's per-term status labels (Recalled/Hinted/Revealed/Skipped), because chips can't take that shape without forcing it.
- Build table/tableCell as new components (2026-09-16) wrapping tag in a labeled row list, because the summary's per-term breakdown needs each status pill paired with its term's label, not 4 bare tag pills.
- Summary's per-term rows always display Recalled → Hinted → Revealed → Skipped (good to bad), Skipped always last, enforced in Table's own code regardless of the order rows are passed in.
- Build scoreBreakdown and termResultList as new hand-built code components (2026-09-16) for Summary's "X% recalled" bar and per-term explanations, because neither exists as a real Figma component — Figma's own layer names flag them as "custom, no matching component."
- termResultList's title color is status-tinted (accent/green/bold, pro/bold, feedback/error/bold, text/secondary), a deliberate departure from the real Figma node, which binds all four titles to plain text/primary.
- Built sessionStats (the XP/Score/time row) the same way, then removed it the same day after review ("doesn't look right") — flagged for a fresh attempt later rather than rebuilt immediately.
- Name stroke tokens semantically (stroke/Border, stroke/Heavy-Border) instead of a numbered step.
- Use the Standard width (wdth 100) of Greed VF-TRIAL everywhere, pinned as `font-stretch: normal` in `globals.css`, because the font ships five widths and its own default is Condensed (wdth 75). `tokens.json` carries no width token, so this sits in CSS until Figma exports one.
- Both processing screens (Learning-processing, Learning-typeProcessing) cover the wait with button/Disabled plus speechBubble/Loading, not button/Loading, because that pairing already has real instances on the text path while button/Loading has none, and Disabled keeps the button's label readable so the wait doesn't erase what the student just did.

## Explicitly not building

- No tutoring branch. If a student asks Knowie a question mid-recall, it doesn't turn into a conversation.
- No auto-endpointing. Push-to-talk with an explicit stop and send, never a guessed cutoff.
- No voice output. Knowie never speaks, every response is on screen.
- No real STT or AI judging. Transcript and verdict are hardcoded this sprint.
- No native permission sheets, haptics, or nav transitions. This is a web app built to look like iOS, so anything native gets rebuilt by hand.
- No mic-busy handling, no mid-answer language switching. Flagged out of scope in Voice UX Reference. ("No pause/resume into one take" was cut here too; it was reversed 2026-09-21, see the decisions logged below.)
- No Android, web, tablet, or light mode. iPhone at 390px, dark mode only.
- No button/Loading. All 9 Loading variants still sit in the button component set, but nothing uses them and nothing will this sprint. Treat the state as unavailable.
