import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ProgressIndicator, type ProgressIndicatorProgress, type ProgressIndicatorThickness, type ProgressIndicatorVariant } from './ProgressIndicator'

// Figma's own component description, verbatim (node 9003:8923, "🎨 Mascot
// & components" page, Yummy__Knowie Design System). Read this before
// using or changing the component — see ProgressIndicator.tsx for the
// full text with paragraph breaks.
const FIGMA_DESCRIPTION = `**What it is:** 20-variant bar (Primary/Coral, thickness 16/24, progress in 25% steps, optional "Unit Progress" text like "9/12" for a literal count instead of just a percentage fill).

**When to use it:** Built into every appBar's stretchable slot across the loop, 16 real instances, Primary color throughout, showText false everywhere: the "Topics 2 of 4" term count is a separate text element next to the bar, not this component's own unit-count mode.

**One thing to do:** Progress values 25/50/75 are all real, one step per term through a 4-term session, so only 0 and 100 are untested. Coral is never used anywhere; confirm whether it's reserved for a specific moment or should be removed as an unused variant.

---

**Gaps found building this component** (flagged, not silently invented): Figma's own frame is a literal, hardcoded 350px wide, bound to no token — design-system.md's own words for this component are "sits inside every appBar's **stretchable** slot," so it's built as \`width: 100%\` instead, the same call made for buttonGroup's own hardcoded 319px. The track's \`12px\` corner radius is also an unbound literal, but at both thicknesses it exceeds half the bar's height, so the browser clamps it to a perfect pill regardless — the same result \`size/radius/Full\` already gives, so that's bound instead of the literal. Thickness 24's 2px active-track inset exactly matches \`size/space/050\`, so that's bound too rather than left as a number.

**Two deliberate simplifications, not gaps:** the fill's width is a plain \`width: X%\` here instead of reproducing Figma's oddly specific 24.75%/75.25% offsets (an artifact of its own constraint math against the 2px inset) — same proportions, without copying numbers whose derivation isn't obvious from the file. At progress=0, Figma shows a small round dot rather than a literal zero-width fill; reproduced deliberately as a fixed-size nub.

\`showText\`'s label only ever appears at thickness 24 in Figma's file — never built for thickness 16 — so that pairing is reproduced exactly. Figma's own instance hardcodes illustrative example text ("9/12" off an example 12-unit total); real usage needs its own real count, so \`unitText\` takes that string from the caller. Per design-system.md, the built recall loop never actually uses this mode at all.`

const meta = {
  title: 'Components/ProgressIndicator',
  component: ProgressIndicator,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: FIGMA_DESCRIPTION,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['Primary', 'Coral'],
    },
    thickness: {
      control: 'radio',
      options: ['24', '16'],
    },
    progress: {
      control: 'radio',
      options: ['0', '25', '50', '75', '100'],
    },
  },
} satisfies Meta<typeof ProgressIndicator>

export default meta
type Story = StoryObj<typeof meta>

// One story per Figma variant symbol ("variant=X, thickness=Y,
// progress=Z"), named to match. All 20 combinations, in the same order
// Figma lists them (Primary/Coral x thickness 24/16 x progress
// 0/25/50/75/100).
function variantStory(
  variant: ProgressIndicatorVariant,
  thickness: ProgressIndicatorThickness,
  progress: ProgressIndicatorProgress
): Story {
  return {
    name: `variant=${variant}, thickness=${thickness}, progress=${progress}`,
    tags: ['ai-generated'],
    args: { variant, thickness, progress },
  }
}

// Primary, thickness 24
export const PrimaryT24P0 = variantStory('Primary', '24', '0')
export const PrimaryT24P25 = variantStory('Primary', '24', '25')
export const PrimaryT24P50 = variantStory('Primary', '24', '50')
export const PrimaryT24P75 = variantStory('Primary', '24', '75')
export const PrimaryT24P100 = variantStory('Primary', '24', '100')

// Primary, thickness 16
export const PrimaryT16P0 = variantStory('Primary', '16', '0')
export const PrimaryT16P25 = variantStory('Primary', '16', '25')
export const PrimaryT16P50 = variantStory('Primary', '16', '50')
export const PrimaryT16P75 = variantStory('Primary', '16', '75')
export const PrimaryT16P100 = variantStory('Primary', '16', '100')

// Coral, thickness 24
export const CoralT24P0 = variantStory('Coral', '24', '0')
export const CoralT24P25 = variantStory('Coral', '24', '25')
export const CoralT24P50 = variantStory('Coral', '24', '50')
export const CoralT24P75 = variantStory('Coral', '24', '75')
export const CoralT24P100 = variantStory('Coral', '24', '100')

// Coral, thickness 16
export const CoralT16P0 = variantStory('Coral', '16', '0')
export const CoralT16P25 = variantStory('Coral', '16', '25')
export const CoralT16P50 = variantStory('Coral', '16', '50')
export const CoralT16P75 = variantStory('Coral', '16', '75')
export const CoralT16P100 = variantStory('Coral', '16', '100')

// The beta's real usage per Figma's own description: showText=true with
// a real unit count, only meaningful at thickness 24 (see doc comment).
export const WithUnitText: Story = {
  tags: ['ai-generated'],
  args: {
    variant: 'Primary',
    thickness: '24',
    progress: '50',
    showText: true,
    unitText: '2/4',
  },
}
