# Design System Rules

This file is behavior, not values. For every color, size, type, or spacing value, look in `tokens/tokens.json`. If a value you need isn't there, that's a gap to flag, not a number to guess.

Source: live audit of the Figma file "Yummy__Knowie Design System" (fileKey `Km4r5Waxhm1bysmCcFNYiB`), the 17 component sets on the 🎨  Mascot & components page (10 general-purpose components in Section 1; 7 built specifically for the voice active-recall loop, covered in Section 5: audioScrubber, inlineAlert, micButton, speechBubble, statusIndicator, tag, textField), real usage across ✨  Example Screens and the built 📱  Screen & flow recall loop, and the Design Brief and Platform Constraints docs.

---

## 1. Component selection

Use this to decide what to reach for. Each entry states what's confirmed by real screens versus inferred from structure alone, because that distinction changes how much you should trust the default.

**appBar** — Top nav row: back or menu icon button, a stretchable content slot, optional right button(s). This is the real top row on every screen in the recall loop, 19 instances across the flow. leftIconButtonOnly (X close, progressIndicator in the stretchable slot) is the top row on every Primer/Learning/Summary screen; rightIconButtonOnly (kebab menu only, no left icon) is the study plan screen's row (StudyPlan-notStarted, StudyPlan-inProgress, StudyPlan-finish) — updated 2026-09-15, live Figma moved this off leftAndRightIconButton (back arrow plus kebab menu), which it used to be. The stretchable slot holds a progressIndicator cleanly. The other 5 appBar variants (default, leftAndRightIconButton, leftAndRightButton, leftAndTwoRightIconButtons, leftAnd2RightButtons) have no real instance anywhere. Primer-intro and Summary reach appBar through their own scaffold's Slot - Top navigation rather than a bare instance placed directly on the screen; see Section 2 about that scaffold.

**button** — The app's main CTA, heavily used across the app: quiz "Check"/"Continue", "Try again", and, in the recall loop itself, "Continue," "Submit," "Type instead," "I don't know," "Switch to voice," and, at Secondary/S with a trailing icon, "Speak" and "Redo" on the study plan card. Primary/L is the loop's main forward action; Tertiary is used for the lighter text-style actions. Default, Pressed and Disabled all have real examples (Disabled: Submit and Switch to voice on Learning-typeProcessing, dimmed during the text-path wait). Loading has no real example anywhere, despite being exactly the state the two processing-wait screens (voice and text) need; build and test it before those screens depend on it.

**buttonIcon** — Icon-only sibling of button, sharing its Primary/Secondary/Tertiary x S/M/L x state axes. Real usage is thin (only Secondary/L and Secondary/M appear anywhere), but the shape fits the recall loop's mic button, the close (X), and the discard action in review-before-send. The beta's circular mic button is bigger than any documented buttonIcon size, so building it from this component likely means adding a new size, not picking an existing one. Primary, every S size, and every non-Default state have zero real examples, so a tapped, recording mic (Primary/Pressed or Primary/Loading) needs to be explicitly designed and tested, not assumed.

**buttonGroup** — A fixed two-slot pairing, not a generic repeater. Vertical pairs button(Primary) + button(Secondary); Horizontal pairs buttonIcon(Secondary) + button(Primary). The one confirmed real example is Horizontal, in a quiz answer-feedback row. Vertical reads as the right shape for a stacked "Try again"/"Continue" pair on the recall summary screen but is untested. Don't stretch this to three or more actions, like a multi-step hint ladder; that's a new component question, not a reason to force this one.

**chips** — Real screens use chips constantly: topic tags, tool pickers (Coach Me/Solve It/Lock In), status tags (PRO). Its color property only offers Primary/pro. The recall summary screen's per-term status labels (Recalled/Hinted/Revealed/Skipped) use a separate tag component instead (see Section 5), because chips' fixed dual-icon-slot, size-XXS-to-M shape doesn't fit a single-purpose status label. The Info/Success/Error gap in chips' color property stays open for any future screen that needs a genuinely semantic-colored chip rather than a status tag.

