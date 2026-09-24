import { useMemo, useSyncExternalStore } from 'react'
import type { TagStatus } from '@/components/Tag/Tag'

// What the mocked recall session leaves behind for the screens that follow it:
// Summary reads it to draw the table, the study plan reads it to pick its
// state. Kept in sessionStorage so it survives a route change and dies with
// the tab (a fresh tab is a fresh demo). The recall itself stays mocked; this
// only records which status each term ended on.

export type Status = TagStatus
export type ScriptedOutcome = 'Recalled' | 'Hinted' | 'Revealed'

export interface TermData {
  name: string
  /** The voice-path prompt. The text-path frames drop "out loud" from it. */
  prompt: string
  /** The sentence Summary shows after the bold term name. */
  reflection: string
  /** The unaided-result message. Term 1's is the quoted answer the frame shows. */
  recalledMessage: string
  /** The answer shown on a Revealed result (and after a hint). */
  revealMessage: string
  /** What a normal attempt at this term resolves to: 1 Recalled, 2 Hinted, 3 Revealed, then the cycle restarts. */
  scriptedOutcome: ScriptedOutcome
}

export const TERMS: TermData[] = [
  {
    name: 'Inspiration',
    prompt: 'Let’s start. Explain the term “Inspiration” out loud, in your own words.',
    reflection: 'personal experience and the world around you.',
    recalledMessage: "You said: 'It’s the spark that makes you want to create something'",
    revealMessage: 'Inspiration is personal experience and the world around you.',
    scriptedOutcome: 'Recalled',
  },
  {
    name: 'Divergent thinking',
    prompt: 'Explain the term “Divergent thinking” out loud, in your own words.',
    reflection: 'many possible ideas before narrowing to one.',
    recalledMessage: 'Divergent thinking is generating as many different ideas as possible before narrowing down to one.',
    revealMessage: 'Divergent thinking is generating as many different ideas as possible before narrowing down to one.',
    scriptedOutcome: 'Hinted',
  },
  {
    name: 'Visual hierarchy',
    prompt: 'Explain the term “Visual hierarchy” out loud, in your own words.',
    reflection: 'arranging elements to guide attention and show what matters most.',
    recalledMessage: 'Visual hierarchy arranges elements to guide attention and show what matters most.',
    revealMessage: 'Visual hierarchy arranges elements to guide attention and show what matters most.',
    scriptedOutcome: 'Revealed',
  },
  {
    name: 'Visual research',
    prompt: 'Explain the term “Visual research” out loud, in your own words.',
    reflection: 'uses visual media (images, video, diagrams) as data for research.',
    recalledMessage: 'Visual research is the use of images and other visual media to collect, analyze, and present research data.',
    revealMessage: 'Visual research is the use of images and other visual media to collect, analyze, and present research data.',
    scriptedOutcome: 'Recalled',
  },
]

// Summary's line under the reflection, fixed per status.
export const STATUS_NOTE: Partial<Record<Status, string>> = {
  Revealed: "Answer shown after you said you didn't know it, worth a real attempt next time it comes up.",
  Skipped: 'No attempt this time, worth a first pass before it comes up again.',
}

// Mia, 2026-09-19: 2 XP for every term recalled on its own.
export const XP_PER_RECALLED = 2

// Summary's headline, derived from how many of the terms it lists were
// recalled. Two tiers are live Figma copy: "Nice work, Mia!" on
// `Summary-all recalled`, "Good session, Mia." on the mixed frame (1 of
// 4). The other two have no Figma frame of their own: "Let’s go again,
// Mia." is Mia's 2026-09-21 call for the nothing-recalled case, and
// "Almost there, Mia." is her 2026-09-23 call, added so 3 of 4 stops
// reading exactly like 1 of 4. Both confirmed-from-Figma pairings are
// untouched: 4 of 4 and 1 of 4 still say what the frames say.
// [gap:summary-headline-tiers]
export function summaryHeadline(recalled: number, total: number): string {
  if (total > 0 && recalled === total) return 'Nice work, Mia!'
  if (recalled === 0) return 'Let’s go again, Mia.'
  // More than half, but not all.
  if (recalled * 2 > total) return 'Almost there, Mia.'
  return 'Good session, Mia.'
}

// `ScoreBreakdown`'s caption. Figma's own string on both Summary frames
// is "recalled this session", which is true of a first run but overstates
// a review Summary: that one lists only the terms the review covered, so
// its percent is out of that subset, not out of the session. Mia,
// 2026-09-23: keep the subset numbers, say out loud what they count.
// [gap:review-summary-percent-label]
export const PERCENT_LABEL_FIRST_RUN = 'recalled this session'
export const PERCENT_LABEL_REVIEW = 'recalled in this review'

