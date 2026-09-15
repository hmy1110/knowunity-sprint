import { Button, type ButtonProps } from '../Button/Button'
import { ButtonIcon, type ButtonIconProps } from '../ButtonIcon/ButtonIcon'

/**
 * Knowunity `buttonGroup` — Figma component set, node 9003:8455 in the
 * "Yummy__Knowie Design System" file (🎨 Mascot & components page).
 *
 * Figma's own component description (verbatim):
 *
 * > What it is: A fixed two-slot pairing, not a generic repeater.
 * > Vertical pairs button(Primary) + button(Secondary); Horizontal
 * > pairs buttonIcon(Secondary) + button(Primary). When to use it: The
 * > one real example is Horizontal, in a quiz answer-feedback row (icon
 * > action next to a confirm button), similar in spirit to the
 * > thumbs-up/down plus "Why?"/"Continue" row on the quiz
 * > correct-answer sheet. Vertical has no real example; it reads as the
 * > right shape for a stacked "Try again"/"Continue" pair on the recall
 * > summary screen. One thing to do: Because it's a fixed two-slot
 * > pairing and not a repeater, don't stretch it to hold three or more
 * > actions, like a multi-step hint ladder. If the loop ever needs more
 * > than two grouped actions, treat that as a new component question,
 * > not a reason to force this one.
 *
 * This is a layout-only wrapper, not a new visual component: per
 * design-system.md's own §1 entry for buttonGroup, and confirmed by
 * Figma's reference code (which literally re-draws Button's and
 * ButtonIcon's internals a second time as duplicate markup), a
 * buttonGroup instance IS a Button + Button (Vertical) or a ButtonIcon +
 * Button (Horizontal). Rather than reproduce that duplicate markup a
 * third time, this composes the real Button and ButtonIcon components
 * already in this project — so any future fix to either one (colors,
 * spacing, the still-open touch-target question) applies here too
 * instead of needing to be found and patched a third place.
 *
 * The two slots' content (label, icon, click handling, state) can't come
 * from Figma — a design file has no concept of what a button says or
 * does — so they're passed straight through as the same props Button and
 * ButtonIcon already take (`Omit<..., 'variant' | 'size'>`, since this
 * component fixes those per the design: Primary/Secondary for Vertical,
 * Secondary/Primary for Horizontal).
 *
 * Gap found, not silently invented: Figma's own frame for every
 * buttonGroup variant is a literal, hardcoded 319px wide, bound to no
 * token. That number lines up with the "Overview" documentation page's
 * own swatch-frame layout (see the file's own working-log frames), not
 * with any real screen width — real usage (the quiz answer-feedback row,
 * the recall summary screen) is full-bleed inside the scaffold's content
 * slot, not a fixed 319px island. Built here as `width: 100%` instead;
 * flagging rather than reproducing a number that reads as a documentation
 * artifact, not a design decision.
 */

export type ButtonGroupSize = 'M' | 'L'

type ButtonSlotProps = Omit<ButtonProps, 'variant' | 'size'>
type ButtonIconSlotProps = Omit<ButtonIconProps, 'variant' | 'size'>

export type ButtonGroupProps =
  | {
      /** Stacked pair: Button/Primary above Button/Secondary. */
      variant: 'Vertical'
      /** Which of the two sizes this instance uses. */
      size?: ButtonGroupSize
      /** Props for the top (Primary) button — everything Button takes except `variant`/`size`, which this component fixes. */
      primary: ButtonSlotProps
      /** Props for the bottom (Secondary) button — everything Button takes except `variant`/`size`. */
      secondary: ButtonSlotProps
    }
  | {
      /** Side-by-side pair: ButtonIcon/Secondary beside Button/Primary. */
      variant: 'Horizontal'
      /** Which of the two sizes this instance uses. */
      size?: ButtonGroupSize
      /** Props for the icon action — everything ButtonIcon takes except `variant`/`size`. */
      icon: ButtonIconSlotProps
      /** Props for the confirm button — everything Button takes except `variant`/`size`. */
      primary: ButtonSlotProps
    }

// variant=Vertical,Horizontal x size=M,L -> the gap between the two
// slots. All four bound to real tokens — no ambiguity here the way
// Button/ButtonIcon's colors had, since this component doesn't introduce
// any new color decisions of its own.
const GAP_VAR: Record<'Vertical' | 'Horizontal', Record<ButtonGroupSize, string>> = {
  Vertical: { M: '--size-space-0', L: '--size-space-200' },
  Horizontal: { M: '--size-space-100', L: '--size-space-200' },
}

export function ButtonGroup(props: ButtonGroupProps) {
  const { variant, size = 'M' } = props
  const isVertical = variant === 'Vertical'

  return (
    <div
      className={isVertical ? 'flex flex-col items-start' : 'flex items-start'}
      style={{
        width: '100%', // Figma's own 319px is a documentation-frame artifact, not a token or a real screen width — see doc comment above.
        gap: `var(${GAP_VAR[variant][size]})`,
      }}
    >
      {isVertical ? (
        <>
          <Button {...props.primary} variant="Primary" size={size} className={`w-full ${props.primary.className ?? ''}`} />
          <Button {...props.secondary} variant="Secondary" size={size} className={`w-full ${props.secondary.className ?? ''}`} />
        </>
      ) : (
        <>
          <ButtonIcon {...props.icon} variant="Secondary" size={size === 'L' ? 'L' : 'S'} />
          <Button {...props.primary} variant="Primary" size={size} className={`flex-1 ${props.primary.className ?? ''}`} />
        </>
      )}
    </div>
  )
}
