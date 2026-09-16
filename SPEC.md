# Spec: voice active-recall prototype

This prototype is the Next.js app in this repo (`src/app/`). Every screen listed below is a page with its own route, reached by the student clicking through the flow — not a Storybook story. Storybook stays the component catalog only: it's where each component's states get built and screenshotted in isolation, never where the student navigates.

## What we're building

A mocked, voice-in/text-out active-recall loop: a student explains 4 biology terms out loud (or types, if they can't speak), Knowie replies in text with a hardcoded verdict per term, and a summary shows how each one was answered. No real speech-to-text, no real judging, no voice output.

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
- `inProgress`: tap "Redo" → `/session` (resumes at the next unresolved term — see Open, below, on whether this skips the primer).
- `finish`: tap "Redo" → `/session` (see Open, below, on whether this restarts fresh or retries only missed terms).

---

## 2. Primer — `/primer`

**States**
- `intro` (Primer-intro) — default
- `micDenied` (Primer-micDenied) — after a real `getUserMedia` rejection

**Components**
- `AppBar` `variant="leftIconButtonOnly"` — `leftIcon` = `IconSlot` wrapping an X/close icon, `leftLabel="Close"`. `children` = `ProgressIndicator` (`progress="0"`, untested value per design-system.md — flag before relying on it).
- `MascotSlot` `size="3XL"` `pose="standby"` (`MascotSlot/MascotSlot.tsx`) — size/pose choice is inferred from the loop's own convention, not separately confirmed for Primer.
- `TextBlock` `variant="L"` (`TextBlock/TextBlock.tsx`) — headline + caption explaining active recall. TextBlock has zero real Figma-screen usage anywhere; this is its first real placement, so screenshot it before trusting the sizing.
- `Button` `variant="Primary"` `size="L"` `cta="Let's start"` (placeholder copy, not written yet — see Open) — triggers `getUserMedia`.
- On `micDenied`: `InlineAlert` `variant="Error"` `showDescriptor` (`InlineAlert/InlineAlert.tsx`) — explains the mic was denied and how to re-enable it. `Button` `variant="Secondary"` `cta="Type instead"` (confirmed real label) as the way forward.

**What the student can do / where it leads**
- Tap AppBar's X → `/` (study plan entry).
- Tap "Let's start" → real `getUserMedia` call:
  - Granted → `/session` (term 1, voice mode).
  - Denied → same route, state flips to `micDenied`.
- From `micDenied`, tap "Type instead" → `/session` (term 1, text mode).

---

## 3. Summary — `/summary`

One route, content driven by the 4 resolved term outcomes rather than distinct interactive states.

**Components**
- `AppBar` `variant="leftIconButtonOnly"` — X close + `ProgressIndicator` `progress="100"`.
- `TextBlock` — reactive headline, one of 4 tiers keyed to the session's dominant outcome (mostly-recalled / mostly-hinted / mostly-revealed / mostly-skipped). Only the "mixed" case (this sprint's fixed script produces exactly one of each outcome) is ever exercised by a real run — the other 3 tiers ship unverified.
- `Tag` × 4 (`Tag/Tag.tsx`) — `status="Recalled"`, `"Hinted"`, `"Revealed"`, `"Skipped"`, one per term.
- The XP/lightning badge — the hand-built, non-componentized pattern design-system.md documents (not a real Figma component). Shown here as the session's final static tally; it already animated during Session, so it doesn't re-animate on Summary.
- `ButtonGroup` `variant="Vertical"` (`ButtonGroup/ButtonGroup.tsx`) — `primary={{ cta: "Continue" }}`, `secondary={{ cta: "Try again" }}`. This exact pairing has no real Figma-screen precedent (design-system.md: "untested"), so screenshot it before treating it as final.

**What the student can do / where it leads**
- Tap "Try again" → `/session`, scoped to only this session's Hinted/Revealed/Skipped terms (not a fresh 4-term run).
- Tap "Continue" → not decided (see Open).
- Tap AppBar's X → not decided (see Open).

---

## 4. Session (the recall loop) — `/session`

One route. Internal state = `{ termIndex: 0-3, mode: "voice" | "text", subState }`. The 4 terms are scripted by index, not by content: term 1 resolves Recalled, term 2 Hinted, term 3 Revealed, term 4 Skipped, regardless of what's actually said or typed. Term 4's script is not a cold skip from `idle` — it attempts once, lands on the hint-shown state, then skips from there (see the `result` sub-state below), so `AudioScrubber` has a real recording to play back on the skip screen. Navigating between `subState` values never changes the URL.

