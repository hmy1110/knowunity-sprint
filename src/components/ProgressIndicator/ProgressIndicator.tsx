/**
 * Knowunity `progressIndicator` — Figma component set, node 9003:8923 in
 * the "Yummy__Knowie Design System" file (🎨 Mascot & components page).
 *
 * Figma's own component description (verbatim):
 *
 * > What it is: 20-variant bar (Primary/Coral, thickness 16/24, progress
 * > in 25% steps, optional "Unit Progress" text like "9/12" for a
 * > literal count instead of just a percentage fill). When to use it:
 * > Built into every appBar's stretchable slot across the loop, 16 real
 * > instances, Primary color throughout, showText false everywhere: the
 * > "Topics 2 of 4" term count is a separate text element next to the
 * > bar, not this component's own unit-count mode. One thing to do:
 * > Progress values 25/50/75 are all real, one step per term through a
 * > 4-term session, so only 0 and 100 are untested. Coral is never used
 * > anywhere; confirm whether it's reserved for a specific moment or
 * > should be removed as an unused variant.
 *
 * Gaps found while building this (flagged, not silently invented):
 *
 * - Figma's own frame is a literal, hardcoded 350px wide, bound to no
 *   token. Design-system.md's own words for this component are "sits
 *   inside every appBar's **stretchable** slot" — so this is built as
 *   `width: 100%` rather than reproducing a number that reads as a
 *   documentation-frame artifact, the same call made for buttonGroup's
 *   own hardcoded 319px.
 * - The track's corner radius is a literal `12px` in Figma, bound to no
 *   token. At both thicknesses (16px and 24px) a 12px radius exceeds
 *   half the bar's own height, so the browser clamps it down to a
 *   perfect stadium/pill shape regardless — exactly what
 *   `size/radius/Full` already does. Bound to that token instead of the
 *   literal, since the two are provably identical here, not an
 *   approximation.
 * - At thickness 24, Figma insets the active track by 2px on every
 *   side, leaving a sliver of the track color showing as a border (a
 *   detail thickness 16 does not have — it has no inset at all). That
 *   2px exactly matches `size/space/050`, so it's bound to that token
 *   rather than left as a literal.
 *
 * Two simplifications from Figma's own reference structure, chosen
 * because they render identically while being far simpler to build and
 * maintain — not gaps, just a cleaner translation, per this project's
 * "adapt to the target stack, don't paste the reference verbatim" rule:
 *
 * - Figma expresses the fill's width as a `right` offset with oddly
 *   specific percentages at thickness 24 (24.75%/75.25% for
 *   progress=75/25) — an artifact of Figma's own constraint math against
 *   the 2px-inset container. This is built as a plain `width: X%` fill
 *   instead, which produces the same proportions without copying
 *   percentages whose exact derivation isn't obvious from the file.
 * - At progress=0, Figma still shows a small round dot of color (a
 *   perfect circle, diameter equal to the active track's own height)
 *   rather than a literal zero-width, fully invisible fill. Reproduced
 *   deliberately as a fixed-width nub at that one progress value, not a
 *   default CSS behavior.
 *
 * `showText`'s unit-count label only ever appears at thickness 24 in
 * Figma's own file — there's no version of it built for thickness 16 —
 * so that pairing is reproduced here too (`showText` has no visible
 * effect at `thickness="16"`). Figma's own instance hardcodes the label
 * text itself ("9/12" etc., scaled off an example 12-unit total) — real
 * usage needs its own real count, so `unitText` takes that string from
 * the caller instead of reproducing Figma's example numbers. Per
 * design-system.md, the built recall loop never actually uses this mode
 * (`showText` is false everywhere; the real "Topics 2 of 4" count is a
 * separate text element next to the bar), so this whole prop is
 * currently unused in this project's own screens.
 *
 * `label` (used as `aria-label`) is an addition beyond Figma's own
 * model, the same way ButtonIcon needed one — Figma doesn't model
 * accessibility, and Storybook's own a11y check confirmed a bare
 * `role="progressbar"` has no accessible name without it. Defaults to
 * "Progress" since, unlike Button/ButtonIcon's `cta`/`label`, this is a
 * status widget rather than the caller's one interactive element — a
 * screen with real context (e.g. "Topic progress") should still pass
 * its own, more specific label.
 */

