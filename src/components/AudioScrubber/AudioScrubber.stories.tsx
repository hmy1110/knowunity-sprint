import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { AudioScrubber, type AudioScrubberState } from './AudioScrubber'

// Figma's own component description, verbatim (node 13628:12922, "🎨
// Mascot & components" page, Yummy__Knowie Design System). Read this
// before using or changing the component — see AudioScrubber.tsx for
// the full text with paragraph breaks.
const FIGMA_DESCRIPTION = `**What it is:** 2-state playback control (Default/Playing) with an icon-only swap, no boolean properties.

**When to use it:** This backs "listen once more before deciding," the ability to replay a recorded answer before submitting it, and general audio playback anywhere the loop needs it. Real instances cover every screen with an attempt to play back: Learning-ready to send, Learning-processing, Learning-result-Recalled, Learning-result-Hinted1, Learning-result-Hinted2 (two, one per hint attempt), and Learning-result-I don't know. Learning-idle has none, since nothing's been recorded yet at that point.

**One thing to do:** Every screen above uses a real audioScrubber instance, so fixes to the component propagate everywhere rather than needing to be found and patched screen by screen. All 7 of those instances sit in Default, though: Playing has no real-screen instance anywhere, so what playback looks like mid-scrub is untested. Place one and screenshot it before a screen depends on it.

---

**No \`icon\` prop.** "Icon-only swap" describes swapping between this component's own two fixed states (play triangle / pause bars), not a caller-configurable slot — the icon area is a bespoke "Play Button" layer with two hardcoded renders, not an \`iconSlot\` instance like AppBar's icon buttons are. Both traced inline with Figma's hardcoded fill color swapped for \`currentColor\`, tinted via \`interactive/primary\`.

**Almost nothing here is a bound token.** \`get_variable_defs\` returns exactly two entries for the whole component — \`interactive/primary\` and \`background/input\` — confirmed, not assumed. Everything else (the 40px pill radius, 16px/4px padding, the fixed 44px height, the 24×24 icon box, the pause bars' exact size/position, every waveform bar's width/gap/corner-radius, and all 38 individual bar heights + opacities) is an unbound literal, reproduced as Figma's own static illustration rather than silently bound to a same-numbered token or invented as live audio data — this sprint has no real audio to visualize.

**Playing has zero real-screen instance anywhere**, per Figma's own description — built and screenshotted here per CLAUDE.md's "never ship an untested state pairing without screenshotting it first."`

const meta = {
  title: 'Components/AudioScrubber',
  component: AudioScrubber,
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
      options: ['Default', 'Playing'],
    },
  },
} satisfies Meta<typeof AudioScrubber>

export default meta
type Story = StoryObj<typeof meta>

// One story per Figma variant symbol ("state=X"), named to match.
function variantStory(state: AudioScrubberState): Story {
  return {
    name: `state=${state}`,
    tags: ['ai-generated'],
    args: { state },
  }
}

export const Default = variantStory('Default')
// Untested in Figma itself — no real-screen instance exists anywhere
// for Playing (see the component doc comment's "one thing to do").
export const Playing = variantStory('Playing')
