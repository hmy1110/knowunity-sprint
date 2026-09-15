import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { LoadingSpinner } from '../shared/LoadingSpinner'
import { IconSlot, ICON_SLOT_SIZE_VAR } from '../IconSlot/IconSlot'
import {
  fillToBackground,
  getFill,
  ICON_SLOT_SIZE,
  type ButtonSize,
  type ButtonState,
  type ButtonVariant,
} from '../shared/buttonVariants'

/**
 * Knowunity `buttonIcon` — Figma component set, node 9003:8235 in the
 * "Yummy__Knowie Design System" file (🎨 Mascot & components page).
 *
 * Figma's own component description (verbatim):
 *
 * > What it is: Icon-only button sharing button's 36-variant axes
 * > (Primary/Secondary/Tertiary x S/M/L x state), built from a single
 * > center icon slot. When to use it: Real usage is thin. Only
 * > Secondary/L and Secondary/M appear anywhere, but the shape fits the
 * > recall loop's mic button, the close (X), and the discard action in
 * > review-before-send. The large circular mic button in the beta's
 * > explain-out-loud screens is bigger than any documented buttonIcon
 * > size, so building it from this component likely means adding a new
 * > size rather than picking an existing one. One thing to do: Primary,
 * > Tertiary, every S size, and every non-Default state have zero real
 * > examples. Before the mic button ships, explicitly design and test a
 * > Primary/Pressed or Primary/Loading state, since that's the exact
 * > state a tapped, recording mic will be in.
 *
 * Shares its variant/size/state color logic exactly with Button (see
 * ../shared/buttonVariants.ts) — confirmed via Figma's real bound
 * variables, not by matching rendered colors. Two things buttonIcon does
 * differently from Button, also confirmed from bound variables:
 *
 * - **Primary gets a 1px border/default ring** in Default/Pressed/Loading
 *   (not Disabled). Secondary and Tertiary never get this border — Button
 *   never has a border in any state.
 * - There is no left/right icon split — just one centered `icon` slot,
 *   which the Loading spinner replaces entirely (there's no separate
 *   "icon stays visible next to the spinner" case here, since there's
 *   only ever the one icon slot to begin with).
 *
 * Gaps found while building this (flagged, not silently invented):
 *
 * - The S/M/L circle diameters (32/40/56px) and the bottom-edge bevel
 *   shadow (rgba(0,0,0,0.15), matching no color in tokens.json) are
 *   hardcoded literal values in Figma with no bound variable — the same
 *   two gaps Button has, reproduced the same way (see Button.tsx).
 * - Figma's own frame for this component is larger than the visible
 *   circle at S and M (48×48px, vs the 32px/40px circle drawn inside
 *   it) — the same outer-touch-target-vs-visible-shape split Button has
 *   at those sizes. Left unbuilt here too, consistent with Button's
 *   current state, pending the same decision there.
 * - Figma's own file has a structural oddity at Secondary/L/Default
 *   specifically: a second, oddly-padded icon container duplicating the
 *   same icon a second time, overlapping the normal one. This reads as
 *   leftover/dead layer structure rather than an intentional visual
 *   difference (every other Secondary/L state renders one icon, plain),
 *   so it isn't reproduced here — flagging it rather than guessing.
 * - No icon system exists in this codebase — `icon` takes real icon
 *   content from the caller. Figma's own icon here is literally a
 *   generic placeholder ("square", component 3248:79326, described in
 *   Figma only as "square, shape"), not a real designed icon, so there
 *   was nothing meaningful to copy in anyway.
 * - Icon-only controls have no visible label, so `label` (used as
 *   `aria-label`) is required — Figma has no equivalent property since
 *   it doesn't model accessibility; without it the control would have no
 *   accessible name at all.
 */

export interface ButtonIconProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> {
  /** Which of the three visual treatments this instance uses. */
  variant?: ButtonVariant
  /** Which of the three sizes this instance uses. */
  size?: ButtonSize
  /** Which of the four states this instance is in — see the component doc comment. */
  state?: ButtonState
  /** Real icon content (no icon system exists in this project yet — see the component doc comment). Hidden while `state` is "Loading". */
  icon: ReactNode
  /** Accessible name. Required — this control never has visible text. */
  label: string
}

// size=S,M,L -> the visible circle's diameter. Not bound to a token in
// Figma — literal exception, see doc comment above.
const CIRCLE_DIAMETER_PX: Record<ButtonSize, number> = {
  S: 32,
  M: 40,
  L: 56,
}

export function ButtonIcon({
  variant = 'Primary',
  size = 'S',
  state = 'Default',
  icon,
  label,
  className,
  ...rest
}: ButtonIconProps) {
  const fill = getFill(variant, state)
  const isLoading = state === 'Loading'
  const isDisabled = state === 'Disabled' || isLoading
  const hasFill = variant !== 'Tertiary'
  // Confirmed from Figma's bound `strokes`: only Primary, and only
  // outside Disabled, carries this ring.
  const hasBorder = variant === 'Primary' && state !== 'Disabled'
  // Tertiary binds radius/Full at M and L but not S (matches Button's
  // own Tertiary radius binding) — invisible either way since Tertiary
  // has no fill, kept for structural fidelity.
  const hasRadius = hasFill || size !== 'S'

  return (
    <button
      type="button"
      disabled={isDisabled}
      aria-busy={isLoading}
      aria-label={label}
      className={`inline-flex shrink-0 items-center justify-center ${className ?? ''}`}
      style={{
        width: CIRCLE_DIAMETER_PX[size], // Not bound to a token in Figma — see doc comment above.
        height: CIRCLE_DIAMETER_PX[size], // Not bound to a token in Figma — see doc comment above.
        borderRadius: hasRadius ? 'var(--size-radius-full)' : undefined,
        border: hasBorder ? '1px solid var(--semantic-color-border-default)' : undefined,
        background: fillToBackground(fill),
        // Bottom-edge bevel on Primary/Secondary. rgba(0,0,0,0.15) matches
        // no color in tokens.json — literal exception, see doc comment
        // above.
        boxShadow: hasFill
          ? `inset 0 ${size === 'L' ? '-4px' : '-2px'} 0 0 rgba(0,0,0,0.15)`
          : undefined,
      }}
      {...rest}
    >
      {isLoading ? (
        <LoadingSpinner size={size} sizeVar={ICON_SLOT_SIZE_VAR[ICON_SLOT_SIZE[size]]} colorVar={fill.textVar} />
      ) : (
        <IconSlot size={ICON_SLOT_SIZE[size]} icon={icon} style={{ color: `var(${fill.textVar})` }} />
      )}
    </button>
  )
}
