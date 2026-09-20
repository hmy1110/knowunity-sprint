import type { ButtonHTMLAttributes } from 'react'
import { StatusIndicator } from '../StatusIndicator/StatusIndicator'

/**
 * Knowunity `micButton` — Figma component set, node 13628:12744 in the
 * "Yummy__Knowie Design System" file (🎨 Mascot & components page, one
 * of the six components built for the voice active-recall sprint).
 *
 * Figma's own component description (verbatim):
 *
 * > What it is: 4-state control (Idle/Pressed/Recording/Processing)
 * > built around Mia's new mic icon, with an optional showLabel toggle
 * > for a caption under the icon. The Recording state embeds a real
 * > statusIndicator instance (paired with a "Tap to stop" caption)
 * > instead of a hand-built status row. When to use it: The tap-to-speak
 * > trigger for the voice active-recall loop, the moment a student
 * > starts and stops answering a term out loud. Real instances now cover
 * > three of its four states: Idle on Learning-idle and
 * > Learning-result-Hinted1, Recording on Learning-recording, and
 * > Processing on Learning-processing. Pressed is the only state with no
 * > real-screen instance; the explain-out-loud beta screens hand-build a
 * > large circular mic affordance, but at a size and interaction model
 * > not confirmed to match this component. One thing to do: Confirm the
 * > intended interaction (tap-to-toggle vs. hold-to-record) before
 * > wiring transitions, since that decides what Pressed leads into, and
 * > check Processing's timing against actual speech-to-text latency.
 * > Pressed is the one state left without a real instance to check
 * > against, so design and screenshot it explicitly rather than assuming
 * > the press reads.
 *
 * Recording embeds a real StatusIndicator instance
 * (../StatusIndicator/StatusIndicator.tsx, status="Recording") rather
 * than hand-building the dot+label — see that component's own doc
 * comment for why it exists as a separate file.
 *
 * **Not resolved here, per Figma's own "one thing to do" above:** the
 * tap-to-toggle vs. hold-to-record interaction model. This component is
 * purely presentational, exactly like Button/ButtonIcon/Chips — `state`
 * is fully controlled by the caller, no internal recording/timer logic
 * is invented, and standard button props (`onClick`, `onPointerDown`,
 * etc.) pass through via `...rest` for whichever model the caller wires
 * up. Deciding that model is explicitly Mia's call, not a default to
 * silently bake in.
 *
 * There is no `icon` prop. Unlike ButtonIcon/Chips/IconSlot, Figma's own
 * micButton has no instance-swap icon property at all — the mic glyph
 * ("Mia's new mic icon") is fixed content baked into the component
 * itself, confirmed from the design context response never exposing an
 * icon slot, only two fixed exported SVGs (one per icon-bearing state).
 * Both are reproduced inline below with their hardcoded Figma fill/
 * stroke colors swapped for `currentColor`, tinted via the same
 * semantic-token color the rest of that state already uses — the Idle/
 * Pressed glyph's `#090C18` stroke is exactly `interactive/onPrimary`,
 * and the Processing glyph's `white @ 40%` fill is exactly `text/
 * disabled`, both confirmed by comparing the raw SVG export against
 * tokens.css rather than assumed from looking similar.
 *
 * Gaps found while building this (flagged, not silently invented,
 * consistent with how Button/ButtonIcon/Chips/ProgressIndicator handle
 * the same kind of gap — confirmed via get_variable_defs on the real
 * node, not by matching rendered values):
 *
 * - The 56px circle diameter and the 26px icon size (Idle/Pressed/
 *   Processing) are hardcoded literals with no bound variable, the same
 *   kind of gap as ButtonIcon's own circle diameters.
 * - The outer stack's gap (8px for Idle/Pressed/Processing, 16px for
 *   Recording) is an unbound literal — Figma's own reference code
 *   renders it as a plain number, never `var(...)`, unlike the
 *   waveform's padding (space/600 + space/200) and radius (radius/Full),
 *   which genuinely are bound and are reproduced as such below.
 * - The waveform's 12 bars are unbound literals throughout: each bar's
 *   2px width, the 3px gap between bars, and the 2px corner radius all
 *   render as bare numbers in Figma with no bound variable
 *   (get_variable_defs surfaces a literal named "corner radius/2", not
 *   a `var(...)` reference, confirming it's genuinely unbound rather
 *   than just missing from the response). The 12 per-bar heights are a
 *   static snapshot straight from Figma's own frame, not a live
 *   waveform — this sprint has no real audio to visualize (see
 *   CLAUDE.md: "The recall is mocked. No speech-to-text, no audio.");
 *   animating these bars would be inventing a behavior Figma doesn't
 *   show, not reproducing one.
 *
 * **One deliberate simplification, not a gap:** Figma's Pressed fill is
 * two stacked opaque gradients (`interactive/primaryActive` painted over
 * `interactive/primary`). Since the top layer is fully opaque, it
 * entirely occludes the one beneath — the visible result is just
 * `interactive/primaryActive` — so this renders it as a single solid
 * fill rather than reproducing an invisible second layer. Confirmed from
 * get_variable_defs: both tokens are genuinely bound here, this only
 * simplifies redundant paint stacking, not the color itself.
 *
 * `aria-label` is set automatically from the current state's own caption
 * text (not a caller-supplied prop, unlike ButtonIcon's `label`) — every
 * state's text is already fully determined and unambiguous, and this
 * keeps the control accessible even when `showLabel` hides the caption
 * visually (Idle/Pressed/Processing only; Recording's "Tap to stop" is
 * never hidden by `showLabel` in Figma's own structure, see below).
 * `state="Processing"` also sets `disabled`, matching how ButtonIcon and
 * Button already treat their own busy/Loading state.
 */

