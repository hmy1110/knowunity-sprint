import type { CSSProperties, ReactNode } from 'react'
import { IconSlot } from '../IconSlot/IconSlot'

/**
 * Knowunity `inlineAlert` — Figma component set, node 13628:13495 in the
 * "Yummy__Knowie Design System" file (🎨 Mascot & components page, one
 * of the six components built for the voice active-recall sprint).
 *
 * Figma's own component description (verbatim):
 *
 * > What it is: 4-variant inline notice (Success/Warning/Error/Info),
 * > icon + title + optional descriptor (showDescriptor) in a single
 * > row, using real iconSlot instances rather than hand-drawn vectors.
 * > When to use it: This is the "embedded in content" counterpart to
 * > snackbar's "floating at the bottom of the screen" notice, split out
 * > because they occupy different UI positions and shouldn't share one
 * > component. It was extracted from a repeated "Text section" pattern
 * > found inside speechBubble. Success and Warning have real precedent
 * > there; Error and Info do not yet. One thing to do: Info falls back
 * > to text/secondary because the system has no dedicated info-semantic
 * > color token; confirm with whoever owns the tokens whether that's
 * > acceptable or whether a real info token should be added. Icons are
 * > check-circle (Success), alert-circle (Warning, key 13609:3292),
 * > x-circle (Error), and info-circle (Info), located by searching
 * > instance names rather than a documented icon list, since none of
 * > these keys were listed as candidates anywhere searchable.
 *
 * **Reuses IconSlot** for the icon (../IconSlot/IconSlot.tsx) —
 * confirmed structurally, the icon sits in a nested instance literally
 * named "iconSlot" at exactly `icon/300`, the same confirmed-bound
 * pattern SpeechBubble's Header and AppBar's icon buttons both use.
 * Figma's own outer "Icon Container" wrapper (an extra 24×24 div around
 * the iconSlot instance, unbound, redundant with the slot's own size)
 * is dropped the same way SpeechBubble's was — same size, one fewer
 * nested div, no visual difference.
 *
 * **This is the exact component speechBubble's own description names
 * as a duplicate of its Header** ("The Header's icon+title+subtitle
 * structure duplicates what's built separately as inlineAlert"). Built
 * here as its own standalone, single-row component, matching this
 * node's real structure — a flat icon+title+descriptor row, distinct
 * from speechBubble's stacked icon+title-then-subtitle-below layout.
 * Whether speechBubble should now be rebuilt to embed this component
 * instead of its own copy is still the open decision Figma's text
 * frames it as (see SpeechBubble.tsx's own doc comment) — not resolved
 * here, since building inlineAlert doesn't by itself answer that.
 *
 * Icon colors confirmed via `get_variable_defs` on the real node
 * (matching each icon's own hardcoded SVG fill against its title's
 * bound token, not assumed): Success `#00C386` = `feedback/success/
 * bold`; Warning `#FCD34D` = `text/warning`; Error `#FF6B6B` =
 * `feedback/error/bold`; Info `#F5F3FF @ 68%` = `text/secondary` —
 * confirming Figma's own description's "Info falls back to
 * text/secondary" gap is exactly what's bound here, both for Info's
 * icon and its title, matching design-system.md §3's "icon and title
 * share one semantic token" rule even for this fallback case. Icons
 * are traced inline (fill swapped for `currentColor`) rather than
 * fetched from Figma's expiring asset URLs — Success/Warning/Error
 * reuse the identical paths already traced for SpeechBubble (same
 * icon components, confirmed by matching node names and colors), Info
 * is new here.
 *
 * Gaps found while building this (flagged, not silently invented,
 * confirmed via `get_variable_defs` on the real node):
 *
 * - The row's 4px gap (applied uniformly between icon/title and
 *   title/descriptor — one row-level gap, not two separate ones) is an
 *   unbound literal, matching SpeechBubble's own Title Row gap.
 * - **The title text has no bound type style at all — not even an
 *   unnamed one**, the identical gap SpeechBubble's own title has (same
 *   `Greed Bold 20px, leading: normal`, no `var(...)` anywhere in its
 *   font declaration, and CLAUDE.md forbids reading the `font/*`
 *   primitive layer directly even though one would numerically match).
 *   Reproduced as Figma's own literal values, same treatment as
 *   SpeechBubble's title.
 * - The descriptor's raw, unbound "Inter" Regular 12px is the same gap
 *   StatusIndicator's and SpeechBubble's own secondary text already
 *   have — reproduced as Figma's own literal values, not a type-scale
 *   token.
 */

