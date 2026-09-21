import type { CSSProperties } from 'react'
import type { TagStatus } from '../Tag/Tag'

/**
 * Knowunity `TermResultList` — not a Figma component. This is the
 * title + one-sentence explanation shown beneath `table` on the real
 * Summary instance (node I13622:17388;4794:5832;13622:17945, "🎨 Mascot
 * & components" page → Summary → middleContent), one block per term,
 * same order as `table`'s own rows. Built 2026-09-16 per Mia's explicit
 * call to build it from the real Figma structure.
 *
 * **The title is derived from `status`, not free text** — the real
 * instance's four titles ("Recalled on your own" / "Needed a hint" /
 * "Revealed" / "Skipped") read as fixed per-status copy, not per-term
 * copy: nothing in any of the four titles mentions the term itself.
 * Reproduced here as a `status → title` map rather than a title prop,
 * so a caller can't accidentally pair the wrong title with a status.
 *
 * **The sentence is real rich text, not a single flat string** —
 * confirmed via `getStyledTextSegments`: the leading term name renders
 * SemiBold (600) and binds "Greed/Headline XXS Bold"
 * (`--type-scale-headline-xxs-bold-*`), the rest renders Regular (400)
 * and binds "Greed/Headline XXS Regular"
 * (`--type-scale-headline-xxs-regular-*`), both 14px/16px, `text/primary`
 * (checked 2026-09-19; an earlier version of this note said the sentence
 * had no named style). Modeled here as two props, `term` and
 * `reflection`, rather than one string with embedded markup, so the
 * bold/regular split can't drift from the real content's own split.
 *
 * **The title also binds "Greed/Headline XXS Bold"**, used here in full.
 *
 * **The title's color is status-tinted, per Mia's explicit call
 * (2026-09-16), not `text/primary` like the real node itself binds** —
 * Recalled uses `accent/green/bold`, Hinted `pro/bold`, Revealed
 * `feedback/error/bold`, Skipped `text/secondary`. This is a deliberate
 * departure from the real Summary instance (confirmed via the plugin:
 * all four real titles bind plain `text/primary`), not a correction of
 * a misread value — flagging the divergence rather than silently
 * treating it as what Figma shows. The sentence below each title stays
 * `text/primary`, unchanged.
 *
 * **Layout**: both the 16px gap between the four blocks and the 4px
 * gap between each block's own title and sentence are real bound
 * variables (`space/400`, `space/100`) and are bound here too. The
 * whole list sits on the screen's own background with no card chrome
 * of its own (no fill, no padding) in Figma — reproduced the same way.
 */

export interface TermResultRow {
  /** The term's own name — rendered bold as the sentence's leading segment. */
  term: string
  /** Drives the fixed per-status title — see doc comment above. */
  status: TagStatus
  /** The rest of the sentence, following "{term}, " — real per-term copy, not derivable from status. */
  reflection: string
  /** Optional second line under the sentence, in the same regular style — Revealed and Skipped carry one on the live Summary. */
  note?: string
}

export interface TermResultListProps {
  rows: TermResultRow[]
  className?: string
  style?: CSSProperties
}

// Fixed per-status title, confirmed against all four real instances —
// see doc comment above.
const STATUS_TITLE: Record<TagStatus, string> = {
  Recalled: 'Recalled on your own',
  Hinted: 'Needed a hint',
  Revealed: 'Revealed',
  Skipped: 'Skipped',
}

// Status-tinted title color per Mia's explicit call — the real node
// binds plain text/primary instead, see doc comment above.
const STATUS_TITLE_COLOR_VAR: Record<TagStatus, string> = {
  Recalled: '--semantic-color-accent-green-bold',
  Hinted: '--semantic-color-pro-bold',
  Revealed: '--semantic-color-feedback-error-bold',
  Skipped: '--semantic-color-text-secondary',
}

const TITLE_TEXT_STYLE: CSSProperties = {
  fontFamily: 'var(--type-scale-headline-xxs-bold-font-family)',
  fontWeight: 'var(--type-scale-headline-xxs-bold-font-weight)' as unknown as number,
  fontSize: 'var(--type-scale-headline-xxs-bold-font-size)',
  lineHeight: 'var(--type-scale-headline-xxs-bold-line-height)',
  letterSpacing: 'var(--type-scale-headline-xxs-bold-letter-spacing)',
}

const TERM_TEXT_STYLE: CSSProperties = TITLE_TEXT_STYLE

const REFLECTION_TEXT_STYLE: CSSProperties = {
  fontFamily: 'var(--type-scale-headline-xxs-regular-font-family)',
  fontWeight: 'var(--type-scale-headline-xxs-regular-font-weight)' as unknown as number,
  fontSize: 'var(--type-scale-headline-xxs-regular-font-size)',
  lineHeight: 'var(--type-scale-headline-xxs-regular-line-height)',
  letterSpacing: 'var(--type-scale-headline-xxs-regular-letter-spacing)',
}

export function TermResultList({ rows, className, style }: TermResultListProps) {
  return (
    <div className={`flex flex-col ${className ?? ''}`} style={{ gap: 'var(--size-space-400)', ...style }}>
      {rows.map((row, index) => (
        <div key={index} className="flex flex-col" style={{ gap: 'var(--size-space-100)' }}>
          <p className="m-0" style={{ ...TITLE_TEXT_STYLE, color: `var(${STATUS_TITLE_COLOR_VAR[row.status]})` }}>
            {STATUS_TITLE[row.status]}
          </p>
          <p className="m-0" style={{ ...REFLECTION_TEXT_STYLE, color: 'var(--semantic-color-text-primary)' }}>
            <span style={TERM_TEXT_STYLE}>{row.term}</span>
            {`, ${row.reflection}`}
            {row.note && (
              <>
                <br />
                {row.note}
              </>
            )}
          </p>
        </div>
      ))}
    </div>
  )
}
