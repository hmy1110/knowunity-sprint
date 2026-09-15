import type { CSSProperties } from 'react'
import Image from 'next/image'

/**
 * Knowunity `mascotSlot` — Figma component set, node 9003:8873 in the
 * "Yummy__Knowie Design System" file (🎨 Mascot & components page).
 *
 * Figma's own component description (verbatim):
 *
 * > What it is: 4-size wrapper (XL/2XL/3XL/4XL) around Knowie's animated
 * > emotional-state instance, swapping between "standby" and "approving"
 * > in real usage, at sizes 2XL and 3XL respectively. When to use it:
 * > The hero mascot component for the feature: 2XL/standby on the study
 * > plan card (StudyPlan-notStarted, StudyPlan-inProgress,
 * > StudyPlan-finish) and 3XL/approving on every Learning-* screen, idle
 * > through result. One thing to do: A third pose, "thinking," is in
 * > real use on Learning-processing and Learning-typeProcessing for the
 * > wait state, but isn't in the Homie swap's preferred-values list on
 * > .mascotSlotBase, so both screens place it as a bare 70x70 instance
 * > outside mascotSlot entirely rather than through the size+pose
 * > pattern every other screen uses. Add it to the preferred list so the
 * > wait state can use the real component like everything else, or
 * > confirm the gap is intentional. 4XL and XL have zero real usage.
 *
 * No existing Storybook component covers this — checked Button,
 * ButtonIcon, ButtonGroup, Chips, IconSlot, MicButton, StatusIndicator,
 * ProgressIndicator, TextBlock; none is an illustration wrapper, so this
 * is a new component, not a reuse of one of those.
 *
 * **`size` is mascotSlot's only real Figma variant** — confirmed
 * straight from the live node's own `componentPropertyDefinitions`
 * (`{ size: { type: VARIANT, options: [XL, 2XL, 3XL, 4XL] } }`), not
 * assumed from the description's prose. The pose ("Homie swap") the
 * description talks about is a separate, deeper property: an
 * INSTANCE_SWAP property named `Homie` defined on the nested
 * `.mascotSlotBase` instance inside each size variant, not a top-level
 * variant of mascotSlot itself — which is exactly why it doesn't show
 * up as a named "size=X, pose=Y" symbol pattern the way every other
 * component set's variants do.
 *
 * **A real gap, flagged rather than guessed around:** that `Homie`
 * property's own `preferredValues` list has 16 entries, but every one
 * of them is a component key from a library this Figma session can't
 * resolve — `importComponentByKeyAsync` fails on all 16 with "Could not
 * find a published component," meaning the library isn't currently
 * enabled/shared into this file from here. There was no way to read
 * Figma's own 16 pose names directly. Built against this project's own
 * `public/images/*.svg` instead — CLAUDE.md already names that folder
 * as the source for "Knowie expressions... when a screen needs a mascot
 * state," and the live document's actual default instance under
 * `.mascotSlotBase` is itself literally named "standby," matching one
 * of those 7 files exactly. The 7 local files (amazed, approving,
 * confused, dazed, determined, standby, thinking) are used as the
 * `pose` options below — real assets already in the project, not
 * invented ones — but whether they're the exact same 7 (of 16) Figma
 * poses, under the exact same names, isn't independently confirmed from
 * here. Flagging that mapping as open, not asserting it.
 *
 * **`pose="thinking"` specifically is a judgment call, named here for
 * Mia rather than made silently:** Figma's own description says
 * "thinking" isn't in the Homie swap's preferred-values list at all —
 * real screens bypass mascotSlot for it. Since the art already exists
 * locally and the description's own "one thing to do" is "confirm the
 * gap is intentional or add it to the preferred list," exposing it here
 * matches that suggested resolution rather than the current real-file
 * state. If the gap is meant to stay open, drop `'thinking'` from
 * `MascotSlotPose` and keep rendering it as the bare instance the two
 * processing screens already use.
 *
 * **Structural simplification, not a gap:** Figma's own base composites
 * two layers per pose (a body SVG plus a separate eyes-overlay SVG,
 * inset ~29–38% into the body, with its own `homie/eyes` color and, at
 * XL specifically, a differently-shaped overlay than 2XL/3XL/4XL share).
 * The local `public/images/*.svg` files are already flattened single
 * exports with the eyes baked in — reproducing Figma's two-layer
 * composite on top of an already-flat asset would double-draw eyes that
 * are already part of the image, so this renders one `<img>` per pose
 * instead.
 */

export type MascotSlotSize = 'XL' | '2XL' | '3XL' | '4XL'

// The 7 local expressions in public/images/*.svg — standby/approving/
// thinking have real-screen precedent per Figma's own description
// (thinking with the caveat above); amazed/confused/dazed/determined
// don't appear in design-system.md's mascotSlot section at all, but are
// real assets already in this project (see doc comment above), not new
// art invented for this component.
export type MascotSlotPose = 'standby' | 'approving' | 'thinking' | 'amazed' | 'confused' | 'dazed' | 'determined'

export interface MascotSlotProps {
  /** Which of the four sizes this instance uses. */
  size?: MascotSlotSize
  /** Which of Knowie's expressions this instance shows — see the component doc comment for how this maps to Figma's own (currently unresolvable) Homie swap. */
  pose?: MascotSlotPose
  className?: string
  style?: CSSProperties
}

// size=XL,2XL,3XL,4XL -> the illustration token this slot sizes itself
// to. Confirmed bound via get_variable_defs, not matched by value.
const SIZE_VAR: Record<MascotSlotSize, string> = {
  XL: '--size-illustration-800',
  '2XL': '--size-illustration-1500',
  '3XL': '--size-illustration-2500',
  '4XL': '--size-illustration-4000',
}

export function MascotSlot({ size = 'XL', pose = 'standby', className, style }: MascotSlotProps) {
  const sizeVar = SIZE_VAR[size]

  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center ${className ?? ''}`}
      style={{
        width: `var(${sizeVar})`,
        height: `var(${sizeVar})`,
        padding: 'var(--size-space-300)',
        ...style,
      }}
    >
      <Image alt="" src={`/images/${pose}.svg`} fill sizes="320px" style={{ objectFit: 'contain' }} />
    </div>
  )
}
