import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SpeechBubble, type SpeechBubbleState } from './SpeechBubble'

// Figma's own component description, verbatim (node 13628:13316, "🎨
// Mascot & components" page, Yummy__Knowie Design System). Read this
// before using or changing the component — see SpeechBubble.tsx for
// the full text with paragraph breaks.
const FIGMA_DESCRIPTION = `**What it is:** 6-state feedback bubble (Prompt/Success/Warning/Error/Loading/Input), an optional showSubtitle toggle, and a Header (icon + colored title + subtitle) above a message. Success/Warning/Error icon and title are bound to feedback/success/bold, text/warning, and feedback/error/bold respectively. Loading drops the Header and Message entirely for three animated dots bound to text/tertiary, used while Knowie is thinking. Input drops the Tail since it's not attached to a mascot avatar, it's the student's own typed message: real instances on Learning-typeResult-Recalled and Learning-typeProcessing, showing back what the student typed, not on Learning-typeInput itself, which is the entry field, not a result.

**When to use it:** Knowie's spoken/written response bubble in the recall loop, the thing a student reads after answering, plus the student's own typed-input shell (Input state). The tail+bubble shape is hand-built 11 times across live screens; this formalizes it as one component.

**One thing to do:** The Header's icon+title+subtitle structure duplicates what's built separately as inlineAlert, and their optional-text layers are named differently (Subtitle here, Descriptor there). Decide whether speechBubble's Success/Warning/Error headers should embed an inlineAlert instance instead of their own copy of the same pattern, since keeping both means every future header change has to be made twice.

---

**inlineAlert is explicitly NOT built or embedded here.** Figma's own description frames the Header/inlineAlert overlap as an open decision, not a confirmed real embedding — inlineAlert doesn't exist in this codebase yet either. This reproduces the Header as its own self-contained block, matching the live file's actual current structure.

**Reuses IconSlot** for the Header's icon (confirmed structurally: nested "iconSlot" instance at exactly \`icon/300\`). The icon+title color-pairing gap design-system.md's naming section describes as a past issue is already fixed in this live node — confirmed, not re-flagged.

**Gaps found building this component:** the bubble's 237px width, 16px padding/radius, every internal gap, the tail's dimensions, and the loading dots' size are all unbound literals. More notably: **the Header's title text has no bound type style at all**, not even an unnamed one — every other text run binds a real \`type-scale\` token (with a genuine Prompt/Warning/Input vs. Success/Error message-style split, reproduced exactly as bound), but the title renders as a bare 20px Bold with nothing to bind to, and CLAUDE.md forbids reading the \`font/*\` primitive layer directly even if one matched — so it's reproduced as Figma's own literal values instead.

**The tail pointer's positioning reproduces Figma's own mechanism exactly** — a container-query-sized box, rotated -90deg, with the pointer asymmetrically inset inside it (top 7.43%, right 10.39%, bottom 25%, left 10.39%), so it sits genuinely off-center rather than dead-centered. An earlier version simplified this to plain centering, which rendered visibly different from Figma; this matches pixel-for-pixel instead.

**The loading dots are static**, matching Figma's own frame exactly — nothing pulses, since Figma doesn't show that motion either.`

const meta = {
  title: 'Components/SpeechBubble',
  component: SpeechBubble,
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
      options: ['Prompt', 'Success', 'Warning', 'Error', 'Loading', 'Input'],
    },
    showSubtitle: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof SpeechBubble>

export default meta
type Story = StoryObj<typeof meta>

// One story per Figma variant symbol ("state=X"), named to match, in
// the same order Figma's own componentPropertyDefinitions lists them.
function variantStory(state: SpeechBubbleState): Story {
  return {
    name: `state=${state}`,
    tags: ['ai-generated'],
    args: { state },
  }
}

export const SuccessState = variantStory('Success')
export const WarningState = variantStory('Warning')
export const ErrorState = variantStory('Error')
export const LoadingState = variantStory('Loading')
export const InputState = variantStory('Input')
export const PromptState = variantStory('Prompt')

// showSubtitle=false, the boolean property's other value — Figma models
// this as a component property, not a separate named variant symbol
// (see Chips/MicButton/TextBlock for the same pattern), so this is an
// additional story rather than a renamed variant story.
export const SuccessSubtitleHidden: Story = {
  tags: ['ai-generated'],
  args: { state: 'Success', showSubtitle: false },
}
