import type { CSSProperties } from 'react'

/**
 * Knowunity `tag` — Figma component set, node 13628:13515 in the
 * "Yummy__Knowie Design System" file (🎨 Mascot & components page).
 *
 * Figma's own component description (verbatim):
 *
 * > What it is: 4-variant status pill (Recalled/Hinted/Revealed/
 * > Skipped), a single text label with no icon. When to use it: The
 * > per-term result label on the summary screen after a recall
 * > session. It's a standalone component, not an extension of chips:
 * > chips is a 16-variant primitive (size XXS-M, color Primary/pro,
 * > mandatory dual icon slots, fontSize8) built for a different job,
 * > tags and tool pickers, and is structurally too different to bend
 * > into this shape. One thing to do: Hinted uses pro/bold + pro/
 * > onBold, not a warning token, because the system has no feedback/
 * > warning/bold+onBold family, only a lone text/warning scalar. That's
 * > a real gap worth filling. Revealed has real instances on the
 * > Summary screen (both the mixed and all-recalled variants), matching
 * > the Learning-result-Revealed and Learning-result-I don't know
 * > screens' own speechBubble Error state.
 *
 * **Not built from Chips** — Figma's own description explicitly rules
 * that out ("structurally too different to bend into this shape"), so
 * this doesn't reuse or wrap ../Chips/Chips.tsx despite the surface
 * similarity (both are pill-shaped status labels). Checked all 13
 * other existing components; none else is a closer fit either, so this
 * is a new, standalone component.
 *
 * There's no `text` prop — unlike Chips, this component exposes no
 * label-text property in Figma (`componentPropertyDefinitions` has only
 * `status`), and the visible label is always exactly the status word
 * itself (Recalled/Hinted/Revealed/Skipped) in Figma's own reference
 * code — not a placeholder a caller overrides, an intentional
 * "status IS the label" design.
 *
 * **Confirmed via `get_variable_defs` on the real node — a fuller
 * confirmation than the description's own text gives:** Recalled binds
 * `accent/green/bold` + `accent/green/onBold` (not `feedback/success/
 * bold`, despite matching hex `#00C386` — the two share a literal value
 * but are different tokens, and the bound one is reproduced here, not
 * the one that "sounds right"). Hinted binds `pro/bold` + `pro/onBold`,
 * exactly the gap the description names. Revealed binds `feedback/
 * error/bold` (fill) + `feedback/error/on-bold` (text) — updated in
 * Figma from an earlier subtle-fill/bold-text pairing
 * (`feedback/error/subtle` + `feedback/error/bold`) to match the bold-
 * fill pattern the other three statuses already use. Skipped binds
 * `background/stacking` + `text/secondary` — also updated in Figma,
 * from an earlier `text/disabled` pairing that failed WCAG AA contrast
 * (3.69:1 against the required 4.5:1, caught by an axe-core sweep of
 * every story; `text/secondary`'s higher opacity, 0.68 vs 0.4, clears
 * it).
 *
 * **Every dimension and the label's own type style are unbound
 * literals — confirmed by `get_variable_defs` returning only the 8
 * color entries above and nothing else for this entire node, not even
 * one size or font variable.** This is the most heavily gap-flagged
 * component built so far (AudioScrubber's own "almost nothing is
 * bound" case had 2 bound colors at least; this one has 8, and zero of
 * anything else):
 *
 * - The pill's 32px corner radius and 12px/4px padding are hardcoded
 *   literals — 32px happens to equal `radius/800` and 12px/4px happen
 *   to equal `space/300`/`space/100`, but Figma's own reference code
 *   renders all three as bare numbers, never `var(...)`, so none are
 *   bound here either, the same "don't bind by matching value"
 *   discipline every component since Button has followed.
 * - **The label has no bound type style at all — not even an unnamed
 *   one**, the same gap SpeechBubble's and InlineAlert's own titles
 *   have. Greed SemiBold 12px, `leading: normal`, with no letter-
 *   spacing class at all (genuinely no tracking here, unlike most
 *   other text built so far, which typically does carry `tracking/
 *   loose` — reproduced exactly as Figma shows, not defaulted to
 *   match the more common pattern). No `var(...)` appears anywhere in
 *   its font declaration, and CLAUDE.md forbids reading the `font/*`
 *   primitive layer directly even where one would numerically match —
 *   reproduced as Figma's own literal values instead, same treatment
 *   as every other component's non-token text gap.
 */

export type TagStatus = 'Recalled' | 'Hinted' | 'Revealed' | 'Skipped'

export interface TagProps {
  /** Which of the four statuses this instance shows — see the component doc comment. */
  status?: TagStatus
  className?: string
  style?: CSSProperties
}

// status -> fill and text color. Confirmed bound via get_variable_defs,
// not matched by value — Recalled's accent/green tokens and Revealed's
// mixed subtle-fill/bold-text pairing are both real, not assumed, see
// doc comment above.
const COLOR_CONFIG: Record<TagStatus, { fillVar: string; textVar: string }> = {
  Recalled: { fillVar: '--semantic-color-accent-green-bold', textVar: '--semantic-color-accent-green-on-bold' },
  Hinted: { fillVar: '--semantic-color-pro-bold', textVar: '--semantic-color-pro-on-bold' },
  Revealed: { fillVar: '--semantic-color-feedback-error-bold', textVar: '--semantic-color-feedback-error-on-bold' },
  Skipped: { fillVar: '--semantic-color-background-stacking', textVar: '--semantic-color-text-secondary' },
}

export function Tag({ status = 'Recalled', className, style }: TagProps) {
  const { fillVar, textVar } = COLOR_CONFIG[status]

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center ${className ?? ''}`}
      style={{
        paddingInline: 12, // Not bound to a token in Figma — see doc comment above.
        paddingBlock: 4, // Not bound to a token in Figma — see doc comment above.
        borderRadius: 32, // Not bound to a token in Figma — see doc comment above.
        background: `var(${fillVar})`,
        ...style,
      }}
    >
      <span
        className="whitespace-nowrap"
        style={{
          color: `var(${textVar})`,
          // No bound type style exists for this text run, and
          // CLAUDE.md forbids reading the font/* primitive layer
          // directly — reproduced as Figma's own literal values, see
          // doc comment above.
          fontFamily: "'Greed VF-TRIAL', sans-serif",
          fontWeight: 600,
          fontSize: 12,
          lineHeight: 'normal',
        }}
      >
        {status}
      </span>
    </span>
  )
}
