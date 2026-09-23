import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TermResultList, type TermResultRow } from './TermResultList'

// Not a Figma component — hand-built directly on the real Summary
// instance, beneath its table rows. See TermResultList.tsx for the
// full list of gaps found while building this (the status-derived
// title, the rich-text bold/regular split), confirmed via the Desktop
// Bridge plugin, not assumed.
const FIGMA_DESCRIPTION = `Not a Figma component — the title + one-sentence explanation shown beneath \`table\` on the real Summary instance, one block per term.

**Gaps found building this (see TermResultList.tsx for full detail):**

- The title is derived from \`status\`, not free text: all four real titles ("Recalled on your own" / "Needed a hint" / "Revealed" / "Skipped") read as fixed per-status copy, never mentioning the term itself.
- The sentence is real rich text, not a flat string — confirmed via \`getStyledTextSegments\` since the node's own \`fontName\` reads as Figma's \`mixed\` symbol: the leading term name renders SemiBold, the rest Regular. Modeled as two props, \`term\` and \`reflection\`, so the split can't drift from the real content.
- The title's color is status-tinted (accent/green/bold, pro/bold, feedback/error/bold, text/secondary) per Mia's explicit call — a deliberate departure from the real instance, which binds plain text/primary on all four titles.
- \`run\` picks which title map (Mia, 2026-09-23). A review run only covers terms that already failed to come back on their own, so \`run=\"review\"\` titles the Recalled rows "Recalled on review" instead of "Recalled on your own". Figma has no review-run variant of this list.`

const meta = {
  title: 'Components/TermResultList',
  component: TermResultList,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: FIGMA_DESCRIPTION,
      },
    },
  },
} satisfies Meta<typeof TermResultList>

export default meta
type Story = StoryObj<typeof meta>

// The one real instance this component was extracted from — Figma's
// own default content, reproduced as this component's default rows.
const DEFAULT_ROWS: TermResultRow[] = [
  { term: 'Inspiration', status: 'Recalled', reflection: 'personal experience and the world around you.' },
  { term: 'Divergent thinking', status: 'Hinted', reflection: 'many possible ideas before narrowing to one.' },
  { term: 'Visual hierarchy', status: 'Revealed', reflection: 'arranging elements to guide attention and show what matters most.', note: "Answer shown after you said you didn't know it, worth a real attempt next time it comes up." },
  { term: 'Visual research', status: 'Skipped', reflection: 'uses visual media (images, video, diagrams) as data for research.', note: 'No attempt this time, worth a first pass before it comes up again.' },
]

export const Default: Story = {
  tags: ['ai-generated'],
  args: { rows: DEFAULT_ROWS },
}

export const SingleRow: Story = {
  tags: ['ai-generated'],
  args: { rows: [DEFAULT_ROWS[0]] },
}

// A review run covers only the terms that were missed, so its Recalled
// rows can't claim "Recalled on your own" — the student had already been
// hinted, shown the answer or skipped past each of them once. Same rows
// as the review Summary shows when every reviewed term comes back.
export const ReviewRun: Story = {
  tags: ['ai-generated'],
  args: {
    run: 'review',
    rows: [
      { term: 'Divergent thinking', status: 'Recalled', reflection: 'many possible ideas before narrowing to one.' },
      { term: 'Visual hierarchy', status: 'Recalled', reflection: 'arranging elements to guide attention and show what matters most.' },
      { term: 'Visual research', status: 'Recalled', reflection: 'uses visual media (images, video, diagrams) as data for research.' },
    ],
  },
}

// A review that itself ended with terms still missed: the other three
// titles read the same in a review as in a first run, only Recalled moves.
export const ReviewRunMixed: Story = {
  tags: ['ai-generated'],
  args: {
    run: 'review',
    rows: [
      { term: 'Divergent thinking', status: 'Recalled', reflection: 'many possible ideas before narrowing to one.' },
      { term: 'Visual hierarchy', status: 'Revealed', reflection: 'arranging elements to guide attention and show what matters most.', note: "Answer shown after you said you didn't know it, worth a real attempt next time it comes up." },
      { term: 'Visual research', status: 'Skipped', reflection: 'uses visual media (images, video, diagrams) as data for research.', note: 'No attempt this time, worth a first pass before it comes up again.' },
    ],
  },
}
