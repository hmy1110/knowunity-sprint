import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { IconSlot, type IconSlotSize } from '../IconSlot/IconSlot'

/**
 * Knowunity `chips` — Figma component set, node 9003:8679 in the
 * "Yummy__Knowie Design System" file (🎨 Mascot & components page).
 *
 * Figma's own component description (verbatim):
 *
 * > What it is: 16-variant pill (size XXS-M, color Primary/pro, active
 * > True/False) with an icon slot on each side of the text label, both
 * > present in the structure regardless of the icon toggles' defaults.
 * > When to use it: Real screens use chips constantly, as topic/category
 * > tags (the "PRACTICE ROUND" pill), as tool pickers (the Tools
 * > sheet's "Coach Me/Solve It/Lock In" and "Quiz me/Create flashcards"
 * > rows), and as status tags ("PRO," "Built by students" in AI chat).
 * > One thing to do: The color property only offers Primary/pro. The
 * > summary screen's per-term status labels use a separate tag
 * > component instead (Recalled/Hinted/Revealed/Skipped, see that
 * > component's own description), because chips' fixed dual-icon-slot,
 * > size-XXS-to-M shape doesn't fit a single-purpose status label. The
 * > Info/Success/Error gap stays open for any future screen that needs
 * > a genuinely semantic-colored chip rather than a status tag.
 *
 * Rendered as a real `<button>` (not a `<div>`) since every real usage
 * Figma's own description names — topic tags aside, "tool pickers" and
 * "status tags" the user taps to select — is something a person clicks
 * or taps, not static text.
 *
 * A detail confirmed straight from Figma's reference code, easy to miss:
 * when `active` is false, `color` has no visual effect at all — an
 * inactive Primary chip and an inactive pro chip render identically
 * (background/surface fill, text/primary label). Only active chips
 * differ by color. This is reproduced exactly as bound, not "fixed" to
 * show a difference that isn't there in the design.
 *
 * Gaps found while building this (flagged, not silently invented,
 * consistent with how Button and ButtonIcon handle the same kind of
 * gap): the XXS/XS/S/M heights (20/24/32/40px) are hardcoded literal
 * pixel values in Figma with no bound variable — reproduced here as
 * literal exceptions. `min-width` is set to that same literal per size,
 * keeping an icon-only or very short chip from collapsing thinner than
 * it is tall.
 *
 * The two icon slots render through IconSlot (../IconSlot/IconSlot.tsx,
 * the actual Figma primitive this component nests) — at M, Figma insets
 * a smaller fixed icon inside the outer slot rather than letting it
 * fill the box, reproduced here as one IconSlot nested inside another.
 * No icon system beyond that exists in this codebase, so
 * `leftIcon`/`rightIcon` still take real icon content from the caller —
 * Figma's own icon here is a generic placeholder ("square", component
 * 3248:79326, described in Figma only as "square, shape"), not a real
 * designed icon.
 */

export type ChipsSize = 'XXS' | 'XS' | 'S' | 'M'
export type ChipsColor = 'Primary' | 'pro'

export interface ChipsProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  /** Which of the four sizes this instance uses. */
  size?: ChipsSize
  /** Which color this chip uses when `active` — has no effect while inactive (see doc comment above). */
  color?: ChipsColor
  /** Whether this chip is the selected/toggled-on state. */
  active?: boolean
  /** The chip's label. Defaults to Figma's own default-instance placeholder text. */
  text?: string
  /** Shows the left icon slot. */
  showLeftIcon?: boolean
  /** Shows the right icon slot. */
  showRightIcon?: boolean
  /** Real icon content for the left icon slot (no icon system exists in this project yet — see the component doc comment). */
  leftIcon?: ReactNode
  /** Real icon content for the right icon slot (no icon system exists in this project yet — see the component doc comment). */
  rightIcon?: ReactNode
}

// size=XXS,XS,S,M -> horizontal padding, icon-to-text gap, icon box
// size, and text style, all bound to real tokens. Height (and the
// matching min-width) is NOT bound to any token in Figma — literal
// exception, see doc comment above. XS and S share the exact same type
// style (Caption M Bold) in Figma — confirmed from the design context's
// own "styles contained in this design" list, not assumed from the two
// sizes merely looking similar.
const SIZE_CONFIG: Record<
  ChipsSize,
  {
    paddingXVar: string
    gapVar: string
    iconSlotSize: IconSlotSize
    /**
     * Only set at M: Figma nests a smaller, fixed-size icon inside the
     * outer icon slot there (a ~2px inset on every side) instead of
     * having the icon fill the slot, the way XXS/XS/S do. Undefined
     * means no inset — the icon fills `iconSlotSize` exactly, matching
     * Figma at those three sizes.
     */
    innerIconSlotSize?: IconSlotSize
    /** Not bound to a token in Figma — literal exception, see doc comment above. */
    heightPx: number
    typeScale: 'caption-s-bold' | 'caption-m-bold' | 'body-s-bold'
  }
