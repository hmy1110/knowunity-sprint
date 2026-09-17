'use client'

import type { ReactNode } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AppBar } from '@/components/AppBar/AppBar'
import { Button } from '@/components/Button/Button'
import { ButtonGroup } from '@/components/ButtonGroup/ButtonGroup'
import { MascotSlot } from '@/components/MascotSlot/MascotSlot'
import { ScoreBreakdown } from '@/components/ScoreBreakdown/ScoreBreakdown'
import { ArrowLeftIcon } from '@/components/shared/icons'
import { StatusBar } from '@/components/StatusBar/StatusBar'
import { Table } from '@/components/Table/Table'
import { TableCell } from '@/components/TableCell/TableCell'
import { TermResultList, type TermResultRow } from '@/components/TermResultList/TermResultList'
import type { TagStatus } from '@/components/Tag/Tag'

// `Summary-all recalled` (node 13669:17569) — the second real Summary
// instance, shown when all 4 terms resolve Recalled. Deliberately
// unreachable, same reasoning as Session's `topic2ResultUnaided`/
// `topic3ResultUnaided`: this sprint's fixed script always produces one
// of each outcome, so this variant is never actually reached by a real
// run. Built for visual completeness only, gated behind `?variant=
// all-recalled` (nothing in the app sets this — reached only by typing
// the URL directly) rather than a bare unconditional branch, so it's at
// least previewable without editing code, unlike the Session variants.
const ALL_RECALLED_RESULTS: TermResultRow[] = [
  {
    term: 'Inspiration',
    status: 'Recalled',
    reflection: 'personal experience and the world around you, in your own words, first try.',
  },
  {
    term: 'Divergent thinking',
    status: 'Recalled',
    reflection: 'many possible ideas before narrowing to one, in your own words, first try.',
  },
  {
    term: 'Visual hierarchy',
    status: 'Recalled',
    reflection: 'arranging elements to guide attention and show what matters most, in your own words, first try.',
  },
  {
    term: 'Visual research',
    status: 'Recalled',
    reflection: 'uses visual media (images, video, diagrams) as data for research, in your own words, first try.',
  },
]

const ALL_RECALLED_XP = '8'
const ALL_RECALLED_SCORE = '4/4'
const ALL_RECALLED_PACE = '2:09'

// SPEC.md's fixed script: term 1 Recalled, term 2 Hinted, term 3
// Revealed, term 4 Skipped, every session. Hardcoded here per SPEC.md's
// own build-order note ("Build Summary against a hardcoded sample
// result array first; wire it to Session's real output last") — Session
// doesn't exist yet.
const TERM_RESULTS: TermResultRow[] = [
  {
    term: 'Inspiration',
    status: 'Recalled',
    reflection: 'personal experience and the world around you, in your own words, first try.',
  },
  {
    term: 'Divergent thinking',
    status: 'Hinted',
    reflection: 'got there after a nudge toward "many ideas before narrowing."',
  },
  {
    term: 'Visual hierarchy',
    status: 'Revealed',
    reflection: "answer shown after you said you didn't know it, worth a real attempt next time it comes up.",
  },
  {
    term: 'Visual research',
    status: 'Skipped',
    reflection: 'no attempt this time, worth a first pass before it comes up again.',
  },
]

const SESSION_XP = '4'
const SESSION_SCORE = '2/4'
const SESSION_PACE = '2:09'

