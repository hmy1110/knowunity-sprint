import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Chips, type ChipsColor, type ChipsSize } from './Chips'

// Figma's own component description, verbatim (node 9003:8679, "🎨 Mascot
// & components" page, Yummy__Knowie Design System). Read this before
// using or changing the component — see Chips.tsx for the full text
// with paragraph breaks.
const FIGMA_DESCRIPTION = `**What it is:** 16-variant pill (size XXS-M, color Primary/pro, active True/False) with an icon slot on each side of the text label, both present in the structure regardless of the icon toggles' defaults.

**When to use it:** Real screens use chips constantly, as topic/category tags (the "PRACTICE ROUND" pill), as tool pickers (the Tools sheet's "Coach Me/Solve It/Lock In" and "Quiz me/Create flashcards" rows), and as status tags ("PRO," "Built by students" in AI chat).

**One thing to do:** The color property only offers Primary/pro. The summary screen's per-term status labels use a separate tag component instead (Recalled/Hinted/Revealed/Skipped, see that component's own description), because chips' fixed dual-icon-slot, size-XXS-to-M shape doesn't fit a single-purpose status label. The Info/Success/Error gap stays open for any future screen that needs a genuinely semantic-colored chip rather than a status tag.

---

**Gaps found building this component** (flagged, not silently invented): the XXS/XS/S/M heights (20/24/32/40px), and the matching \`min-width\` per size, are hardcoded literal pixel values in Figma with no bound variable behind them — reproduced here as literal exceptions, the same way Button and ButtonIcon handle their own untokenized sizes. There's no icon system in this codebase, so \`leftIcon\`/\`rightIcon\` take real icon content from the caller — Figma's own icon here is a generic placeholder ("square"), not a real designed glyph.

**Confirmed from Figma's own reference code:** \`color\` only matters while \`active\` is true — an inactive Primary chip and an inactive pro chip render identically. Reproduced exactly as bound, not "fixed" to differentiate colors the design doesn't actually differentiate.`

// A generic outlined-square placeholder — matching Figma's own icon
// here, which is literally a "square, shape" placeholder component, not
// a real designed glyph (see the component doc comment). Outlined
// rather than filled so the outer icon slot's own box is what's visible
// (useful at M, where the slot is a size larger than the icon inside
// it — see Chips.tsx). Given as the default icon content so the 16
// variant stories below actually show the icon slots Figma's real
// symbols show by default, instead of silently rendering text-only
// because no caller ever passed an icon.
const placeholderIcon = (
  <span
    aria-hidden
    style={{ display: 'block', width: '100%', height: '100%', border: '1.5px solid currentColor', boxSizing: 'border-box' }}
  />
)

const meta = {
  title: 'Components/Chips',
  component: Chips,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: FIGMA_DESCRIPTION,
      },
    },
  },
  argTypes: {
    size: {
      control: 'radio',
      options: ['XXS', 'XS', 'S', 'M'],
    },
    color: {
      control: 'radio',
      options: ['Primary', 'pro'],
    },
    active: { control: 'boolean' },
    text: { control: 'text' },
  },
  args: {
    text: 'Topic',
    leftIcon: placeholderIcon,
    rightIcon: placeholderIcon,
  },
} satisfies Meta<typeof Chips>

export default meta
type Story = StoryObj<typeof meta>

// One story per Figma variant symbol ("size=X, color=Y, active=Z"),
// named to match. All 16 combinations, in the same order Figma lists
// them (size XXS/XS/S/M x color Primary/pro x active False/True).
function variantStory(size: ChipsSize, color: ChipsColor, active: boolean): Story {
  return {
    name: `size=${size}, color=${color}, active=${active ? 'True' : 'False'}`,
    tags: ['ai-generated'],
    args: { size, color, active },
  }
}

// Primary
export const XxsPrimaryFalse = variantStory('XXS', 'Primary', false)
export const XxsPrimaryTrue = variantStory('XXS', 'Primary', true)
export const XsPrimaryFalse = variantStory('XS', 'Primary', false)
export const XsPrimaryTrue = variantStory('XS', 'Primary', true)
export const SPrimaryFalse = variantStory('S', 'Primary', false)
export const SPrimaryTrue = variantStory('S', 'Primary', true)
export const MPrimaryFalse = variantStory('M', 'Primary', false)
export const MPrimaryTrue = variantStory('M', 'Primary', true)

// pro
export const XxsProFalse = variantStory('XXS', 'pro', false)
export const XxsProTrue = variantStory('XXS', 'pro', true)
export const XsProFalse = variantStory('XS', 'pro', false)
export const XsProTrue = variantStory('XS', 'pro', true)
export const SProFalse = variantStory('S', 'pro', false)
export const SProTrue = variantStory('S', 'pro', true)
export const MProFalse = variantStory('M', 'pro', false)
export const MProTrue = variantStory('M', 'pro', true)

// Real-screen usage per the Figma description's own examples.
export const PracticeRoundTag: Story = {
  tags: ['ai-generated'],
  args: {
    size: 'S',
    color: 'Primary',
    active: false,
    text: 'Practice round',
    showLeftIcon: false,
    showRightIcon: false,
  },
}

export const ProStatusTag: Story = {
  tags: ['ai-generated'],
  args: {
    size: 'XXS',
    color: 'pro',
    active: true,
    text: 'Pro',
    showLeftIcon: false,
    showRightIcon: false,
  },
}