export type MicButtonState = 'Idle' | 'Pressed' | 'Processing' | 'Recording'

export interface MicButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> {
  /** Which of the four states this instance is in — see the component doc comment. */
  state?: MicButtonState
  /**
   * Shows the caption under the icon at Idle/Pressed/Processing. Has no
   * effect on Recording's "Tap to stop" caption, which Figma's own
   * structure never gates behind this toggle — see the component doc
   * comment.
   */
  showLabel?: boolean
  /**
   * Overrides the current state's default caption (and its aria-label).
   * Added for Learning-result-Hinted1's real Idle instance, whose own
   * caption reads "Try again" rather than "Tap to speak" — the same
   * icon+state, a re-attempt entry point rather than a first attempt.
   */
  label?: string
}

// state=Idle,Pressed,Processing -> circle fill and icon color. Recording
// has no circle at all (see render below), so it isn't a case here.
// Confirmed from Figma's real bound variables, not by matching rendered
// colors — the Pressed fill is a deliberate simplification of a
// two-layer stack, see doc comment above.
const CIRCLE_CONFIG: Record<'Idle' | 'Pressed' | 'Processing', { fillVar: string; iconColorVar: string }> = {
  Idle: { fillVar: '--semantic-color-interactive-primary', iconColorVar: '--semantic-color-interactive-on-primary' },
  Pressed: {
    fillVar: '--semantic-color-interactive-primary-active',
    iconColorVar: '--semantic-color-interactive-on-primary',
  },
  Processing: { fillVar: '--semantic-color-interactive-disabled', iconColorVar: '--semantic-color-text-disabled' },
}

// The 12 waveform bar heights, straight off Figma's own static frame —
// see doc comment above for why this isn't animated.
const WAVEFORM_BAR_HEIGHTS = [12, 20, 28, 14, 24, 32, 12, 22, 28, 12, 20, 10]

