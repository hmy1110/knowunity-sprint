import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { typeStyles, type TypeStyle } from './tokenData'
import { FoundationsPage, PageIntro, TokenCaption } from './FoundationsUI'

// Fixed sample copy so the type scale is compared like a specimen sheet —
// the same words at every size, not a different sentence per row.
const SAMPLE_TEXT = 'Recall the answer'

function TypeSpecimen({ style }: { style: TypeStyle }) {
  const resolvedValue = `${style.fontWeight} ${style.fontSizePx}px/${style.lineHeightPx}px, tracking ${style.letterSpacingEm}em`
  return (
    <div
      className="flex flex-col gap-3 py-6"
      style={{ borderBottom: '1px solid var(--semantic-color-border-default)' }}
    >
      <p
        style={{
          color: 'var(--semantic-color-text-primary)',
          fontFamily: `var(${style.cssVars.fontFamily})`,
          fontWeight: `var(${style.cssVars.fontWeight})`,
          fontSize: `var(${style.cssVars.fontSize})`,
          lineHeight: `var(${style.cssVars.lineHeight})`,
          letterSpacing: `var(${style.cssVars.letterSpacing})`,
        }}
      >
        {SAMPLE_TEXT}
      </p>
      <TokenCaption name={style.name} value={resolvedValue} description={style.description} />
    </div>
  )
}

function TypographyPage() {
  return (
    <FoundationsPage>
      <PageIntro title="Type">
        Every text style in tokens/tokens.json&apos;s typeScale, rendered at its
        real size — largest (Display L) to smallest (Caption S), the order
        a type specimen sheet reads in. Font family, weight, size, line
        height, and letter-spacing are all bound to the generated CSS
        variables, not retyped.
      </PageIntro>
      <div>
        {typeStyles.map((style) => (
          <TypeSpecimen key={style.name} style={style} />
        ))}
      </div>
    </FoundationsPage>
  )
}

const meta = {
  title: 'Foundations/Type',
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

export const TypeScale: Story = {
  tags: ['ai-generated'],
  render: () => <TypographyPage />,
}
