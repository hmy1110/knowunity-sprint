import type { ReactNode } from 'react'

/**
 * Knowunity `TopicNode` — not a Figma component (Figma's own layer tree
 * has no named component for this; it's a hand-built frame repeated 4
 * times on the `StudyPlan-notStarted` instance alone: node
 * `13622:13162`, "🎨 Mascot & components" page → StudyPlan-notStarted
 * → Slot - Content → middleContent). One roadmap-step row: an
 * 8px-ring circle (icon centered inside a dark inner disc) plus a
 * label to its right. Built 2026-09-16 as a real component rather than
 * copy-pasted 4 times inline, since appearing 4 times on a single
 * screen already meets design-system.md §1's repeated-pattern bar.
 *
 * **The ring color is the only thing that changes between active and
 * disabled** — confirmed from the real node's own generated code: all
 * 4 instances reuse the exact same icon asset (`ai-quiz`, fixed
 * `fill="#E879C0"`, i.e. `accent/magenta/bold`) regardless of state.
 * The 2 active instances ("Finding Ideas", "Choosing Subjects") bind
 * the ring to `accent/magenta/bold`; the 2 disabled instances (both
 * "Artwork Planning") bind it to `interactive/disabled`
 * (`rgba(255,255,255,0.1)`) instead. Reproduced exactly that way here —
 * `active` only swaps the ring's border color, never the icon's.
 *
 * **Layout**: the 96px ring (8px border, unbound literal in Figma —
 * matches no real radius/size token, same "don't bind by matching
 * value" discipline as every hand-built pattern in this file) contains
 * a 66px inner disc (`background/stacking`) offset 7px from the ring's
 * own edge on every side — also unbound literals, reproduced as such.
 * The 32px icon centers inside that disc. Label sits to the ring's
 * right at `space/300` gap, bound to `Headline XXS Bold`.
 */

export interface TopicNodeProps {
  /** The topic's own name. */
  label: string
  /** Whether this step is unlocked (magenta ring) or locked (disabled-gray ring). The icon itself never changes color — see the component doc comment. */
  active?: boolean
  /** Real icon content for the node's center glyph. */
  icon: ReactNode
  className?: string
}

export function TopicNode({ label, active = true, icon, className }: TopicNodeProps) {
  return (
    <div className={`flex items-center ${className ?? ''}`} style={{ gap: 'var(--size-space-300)' }}>
      <div
        className="relative shrink-0"
        style={{
          width: 96,
          height: 96,
          borderRadius: 59,
          borderWidth: 8,
          borderStyle: 'solid',
          borderColor: active ? 'var(--semantic-color-accent-magenta-bold)' : 'var(--semantic-color-interactive-disabled)',
        }}
      >
        <div
          className="absolute flex items-center justify-center overflow-hidden"
          style={{
            left: 7,
            top: 7,
            width: 66,
            height: 66,
            borderRadius: 100,
            background: 'var(--semantic-color-background-stacking)',
          }}
        >
          <span style={{ width: 32, height: 32, display: 'inline-flex' }}>{icon}</span>
        </div>
      </div>
      <span
        style={{
          fontFamily: 'var(--type-scale-headline-xxs-bold-font-family)',
          fontWeight: 'var(--type-scale-headline-xxs-bold-font-weight)',
          fontSize: 'var(--type-scale-headline-xxs-bold-font-size)',
          lineHeight: 'var(--type-scale-headline-xxs-bold-line-height)',
          letterSpacing: 'var(--type-scale-headline-xxs-bold-letter-spacing)',
          color: 'var(--semantic-color-text-primary)',
        }}
      >
        {label}
      </span>
    </div>
  )
}