export type InlineAlertVariant = 'Success' | 'Warning' | 'Error' | 'Info'

export interface InlineAlertProps {
  /** Which of the four variants this instance is — see the component doc comment. */
  variant?: InlineAlertVariant
  /** Shows the descriptor text after the title. */
  showDescriptor?: boolean
  /** Title text. Defaults to Figma's own placeholder text for the variant. */
  title?: string
  /** Descriptor text, shown when showDescriptor is true. Defaults to Figma's own placeholder text for the variant. */
  descriptor?: string
  className?: string
  style?: CSSProperties
}

const DEFAULT_CONTENT: Record<InlineAlertVariant, { title: string; descriptor: string }> = {
  Success: { title: 'Nice!', descriptor: 'Unaided · 1st attempt' },
  Warning: { title: 'Not quite yet.', descriptor: 'Hint 1 of 2' },
  Error: { title: "Here's the answer.", descriptor: 'Revealed · after 2 hints' },
  Info: { title: 'Heads up.', descriptor: 'For your reference' },
}

// variant -> color token. Confirmed bound via get_variable_defs, not
// matched by value — Info's fallback to text/secondary is real, not a
// guess, see doc comment above.
const COLOR_VAR: Record<InlineAlertVariant, string> = {
  Success: '--semantic-color-feedback-success-bold',
  Warning: '--semantic-color-text-warning',
  Error: '--semantic-color-feedback-error-bold',
  Info: '--semantic-color-text-secondary',
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
function InfoCircleIcon() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12ZM11 16V12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12V16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16ZM12.0098 7C12.5621 7 13.0098 7.44772 13.0098 8C13.0098 8.55228 12.5621 9 12.0098 9H12C11.4477 9 11 8.55228 11 8C11 7.44772 11.4477 7 12 7H12.0098ZM23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12Z"
        fill="currentColor"
      />
    </svg>
  )
}

const VARIANT_ICON: Record<InlineAlertVariant, ReactNode> = {
  Success: <CheckCircleIcon />,
  Warning: <AlertCircleIcon />,
  Error: <XCircleIcon />,
  Info: <InfoCircleIcon />,
}

export function InlineAlert({
  variant = 'Success',
  showDescriptor = true,
  title: titleProp,
  descriptor: descriptorProp,
  className,
  style,
}: InlineAlertProps) {
  const defaults = DEFAULT_CONTENT[variant]
  const title = titleProp ?? defaults.title
  const descriptor = descriptorProp ?? defaults.descriptor
  const colorVar = COLOR_VAR[variant]

  return (
    <div
      className={`inline-flex shrink-0 items-center ${className ?? ''}`}
      style={{ gap: 4, ...style }} // Not bound to a token in Figma — see doc comment above.
    >
      <IconSlot size="300" icon={VARIANT_ICON[variant]} style={{ color: `var(${colorVar})` }} />
      <p
        className="whitespace-nowrap"
        style={{
          margin: 0,
          color: `var(${colorVar})`,
          // No bound type style exists for this text run, and
          // CLAUDE.md forbids reading the font/* primitive layer
          // directly — reproduced as Figma's own literal values, see
          // doc comment above.
          fontFamily: "'Greed VF-TRIAL', sans-serif",
          fontWeight: 700,
          fontSize: 20,
          lineHeight: 'normal',
        }}
      >
        {title}
      </p>
      {showDescriptor && (
        <p
          className="whitespace-nowrap"
          style={{
            margin: 0,
            color: 'var(--semantic-color-text-secondary)',
            fontFamily: 'Inter, sans-serif', // Raw, unbound "Inter" — see doc comment above.
            fontWeight: 400,
            fontSize: 12,
            lineHeight: 'normal',
          }}
        >
          {descriptor}
        </p>
      )}
    </div>
  )
}
