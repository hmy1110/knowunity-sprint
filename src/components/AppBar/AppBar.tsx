import type { ReactNode } from 'react'
import { IconSlot } from '../IconSlot/IconSlot'

/**
 * Knowunity `appBar` — Figma component set, node 13628:12762 in the
 * "Yummy__Knowie Design System" file (🎨 Mascot & components page).
 *
 * Figma's own component description (verbatim):
 *
 * > What it is: 6-variant top nav (back/menu icon button, a stretchable
 * > content slot, optional right button or buttons for title/search/
 * > actions). When to use it: The top row on every screen in the recall
 * > loop, 19 instances across the flow. leftIconButtonOnly (X close,
 * > progressIndicator in the stretchable slot) is the top row on every
 * > Primer/Learning/Summary screen; leftAndRightIconButton (back arrow
 * > plus kebab menu) is the study plan screen's row, used on
 * > StudyPlan-notStarted, StudyPlan-inProgress and StudyPlan-finish. The
 * > other 4 variants (default, leftAndRightButton,
 * > leftAndTwoRightIconButtons, leftAnd2RightButtons) have no real
 * > instance anywhere. One thing to do: The stretchable slot holds a
 * > progressIndicator cleanly on every screen that uses it. The 4 unused
 * > variants have no real-screen precedent, so treat them as untested if
 * > a screen ever needs more than one right-side action.
 *
 * **The description says "6-variant" but the live component actually
 * has 7** — confirmed straight from the node's own
 * `componentPropertyDefinitions` (`variantOptions: [default,
 * leftIconButtonOnly, leftAndRightIconButton, leftAndRightButton,
 * leftAndTwoRightIconButtons, leftAnd2RightButtons,
 * rightIconButtonOnly]`), not assumed from the prose. `rightIconButtonOnly`
 * isn't named anywhere in the description's own enumeration, but is a
 * real, fully-built variant in the file (right-side dots-vertical only,
 * no left icon). Reproduced here since the live structure — the more
 * authoritative Figma signal when it disagrees with the description's
 * own prose count — has it as a real 7th option.
 *
 * **Reuses IconSlot** (../IconSlot/IconSlot.tsx) for every icon-button
 * glyph — confirmed structurally: each icon sits in a nested instance
 * literally named "iconSlot", sized `24px`, which is exactly
 * `icon/300`, IconSlot's own `size="300"`. **Not built from ButtonIcon**,
 * even though "icon button" sounds like a match: appBar's own icon
 * buttons are a 40px circle with **no fill at all** (no `background`
 * class anywhere on that "Button" layer), sitting inside a 48px touch
 * target — a size+fill combination that doesn't match any real
 * ButtonIcon variant (Secondary/M is 40px but filled; Tertiary is
 * unfilled but never 40px). Building appBar's own icon-button shell
 * directly, rather than stretching ButtonIcon to a size/fill combo it
 * doesn't actually have, follows the same call Section 1 makes for
 * buttonIcon's own mic-button case ("likely means adding a new size,
 * not picking an existing one").
 *
 * **No icon system exists in this codebase** (see IconSlot/ButtonIcon/
 * Chips' own doc comments), and unlike those three, Figma's own icons
 * here aren't a generic placeholder — they're real, specifically-named
 * icons (arrow-left, dots-vertical, share-02), confirmed via their own
 * Figma icon descriptions. Even so, design-system.md's own real-usage
 * note says the left icon is swapped per screen (a back arrow on the
 * study plan row, an X close on every Primer/Learning/Summary row) —
 * proof this is meant to vary per instance, not stay fixed — and no
 * instance-swap property is exposed for any of these icons at the
 * appBar level to do that through. So every icon button here still
 * takes real content from the caller, the same as ButtonIcon/Chips/
 * IconSlot, rather than baking in Figma's own default glyphs. Icon
 * props are optional with no fallback content, same reasoning IconSlot
 * itself gives for defaulting to nothing rather than fabricating a
 * placeholder.
 *
 * **The stretchable middle slot is a real Figma `SLOT` property**
 * (confirmed from `componentPropertyDefinitions`: `slotSettings:
 * { stretchChildOnInsert: true, allowPreferredValuesOnly: false }`).
 * Its `preferredValues` list names 5 component sets, but every one
 * references a library this Figma session can't resolve
 * (`importComponentSetByKeyAsync` fails on all 5) — the same kind of
 * gap MascotSlot's Homie swap hit. `allowPreferredValuesOnly: false`
 * confirms this slot was never meant to be a closed set anyway, so it's
 * built as plain `children: ReactNode` rather than guessed at. The one
 * real-content type that IS confirmed, independently, by both this
 * component's own description and ProgressIndicator's own ("built into
 * every appBar's stretchable slot across the loop, 16 real instances")
 * is ProgressIndicator (../ProgressIndicator/ProgressIndicator.tsx,
 * already built) — real usage is `<AppBar><ProgressIndicator
 * showText={false} /></AppBar>`, not enforced by this component's types.
 *
 * Gaps found while building this (flagged, not silently invented,
 * confirmed via `get_variable_defs` on the real node — none of the
 * following appear in its bound-variables list):
 *
 * - The bar's own 56px height, the 48px icon touch target, the 40px
 *   icon circle, and the text-button's 52px/40px wrapper heights are
 *   all hardcoded literals with no bound variable, the same kind of gap
 *   Button/ButtonIcon/Chips/ProgressIndicator each already have.
 * - The bar's background is a real, bound Figma style ("Gradient/BG
 *   Top" — confirmed present in `get_variable_defs`, not skipped), but
 *   no corresponding token exists anywhere in tokens.json/tokens.css —
 *   there is no `gradient/*` layer at all yet. Its first stop genuinely
 *   is `background/page` (bound); its second stop is that same color at
 *   0% opacity, which isn't a value tokens.json can express as a
 *   semantic reference. Reproduced as a gradient from
 *   `var(--semantic-color-background-page)` to the CSS keyword
 *   `transparent` — not a raw hex, and not an invented token, just "no
 *   color" — rather than hardcoding Figma's literal `rgba(9,12,24,0)`.
 */

