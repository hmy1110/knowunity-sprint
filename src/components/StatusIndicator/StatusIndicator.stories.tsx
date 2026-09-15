import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { StatusIndicator, type StatusIndicatorStatus } from './StatusIndicator'

// Figma's own component description, verbatim (node 13631:13525, "🎨
// Mascot & components" page, Yummy__Knowie Design System). Read this
// before using or changing the component — see StatusIndicator.tsx for
// the full text with paragraph breaks.
const FIGMA_DESCRIPTION = `**What it is:** 2-variant status readout (status=Recording/Ready), a colored 9x9 dot plus a matching-color text label, no boolean properties.

**When to use it:** The single source for this pattern across the file. It's live in 2 real screens: embedded inside micButton's own Recording state (paired with "Tap to stop"), and placed directly in Learning-ready to send, showing "Ready to send" above the Redo/Send buttons. Both usages are bound to feedback/error/bold and feedback/success/bold. Two older duplicate copies sit in Archive, superseded screen versions, not live ones.

**One thing to do:** Only Recording and Ready have a real-screen precedent. The mic capture pipeline logically has a transitional step between "done recording" and "ready to send" (something is being transcribed or processed), but no real instance shows this pattern used for that step, so a third variant wasn't added speculatively. Confirm whether that in-between state should live here as a third variant or stay as the separate pagination-dot animation already documented in app-inventory.md.

---

**Gaps found building this component** (flagged, not silently invented): the label's type style is a raw, unbound "Inter" Semi Bold 14px in Figma — \`get_variable_defs\` returns no font-family/weight/size/line-height variable for this node at all, only the two status colors. "Inter" doesn't exist anywhere in tokens.json (the system's only bound family is Greed VF-TRIAL); every other text layer across the six recall-loop components binds a named type-scale style, and this is the one label that doesn't. The 9px dot diameter and the 8px dot-to-label gap are unbound literals too, for the same reason — Figma's own reference code renders all three as plain numbers, never \`var(...)\`.

**Built ahead of a direct request for it:** MicButton's real Figma structure embeds a genuine statusIndicator instance for its Recording state rather than hand-building the dot+label inline — see MicButton's own doc comment for why building this component first, rather than duplicating its shape, was the right call per design-system.md §3.`

const meta = {
  title: 'Components/StatusIndicator',
  component: StatusIndicator,
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
      options: ['Recording', 'Ready'],
    },
  },
} satisfies Meta<typeof StatusIndicator>

export default meta
type Story = StoryObj<typeof meta>

// One story per Figma variant symbol ("status=X"), named to match.
function variantStory(status: StatusIndicatorStatus): Story {
  return {
    name: `status=${status}`,
    tags: ['ai-generated'],
    args: { status },
  }
}

export const Recording = variantStory('Recording')
export const Ready = variantStory('Ready')
