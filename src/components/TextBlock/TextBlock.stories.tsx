import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TextBlock, type TextBlockVariant } from './TextBlock'

// Figma's own component description, verbatim (node 9003:9039, "🎨
// Mascot & components" page, Yummy__Knowie Design System). Read this
// before using or changing the component — see TextBlock.tsx for the
// full text with paragraph breaks.
const FIGMA_DESCRIPTION = `**What it is:** The simplest component in the file, one Header + one Caption text pair, structurally identical across all 4 size variants (XL/L/M/S). Only the type scale changes.

**When to use it:** No real usage exists anywhere, so this is inferred purely from structure and the brief. It's a plausible fit for short, static copy moments like the primer screen's headline ("Explain it to Knowie" plus its value-prop lines) or the summary screen's title ("Here's how it went").

**One thing to do:** This is inferred with no real usage to check it against. Before using it on the primer or summary screens, check whether their actual headline treatment (already built in the beta, e.g. "Amazing job!") matches any of the 4 textBlock sizes, so you're not fighting the system on your two highest-visibility screens.

---

**No token gaps found building this component** — unlike every other component built so far, every value here (all 7 text styles across the 4 sizes, plus both Header-to-Caption gaps) is a real bound token, confirmed via \`get_variable_defs\`.

**Two things resolved against the screenshot rather than the raw reference code:** Figma's design-to-code output puts \`text-center\` on the XL/L container, but the component's own screenshot shows every size left-aligned, XL and L included — the screenshot wins. It also puts a redundant container-level tracking utility on M/S, on top of the per-run letter-spacing each text style already sets — left out as vestigial.

**Letter-spacing:** XL/L headers bind directly to their type style's own \`letter-spacing\` var rather than reproducing the absolute pixel value Figma's reference code resolved that value to — see design-system.md rule #9 on why a percent-based tracking token shouldn't be copied as a fixed pixel number.`

const meta = {
  title: 'Components/TextBlock',
  component: TextBlock,
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
      options: ['XL', 'L', 'M', 'S'],
    },
    title: { control: 'text' },
    caption: { control: 'text' },
    showCaption: { control: 'boolean' },
  },
} satisfies Meta<typeof TextBlock>

export default meta
type Story = StoryObj<typeof meta>

// One story per Figma variant symbol ("variant=X"), named to match.
function variantStory(variant: TextBlockVariant): Story {
  return {
    name: `variant=${variant}`,
    tags: ['ai-generated'],
    args: { variant },
  }
}

export const XL = variantStory('XL')
export const L = variantStory('L')
export const M = variantStory('M')
export const S = variantStory('S')

// showCaption=false, the boolean property's other value — Figma models
// this as a component property, not a separate named variant symbol
// (see Chips' showLeftIcon/showRightIcon, MicButton's showLabel for the
// same pattern), so this is an additional story rather than a renamed
// variant story.
export const CaptionHidden: Story = {
  tags: ['ai-generated'],
  args: { variant: 'XL', showCaption: false },
}