**badge (XP/lightning counter)** — not one of the file's real components. It's a hand-built frame that's internally misnamed "chips" in the layer tree, unrelated to the real chips component covered above (per Mia's call on 2026-09-11 not to force them together). It bundles a raw two-vector lightning icon, an iconSlot instance, and a numeral text layer, and it's rebuilt independently on every screen that has it rather than sharing one source (9 screens as of 2026-09-11: Primer-micDenied and every Learning-* screen). Its corner radius and spacing are already bound to real tokens (radius/Full, a space step), so it isn't a token violation, but it is a repeated hand-built pattern with no single source. Changing it means editing every screen by hand. This is section 4, item 7's case, something genuinely missing a real component, and worth a name and a component definition if it's going to keep appearing.

**iconSlot** — The most-used primitive in the file (165 instances elsewhere), nested inside button, buttonIcon, chips, snackbar, and appBar. You'll touch it constantly just by using those. In the loop it's the info-circle/check-circle/alert-circle icon for result cards and hint/reveal affordances. Its size property is literally named "Size (IGNORE)", and size 100 has zero real usage anywhere; treat that as a signal to check with whoever owns the system before building new instances at a size that might be getting deleted.

**mascotSlot** — The hero mascot component for the feature. In the built recall loop it swaps between "standby" and "approving" in real usage, at sizes 2XL (study plan card) and 3XL (every Learning-* screen, idle through result) respectively. A third pose, "thinking," is in real use on Learning-processing and Learning-typeProcessing for the wait state, but isn't in the Homie swap's preferred-values list on .mascotSlotBase, so both screens place it as a bare instance outside mascotSlot entirely rather than through the size+pose pattern every other screen uses; add it to the preferred list, or confirm the gap is intentional. 4XL and XL have zero real usage.

**progressIndicator** — The beta's "1/3", "2/3" top bar uses this component's `showText=true` unit-count mode. The built recall loop does it differently: progressIndicator sits inside every appBar's stretchable slot with showText false, and the "Topics 2 of 4" term count is a separate text element next to the bar. Primary color and progress values 25/50/75 (one step per term through a 4-term session) have real examples; 0, 100, and Coral are untested.

**snackbar** — No instance of this exists anywhere in ✨  Example Screens; this is inferred from structure and the brief alone. Structurally it's a strong match for the brief's "one beat of acknowledgment" result moments, and the green "Nice!" / red "Not quite" bottom cards on real quiz screens are already doing this job as custom-built sheets instead of this component. Before adopting it for the loop's result beats, check whether the trailing chip nested inside snackbar is intentional or a stray leftover layer; a chip inside a snackbar is an unusual pairing to build 3-5 turns of result states on top of without asking first.

**textBlock** — The simplest component in the file, one Header plus one Caption pair across 4 sizes. No real usage exists anywhere, so this is inferred purely from structure and the brief. It's a plausible fit for short static copy like the primer's headline or the summary's title, but check whether the beta's actual headline treatment (e.g. "Amazing job!") matches any of the 4 sizes before using it on your two highest-visibility screens.

If none of the above fits what you're building, that's section 4, item 7: say what's missing and what you'd call it, and let Mia decide whether it gets built. Also check Section 5 below, the six components built for the voice active-recall sprint.

---

## 2. Scaffold composition