// `sessionStats` (Summary's XP/Score/time row) — design-system.md §1
// documents this as a hand-built, non-componentized pattern (same
// "chips"-misnamed-layer territory as the standalone XP badge used
// elsewhere), built into code once already on 2026-09-16 and pulled the
// same day after review, then rebuilt here per Mia's direct instruction
// against the live Figma frame (2026-09-16) — see component-gaps.md.
// All three icons below are Figma's own real exported assets
// (Group 2136139938/2136139930/2136139937), recolored from their
// hardcoded hex fills to the bound tokens they numerically match.
function LightningIcon() {
  return (
    <svg viewBox="0 0 23.6313 28.9893" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <path
        d="M6.27965 28.9893C5.0467 28.9893 3.88302 28.3279 3.23191 27.2584C2.5808 26.1889 2.52539 24.8802 3.09337 23.7403C4.13238 21.6294 4.94973 19.997 5.57313 18.7305C4.97743 18.7305 4.31247 18.7305 3.56439 18.7305C2.05437 18.7305 0.738301 17.8017 0.225726 16.3663C-0.300702 14.9309 0.114899 13.3548 1.25088 12.3697C4.25706 9.76631 11.4608 3.99659 15.4921 0.773987C16.1294 0.267377 16.8913 0 17.681 0C18.9693 0 20.1607 0.717697 20.798 1.85757C21.4214 2.98337 21.3937 4.39062 20.7287 5.50235L18.2767 9.59744H20.0638C21.5599 9.59744 22.876 10.5262 23.4024 11.9475C23.9288 13.3689 23.5271 14.945 22.405 15.9441L8.62087 28.0887C7.96976 28.6657 7.13856 28.9753 6.2935 28.9753L6.27965 28.9893Z"
        fill="var(--semantic-color-accent-blue-bold)"
      />
      <path
        d="M6.26565 26.9066C5.94702 26.9066 5.61454 26.794 5.33747 26.5829C4.75563 26.1326 4.58939 25.3445 4.92187 24.6831C7.04144 20.4051 8.23283 17.9846 8.96706 16.6196C7.85879 16.6618 6.15482 16.6618 3.55039 16.6618C2.91313 16.6618 2.359 16.2678 2.13734 15.6627C1.91569 15.0576 2.08193 14.3821 2.58065 13.9599C5.55913 11.3846 12.749 5.62898 16.7665 2.42045C17.3484 1.95606 18.138 1.9842 18.6921 2.47674C19.2463 2.98335 19.3709 3.78548 18.983 4.43282L14.6331 11.6942H20.0775C20.7147 11.6942 21.2689 12.0883 21.4905 12.6934C21.7122 13.2985 21.5459 13.9599 21.0611 14.3961L7.27695 26.5407C6.98603 26.794 6.63969 26.9207 6.29336 26.9207L6.26565 26.9066ZM10.865 16.3522C10.5879 16.901 9.56275 18.9416 6.59813 24.9364L19.7588 13.3407H14.4114C13.8712 13.3407 13.3586 13.0452 13.0954 12.5526C12.8322 12.0742 12.846 11.4831 13.1231 11.0047L17.2652 4.09508C13.2478 7.28953 6.6674 12.5808 3.74434 15.0857C7.94191 15.0153 9.77055 14.9872 10.0892 14.9731C10.2 14.9309 10.297 14.945 10.4217 14.9731C10.7819 15.0576 11.0451 15.3953 11.0451 15.7752C11.0451 16.0426 11.0451 16.2256 10.8511 16.3522H10.865Z"
        fill="var(--semantic-color-accent-blue-on-bold)"
      />
    </svg>
  )
}

