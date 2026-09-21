import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TableCell, type TableCellStatus } from './TableCell'

// Figma's own component-set description (node 13719:15194, "🎨 Mascot &
// components" page, Yummy__Knowie Design System) is empty — nothing to
// quote verbatim. See TableCell.tsx for the full list of gaps found
// while building this (the status/divider coupling, the unbound divider
// color, and the tokens.json drift on the label's own type style),
// confirmed via the Desktop Bridge plugin, not assumed.
const FIGMA_DESCRIPTION = `Figma's own component-set description is empty for this component — there's nothing here to quote.

**Gaps found building this (see TableCell.tsx for full detail):**

- Wraps this codebase's own \`Tag\` for the status pill rather than reimplementing it. \`label\` is a free-text override with no backing Figma property, the same class of gap TextField's own \`titleText\` flags.
- The bottom divider has no real Figma property; Figma bakes it per status (Skipped has none). Mia's rule (2026-09-21) is that it separates two cells, so it follows row position, not status: a \`tableCell\` has no divider of its own (a lone cell has nothing to separate from), the optional \`showDivider\` draws the bottom one, and \`Table\` sets it on every row but the last.
- The divider's own color is an unbound literal in Figma even though it numerically matches \`border/default\`. The label is bound to a real named style, "Greed/Body S Bold," used here in full — though the live Figma style (14px/20px/1px) and tokens.json's exported values for that same style (15px/20px/0.01em) disagree, a tokens.json source-data issue, not fixed here.`

const meta = {
  title: 'Components/TableCell',
  component: TableCell,
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
    label: { control: 'text' },
  },
} satisfies Meta<typeof TableCell>

export default meta
type Story = StoryObj<typeof meta>

// One story per Figma variant symbol ("status=X"), named to match, in
// the same order Figma's own componentPropertyDefinitions lists them —
// same pattern as Tag's own stories, since this wraps Tag's status set.
function variantStory(status: TableCellStatus, label: string): Story {
  return {
    name: `status=${status}`,
    tags: ['ai-generated'],
    args: { status, label },
  }
}

export const RecalledStatus = variantStory('Recalled', 'Inspiration')
export const HintedStatus = variantStory('Hinted', 'Divergent thinking')
export const RevealedStatus = variantStory('Revealed', 'Visual hierarchy')
export const SkippedStatus = variantStory('Skipped', 'Visual research')

export const WithDivider: Story = {
  tags: ['ai-generated'],
  args: { status: 'Recalled', label: 'Inspiration', showDivider: true },
}
