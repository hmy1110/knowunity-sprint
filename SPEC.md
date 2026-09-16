# Spec: voice active-recall prototype

This prototype is the Next.js app in this repo (`src/app/`). Every screen listed below is a page with its own route, reached by the student clicking through the flow — not a Storybook story. Storybook stays the component catalog only: it's where each component's states get built and screenshotted in isolation, never where the student navigates.

## What we're building

A mocked, voice-in/text-out active-recall loop: a student explains 4 art&design terms out loud (or types, if they can't speak), Knowie replies in text with a hardcoded verdict per term, and a summary shows how each one was answered. No real speech-to-text, no real judging, no voice output.

## Screen list, build order (easiest first)

1. **Study plan entry** — `/` — `src/app/page.tsx`
2. **Primer** — `/primer` — `src/app/primer/page.tsx`
3. **Summary** — `/summary` — `src/app/summary/page.tsx`
4. **Session (the recall loop)** — `/session` — `src/app/session/page.tsx`

Session is last and hardest: it's a single route that cycles through many internal states across 4 terms via client-side React state, not sub-routes. Build Summary against a hardcoded sample result array first; wire it to Session's real output last.

---

## 1. Study plan entry — `/`

**States** (derived from a local recall-session record, not fetched):
- `notStarted` — no record exists yet
- `inProgress` — a record exists, fewer than 4 terms resolved
- `finish` — a record exists, all 4 terms resolved

**Components**
- `AppBar` `variant="rightIconButtonOnly"` — kebab-menu-only row, the confirmed real StudyPlan appBar row (`AppBar/AppBar.tsx`). `rightIcon` = an `IconSlot` wrapping a kebab icon, `rightLabel="More options"`.
- `Button` `variant="Secondary"` `size="S"` `showRightIcon` — `cta="Speak"` on `notStarted` (confirmed real study-plan-card label per design-system.md), `cta="Redo"` on `inProgress`/`finish` (the other confirmed real label on this same card).
- `ProgressIndicator` `variant="Primary"` `thickness="16"` `progress="25"|"50"|"75"` — on `inProgress` only, reflecting terms resolved so far.

**What the student can do / where it leads**
- `notStarted`: tap "Speak" → `/primer`.
- `inProgress`: tap "Speak" → `/session` (resumes at the next unresolved term, skipping the Primer/permission screen — resolved: permission was already granted, so there's nothing left for Primer to gate).
- `finish`: tap "Redo" → `/session`, scoped to only this session's previously unresolved (Hinted/Revealed/Skipped) terms — resolved: same retry-only-what-wasn't-recalled behavior as Summary's "Review what you missed" below, not a fresh 4-term run.

---

## 2. Primer — `/primer`

**States**
- `intro` (Primer-intro) — default
- `micDenied` (Primer-micDenied) — after a real `getUserMedia` rejection

**Components**
- `AppBar` `variant="leftIconButtonOnly"` — `leftIcon` = `IconSlot` wrapping an X/close icon, `leftLabel="Close"`. `children` = `ProgressIndicator` (`progress="0"`, untested value per design-system.md — flag before relying on it).
- `MascotSlot` `size="2XL"` `pose="standby"` (`MascotSlot/MascotSlot.tsx`) — size/pose choice is inferred from the loop's own convention, not separately confirmed for Primer.
- `TextBlock` `variant="L"` `showCaption={false}` (`TextBlock/TextBlock.tsx`) — real headline confirmed on the live Primer-intro instance: "Explain it to Knowie". Resolved: title only, no caption — the real instance's three extra caption-style lines ("Explain 4 topics from section 1", "Stuck? Knowie guides you", "Explain out loud helps you score up to 20% higher on exams") are not used.
- `Button` `variant="Primary"` `size="L"` `cta="Start learning"` (real copy, confirmed on the live Primer-intro instance — replaces this doc's earlier placeholder "Let's start") — triggers `getUserMedia`. The same real instance also shows a second, `variant="Secondary"` button reading "I can't talk right now" sitting alongside it on `intro` itself — not previously in this doc, which only gave `micDenied` a way out. Real copy, real placement, listed here rather than folded into `micDenied` below since it's a proactive escape on `intro`, not a reaction to an actual permission denial.
- On `micDenied`: `InlineAlert` `variant="Warning"` (`InlineAlert/InlineAlert.tsx`) — real title confirmed: "Microphone access is off". Correcting this doc's earlier assumed `variant="Error"` `showDescriptor`: the real instance is `Warning`, and `showDescriptor` is already `false` on it — its `Descriptor` layer does hold a leftover-looking value ("Hint 1 of 2"), but it's hidden (`visible: false`), matching `showDescriptor={false}`, so nothing is actually shown or needs fixing; my earlier flag of this as a visible content bug was wrong, caught by checking node visibility rather than just walking every text layer regardless of whether it renders. Two real buttons follow: `Button` `variant="Primary"` `cta="Turn on my microphone"` and `Button` `variant="Secondary"` `cta="Continue with text"` — both real, correcting this doc's earlier assumed single `cta="Type instead"` button, which matches nothing on the real instance.

**What the student can do / where it leads**
- Tap AppBar's X → `/` (study plan entry).
- Tap "Start learning" → real `getUserMedia` call:
  - Granted → `/session` (term 1, voice mode).
  - Denied → same route, state flips to `micDenied`.
- Tap "I can't talk right now" (on `intro`, newly found — see Components above) → `/session` (term 1, text mode), bypassing the mic-permission prompt entirely.
- From `micDenied`, tap "Continue with text" → `/session` (term 1, text mode). Tap "Turn on my microphone" → resolved: re-triggers `getUserMedia`.

---

## 3. Summary — `/summary`

One route, content driven by the 4 resolved term outcomes rather than distinct interactive states.

**Components**
- `AppBar` `variant="leftIconButtonOnly"` — X close + `ProgressIndicator` `progress="100"`.
- `TextBlock` — reactive headline, one of 4 tiers keyed to the session's dominant outcome (mostly-recalled / mostly-hinted / mostly-revealed / mostly-skipped). Only the "mixed" case (this sprint's fixed script produces exactly one of each outcome) is ever exercised by a real run — the other 3 tiers ship unverified. Real copy confirmed for the mixed case: "Good session, Mia." — resolved: hardcoded with the student's name, matching Figma exactly.
- `ScoreBreakdown` (`ScoreBreakdown/ScoreBreakdown.tsx`) — not a Figma component (Figma's own layer names read "segbar (custom, no matching component)" and "legend (custom, no matching component)"); built 2026-09-16. The "X% recalled this session" headline, segmented bar, and per-status legend: `percent={50}` `counts={{ Recalled: 1, Hinted: 1, Revealed: 1, Skipped: 1 }}` (real values). `percent` is a plain prop here, not derived — see the component's own doc comment on the untested (Recalled+Hinted)/total formula the one real instance implies.
- `Table` (`Table/Table.tsx`), one `TableCell` row per term (`TableCell/TableCell.tsx`) — `label` = the term's own name, `status="Recalled"|"Hinted"|"Revealed"|"Skipped"` per that term's outcome. Built 2026-09-16, replacing a bare `Tag` × 4 list: pairs each status with its term's label, which the per-term breakdown needs (design brief: "a per-term breakdown of unaided, hinted, revealed, and skipped"). `Table` always displays rows Recalled → Hinted → Revealed → Skipped regardless of input order, which matches this sprint's fixed script (below) exactly, so all 4 statuses are always present and Skipped is always last — the one open gap this pair still carries (a stray divider under the last row when no Skipped term exists, design-system.md §5) never actually triggers this sprint, since the script always produces one of each outcome. Row labels/statuses confirmed against the real Summary instance: Inspiration/Recalled, Divergent thinking/Hinted, Visual hierarchy/Revealed, Visual research/Skipped — exactly this component's own default `rows`, no change needed.
- `TermResultList` (`TermResultList/TermResultList.tsx`) — not a Figma component; built 2026-09-16. The title + one-sentence explanation beneath the table, one per term, same order as `Table`'s own rows: real copy confirmed for all four (e.g. "Recalled on your own" / "**Inspiration**, personal experience and the world around you, in your own words, first try."). The title is derived from `status`, not passed as free text — see the component's own doc comment.
- The XP/lightning badge — the hand-built, non-componentized pattern design-system.md documents (not a real Figma component). Shown here as the session's final static tally (real value confirmed: 4 XP); it already animated during Session, so it doesn't re-animate on Summary. The real instance also shows a fuller stat block alongside it (score, a streak/pace label, elapsed time) — Mia's call to pull it (2026-09-16), rebuilt and then removed again after review ("doesn't look right"); back to flagged-not-built for now, see Open below.
- `ButtonGroup` `variant="Vertical"` (`ButtonGroup/ButtonGroup.tsx`) — real labels confirmed on the live Summary instance: `primary={{ cta: "Review what you missed" }}`, `secondary={{ cta: "Continue" }}` — corrected here against this doc's earlier assumed `primary="Continue"`/`secondary="Try again"`, which had both the labels and which slot was primary wrong. "Review what you missed" reads as a clearer real name for the retry-only-unresolved-terms behavior anyway. This exact Vertical-pair shape still has no other real Figma-screen precedent (design-system.md: "untested"), so screenshot it before treating it as final.

**What the student can do / where it leads**
- Tap "Review what you missed" (primary) → `/session`, scoped to only this session's Hinted/Revealed/Skipped terms (not a fresh 4-term run).
- Tap "Continue" (secondary) → resolved: `/` (study plan entry).
- Tap AppBar's X → resolved: `/` (study plan entry).

---

## 4. Session (the recall loop) — `/session`

One route. Internal state = `{ termIndex: 0-3, mode: "voice" | "text", subState }`. The 4 terms are scripted by index, not by content: term 1 resolves Recalled, term 2 Hinted, term 3 Revealed, term 4 Skipped, regardless of what's actually said or typed. Term 4's script is not a cold skip from `idle` — it attempts once, lands on the hint-shown state, then skips from there (see the `result` sub-state below), so `AudioScrubber` has a real recording to play back on the skip screen. Navigating between `subState` values never changes the URL.

### Shared across every sub-state
- `AppBar` `variant="leftIconButtonOnly"` — X close, `ProgressIndicator` `progress="25"|"50"|"75"|"100"` (one step per resolved term), plus a plain text element next to the bar reading "Term X of 4" (design-system.md: this count is separate text, not a ProgressIndicator prop — `showText` stays `false`).

### `idle` (Learning-idle)
- **Components**: `MascotSlot` `size="2XL"` `pose="standby"`, `SpeechBubble` `state="Prompt"` (the term's prompt), `MicButton` `state="Idle"` `showLabel`, `Button` `variant="Tertiary"` `cta="I don't know"` (always visible — skip), `Button` `variant="Tertiary"` `cta="Type instead"`.
- **Actions**: tap `MicButton` → briefly renders `state="Pressed"` as its own visible beat (resolved: render the press feedback explicitly rather than skip straight from Idle to Recording) → `recording`. Tap "I don't know" → `result` (Skipped, no `AudioScrubber` — nothing's been recorded yet; this cold-skip path is only reachable on terms other than the scripted term 4, since term 4 always attempts once first). Tap "Type instead" → `typeInput` (same term).

### `recording` (Learning-recording)
- **Components**: `MicButton` `state="Recording"` (embeds its own `StatusIndicator` + "Tap to stop" caption — no separate `StatusIndicator` instance needed here), `SpeechBubble` `state="Prompt"` stays visible.
- **Actions**: tap `MicButton` again (stop) → `readyToSend`.

### `readyToSend` (Learning-ready to send)
- **Components**: `StatusIndicator` `status="Ready"` (standalone instance, "Ready to send" label — distinct from the one embedded in `MicButton`), `AudioScrubber` `state="Default"|"Playing"` (`AudioScrubber/AudioScrubber.tsx`) playing back the real captured audio, `ButtonGroup` `variant="Horizontal"` `icon={{ cta omitted, icon: Redo icon, label: "Redo" }}` `primary={{ cta: "Submit" }}`.
- **Actions**: tap `AudioScrubber` → toggles `Playing` locally, plays the real recording. Tap Redo (the `ButtonIcon` slot) → back to `idle` (re-record). Tap "Submit" → `processing`.

### `processing` (Learning-processing / Learning-typeProcessing)
- **Components**: `MascotSlot` `pose="thinking"` as a bare instance (not through the size+pose swap pattern the rest of the loop uses — design-system.md flags this as a real gap; build it exactly like the real screens do and screenshot it), `SpeechBubble` `state="Loading"`, `MicButton` `state="Processing"` (voice mode only), `AudioScrubber` `state="Default"` still visible, `Button` `state="Disabled"` on whichever CTAs are present ("Submit" and "Switch to voice" on the text path, per the already-logged decision pairing Disabled buttons with `speechBubble/Loading`).
- **Timing**: a real ~2-3s delay, then auto-advances to `result`. No timeout/retry state — cut, see Out of scope.

### `result` (branches by this term's scripted outcome)
- **Recalled** (Learning-result-Recalled): `SpeechBubble` `state="Success"` (`title="Nice!"`, `subtitle="Unaided"`), `AudioScrubber` `state="Default"`, `Button` `variant="Primary"` `cta="Continue"`.
- **Hinted, hint shown** (Learning-result-Hinted1): `SpeechBubble` `state="Warning"`, `MicButton` `state="Idle"` (real precedent for a re-attempt entry point here), `Button` `variant="Tertiary"` `cta="I don't know"` still available. Re-attempt loops back through `recording` → `readyToSend` → `processing`, then resolves to the Hinted-success result below (scripted, not judged). Tapping "I don't know" here instead of re-attempting is term 4's actual route to `Skipped` (below) — it's what keeps that one real attempt's recording around for `AudioScrubber` to play back there. No second hint screen (Learning-result-Hinted2) — cut per the sprint's already-logged 1-hint-plus-reveal decision.
- **Hinted, success on re-attempt** (Learning-result-Hinted2-succeed): now a real, confirmed screen (previously an assumed gap). Keeps the full history on screen: the prompt, the first attempt's `AudioScrubber`, the Hint 1 header collapsed to plain text (same treatment Hinted2 gives it), the second attempt's `AudioScrubber`, then the full mascot plus `SpeechBubble` `state="Success"`. Terminal, single "Continue," no further retry. This term tags `"Hinted"` on Summary — resolved.
- **Revealed** (Learning-result-Revealed): `SpeechBubble` `state="Error"`, showing the correct term. `Button` `variant="Primary"` `cta="Continue"`.
- **Skipped** (Learning-result-I don't know): `SpeechBubble` `state="Error"`, same treatment as Revealed. `AudioScrubber` `state="Default"` plays back the one real recording from term 4's single attempt (see above) — this screen is only reached after that one try and a hint, never cold from `idle`, which is why a real instance of `AudioScrubber` makes sense here despite a "skip" outcome.
- **All result states**: advance only on an explicit tap of "Continue" — no auto-advance. Last term's "Continue" → `/summary` instead of the next term.

### `typeInput` (Learning-typeInput) — text fallback entry
- **Components**: `SpeechBubble` `state="Prompt"`, `TextField` (`TextField/TextField.tsx`) — the field itself, previously a flagged gap (no component in this library for an editable text-entry field), now resolved: built and confirmed with real usage on this exact screen — `variant="Placeholder"` `showTitle={false}` `showCaption` `placeholder="Type a short answer..."`, both icons off. `Button` `variant="Primary"` `cta="Submit"`, `Button` `variant="Tertiary"` `cta="Switch to voice"` (confirmed real label).
- **`TextField` has no `value`/`onChange`** — its `Default` variant's displayed text is a hardcoded literal ("User input..."), not a prop, so it can't reflect real keystrokes on its own. This screen needs its own plain native input/textarea as the actual typing surface, held in local component state, positioned over/alongside `TextField`'s visual field. Whatever's captured there is what feeds `SpeechBubble`'s `Input` state downstream at `typeProcessing`/`typeResult` — `TextField` supplies the chrome, not the capture.
- **Actions**: tap "Submit" → `typeProcessing`. Tap "Switch to voice" → `idle` (voice mode, same term).

### `typeProcessing` (Learning-typeProcessing)
- Same as `processing` above, plus `SpeechBubble` `state="Input"` `showSubtitle` echoing back what was typed, shown alongside the `Loading` bubble.

### `typeResult` (Learning-typeResult-Recalled, and the Hinted/Revealed/Skipped equivalents by the same scripted branching as the voice path)
- `SpeechBubble` `state="Input"` (echoing the typed answer) stacked above the outcome bubble (`Success`/`Warning`/`Error`, same rules as the voice path's `result` sub-state).

---

## Explicitly out of scope

Restated from `CLAUDE.md`/`docs/sprint-context.md` because they bound this spec, plus what this interview cut:

- No real speech-to-text, no real judging, no voice output, no tutoring branch, no auto-endpointing.
- No native permission sheets, haptics, or nav transitions — rebuilt by hand or not built.
- No mic-busy handling, no mid-answer language switching, no pause/resume into one take.
- No Android, web, tablet, or light mode. 390px, dark mode only.
- No `button/Loading` anywhere (superseded by `button/Disabled` + `speechBubble/Loading`, already decided).
- "Say it back" (the optional unaided repeat after a hinted pass/reveal) — cut, flagged as a known gap.
- The second hint (Learning-result-Hinted2) — cut, if-time only, not built this sprint.
- Network-drop and judge-timeout states — cut. There's no real backend to fail, so nothing fakes a failure for one.
- `snackbar` — not used anywhere. `speechBubble`'s own result state is the "one beat of acknowledgment," not a separate floating card.
- Real resume persistence — faked with local browser storage only, not a backend. Closing the browser's storage (private window, cleared site data) loses the session same as no persistence at all.

## How the mocked recall behaves

- Outcome per term is scripted by position in the session (1st → Recalled, 2nd → Hinted, 3rd → Revealed, 4th → Skipped), never by what was actually said or typed. There is no minimum recording duration or content check — any length recording (including near-silent) advances.
- The mic really requests OS permission via `getUserMedia` and really records; `AudioScrubber` plays back that real audio. There is no transcript shown anywhere in the loop — showing what was heard is explicitly cut for this build, since there's no real STT to transcribe.
- Processing waits a real ~2-3s before resolving, to sell the "thinking" state rather than instant-advancing.
- The 4-term subject content is Art& design  (e.g. Inspiration, Divergent thinking, Visual hierarchy, Visual research) — real short terms and definitions, not placeholder "Term 1/2/3/4" text.

## Validation: how to check this is done and correct, end to end

1. `npm run dev`, and walk the entire flow by clicking, starting at `/` — never jump screens by typing a URL, since that's not how a student reaches them.
2. Confirm every token is bound through the semantic layer (`npm run tokens` after any `tokens/tokens.json` edit) and that no color/spacing/type value anywhere is hand-typed or a `var(--x, fallback)`.
3. Cross-check every prop used against Storybook's own docs (`docs-show` per component) — nothing on these pages should use a prop that doesn't show up in a real story.
4. Before treating any of these as done, screenshot them in isolation in Storybook, since they're explicitly flagged untested anywhere in the real file: `MicButton` Pressed (now a real transitional beat in the tap-to-record flow, not just an untested variant — see `idle` above), `AudioScrubber` Playing, `ButtonIcon` Primary/Pressed/Recording (if a mic-shaped `buttonIcon` size ends up needed), `mascotSlot` `pose="thinking"` as a bare instance, `ProgressIndicator` `progress="0"`, `ButtonGroup` Vertical.
5. Exercise the real `getUserMedia` prompt both ways — actually click Allow and actually click Block (or revoke the permission in browser settings and reload) — and confirm the Deny path lands on `micDenied` with a working "Continue with text" way out, not a dead end.
6. Run a full session start-to-finish and confirm: the `Table` breakdown on Summary is exactly Recalled/Hinted/Revealed/Skipped in that order (Table's own sort, not just script order) with each row's label matching its real term, `TermResultList`'s four explanations line up with the same rows in the same order, and `ScoreBreakdown`'s numbers match Summary's static tally; the XP counter animated once per result during Session and its final value matches Summary's static badge; reloading mid-session resumes at the same term with the same tally; the study-plan card at `/` shows `inProgress` mid-session and `finish` after Summary is reached.
7. Confirm per-term voice/text switching works both directions without losing the term's progress-bar position.
8. Run `npm run lint`, and Storybook's `test-run` for every story touched.
9. Re-check every label against sentence case (`docs/design-system.md` §4.3) — no title case, no invented capitals.

## Open

Both prior rounds of open questions (resuming into Primer, Redo/Try-again scope, Summary's Continue/X destinations, the Hinted2-succeed tag, placeholder copy, MicButton Pressed, the mic-retry behavior, Summary's hardcoded name, and building `ScoreBreakdown`/`TermResultList`) are now resolved — each decision is folded inline above, at its own screen. `TextBlock` on `Primer-intro` is also resolved: title only, caption hidden. What's left:

- Whether the mocked prototype should compute `ScoreBreakdown`'s `percent` from the actual session outcome, or keep it as the one real example's hardcoded number (50%) — this sprint's script always produces the same 1-of-each-status outcome, so the real number may just be usable as-is; not decided here.
- `SessionStats` (the XP/Score/time 3-box row) was built 2026-09-16, then removed the same day after Mia's review ("doesn't look right") — back to design-system.md §1's original flagged-not-built status. What specifically was wrong isn't captured here; worth a fresh look (spacing, the traced hand-drawn icons, the substituted fonts) before attempting it again, or reconsidering whether this stat row belongs on Summary at all.
