import type { CSSProperties } from 'react'

/**
 * Knowunity `textBlock` — Figma component set, node 9003:9039 in the
 * "Yummy__Knowie Design System" file (🎨 Mascot & components page).
 *
 * Figma's own component description (verbatim):
 *
 * > What it is: The simplest component in the file, one Header + one
 * > Caption text pair, structurally identical across all 4 size
 * > variants (XL/L/M/S). Only the type scale changes. When to use it:
 * > No real usage exists anywhere, so this is inferred purely from
 * > structure and the brief. It's a plausible fit for short, static
 * > copy moments like the primer screen's headline ("Explain it to
 * > Knowie" plus its value-prop lines) or the summary screen's title
 * > ("Here's how it went"). One thing to do: This is inferred with no
 * > real usage to check it against. Before using it on the primer or
 * > summary screens, check whether their actual headline treatment
 * > (already built in the beta, e.g. "Amazing job!") matches any of the
 * > 4 textBlock sizes, so you're not fighting the system on your two
 * > highest-visibility screens.
 *
 * No token gaps here — unlike every other component built so far
 * (Button, ButtonIcon, Chips, ProgressIndicator, MicButton all have at
 * least one unbound literal), every value on this component is a real
 * bound token: all 8 text runs (Header + Caption x 4 sizes) resolve to
 * one of 7 named text styles already compiled into tokens.css
 * (display.m, headline.xl, headline.xsRegular, body.mBold, body.sBold,
 * caption.mRegular, caption.sRegular — Header and Caption share
 * headline.xsRegular at XL and L, everything else is size-specific),
 * and the Header-to-Caption gap is genuinely bound too (space/100 at
 * XL/L, space/050 at M/S — confirmed via get_variable_defs, not by
 * matching numbers).
 *
 * Two things resolved from the design-to-code reference output, not
 * copied verbatim (per the design-to-code workflow: treat that output
 * as a reference, lean on the screenshot when it conflicts):
 *
 * - The reference code's XL/L branch adds a `text-center` class to the
 *   container. The component's own screenshot shows Header and Caption
 *   left-aligned at every size, XL and L included — this reproduces the
 *   screenshot, not the raw class, since the two disagree.
 * - The reference code also puts a `tracking-loose` utility on the M/S
 *   container itself, on top of the per-run letter-spacing each `<p>`
 *   already sets from its own text style. Left out as vestigial: every
 *   character in the block is inside one `<p>` or the other, so a
 *   container-level tracking value has nothing left to apply to.
 *
 * Figma's own raw XL/L header letter-spacing renders as an absolute
 * pixel value (`-0.72px`, `-0.44px`) rather than `var(...)` — this is
 * that instance's own font-size multiplied through the text style's
 * real percentage-based tracking (`typography.tracking.tight`, -1%),
 * the exact conversion design-system.md's own rule #9 warns about. Each
 * size below binds directly to its named type-scale style's own
 * `letter-spacing` var instead of reproducing that resolved pixel
 * number, so it stays correct if the underlying tracking value ever
 * changes.
 */

export type TextBlockVariant = 'XL' | 'L' | 'M' | 'S'

export interface TextBlockProps {
  /** Which of the four sizes this instance uses. */
  variant?: TextBlockVariant
  /** The header text. Always shown — this is the content that defines the block. */
  title?: string
  /** The caption text under the header. */
  caption?: string
  /** Shows the caption. The header can't be hidden — see the component doc comment. */
  showCaption?: boolean
  className?: string
  style?: CSSProperties
}

// variant=XL,L,M,S -> Header type style, Caption type style, and the
// gap between them. All confirmed bound via get_variable_defs, not
// matched by value. XL and L share the exact same Caption style
// (Headline XS Regular) — confirmed from the design context's own
// "styles contained in this design" list, not assumed from the two
// sizes merely looking similar (the same kind of check Chips' own XS/S
// shared-style note makes).
const SIZE_CONFIG: Record<
  TextBlockVariant,
  { headerTypeScale: string; captionTypeScale: string; gapVar: string }
> = {
  XL: {
    headerTypeScale: '--type-scale-display-m',
    captionTypeScale: '--type-scale-headline-xs-regular',
    gapVar: '--size-space-100',
  },
  L: {
    headerTypeScale: '--type-scale-headline-xl',
    captionTypeScale: '--type-scale-headline-xs-regular',
    gapVar: '--size-space-100',
  },
  M: {
    headerTypeScale: '--type-scale-body-m-bold',
    captionTypeScale: '--type-scale-caption-m-regular',
    gapVar: '--size-space-050',
  },
  S: {
    headerTypeScale: '--type-scale-body-s-bold',
    captionTypeScale: '--type-scale-caption-s-regular',
    gapVar: '--size-space-050',
  },
}

function typeStyle(typeScaleVar: string, colorVar: string): CSSProperties {
  return {
    margin: 0,
    width: '100%',
    color: `var(${colorVar})`,
    fontFamily: `var(${typeScaleVar}-font-family)`,
    fontWeight: `var(${typeScaleVar}-font-weight)`,
    fontSize: `var(${typeScaleVar}-font-size)`,
    lineHeight: `var(${typeScaleVar}-line-height)`,
    letterSpacing: `var(${typeScaleVar}-letter-spacing)`,
  }
}

export function TextBlock({
  variant = 'XL',
  title = 'Header', // Matches Figma's own default-instance placeholder text.
  caption = 'Caption', // Matches Figma's own default-instance placeholder text.
  showCaption = true,
  className,
  style,
}: TextBlockProps) {
  const config = SIZE_CONFIG[variant]

  return (
    <div
      className={`flex flex-col items-start ${className ?? ''}`}
      style={{ gap: `var(${config.gapVar})`, ...style }}
    >
      <p style={typeStyle(config.headerTypeScale, '--semantic-color-text-primary')}>{title}</p>
      {showCaption && (
        <p style={typeStyle(config.captionTypeScale, '--semantic-color-text-secondary')}>{caption}</p>
      )}
    </div>
  )
}
