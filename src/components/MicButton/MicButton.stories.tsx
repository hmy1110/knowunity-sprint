import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { MicButton, type MicButtonState } from './MicButton'

// Figma's own component description, verbatim (node 13628:12744, "🎨
// Mascot & components" page, Yummy__Knowie Design System). Read this
// before using or changing the component — see MicButton.tsx for the
// full text with paragraph breaks.
const FIGMA_DESCRIPTION = `**What it is:** 4-state control (Idle/Pressed/Recording/Processing) built around Mia's new mic icon, with an optional showLabel toggle for a caption under the icon. The Recording state embeds a real statusIndicator instance (paired with a "Tap to stop" caption) instead of a hand-built status row.

**When to use it:** The tap-to-speak trigger for the voice active-recall loop, the moment a student starts and stops answering a term out loud. Real instances now cover three of its four states: Idle on Learning-idle and Learning-result-Hinted1, Recording on Learning-recording, and Processing on Learning-processing. Pressed is the only state with no real-screen instance; the explain-out-loud beta screens hand-build a large circular mic affordance, but at a size and interaction model not confirmed to match this component.

**One thing to do:** Confirm the intended interaction (tap-to-toggle vs. hold-to-record) before wiring transitions, since that decides what Pressed leads into, and check Processing's timing against actual speech-to-text latency. Pressed is the one state left without a real instance to check against, so design and screenshot it explicitly rather than assuming the press reads.

---

**Not resolved here:** the tap-to-toggle vs. hold-to-record interaction model above. This component is purely presentational — \`state\` is fully controlled by the caller, standard button props pass through, and no recording/timer logic is invented. That decision is Mia's call.

**Reuses StatusIndicator** (../StatusIndicator/StatusIndicator.tsx) for the Recording state's dot+"Recording…" row, a real embedded instance rather than a hand-built copy — see that component's own doc comment.

**No \`icon\` prop.** Unlike ButtonIcon/Chips/IconSlot, Figma's own micButton has no instance-swap icon property — the mic glyph is fixed content baked into the component, traced from Figma's two exported SVGs and recolored via \`currentColor\` onto the same semantic tokens each state already uses (confirmed by comparing the raw export's hardcoded colors against tokens.css, not assumed).

**Gaps found building this component** (flagged, not silently invented, confirmed via \`get_variable_defs\` on the real node): the 56px circle diameter, the 26px icon size, the outer stack's gap (8px / 16px for Recording), and every waveform-bar dimension (2px width, 3px gap, 2px corner radius) are unbound literals with no token behind them — the waveform's padding (space/600 + space/200) and radius (radius/Full) genuinely are bound, and are reproduced as such. The waveform's 12 bar heights are a static snapshot straight from Figma's own frame, not a live audio visualization — this sprint has no real audio to visualize.

**One deliberate simplification:** Figma's Pressed fill is two stacked opaque gradients where the top layer (\`interactive/primaryActive\`) fully occludes the bottom (\`interactive/primary\`) — rendered here as a single solid fill of the visible color, not a redundant two-layer stack. Both tokens are genuinely bound; only the paint stacking is simplified.`

const meta = {
  title: 'Components/MicButton',
  component: MicButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: FIGMA_DESCRIPTION,
      },
    },
  },
  argTypes: {
    state: {
      control: 'radio',
      options: ['Idle', 'Pressed', 'Processing', 'Recording'],
    },
    showLabel: {
      control: 'boolean',
    },
    label: {
      control: 'text',
    },
  },
} satisfies Meta<typeof MicButton>

export default meta
type Story = StoryObj<typeof meta>

// One story per Figma variant symbol ("state=X"), named to match.
function variantStory(state: MicButtonState): Story {
  return {
    name: `state=${state}`,
    tags: ['ai-generated'],
    args: { state },
  }
}

export const Idle = variantStory('Idle')
// Untested in Figma itself — no real-screen instance exists anywhere
// for Pressed (see the component doc comment's "One thing to do").
// Built and screenshotted here per CLAUDE.md's "never ship an untested
// state pairing without screenshotting it first," not skipped because
// the real file has nothing to check it against.
export const Pressed = variantStory('Pressed')
export const Processing = variantStory('Processing')
export const Recording = variantStory('Recording')

// showLabel=false, the boolean property's other value — Figma models
// this as a component property, not a separate named variant symbol
// (see Chips' own showLeftIcon/showRightIcon for the same pattern), so
// these are additional stories rather than renamed variant stories.
export const IdleLabelHidden: Story = {
  tags: ['ai-generated'],
  args: { state: 'Idle', showLabel: false },
}
export const ProcessingLabelHidden: Story = {
  tags: ['ai-generated'],
  args: { state: 'Processing', showLabel: false },
}

// Real instance: Learning-result-Hinted1's own Idle mic button reads
// "Try again," not the default "Tap to speak" — a re-attempt entry
// point, not a first attempt. `label` overrides the state's default
// caption for exactly this case.
export const IdleTryAgain: Story = {
  tags: ['ai-generated'],
  args: { state: 'Idle', label: 'Try again' },
}
