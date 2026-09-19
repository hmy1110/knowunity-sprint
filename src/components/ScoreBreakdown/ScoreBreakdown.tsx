import type { CSSProperties } from 'react'
import type { TagStatus } from '../Tag/Tag'

/**
 * Knowunity `ScoreBreakdown` — not a Figma component. This is the
 * "X% recalled this session" headline + segmented bar + legend, hand-
 * built directly on the real Summary instance (node
 * I13622:17388;4794:5832;13622:17898, "🎨 Mascot & components" page →
 * Summary → middleContent). Figma's own layer names literally read
 * "segbar (custom, no matching component)" and "legend (custom, no
 * matching component)" — flagged as non-componentized by whoever built
 * the screen, before this doc flagged it too. Built 2026-09-16 per
 * Mia's explicit call to build it from the real Figma structure.
 *
 * **The bar segments and legend order are Recalled → Hinted → Revealed
 * → Skipped**, matching `Table`'s own good-to-bad sort (see
 * `../Table/Table.tsx`) — confirmed by reading each rectangle's real x
 * position, not its position in the layer tree (the tree order and
 * visual left-to-right order don't match on the real node). Segment
 * widths are computed here from each status's real `counts` value,
 * proportional to the total, rather than copied as the real instance's
 * own literal pixel widths (80/80/85/81.5px for an even 1-1-1-1 split,
 * which don't quite divide evenly and read as manual-drag imprecision,
 * not a meaningful ratio).
 *
 * **`percent` is a caller-supplied prop, not derived from `counts`
 * here.** Figma's two live Summary instances (checked 2026-09-19) show
 * 1 Recalled + 1 Hinted + 1 Revealed + 1 Skipped alongside "25%
 * recalled this session," and 4 Recalled alongside "100%" — both
 * Recalled ÷ total, so a Hinted term does not count as recalled. (An
 * earlier version of the mixed frame read "50%", which fit
 * (Recalled + Hinted) ÷ total; Figma has since replaced it.) The
 * formula is still not baked into this presentational component — the
 * caller computes and passes the number.
 *
 * **Colors are real bound variables, confirmed via the plugin — several
 * share a hex value with `Tag`'s own colors but bind a different
 * token, matching the same "don't assume by value" gap `Tag`'s own doc
 * comment already flags:** Recalled's dot/segment binds
 * `feedback/success/bold` (not `Tag`'s `accent/green/bold` — same
 * `#00c386`, different token). Hinted binds `pro/accent`, documented in
 * tokens.json as an intentional alias of `pro/bold` (not a stray
 * duplicate) — safe to use directly. Revealed binds `feedback/error/
 * bold`, matching `Tag` exactly. Skipped binds `background/stacking`
 * (not `Tag`'s `text/secondary`-paired `background/stacking` — same
 * token here, just for a dot instead of a pill fill). The track behind
 * the bar binds `interactive/secondary` — same literal value as
 * `background/stacking` again, different token, bound exactly as found.
 *
 * **Layout**: the outer card (padding, gap, corner radius, and its
 * `background/surface` fill) is fully bound to real tokens and is
 * bound here too. The bar's own full-pill corner radius binds
 * `radius/Full`. The legend row's 16px gap and the bar/legend's own
 * item spacing inside the outer card are unbound literals in Figma
 * (`itemSpacing`, no bound variable) even where they numerically match
 * `space/400` — reproduced as literals, the same "don't bind by
 * matching value" discipline every component since Button has
 * followed. Each legend item's icon-to-label 4px gap *is* bound to
 * `space/100` and is bound here too.
 *
 * **Text**: the percent headline ("25%" on the mixed instance) binds the real named style "Greed/
 * Headline XL" (`--type-scale-headline-xl-*`) cleanly, no drift.
 * "recalled this session" binds "Greed/Headline XXS Regular" and each
 * legend label binds "Greed/Caption M Regular" — both real bindings,
 * though (consistent with every other named style audited in this
 * file) their live Figma values and tokens.json's exported values for
 * the same style disagree slightly on size/letter-spacing; the token is
 * used here per that same established precedent, not the literal.
 */

