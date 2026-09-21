import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Table, type TableRow } from './Table'

// Figma's own component description (node 13719:15156, "🎨 Mascot &
// components" page, Yummy__Knowie Design System) is empty — nothing to
// quote verbatim. See Table.tsx for the full list of gaps found while
// building this (the single fixed-instance shape, and the divider gap
// it inherits from TableCell), confirmed via the Desktop Bridge plugin,
// not assumed.
const FIGMA_DESCRIPTION = `Figma's own component description is empty for this component — there's nothing here to quote.

**Gaps found building this (see Table.tsx for full detail):**

- Figma only models one fixed 4-row instance, not a repeater with a real row-count property. \`rows\` is exposed as a content-only override, defaulting to that one real instance's exact rows.
- Rows always display Recalled → Hinted → Revealed → Skipped (good to bad), regardless of input order — Mia's explicit call. Every row but the last gets a divider whatever its status (Mia's rule: the divider separates two cells, so it follows position, not status), so a Skipped row that isn't last keeps its divider and a last row that isn't Skipped has none.
- The outer frame's 16px corner radius is an unbound literal in Figma, though it numerically matches \`radius/400\`. Its fill, \`background/surface\`, is a real bound variable and is bound here too.`

const meta = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: FIGMA_DESCRIPTION,
      },
    },
  },
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

// The one real instance this component was extracted from — Figma's own
// default content, reproduced as this component's own default `rows`.
export const Default: Story = {
  tags: ['ai-generated'],
  args: {},
}

// Rows passed in the "wrong" order (Skipped first) still display
// good-to-bad, Skipped last — the sort order is enforced regardless of
// input order, per Mia's call.
const REORDERED_ROWS: TableRow[] = [
  { label: 'Visual research', status: 'Skipped' },
  { label: 'Inspiration', status: 'Recalled' },
  { label: 'Divergent thinking', status: 'Hinted' },
  { label: 'Visual hierarchy', status: 'Revealed' },
]

export const RowsPassedOutOfOrder: Story = {
  tags: ['ai-generated'],
  args: { rows: REORDERED_ROWS },
}

// With no Skipped row at all, this checks the last row (Revealed) still has no
// divider: Table only draws one between two rows, whatever their status.
const NO_SKIPPED_ROWS: TableRow[] = [
  { label: 'Inspiration', status: 'Recalled' },
  { label: 'Divergent thinking', status: 'Hinted' },
  { label: 'Visual hierarchy', status: 'Revealed' },
]

export const NoSkippedRow: Story = {
  tags: ['ai-generated'],
  args: { rows: NO_SKIPPED_ROWS },
}

// A shorter, two-row list — Figma only models the 4-row case, this
// exercises the content-only `rows` override at a different length.
const SHORT_ROWS: TableRow[] = [
  { label: 'Inspiration', status: 'Recalled' },
  { label: 'Visual research', status: 'Skipped' },
]

export const TwoRows: Story = {
  tags: ['ai-generated'],
  args: { rows: SHORT_ROWS },
}