function ScoreIcon() {
  return (
    <svg viewBox="0 0 31.5202 29.0175" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <path
        d="M14.2828 29.0175C6.41411 29.0175 0 22.516 0 14.5087C0 6.50149 6.40026 0 14.2828 0C17.5522 0 20.6692 1.1258 23.1628 3.16631L23.1905 3.08188C23.5646 2.05458 24.5066 1.35096 25.5733 1.26652H25.7812C26.7925 1.26652 27.7206 1.81535 28.2055 2.70192L31.1701 8.09168C31.6965 9.06269 31.6273 10.2588 30.9762 11.1313C30.4636 11.849 29.6324 12.2712 28.7458 12.2712C28.6211 12.2712 28.5102 12.2712 28.3856 12.2431C28.4964 12.9748 28.5518 13.7348 28.5518 14.4947C28.5518 22.4878 22.1516 29.0034 14.269 29.0034L14.2828 29.0175Z"
        fill="var(--semantic-color-accent-green-bold)"
      />
      <path
        d="M14.2824 27.0332C7.49427 27.0332 1.9668 21.4183 1.9668 14.5228C1.9668 7.62725 7.49427 2.01233 14.2824 2.01233C21.0706 2.01233 26.5981 7.62725 26.5981 14.5228C26.5981 21.4183 21.0706 27.0332 14.2824 27.0332ZM14.2824 3.65881C8.38089 3.65881 3.58762 8.52789 3.58762 14.5228C3.58762 20.5177 8.38089 25.3867 14.2824 25.3867C20.184 25.3867 24.9772 20.5177 24.9772 14.5228C24.9772 8.52789 20.184 3.65881 14.2824 3.65881Z"
        fill="var(--semantic-color-accent-green-on-bold)"
      />
      <path
        d="M14.2823 22.7834C9.79382 22.7834 6.15039 19.0823 6.15039 14.5228C6.15039 9.96333 9.79382 6.26227 14.2823 6.26227C18.7708 6.26227 22.4142 9.96333 22.4142 14.5228C22.4142 19.0823 18.7708 22.7834 14.2823 22.7834ZM14.2823 7.90875C10.6943 7.90875 7.77125 10.878 7.77125 14.5228C7.77125 18.1676 10.6943 21.1369 14.2823 21.1369C17.8703 21.1369 20.7934 18.1676 20.7934 14.5228C20.7934 10.878 17.8703 7.90875 14.2823 7.90875Z"
        fill="var(--semantic-color-accent-green-on-bold)"
      />
      <path
        d="M14.2823 18.3928C12.1766 18.3928 10.4727 16.6618 10.4727 14.5228C10.4727 12.3838 12.1766 10.6529 14.2823 10.6529C16.388 10.6529 18.092 12.3838 18.092 14.5228C18.092 16.6618 16.388 18.3928 14.2823 18.3928ZM14.2823 12.2994C13.0771 12.2994 12.0935 13.2985 12.0935 14.5228C12.0935 15.7471 13.0771 16.7463 14.2823 16.7463C15.4876 16.7463 16.4712 15.7471 16.4712 14.5228C16.4712 13.2985 15.4876 12.2994 14.2823 12.2994Z"
        fill="var(--semantic-color-accent-green-on-bold)"
      />
      <path
        d="M14.2826 15.339C14.0055 15.339 13.7285 15.1983 13.5761 14.9309C13.3544 14.5369 13.4791 14.0302 13.867 13.8051L26.4597 6.37481C26.8476 6.14965 27.3463 6.2763 27.568 6.67033C27.7896 7.06436 27.6649 7.57097 27.2771 7.79613L14.6843 15.2264C14.5597 15.2968 14.4211 15.339 14.2826 15.339Z"
        fill="var(--semantic-color-accent-green-on-bold)"
      />
      <path
        d="M24.1465 8.51386L25.795 4.09509L28.7597 9.48486L24.1465 8.51386Z"
        fill="var(--semantic-color-accent-green-on-bold)"
      />
      <path
        d="M28.7604 10.301C28.7604 10.301 28.6496 10.301 28.5942 10.287L23.981 9.31597C23.7454 9.25968 23.5515 9.11896 23.4407 8.90787C23.3299 8.69678 23.316 8.44348 23.3991 8.21832L25.0338 3.79955C25.1447 3.50403 25.4217 3.29294 25.7265 3.2648C26.0313 3.25073 26.336 3.40552 26.4884 3.68697L29.4531 9.07674C29.6054 9.35819 29.5916 9.71 29.3976 9.96331C29.2452 10.1744 28.9959 10.301 28.7465 10.301H28.7604ZM25.2416 7.90872L27.1949 8.31682L25.9482 6.03708L25.2555 7.90872H25.2416Z"
        fill="var(--semantic-color-accent-green-on-bold)"
      />
    </svg>
  )
}

