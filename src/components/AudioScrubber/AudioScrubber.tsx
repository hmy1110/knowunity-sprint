import type { ButtonHTMLAttributes } from 'react'

/**
 * Knowunity `audioScrubber` — Figma component set, node 13628:12922 in
 * the "Yummy__Knowie Design System" file (🎨 Mascot & components page,
 * one of the six components built for the voice active-recall sprint).
 *
 * Figma's own component description (verbatim):
 *
 * > What it is: 2-state playback control (Default/Playing) with an
 * > icon-only swap, no boolean properties. When to use it: This backs
 * > "listen once more before deciding," the ability to replay a
 * > recorded answer before submitting it, and general audio playback
 * > anywhere the loop needs it. Real instances cover every screen with
 * > an attempt to play back: Learning-ready to send, Learning-processing,
 * > Learning-result-Recalled, Learning-result-Hinted1,
 * > Learning-result-Hinted2 (two, one per hint attempt), and
 * > Learning-result-I don't know. Learning-idle has none, since
 * > nothing's been recorded yet at that point. One thing to do: Every
 * > screen above uses a real audioScrubber instance, so fixes to the
 * > component propagate everywhere rather than needing to be found and
 * > patched screen by screen. All 7 of those instances sit in Default,
 * > though: Playing has no real-screen instance anywhere, so what
 * > playback looks like mid-scrub is untested. Place one and screenshot
 * > it before a screen depends on it.
 *
 * No existing Storybook component covers this — checked AppBar, Button,
 * ButtonGroup, ButtonIcon, Chips, IconSlot, MascotSlot, MicButton,
 * ProgressIndicator, StatusIndicator, TextBlock; none is a playback
 * control, so this is a new component, not a reuse of one of those.
 *
 * **No `icon` prop, same reasoning as MicButton's fixed mic glyph.**
 * design-system.md's own phrase "icon-only swap" describes swapping
 * *between the component's own two fixed states* (a play triangle, or
 * two pause bars), not a caller-configurable slot — confirmed structurally:
 * the icon area is a bespoke layer named "Play Button" with two
 * hardcoded renders, not an `iconSlot` instance (unlike AppBar's icon
 * buttons, which genuinely do nest real `iconSlot` instances and take
 * caller content — see AppBar.tsx). Both icons are traced inline below
 * with their hardcoded Figma fill color (`#F4F2FF`, exactly
 * `interactive/primary`) swapped for `currentColor`, tinted via that
 * same bound token.
 *
 * **Almost nothing else here is a bound token.** `get_variable_defs` on
 * the real node returns exactly two entries for the entire component —
 * `interactive/primary` (every icon/bar/pause-bar color) and
 * `background/input` (the pill fill) — confirmed, not assumed. Every
 * other value is a hardcoded literal in Figma with no bound variable
 * behind it, flagged rather than silently bound to a same-numbered
 * token (several literals here, like the 16px/4px padding, happen to
 * equal real space steps, but Figma's own reference code renders them
 * as bare numbers, never `var(...)` — the same "don't bind by matching
 * value" discipline buttonVariants.ts and every component since has
 * followed):
 *
 * - The pill's 40px corner radius (no radius token is 40px — the scale
 *   jumps from 36 to the 9999px `radius/Full`).
 * - The pill's 16px/4px padding.
 * - The play/pause icon area's 24×24 box (not bound to `icon/300`
 *   despite matching it numerically — unlike AppBar's icon buttons,
 *   where `icon/300` genuinely is in that node's own bound-variables
 *   list, it never appears in this node's).
 * - The two pause-icon bars' exact size and position (3.5×15px, offset
 *   6.75px/13.75px/4.5px).
 * - Every waveform bar's 3px width, the 2.5px gap between bars, and
 *   their 18px corner radius.
 * - All 37 individual bar heights and their handful of specific
 *   opacity values (creating the fade at both ends of the waveform) —
 *   reproduced as a static illustration straight from Figma's own
 *   frame, not live audio data. This sprint has no real audio to
 *   visualize (see CLAUDE.md: "The recall is mocked. No speech-to-text,
 *   no audio, no model calls."), and Default and Playing render the
 *   exact same 37 bars in Figma — nothing about the waveform itself
 *   changes with playback state, only the icon does.
 *
 * **Playing has zero real-screen instance anywhere**, per Figma's own
 * description. Built and screenshotted here anyway, per CLAUDE.md's
 * "never ship an untested state pairing without screenshotting it
 * first," not skipped because the real file has nothing to check it
 * against.
 *
 * Purely presentational, same discipline as MicButton: `state` is
 * fully controlled by the caller, no `<audio>` element or playback
 * logic is invented, and standard button props pass through via
 * `...rest`. `aria-label` is set automatically from the current state
 * ("Play recording" / "Pause recording").
 */