// Traced from the Idle/Pressed export (component 13628:12744's "Mic
// Icon" state), stroke color swapped for currentColor — see doc comment
// above.
function MicIconIdle() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16.25 5.41667C16.25 3.62174 14.7949 2.16667 13 2.16667C11.2051 2.16667 9.75 3.62174 9.75 5.41667V11.9167C9.75 13.7116 11.2051 15.1667 13 15.1667C14.7949 15.1667 16.25 13.7116 16.25 11.9167V5.41667Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M5.41667 10.8333V11.9167C5.41667 16.1048 8.81184 19.5 13 19.5C17.1882 19.5 20.5833 16.1048 20.5833 11.9167V10.8333"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 19.5V23.8333M13 23.8333H9.75M13 23.8333H16.25"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Traced from the Processing export, fill color swapped for
// currentColor (fill-opacity dropped since text/disabled's own alpha
// already matches it exactly) — see doc comment above.
function MicIconProcessing() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6.41667 10.8333C6.41667 10.281 5.96895 9.83333 5.41667 9.83333C4.86438 9.83333 4.41667 10.281 4.41667 10.8333H5.41667H6.41667ZM21.5833 10.8333C21.5833 10.281 21.1356 9.83333 20.5833 9.83333C20.031 9.83333 19.5833 10.281 19.5833 10.8333H20.5833H21.5833ZM9.75 22.8333C9.19772 22.8333 8.75 23.281 8.75 23.8333C8.75 24.3856 9.19772 24.8333 9.75 24.8333V23.8333V22.8333ZM16.25 24.8333C16.8023 24.8333 17.25 24.3856 17.25 23.8333C17.25 23.281 16.8023 22.8333 16.25 22.8333V23.8333V24.8333ZM13 2.16667V3.16667C14.2426 3.16667 15.25 4.17403 15.25 5.41667H16.25H17.25C17.25 3.06946 15.3472 1.16667 13 1.16667V2.16667ZM16.25 5.41667H15.25V11.9167H16.25H17.25V5.41667H16.25ZM16.25 11.9167H15.25C15.25 13.1593 14.2426 14.1667 13 14.1667V15.1667V16.1667C15.3472 16.1667 17.25 14.2639 17.25 11.9167H16.25ZM13 15.1667V14.1667C11.7574 14.1667 10.75 13.1593 10.75 11.9167H9.75H8.75C8.75 14.2639 10.6528 16.1667 13 16.1667V15.1667ZM9.75 11.9167H10.75V5.41667H9.75H8.75V11.9167H9.75ZM9.75 5.41667H10.75C10.75 4.17403 11.7574 3.16667 13 3.16667V2.16667V1.16667C10.6528 1.16667 8.75 3.06946 8.75 5.41667H9.75ZM5.41667 10.8333H4.41667V11.9167H5.41667H6.41667V10.8333H5.41667ZM5.41667 11.9167H4.41667C4.41667 16.6571 8.25956 20.5 13 20.5V19.5V18.5C9.36413 18.5 6.41667 15.5525 6.41667 11.9167H5.41667ZM13 19.5V20.5C17.7405 20.5 21.5833 16.6571 21.5833 11.9167H20.5833H19.5833C19.5833 15.5525 16.6359 18.5 13 18.5V19.5ZM20.5833 11.9167H21.5833V10.8333H20.5833H19.5833V11.9167H20.5833ZM13 19.5H12V23.8333H13H14V19.5H13ZM13 23.8333V22.8333H9.75V23.8333V24.8333H13V23.8333ZM13 23.8333V24.8333H16.25V23.8333V22.8333H13V23.8333Z"
        fill="currentColor"
      />
    </svg>
  )
}

// State -> caption text, used both as the visible label and as the
// always-present aria-label — see doc comment above.
const STATE_CAPTION: Record<MicButtonState, string> = {
  Idle: 'Tap to speak',
  Pressed: 'Tap to speak',
  Processing: 'Processing…',
  Recording: 'Tap to stop',
}

