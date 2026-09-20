import type { CSSProperties, ReactNode } from 'react'
import { IconSlot } from '../IconSlot/IconSlot'

/**
 * Knowunity `speechBubble` — Figma component set, node 13628:13316 in
 * the "Yummy__Knowie Design System" file (🎨 Mascot & components page,
 * one of the six components built for the voice active-recall sprint).
 *
 * Figma's own component description (verbatim):
 *
 * > What it is: 6-state feedback bubble (Prompt/Success/Warning/Error/
 * > Loading/Input), an optional showSubtitle toggle, and a Header (icon
 * > + colored title + subtitle) above a message. Success/Warning/Error
 * > icon and title are bound to feedback/success/bold, text/warning,
 * > and feedback/error/bold respectively. Loading drops the Header and
 * > Message entirely for three animated dots bound to text/tertiary,
 * > used while Knowie is thinking. Input drops the Tail since it's not
 * > attached to a mascot avatar, it's the student's own typed message:
 * > real instances on Learning-typeResult-Recalled and
 * > Learning-typeProcessing, showing back what the student typed, not
 * > on Learning-typeInput itself, which is the entry field, not a
 * > result. When to use it: Knowie's spoken/written response bubble in
 * > the recall loop, the thing a student reads after answering, plus
 * > the student's own typed-input shell (Input state). The tail+bubble
 * > shape is hand-built 11 times across live screens; this formalizes
 * > it as one component. One thing to do: The Header's icon+title+
 * > subtitle structure duplicates what's built separately as
 * > inlineAlert, and their optional-text layers are named differently
 * > (Subtitle here, Descriptor there). Decide whether speechBubble's
 * > Success/Warning/Error headers should embed an inlineAlert instance
 * > instead of their own copy of the same pattern, since keeping both
 * > means every future header change has to be made twice.
 *
 * No existing Storybook component covers the bubble itself — checked
 * all 12 existing components; none is a chat-style feedback bubble.
 * **Reuses IconSlot** for the Header's icon (../IconSlot/IconSlot.tsx)
 * — confirmed structurally, the icon sits in a nested instance
 * literally named "iconSlot" at exactly `icon/300`, the same
 * confirmed-bound pattern AppBar's icon buttons use.
 *
 * **`inlineAlert` is explicitly NOT built or embedded here — flagged
 * for Mia, not resolved silently.** Figma's own description frames the
 * Header/inlineAlert overlap as an open decision ("Decide whether..."),
 * not a confirmed real embedding the way MicButton's Recording state
 * genuinely does embed a real statusIndicator instance. inlineAlert
 * doesn't exist in this codebase yet either. Building it now and
 * embedding it here would be answering a question Figma's own text
 * says is still open — so this reproduces the Header as its own
 * self-contained icon+title+subtitle block, matching the live file's
 * actual current structure, not the possible future one.
 *
 * **The icon+title color-pairing gap the description doesn't mention is
 * already fixed in the live file** — worth confirming rather than
 * re-flagging: each icon's own hardcoded fill (`#00C386`/`#FCD34D`/
 * `#FF6B6B`) exactly matches its title's bound color
 * (`feedback/success/bold`/`text/warning`/`feedback/error/bold`), so
 * the "originally paired Success icon with `accent/green/bold` instead
 * of `feedback/success/bold`" issue design-system.md's naming section
 * describes is not present in this node as it stands today. Icons are
 * traced inline (fill swapped for `currentColor`) rather than fetched
 * from Figma's expiring asset URLs, tinted via the same token as the
 * adjacent title — same discipline as MicButton's icon.
 *
 * Gaps found while building this (flagged, not silently invented,
 * confirmed via `get_variable_defs` on the real node):
 *
 * - The bubble's 237px width, 16px padding, 16px corner radius, every
 *   internal gap (4px between icon and title, 2px between title row and
 *   subtitle, 4px between header/subtitle and message), the tail's 19px
 *   width and -6px overlap margin, and the loading dots' 7px diameter
 *   /5px gap are all hardcoded literals in Figma with no bound
 *   variable — several numerically match real space/radius steps, but
 *   Figma's own reference code renders every one of them as a bare
 *   number, never `var(...)`, so none are bound here either, the same
 *   "don't bind by matching value" discipline every component since
 *   Button has followed.
 * - **The Header's title text has no bound type style at all — not
 *   even an unnamed one.** Every other text run in this component
 *   binds a real composite `type-scale` token (`headline.xsRegular` for
 *   Prompt/Warning/Input, `body.mRegular` for Success/Error — a genuine
 *   split Figma's own file makes between states that otherwise look
 *   like "the same message style," reproduced exactly as bound, not
 *   smoothed over). The title alone renders as a bare `20px` Bold with
 *   no `var(...)` anywhere in its font declaration — no semantic
 *   token, and CLAUDE.md forbids reading the primitive layer
 *   (`font/*`) directly even if one matched. With neither route
 *   available, it's reproduced as Figma's own literal values (20px,
 *   weight 700, `leading: normal`), the same treatment every other
 *   component's non-text literal gaps already get, just applied to a
 *   font declaration instead of a size or color for the first time.
 * - A `stroke/border` variable is bound somewhere in this node's
 *   subtree (present in the full-node `get_variable_defs` call), but no
 *   `border` class appears anywhere in Figma's own reference code for
 *   any state — it has no visible rendered effect to reproduce. Left
 *   out rather than added speculatively, consistent with
 *   design-system.md rule #10 on not trusting a bound-but-unused token.
 *
 * **The tail pointer's positioning reproduces Figma's own mechanism
 * exactly, not an approximation.** Figma centers a 15×19 box (pre-
 * rotation) via CSS container queries (`100cqw`/`100cqh`), rotates it
 * `-90deg`, and insets the pointer image inside it asymmetrically
 * (`top 7.43%, right 10.39%, bottom 25%, left 10.39%`) — the bottom
 * inset is more than 3x the top inset, so the pointer sits genuinely
 * off-center (shifted toward the bubble-facing side), not simply
 * centered in its box. An earlier version of this component simplified
 * that down to plain flex-centering, which rendered visibly
 * different (dead-centered) from Figma's real output; this reproduces
 * the actual mechanism — container query, rotation, and exact inset
 * percentages — so the two match pixel-for-pixel instead of just
 * approximately.
 *
 * **The loading dots are a static illustration, not animated** — all
 * three render at the exact same opacity in Figma's own frame, so
 * nothing here pulses or bounces; inventing that motion would be
 * adding a behavior Figma doesn't show, the same reasoning MicButton's
 * waveform doc comment gives for not animating its bars.
 */

