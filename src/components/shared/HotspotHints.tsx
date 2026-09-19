'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Prototype-layer affordance, not a design-system component and not part
 * of the product UI — it has no Figma counterpart and no Storybook story.
 * Borrowed from Figma's own prototype viewer: when a tap lands on
 * something that isn't a live destination, briefly outline every element
 * that is, so a tester can find the way forward instead of concluding the
 * prototype is broken.
 *
 * Opt-in by marking the live element with `data-hotspot` (or its wrapper
 * with `data-hotspot-within`). A live element
 * can't be detected automatically: a dead button is still an enabled
 * `<button>` with no handler, indistinguishable from a wired one at runtime.
 *
 * The outline binds `border/focus`, the closest existing token in meaning
 * ("visible indicator on any focusable element"). No token exists for a
 * hotspot hint specifically; reusing this one is Mia's call, not a new
 * value. Two layers: a crisp 2px line (`size/space/050`) and a wider 4px
 * halo (`size/space/100`) at reduced opacity with a 2px blur, the same
 * spacing-as-inset reuse the study-plan progress bar already makes. The
 * halo's 0.3 opacity and the 150ms / 600ms / 300ms timings are unbound
 * literals — tokens.json has no alpha variant of `border/focus` and no
 * motion tokens. Square elements get `size/radius/400` (16px) on the hint
 * only, the same radius the type-instead input already uses.
 */

// `data-hotspot-pad="200"` grows that element's hint by `size/space/200` on every
// side, for controls whose own box is tight against their content (a bare text
// link, a mic with its caption). The hint only — layout and tap area don't change.
// `data-hotspot` marks one live element. `data-hotspot-within` marks a
// wrapper whose enabled buttons are all live — for AppBar and ButtonGroup,
// which build their buttons internally and don't take a per-button attribute.
const HOTSPOT_SELECTOR = '[data-hotspot], [data-hotspot-within] button:not(:disabled)'

const FADE_IN_MS = 150
const HOLD_MS = 600
const FADE_OUT_MS = 300
const HALO_OPACITY = 0.3

// Square elements (AppBar icon buttons, Tertiary buttons, MicButton) have no
// radius of their own, and a sharp outline around them reads harsher than the
// rounded controls beside it. Round only the hint, never the element.
function radiusOf(el: HTMLElement) {
  const radius = getComputedStyle(el).borderRadius
  return radius === '0px' ? 'var(--size-radius-400)' : radius
}

interface Hint {
  top: number
  left: number
  width: number
  height: number
  borderRadius: string
  pad: string | null
}

export function HotspotHints() {
  const [hints, setHints] = useState<Hint[]>([])
  const [visible, setVisible] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      const target = event.target
      if (!(target instanceof Element)) return
      if (target.closest(HOTSPOT_SELECTOR)) return

      const next = Array.from(document.querySelectorAll<HTMLElement>(HOTSPOT_SELECTOR)).map((el) => {
        const rect = el.getBoundingClientRect()
        return {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          borderRadius: radiusOf(el),
          pad: el.dataset.hotspotPad ?? null,
        }
      })
      if (next.length === 0) return

      setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      setHints(next)
      setVisible(true)

      if (holdTimer.current) clearTimeout(holdTimer.current)
      holdTimer.current = setTimeout(() => setVisible(false), FADE_IN_MS + HOLD_MS)
    }

    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      if (holdTimer.current) clearTimeout(holdTimer.current)
    }
  }, [])

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1000,
        opacity: visible ? 1 : 0,
        transition: reducedMotion ? 'none' : `opacity ${visible ? FADE_IN_MS : FADE_OUT_MS}ms ease-out`,
      }}
    >
      {hints.map((hint, i) => {
        const pad = hint.pad ? `var(--size-space-${hint.pad})` : '0px'
        const box = {
          position: 'absolute',
          top: `calc(${hint.top}px - ${pad})`,
          left: `calc(${hint.left}px - ${pad})`,
          width: `calc(${hint.width}px + 2 * ${pad})`,
          height: `calc(${hint.height}px + 2 * ${pad})`,
          borderRadius: hint.borderRadius,
        } as const
        return (
          <div key={i}>
            {/* Outer halo: wider, translucent, softened edge. Starts where
                the crisp line ends (gap + line width), so it never fills the gap. */}
            <div
              style={{
                ...box,
                outline: 'var(--size-space-100) solid var(--semantic-color-border-focus)',
                outlineOffset: 'calc(var(--size-space-050) + var(--size-space-050))',
                opacity: HALO_OPACITY,
                filter: 'blur(var(--size-space-050))',
              }}
            />
            {/* Inner crisp line */}
            <div
              style={{
                ...box,
                outline: 'var(--size-space-050) solid var(--semantic-color-border-focus)',
                outlineOffset: 'var(--size-space-050)',
              }}
            />
          </div>
        )
      })}
    </div>
  )
}