export interface ScoreBreakdownProps {
  /** The headline percentage. Not derived from `counts` — see doc comment above: Figma's instances fit Recalled ÷ total. */
  percent: number
  /** Caption under the percentage. Figma's own real value: "recalled this session". */
  percentLabel?: string
  /** Per-status counts driving both the segmented bar and the legend. */
  counts: Record<TagStatus, number>
  className?: string
  style?: CSSProperties
}

const STATUS_ORDER: TagStatus[] = ['Recalled', 'Hinted', 'Revealed', 'Skipped']

// Real bound variables, confirmed via the plugin — see doc comment
// above for which ones share a hex value with Tag's own colors but
// bind a different token.
const STATUS_COLOR_VAR: Record<TagStatus, string> = {
  Recalled: '--semantic-color-feedback-success-bold',
  Hinted: '--semantic-color-pro-accent',
  Revealed: '--semantic-color-feedback-error-bold',
  Skipped: '--semantic-color-background-stacking',
}

const HEADLINE_TEXT_STYLE: CSSProperties = {
  fontFamily: 'var(--type-scale-headline-xl-font-family)',
  fontWeight: 'var(--type-scale-headline-xl-font-weight)' as unknown as number,
  fontSize: 'var(--type-scale-headline-xl-font-size)',
  lineHeight: 'var(--type-scale-headline-xl-line-height)',
  letterSpacing: 'var(--type-scale-headline-xl-letter-spacing)',
}

const CAPTION_TEXT_STYLE: CSSProperties = {
  fontFamily: 'var(--type-scale-headline-xxs-regular-font-family)',
  fontWeight: 'var(--type-scale-headline-xxs-regular-font-weight)' as unknown as number,
  fontSize: 'var(--type-scale-headline-xxs-regular-font-size)',
  lineHeight: 'var(--type-scale-headline-xxs-regular-line-height)',
  letterSpacing: 'var(--type-scale-headline-xxs-regular-letter-spacing)',
}

const LEGEND_TEXT_STYLE: CSSProperties = {
  fontFamily: 'var(--type-scale-caption-m-regular-font-family)',
  fontWeight: 'var(--type-scale-caption-m-regular-font-weight)' as unknown as number,
  fontSize: 'var(--type-scale-caption-m-regular-font-size)',
  lineHeight: 'var(--type-scale-caption-m-regular-line-height)',
  letterSpacing: 'var(--type-scale-caption-m-regular-letter-spacing)',
}

export function ScoreBreakdown({
  percent,
  percentLabel = 'recalled this session',
  counts,
  className,
  style,
}: ScoreBreakdownProps) {
  const total = STATUS_ORDER.reduce((sum, status) => sum + counts[status], 0)

  return (
    <div
      className={`flex flex-col ${className ?? ''}`}
      style={{
        gap: 'var(--size-space-400)',
        padding: 'var(--size-space-400)',
        borderRadius: 'var(--size-radius-400)',
        background: 'var(--semantic-color-background-surface)',
        ...style,
      }}
    >
      <div className="flex items-baseline" style={{ gap: 8 }}>
        <span style={{ ...HEADLINE_TEXT_STYLE, color: 'var(--semantic-color-text-primary)' }}>{percent}%</span>
        <span style={{ ...CAPTION_TEXT_STYLE, color: 'var(--semantic-color-text-secondary)' }}>{percentLabel}</span>
      </div>

      <div
        className="flex w-full"
        style={{ height: 8, borderRadius: 'var(--size-radius-full)', overflow: 'hidden', background: 'var(--semantic-color-interactive-secondary)' }}
      >
        {STATUS_ORDER.map((status) => {
          const count = counts[status]
          if (count <= 0) return null
          return (
            <div
              key={status}
              style={{ width: `${(count / total) * 100}%`, background: `var(${STATUS_COLOR_VAR[status]})` }}
            />
          )
        })}
      </div>

      <div className="flex w-full flex-wrap items-center" style={{ gap: 'var(--size-space-400)' }}>
        {STATUS_ORDER.map((status) => (
          <div key={status} className="flex items-center" style={{ gap: 'var(--size-space-100)' }}>
            <div style={{ width: 8, height: 8, borderRadius: 9999, background: `var(${STATUS_COLOR_VAR[status]})`, flexShrink: 0 }} />
            <span style={{ ...LEGEND_TEXT_STYLE, color: 'var(--semantic-color-text-secondary)', whiteSpace: 'nowrap' }}>
              {counts[status]} {status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
