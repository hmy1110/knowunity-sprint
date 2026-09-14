import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { spacingSteps, type SizeToken } from './tokenData'
import { FoundationsPage, PageIntro, TokenCaption } from './FoundationsUI'

function SpacingBar({ token }: { token: SizeToken }) {
  const isNegative = token.valuePx < 0
  return (
    <div className="flex items-center gap-4">
      <div className="w-40 shrink-0">
        <TokenCaption name={token.name} value={`${token.valuePx}px`} description={token.description} />
      </div>
      <div
        className="h-4 shrink-0"
        style={{
          width: `${Math.abs(token.valuePx)}px`,
          // Negative space tokens (used for overlaps / negative margins,
          // never a literal width) get the muted fill so the sign reads
          // as different from ordinary positive spacing at a glance.
          background: isNegative
            ? 'var(--semantic-color-interactive-secondary)'
            : 'var(--semantic-color-accent-brand-bold)',
          borderRadius: 'var(--size-radius-100)',
        }}
      />
    </div>
  )
}

function SpacingPage() {
  return (
    <FoundationsPage>
      <PageIntro title="Spacing">
        Every step in tokens/tokens.json&apos;s size.space scale, drawn at its
        real pixel width — smallest to largest, negatives (used for overlaps
        and negative margins, not literal gaps) shown first and in a muted
        fill so they read as distinct from ordinary spacing.
      </PageIntro>
      <div className="flex flex-col gap-4">
        {spacingSteps.map((token) => (
          <SpacingBar key={token.name} token={token} />
        ))}
      </div>
    </FoundationsPage>
  )
}

const meta = {
  title: 'Foundations/Spacing',
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

export const SpacingScale: Story = {
  tags: ['ai-generated'],
  render: () => <SpacingPage />,
}
