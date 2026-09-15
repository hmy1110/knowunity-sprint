import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { InlineAlert, type InlineAlertVariant } from './InlineAlert'

// Figma's own component description, verbatim (node 13628:13495, "🎨
// Mascot & components" page, Yummy__Knowie Design System). Read this
// before using or changing the component — see InlineAlert.tsx for the
// full text with paragraph breaks.
const FIGMA_DESCRIPTION = `**What it is:** 4-variant inline notice (Success/Warning/Error/Info), icon + title + optional descriptor (showDescriptor) in a single row, using real iconSlot instances rather than hand-drawn vectors.

**When to use it:** This is the "embedded in content" counterpart to snackbar's "floating at the bottom of the screen" notice, split out because they occupy different UI positions and shouldn't share one component. It was extracted from a repeated "Text section" pattern found inside speechBubble. Success and Warning have real precedent there; Error and Info do not yet.

**One thing to do:** Info falls back to text/secondary because the system has no dedicated info-semantic color token; confirm with whoever owns the tokens whether that's acceptable or whether a real info token should be added. Icons are check-circle (Success), alert-circle (Warning, key 13609:3292), x-circle (Error), and info-circle (Info), located by searching instance names rather than a documented icon list, since none of these keys were listed as candidates anywhere searchable.

---

**Reuses IconSlot** for the icon (confirmed structurally: nested "iconSlot" instance at exactly \`icon/300\`).

**This is the exact component speechBubble's own description names as a duplicate of its Header.** Built here as its own standalone, single-row component, matching this node's real (flat) structure — distinct from speechBubble's stacked layout. Whether speechBubble should be rebuilt to embed this instead of its own copy is still the open decision Figma's text frames it as, not resolved by building this component.

**Icon colors confirmed via \`get_variable_defs\`:** Success \`#00C386\` = \`feedback/success/bold\`; Warning \`#FCD34D\` = \`text/warning\`; Error \`#FF6B6B\` = \`feedback/error/bold\`; Info \`#F5F3FF @ 68%\` = \`text/secondary\` — confirming the documented Info fallback is real, both for its icon and title.

**Gaps found building this component:** the row's 4px gap is an unbound literal. The title text has no bound type style at all, not even an unnamed one (reproduced as Figma's own literal 20px Bold, since CLAUDE.md forbids reading the font/* primitive layer directly). The descriptor's "Inter" Regular 12px is the same unbound gap StatusIndicator's and SpeechBubble's own secondary text already have.`

const meta = {
  title: 'Components/InlineAlert',
  component: InlineAlert,
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
      options: ['Success', 'Warning', 'Error', 'Info'],
    },
    showDescriptor: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof InlineAlert>

export default meta
type Story = StoryObj<typeof meta>

// One story per Figma variant symbol ("variant=X"), named to match, in
// the same order Figma's own componentPropertyDefinitions lists them.
function variantStory(variant: InlineAlertVariant): Story {
  return {
    name: `variant=${variant}`,
    tags: ['ai-generated'],
    args: { variant },
  }
}

export const SuccessVariant = variantStory('Success')
export const WarningVariant = variantStory('Warning')
export const ErrorVariant = variantStory('Error')
export const InfoVariant = variantStory('Info')

// showDescriptor=false, the boolean property's other value — Figma
// models this as a component property, not a separate named variant
// symbol (see Chips/MicButton/TextBlock/SpeechBubble for the same
// pattern), so this is an additional story rather than a renamed
// variant story.
export const SuccessDescriptorHidden: Story = {
  tags: ['ai-generated'],
  args: { variant: 'Success', showDescriptor: false },
}
