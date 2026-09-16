import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TextField, type TextFieldVariant } from './TextField'

// Figma's own component description (node 4517:2132, "🎨 Mascot &
// components" page, Yummy__Knowie Design System) is empty — nothing to
// quote verbatim. See TextField.tsx for the full list of gaps found
// while building this (stray duplicate variable bindings, unbuilt
// sub-components substituted with the closest existing ones, and
// unbound/untokenized typography), confirmed via the Desktop Bridge
// plugin, not assumed.
const FIGMA_DESCRIPTION = `Figma's own component-set description is empty for this component — there's nothing here to quote.

**Gaps found building this (see TextField.tsx for full detail):**

- The leading icon reuses this codebase's \`IconSlot\`; the trailing icon reuses \`ButtonIcon\` (\`variant="Secondary" size="S"\`) as the closest built analog. Neither matches Figma's own undocumented, unbuilt wrapper components ("Icon Slot" and "Button icon", both Title Case, both with a different variant axis) — substituted per Mia's call.
- The field's fill and the Error variant's border/caption color are each bound to a stray duplicate Figma variable, not the canonical one that's actually exported to tokens.json. The canonical tokens (\`background/input\`, \`border/error\`, \`text/error\`) are used here instead — same values, correct bindings.
- No text in this component is bound to a Figma text style; font family, and both text sizes (14px, 11px), match no token. \`headline.xxsBold\` and \`caption.sRegular\` are used as the closest existing approximation, per Mia's call — not a Figma match.`

const meta = {
  title: 'Components/TextField',
  component: TextField,
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
      options: ['Default', 'Error', 'Placeholder'],
    },
    showTitle: { control: 'boolean' },
    showCaption: { control: 'boolean' },
    showLeadingIcon: { control: 'boolean' },
    showTrailingIcon: { control: 'boolean' },
  },
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

// One story per Figma variant symbol ("Variant=X"), named to match, in
// the same order Figma's own componentPropertyDefinitions lists them.
function variantStory(variant: TextFieldVariant): Story {
  return {
    name: `Variant=${variant}`,
    tags: ['ai-generated'],
    args: { variant },
  }
}

export const DefaultVariant = variantStory('Default')
export const ErrorVariant = variantStory('Error')
export const PlaceholderVariant = variantStory('Placeholder')

// Each boolean property's other value — Figma models these as component
// properties, not separate named variant symbols (see InlineAlert for
// the same pattern), so these are additional stories rather than
// renamed variant stories.
export const TitleHidden: Story = {
  tags: ['ai-generated'],
  args: { variant: 'Default', showTitle: false },
}

export const CaptionShown: Story = {
  tags: ['ai-generated'],
  args: { variant: 'Default', showCaption: true },
}

export const ErrorCaptionShown: Story = {
  tags: ['ai-generated'],
  args: { variant: 'Error', showCaption: true },
}

export const LeadingIconHidden: Story = {
  tags: ['ai-generated'],
  args: { variant: 'Default', showLeadingIcon: false },
}

export const TrailingIconShown: Story = {
  tags: ['ai-generated'],
  args: { variant: 'Default', showTrailingIcon: true },
}
