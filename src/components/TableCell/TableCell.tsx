import type { CSSProperties } from 'react'
import { Tag, type TagStatus } from '../Tag/Tag'

/**
 * Knowunity `tableCell` — Figma component set, node 13719:15194 in the
 * "Yummy__Knowie Design System" file (🎨 Mascot & components page).
 *
 * Built live in this session: Mia selected a hand-built row (a label next
 * to a `tag` instance) inside the "Table" frame and turned it into a
 * component, which Figma auto-named "Component 1" with a variant property
 * "Property 1". Both were renamed here to match this file's convention —
 * `tableCell` (camelCase, section 3's component-naming rule) and `status`
 * (section 3's rule: use `status` when a component exists purely to
 * display a status determined elsewhere, exactly `tag`'s own case, which
 * this component wraps). Figma's own component-set description is empty,
 * so there's no verbatim "What it is / When to use it" to quote — this
 * doc comment is written from structure and the real row it was extracted
 * from instead.
 *
 * **Wraps `tag` directly** (../Tag/Tag.tsx) rather than reimplementing its
 * pill — the label's own status word and colors are `tag`'s job, not a
 * new one for this component. `label` is a free-text override with no
 * backing Figma property, the same class of gap as TextField's own
 * `titleText`/`placeholder`/`caption` — Figma models each variant's
 * visible label as a hardcoded per-instance literal, not a component
 * property, so this exposes it as a prop instead of hardcoding it four
 * times over. The 2nd child ("Frame" wrapping the label in Figma) is
 * dropped as a redundant single-child wrapper, the same treatment
 * InlineAlert already gives Figma's own redundant "Icon Container".
 *
 * **Gap found while building this, flagged rather than silently
 * resolved:** the bottom divider is not a real Figma property on this
 * component — there's no boolean for it in `componentPropertyDefinitions`
 * at all. Confirmed via the Desktop Bridge plugin's own stroke-weight
 * audit, not assumed: three of the four status variants (Recalled,
 * Hinted, Revealed) carry a 1px bottom-only stroke; Skipped alone has
 * none. That happens to produce the right look in the one real "Table"
 * instance this was extracted from, where Skipped is the last row — but
 * the divider is really about row *position* (last row vs. not), and
 * Figma has baked it into row *status* instead. Reproduced exactly as
 * Figma shows it below (status drives the divider), since inventing an
 * unmodeled `showDivider`/`isLast` prop isn't this component's call to
 * make — but a caller building a list where Skipped isn't the last row,
 * or where the last row isn't Skipped, will get a stray or missing
 * divider. Worth a real position-based property in Figma; flagging for
 * Mia rather than deciding it here.
 *
 * **Update 2026-09-21 (Mia): the divider separates two cells, so it
 * follows position, not status.** Figma's baked-in "Skipped has none" made
 * a Skipped row that isn't last lose its divider, and a last row that isn't
 * Skipped keep a stray one. A `tableCell` now has no divider of its own
 * (a lone cell has nothing to separate from); `showDivider` draws the
 * bottom one, and `Table` sets it on every row but the last. This differs
 * from Figma's Recalled/Hinted/Revealed variants, which bake the line in.
 *
 * **The divider's own color (white at ~10% opacity) is an unbound
 * literal in Figma**, not a bound variable, even though it numerically
 * matches `border/default` (`rgba(255, 255, 255, 0.1)`) — reproduced as
 * a literal here, the same "don't bind by matching value" discipline
 * every component since Button has followed (see Tag's own doc comment
 * for the same call on its pill's corner radius and padding).
 *
 * **The label is bound to a real named text style, "Greed/Body S
 * Bold"** (`--type-scale-body-s-bold-*`), used here in full. One
 * inconsistency worth flagging: the live Figma style itself renders at
 * 14px / 20px line-height / 1px letter-spacing, but tokens.css's
 * exported values for this same style are 15px / 20px / 0.01em —
 * confirmed by reading the bound style directly via the plugin API, not
 * by eyeballing rendered text. This binds the token (per CLAUDE.md's
 * "every value comes from tokens.json" rule) rather than the literal
 * Figma renders, consistent with how every other confirmed-bound style
 * in this codebase is handled — flagging the drift as a tokens.json
 * source-data issue, not fixing it here.
 *
 * The label's own 16px/16px horizontal padding and 12px/12px vertical
 * padding map cleanly to `space/400` and `space/300` and are bound
 * here; the "Frame" wrapper's 8px item spacing is dropped along with
 * the wrapper itself (single child, so the gap was never visible).
 */

export type TableCellStatus = TagStatus

export interface TableCellProps {
  /** Which of the four statuses this row shows. */
  status?: TableCellStatus
  /** Draws the bottom divider that separates this cell from the next one. Off by default: a lone cell has nothing to separate from. */
  showDivider?: boolean
  /** The row's label text. No backing Figma property — see doc comment above. */
  label?: string
  className?: string
  style?: CSSProperties
}

const LABEL_TEXT_STYLE: CSSProperties = {
  fontFamily: 'var(--type-scale-body-s-bold-font-family)',
  fontWeight: 'var(--type-scale-body-s-bold-font-weight)' as unknown as number,
  fontSize: 'var(--type-scale-body-s-bold-font-size)',
  lineHeight: 'var(--type-scale-body-s-bold-line-height)',
  letterSpacing: 'var(--type-scale-body-s-bold-letter-spacing)',
}

export function TableCell({ status = 'Recalled', label = 'Inspiration', showDivider = false, className, style }: TableCellProps) {
  return (
    <div
      className={`flex items-center justify-between ${className ?? ''}`}
      style={{
        gap: 'var(--size-space-400)',
        paddingLeft: 'var(--size-space-400)',
        paddingRight: 'var(--size-space-400)',
        paddingTop: 'var(--size-space-300)',
        paddingBottom: 'var(--size-space-300)',
        // Unbound literal in Figma even though it numerically matches
        // border/default — see doc comment above.
        borderBottom: showDivider ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
        ...style,
      }}
    >
      <p className="m-0" style={{ ...LABEL_TEXT_STYLE, color: 'var(--semantic-color-text-primary)' }}>
        {label}
      </p>
      <Tag status={status} />
    </div>
  )
}