function BlazingIcon() {
  return (
    <svg viewBox="0 0 28.82 28.82" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <path
        d="M14.4102 0.5C22.0924 0.500082 28.3203 6.72793 28.3203 14.4102C28.3202 22.0923 22.0923 28.3202 14.4102 28.3203C6.72794 28.3203 0.500099 22.0924 0.5 14.4102C0.5 6.72788 6.72787 0.5 14.4102 0.5Z"
        fill="var(--semantic-color-accent-brand-bold)"
        stroke="var(--semantic-color-accent-brand-on-bold)"
      />
      <path
        d="M14.4095 25.3C20.4239 25.3 25.2995 20.4244 25.2995 14.41C25.2995 8.39559 20.4239 3.52002 14.4095 3.52002C8.39516 3.52002 3.51953 8.39559 3.51953 14.41C3.51953 20.4244 8.39516 25.3 14.4095 25.3Z"
        stroke="var(--semantic-color-accent-brand-on-bold)"
        strokeWidth="1.53"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14.4102 14.41L18.7101 9.34003" stroke="var(--semantic-color-accent-brand-on-bold)" strokeWidth="1.53" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.4102 14.41L18.0801 18.02" stroke="var(--semantic-color-accent-brand-on-bold)" strokeWidth="1.53" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.4102 3.77002V5.94" stroke="var(--semantic-color-accent-brand-on-bold)" strokeWidth="1.53" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.4102 22.4V24.56" stroke="var(--semantic-color-accent-brand-on-bold)" strokeWidth="1.53" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M25.0597 14.41H22.8896" stroke="var(--semantic-color-accent-brand-on-bold)" strokeWidth="1.53" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.42975 14.41H4.25977" stroke="var(--semantic-color-accent-brand-on-bold)" strokeWidth="1.53" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

interface StatBoxProps {
  label: string
  value: string
  boldVar: string
  onBoldVar: string
  icon: ReactNode
  iconWidth: number
  iconHeight: number
}

// `Box` — one of sessionStats's three cards. The colored strip behind
// the label and the dark body are one and the same element: the outer
// card is filled with `boldVar`, and the inner "Timer" panel sits on
// top of it in `background/page`, leaving just the label's own row
// exposed as the colored cap — reproduced structurally the same way
// rather than as two separately-colored blocks. Figma's own card width
// (108.667px, an unbound literal = (358 content width − 32px of gaps) ÷
// 3) is reproduced as `flex: 1` instead of that literal px, the same
// normalize-an-unbound-literal call `ButtonGroup` already makes for its
// own 319px frame. The numeral's "Narrow Bold"/"Condensed Heavy" font
// width axis is an unbound literal Figma variant of the same variable
// font — approximated via `font-stretch` since no token expresses it.
function StatBox({ label, value, boldVar, onBoldVar, icon, iconWidth, iconHeight }: StatBoxProps) {
  return (
    <div
      className="flex flex-1 flex-col items-center"
      style={{
        borderRadius: 'var(--size-radius-400)',
        border: `2px solid var(${boldVar})`,
        background: `var(${boldVar})`,
      }}
    >
      <div className="flex items-center justify-center" style={{ padding: '0 var(--size-space-200)' }}>
        <span
          style={{
            fontFamily: 'var(--type-scale-body-s-bold-font-family)',
            fontWeight: 'var(--type-scale-body-s-bold-font-weight)',
            fontSize: 'var(--type-scale-body-s-bold-font-size)',
            lineHeight: 'var(--type-scale-body-s-bold-line-height)',
            letterSpacing: 'var(--type-scale-body-s-bold-letter-spacing)',
            color: `var(${onBoldVar})`,
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </span>
      </div>
      <div
        className="flex w-full items-center justify-center"
        style={{
          gap: 6,
          padding: 'var(--size-space-300)',
          borderRadius: 'var(--size-radius-400)',
          background: 'var(--semantic-color-background-page)',
        }}
      >
        <span style={{ width: iconWidth, height: iconHeight, flexShrink: 0, display: 'inline-flex' }}>{icon}</span>
        <span
          style={{
            fontFamily: 'var(--type-scale-body-s-bold-font-family)',
            fontStretch: 'condensed',
            fontWeight: 700,
            fontSize: 24,
            lineHeight: '20px',
            color: `var(${boldVar})`,
            whiteSpace: 'nowrap',
          }}
        >
          {value}
        </span>
      </div>
    </div>
  )
}

function countByStatus(rows: TermResultRow[]): Record<TagStatus, number> {
  return {
    Recalled: rows.filter((row) => row.status === 'Recalled').length,
    Hinted: rows.filter((row) => row.status === 'Hinted').length,
    Revealed: rows.filter((row) => row.status === 'Revealed').length,
    Skipped: rows.filter((row) => row.status === 'Skipped').length,
  }
}

const HEADLINE_TEXT_STYLE = {
  margin: 0,
  color: 'var(--semantic-color-text-primary)',
  fontFamily: 'var(--type-scale-headline-l-font-family)',
  fontWeight: 'var(--type-scale-headline-l-font-weight)' as unknown as number,
  fontSize: 'var(--type-scale-headline-l-font-size)',
  lineHeight: 'var(--type-scale-headline-l-line-height)',
  letterSpacing: 'var(--type-scale-headline-l-letter-spacing)',
} as const

export default function Summary() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isAllRecalled = searchParams.get('variant') === 'all-recalled'

  return (
    <div className="flex min-h-screen justify-center" style={{ background: 'var(--semantic-color-background-page)' }}>
      <div className="flex w-full max-w-[390px] flex-col">
        <StatusBar />

        <div className="flex w-full flex-col" style={{ gap: 'var(--size-space-100)' }}>
          <AppBar variant="leftIconButtonOnly" leftIcon={<ArrowLeftIcon />} leftLabel="Back" onLeftClick={() => router.push('/')} />
        </div>

        <main
          className="flex flex-col items-center"
          style={{ gap: 'var(--size-space-400)', padding: '0 var(--size-space-400) var(--size-space-400)' }}
        >
          <div className="flex w-full flex-col items-center" style={{ gap: 32 }}>
            <div className="relative flex items-end justify-center" style={{ width: 120, height: 120 }}>
              <div
                className="absolute"
                style={{
                  bottom: 0,
                  width: 105,
                  height: 19,
                  borderRadius: 'var(--size-radius-full)',
                  background: 'var(--semantic-color-background-stacking)',
                }}
              />
              <MascotSlot size="2XL" pose="standby" />
            </div>

            {/* Only the mixed-outcome and all-recalled headlines are
                confirmed — SPEC.md flags the other 2 dominant-outcome
                tiers (mostly-hinted/mostly-revealed/mostly-skipped) as
                shipping unverified, with no real copy anywhere to build
                them from. Real copy confirmed from the live
                Summary-all recalled instance (node 13669:17569, 2026-09-17):
                "Nice work, Mia!", not "Good session, Mia." — a genuinely
                different headline per outcome, not a stale copy of the
                mixed one. */}
            <p className="w-full text-center" style={HEADLINE_TEXT_STYLE}>
              {isAllRecalled ? 'Nice work, Mia!' : 'Good session, Mia.'}
            </p>
          </div>

          <div className="flex w-full items-start justify-center" style={{ gap: 16 }}>
            <StatBox
              label="XP"
              value={isAllRecalled ? ALL_RECALLED_XP : SESSION_XP}
              boldVar="--semantic-color-accent-blue-bold"
              onBoldVar="--semantic-color-accent-blue-on-bold"
              icon={<LightningIcon />}
              iconWidth={23.631}
              iconHeight={28.989}
            />
            <StatBox
              label="SCORE"
              value={isAllRecalled ? ALL_RECALLED_SCORE : SESSION_SCORE}
              boldVar="--semantic-color-accent-green-bold"
              onBoldVar="--semantic-color-accent-green-on-bold"
              icon={<ScoreIcon />}
              iconWidth={31.52}
              iconHeight={29.017}
            />
            <StatBox
              label="BLAZING"
              value={isAllRecalled ? ALL_RECALLED_PACE : SESSION_PACE}
              boldVar="--semantic-color-accent-brand-bold"
              onBoldVar="--semantic-color-accent-brand-on-bold"
              icon={<BlazingIcon />}
              iconWidth={28.82}
              iconHeight={28.82}
            />
          </div>

          {isAllRecalled ? (
            <>
              {/* The live frame's own segbar/legend literally reads "4
                  Recalled, 1 Hinted, 0 Revealed, 0 Skipped" — 5 counted
                  terms in a 4-term session, and directly contradicted by
                  this same frame's own table (all 4 rows Recalled) and
                  TermResultList (all 4 under "Recalled on your own").
                  Reads as a leftover/copy-paste artifact from the mixed
                  Summary's own real 1-1-1-1 data, not edited for this
                  variant — built as the internally-consistent 4/0/0/0 +
                  100% instead of reproducing the stray count, per
                  component-gaps.md's own entry for this screen. */}
              <ScoreBreakdown percent={100} counts={{ Recalled: 4, Hinted: 0, Revealed: 0, Skipped: 0 }} style={{ width: '100%' }} />

              {/* `Table`/`TableCell`'s own status-driven divider (see
                  TableCell.tsx's doc comment: Skipped alone omits the
                  bottom divider, a known status/position-coupling gap)
                  would leave a stray divider under the true last row
                  here, since none of these 4 rows is Skipped. The live
                  frame's own last row (`Visual research`) explicitly has
                  no divider — reproduced by rendering `TableCell`
                  directly instead of the `Table` wrapper (which has no
                  per-row style override), stripping just the last row's
                  border. */}
              <div
                className="flex w-full flex-col overflow-hidden"
                style={{ borderRadius: 16, background: 'var(--semantic-color-background-surface)' }}
              >
                {ALL_RECALLED_RESULTS.map((row, index) => (
                  <TableCell
                    key={row.term}
                    label={row.term}
                    status={row.status}
                    style={index === ALL_RECALLED_RESULTS.length - 1 ? { borderBottom: 'none' } : undefined}
                  />
                ))}
              </div>

              {/* The live frame shows one "Recalled on your own" title
                  followed by all 4 reflection sentences, not 4 repeated
                  identical titles the way `TermResultList` renders when
                  every row shares one status — that component always
                  pairs a title with each row (see its own doc comment),
                  which is correct for the mixed case but wrong here.
                  Built inline rather than adding an unrequested
                  "collapse repeated titles" mode to a component that
                  only has this one real caller for it so far. */}
              <div className="flex w-full flex-col" style={{ gap: 'var(--size-space-100)' }}>
                <p
                  className="m-0"
                  style={{
                    fontFamily: 'var(--type-scale-headline-xxs-bold-font-family)',
                    fontWeight: 'var(--type-scale-headline-xxs-bold-font-weight)' as unknown as number,
                    fontSize: 'var(--type-scale-headline-xxs-bold-font-size)',
                    lineHeight: 'var(--type-scale-headline-xxs-bold-line-height)',
                    letterSpacing: 'var(--type-scale-headline-xxs-bold-letter-spacing)',
                    color: 'var(--semantic-color-accent-green-bold)',
                  }}
                >
                  Recalled on your own
                </p>
                {ALL_RECALLED_RESULTS.map((row) => (
                  <p
                    key={row.term}
                    className="m-0"
                    style={{ fontFamily: "'Greed VF-TRIAL', sans-serif", fontSize: 14, color: 'var(--semantic-color-text-primary)' }}
                  >
                    <span style={{ fontWeight: 600 }}>{row.term}</span>
                    {`, ${row.reflection}`}
                  </p>
                ))}
              </div>
            </>
          ) : (
            <>
              <ScoreBreakdown percent={50} counts={countByStatus(TERM_RESULTS)} style={{ width: '100%' }} />

              <Table style={{ width: '100%' }} />

              <TermResultList rows={TERM_RESULTS} style={{ width: '100%' }} />
            </>
          )}
        </main>

        <div className="flex w-full flex-col items-start" style={{ gap: 'var(--size-space-300)', padding: 'var(--size-space-700)' }}>
          {isAllRecalled ? (
            // Live frame's own bottomContent has only a single "Continue"
            // — no "Review what you missed" pairing, since nothing was
            // missed. Wired to the same destination as the mixed
            // variant's own secondary button.
            <Button variant="Primary" size="L" cta="Continue" className="w-full" onClick={() => router.push('/')} />
          ) : (
            <ButtonGroup
              variant="Vertical"
              size="L"
              primary={{ cta: 'Review what you missed', onClick: () => router.push('/session') }}
              secondary={{ cta: 'Continue', onClick: () => router.push('/') }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
