import type { CSSProperties } from 'react'

/**
 * Knowunity `statusIndicator` — Figma component set, node 13631:13525 in
 * the "Yummy__Knowie Design System" file (🎨 Mascot & components page,
 * one of the six components built for the voice active-recall sprint).
 *
 * Figma's own component description (verbatim):
 *
 * > What it is: 2-variant status readout (status=Recording/Ready), a
 * > colored 9x9 dot plus a matching-color text label, no boolean
 * > properties. When to use it: The single source for this pattern
 * > across the file. It's live in 2 real screens: embedded inside
 * > micButton's own Recording state (paired with "Tap to stop"), and
 * > placed directly in Learning-ready to send, showing "Ready to send"
 * > above the Redo/Send buttons. Both usages are bound to
 * > feedback/error/bold and feedback/success/bold. Two older duplicate
 * > copies sit in Archive, superseded screen versions, not live ones.
 * > One thing to do: Only Recording and Ready have a real-screen
 * > precedent. The mic capture pipeline logically has a transitional
 * > step between "done recording" and "ready to send" (something is
 * > being transcribed or processed), but no real instance shows this
 * > pattern used for that step, so a third variant wasn't added
 * > speculatively. Confirm whether that in-between state should live
 * > here as a third variant or stay as the separate pagination-dot
 * > animation already documented in app-inventory.md.
 *
 * Built here — ahead of schedule, as its own file — because MicButton's
 * real Figma structure embeds a genuine statusIndicator instance for its
 * Recording state rather than hand-building the dot+label inline. This
 * is the exact case design-system.md's naming-conventions section (§3)
 * names as the reason this component exists in Figma to begin with ("a
 * colored-dot+label pattern was independently hand-built inside
 * micButton and inside two real screens"); hand-building it again inside
 * MicButton.tsx would repeat the mistake the design system already
 * corrected once. See MicButton.tsx for where this is used.
 *
 * Gaps found while building this (flagged, not silently invented,
 * consistent with how Button/ButtonIcon/Chips/ProgressIndicator handle
 * the same kind of gap): the label's type style is a raw, unbound
 * "Inter" Semi Bold 14px in Figma — confirmed from get_variable_defs
 * returning no font-family/weight/size/line-height variable for this
 * node at all, only the two status colors. "Inter" doesn't exist
 * anywhere in tokens.json (the system's only bound family is Greed
 * VF-TRIAL, see globals.css); every other text layer across the six
 * recall-loop components binds a named type-scale style, and this is
 * the one label that doesn't. Reproduced as Figma's own literal values
 * rather than silently swapping in a type-scale token Figma never
 * actually bound. The 9px dot diameter and the 8px dot-to-label gap are
 * unbound literals too — Figma's own reference code renders both as
 * plain numbers, never `var(...)`, unlike the confirmed-bound tokens
 * used elsewhere in this file.
 */

export type StatusIndicatorStatus = 'Recording' | 'Ready'

export interface StatusIndicatorProps {
  /** Which of the two statuses this instance shows. */
  status?: StatusIndicatorStatus
  className?: string
  style?: CSSProperties
}

// status=Recording,Ready -> dot/label color and label text. Both colors
// confirmed from Figma's real bound variables (get_variable_defs), not
// by matching rendered colors.
const STATUS_CONFIG: Record<StatusIndicatorStatus, { colorVar: string; label: string }> = {
  Recording: { colorVar: '--semantic-color-feedback-error-bold', label: 'Recording…' },
  Ready: { colorVar: '--semantic-color-feedback-success-bold', label: 'Ready to send' },
}

export function StatusIndicator({ status = 'Recording', className, style }: StatusIndicatorProps) {
  const { colorVar, label } = STATUS_CONFIG[status]

  return (
    <div
      className={`inline-flex shrink-0 items-center ${className ?? ''}`}
      style={{
        gap: 8, // Not bound to a token in Figma — see doc comment above.
        ...style,
      }}
    >
      <span
        className="inline-block shrink-0 rounded-full"
        style={{
          width: 9, // Not bound to a token in Figma — see doc comment above.
          height: 9, // Not bound to a token in Figma — see doc comment above.
          background: `var(${colorVar})`,
        }}
      />
      <p
        className="whitespace-nowrap"
        style={{
          margin: 0,
          // Raw, unbound "Inter" Semi Bold 14px — see doc comment above.
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          fontSize: 14,
          lineHeight: 'normal',
          color: `var(${colorVar})`,
        }}
      >
        {label}
      </p>
    </div>
  )
}