export type SpeechBubbleState = 'Prompt' | 'Success' | 'Warning' | 'Error' | 'Loading' | 'Input'

export interface SpeechBubbleProps {
  /** Which of the six states this instance is in — see the component doc comment. */
  state?: SpeechBubbleState
  /** Shows the subtitle/caption line — Success/Warning/Error's Header subtitle, and Input's "You typed" caption. No effect on Prompt or Loading, which never have one. */
  showSubtitle?: boolean
  /** Header title — Success/Warning/Error only. Defaults to Figma's own placeholder text for the state. */
  title?: string
  /** Subtitle/caption text — Success/Warning/Error's Header subtitle, or Input's "You typed" caption. Defaults to Figma's own placeholder text for the state. */
  subtitle?: string
  /** The main message, or the echoed input text at Input. No effect on Loading, which has no message. Defaults to Figma's own placeholder text for the state. */
  message?: string
  className?: string
  style?: CSSProperties
}

const DEFAULT_CONTENT: Record<SpeechBubbleState, { title?: string; subtitle?: string; message?: string }> = {
  Prompt: { message: 'Let’s start. Explain the term “Inspiration” out loud, in your own words.' },
  Success: {
    title: 'Nice!',
    subtitle: 'Unaided',
    message: 'You said: ‘It’s the spark that makes you want to create something’',
  },
  Warning: {
    title: 'Not quite yet.',
    subtitle: 'Hint 1 of 2',
    message: 'No worries. Think about the very first step, before you start narrowing down to your favourite idea.',
  },
  Error: {
    title: 'Here’s the answer.',
    subtitle: 'Revealed',
    message: 'Inspiration is the spark or idea that motivates you to start creating something.',
  },
  Loading: {},
  Input: { subtitle: 'You typed', message: 'Type a short answer…' },
}

