import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { radiusSteps, type SizeToken } from './tokenData'
import { FoundationsPage, PageIntro, TokenCaption } from './FoundationsUI'

function RadiusBox({ token }: { token: SizeToken }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="h-24 w-24"
        style={{
          borderRadius: `var(${token.cssVar})`,
          background: 'var(--semantic-color-background-surface)',
          border: '1px solid var(--semantic-color-border-default)',
        }}
      />
      <TokenCaption name={token.name} value={`${token.valuePx}px`} description={token.description} />
    </div>
  )
}

function RadiusPage() {
  return (
    <FoundationsPage>
      <PageIntro title="Radius">
        Every step in tokens/tokens.json&apos;s size.radius scale, applied to
        an identical box so only the corner rounding changes between them.
        radius/Full (9999px) is large enough that CSS clamps it to a full
        pill on any box this size — that&apos;s the token working correctly,
        not a rendering error.
      </PageIntro>
      <div className="flex flex-wrap gap-8">
        {radiusSteps.map((token) => (
          <RadiusBox key={token.name} token={token} />
        ))}
      </div>
    </FoundationsPage>
  )
}

const meta = {
  title: 'Foundations/Radius',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  globals: {
    viewport: { value: '100pct-100pct', isRotated: false },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const RadiusScale: Story = {
  tags: ['ai-generated'],
  render: () => <RadiusPage />,
}
