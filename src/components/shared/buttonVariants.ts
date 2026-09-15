// Shared between Button and ButtonIcon — both are separate Figma
// component sets, but confirmed (via figma_get_component_for_development's
// boundVariables, not just matching rendered colors) to use the exact
// same variant/size/state axes and the exact same fill logic. Kept in one
// place so the two components can't quietly drift apart.

import type { IconSlotSize } from '../IconSlot/IconSlot'

export type ButtonVariant = 'Primary' | 'Secondary' | 'Tertiary'
export type ButtonSize = 'S' | 'M' | 'L'
export type ButtonState = 'Default' | 'Pressed' | 'Disabled' | 'Loading'

// size=S,M,L -> the IconSlot size to render at, identical in both
// components. IconSlot (../IconSlot/IconSlot.tsx) is the actual Figma
// primitive both button and buttonIcon nest — this just maps their own
// size scale onto its.
export const ICON_SLOT_SIZE: Record<ButtonSize, IconSlotSize> = {
  S: '200',
  M: '250',
  L: '300',
}

export type Fill = {
  /** CSS var for the resting fill. Undefined for Tertiary (no fill). */
  backgroundVar?: string
  /**
   * CSS var for a translucent overlay stacked on top of backgroundVar,
   * reproducing Figma's own two-fill stack for the Pressed state.
   */
  overlayVar?: string
  textVar: string
}

// variant=Primary,Secondary,Tertiary x state=Default,Pressed,Disabled,Loading
// -> fill and icon/label color. Resolved from Figma's actual bound
// variables, not from matching rendered colors — several tokens share
// the same literal value (interactive/secondary, interactive/pressed,
// and interactive/disabled are all rgba(255,255,255,0.1)), so color
// alone can't tell them apart.
export function getFill(variant: ButtonVariant, state: ButtonState): Fill {
  if (variant === 'Tertiary') {
    // No fill at any state. Figma stacks a second `interactive/pressed`
    // fill directly on the Pressed label's text color; Figma's own
    // design-to-code output collapses that to a single fill too (the
    // visible difference is negligible on this near-white text color),
    // so it's reproduced here as text/primary alone rather than
    // simulating a two-layer text fill.
    return {
      textVar:
        state === 'Disabled'
          ? '--semantic-color-text-disabled'
          : '--semantic-color-text-primary',
    }
  }

  if (variant === 'Primary') {
    if (state === 'Disabled') {
      return {
        backgroundVar: '--semantic-color-background-surface',
        textVar: '--semantic-color-text-disabled',
      }
    }
    return {
      backgroundVar: '--semantic-color-interactive-primary',
      overlayVar: state === 'Pressed' ? '--semantic-color-interactive-pressed' : undefined,
      textVar: '--semantic-color-interactive-on-primary',
    }
  }

  // Secondary
  if (state === 'Disabled') {
    return {
      backgroundVar: '--semantic-color-background-surface',
      textVar: '--semantic-color-text-disabled',
    }
  }
  return {
    backgroundVar: '--semantic-color-background-surface',
    // Figma's actual bound overlay here is background/stacking (built
    // for toasts/snackbars "lift"), not interactive/pressedInverse,
    // which tokens.json's own description says is the one for "tap
    // feedback on secondary buttons". Flagging the mismatch rather than
    // silently using the token whose description sounds right —
    // Figma wins when they disagree (see CLAUDE.md), so this reproduces
    // what's actually bound.
    overlayVar: state === 'Pressed' ? '--semantic-color-background-stacking' : undefined,
    textVar: '--semantic-color-text-primary',
  }
}

/** CSS background value for a Fill, stacking the overlay over the resting fill the same way Figma does for Pressed. */
export function fillToBackground(fill: Fill): string | undefined {
  if (!fill.backgroundVar) return undefined
  if (!fill.overlayVar) return `var(${fill.backgroundVar})`
  return `linear-gradient(var(${fill.overlayVar}), var(${fill.overlayVar})), linear-gradient(var(${fill.backgroundVar}), var(${fill.backgroundVar}))`
}