The scaffold is the component named "Screen" (instances appear at multiple device widths matching Platform Constraints' range, from the smaller Pixel-class sizes up through iPhone 13 and Pro Max sizes). Build inside it, not around it. Top to bottom, its structure is:

1. **Panel Header** — fixed chrome, not a slot. Contains the Status Bar instance. Don't put screen content here.
2. **Slot - Top navigation** — this is where appBar goes.
3. **Slot - Content** — the main scrollable content area. Everything specific to a given screen (the recall loop's prompt, mascot, progress, result state) lives here.
4. **Slot - Bottom nav** — bottom navigation, when the screen has it.
5. **Bottom-sheet background** — fixed chrome (a full-bleed rectangle behind the bottom sheet), not a slot.
6. **Slot - Bottom-sheet** — bottom sheet content, when a screen needs one (tool pickers, the Tools sheet pattern already seen in real screens).

Only the four `Slot -` prefixed nodes are meant to be filled per screen. Panel Header and Bottom-sheet background are structural chrome that ships with every instance of the scaffold; don't rebuild or override them per screen.

One open item: the scaffold's own naming is inconsistent between where it's defined (named "Screen/S - Pixel 2" on the components page) and how real instances reference it on ✨  Example Screens (variant values like "size=iPhone 13" and "size=L - 17 Pro Max"). This doesn't change what to build inside it, but if you go looking for the master component by name and don't find it, that's a known quirk, not a sign it's missing.

Second open item, found 2026-09-11: Primer-intro and Summary are not built inside "Screen." They're built inside a separate, undocumented component set literally named "scaffold" (8 size variants). It now carries the same four slot names as this doc's convention (Slot - Top navigation, Slot - Content, Slot - Bottom nav, Slot - Bottom-sheet, renamed to match on 2026-09-11), but it remains a structurally distinct component from "Screen," not a variant of it. This doc doesn't say which one is meant to be canonical. If new screens should use "Screen," Primer-intro and Summary are on the wrong one. If "scaffold" is meant to replace "Screen," the rest of the recall loop is on the wrong one. Flagging this instead of merging or deprecating either, since that's a system decision, not a per-screen fix.

---

## 3. Naming conventions

**Color primitives**: `color/hue/step`, e.g. `color/violet/500`, `color/neutral/950`. Raw values only, never referenced by a component directly.

**Semantic color tokens**: `group/role` or `group/family/role`, e.g. `accent/...`, `background/...`, `text/...`, `interactive/...`. Each carries a description written as USE / DON'T / PAIR / RULE, one sentence each, telling you when to reach for it and what not to pair it with. Read the description before binding a semantic token, not just the name.

**Size tokens**: `space/step`, `radius/step`, `icon/step`, `illustration/step`, `depth/step`, `blur/step` use numeric scale steps, e.g. `space/400`, `radius/150`. Stroke is the confirmed exception: it's named semantically by weight, `stroke/Border` and `stroke/Heavy-Border`, not a numbered step, because a two-value line-weight set doesn't need a numeric ramp (Mia's call, 2026-09-10, resolving the earlier stroke/step mismatch). Treat this as the pattern for any future size token that only ever needs a couple of named variants rather than a scale: name it semantically, don't force a step number onto it.

**Typography tokens**: `font/category/token`, e.g. `font/size/md`, `font/weight/semibold`, `font/tracking/loose`, `font/family/default`. Text styles compose these into named styles like "Headline XS Bold", represented in tokens.json under camelCase keys like `headline.xsBold`.

**Component naming**: camelCase, e.g. `appBar`, `buttonIcon`, `buttonGroup`, `iconSlot`, `mascotSlot`, `progressIndicator`, and, from the voice active-recall sprint, `audioScrubber`, `inlineAlert`, `micButton`, `speechBubble`, `statusIndicator`, `tag`, `textField`. Match this pattern for anything new.

**Internal layer naming**: descriptive Title Case for structural layers inside a component, e.g. "Label", "Icon Container", "Left Icon Container", "Content". Slots inside the scaffold are prefixed `Slot - `, e.g. "Slot - Top navigation". The voice active-recall components added more real examples of this same pattern: "Bubble", "Tail", "Header", "Title Row", "Title", "Message", "Waveform", "Caption", "Status Row" (now removed from micButton, see Section 5), "Dot". Reuse a layer name across components when it means the same thing structurally, e.g. "Icon Container" is used identically in button and inlineAlert. Note the one unresolved mismatch: speechBubble's optional secondary text is named "Subtitle" while inlineAlert's equivalent is "Descriptor," left different because reconciling them means deciding whether speechBubble should embed inlineAlert (see Section 5's speechBubble entry).

**Variant property naming**: lowercase camelCase for the property name, e.g. `variant`, `size`, `state`, `active`, `thickness`, `progress`. Boolean toggles are prefixed `show`, e.g. `showLeftIcon`, `showRightIcon`, `showText`, `showCaption`.

**Variant property semantics** (confirmed by the voice active-recall components): the property name isn't interchangeable even though `state`, `variant`, and `status` are all valid camelCase. Use `state` when the variants are the component's own interaction or lifecycle states, something the component itself transitions through (micButton, audioScrubber, speechBubble all use `state`). Use `variant` when the options are a stylistic or semantic bucket the component doesn't control itself, more like a flavor you choose at design time (inlineAlert uses `variant`). Use `status` when the component exists purely to display a status that's determined elsewhere in the product (tag and statusIndicator both use `status`). Don't default to `state` for everything; pick the word that matches what's actually driving the variant.

**Boolean properties are for optional secondary content only**: a `showX` toggle should never be able to hide the element that defines what the component is. micButton's `showLabel`, speechBubble's `showSubtitle`, and inlineAlert's `showDescriptor` can all be turned off; none of their icons can be, and inlineAlert's Title can't be either. If a component feels like it needs a toggle for something core, that's a sign it's two components, not a reason to add the toggle.

**Icons inside a new component are always a real iconSlot instance**, instance-swapped to a real icon, never a hand-drawn vector. This wasn't true of speechBubble originally (its Success/Warning/Error icons are hand-drawn vectors); inlineAlert corrected this, and it's the standard going forward, including for any future rebuild of speechBubble's own icons.

**An icon and the text it sits next to share one semantic token, never two similar-looking ones.** When a status dot sits next to its label, or an alert icon sits next to its title, bind both to the exact same token. speechBubble originally paired its Success icon and title with `accent/green/bold` instead of `feedback/success/bold`; that's now fixed (Section 5), and it's the pattern statusIndicator and inlineAlert both follow from the start.

**Extract a repeated internal structure into its own component once it shows up more than once.** It stops being an internal implementation detail the moment two different components (or a component and a real screen) hand-build the same arrangement. inlineAlert exists because an icon+title+optional-secondary-text pattern was duplicated inside all four of speechBubble's states. statusIndicator exists because a colored-dot+label pattern was independently hand-built inside micButton and inside two real screens. If you find a third case of this, that's the signal to name and extract it, not to keep copying it.

**Bind new work to the local copy of a variable, never a remote library duplicate.** Some tokens exist twice in the variables panel, once with `remote: true` (a cached copy from a library import) and once without (the canonical local source). Always bind to the local one, even when the real screen you're matching happens to use the remote copy.

Follow whichever pattern the thing you're naming already belongs to. Don't mix, e.g. don't give a new component a Title Case name or a new variant property a `snake_case` name.

---

## 4. Never do this

1. **Never invent a value that isn't in tokens.json.** If something is missing, say so instead of filling the gap.
2. **Never use a CSS fallback value like `var(--token, #333)`.** If a token resolves to nothing, that's a bug to fix, not to hide.
3. **Sentence case on every label, button, and heading.** Capitals only for proper nouns.
4. **Never put an appearance word in a semantic name.** A word that describes how a color looks (violet, coral, dark) belongs in the primitive layer only. A semantic name describes role (accent, error, background), never appearance.
5. **Never read a primitive directly.** Components consume the semantic layer, and the semantic layer references the primitives. If a component needs a color, size, or type value, it binds a semantic token, never `color/*`, `space/*`, or `font/*` directly.
6. **Never build something new when a component in this system already does the job.** Look at what exists before you make anything, including checking section 1 above for the closest match, even an imperfect or untested one.
7. **Never invent a component to fill a gap.** This is a real system that gets extended on purpose. Say what's missing and what you'd call it, and let Mia decide.
8. **Never stretch buttonGroup past its two fixed slots.** It's a Vertical or Horizontal pair, not a repeater. A third action means rethinking the pattern, not adding a child.
9. **Never assume a token property matches its own description without checking the bound value.** `font/tracking/*` is documented as a percent-based property. As of 2026-09-10, all 19 text styles in tokens.json (`display/l, m, s`, `headline/xl, l, m, s, xsBold, xsRegular, xxsBold, xxsRegular`, `body/*`, `caption/*`) reference `typography.tracking.tight/none/loose` rather than a hardcoded number; the previous 7 raw `letterSpacing` values on Display and large Headline styles are fixed. The live Figma file may still lag this export (bindings on the actual text style objects, not just tokens.json, are what render), so before shipping a change that depends on tracking, confirm the Figma text style's own bound value matches, not just tokens.json.
10. **Never bind to Depth or Blur size tokens assuming they're wired up.** Every Depth and Blur step audits as unbound and unused across the file. If you use one, you're likely the first, and it needs verification before it can be trusted as live.
11. **Never ship an untested state pairing without building and screenshotting it first.** Loading, Disabled, Coral, and most non-Default/Pressed states across button, buttonIcon, chips, and progressIndicator have zero real examples anywhere in the file. "The variant exists" is not the same as "the variant works."

---

## 5. Recall loop components

Seven component sets built specifically for the voice-based active-recall feature, reviewed against real hand-built precedent wherever one existed. Each one's full description below is reproduced verbatim from its Figma component-set description (What it is / When to use it / One thing to do); read those descriptions in Figma directly if this file and the file ever disagree, since Figma is the source of truth. The exception is textField, added 2026-09-16: its Figma component-set description is empty, so its entry below is written from structure and real usage instead of a verbatim quote.

**audioScrubber** — states (`state`): Default, Playing. No other properties.

What it is: 2-state playback control (Default/Playing) with an icon-only swap, no boolean properties.

When to use it: This backs "listen once more before deciding," the ability to replay a recorded answer before submitting it, and general audio playback anywhere the loop needs it. Real instances cover every screen with an attempt to play back: Learning-ready to send, Learning-processing, Learning-result-Recalled, Learning-result-Hinted1, Learning-result-Hinted2 (two, one per hint attempt), and Learning-result-I don't know. Learning-idle has none, since nothing's been recorded yet at that point.

One thing to do: Every screen above uses a real audioScrubber instance, so fixes to the component propagate everywhere rather than needing to be found and patched screen by screen. All 7 of those instances sit in Default, though: Playing has no real-screen instance anywhere, so what playback looks like mid-scrub is untested. Place one and screenshot it before a screen depends on it.

**inlineAlert** — states (`variant`): Success, Warning, Error, Info. Other properties: `showDescriptor` (boolean, default true).

What it is: 4-variant inline notice (Success/Warning/Error/Info), icon + title + optional descriptor (showDescriptor) in a single row, using real iconSlot instances rather than hand-drawn vectors.

When to use it: This is the "embedded in content" counterpart to snackbar's "floating at the bottom of the screen" notice, split out because they occupy different UI positions and shouldn't share one component. It was extracted from a repeated "Text section" pattern found inside speechBubble. Success and Warning have real precedent there; Error and Info do not yet.

One thing to do: Info falls back to text/secondary because the system has no dedicated info-semantic color token; confirm with whoever owns the tokens whether that's acceptable or whether a real info token should be added. Icons are check-circle (Success), alert-circle (Warning, confirmed key 13609:3292), x-circle (Error), and info-circle (Info), located by searching instance names rather than a documented icon list, since none of these keys were listed as candidates anywhere searchable.

**micButton** — states (`state`): Idle, Pressed, Processing, Recording. Other properties: `showLabel` (boolean, default true).

What it is: 4-state control (Idle/Pressed/Recording/Processing) built around Mia's new mic icon, with an optional showLabel toggle for a caption under the icon. The Recording state embeds a real statusIndicator instance (paired with a "Tap to stop" caption) instead of a hand-built status row.

When to use it: The tap-to-speak trigger for the voice active-recall loop, the moment a student starts and stops answering a term out loud. Real instances now cover three of its four states: Idle on Learning-idle and Learning-result-Hinted1, Recording on Learning-recording, and Processing on Learning-processing. Pressed is the only state with no real-screen instance; the explain-out-loud beta screens hand-build a large circular mic affordance, but at a size and interaction model not confirmed to match this component.

One thing to do: Confirm the intended interaction (tap-to-toggle vs. hold-to-record) before wiring transitions, since that decides what Pressed leads into, and check Processing's timing against actual speech-to-text latency. Pressed is the one state left without a real instance to check against, so design and screenshot it explicitly rather than assuming the press reads.

**speechBubble** — states (`state`): Prompt, Input, Success, Warning, Error, Loading. Other properties: `showSubtitle` (boolean, default true).

What it is: 6-state feedback bubble (Prompt/Success/Warning/Error/Loading/Input), an optional showSubtitle toggle, and a Header (icon + colored title + subtitle) above a message. Success/Warning/Error icon and title are bound to feedback/success/bold, text/warning, and feedback/error/bold respectively. Loading drops the Header and Message entirely for three animated dots bound to text/tertiary, used while Knowie is thinking. Input drops the Tail since it's not attached to a mascot avatar, it's the student's own typed message: real instances on Learning-typeResult-Recalled and Learning-typeProcessing, showing back what the student typed, not on Learning-typeInput itself, which is the entry field, not a result.

When to use it: Knowie's spoken/written response bubble in the recall loop, the thing a student reads after answering, plus the student's own typed-input shell (Input state). The tail+bubble shape is hand-built 11 times across live screens; this formalizes it as one component.

One thing to do: The Header's icon+title+subtitle structure duplicates what's built separately as inlineAlert, and their optional-text layers are named differently (Subtitle here, Descriptor there). Decide whether speechBubble's Success/Warning/Error headers should embed an inlineAlert instance instead of their own copy of the same pattern, since keeping both means every future header change has to be made twice.

**statusIndicator** — states (`status`): Recording, Ready. No other properties.

What it is: 2-variant status readout (status=Recording/Ready), a colored 9x9 dot plus a matching-color text label, no boolean properties.

When to use it: The single source for this pattern across the file. It's live in 2 real screens: embedded inside micButton's own Recording state (paired with "Tap to stop"), and placed directly in Learning-ready to send, showing "Ready to send" above the Redo/Send buttons. Both usages are bound to feedback/error/bold and feedback/success/bold. Two older duplicate copies sit in Archive, superseded screen versions, not live ones.

One thing to do: Only Recording and Ready have a real-screen precedent. The mic capture pipeline logically has a transitional step between "done recording" and "ready to send" (something is being transcribed or processed), but no real instance shows this pattern used for that step, so a third variant wasn't added speculatively. Confirm whether that in-between state should live here as a third variant or stay as the separate pagination-dot animation already documented in app-inventory.md.

**tag** — states (`status`): Recalled, Hinted, Revealed, Skipped. No other properties.

What it is: 4-variant status pill (Recalled/Hinted/Revealed/Skipped), a single text label with no icon.

When to use it: The per-term result label on the summary screen after a recall session. It's a standalone component, not an extension of chips: chips is a 16-variant primitive (size XXS-M, color Primary/pro, mandatory dual icon slots, fontSize8) built for a different job, tags and tool pickers, and is structurally too different to bend into this shape.

One thing to do: Hinted uses pro/bold + pro/onBold, not a warning token, because the system has no feedback/warning/bold+onBold family, only a lone text/warning scalar. That's a real gap worth filling. Revealed has real instances on the Summary screen (both the mixed and all-recalled variants), matching the Learning-result-Revealed and Learning-result-I don't know screens' own speechBubble Error state.

**textField** — states (`Variant`): Default, Error, Placeholder. Other properties: `showTitle` (boolean, default true), `showCaption` (boolean, default false), `showLeadingIcon` (boolean, default true), `showTrailingIcon` (boolean, default false).

What it is: Figma's own component-set description is empty. Structurally: a 3-variant text-entry field with a title label above, an optional caption below, and an optional leading/trailing icon inside the pill itself.

When to use it: The text-entry field this file previously had no component for — see the now-resolved `typeInput` gap this same doc used to flag. Real usage confirmed on Learning-typeInput: `Variant="Placeholder"`, `showTitle=false`, `showCaption=true`, both icons off, `Placeholder="Type a short answer..."`.

One thing to do: Two binding bugs found building this in code, confirmed via the Desktop Bridge plugin's variable-alias chains, not by matching rendered colors — the field's fill and the Error variant's border/caption color are each bound to a stray duplicate variable sharing a name with a real, correctly-named one (`background/input` and `feedback/error` respectively), not the canonical variable tokens.json actually exports. The leading icon sits inside an undocumented wrapper component named "Icon Slot" (Title Case, sizes XXS–M) and the trailing icon inside one named "Button icon" (Title Case, `Variant=Subtle/Primary/Neutral`) — both distinct from this file's own camelCase `iconSlot`/`buttonIcon`. No text in the component is bound to a text style at all (raw "Inter Variable" at sizes matching no step in the type scale). None of these block using the component — see `src/components/TextField/TextField.tsx`'s own doc comment for how each is worked around in code — but all four are Figma-side cleanup worth doing before this component gets more real usage.
