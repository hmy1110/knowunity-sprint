import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Button, type ButtonSize, type ButtonState, type ButtonVariant } from './Button'

// Figma's own component description, verbatim (node 9003:6667, "🎨 Mascot
// & components" page, Yummy__Knowie Design System). Read this before
// using or changing the component — see Button.tsx for the full text
// with paragraph breaks.
const FIGMA_DESCRIPTION = `**What it is:** 36-variant control (Primary/Secondary/Tertiary x S/M/L x Default/Pressed/Disabled/Loading), with optional left/right icons and a center icon slot used for the Loading spinner.

**When to use it:** The app's main CTA. Real screens show it as the quiz "Check"/"Continue" actions and "Try again," and the explain-out-loud beta uses the identical pattern for "Continue" after a result and "Continue"/"Try again" on its own summary screen. In the recall loop, real instances back "Continue," "Submit," "Type instead," "I don't know," "Switch to voice," and, at Secondary/S with a trailing icon, "Speak" and "Redo" on the study plan card. Primary/L is the loop's main forward action; Tertiary is used for the lighter text-style actions.

**One thing to do:** Default, Pressed and Disabled all have real examples (Disabled: Submit and Switch to voice on Learning-typeProcessing, dimmed during the text-path wait). Loading has no real example anywhere, despite being exactly the state the two processing-wait screens (voice and text) need — build and test it before those screens depend on it. Also flag the structural inconsistency to engineering: the Tertiary/L/Loading sample skips the wrapper "Content" frame that Primary/Secondary use, so instances aren't uniformly swappable yet.

---

**Gaps found building this component** (flagged per Mia's call, not silently invented): the S/M/L heights (32/40/56px), the label row's 2px/4px optical bottom-padding nudge, and the inset bottom-edge bevel shadow (\`rgba(0,0,0,0.15)\`, which matches no color in tokens.json) are hardcoded literal pixel values in Figma with no bound variable behind any of them — reproduced here as literal exceptions. There's also no general icon system in this codebase, so \`leftIcon\`/\`rightIcon\` take real icon content from the caller; the Loading spinner is the one exception, using Figma's actual "loading-01" glyph (downloaded from the component's own exported assets) rather than a fabricated one — see Button.tsx for details. Figma also keeps left/right icons visible alongside the spinner during Loading, which this component matches.`

const meta = {
  title: 'Components/Button',
  component: Button,
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
    cta: { control: 'text' },
  },
  args: {
    cta: 'Continue',
  },
} satisfies Meta<typeof Button>

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

// A couple of real recall-loop usages with icons, per the Figma
// description's own examples ("Speak"/"Redo" at Secondary/S with a
// trailing icon). leftIcon/rightIcon need real icon content — see the
// component doc comment about the missing icon system.
export const WithTrailingIcon: Story = {
  tags: ['ai-generated'],
  args: {
    variant: 'Secondary',
    size: 'S',
    state: 'Default',
    cta: 'Redo',
    showRightIcon: true,
    rightIcon: <span aria-hidden>↻</span>,
  },
}

// Loading + icons has no real-screen precedent anywhere in the Figma
// file (per its own component description, Loading has no real
// instance at all yet) — Figma's reference code shows icons staying
// visible alongside the spinner rather than hiding, so this pairing is
// built and screenshotted here before any real screen depends on it.
const placeholderIcon = (
  <span
    aria-hidden
    style={{
      display: 'block',
      width: '100%',
      height: '100%',
      borderRadius: '9999px',
      // A fixed, high-contrast fill — just to make the icon slot's
      // position visible in this demo story, not a real icon.
      background: 'var(--semantic-color-feedback-error-bold)',
    }}
  />
)

export const LoadingWithIcons: Story = {
  tags: ['ai-generated'],
  args: {
    variant: 'Primary',
    size: 'M',
    state: 'Loading',
    cta: 'Continue',
    showLeftIcon: true,
    leftIcon: placeholderIcon,
    showRightIcon: true,
    rightIcon: placeholderIcon,
  },
}