export type AppBarVariant =
  | 'default'
  | 'leftIconButtonOnly'
  | 'leftAndRightIconButton'
  | 'leftAndRightButton'
  | 'leftAndTwoRightIconButtons'
  | 'leftAnd2RightButtons'
  | 'rightIconButtonOnly'

export interface AppBarProps {
  /** Which of the seven variants this instance is — see the component doc comment for the description/live-structure count mismatch. */
  variant?: AppBarVariant
  /** Content for the stretchable middle slot. Real usage is always a ProgressIndicator — see the component doc comment. */
  children?: ReactNode
  /** Left icon-button content. Rendered by every variant except 'default' and 'rightIconButtonOnly'. */
  leftIcon?: ReactNode
  /** Accessible label for the left icon button. */
  leftLabel?: string
  onLeftClick?: () => void
  /** Right icon-button content — the only right icon at leftAndRightIconButton/rightIconButtonOnly, the left-most of two at leftAndTwoRightIconButtons, or the icon paired with rightText at leftAnd2RightButtons. */
  rightIcon?: ReactNode
  /** Accessible label for `rightIcon`. */
  rightLabel?: string
  onRightClick?: () => void
  /** Render `rightIcon` as decoration, not a control: same box, same 40px circle, same glyph, but a `<span aria-hidden>` instead of a `<button>`, so it can't be focused and isn't announced. For an icon Figma draws but gives nowhere to go. */
  rightDecorative?: boolean
  /** Second right icon-button content — leftAndTwoRightIconButtons only. */
  rightIcon2?: ReactNode
  /** Accessible label for `rightIcon2`. */
  rightLabel2?: string
  onRightClick2?: () => void
  /** Right text-button label — leftAndRightButton and leftAnd2RightButtons. */
  rightText?: string
  onRightTextClick?: () => void
  className?: string
}

// variant -> the bar's own horizontal padding. All bound to real space
// tokens, confirmed via get_variable_defs, not matched by value.
function barPaddingInline(variant: AppBarVariant): { left: string; right: string } {
  if (variant === 'leftAnd2RightButtons') {
    return { left: 'var(--size-space-100)', right: 'var(--size-space-300)' }
  }
  if (['rightIconButtonOnly', 'leftAndRightIconButton', 'leftAndTwoRightIconButtons'].includes(variant)) {
    return { left: 'var(--size-space-100)', right: 'var(--size-space-100)' }
  }
  if (['leftIconButtonOnly', 'leftAndRightButton'].includes(variant)) {
    return { left: 'var(--size-space-100)', right: 'var(--size-space-400)' }
  }
  // 'default' — the one variant none of the above cover.
  return { left: 'var(--size-space-400)', right: 'var(--size-space-400)' }
}

