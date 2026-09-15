import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { IconSlot, type IconSlotSize } from './IconSlot'

// Figma's own component description, verbatim (node 9003:8809, "🎨 Mascot
// & components" page, Yummy__Knowie Design System). Read this before
// using or changing the component — see IconSlot.tsx for the full text
// with paragraph breaks.
const FIGMA_DESCRIPTION = `**What it is:** The most-used primitive in the file (165 instances elsewhere), a wrapper around a swappable icon with 6 size steps. It ships with a generic "square" placeholder that real usage always swaps for an actual icon.

**When to use it:** It nests inside almost everything else on this list (button, buttonIcon, chips, snackbar, appBar), so you'll touch it constantly just by using those. In the loop it's the info-circle/check-circle/alert-circle icon for result cards and hint/reveal affordances.

**One thing to do:** The size property is literally named "Size (IGNORE)," which reads as a marked-for-cleanup flag, and size 100 has zero real usage anywhere. Ask whoever owns the design system whether this means sizes are being consolidated before you build new instances at a size that might get deleted.

---

**Two prop names renamed from Figma, flagged rather than reproduced literally:** Figma's size property is literally named \`Size (IGNORE)\` — not a valid identifier, and Figma's own description above calls it a marked-for-cleanup flag; named \`size\` here instead. Figma's icon-swap property is named \`instance\` — the generic name Figma gives every instance-swap property, not vocabulary specific to this component; named \`icon\` here to match Button, ButtonIcon, and Chips.

**Built from what already exists, in both directions:** this is the primitive Button, ButtonIcon, and Chips already reimplement inline (each kept its own size→token lookup because this component didn't exist yet). They've since been refactored to render through this component instead, so the size scale now lives in exactly one place.

No icon system exists in this codebase, so \`icon\` takes real content from the caller and renders nothing if omitted — Figma's own icon here is a generic placeholder ("square"), and its own description says real usage always swaps it for an actual icon anyway.`

const meta = {
  title: 'Components/IconSlot',
  component: IconSlot,
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
      options: ['100', '150', '200', '250', '300', '400'],
    },
  },
  args: {
    // A generic outlined-square placeholder — matching Figma's own icon
    // here (see the component doc comment), outlined rather than filled
    // so the slot's own box stays visible around it.
    icon: (
      <span
        aria-hidden
        style={{ display: 'block', width: '100%', height: '100%', border: '1.5px solid currentColor', boxSizing: 'border-box', color: 'var(--semantic-color-text-primary)' }}
      />
    ),
  },
} satisfies Meta<typeof IconSlot>

export default meta
type Story = StoryObj<typeof meta>

// One story per Figma variant symbol, named the way Figma names them
// ("Size (IGNORE)=X") even though the prop itself is named `size` (see
// the component doc comment) — so anyone cross-referencing Figma finds
// the same labels here.
function variantStory(size: IconSlotSize): Story {
  return {
    name: `Size (IGNORE)=${size}`,
    tags: ['ai-generated'],
    args: { size },
  }
}

export const Size400 = variantStory('400')
export const Size300 = variantStory('300')
export const Size250 = variantStory('250')
export const Size200 = variantStory('200')
export const Size150 = variantStory('150')
// Zero real usage anywhere in the file per Figma's own description —
// built and shown here since the size option exists, but see the
// component doc comment before relying on it.
export const Size100 = variantStory('100')
