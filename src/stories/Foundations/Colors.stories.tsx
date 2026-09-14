import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { colorGroups } from './tokenData'
import { FoundationsPage, PageIntro, GroupHeading, TokenCaption } from './FoundationsUI'

function ColorSwatch({
  name,
  cssVar,
  value,
  description,
}: {
  name: string
  cssVar: string
  value: string
  description: string | null
}) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="h-16 w-full"
        style={{
          background: `var(${cssVar})`,
          borderRadius: 'var(--size-radius-200)',
          border: '1px solid var(--semantic-color-border-default)',
        }}
      />
      <TokenCaption name={name} value={value} description={description} />
    </div>
  )
}

function ColorsPage() {
  return (
    <FoundationsPage>
      <PageIntro title="Colors">
        Every semantic color token in tokens/tokens.json, grouped the way
        semanticColor groups them. These are the only colors a component may
        bind — primitives (color/*) are never referenced directly, so none
        are shown here on their own, only what each semantic token resolves
        to.
      </PageIntro>
      <div className="flex flex-col gap-10">
        {colorGroups.map(({ group, tokens }) => (
          <section key={group}>
            <GroupHeading>{group}</GroupHeading>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {tokens.map((token) => (
                <ColorSwatch key={token.name} {...token} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </FoundationsPage>
  )
}

const meta = {
  title: 'Foundations/Colors',
  tags: ['autodocs'],
  parameters: {
    // A reference page of swatches needs the room a 390px mobile frame
    // doesn't give it — see .storybook/preview.tsx for the project default.
    layout: 'fullscreen',
  },
  // Overrides the project's default 390px mobile viewport (see
  // .storybook/preview.tsx) just for this reference page: fills the
  // available width instead, the same way a Docs page does.
  globals: {
    viewport: { value: '100pct-100pct', isRotated: false },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const AllColors: Story = {
  tags: ['ai-generated'],
  render: () => <ColorsPage />,
}