// The 48px touch target / 40px unfilled circle every icon button in
// this component shares — unbound literals, see doc comment above.
function AppBarIconButton({
  icon,
  label,
  onClick,
  decorative,
}: {
  icon?: ReactNode
  label?: string
  onClick?: () => void
  decorative?: boolean
}) {
  // Decorative keeps the box and the glyph and takes the button semantics
  // off: no focus stop, nothing announced. Everything visual below is
  // shared with the real button, so the two can't drift apart.
  const Box = decorative ? 'span' : 'button'
  const boxProps = decorative
    ? ({ 'aria-hidden': true } as const)
    : ({ type: 'button' as const, 'aria-label': label, onClick })
  return (
    <Box
      {...boxProps}
      className="inline-flex shrink-0 items-center justify-center"
      style={{ width: 48, height: 48 }} // Not bound to a token in Figma — see doc comment above.
    >
      <span
        className="inline-flex items-center justify-center"
        style={{
          width: 40, // Not bound to a token in Figma — see doc comment above.
          height: 40, // Not bound to a token in Figma — see doc comment above.
          borderRadius: 'var(--size-radius-full)',
          color: 'var(--semantic-color-text-primary)',
        }}
      >
        <IconSlot size="300" icon={icon} />
      </span>
    </Box>
  )
}

// The "Skip"-style text button — unbound literal heights, bound gap/
// radius/type-style, see doc comment above.
function AppBarTextButton({ text, onClick }: { text: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex shrink-0 items-center justify-center"
      style={{ height: 52, minHeight: 48 }} // Not bound to a token in Figma — see doc comment above.
    >
      <span
        className="inline-flex items-center justify-center whitespace-nowrap"
        style={{
          height: 40, // Not bound to a token in Figma — see doc comment above.
          gap: 'var(--size-space-150)',
          borderRadius: 'var(--size-radius-full)',
          color: 'var(--semantic-color-text-primary)',
          fontFamily: 'var(--type-scale-headline-xxs-bold-font-family)',
          fontWeight: 'var(--type-scale-headline-xxs-bold-font-weight)',
          fontSize: 'var(--type-scale-headline-xxs-bold-font-size)',
          lineHeight: 'var(--type-scale-headline-xxs-bold-line-height)',
          letterSpacing: 'var(--type-scale-headline-xxs-bold-letter-spacing)',
        }}
      >
        {text}
      </span>
    </button>
  )
}

export function AppBar({
  variant = 'default',
  children,
  leftIcon,
  leftLabel,
  onLeftClick,
  rightIcon,
  rightLabel,
  onRightClick,
  rightDecorative,
  rightIcon2,
  rightLabel2,
  onRightClick2,
  rightText,
  onRightTextClick,
  className,
}: AppBarProps) {
  const hasLeftIcon = variant !== 'default' && variant !== 'rightIconButtonOnly'
  const padding = barPaddingInline(variant)

  return (
    <div className={`flex w-full flex-col items-start ${className ?? ''}`}>
      <div
        className="flex h-[56px] w-full shrink-0 items-center overflow-hidden" // 56px not bound to a token in Figma — see doc comment above.
        style={{
          gap: 'var(--size-space-100)',
          paddingLeft: padding.left,
          paddingRight: padding.right,
          paddingTop: 'var(--size-space-0)',
          paddingBottom: 'var(--size-space-200)',
          // "Gradient/BG Top" — see doc comment above for why the
          // second stop is `transparent` rather than a token or a raw
          // hex.
          background: 'linear-gradient(to bottom, var(--semantic-color-background-page), transparent)',
        }}
      >
        {hasLeftIcon && <AppBarIconButton icon={leftIcon} label={leftLabel} onClick={onLeftClick} />}

        <div className="h-full min-w-0 flex-1">{children}</div>

        {variant === 'rightIconButtonOnly' && (
          <AppBarIconButton icon={rightIcon} label={rightLabel} onClick={onRightClick} decorative={rightDecorative} />
        )}
        {variant === 'leftAndRightIconButton' && (
          <AppBarIconButton icon={rightIcon} label={rightLabel} onClick={onRightClick} decorative={rightDecorative} />
        )}
        {variant === 'leftAndRightButton' && (
          <div className="flex h-full shrink-0 items-center" style={{ paddingLeft: 'var(--size-space-300)' }}>
            {rightText && <AppBarTextButton text={rightText} onClick={onRightTextClick} />}
          </div>
        )}
        {variant === 'leftAndTwoRightIconButtons' && (
          <div className="flex shrink-0 items-center">
            <AppBarIconButton icon={rightIcon} label={rightLabel} onClick={onRightClick} decorative={rightDecorative} />
            <AppBarIconButton icon={rightIcon2} label={rightLabel2} onClick={onRightClick2} />
          </div>
        )}
        {variant === 'leftAnd2RightButtons' && (
          <div
            className="flex shrink-0 items-center"
            style={{ paddingRight: 'var(--size-space-100)' }}
          >
            <AppBarIconButton icon={rightIcon} label={rightLabel} onClick={onRightClick} decorative={rightDecorative} />
            {rightText && <AppBarTextButton text={rightText} onClick={onRightTextClick} />}
          </div>
        )}
      </div>
    </div>
  )
}
