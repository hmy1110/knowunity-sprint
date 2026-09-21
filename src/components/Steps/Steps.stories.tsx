import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent } from 'storybook/test'
import { Steps } from './Steps'

// No Figma component description exists for this one (node 13764:16058,
// "🎨 Mascot & components" page, Yummy__Knowie Design System) — it was
// added in the 2026-09-19 sync. See Steps.tsx for what was confirmed
// from the live node.
const DESCRIPTION = `**What it is:** the header row of a recall-loop screen: the term count ("Topics 1 of 4") on the left and a Tertiary/S "Skip" button on the right. 358px wide, 48px tall, no variant or boolean properties.

**Reuses Button** for Skip (Tertiary / S / Default, cta "Skip"). The count is a bound Caption M Bold in \`text/primary\`. Figma's text is a fixed string, so \`current\` and \`total\` set it here.

**Disabled Skip:** \`skipDisabled\` renders Skip in Button's Disabled state, used on every screen after an attempt has started.

**Gaps:** width is fixed at 358px in Figma and fills its column here.`

const meta = {
  title: 'Components/Steps',
  component: Steps,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: DESCRIPTION } },
  },
  argTypes: {
    current: { control: { type: 'number', min: 1, max: 4 } },
    total: { control: { type: 'number', min: 1, max: 8 } },
  },
  decorators: [
    (Story) => (
      // The 358px column Figma places it in: 390px screen, 16px each side.
      <div style={{ width: 358 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Steps>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  tags: ['ai-generated'],
  args: { current: 1, total: 4 },
}

export const SkipDisabled: Story = {
  tags: ['ai-generated'],
  args: { current: 2, total: 4, skipDisabled: true, onSkip: fn() },
  play: async ({ canvas, args }) => {
    const skip = canvas.getByRole('button', { name: 'Skip' })
    await expect(skip).toBeDisabled()
    await userEvent.click(skip)
    await expect(args.onSkip).not.toHaveBeenCalled()
  },
}

export const LastTopic: Story = {
  tags: ['ai-generated'],
  args: { current: 4, total: 4, onSkip: fn() },
  play: async ({ canvas, args }) => {
    await expect(canvas.getByText('Topics 4 of 4')).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Skip' }))
    await expect(args.onSkip).toHaveBeenCalledTimes(1)
  },
}
