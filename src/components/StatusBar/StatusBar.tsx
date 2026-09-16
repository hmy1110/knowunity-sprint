/**
 * Knowunity `StatusBar` — not a Figma component, not a component-system
 * instance at all. Every real screen frame in the "Yummy__Knowie Design
 * System" file (Summary node 13622:17388, Primer-intro node
 * 13622:15919, and by the same "Panel Header"/"Status Bar" layer names,
 * every other screen frame too) draws this as its own top strip: the
 * iOS status bar mock (09:41 clock, wifi, cellular, battery), not real
 * OS chrome, baked into the design frame itself.
 *
 * Built inline first for Summary (2026-09-16), then promoted here once
 * Primer-intro needed the identical row — design-system.md §1's own
 * rule for a pattern repeated across screens (see `component-gaps.md`).
 *
 * All icon glyphs are Figma's own real exported assets (wifi, cellular,
 * battery cap), pulled via `get_design_context` and recolored from
 * their hardcoded `fill="#F4F2FF"` to `currentColor`, tinted via
 * `text/primary` on the wrapper — confirmed to match that token
 * exactly, not assumed by eye. Only the clock's own "SF Pro Text
 * Semibold" 15px/-0.3px style and the battery cap glyph's 40% opacity
 * are unbound literals in Figma (OS system font, no type-scale token
 * exists for it) — reproduced as literals, not invented.
 */
function WifiIcon() {
  return (
    <svg viewBox="0 0 15.333 10.9999" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <path
        d="M5.44825 8.42669C6.72891 7.34442 8.60509 7.34442 9.88575 8.42669C9.9501 8.4849 9.98749 8.56751 9.98926 8.65423C9.99092 8.74086 9.95644 8.82399 9.89454 8.8847L7.88965 10.9072C7.83087 10.9666 7.7506 10.9999 7.667 10.9999C7.5834 10.9999 7.50311 10.9666 7.44434 10.9072L5.43848 8.8847C5.37688 8.824 5.34303 8.74066 5.34473 8.65423C5.34657 8.56755 5.3839 8.48485 5.44825 8.42669ZM2.77247 5.72942C5.5316 3.16504 9.80432 3.1651 12.5635 5.72942C12.6258 5.78956 12.6612 5.87238 12.6621 5.95892C12.6629 6.04526 12.6293 6.12811 12.5684 6.18938L11.4092 7.36028C11.2897 7.47959 11.0971 7.48144 10.9746 7.36517C10.0685 6.5454 8.88933 6.09165 7.667 6.09173C6.4456 6.09225 5.26773 6.5461 4.36231 7.36517C4.23976 7.48151 4.04623 7.47979 3.92676 7.36028L2.76856 6.18938C2.70748 6.12818 2.67313 6.04533 2.67383 5.95892C2.67465 5.87244 2.71026 5.78954 2.77247 5.72942ZM0.0966847 3.03899C4.3285 -1.01307 11.0044 -1.01292 15.2363 3.03899C15.2976 3.09919 15.3325 3.18166 15.333 3.26751C15.3335 3.35327 15.2998 3.43615 15.2393 3.497L14.0791 4.66692C13.9595 4.78702 13.765 4.7881 13.6436 4.66985C12.0312 3.13845 9.89158 2.28421 7.667 2.28411C5.44211 2.28412 3.30199 3.13822 1.68946 4.66985C1.56818 4.78822 1.37441 4.78703 1.25489 4.66692L0.0937551 3.497C0.0333244 3.43612 -0.0004758 3.35324 5.06144e-06 3.26751C0.000570337 3.18166 0.0353826 3.09915 0.0966847 3.03899Z"
        fill="currentColor"
      />
    </svg>
  )
}

function CellularIcon() {
  return (
    <svg viewBox="0 0 15.9004 10.667" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <path
        d="M2 6.66699C2.55228 6.66699 3 7.11471 3 7.66699V9.66699C2.99982 10.2191 2.55218 10.667 2 10.667H1C0.447824 10.667 0.000175712 10.2191 0 9.66699V7.66699C0 7.11471 0.447715 6.66699 1 6.66699H2ZM6.2998 4.66699C6.85209 4.66699 7.2998 5.11471 7.2998 5.66699V9.66699C7.29961 10.2191 6.85197 10.667 6.2998 10.667H5.2998C4.74773 10.6669 4.3 10.219 4.2998 9.66699V5.66699C4.2998 5.11477 4.7476 4.66709 5.2998 4.66699H6.2998ZM10.5996 2.33301C11.1518 2.33301 11.5994 2.78089 11.5996 3.33301V9.66699C11.5995 10.2191 11.1518 10.667 10.5996 10.667H9.59961C9.04759 10.6668 8.59976 10.219 8.59961 9.66699V3.33301C8.59981 2.78101 9.04761 2.33321 9.59961 2.33301H10.5996ZM14.9004 0C15.4525 0.00023083 15.9004 0.447858 15.9004 1V9.66699C15.9002 10.219 15.4524 10.6668 14.9004 10.667H13.9004C13.3482 10.667 12.9006 10.2191 12.9004 9.66699V1C12.9004 0.447715 13.3481 0 13.9004 0H14.9004Z"
        fill="currentColor"
      />
    </svg>
  )
}

function BatteryCapIcon() {
  return (
    <svg viewBox="0 0 1.32804 4" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <path
        opacity="0.4"
        d="M0 0V4C0.804731 3.66122 1.32804 2.87313 1.32804 2C1.32804 1.12687 0.804731 0.338777 0 0"
        fill="currentColor"
      />
    </svg>
  )
}

export function StatusBar() {
  return (
    <div className="relative w-full shrink-0" style={{ height: 48, color: 'var(--semantic-color-text-primary)' }}>
      <p
        className="absolute -translate-x-1/2 text-center"
        style={{
          margin: 0,
          left: 50,
          top: 'calc(50% - 9px)',
          width: 54,
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 600,
          fontSize: 15,
          letterSpacing: '-0.3px',
        }}
      >
        09:41
      </p>
      <div className="absolute bottom-0 right-0 top-0" style={{ width: 88 }}>
        <div className="absolute" style={{ top: '37.5%', right: '53.34%', bottom: '39.58%', left: '29.24%' }}>
          <WifiIcon />
        </div>
        <div className="absolute" style={{ top: '37.5%', right: '77.39%', bottom: '40.28%', left: '4.55%' }}>
          <CellularIcon />
        </div>
        <div
          className="absolute"
          style={{
            top: 18,
            right: 19.5,
            width: 22,
            height: 11.333,
            borderRadius: 3,
            border: '1px solid var(--semantic-color-background-inverse)',
            background: 'var(--semantic-color-text-primary)',
            opacity: 0.35,
          }}
        />
        <div className="absolute" style={{ top: 21.67, right: 17.17, width: 1.328, height: 4 }}>
          <BatteryCapIcon />
        </div>
        <div
          className="absolute"
          style={{
            top: 20,
            right: 21.5,
            width: 18,
            height: 7.333,
            borderRadius: 1.5,
            background: 'var(--semantic-color-text-primary)',
          }}
        />
      </div>
    </div>
  )
}