export function MicButton({ state = 'Idle', showLabel = true, label, className, style, ...rest }: MicButtonProps) {
  const isRecording = state === 'Recording'
  const isProcessing = state === 'Processing'
  const caption = label ?? STATE_CAPTION[state]

  return (
    <button
      type="button"
      disabled={isProcessing}
      aria-busy={isProcessing}
      aria-label={caption}
      className={`inline-flex flex-col shrink-0 items-center ${className ?? ''}`}
      style={{
        gap: isRecording ? 16 : 8, // Not bound to a token in Figma — see doc comment above.
        ...style,
      }}
      {...rest}
    >
      {!isRecording && (
        <>
          <span
            className="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full"
            style={{
              width: 56, // Not bound to a token in Figma — see doc comment above.
              height: 56, // Not bound to a token in Figma — see doc comment above.
              background: `var(${CIRCLE_CONFIG[state].fillVar})`,
            }}
          >
            <span
              className="inline-flex shrink-0"
              style={{
                width: 26, // Not bound to a token in Figma — see doc comment above.
                height: 26, // Not bound to a token in Figma — see doc comment above.
                color: `var(${CIRCLE_CONFIG[state].iconColorVar})`,
              }}
            >
              {isProcessing ? <MicIconProcessing /> : <MicIconIdle />}
            </span>
          </span>

          {showLabel && (
            <p
              className="whitespace-nowrap text-center"
              style={{
                margin: 0,
                // All four states bind `text/secondary` (Figma rebound the
                // Processing caption from `text/disabled`, checked 2026-09-19).
                color: 'var(--semantic-color-text-secondary)',
                // Idle/Pressed/Processing captions have no bound text style
                // in Figma (checked 2026-09-19): 14px Greed SemiBold, 0%
                // tracking, auto line height (17px), which is why the
                // component is 77px wide here vs. 105px+ with Recording's
                // bound 1px tracking. Family, weight and size match
                // `headline-xxs-bold` exactly and stay bound to it; tracking
                // and line height are the unbound part and stay literal.
                fontFamily: 'var(--type-scale-headline-xxs-bold-font-family)',
                fontWeight: 'var(--type-scale-headline-xxs-bold-font-weight)',
                fontSize: 'var(--type-scale-headline-xxs-bold-font-size)',
                lineHeight: 'normal',
                letterSpacing: 0,
              }}
            >
              {caption}
            </p>
          )}
        </>
      )}

      {isRecording && (
        <>
          <StatusIndicator status="Recording" />

          <span
            className="inline-flex shrink-0 items-center justify-center"
            style={{
              gap: 3, // Not bound to a token in Figma — see doc comment above.
              paddingInline: 'var(--size-space-600)',
              paddingBlock: 'var(--size-space-200)',
              borderRadius: 'var(--size-radius-full)',
              background: 'var(--semantic-color-accent-brand-bold)',
            }}
          >
            {WAVEFORM_BAR_HEIGHTS.map((heightPx, i) => (
              <span
                key={i}
                className="shrink-0"
                style={{
                  width: 2, // Not bound to a token in Figma — see doc comment above.
                  height: heightPx,
                  borderRadius: 2, // Not bound to a token in Figma — see doc comment above.
                  background: 'var(--semantic-color-background-page)',
                }}
              />
            ))}
          </span>

          <p
            className="whitespace-nowrap text-center"
            style={{
              margin: 0,
              color: 'var(--semantic-color-text-secondary)',
              fontFamily: 'var(--type-scale-headline-xxs-bold-font-family)',
              fontWeight: 'var(--type-scale-headline-xxs-bold-font-weight)',
              fontSize: 'var(--type-scale-headline-xxs-bold-font-size)',
              lineHeight: 'var(--type-scale-headline-xxs-bold-line-height)',
              letterSpacing: 'var(--type-scale-headline-xxs-bold-letter-spacing)',
            }}
          >
            {STATE_CAPTION.Recording}
          </p>
        </>
      )}
    </button>
  )
}