### Shared across every sub-state
- `AppBar` `variant="leftIconButtonOnly"` — X close, `ProgressIndicator` `progress="25"|"50"|"75"|"100"` (one step per resolved term), plus a plain text element next to the bar reading "Term X of 4" (design-system.md: this count is separate text, not a ProgressIndicator prop — `showText` stays `false`).

### `idle` (Learning-idle)
- **Components**: `MascotSlot` `size="3XL"` `pose="standby"`, `SpeechBubble` `state="Prompt"` (the term's prompt), `MicButton` `state="Idle"` `showLabel`, `Button` `variant="Tertiary"` `cta="I don't know"` (always visible — skip), `Button` `variant="Tertiary"` `cta="Type instead"`.
- **Actions**: tap `MicButton` → `recording`. Tap "I don't know" → `result` (Skipped, no `AudioScrubber` — nothing's been recorded yet; this cold-skip path is only reachable on terms other than the scripted term 4, since term 4 always attempts once first). Tap "Type instead" → `typeInput` (same term).

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
- **Hinted, success on re-attempt** (Learning-result-Hinted2-succeed): now a real, confirmed screen (previously an assumed gap — see Open). Keeps the full history on screen: the prompt, the first attempt's `AudioScrubber`, the Hint 1 header collapsed to plain text (same treatment Hinted2 gives it), the second attempt's `AudioScrubber`, then the full mascot plus `SpeechBubble` `state="Success"`. Terminal, single "Continue," no further retry. Whether this term tags `"Hinted"` or `"Recalled"` on Summary still isn't decided by anything on the screen itself — see Open.
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
- The 4-term subject content is biology cell structure (e.g. mitochondria, osmosis, photosynthesis, ribosome) — real short terms and definitions, not placeholder "Term 1/2/3/4" text.

## Validation: how to check this is done and correct, end to end

1. `npm run dev`, and walk the entire flow by clicking, starting at `/` — never jump screens by typing a URL, since that's not how a student reaches them.
2. Confirm every token is bound through the semantic layer (`npm run tokens` after any `tokens/tokens.json` edit) and that no color/spacing/type value anywhere is hand-typed or a `var(--x, fallback)`.
3. Cross-check every prop used against Storybook's own docs (`docs-show` per component) — nothing on these pages should use a prop that doesn't show up in a real story.
4. Before treating any of these as done, screenshot them in isolation in Storybook, since they're explicitly flagged untested anywhere in the real file: `MicButton` Pressed, `AudioScrubber` Playing, `ButtonIcon` Primary/Pressed/Recording (if a mic-shaped `buttonIcon` size ends up needed), `mascotSlot` `pose="thinking"` as a bare instance, `ProgressIndicator` `progress="0"`, `ButtonGroup` Vertical.
5. Exercise the real `getUserMedia` prompt both ways — actually click Allow and actually click Block (or revoke the permission in browser settings and reload) — and confirm the Deny path lands on `micDenied` with a working "Type instead" way out, not a dead end.
6. Run a full session start-to-finish and confirm: the tag breakdown on Summary is exactly Recalled/Hinted/Revealed/Skipped in that order; the XP counter animated once per result and its final value matches Summary's static tally; reloading mid-session resumes at the same term with the same tally; the study-plan card at `/` shows `inProgress` mid-session and `finish` after Summary is reached.
7. Confirm per-term voice/text switching works both directions without losing the term's progress-bar position.
8. Run `npm run lint`, and Storybook's `test-run` for every story touched.
9. Re-check every label against sentence case (`docs/design-system.md` §4.3) — no title case, no invented capitals.

## Open

Things this interview left undecided — flagged rather than picked:

- Whether resuming from `StudyPlan-inProgress` skips the Primer/permission screen (since permission may already be granted) or replays it.
- What "Redo" on a `finish`-state study-plan card does relative to Summary's "Try again" — a fresh full 4-term session, or the same "retry only what wasn't recalled" behavior.
- Where Summary's "Continue" leads. The brief itself calls this "the least designed part of the whole thing," and this interview didn't resolve it.
- Where Summary's AppBar "X" leads.
- Whether "hinted, then succeeded on the re-attempt" tags the term `"Hinted"` or `"Recalled"` on Summary. `Learning-result-Hinted2-succeed` is now a real, confirmed screen (see §4's `result` sub-state), but that screen alone doesn't decide the Summary tag — still this document's assumption (`"Hinted"`), not a confirmed design.
- All copy is placeholder: the primer's explanation text, the CTA "Let's start," and the summary's 4 headline tiers haven't been written for real.
- Whether `MicButton`'s `Pressed` state (tap-down, before recording starts) needs to render as its own visible beat, or whether tapping goes straight from `Idle` to `Recording` with `Pressed` never actually shown.
