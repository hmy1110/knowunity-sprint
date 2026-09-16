import type { CSSProperties } from 'react'
import { IconSlot } from '../IconSlot/IconSlot'
import { ButtonIcon } from '../ButtonIcon/ButtonIcon'

/**
 * Knowunity `Text Field` — Figma component set, node 4517:2132 in the
 * "Yummy__Knowie Design System" file (🎨 Mascot & components page).
 *
 * Figma's own component description is empty — nothing to quote here.
 *
 * **Reuses IconSlot** (../IconSlot/IconSlot.tsx) for the leading icon at
 * `icon/300`, and **ButtonIcon** (../ButtonIcon/ButtonIcon.tsx,
 * `variant="Secondary" size="S"`) for the trailing icon. Neither is an
 * exact match — see the two gaps below — but both are the closest real
 * components already in this codebase, per Mia's call to substitute
 * rather than build the mismatched components new.
 *
 * Gaps found while building this (flagged, not silently invented):
 *
 * - **The leading icon lives inside an undocumented wrapper component
 *   named "Icon Slot" (Title Case, sizes XXS–M)** — a different,
 *   unbuilt component from this codebase's own `IconSlot` (camelCase,
 *   sizes 100–400). Its M size and this component's `icon/300` size are
 *   both 24px, so it's dropped as redundant the same way InlineAlert
 *   drops Figma's own redundant "Icon Container" — `IconSlot` is used
 *   directly. Confirmed via the Desktop Bridge plugin, not assumed.
 * - **The trailing icon (shown when `showTrailingIcon`) is an
 *   undocumented component named "Button icon" (Title Case,
 *   `Variant=Subtle/Primary/Neutral`, `Size=S/M`)** — again a different,
 *   unbuilt component from this codebase's own `ButtonIcon` (camelCase,
 *   `Primary/Secondary/Tertiary`). There is no "Subtle" variant to map
 *   to, so `variant="Secondary" size="S"` is used as the closest
 *   built analog, per Mia's call — this is an approximation, not a
 *   match, and should be revisited if "Button icon" is ever formalized.
 * - **The field's fill is bound to a stray duplicate Figma variable**
 *   also named `background/input` that resolves to white at 10%
 *   opacity — not the canonical `background/input` variable
 *   (`color/navy/900` → `#1a1c26`) that's actually exported to
 *   tokens.json and used here. Confirmed by resolving both variables'
 *   full alias chains via the plugin API: two distinct local variables
 *   share the name in this file. This is the same class of bug
 *   design-system.md §3 already warns about for remote duplicates —
 *   bind to the canonical local variable, not whichever one an instance
 *   happens to reference. Flagging for a Figma-side fix.
 * - **The Error variant's border and caption color are bound to a
 *   stray variable literally named `feedback/error`** (no role suffix,
 *   not exported to tokens.json at all, and not matching the
 *   `group/family/role` naming convention design-system.md §3
 *   documents) instead of a real token. `border/error` ("Invalid input
 *   edge. Used for text fields... that failed validation") and
 *   `text/error` ("Validation message text. Used for the line under a
 *   failed field.") exist and are described for exactly this — used
 *   here instead. Same value either way (`#ff6b6b`), different (wrong)
 *   binding in Figma.
 * - **No text in this component is bound to a Figma text style at
 *   all** — Title and the field's own text run "Inter Variable"
 *   SemiBold 14px, and the caption runs "Inter Variable" Regular 11px.
 *   Neither the font family (every other text style in this file uses
 *   "Greed VF-TRIAL") nor either size (14px and 11px are not steps in
 *   the type scale) exists as a token. Per Mia's call, the closest
 *   existing named text styles are used as an approximation —
 *   `headline.xxsBold` (15px/600) for the title and field text,
 *   `caption.sRegular` (9px/400) for the caption — not a Figma match.
 * - **Figma models the field's own displayed text as a hardcoded
 *   literal, not a component property**, except in the Placeholder
 *   variant (where it's the real `Placeholder` property). Default and
 *   Error both show the fixed string "User input..." with no property
 *   backing it — reproduced as a literal here for the same reason,
 *   rather than inventing a new prop Figma doesn't model.
 * - The icon-swap ids resolve to `search-lg` (leading) and `x-circle`
 *   (trailing) — traced inline as real vector paths (fill swapped for
 *   `currentColor`), not fetched from Figma's expiring asset URLs.
 * - The pill's 1px stroke weight and the field-text row's 10px item
 *   spacing are both unbound literals in Figma (no bound variable on
 *   either) — reproduced as literals, matching the same treatment
 *   ButtonIcon already gives its own unbound border width.
 * - The `(Error) caption` Figma property name isn't a valid JS
 *   identifier — named `caption` here instead, the same kind of rename
 *   IconSlot already flags for its own `Size (IGNORE)` property.
 */

