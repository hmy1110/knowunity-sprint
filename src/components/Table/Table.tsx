import type { CSSProperties } from 'react'
import { TableCell, type TableCellStatus } from '../TableCell/TableCell'

/**
 * Knowunity `table` — Figma component, node 13719:15156 in the
 * "Yummy__Knowie Design System" file (🎨 Mascot & components page).
 *
 * Built live in this session: Mia selected a hand-built frame (four
 * label+tag rows) and turned it into a component, then extracted each row
 * into the `tableCell` component set (see ../TableCell/TableCell.tsx for
 * that component's own gaps). Figma's own component description is
 * empty — there's no verbatim "What it is / When to use it" to quote.
 *
 * Structurally this is `tag`'s own documented job — "the per-term result
 * label on the summary screen after a recall session" — laid out as a
 * list rather than a single pill, one real example of which now exists
 * in this file. Figma only models one fixed 4-row instance, not a
 * repeater with a real "N rows" property, so there's no Figma-modeled
 * upper or lower bound on row count to match here. `rows` is exposed as
 * a prop, defaulting to that one real instance's exact content
 * (Inspiration/Recalled, Divergent thinking/Hinted, Visual
 * hierarchy/Revealed, Visual research/Skipped) — the same kind of
 * content-only override TextField already gives its own literal text,
 * not a new structural property Figma doesn't have.
 *
 * **Rows are always displayed Recalled → Hinted → Revealed → Skipped
 * (good to bad), regardless of the order passed in `rows`** — Mia's
 * explicit call, not a Figma-modeled property. Since 2026-09-21
 * the divider follows row position, per Mia's rule: `Table` sets
 * `showDivider` on every row but the last, whatever its status, so a Skipped
 * row that isn't last keeps its divider and a last row that isn't Skipped
 * has none.
 *
 * The outer frame's 16px corner radius is an unbound literal in Figma
 * (numerically equal to `radius/400`, but Figma's own reference code
 * never binds it — same "don't bind by matching value" discipline as
 * `tableCell`'s divider color). Its fill, `background/surface`, is a
 * real bound variable and is bound here too. `clipsContent` is on in
 * Figma so the first/last row's square corners don't poke past the
 * rounded frame — reproduced with `overflow: hidden`.
 */

export interface TableRow {
  label: string
  status: TableCellStatus
}

export interface TableProps {
  /** The table's rows. Always displayed Recalled → Hinted → Revealed → Skipped regardless of input order — see doc comment above. */
  rows?: TableRow[]
  className?: string
  style?: CSSProperties
}

const DEFAULT_ROWS: TableRow[] = [
  { label: 'Inspiration', status: 'Recalled' },
  { label: 'Divergent thinking', status: 'Hinted' },
  { label: 'Visual hierarchy', status: 'Revealed' },
  { label: 'Visual research', status: 'Skipped' },
]

// Good-to-bad display rank, per Mia's call — Skipped always sorts last.
const STATUS_RANK: Record<TableCellStatus, number> = {
  Recalled: 0,
  Hinted: 1,
  Revealed: 2,
  Skipped: 3,
}

export function Table({ rows = DEFAULT_ROWS, className, style }: TableProps) {
  const sortedRows = [...rows].sort((a, b) => STATUS_RANK[a.status] - STATUS_RANK[b.status])

  return (
    <div
      className={`flex flex-col ${className ?? ''}`}
      style={{
        borderRadius: 16, // Unbound literal in Figma — see doc comment above.
        overflow: 'hidden',
        background: 'var(--semantic-color-background-surface)',
        ...style,
      }}
    >
      {sortedRows.map((row, index) => (
        <TableCell
          key={index}
          label={row.label}
          status={row.status}
          // Mia, 2026-09-18/21: the divider separates two cells, so every row
          // has one except the last, whatever its status.
          showDivider={index < sortedRows.length - 1}
        />
      ))}
    </div>
  )
}
