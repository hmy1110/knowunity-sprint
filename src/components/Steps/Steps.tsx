import type { CSSProperties } from 'react'
import { Button } from '../Button/Button'

/**
 * Knowunity `Steps` — Figma component, node 13764:16058 in the
 * "Yummy__Knowie Design System" file (a single component, not a set:
 * it has no variant or boolean properties). New in the 2026-09-19 sync;
 * before it, the "Topics N of 4" count and the "Skip" link were an
 * inline row in `session/page.tsx`.
 *
 * What it is: the header row of a recall-loop screen, one line under
 * the appBar — the term count on the left ("Topics 1 of 4") and a
 * Tertiary/S `button` reading "Skip" on the right, space-between.
 * It's an instance on Learning-topic 1-idle, Learning-topic 1-result,
 * Learning-topic 1-typeResult-Recalled, Learning-topic 2, Learning-topic
 * 3-I don't know and Learning-topic 4-skipped; the other Learning-*
 * frames carry the same row as a detached frame (still 48px tall, still
 * 16px above the content).
 *
 * Reuses `Button` (../Button/Button.tsx) for Skip, confirmed
 * structurally: the nested instance is the button component set at
 * variant Tertiary / size S / state Default, cta "Skip", no icons. The
 * row is 48px tall because that button's frame is (its 32px label row
 * plus the 48px tap area Button already reproduces).
 *
 * **The count text is a bound type style**, `Caption M Bold`
 * (`--type-scale-caption-m-bold-*`), colored `text/primary`. Figma's
 * text layer is a fixed "Topics 1 of 4" string with no text property;
 * `current`/`total` are how a screen sets it, since the count changes
 * per term.
 *
 * Gaps found while building this:
 *
 * - **Width is 358px in Figma (a 390px screen minus 16px each side),
 *   fixed.** Built as `width: 100%` so it fills whatever padded column
 *   it's placed in; every real screen places it in exactly that column.
 * - Figma's Skip has no `onClick` — the flow only wires it on the last
 *   term (see SPEC.md). `onSkip` is optional; without it Skip renders
 *   like the frame shows it and does nothing.
 * - `skipHotspot` is a prototype-layer flag (see HotspotHints.tsx), not
 *   part of the Figma component: it marks Skip as a live destination so
 *   the tap-feedback outline finds it.
 */

export interface StepsProps {
  /** The current term, 1-based. Renders as "Topics {current} of {total}". */
  current?: number
  /** How many terms the session has. */
  total?: number
  /** Called when Skip is tapped. Without it Skip is inert, as on terms 1-3 of the prototype. */
  onSkip?: () => void
  /** Prototype-layer: marks Skip as a live tap target for the hotspot hint. Not part of the Figma component. */
  skipHotspot?: boolean
  className?: string
  style?: CSSProperties
}

export function Steps({ current = 1, total = 4, onSkip, skipHotspot, className, style }: StepsProps) {
  return (
    <div
      className={`flex items-center justify-between ${className ?? ''}`}
      style={{ width: '100%', ...style }}
    >
      <span
        style={{
          color: 'var(--semantic-color-text-primary)',
          fontFamily: 'var(--type-scale-caption-m-bold-font-family)',
          fontWeight: 'var(--type-scale-caption-m-bold-font-weight)',
          fontSize: 'var(--type-scale-caption-m-bold-font-size)',
          lineHeight: 'var(--type-scale-caption-m-bold-line-height)',
          letterSpacing: 'var(--type-scale-caption-m-bold-letter-spacing)',
          whiteSpace: 'nowrap',
        }}
      >
        Topics {current} of {total}
      </span>
      {/* Button's own tap area is an absolutely positioned 48px box, so
          Steps' 48px height comes from this wrapper, not from the
          32px button. */}
      <span className="inline-flex shrink-0 items-center" style={{ height: 48 /* [gap:steps-height] */ }}>
        <Button
          variant="Tertiary"
          size="S"
          cta="Skip"
          onClick={onSkip}
          data-hotspot={skipHotspot || undefined}
          data-hotspot-pad={skipHotspot ? '200' : undefined}
        />
      </span>
    </div>
  )
}