export type TextFieldVariant = 'Default' | 'Error' | 'Placeholder'

export interface TextFieldProps {
  /** Which of the three variants this instance is — see the component doc comment. */
  variant?: TextFieldVariant
  /** Shows the title label above the field. */
  showTitle?: boolean
  /** Shows the caption line below the field. */
  showCaption?: boolean
  /** Shows the leading (search) icon inside the field. */
  showLeadingIcon?: boolean
  /** Shows the trailing (clear) icon inside the field. */
  showTrailingIcon?: boolean
  /** Title label text. Defaults to Figma's own placeholder text. */
  titleText?: string
  /** Field text shown only when `variant` is "Placeholder". Defaults to Figma's own placeholder text. */
  placeholder?: string
  /** Caption text, shown when showCaption is true. Defaults to Figma's own placeholder text for the variant. */
  caption?: string
  className?: string
  style?: CSSProperties
}

// variant -> caption's default literal, matching Figma's own per-variant
// default (only Error's is a real bound property; Default/Placeholder's
// is a hardcoded literal — see doc comment above).
const DEFAULT_CAPTION: Record<TextFieldVariant, string> = {
  Default: 'Explanation text',
  Error: 'Explanation message',
  Placeholder: 'Explanation text',
}

function SearchIcon() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M19 11.5C19 7.35786 15.6421 4 11.5 4C7.35786 4 4 7.35786 4 11.5C4 15.6421 7.35786 19 11.5 19C13.5199 19 15.3517 18.1999 16.7002 16.9014C16.7284 16.8638 16.7588 16.8272 16.793 16.793C16.8271 16.7588 16.8638 16.7284 16.9014 16.7002C18.1999 15.3517 19 13.5199 19 11.5ZM21 11.5C21 13.7631 20.2068 15.8398 18.8857 17.4717L21.707 20.293C22.0975 20.6835 22.0975 21.3165 21.707 21.707C21.3165 22.0975 20.6835 22.0975 20.293 21.707L17.4717 18.8857C15.8398 20.2068 13.7631 21 11.5 21C6.25329 21 2 16.7467 2 11.5C2 6.25329 6.25329 2 11.5 2C16.7467 2 21 6.25329 21 11.5Z"
        fill="currentColor"
      />
    </svg>
  )
}

function XCircleIcon() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13.3333 7.33333C13.3333 4.01962 10.647 1.33333 7.33333 1.33333C4.01962 1.33333 1.33333 4.01962 1.33333 7.33333C1.33333 10.647 4.01962 13.3333 7.33333 13.3333C10.647 13.3333 13.3333 10.647 13.3333 7.33333ZM8.86198 4.86198C9.12233 4.60163 9.54434 4.60163 9.80469 4.86198C10.065 5.12233 10.065 5.54434 9.80469 5.80469L8.27604 7.33333L9.80469 8.86198C10.065 9.12233 10.065 9.54434 9.80469 9.80469C9.54434 10.065 9.12233 10.065 8.86198 9.80469L7.33333 8.27604L5.80469 9.80469C5.54434 10.065 5.12233 10.065 4.86198 9.80469C4.60163 9.54434 4.60163 9.12233 4.86198 8.86198L6.39063 7.33333L4.86198 5.80469C4.60163 5.54434 4.60163 5.12233 4.86198 4.86198C5.12233 4.60163 5.54434 4.60163 5.80469 4.86198L7.33333 6.39063L8.86198 4.86198ZM14.6667 7.33333C14.6667 11.3834 11.3834 14.6667 7.33333 14.6667C3.28325 14.6667 0 11.3834 0 7.33333C0 3.28325 3.28325 0 7.33333 0C11.3834 0 14.6667 3.28325 14.6667 7.33333Z"
        fill="currentColor"
      />
    </svg>
  )
}