export type ProgressIndicatorVariant = 'Primary' | 'Coral'
export type ProgressIndicatorThickness = '24' | '16'
export type ProgressIndicatorProgress = '0' | '25' | '50' | '75' | '100'

export interface ProgressIndicatorProps {
  /** Which of the two fill colors this instance uses. Figma's own description notes Coral is never used anywhere in the real file — confirm with Mia whether it's reserved or should be dropped. */
  variant?: ProgressIndicatorVariant
  /** Which of the two bar heights this instance uses. */
  thickness?: ProgressIndicatorThickness
  /** How far along the bar is, in 25% steps — Figma's own variant values, not a free 0-100 number. */
  progress?: ProgressIndicatorProgress
  /** Shows the unit-count label ("2/4") centered on the bar. Only has a visible effect at `thickness="24"` — see the component doc comment. */
  showText?: boolean
  /** The label shown when `showText` is true (e.g. "2/4"). Figma's own instance text is illustrative example numbers, not real content — see the component doc comment. */
  unitText?: string
  /** Accessible name. Not a Figma property — see the component doc comment. */
  label?: string
}

const VARIANT_FILL_VAR: Record<ProgressIndicatorVariant, string> = {
  Primary: '--semantic-color-accent-brand-bold',
  Coral: '--semantic-color-accent-coral-bold',
}

const PROGRESS_PERCENT: Record<ProgressIndicatorProgress, number> = {
  '0': 0,
  '25': 25,
  '50': 50,
  '75': 75,
  '100': 100,
}

export function ProgressIndicator({
  variant = 'Primary',
  thickness = '24',
  progress = '0',
  showText = false,
  unitText,
  label = 'Progress',
}: ProgressIndicatorProps) {
  const percent = PROGRESS_PERCENT[progress]
  // Only thickness 24 insets the active track — see doc comment above.
  const insetVar = thickness === '24' ? '--size-space-050' : undefined

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      className="relative w-full overflow-hidden"
      style={{
        height: thickness === '24' ? 24 : 16, // Not bound to a token in Figma — a plain bar-height number, see doc comment above about the 350px width gap; height has the same issue but no token exists at these exact steps either.
        borderRadius: 'var(--size-radius-full)', // Clamped from Figma's literal 12px — see doc comment above.
        background: 'var(--semantic-color-background-stacking)',
        padding: insetVar ? `var(${insetVar})` : undefined,
        boxSizing: 'border-box',
      }}
    >
      <div
        className="h-full"
        style={{
          // progress=0 shows a small round dot instead of nothing — see
          // doc comment above. Anything else is a plain percentage fill.
          width: percent === 0 ? (thickness === '24' ? 20 : 16) : `${percent}%`,
          borderRadius: 'var(--size-radius-full)',
          background: `var(${VARIANT_FILL_VAR[variant]})`,
        }}
      />

      {/* Centered over the whole bar, independent of the fill's own
          width — Figma positions this as a sibling of the fill, not
          nested inside it, so the label doesn't ride along with a
          partial fill. */}
      {showText && thickness === '24' && unitText && (
        <span
          className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
          style={{
            color: 'var(--semantic-color-interactive-on-secondary)',
            fontFamily: 'var(--type-scale-caption-s-bold-font-family)',
            fontWeight: 'var(--type-scale-caption-s-bold-font-weight)',
            fontSize: 'var(--type-scale-caption-s-bold-font-size)',
            lineHeight: 'var(--type-scale-caption-s-bold-line-height)',
            letterSpacing: 'var(--type-scale-caption-s-bold-letter-spacing)',
          }}
        >
          {unitText}
        </span>
      )}
    </div>
  )
}
