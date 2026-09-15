import type { CSSProperties, ReactNode } from 'react'

/**
 * Knowunity `iconSlot` — Figma component set, node 9003:8809 in the
 * "Yummy__Knowie Design System" file (🎨 Mascot & components page).
 *
 * Figma's own component description (verbatim):
 *
 * > What it is: The most-used primitive in the file (165 instances
 * > elsewhere), a wrapper around a swappable icon with 6 size steps. It
 * > ships with a generic "square" placeholder that real usage always
 * > swaps for an actual icon. When to use it: It nests inside almost
 * > everything else on this list (button, buttonIcon, chips, snackbar,
 * > appBar), so you'll touch it constantly just by using those. In the
 * > loop it's the info-circle/check-circle/alert-circle icon for result
 * > cards and hint/reveal affordances. One thing to do: The size
 * > property is literally named "Size (IGNORE)," which reads as a
 * > marked-for-cleanup flag, and size 100 has zero real usage anywhere.
 * > Ask whoever owns the design system whether this means sizes are
 * > being consolidated before you build new instances at a size that
 * > might get deleted.
 *
 * **Two prop names renamed from Figma, flagged rather than reproduced
 * literally, per "stop and tell me" — both are Figma's own naming, not
 * a normal design decision to defer to silently:**
 *
 * - Figma's size property is literally named `Size (IGNORE)` — not a
 *   valid JS identifier, and Figma's own description above calls it "a
 *   marked-for-cleanup flag." Named `size` here instead of forcing that
 *   string into an identifier. Ask whoever owns the design system
 *   (per Figma's own note above) before relying on this size scale
 *   staying as-is, particularly `size="100"` (zero real usage anywhere).
 * - Figma's icon-swap property is named `instance` — the generic name
 *   Figma's own codegen gives every component-instance-swap property,
 *   not vocabulary specific to this component. Named `icon` here to
 *   match the convention already used for this in Button, ButtonIcon,
 *   and Chips.
 *
 * This is the primitive those three components already reimplement
 * inline (each keeps its own size→`--size-icon-*` lookup and its own
 * icon-box `<span>`) because it didn't exist yet when they were built.
 * They've been refactored to render through this component instead —
 * see their own files — so the size scale lives in exactly one place.
 *
 * No icon system exists in this codebase, so `icon` takes real icon
 * content from the caller and defaults to rendering nothing — Figma's
 * own icon here is a generic placeholder ("square", component
 * 3248:79326, described in Figma only as "square, shape"), and its own
 * description says real usage always swaps it for an actual icon, so
 * there's nothing meaningful to fabricate as a default anyway.
 */

export type IconSlotSize = '100' | '150' | '200' | '250' | '300' | '400'

export interface IconSlotProps {
  /**
   * Which of the six sizes this instance uses. Figma's own property name
   * is `Size (IGNORE)` — see the component doc comment above.
   */
  size?: IconSlotSize
  /** Real icon content. Renders nothing if omitted — see the component doc comment above. */
  icon?: ReactNode
  className?: string
  /**
   * Extra styles merged onto the slot — not a Figma property, just an
   * escape hatch for callers that need to tint the icon's color (e.g.
   * `{ color: 'var(--semantic-color-text-primary)' }` for a caller icon
   * using `currentColor`) without reaching past this component.
   */
  style?: CSSProperties
}

// size=100..400 -> the token this slot sizes itself to. A direct,
// 1-to-1 pass-through to size/icon/* — this component has no other
// properties. Exported so callers that need the raw var (rather than a
// rendered slot — e.g. LoadingSpinner, which replaces the icon slot
// entirely rather than nesting inside one) can look it up too.
export const ICON_SLOT_SIZE_VAR: Record<IconSlotSize, string> = {
  '100': '--size-icon-100',
  '150': '--size-icon-150',
  '200': '--size-icon-200',
  '250': '--size-icon-250',
  '300': '--size-icon-300',
  '400': '--size-icon-400',
}

export function IconSlot({ size = '400', icon, className, style }: IconSlotProps) {
  const sizeVar = ICON_SLOT_SIZE_VAR[size]
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center ${className ?? ''}`}
      style={{ width: `var(${sizeVar})`, height: `var(${sizeVar})`, ...style }}
    >
      {icon}
    </span>
  )
}