// No bound type style exists for either text run in this component, and
// CLAUDE.md forbids reading the font/* primitive layer directly — the
// closest existing named text styles are used as an approximation per
// Mia's call, not a Figma match. See doc comment above.
const FIELD_TEXT_STYLE: CSSProperties = {
  fontFamily: 'var(--type-scale-headline-xxs-bold-font-family)',
  fontWeight: 'var(--type-scale-headline-xxs-bold-font-weight)' as unknown as number,
  fontSize: 'var(--type-scale-headline-xxs-bold-font-size)',
  lineHeight: 'var(--type-scale-headline-xxs-bold-line-height)',
  letterSpacing: 'var(--type-scale-headline-xxs-bold-letter-spacing)',
}

const CAPTION_TEXT_STYLE: CSSProperties = {
  fontFamily: 'var(--type-scale-caption-s-regular-font-family)',
  fontWeight: 'var(--type-scale-caption-s-regular-font-weight)' as unknown as number,
  fontSize: 'var(--type-scale-caption-s-regular-font-size)',
  lineHeight: 'var(--type-scale-caption-s-regular-line-height)',
  letterSpacing: 'var(--type-scale-caption-s-regular-letter-spacing)',
}

export function TextField({
  variant = 'Default',
  showTitle = true,
  showCaption = false,
  showLeadingIcon = true,
  showTrailingIcon = false,
  titleText = 'E.g., Name',
  placeholder = 'Tell us more about yourself',
  caption: captionProp,
  className,
  style,
}: TextFieldProps) {
  const caption = captionProp ?? DEFAULT_CAPTION[variant]
  const fieldText = variant === 'Placeholder' ? placeholder : 'User input...'
  const borderVar =
    variant === 'Error' ? '--semantic-color-border-error' : '--semantic-color-border-default'
  const fieldTextColorVar =
    variant === 'Placeholder' ? '--semantic-color-text-secondary' : '--semantic-color-text-primary'
  const captionColorVar =
    variant === 'Error' ? '--semantic-color-text-error' : '--semantic-color-text-secondary'

  return (
    <div
      className={`flex flex-col ${className ?? ''}`}
      style={{ gap: 'var(--size-space-150)', width: '100%', ...style }}
    >
      {showTitle && (
        <p
          className="m-0"
          style={{ ...FIELD_TEXT_STYLE, color: 'var(--semantic-color-text-primary)' }}
        >
          {titleText}
        </p>
      )}
      <div className="flex flex-col" style={{ gap: 'var(--size-space-050)' }}>
        <div
          className="flex items-center"
          style={{
            gap: 'var(--size-space-150)',
            paddingLeft: 'var(--size-space-300)',
            paddingRight: 'var(--size-space-300)',
            borderRadius: 'var(--size-radius-400)',
            background: 'var(--semantic-color-background-input)',
            border: `1px solid var(${borderVar})`, // Unbound stroke weight in Figma — see doc comment above.
          }}
        >
          {showLeadingIcon && (
            <IconSlot size="300" icon={<SearchIcon />} style={{ color: 'var(--semantic-color-text-primary)' }} />
          )}
          <div
            className="flex flex-1 items-center"
            style={{ paddingTop: 'var(--size-space-300)', paddingBottom: 'var(--size-space-300)' }}
          >
            <p
              className="m-0 flex-1"
              style={{ ...FIELD_TEXT_STYLE, color: `var(${fieldTextColorVar})` }}
            >
              {fieldText}
            </p>
          </div>
          {showTrailingIcon && (
            <ButtonIcon variant="Secondary" size="S" icon={<XCircleIcon />} label="Clear input" />
          )}
        </div>
        {showCaption && (
          <p className="m-0" style={{ ...CAPTION_TEXT_STYLE, color: `var(${captionColorVar})` }}>
            {caption}
          </p>
        )}
      </div>
    </div>
  )
}
