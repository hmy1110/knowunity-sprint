import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { StatusBar } from './StatusBar'

const meta = {
  title: 'Components/StatusBar',
  component: StatusBar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Not a Figma component — every real screen frame draws this iOS status-bar mock (09:41 clock, wifi, cellular, battery) as its own top strip. Built inline for Summary first, then promoted here once Primer-intro needed the identical row. See the component doc comment for token sourcing.',
      },
    },
    backgrounds: { default: 'dark' },
  },
} satisfies Meta<typeof StatusBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