// state -> title/message color and the message's own type-scale token.
// Confirmed bound via get_variable_defs, not matched by value — the
// Prompt/Warning/Input vs. Success/Error message-style split is real,
// see doc comment above.
const HEADER_COLOR_VAR: Partial<Record<SpeechBubbleState, string>> = {
  Success: '--semantic-color-feedback-success-bold',
  Warning: '--semantic-color-text-warning',
  Error: '--semantic-color-feedback-error-bold',
}
const MESSAGE_TYPE_SCALE: Partial<Record<SpeechBubbleState, string>> = {
  Prompt: '--type-scale-headline-xs-regular',
  Warning: '--type-scale-headline-xs-regular',
  Input: '--type-scale-headline-xs-regular',
  Success: '--type-scale-body-m-regular',
  Error: '--type-scale-body-m-regular',
}

function CheckCircleIcon() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12ZM15.793 8.29297C16.1835 7.90244 16.8165 7.90244 17.207 8.29297C17.5976 8.68349 17.5976 9.31651 17.207 9.70703L11.207 15.707C10.8165 16.0976 10.1835 16.0976 9.79297 15.707L6.79297 12.707C6.40244 12.3165 6.40244 11.6835 6.79297 11.293C7.18349 10.9024 7.81651 10.9024 8.20703 11.293L10.5 13.5859L15.793 8.29297ZM23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12Z"
        fill="currentColor"
      />
    </svg>
  )
}
function AlertCircleIcon() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12ZM12.0098 15C12.5621 15 13.0098 15.4477 13.0098 16C13.0098 16.5523 12.5621 17 12.0098 17H12C11.4477 17 11 16.5523 11 16C11 15.4477 11.4477 15 12 15H12.0098ZM11 12V8C11 7.44772 11.4477 7 12 7C12.5523 7 13 7.44772 13 8V12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12ZM23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12Z"
        fill="currentColor"
      />
    </svg>
  )
}
function XCircleIcon() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12ZM14.293 8.29297C14.6835 7.90244 15.3165 7.90244 15.707 8.29297C16.0976 8.68349 16.0976 9.31651 15.707 9.70703L13.4141 12L15.707 14.293C16.0976 14.6835 16.0976 15.3165 15.707 15.707C15.3165 16.0976 14.6835 16.0976 14.293 15.707L12 13.4141L9.70703 15.707C9.31651 16.0976 8.68349 16.0976 8.29297 15.707C7.90244 15.3165 7.90244 14.6835 8.29297 14.293L10.5859 12L8.29297 9.70703C7.90244 9.31651 7.90244 8.68349 8.29297 8.29297C8.68349 7.90244 9.31651 7.90244 9.70703 8.29297L12 10.5859L14.293 8.29297ZM23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12Z"
        fill="currentColor"
      />
    </svg>
  )
}

const HEADER_ICON: Partial<Record<SpeechBubbleState, ReactNode>> = {
  Success: <CheckCircleIcon />,
  Warning: <AlertCircleIcon />,
  Error: <XCircleIcon />,
}

// Traced from Figma's Tail Pointer export (11.8831×12.8389), fill
// swapped for currentColor. Sized 100%/100% — its parent is the
// percentage-inset box that reproduces Figma's own positioning exactly,
// see the render below. Used by Prompt/Success/Warning/Error.
function TailPointer() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 11.8831 12.8389" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5.03163 0.585249C5.38731 -0.195083 6.49583 -0.195083 6.8515 0.585249L11.7919 11.4242C12.0937 12.0864 11.6097 12.8389 10.882 12.8389H1.00116C0.273422 12.8389 -0.210605 12.0864 0.091226 11.4242L5.03163 0.585249Z"
        fill="currentColor"
      />
    </svg>
  )
}