export type AudioScrubberState = 'Default' | 'Playing'

export interface AudioScrubberProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Which of the two states this instance is in — see the component doc comment. */
  state?: AudioScrubberState
}

// The 37 waveform bars, straight off Figma's own static frame — see
// doc comment above for why this isn't live audio data. Identical in
// both states, matching Figma exactly.
const WAVEFORM_BARS: Array<{ height: number; opacity?: number }> = [
  { height: 6, opacity: 0.4 },
  { height: 6, opacity: 0.7 },
  { height: 6, opacity: 0.8 },
  { height: 6 },
  { height: 6 },
  { height: 6 },
  { height: 6 },
  { height: 6 },
  { height: 5 },
  { height: 6 },
  { height: 7 },
  { height: 6 },
  { height: 5 },
  { height: 5 },
  { height: 6 },
  { height: 7 },
  { height: 6 },
  { height: 6 },
  { height: 8 },
  { height: 6 },
  { height: 6 },
  { height: 7 },
  { height: 6 },
  { height: 5 },
  { height: 5 },
  { height: 6 },
  { height: 7 },
  { height: 6 },
  { height: 5 },
  { height: 6 },
  { height: 6 },
  { height: 6 },
  { height: 6 },
  { height: 6, opacity: 0.8 },
  { height: 6, opacity: 0.7 },
  { height: 6, opacity: 0.4 },
  { height: 6, opacity: 0.2 },
]

// Traced from the Default export ("Play Icon"), fill color swapped for
// currentColor — see doc comment above.
function PlayIcon() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6.90588 4.53474C6.50592 4.29772 6 4.586 6 5.05091V18.9449C6 19.4098 6.50592 19.6981 6.90588 19.4611L18.629 12.5141C19.0211 12.2817 19.0211 11.7141 18.629 11.4817L6.90588 4.53474Z"
        fill="currentColor"
      />
    </svg>
  )
}

// Traced from the Playing export ("Pause Icon Bar" x2) — literal
// size/position, see doc comment above.
function PauseIcon() {
  return (
    <span className="relative block" style={{ width: 24, height: 24 }}>
      <span
        className="absolute"
        style={{ left: 6.75, top: 4.5, width: 3.5, height: 15, borderRadius: 1, background: 'currentColor' }}
      />
      <span
        className="absolute"
        style={{ left: 13.75, top: 4.5, width: 3.5, height: 15, borderRadius: 1, background: 'currentColor' }}
      />
    </span>
  )
}

export function AudioScrubber({ state = 'Default', className, ...rest }: AudioScrubberProps) {
  const isPlaying = state === 'Playing'

  return (
    <button
      type="button"
      aria-label={isPlaying ? 'Pause recording' : 'Play recording'}
      className={`inline-flex shrink-0 items-center ${className ?? ''}`}
      style={{
        // No gap here — Figma's own container has no gap class at all;
        // the visible space between icon and waveform comes entirely
        // from the play/pause icon's own inset within its 24×24 box.
        borderRadius: 40, // Not bound to a token in Figma — see doc comment above.
        paddingInline: 16, // Not bound to a token in Figma — see doc comment above.
        paddingBlock: 4, // Not bound to a token in Figma — see doc comment above.
        background: 'var(--semantic-color-background-input)',
        color: 'var(--semantic-color-interactive-primary)',
      }}
      {...rest}
    >
      <span className="inline-flex shrink-0 items-center justify-center" style={{ width: 24, height: 24 }}>
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </span>

      <span className="inline-flex shrink-0 items-center" style={{ gap: 2.5 }}>
        {WAVEFORM_BARS.map((bar, i) => (
          <span
            key={i}
            className="shrink-0"
            style={{
              width: 3, // Not bound to a token in Figma — see doc comment above.
              height: bar.height,
              borderRadius: 18, // Not bound to a token in Figma — see doc comment above.
              background: 'currentColor',
              opacity: bar.opacity,
            }}
          />
        ))}
      </span>
    </button>
  )
}
