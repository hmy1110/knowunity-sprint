// Shared data for the Foundations stories (Colors, Typography, Spacing,
// Radius). Everything here is read straight out of tokens/tokens.json —
// nothing is retyped by hand — so this can't drift from the design system.
// It mirrors what style-dictionary.config.mjs does when it builds
// build/css/tokens.css: same alias resolution, same CSS custom-property
// naming, same percent-to-em conversion for letter-spacing.
import tokens from '../../../tokens/tokens.json'

type JsonRecord = Record<string, unknown>

// --- Alias resolution -------------------------------------------------
// A token's `$value` is either a literal, or a `{a.b.c}` reference to
// another token. This follows that reference however deep it goes.
function resolveAlias(value: unknown): unknown {
  if (typeof value === 'string') {
    const alias = value.match(/^\{(.+)\}$/)?.[1]
    if (alias) {
      const target = alias
        .split('.')
        .reduce<unknown>(
          (node, key) => (node as JsonRecord | undefined)?.[key],
          tokens
        ) as { $value?: unknown } | undefined
      if (!target) throw new Error(`Token alias not found: ${alias}`)
      return resolveAlias(target.$value)
    }
  }
  return value
}

// --- CSS custom-property naming ---------------------------------------
// Reproduces Style Dictionary's css transform group: split camelCase at
// each lowercase-or-digit → uppercase boundary, then lowercase. Segments
// that are already kebab-case (e.g. "light-10", "Heavy-Border") pass
// through unchanged apart from lowercasing.
function kebabSegment(segment: string): string {
  return segment.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

function cssVarFor(path: string[]): string {
  return `--${path.map(kebabSegment).join('-')}`
}

// --- Colors -------------------------------------------------------------

export interface ColorToken {
  /** Dot/slash path in the design system's own naming convention, e.g. "background/page". */
  name: string
  /** The generated CSS custom property, e.g. "--semantic-color-background-page". */
  cssVar: string
  /** Resolved value exactly as build/css/tokens.css would emit it: a hex string, or rgba() when the primitive carries alpha. */
  value: string
  description: string | null
}

export interface ColorGroup {
  group: string
  tokens: ColorToken[]
}

interface ColorPrimitiveValue {
  hex: string
  components: number[]
  alpha?: number
}

function formatColor(value: unknown): string {
  const resolved = resolveAlias(value) as ColorPrimitiveValue
  if (resolved.alpha !== undefined) {
    const [r, g, b] = resolved.components.map((c) => Math.round(c * 255))
    return `rgba(${r}, ${g}, ${b}, ${resolved.alpha})`
  }
  return resolved.hex
}

function isColorToken(node: unknown): node is { $type: string; $value: unknown; $description?: string } {
  return !!node && typeof node === 'object' && (node as JsonRecord).$type === 'color'
}

function walkColors(node: unknown, pathFromRoot: string[], pathFromGroup: string[]): ColorToken[] {
  if (isColorToken(node)) {
    return [
      {
        name: pathFromGroup.join('/'),
        cssVar: cssVarFor(pathFromRoot),
        value: formatColor(node.$value),
        description: node.$description ?? null,
      },
    ]
  }
  return Object.entries(node as JsonRecord).flatMap(([key, child]) =>
    walkColors(child, [...pathFromRoot, key], [...pathFromGroup, key])
  )
}

// Grouped by semanticColor's direct children (background, interactive,
// text, border, mascot, pro, accent, feedback, highlight), in the order
// tokens.json declares them. Primitives are never surfaced on their own —
// only what a semantic token resolves to — matching "bind the semantic
// layer" in docs/design-system.md.
export const colorGroups: ColorGroup[] = Object.entries(
  tokens.semanticColor as JsonRecord
).map(([group, node]) => ({
  group,
  tokens: walkColors(node, ['semanticColor', group], [group]),
}))

// --- Typography ---------------------------------------------------------

export interface TypeStyle {
  name: string
  description: string | null
  fontFamily: string
  fontWeight: number
  fontSizePx: number
  lineHeightPx: number
  letterSpacingEm: number
  cssVars: {
    fontFamily: string
    fontWeight: string
    fontSize: string
    lineHeight: string
    letterSpacing: string
  }
}

function resolveDimensionPx(value: unknown): number {
  const resolved = resolveAlias(value) as { value: number; unit: string }
  if (resolved.unit !== 'px') throw new Error(`Unexpected unit: ${resolved.unit}`)
  return resolved.value
}

function isTypographyToken(
  node: unknown
): node is { $type: string; $value: JsonRecord; $description?: string } {
  return !!node && typeof node === 'object' && (node as JsonRecord).$type === 'typography'
}

function walkTypeScale(node: unknown, pathFromGroup: string[]): TypeStyle[] {
  if (isTypographyToken(node)) {
    const v = node.$value
    // typography.tracking.* is stored as a percent of font size (tight =
    // -1, meaning -1%); style-dictionary.config.mjs converts that to em by
    // dividing by 100, so the same conversion happens here.
    const trackingPercent = resolveAlias(v.letterSpacing) as number
    const path = ['typeScale', ...pathFromGroup]
    return [
      {
        name: pathFromGroup.join('/'),
        description: node.$description ?? null,
        fontFamily: resolveAlias(v.fontFamily) as string,
        fontWeight: resolveAlias(v.fontWeight) as number,
        fontSizePx: resolveDimensionPx(v.fontSize),
        lineHeightPx: resolveDimensionPx(v.lineHeight),
        letterSpacingEm: trackingPercent / 100,
        cssVars: {
          fontFamily: cssVarFor([...path, 'fontFamily']),
          fontWeight: cssVarFor([...path, 'fontWeight']),
          fontSize: cssVarFor([...path, 'fontSize']),
          lineHeight: cssVarFor([...path, 'lineHeight']),
          letterSpacing: cssVarFor([...path, 'letterSpacing']),
        },
      },
    ]
  }
  return Object.entries(node as JsonRecord).flatMap(([key, child]) =>
    walkTypeScale(child, [...pathFromGroup, key])
  )
}

// Every text style, largest to smallest — "scale order" read as a type
// specimen sheet: Display down through Headline, Body, Caption.
export const typeStyles: TypeStyle[] = Object.entries(tokens.typeScale as JsonRecord)
  .flatMap(([group, node]) => walkTypeScale(node, [group]))
  .sort((a, b) => b.fontSizePx - a.fontSizePx)

// --- Spacing & radius -----------------------------------------------------

export interface SizeToken {
  name: string
  cssVar: string
  valuePx: number
  description: string | null
}

function walkSizeGroup(node: JsonRecord, groupKey: string, pathFromRoot: string[]): SizeToken[] {
  return Object.entries(node).map(([key, child]) => {
    const c = child as { $value: { value: number }; $description?: string }
    return {
      name: `${groupKey}/${key}`,
      cssVar: cssVarFor([...pathFromRoot, key]),
      valuePx: c.$value.value,
      description: c.$description ?? null,
    }
  })
}

export const spacingSteps: SizeToken[] = walkSizeGroup(
  tokens.size.space as JsonRecord,
  'space',
  ['size', 'space']
).sort((a, b) => a.valuePx - b.valuePx)

export const radiusSteps: SizeToken[] = walkSizeGroup(
  tokens.size.radius as JsonRecord,
  'radius',
  ['size', 'radius']
).sort((a, b) => a.valuePx - b.valuePx)
