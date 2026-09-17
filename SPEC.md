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

**New variant found in Figma (2026-09-16): Summary-all recalled.** A second real Summary instance, used when all 4 terms resolve Recalled. Only the "Recalled on your own" section shows — the other three status sections drop entirely rather than sitting empty — the segmented bar and legend read 100%/4 Recalled/0 everything else, and `ButtonGroup` shows "Continue" only ("Review what you missed" hidden, since nothing was missed). This sprint's fixed script always produces one of each outcome, so this variant is never actually reached by a real run — same unverified-tier status as the other 3 non-mixed headline tiers already noted below. Not built this sprint unless Mia asks for it explicitly, since the fixed script can't exercise it.

**Components**
- `AppBar` `variant="leftIconButtonOnly"` — X close + `ProgressIndicator` `progress="100"`.
- `TextBlock` — reactive headline, one of 4 tiers keyed to the session's dominant outcome (mostly-recalled / mostly-hinted / mostly-revealed / mostly-skipped). Only the "mixed" case (this sprint's fixed script produces exactly one of each outcome) is ever exercised by a real run — the other 3 tiers ship unverified. Real copy confirmed for the mixed case: "Good session, Mia." — resolved: hardcoded with the student's name, matching Figma exactly.
- `ScoreBreakdown` (`ScoreBreakdown/ScoreBreakdown.tsx`) — not a Figma component (Figma's own layer names read "segbar (custom, no matching component)" and "legend (custom, no matching component)"); built 2026-09-16. The "X% recalled this session" headline, segmented bar, and per-status legend: `percent={50}` `counts={{ Recalled: 1, Hinted: 1, Revealed: 1, Skipped: 1 }}` (real values). `percent` is a plain prop here, not derived — see the component's own doc comment on the untested (Recalled+Hinted)/total formula the one real instance implies.
- `Table` (`Table/Table.tsx`), one `TableCell` row per term (`TableCell/TableCell.tsx`) — `label` = the term's own name, `status="Recalled"|"Hinted"|"Revealed"|"Skipped"` per that term's outcome. Built 2026-09-16, replacing a bare `Tag` × 4 list: pairs each status with its term's label, which the per-term breakdown needs (design brief: "a per-term breakdown of unaided, hinted, revealed, and skipped"). `Table` always displays rows Recalled → Hinted → Revealed → Skipped regardless of input order, which matches this sprint's fixed script (below) exactly, so all 4 statuses are always present and Skipped is always last — the one open gap this pair still carries (a stray divider under the last row when no Skipped term exists, design-system.md §5) never actually triggers this sprint, since the script always produces one of each outcome. Row labels/statuses confirmed against the real Summary instance: Inspiration/Recalled, Divergent thinking/Hinted, Visual hierarchy/Revealed, Visual research/Skipped — exactly this component's own default `rows`, no change needed.
- `TermResultList` (`TermResultList/TermResultList.tsx`) — not a Figma component; built 2026-09-16. The title + one-sentence explanation beneath the table, one per term, same order as `Table`'s own rows: real copy confirmed for all four (e.g. "Recalled on your own" / "**Inspiration**, personal experience and the world around you, in your own words, first try."). The title is derived from `status`, not passed as free text — see the component's own doc comment.
- The XP/lightning badge — the hand-built, non-componentized pattern design-system.md documents (not a real Figma component). Shown here as the session's final static tally (real value confirmed: 4 XP); it already animated during Session, so it doesn't re-animate on Summary. The real instance also shows a fuller stat block alongside it: `SessionStats`, a 3-box XP/Score/pace row ("XP" ⚡4, "SCORE" 🎯2/4, "BLAZING" 🕐2:09 on the mixed instance; ⚡8/🎯4·4/🕐2:09 on the all-recalled variant). Built once (2026-09-16), pulled the same day after Mia's review ("doesn't look right"), then reconfirmed real and present on both live Summary instances (2026-09-16 Figma pass) — **back in scope, worth a fresh rebuild attempt** (spacing, the traced hand-drawn icons, and the substituted fonts were the suspected issues last time; not diagnosed further here). See Open below.
- `ButtonGroup` `variant="Vertical"` (`ButtonGroup/ButtonGroup.tsx`) — real labels confirmed on the live Summary instance: `primary={{ cta: "Review what you missed" }}`, `secondary={{ cta: "Continue" }}` — corrected here against this doc's earlier assumed `primary="Continue"`/`secondary="Try again"`, which had both the labels and which slot was primary wrong. "Review what you missed" reads as a clearer real name for the retry-only-unresolved-terms behavior anyway. This exact Vertical-pair shape still has no other real Figma-screen precedent (design-system.md: "untested"), so screenshot it before treating it as final.

**What the student can do / where it leads**
- Tap "Review what you missed" (primary) → `/session`, scoped to only this session's Hinted/Revealed/Skipped terms (not a fresh 4-term run).
- Tap "Continue" (secondary) → resolved: `/` (study plan entry).
- Tap AppBar's X → resolved: `/` (study plan entry).

---

## 4. Session (the recall loop) — `/session`

One route. Internal state = `{ termIndex: 0-3, mode: "voice" | "text", subState }`. The 4 terms are scripted by index, not by content: term 1 resolves Recalled, term 2 Hinted, term 3 Revealed, term 4 Skipped, regardless of what's actually said or typed. Navigating between `subState` values never changes the URL.

**Figma frame naming (2026-09-16): every `Learning-*` frame was renamed to a `Learning-topic N-...` scheme** (e.g. `Learning-idle` → `Learning-topic 1-idle`, `Learning-result-Hinted1` → `Learning-topic 2-result-Hinted1`, `Learning-skipped` → `Learning-topic 4-skipped`). The parenthetical frame names below are updated to match; sub-state names in code are unaffected. Two of the renamed/added frames are named after their *eventual scripted outcome*, not their current visual content — `Learning-topic 3-I don't know` and `Learning-topic 4-skipped` both render as an ordinary idle screen (mic, prompt, "Type instead"/"I don't know") — flagged here so it doesn't read as a content mismatch later.

- **Term 3's script changed (Mia's call, 2026-09-16): no longer a full attempt-then-reveal.** Previously term 3 required a real recording → readyToSend → processing cycle before landing on Revealed (already built this way in code). Figma's new `Learning-topic 3-I don't know` frame — a cold idle-styled entry point whose own "I don't know" tap connects straight to `Learning-topic 3-result-Revealed` — means term 3 now matches term 4's shape exactly: no attempt required, tap "I don't know" (or let the mic run, if a student actually tries) to reach Revealed directly. **Code still has the old requires-an-attempt behavior; this needs updating to match.**

### Shared across every sub-state
- `AppBar` `variant="leftIconButtonOnly"` — X close, `ProgressIndicator` `progress="25"|"50"|"75"|"100"` (one step per resolved term), plus a plain text element next to the bar reading **"Topics X of 4"** (corrected from this doc's earlier assumed "Term X of 4" — design-system.md: this count is separate text, not a ProgressIndicator prop — `showText` stays `false`).
- **"Skip" text link, top-right of the appBar, next to "Topics X of 4"** — new as of the 2026-09-16 Figma pass, present on every topic's screen, separate from the bottom `Button variant="Tertiary" cta="I don't know"`. **Resolved (Mia, 2026-09-16): only wired on Topic 4** — tapping it skips straight to `/summary`, the same terminal action as Topic 4's own "I don't know" tap. On Topics 1-3 it's shown to match the live frame but stays inert (no action) — a named, flagged gap, not a bug.

### `idle` (Learning-topic 1-idle for term 1; the same shared JSX also renders `Learning-topic 3-I don't know` and `Learning-topic 4-skipped` for terms 3-4 — see the naming note above)
- **Components**: `MascotSlot` `size="2XL"` `pose="standby"`, `SpeechBubble` `state="Prompt"` (the term's prompt), `MicButton` `state="Idle"` `showLabel`, `Button` `variant="Tertiary"` `cta="I don't know"` (always visible — skip), `Button` `variant="Tertiary"` `cta="Type instead"`.
- **Actions**: tap `MicButton` → briefly renders `state="Pressed"` as its own visible beat (resolved: render the press feedback explicitly rather than skip straight from Idle to Recording) → `recording`. Tap "I don't know" → `result` (Skipped/Revealed, no `AudioScrubber` — nothing's been recorded yet). Per the 2026-09-16 script update, this cold-skip path is now the *scripted* route on terms 3 and 4 (not just an always-available fallback) — tapping the mic instead still works mechanically on any term, it just isn't what the fixed script expects. Tap "Type instead" → `typeInput` (same term).

### `recording` (Learning-topic 1-recording)
- **Components**: `MicButton` `state="Recording"` (embeds its own `StatusIndicator` + "Tap to stop" caption — no separate `StatusIndicator` instance needed here), `SpeechBubble` `state="Prompt"` stays visible.
- **Actions**: tap `MicButton` again (stop) → `readyToSend`.

### `readyToSend` (Learning-topic 1-ready to send)
- **Components**: `StatusIndicator` `status="Ready"` (standalone instance, "Ready to send" label — distinct from the one embedded in `MicButton`), `AudioScrubber` `state="Default"|"Playing"` (`AudioScrubber/AudioScrubber.tsx`) playing back the real captured audio, `ButtonGroup` `variant="Horizontal"` `icon={{ cta omitted, icon: Redo icon, label: "Redo" }}` `primary={{ cta: "Submit" }}`.
- **Actions**: tap `AudioScrubber` → toggles `Playing` locally, plays the real recording. Tap Redo (the `ButtonIcon` slot) → back to `idle` (re-record). Tap "Submit" → `processing`.

### `processing` (Learning-topic 1-processing / Learning-topic 1-typeProcessing)
- **Components**: `MascotSlot` `pose="thinking"` as a bare instance (not through the size+pose swap pattern the rest of the loop uses — design-system.md flags this as a real gap; build it exactly like the real screens do and screenshot it), `SpeechBubble` `state="Loading"`, `MicButton` `state="Processing"` (voice mode only), `AudioScrubber` `state="Default"` still visible, `Button` `state="Disabled"` on whichever CTAs are present ("Submit" and "Switch to voice" on the text path, per the already-logged decision pairing Disabled buttons with `speechBubble/Loading`).
- **Timing**: a real ~2-3s delay, then auto-advances to `result`. No timeout/retry state — cut, see Out of scope.

### `result` (branches by this term's scripted outcome)
- **Recalled** (Learning-result-Recalled): `SpeechBubble` `state="Success"` (`title="Nice!"`, `subtitle="Unaided"`), `AudioScrubber` `state="Default"`, `Button` `variant="Primary"` `cta="Continue"`.
- **Hinted, hint shown** (Learning-topic 2-result-Hinted1): `SpeechBubble` `state="Warning"`, `MicButton` `state="Idle"` `label="Try again"` (real precedent for a re-attempt entry point here), `Button` `variant="Tertiary"` `cta="I don't know"` still available. Re-attempt loops back through its own dedicated retry frames — `Learning-result-Hinted2-recording` → `Learning-result-Hinted2-ready to send` → `Learning-result-Hinted2-processing` (each keeps the full history: prompt, first attempt's `AudioScrubber`, Hint 1 collapsed to plain text) — then resolves to one of two real terminal screens below (scripted, not judged). Tapping "I don't know" here instead of re-attempting goes to `Learning-result-I don't know` (Revealed-styled reveal, keeps the one attempt's audio history) — *unresolved which term this branch actually belongs to, see the note above the sub-state list*.
- **Hinted, success on re-attempt** (Learning-result-Hinted2-succeed): full history on screen, then the full mascot plus `SpeechBubble` `state="Success"` (`subtitle="Hint 2 of 2"`, message states the term's real definition, not an echoed transcript). Terminal, single "Continue," no further retry. This term tags `"Hinted"` on Summary — resolved.
- **Hinted, still wrong on re-attempt** (Learning-topic 2-result-Hinted2): **un-cut and back in scope (Mia's call, 2026-09-16)** — this doc previously said the second hint was "cut per the sprint's already-logged 1-hint-plus-reveal decision"; Figma now has a full, real terminal screen for this outcome, with its own retry sub-loop (same 3 frames as the success path above, shared). Same history stack as Hinted2-succeed, but the closing block is `SpeechBubble` `state="Warning"` `subtitle="Hint 2 of 2"` again (not `Success`), no answer ever revealed, single "Continue," no further retry. **Open**: what Summary tag this carries (`Hinted` again, or something else), and what triggers this vs. the success path, given the fixed script currently always routes term 2's retry to success — not decided here, flag before wiring.
- **Revealed** (Learning-topic 3-result-Revealed): `SpeechBubble` `state="Error"`, `title="Here's the answer."`, `subtitle="Revealed"`, showing the correct term. `Button` `variant="Primary"` `cta="Continue"`. No `AudioScrubber` — reached cold via "I don't know" from `Learning-topic 3-I don't know` (term 3's own idle-styled entry point, see the note above the sub-state list), not from a submitted attempt.
- **Skipped** (Learning-topic 4-skipped): term 4's own idle-styled entry screen (mic, prompt, "Type instead"/"I don't know" — structurally identical to `idle`, just named for its scripted outcome). Tapping "I don't know," or the top-right "Skip" link (wired only here, see Shared above), goes straight to `/summary` — there's no distinct post-skip result screen for term 4 in Figma. An actual attempt is still mechanically live (mic works) but also routes to `/summary` once judged, same terminal destination as the cold skip.
- **All result states**: advance only on an explicit tap of "Continue" — no auto-advance. Last term's "Continue" → `/summary` instead of the next term.

### `typeInput` (Learning-topic 1-typeInput) — text fallback entry
- **Components**: `SpeechBubble` `state="Prompt"`, `TextField` (`TextField/TextField.tsx`) — the field itself, previously a flagged gap (no component in this library for an editable text-entry field), now resolved: built and confirmed with real usage on this exact screen — `variant="Placeholder"` `showTitle={false}` `showCaption` `placeholder="Type a short answer..."`, both icons off. `Button` `variant="Primary"` `cta="Submit"`, `Button` `variant="Tertiary"` `cta="Switch to voice"` (confirmed real label).
- **`TextField` has no `value`/`onChange`** — its `Default` variant's displayed text is a hardcoded literal ("User input..."), not a prop, so it can't reflect real keystrokes on its own. This screen needs its own plain native input/textarea as the actual typing surface, held in local component state, positioned over/alongside `TextField`'s visual field. Whatever's captured there is what feeds `SpeechBubble`'s `Input` state downstream at `typeProcessing`/`typeResult` — `TextField` supplies the chrome, not the capture.
- **Actions**: tap "Submit" → `typeProcessing`. Tap "Switch to voice" → `idle` (voice mode, same term).

### `typeProcessing` (Learning-topic 1-typeProcessing)
- Same as `processing` above, plus `SpeechBubble` `state="Input"` `showSubtitle` echoing back what was typed, shown alongside the `Loading` bubble.

### `typeResult` (Learning-topic 1-typeResult-Recalled, and the Hinted/Revealed/Skipped equivalents by the same scripted branching as the voice path)
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
- ~~The second hint (Learning-result-Hinted2) — cut, if-time only, not built this sprint.~~ **Un-cut 2026-09-16** — Figma now has a real Hinted2-fail terminal screen with its own retry sub-loop; see section 4's Hinted result sub-states above.
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
- ~~`SessionStats` (the XP/Score/time 3-box row) was removed after Mia's review, flagged-not-built~~ — **correction: it's already built and live**, checked directly against `src/app/summary/page.tsx` (commit `c998687`, the file's only commit) rather than trusting this doc's own stale note: `SESSION_XP`/`SESSION_SCORE`/`SESSION_PACE` render as the real 3-box row with the real exported icons. This doc and design-system.md §1 both still describe the pre-final "removed, flagged-not-built" state from mid-way through that day's back-and-forth — both are stale on this point, not just cautious.
- **Which term the `Learning-result-I don't know` branch (off Hinted1, "I don't know" without retrying) actually belongs to.** Its live content shows "Divergent thinking" (term 2's own term), and its own Figma note says it's reached from Hinted1 — but this doc previously described an equivalent single-attempt-then-skip flow as term 4's behavior. Term 4 now has its own distinct `Learning-topic 4-skipped` entry point (cold, no hint involved at all), so this branch reads as a real alternate ending for term 2 specifically (give up right after hint 1, vs. retrying into the Hinted2 success/fail screens) — not confirmed, not currently reachable via the fixed script either way.
- **What triggers Hinted2-fail vs. Hinted2-succeed** on term 2's retry, now that both are real, in-scope screens, and what Summary tag Hinted2-fail carries — the fixed script currently only ever routes term 2's retry to success. Not decided here.
- Whether `Learning-result-I don't know` (the old node) should be deleted from Figma now that terms 3 and 4 both have their own dedicated cold-skip entry points — already flagged once in `component-gaps.md`, restated here since it's now a 3-way naming overlap (`Learning-result-I don't know`, `Learning-topic 3-I don't know`, `Learning-topic 4-skipped`) rather than a 2-way one.