> = {
  XXS: {
    paddingXVar: '--size-space-150',
    gapVar: '--size-space-050',
    iconSlotSize: '150',
    heightPx: 20,
    typeScale: 'caption-s-bold',
  },
  XS: {
    paddingXVar: '--size-space-200',
    gapVar: '--size-space-100',
    iconSlotSize: '150',
    heightPx: 24,
    typeScale: 'caption-m-bold',
  },
  S: {
    paddingXVar: '--size-space-300',
    gapVar: '--size-space-100',
    iconSlotSize: '200',
    heightPx: 32,
    typeScale: 'caption-m-bold',
  },
  M: {
    paddingXVar: '--size-space-400',
    gapVar: '--size-space-150',
    iconSlotSize: '250',
    innerIconSlotSize: '200',
    heightPx: 40,
    typeScale: 'body-s-bold',
  },
}

const TYPE_SCALE_VARS = {
  'caption-s-bold': '--type-scale-caption-s-bold',
  'caption-m-bold': '--type-scale-caption-m-bold',
  'body-s-bold': '--type-scale-body-s-bold',
} as const

type Fill = { backgroundVar: string; textVar: string }

// color=Primary,pro x active=true,false -> fill and text color. `color`
// only matters while active — inactive chips of either color render
// identically (background/surface, text/primary), confirmed from
// Figma's own reference code, not assumed.
function getFill(color: ChipsColor, active: boolean): Fill {
  if (!active) {
    return { backgroundVar: '--semantic-color-background-surface', textVar: '--semantic-color-text-primary' }
  }
  return color === 'pro'
    ? { backgroundVar: '--semantic-color-pro-bold', textVar: '--semantic-color-pro-on-bold' }
    : { backgroundVar: '--semantic-color-interactive-primary', textVar: '--semantic-color-interactive-on-primary' }
}

// Fills the outer slot exactly at XXS/XS/S, matching Figma. At M,
// nests a smaller IconSlot inside the outer one, reproducing the inset
// Figma draws there instead of letting the icon fill the box.
function ChipIcon({
  outerSize,
  innerSize,
  icon,
}: {
  outerSize: IconSlotSize
  innerSize?: IconSlotSize
  icon: ReactNode
}) {
  return <IconSlot size={outerSize} icon={innerSize ? <IconSlot size={innerSize} icon={icon} /> : icon} />
}

export function Chips({
  size = 'XXS',
  color = 'Primary',
  active = false,
  text = '1/2 words', // Matches Figma's own default-instance placeholder text.
  showLeftIcon = true,
  showRightIcon = true,
  leftIcon,
  rightIcon,
  className,
  ...rest
}: ChipsProps) {
  const sizeConfig = SIZE_CONFIG[size]
  const fill = getFill(color, active)
  const typeScaleVar = TYPE_SCALE_VARS[sizeConfig.typeScale]

  return (
    <button
      type="button"
      className={`inline-flex shrink-0 items-center justify-center overflow-clip rounded-full ${className ?? ''}`}
      style={{
        height: sizeConfig.heightPx, // Not bound to a token in Figma — see doc comment above.
        minWidth: sizeConfig.heightPx, // Same literal exception — see doc comment above.
        paddingInline: `var(${sizeConfig.paddingXVar})`,
        gap: `var(${sizeConfig.gapVar})`,
        borderRadius: 'var(--size-radius-full)',
        background: `var(${fill.backgroundVar})`,
        color: `var(${fill.textVar})`,
      }}
      {...rest}
    >
      {showLeftIcon && leftIcon && (
        <ChipIcon outerSize={sizeConfig.iconSlotSize} innerSize={sizeConfig.innerIconSlotSize} icon={leftIcon} />
      )}

      <span
        style={{
          flex: '1 0 0', // Grows, but never shrinks below its own content — matches Figma exactly.
          textAlign: 'center',
          fontFamily: `var(${typeScaleVar}-font-family)`,
          fontWeight: `var(${typeScaleVar}-font-weight)`,
          fontSize: `var(${typeScaleVar}-font-size)`,
          lineHeight: `var(${typeScaleVar}-line-height)`,
          letterSpacing: `var(${typeScaleVar}-letter-spacing)`,
        }}
      >
        {text}
      </span>

      {showRightIcon && rightIcon && (
        <ChipIcon outerSize={sizeConfig.iconSlotSize} innerSize={sizeConfig.innerIconSlotSize} icon={rightIcon} />
      )}
    </button>
  )
}
