import tokens from '../tokens/tokens.json'

// Resolves a token's `$value` down to a hex string, following `{a.b.c}`
// alias references the way Style Dictionary does when it builds
// build/css/tokens.css. Used wherever a Storybook *config* file (rather
// than a component) needs a literal color — Storybook's theme objects
// take real values, not CSS custom properties, so this is the one place
// a token value gets read directly from tokens/tokens.json instead of
// bound as `var(--...)`.
function resolveToken(path: string): unknown {
  return path
    .split('.')
    .reduce<unknown>(
      (node, key) => (node as Record<string, unknown> | undefined)?.[key],
      tokens
    )
}

function resolveColor(value: unknown): string {
  if (typeof value === 'string') {
    const alias = value.match(/^\{(.+)\}$/)?.[1]
    if (!alias) throw new Error(`Unrecognized token value: ${value}`)
    const target = resolveToken(alias) as { $value?: unknown } | undefined
    if (!target) throw new Error(`Token alias not found: ${alias}`)
    return resolveColor(target.$value)
  }
  if (value && typeof value === 'object' && 'hex' in value) {
    return (value as { hex: string }).hex
  }
  throw new Error(`Unrecognized token value: ${JSON.stringify(value)}`)
}

// semanticColor.background.page — the root screen canvas, used for every
// screen's base background. See tokens/tokens.json.
export const pageBackground = resolveColor(
  (tokens.semanticColor.background.page as { $value: unknown }).$value
)
