import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ButtonIcon } from './ButtonIcon'
import type { ButtonSize, ButtonState, ButtonVariant } from '../shared/buttonVariants'

// Figma's own component description, verbatim (node 9003:8235, "🎨 Mascot
// & components" page, Yummy__Knowie Design System). Read this before
// using or changing the component — see ButtonIcon.tsx for the full
// text with paragraph breaks.
const FIGMA_DESCRIPTION = `**What it is:** Icon-only button sharing button's 36-variant axes (Primary/Secondary/Tertiary x S/M/L x state), built from a single center icon slot.

**When to use it:** Real usage is thin. Only Secondary/L and Secondary/M appear anywhere, but the shape fits the recall loop's mic button, the close (X), and the discard action in review-before-send. The large circular mic button in the beta's explain-out-loud screens is bigger than any documented buttonIcon size, so building it from this component likely means adding a new size rather than picking an existing one.

**One thing to do:** Primary, Tertiary, every S size, and every non-Default state have zero real examples. Before the mic button ships, explicitly design and test a Primary/Pressed or Primary/Loading state, since that's the exact state a tapped, recording mic will be in.

---

**Gaps found building this component** (flagged, not silently invented): the S/M/L circle diameters (32/40/56px) and the inset bottom-edge bevel shadow (\`rgba(0,0,0,0.15)\`, matching no color in tokens.json) are hardcoded literal values in Figma with no bound variable — the same two gaps Button has. Figma's own frame is also larger than the visible circle at S and M (48×48px vs the 32/40px circle drawn inside it), matching Button's own still-open outer-touch-target question. There's no icon system in this codebase, so \`icon\` takes real content from the caller — Figma's own icon here is a generic placeholder anyway ("square", not a real designed glyph). Figma's file also has a structural oddity at Secondary/L/Default (a duplicated, oddly-padded icon layer) that reads as leftover Figma layer structure rather than an intentional difference, so it isn't reproduced.

Confirmed from Figma's real bound variables (not by matching rendered colors): Primary carries a 1px \`border/default\` ring in Default/Pressed/Loading (not Disabled) that Secondary, Tertiary, and Button itself never have.`

const meta = {
  title: 'Components/ButtonIcon',
  component: ButtonIcon,
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
      options: ['Primary', 'Secondary', 'Tertiary'],
    },
    size: {
      control: 'radio',
      options: ['S', 'M', 'L'],
    },
    state: {
      control: 'radio',
      options: ['Default', 'Pressed', 'Disabled', 'Loading'],
    },
    label: { control: 'text' },
  },
  args: {
    label: 'Close',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        <path
          d="M4 4L12 12M12 4L4 12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
} satisfies Meta<typeof ButtonIcon>

export default meta
type Story = StoryObj<typeof meta>

// One story per Figma variant symbol ("variant=X, size=Y, state=Z"),
// named to match. All 36 combinations, in the same order Figma lists
// them (Primary, Secondary, Tertiary x S, M, L x Default, Pressed,
// Disabled, Loading).
function variantStory(variant: ButtonVariant, size: ButtonSize, state: ButtonState): Story {
  return {
    name: `variant=${variant}, size=${size}, state=${state}`,
    tags: ['ai-generated'],
    args: { variant, size, state },
  }
}

// Primary
export const PrimarySDefault = variantStory('Primary', 'S', 'Default')
export const PrimarySPressed = variantStory('Primary', 'S', 'Pressed')
export const PrimarySDisabled = variantStory('Primary', 'S', 'Disabled')
export const PrimarySLoading = variantStory('Primary', 'S', 'Loading')
export const PrimaryMDefault = variantStory('Primary', 'M', 'Default')
export const PrimaryMPressed = variantStory('Primary', 'M', 'Pressed')
export const PrimaryMDisabled = variantStory('Primary', 'M', 'Disabled')
export const PrimaryMLoading = variantStory('Primary', 'M', 'Loading')
export const PrimaryLDefault = variantStory('Primary', 'L', 'Default')
export const PrimaryLPressed = variantStory('Primary', 'L', 'Pressed')
export const PrimaryLDisabled = variantStory('Primary', 'L', 'Disabled')
export const PrimaryLLoading = variantStory('Primary', 'L', 'Loading')

// Secondary
export const SecondarySDefault = variantStory('Secondary', 'S', 'Default')
export const SecondarySPressed = variantStory('Secondary', 'S', 'Pressed')
export const SecondarySDisabled = variantStory('Secondary', 'S', 'Disabled')
export const SecondarySLoading = variantStory('Secondary', 'S', 'Loading')
export const SecondaryMDefault = variantStory('Secondary', 'M', 'Default')
export const SecondaryMPressed = variantStory('Secondary', 'M', 'Pressed')
export const SecondaryMDisabled = variantStory('Secondary', 'M', 'Disabled')
export const SecondaryMLoading = variantStory('Secondary', 'M', 'Loading')
export const SecondaryLDefault = variantStory('Secondary', 'L', 'Default')
export const SecondaryLPressed = variantStory('Secondary', 'L', 'Pressed')
export const SecondaryLDisabled = variantStory('Secondary', 'L', 'Disabled')
export const SecondaryLLoading = variantStory('Secondary', 'L', 'Loading')

// Tertiary
export const TertiarySDefault = variantStory('Tertiary', 'S', 'Default')
export const TertiarySPressed = variantStory('Tertiary', 'S', 'Pressed')
export const TertiarySDisabled = variantStory('Tertiary', 'S', 'Disabled')
export const TertiarySLoading = variantStory('Tertiary', 'S', 'Loading')
export const TertiaryMDefault = variantStory('Tertiary', 'M', 'Default')
export const TertiaryMPressed = variantStory('Tertiary', 'M', 'Pressed')
export const TertiaryMDisabled = variantStory('Tertiary', 'M', 'Disabled')
export const TertiaryMLoading = variantStory('Tertiary', 'M', 'Loading')
export const TertiaryLDefault = variantStory('Tertiary', 'L', 'Default')
export const TertiaryLPressed = variantStory('Tertiary', 'L', 'Pressed')
export const TertiaryLDisabled = variantStory('Tertiary', 'L', 'Disabled')
export const TertiaryLLoading = variantStory('Tertiary', 'L', 'Loading')

// Per the Figma description's own real-usage note: Secondary/L is the
// one combination with actual real-screen precedent (the recall loop's
// mic button, close (X), and discard-in-review actions).
export const RealUsageExample: Story = {
  tags: ['ai-generated'],
  args: {
    variant: 'Secondary',
    size: 'L',
    state: 'Default',
    label: 'Record answer',
  },
}