// Traced from Figma's own separate Loading-state tail export
// (19×47, already left-pointing — no rotation needed), fill swapped
// for currentColor. A genuinely different asset from TailPointer
// above, not a rotated/resized copy of it — reproduced as two shapes
// because Figma draws them as two shapes.
function TailLoading() {
  return (
    <svg width="19" height="47" viewBox="0 0 19 47" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.99633 24.4099C1.216 24.0543 1.216 22.9457 1.99633 22.5901L12.8352 17.6497C13.4974 17.3478 14.25 17.8319 14.25 18.5596L14.25 28.4404C14.25 29.1681 13.4974 29.6522 12.8352 29.3503L1.99633 24.4099Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function SpeechBubble({
  state = 'Prompt',
  showSubtitle = true,
  title: titleProp,
  subtitle: subtitleProp,
  message: messageProp,
  className,
  style,
}: SpeechBubbleProps) {
  const defaults = DEFAULT_CONTENT[state]
  const title = titleProp ?? defaults.title
  const subtitle = subtitleProp ?? defaults.subtitle
  const message = messageProp ?? defaults.message

  const hasHeader = ['Success', 'Warning', 'Error'].includes(state)
  const hasTail = state !== 'Input'
  const hasMessage = state !== 'Loading'
  const hasSubtitle = showSubtitle && Boolean(subtitle) && state !== 'Prompt' && state !== 'Loading'
  const headerColorVar = HEADER_COLOR_VAR[state]
  const messageTypeScale = MESSAGE_TYPE_SCALE[state]

  // Bound to `text/primary` (Figma rebound it from `text/secondary`,
  // checked 2026-09-19). Inside the Header for Success/Warning/Error (2px
  // under the title row), directly in the bubble for Input.
  const subtitleElement = (
    <p
      className="w-full"
      style={{
        margin: 0,
        color: 'var(--semantic-color-text-primary)',
        fontFamily: 'Inter, sans-serif', // Raw, unbound "Inter" — see StatusIndicator.tsx for the same gap.
        fontWeight: 400,
        fontSize: 12,
        lineHeight: 'normal',
      }}
    >
      {subtitle}
    </p>
  )

  return (
    <div className={`inline-flex items-start ${className ?? ''}`} style={style}>
      {hasTail && (
        <div
          className="relative shrink-0 self-stretch overflow-hidden"
          style={{
            width: 19, // Not bound to a token in Figma — see doc comment above.
            marginRight: -6, // Not bound to a token in Figma — see doc comment above.
            height: state === 'Loading' ? 47 : undefined, // Not bound to a token in Figma — see doc comment above.
            color: 'var(--semantic-color-background-surface)',
          }}
        >
          {state === 'Loading' ? (
            <TailLoading />
          ) : (
            // Reproduces Figma's real, off-center placement exactly —
            // not a container-query replay (that mechanism turned out
            // not to render reliably: `container-type: size` on an
            // absolutely-positioned box sized only by left/right insets
            // doesn't give `cqw`/`cqh` a definite value to resolve
            // against in practice, verified by screenshotting it and
            // seeing the tail render diagonally, not rotated cleanly).
            // Instead, the same rotation is solved directly: Figma
            // rotates a 15×19 box -90deg around its center inside this
            // 19×15 container, with the pointer inset inside that box
            // at 10.39%/7.43%/10.39%/25% (left/top/right/bottom). A
            // rotation around center preserves the center point, so the
            // pointer's final on-screen center is this container's own
            // center (9.5, 7.5) shifted by that pre-rotation offset,
            // itself rotated -90deg — which resolves to (-1.669, 0),
            // i.e. purely leftward, matching an "up" offset rotated
            // counterclockwise into a "left" one. Placing the
            // native-size (unrotated) pointer at the matching left/top
            // and then rotating it -90deg in place reproduces that same
            // final center with plain arithmetic instead of container
            // queries.
            <div
              className="absolute"
              style={{
                left: 0,
                right: 0,
                top: 'calc(50% - 0.5px)', // Not bound to a token in Figma — see doc comment above.
                height: 15, // Not bound to a token in Figma — see doc comment above.
                transform: 'translateY(-50%)',
              }}
            >
              <div
                className="absolute"
                style={{
                  left: 1.88945, // (19/2 − 1.66885) − 11.8831/2 — see comment above.
                  top: 1.08055, // 15/2 − 12.8389/2 — see comment above.
                  width: 11.8831,
                  height: 12.8389,
                  transform: 'rotate(-90deg)',
                }}
              >
                <TailPointer />
              </div>
            </div>
          )}
        </div>
      )}

      <div
        className="relative flex shrink-0 flex-col items-start overflow-hidden"
        style={{
          // 237px is the component's own width; every real instance
          // (21 across the Learning-* frames, checked 2026-09-19) overrides
          // the Bubble to "fill container", so it grows to whatever width
          // the parent gives the root (`flex-1`, `w-full`) and stays 237px
          // when the root hugs, as in Figma's own component set.
          flex: '1 0 237px', // Not bound to a token in Figma — see doc comment above.
          // Without this, a hugging root would grow to the message's
          // unwrapped width (a growing flex item contributes its
          // max-content size to the parent's intrinsic width).
          contain: 'inline-size',
          padding: 16, // Not bound to a token in Figma — see doc comment above.
          borderRadius: 16, // Not bound to a token in Figma — see doc comment above.
          gap: hasHeader || state === 'Input' ? 4 : undefined, // Not bound to a token in Figma — see doc comment above.
          background: 'var(--semantic-color-background-surface)',
        }}
      >
        {hasHeader && (
          <div className="flex w-full shrink-0 flex-col items-start" style={{ gap: 2 }}>
            <div className="inline-flex shrink-0 items-center" style={{ gap: 4 }}>
              <IconSlot size="300" icon={HEADER_ICON[state]} style={{ color: `var(${headerColorVar})` }} />
              <p
                className="whitespace-nowrap"
                style={{
                  margin: 0,
                  color: `var(${headerColorVar})`,
                  // No bound type style exists for this text run, and
                  // CLAUDE.md forbids reading the font/* primitive
                  // layer directly — reproduced as Figma's own literal
                  // values, see doc comment above.
                  fontFamily: "'Greed VF-TRIAL', sans-serif",
                  fontWeight: 700,
                  fontSize: 20,
                  lineHeight: 'normal',
                }}
              >
                {title}
              </p>
            </div>
            {hasSubtitle && subtitleElement}
          </div>
        )}

        {/* Input has no Header: its "You typed" subtitle sits directly in
            the bubble, 4px above the message. */}
        {!hasHeader && hasSubtitle && subtitleElement}

        {hasMessage && messageTypeScale && (
          <p
            className="w-full"
            style={{
              margin: 0,
              color: 'var(--semantic-color-text-primary)',
              fontFamily: `var(${messageTypeScale}-font-family)`,
              fontWeight: `var(${messageTypeScale}-font-weight)`,
              fontSize: `var(${messageTypeScale}-font-size)`,
              lineHeight: `var(${messageTypeScale}-line-height)`,
              letterSpacing: `var(${messageTypeScale}-letter-spacing)`,
            }}
          >
            {message}
          </p>
        )}

        {state === 'Loading' && (
          <div className="inline-flex shrink-0 items-center" style={{ gap: 5, height: 15 }}>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="shrink-0 rounded-full"
                style={{
                  width: 7, // Not bound to a token in Figma — see doc comment above.
                  height: 7, // Not bound to a token in Figma — see doc comment above.
                  background: 'var(--semantic-color-text-tertiary)',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
