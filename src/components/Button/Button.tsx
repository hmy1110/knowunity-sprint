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
 * Knowunity `button` — Figma component set, node 9003:6667 in the
 * "Yummy__Knowie Design System" file (🎨 Mascot & components page).
 *
 * Figma's own component description (verbatim):
 *
 * > What it is: 36-variant control (Primary/Secondary/Tertiary x S/M/L x
 * > Default/Pressed/Disabled/Loading), with optional left/right icons and
 * > a center icon slot used for the Loading spinner. When to use it: The
 * > app's main CTA. Real screens show it as the quiz "Check"/"Continue"
 * > actions and "Try again," and the explain-out-loud beta uses the
 * > identical pattern for "Continue" after a result and "Continue"/"Try
 * > again" on its own summary screen. In the recall loop, real instances
 * > back "Continue," "Submit," "Type instead," "I don't know," "Switch to
 * > voice," and, at Secondary/S with a trailing icon, "Speak" and "Redo"
 * > on the study plan card. Primary/L is the loop's main forward action;
 * > Tertiary is used for the lighter text-style actions. One thing to do:
 * > Default, Pressed and Disabled all have real examples (Disabled:
 * > Submit and Switch to voice on Learning-typeProcessing, dimmed during
 * > the text-path wait). Loading has no real example anywhere, despite
 * > being exactly the state the two processing-wait screens (voice and
 * > text) need; build and test it before those screens depend on it.
 * > Also flag the structural inconsistency to engineering: the
 * > Tertiary/L/Loading sample skips the wrapper "Content" frame that
 * > Primary/Secondary use, so instances aren't uniformly swappable yet.
 *
 * Gaps found while building this (flagged, not silently invented — see
 * PR/commit notes): the S/M/L heights (32/40/56px), the 2px/4px optical
 * bottom-padding nudge on the label row, and the inset bottom-edge bevel
 * shadow (rgba(0,0,0,0.15), which matches no color in tokens.json — the
 * closest is alpha/dark-10 at 10%, not 15%) are hardcoded literal pixel
 * values in Figma with no bound variable behind any of them. Per Mia's
 * call, they're reproduced here as literal exceptions so the button is
 * pixel-correct today; they're marked below so they're easy to swap for
 * real tokens once those exist.
 *
 * Left/right icons render through IconSlot (../IconSlot/IconSlot.tsx,
 * the actual Figma primitive this component nests), sized by mapping
 * this component's own size scale onto IconSlot's via
 * ../shared/buttonVariants.ts's ICON_SLOT_SIZE. No icon system beyond
 * that exists in this codebase — `leftIcon`/`rightIcon` still take real
 * icon content from the caller. The Loading spinner is the one
 * exception to "no real icon content exists yet": it's Figma's actual
 * "loading-01" glyph, downloaded from the component's own exported
 * assets and inlined in LoadingSpinner.tsx (source SVGs in
 * public/icons/loading/), colored via `currentColor` so it still binds
 * the same semantic token the label would have used rather than a
 * hardcoded hex.
 *
 * Also per Figma's own reference code: left/right icons stay visible
 * alongside the spinner during Loading (only the label hides) — this
 * was missed in an earlier version of this file, which hid all icons
 * whenever `state` was "Loading".
 */

// Re-exported so existing imports (`import { type ButtonSize } from
// './Button'`) keep working — the actual definitions live in
// ../shared/buttonVariants, shared with ButtonIcon.
export type { ButtonVariant, ButtonSize, ButtonState } from '../shared/buttonVariants'

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> {
  /** Which of the three visual treatments this instance uses. */
  variant?: ButtonVariant
  /** Which of the three sizes this instance uses. */
  size?: ButtonSize
  /**
   * Which of the four states this instance is in. This mirrors Figma's
   * own `state` variant property — Pressed and Loading are authored,
   * testable states here, not left to `:hover`/`:active` alone, matching
   * how the rest of the design system's stateful components work.
   */
  state?: ButtonState
  /** The button's label. Hidden while `state` is "Loading". */
  cta: string
  /** Shows the left icon slot. Ignored while `state` is "Loading". */
  showLeftIcon?: boolean
  /** Shows the right icon slot. Ignored while `state` is "Loading". */
  showRightIcon?: boolean
  /** Real icon content for the left icon slot (no icon system exists in this project yet — see the component doc comment). */
  leftIcon?: ReactNode
  /** Real icon content for the right icon slot (no icon system exists in this project yet — see the component doc comment). */
  rightIcon?: ReactNode
}