// BLAZING is derived, not measured: the prototype's timing depends on how long
// the person demoing it talks, so each status costs a fixed number of seconds.
// Chosen so the two live Summary frames still read exactly as designed:
// Recalled + Hinted + Revealed + Skipped = 1:09, and three recalled review
// terms = 3 x 0:43 = 2:09. In a review run a Recalled term costs 0:43; any
// other status costs what it does in a first run.
const PACE_SECONDS: Record<Status, number> = { Recalled: 20, Hinted: 30, Revealed: 15, Skipped: 4 }
const REVIEW_TERM_SECONDS = 43

export function paceLabel(statuses: Status[], isReview: boolean): string {
  const cost = (s: Status) => (isReview && s === 'Recalled' ? REVIEW_TERM_SECONDS : PACE_SECONDS[s])
  const seconds = statuses.reduce((sum, s) => sum + cost(s), 0)
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}

export interface RecallStore {
  /** The first run's status per term, null until the term has a result. */
  results: (Status | null)[]
  /** Each term's status in its latest review run, null if it hasn't been reviewed. */
  reviewResults: (Status | null)[]
  /** True once the first run reached its Summary. */
  firstRunDone: boolean
  /** The terms the latest review run covers, for its Summary. */
  lastReview: number[]
  /** The input mode the person last left off in, so reopening a review picks up where they left off. */
  inputMode: 'voice' | 'text'
}

const EMPTY: RecallStore = {
  results: [null, null, null, null],
  reviewResults: [null, null, null, null],
  firstRunDone: false,
  lastReview: [],
  inputMode: 'voice',
}
const KEY = 'recall-session'

// The review run before anything is recorded: terms 2-4, the frames Figma draws.
const DEFAULT_REVIEW = [1, 2, 3]
// Summary opened cold shows Figma's mixed frame.
export const SAMPLE_RESULTS: Status[] = ['Recalled', 'Hinted', 'Revealed', 'Skipped']

let memory = ''
const listeners = new Set<() => void>()

function getRaw(): string {
  try {
    return window.sessionStorage.getItem(KEY) ?? memory
  } catch {
    return memory
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  window.addEventListener('storage', listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', listener)
  }
}

function parse(raw: string): RecallStore {
  if (!raw) return EMPTY
  try {
    return { ...EMPTY, ...(JSON.parse(raw) as Partial<RecallStore>) }
  } catch {
    return EMPTY
  }
}

function write(next: RecallStore) {
  const raw = JSON.stringify(next)
  memory = raw
  try {
    window.sessionStorage.setItem(KEY, raw)
  } catch {
    // Storage blocked: the in-memory copy still carries the session.
  }
  listeners.forEach((listener) => listener())
}

export function readStore(): RecallStore {
  return parse(getRaw())
}

export function useRecallStore(): RecallStore {
  const raw = useSyncExternalStore(subscribe, getRaw, () => '')
  return useMemo(() => parse(raw), [raw])
}

// True on the client after hydration. The routes that read the store render
// nothing until then, so the server HTML never disagrees with the stored session.
export function useMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
}

export function resetStore() {
  write(EMPTY)
}

export function recordResult(term: number, status: Status) {
  const store = readStore()
  if (store.results[term] === status) return
  const results = [...store.results]
  results[term] = status
  write({ ...store, results })
}

export function recordReviewResult(term: number, status: Status) {
  const store = readStore()
  if (store.reviewResults[term] === status) return
  const reviewResults = [...store.reviewResults]
  reviewResults[term] = status
  write({ ...store, reviewResults })
}

export function recordInputMode(mode: 'voice' | 'text') {
  const store = readStore()
  if (store.inputMode === mode) return
  write({ ...store, inputMode: mode })
}

export function startReview(terms: number[]) {
  write({ ...readStore(), lastReview: terms })
}

export function finishFirstRun() {
  write({ ...readStore(), firstRunDone: true })
}

export function recalledTerms(store: RecallStore): number[] {
  return TERMS.map((_, i) => i).filter((i) => store.results[i] === 'Recalled' || store.reviewResults[i] === 'Recalled')
}

// The terms a review run covers: everything not yet recalled.
export function missedTerms(store: RecallStore): number[] {
  const hasAnyRecord = store.results.some((r) => r !== null) || store.reviewResults.some((r) => r !== null)
  if (!hasAnyRecord) return DEFAULT_REVIEW
  const recalled = recalledTerms(store)
  return TERMS.map((_, i) => i).filter((i) => !recalled.includes(i))
}

export type StudyPlanState = 'notStarted' | 'inProgress' | 'finish'

// The study plan's state follows how many terms have ever been recalled.
export function studyPlanState(store: RecallStore): StudyPlanState {
  const count = recalledTerms(store).length
  if (count === 0) return 'notStarted'
  return count >= TERMS.length ? 'finish' : 'inProgress'
}
