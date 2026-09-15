import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { MascotSlot, type MascotSlotPose, type MascotSlotSize } from './MascotSlot'

// Figma's own component description, verbatim (node 9003:8873, "🎨
// Mascot & components" page, Yummy__Knowie Design System). Read this
// before using or changing the component — see MascotSlot.tsx for the
// full text with paragraph breaks.
const FIGMA_DESCRIPTION = `**What it is:** 4-size wrapper (XL/2XL/3XL/4XL) around Knowie's animated emotional-state instance, swapping between "standby" and "approving" in real usage, at sizes 2XL and 3XL respectively.

**When to use it:** The hero mascot component for the feature: 2XL/standby on the study plan card (StudyPlan-notStarted, StudyPlan-inProgress, StudyPlan-finish) and 3XL/approving on every Learning-* screen, idle through result.

**One thing to do:** A third pose, "thinking," is in real use on Learning-processing and Learning-typeProcessing for the wait state, but isn't in the Homie swap's preferred-values list on .mascotSlotBase, so both screens place it as a bare 70x70 instance outside mascotSlot entirely rather than through the size+pose pattern every other screen uses. Add it to the preferred list so the wait state can use the real component like everything else, or confirm the gap is intentional. 4XL and XL have zero real usage.

---

**\`size\` is mascotSlot's only real Figma variant** (confirmed from the live node's own \`componentPropertyDefinitions\`). Pose comes from a separate, deeper Homie instance-swap property nested inside each size variant, not a top-level "size=X, pose=Y" symbol pattern.

**A real gap:** the Homie property's 16 preferred values all reference a library this Figma session can't resolve (\`importComponentByKeyAsync\` fails on all 16). Built against this project's own \`public/images/*.svg\` instead (CLAUDE.md's designated source for Knowie expressions) — 7 real local files, not invented art, but not independently confirmed as the same 7 (of 16) Figma poses under the same names.

**\`pose="thinking"\` is a judgment call, not a silent decision:** Figma's own description says "thinking" isn't in the preferred-values list — real screens bypass mascotSlot for it entirely. Exposed here anyway since the art exists and the description's own "one thing to do" suggests adding it; if the gap is meant to stay open, this should come back out.`

const meta = {
  title: 'Components/MascotSlot',
  component: MascotSlot,
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
      options: ['XL', '2XL', '3XL', '4XL'],
    },
    pose: {
      control: 'radio',
      options: ['standby', 'approving', 'thinking', 'amazed', 'confused', 'dazed', 'determined'],
    },
  },
} satisfies Meta<typeof MascotSlot>

export default meta
type Story = StoryObj<typeof meta>

// One story per Figma variant symbol ("size=X"), named to match. Pose
// isn't a named Figma symbol (see doc comment), so these all use the
// default pose — the same "standby" the live document's own default
// instance is set to.
function variantStory(size: MascotSlotSize): Story {
  return {
    name: `size=${size}`,
    tags: ['ai-generated'],
    args: { size },
  }
}

export const XL = variantStory('XL')
export const TwoXL = variantStory('2XL')
export const ThreeXL = variantStory('3XL')
export const FourXL = variantStory('4XL')

// The two real-screen size+pose pairings Figma's own description names
// — not named variant symbols, so these are separate stories rather
// than renamed variant stories.
export const RealUsageStudyPlanCard: Story = {
  tags: ['ai-generated'],
  args: { size: '2XL', pose: 'standby' },
}
export const RealUsageLearningScreens: Story = {
  tags: ['ai-generated'],
  args: { size: '3XL', pose: 'approving' },
}

// One story per pose option, at 3XL so each expression reads clearly —
// per CLAUDE.md, never shipping an untested state pairing without
// screenshotting it first, and pose is a real prop even though it
// isn't a named Figma variant.
function poseStory(pose: MascotSlotPose): Story {
  return {
    name: `pose=${pose}`,
    tags: ['ai-generated'],
    args: { size: '3XL', pose },
  }
}

export const PoseStandby = poseStory('standby')
export const PoseApproving = poseStory('approving')
export const PoseThinking = poseStory('thinking')
export const PoseAmazed = poseStory('amazed')
export const PoseConfused = poseStory('confused')
export const PoseDazed = poseStory('dazed')
export const PoseDetermined = poseStory('determined')