// size=S,M,L -> horizontal padding, icon-to-label gap, and icon box
// size, all bound to real tokens. Height and the label row's bottom
// padding are NOT bound to any token in Figma (see the doc comment
// above) — reproduced here as literal exceptions.
const SIZE_CONFIG: Record<
  ButtonSize,
  {
    paddingXVar: string
    gapVar: string
    /** Not bound to a token in Figma — literal exception, see doc comment above. */
    heightPx: number
    /** Not bound to a token in Figma — literal exception, see doc comment above. */
    labelBottomNudgePx: number
    typeScale: 'body-s-bold' | 'headline-s'
  }
> = {
  S: {
    paddingXVar: '--size-space-300',
    gapVar: '--size-space-150',
    heightPx: 32,
    labelBottomNudgePx: 2,
    typeScale: 'body-s-bold',
  },
  M: {
    paddingXVar: '--size-space-400',
    gapVar: '--size-space-150',
    heightPx: 40,
    labelBottomNudgePx: 2,
    typeScale: 'body-s-bold',
  },
  L: {
    paddingXVar: '--size-space-600',
    gapVar: '--size-space-200',
    heightPx: 56,
    labelBottomNudgePx: 4,
    typeScale: 'headline-s',
  },
}

export function Button({
  variant = 'Primary',
  size = 'S',
  state = 'Default',
  cta,
  showLeftIcon = false,
  showRightIcon = false,
  leftIcon,
  rightIcon,
  className,
  ...rest
}: ButtonProps) {
  const sizeConfig = SIZE_CONFIG[size]
  const fill = getFill(variant, state)
  const isLoading = state === 'Loading'
  const isDisabled = state === 'Disabled' || isLoading
  const hasFill = variant !== 'Tertiary'
  // Figma's Tertiary/S frame is 48px tall around the 32px visible label
  // row (confirmed by Mia, 2026-09-19); the extra 16px is tap area, not
  // layout. Reproduced as an absolutely positioned child so the visible
  // size and the surrounding layout don't move, same as the Skip link in
  // session/page.tsx. The 48px is an unbound literal in Figma too.
  const hasOuterTapArea = variant === 'Tertiary' && size === 'S'

  return (
    <button
      type="button"
      disabled={isDisabled}
      aria-busy={isLoading}
      // Loading hides the visible label in favor of the spinner, which
      // would otherwise leave the button with no accessible name at all.
      aria-label={isLoading ? cta : undefined}
      className={`inline-flex items-center justify-center ${className ?? ''}`}
      style={{
        position: hasOuterTapArea ? 'relative' : undefined,
        height: sizeConfig.heightPx, // Not bound to a token in Figma — see doc comment above.
        paddingInline: `var(${sizeConfig.paddingXVar})`,
        borderRadius: hasFill ? 'var(--size-radius-full)' : undefined,
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
      <span
        className="inline-flex items-center"
        style={{
          gap: `var(${sizeConfig.gapVar})`,
          paddingBottom: sizeConfig.labelBottomNudgePx, // Not bound to a token in Figma — see doc comment above.
        }}
      >
        {/* Figma keeps left/right icons visible alongside the spinner
            during Loading (confirmed from the component's own reference
            code) — only the label hides. */}
        {showLeftIcon && leftIcon && <IconSlot size={ICON_SLOT_SIZE[size]} icon={leftIcon} />}

        {isLoading ? (
          <LoadingSpinner size={size} sizeVar={ICON_SLOT_SIZE_VAR[ICON_SLOT_SIZE[size]]} colorVar={fill.textVar} />
        ) : (
          <span
            style={{
              color: `var(${fill.textVar})`,
              fontFamily:
                sizeConfig.typeScale === 'headline-s'
                  ? 'var(--type-scale-headline-s-font-family)'
                  : 'var(--type-scale-body-s-bold-font-family)',
              fontWeight:
                sizeConfig.typeScale === 'headline-s'
                  ? 'var(--type-scale-headline-s-font-weight)'
                  : 'var(--type-scale-body-s-bold-font-weight)',
              fontSize:
                sizeConfig.typeScale === 'headline-s'
                  ? 'var(--type-scale-headline-s-font-size)'
                  : 'var(--type-scale-body-s-bold-font-size)',
              lineHeight:
                sizeConfig.typeScale === 'headline-s'
                  ? 'var(--type-scale-headline-s-line-height)'
                  : 'var(--type-scale-body-s-bold-line-height)',
              letterSpacing:
                sizeConfig.typeScale === 'headline-s'
                  ? 'var(--type-scale-headline-s-letter-spacing)'
                  : 'var(--type-scale-body-s-bold-letter-spacing)',
              whiteSpace: 'nowrap',
            }}
          >
            {cta}
          </span>
        )}

        {showRightIcon && rightIcon && <IconSlot size={ICON_SLOT_SIZE[size]} icon={rightIcon} />}
      </span>
      {hasOuterTapArea && (
        <span
          aria-hidden
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 'max(100%, 48px)',
            height: 48,
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}
    </button>
  )
}
