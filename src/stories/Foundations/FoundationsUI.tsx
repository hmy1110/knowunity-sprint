// Small presentational pieces shared by the Foundations stories
// (Colors, Typography, Spacing, Radius). Layout only (grid/flex/padding
// via Tailwind); every actual design value binds a semantic CSS custom
// property from build/css/tokens.css, never a hardcoded number — this
// page is itself real usage of the semantic layer, not just a report on it.

export function PageIntro({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <header className="mb-8">
      <h1
        className="mb-2"
        style={{
          color: 'var(--semantic-color-text-primary)',
          fontFamily: 'var(--typography-family-default)',
          fontSize: 'var(--typography-size-2xl)',
          fontWeight: 'var(--typography-weight-bold)',
        }}
      >
        {title}
      </h1>
      <p
        className="max-w-2xl"
        style={{
          color: 'var(--semantic-color-text-secondary)',
          fontSize: 'var(--typography-size-sm)',
        }}
      >
        {children}
      </p>
    </header>
  )
}

export function GroupHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="mb-3 capitalize"
      style={{
        color: 'var(--semantic-color-text-primary)',
        fontSize: 'var(--typography-size-md)',
        fontWeight: 'var(--typography-weight-semibold)',
      }}
    >
      {children}
    </h2>
  )
}

export function TokenCaption({
  name,
  value,
  description,
}: {
  name: string
  value: string
  description: string | null
}) {
  return (
    <div className="flex flex-col gap-1">
      <code
        className="break-all"
        style={{
          color: 'var(--semantic-color-text-primary)',
          fontSize: 'var(--typography-size-xs)',
        }}
      >
        {name}
      </code>
      <code
        className="break-all"
        style={{
          color: 'var(--semantic-color-text-tertiary)',
          fontSize: 'var(--typography-size-2xs)',
        }}
      >
        {value}
      </code>
      <p
        style={{
          color: 'var(--semantic-color-text-secondary)',
          fontSize: 'var(--typography-size-2xs)',
          fontStyle: description ? 'normal' : 'italic',
        }}
      >
        {description ?? 'No description in tokens.json.'}
      </p>
    </div>
  )
}

export function FoundationsPage({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen p-6"
      style={{
        background: 'var(--semantic-color-background-page)',
        fontFamily: 'var(--typography-family-default)',
      }}
    >
      {children}
    </div>
  )
}
