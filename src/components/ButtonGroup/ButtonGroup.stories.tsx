import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ButtonGroup } from './ButtonGroup'

// Figma's own component description, verbatim (node 9003:8455, "🎨 Mascot
// & components" page, Yummy__Knowie Design System). Read this before
// using or changing the component — see ButtonGroup.tsx for the full
// text with paragraph breaks.
const FIGMA_DESCRIPTION = `**What it is:** A fixed two-slot pairing, not a generic repeater. Vertical pairs button(Primary) + button(Secondary); Horizontal pairs buttonIcon(Secondary) + button(Primary).

**When to use it:** The one real example is Horizontal, in a quiz answer-feedback row (icon action next to a confirm button), similar in spirit to the thumbs-up/down plus "Why?"/"Continue" row on the quiz correct-answer sheet. Vertical has no real example; it reads as the right shape for a stacked "Try again"/"Continue" pair on the recall summary screen.

**One thing to do:** Because it's a fixed two-slot pairing and not a repeater, don't stretch it to hold three or more actions, like a multi-step hint ladder. If the loop ever needs more than two grouped actions, treat that as a new component question, not a reason to force this one.

---

**Built from what already exists, not redrawn:** Figma's own reference code for this component literally re-draws Button's and ButtonIcon's internals a second time as duplicate markup. This component instead composes the real Button and ButtonIcon already in this project — a Button+Button pair for Vertical, a ButtonIcon+Button pair for Horizontal — so any future fix to either one applies here too instead of needing to be patched a third place.

**Gap found, not silently invented:** Figma's own frame for every buttonGroup variant is a literal, hardcoded 319px wide, bound to no token. That reads as the "Overview" documentation page's own swatch-frame layout, not a real screen width — real usage (a quiz answer row, the recall summary screen) is full-bleed inside the scaffold's content slot. Built here as \`width: 100%\` instead of reproducing a number that looks like a documentation artifact.`

const meta = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: FIGMA_DESCRIPTION,
      },
    },
  },
} satisfies Meta<typeof ButtonGroup>

export default meta
type Story = StoryObj<typeof meta>

const checkIcon = (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
    <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// The four Figma variant symbols ("variant=X, size=Y"), named to match,
// in the same order Figma lists them.

// Per design-system.md: Vertical has no real-screen example yet, but
// reads as the right shape for a stacked "Try again"/"Continue" pair on
// the recall summary screen — used as the example content here.
export const VerticalM: Story = {
  name: 'variant=Vertical, size=M',
  tags: ['ai-generated'],
  args: {
    variant: 'Vertical',
    size: 'M',
    primary: { cta: 'Continue' },
    secondary: { cta: 'Try again' },
  },
}

// Per design-system.md: Horizontal is the one variant with a real
// example — a quiz answer-feedback row (icon action next to a confirm
// button).
export const HorizontalM: Story = {
  name: 'variant=Horizontal, size=M',
  tags: ['ai-generated'],
  args: {
    variant: 'Horizontal',
    size: 'M',
    icon: { icon: checkIcon, label: 'Mark as helpful' },
    primary: { cta: 'Continue' },
  },
}

export const VerticalL: Story = {
  name: 'variant=Vertical, size=L',
  tags: ['ai-generated'],
  args: {
    variant: 'Vertical',
    size: 'L',
    primary: { cta: 'Continue' },
    secondary: { cta: 'Try again' },
  },
}

export const HorizontalL: Story = {
  name: 'variant=Horizontal, size=L',
  tags: ['ai-generated'],
  args: {
    variant: 'Horizontal',
    size: 'L',
    icon: { icon: checkIcon, label: 'Mark as helpful' },
    primary: { cta: 'Continue' },
  },
}
