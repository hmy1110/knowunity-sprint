import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Tag, type TagStatus } from './Tag'

// Figma's own component description, verbatim (node 13628:13515, "🎨
// Mascot & components" page, Yummy__Knowie Design System). Read this
// before using or changing the component — see Tag.tsx for the full
// text with paragraph breaks.
const FIGMA_DESCRIPTION = `**What it is:** 4-variant status pill (Recalled/Hinted/Revealed/Skipped), a single text label with no icon.

**When to use it:** The per-term result label on the summary screen after a recall session. It's a standalone component, not an extension of chips: chips is a 16-variant primitive (size XXS-M, color Primary/pro, mandatory dual icon slots, fontSize8) built for a different job, tags and tool pickers, and is structurally too different to bend into this shape.

**One thing to do:** Hinted uses pro/bold + pro/onBold, not a warning token, because the system has no feedback/warning/bold+onBold family, only a lone text/warning scalar. That's a real gap worth filling. Revealed has real instances on the Summary screen (both the mixed and all-recalled variants), matching the Learning-result-Revealed and Learning-result-I don't know screens' own speechBubble Error state.

---

**Not built from Chips** — Figma's own description explicitly rules that out. No \`text\` prop either: unlike Chips, this component exposes no label-text property in Figma, and the visible label is always exactly the status word itself.

**Confirmed via \`get_variable_defs\`:** Recalled binds \`accent/green/bold\`, not \`feedback/success/bold\` — the two share a literal hex value but are different tokens, and the bound one is reproduced here. Hinted binds \`pro/bold\` + \`pro/onBold\`, exactly the gap the description names. Revealed binds \`feedback/error/bold\` + \`feedback/error/on-bold\` — updated in Figma from an earlier subtle-fill/bold-text pairing to match the bold-fill pattern the other three statuses already use. Skipped binds \`background/stacking\` + \`text/secondary\` — also updated in Figma, from an earlier \`text/disabled\` pairing that failed WCAG AA contrast (3.69:1 against the required 4.5:1, caught by an axe-core sweep of every story).

**Every dimension and the label's type style are unbound literals** — \`get_variable_defs\` returns only the 8 color entries for this whole node, nothing else. The 32px radius and 12px/4px padding happen to numerically match real tokens (radius/800, space/300, space/100) but Figma's own reference code renders them as bare numbers, never \`var(...)\`, so none are bound here either. The label has no bound type style at all, not even an unnamed one — reproduced as Figma's own literal values (Greed SemiBold 12px, no letter-spacing at all, genuinely different from most other text built so far).`

const meta = {
  title: 'Components/Tag',
  component: Tag,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: FIGMA_DESCRIPTION,
      },
    },
  },
  argTypes: {
    status: {
      control: 'radio',
      options: ['Recalled', 'Hinted', 'Revealed', 'Skipped'],
    },
  },
} satisfies Meta<typeof Tag>

export default meta
type Story = StoryObj<typeof meta>

// One story per Figma variant symbol ("status=X"), named to match, in
// the same order Figma's own componentPropertyDefinitions lists them.
function variantStory(status: TagStatus): Story {
  return {
    name: `status=${status}`,
    tags: ['ai-generated'],
    args: { status },
  }
}

export const RecalledStatus = variantStory('Recalled')
export const HintedStatus = variantStory('Hinted')
export const RevealedStatus = variantStory('Revealed')
export const SkippedStatus = variantStory('Skipped')
