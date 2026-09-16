/**
 * Small, screen-agnostic icon glyphs reused across more than one route.
 * Not a Figma component (icons here are raw exported/real assets, not
 * instance-swappable content) — kept out of `src/app/*` screen files
 * once a glyph is needed on a second screen, per design-system.md §1's
 * repeated-pattern rule. Single-use icons (e.g. Primer-intro's bullet
 * row icons) stay inline in their own screen file until a second real
 * usage shows up.
 */

// Figma's own real "arrow-left" asset (component 3248:79269) — the
// literal left-icon content on every Primer/Learning/Summary
// topNavigation row's live frame (confirmed directly against Summary
// and Primer-intro, not assumed from one). Recolored from its
// hardcoded `fill="#F4F2FF"` to `currentColor`, tinted via `text/
// primary` on the caller.
export function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <path
        d="M11.293 4.29297C11.6835 3.90244 12.3165 3.90244 12.707 4.29297C13.0976 4.68349 13.0976 5.31651 12.707 5.70703L7.41406 11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H7.41406L12.707 18.293C13.0976 18.6835 13.0976 19.3165 12.707 19.707C12.3165 20.0976 11.6835 20.0976 11.293 19.707L4.29297 12.707C3.90244 12.3165 3.90244 11.6835 4.29297 11.293L11.293 4.29297Z"
        fill="currentColor"
      />
    </svg>
  )
}
