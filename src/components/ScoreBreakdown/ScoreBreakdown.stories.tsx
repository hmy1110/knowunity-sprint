import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ScoreBreakdown } from './ScoreBreakdown'

// Not a Figma component — hand-built directly on the real Summary
// instance, and literally named "segbar (custom, no matching
// component)" / "legend (custom, no matching component)" in Figma's
// own layer tree. See ScoreBreakdown.tsx for the full list of gaps
// found while building this, confirmed via the Desktop Bridge plugin,
// not assumed.
const FIGMA_DESCRIPTION = `Not a Figma component — Figma's own layer names read "segbar (custom, no matching component)" and "legend (custom, no matching component)."

**Gaps found building this (see ScoreBreakdown.tsx for full detail):**

- Bar segment and legend order matches Table's own good-to-bad sort (Recalled → Hinted → Revealed → Skipped), confirmed by each rectangle's real x position, not its position in the layer tree.
- \`percent\` is a caller-supplied prop, not derived from \`counts\` here. The one real instance (1 of each status) shows "50% recalled this session," which reads as (Recalled + Hinted) ÷ total — crediting a hinted success as still "recalled" — but that formula is inferred from a single data point, not confirmed anywhere in Figma.
- Colors are real bound variables that in several cases share a hex value with Tag's own colors but bind a different token (e.g. Recalled binds \`feedback/success/bold\` here, not Tag's \`accent/green/bold\`) — bound exactly as found on the real node, not assumed to match Tag.`

const meta = {
  title: 'Components/ScoreBreakdown',
  component: ScoreBreakdown,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: FIGMA_DESCRIPTION,
      },
    },
  },
} satisfies Meta<typeof ScoreBreakdown>

export default meta
type Story = StoryObj<typeof meta>

// The one real instance this component was extracted from.
export const Default: Story = {
  tags: ['ai-generated'],
  args: {
    percent: 50,
    counts: { Recalled: 1, Hinted: 1, Revealed: 1, Skipped: 1 },
  },
}

// Exercises the zero-count edge case the real instance never shows —
// untested in Figma, flagged rather than assumed to look right.
export const NoSkippedTerms: Story = {
  tags: ['ai-generated'],
  args: {
    percent: 75,
    counts: { Recalled: 2, Hinted: 1, Revealed: 1, Skipped: 0 },
  },
}

export const AllRecalled: Story = {
  tags: ['ai-generated'],
  args: {
    percent: 100,
    counts: { Recalled: 4, Hinted: 0, Revealed: 0, Skipped: 0 },
  },
}
