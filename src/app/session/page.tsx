'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { AppBar } from '@/components/AppBar/AppBar'
import { AudioScrubber } from '@/components/AudioScrubber/AudioScrubber'
import { Button } from '@/components/Button/Button'
import { ButtonGroup } from '@/components/ButtonGroup/ButtonGroup'
import { ButtonIcon } from '@/components/ButtonIcon/ButtonIcon'
import { IconSlot } from '@/components/IconSlot/IconSlot'
import { MascotSlot } from '@/components/MascotSlot/MascotSlot'
import { MicButton } from '@/components/MicButton/MicButton'
import { ProgressIndicator, type ProgressIndicatorProgress } from '@/components/ProgressIndicator/ProgressIndicator'
import { SpeechBubble } from '@/components/SpeechBubble/SpeechBubble'
import { StatusBar } from '@/components/StatusBar/StatusBar'
import { StatusIndicator } from '@/components/StatusIndicator/StatusIndicator'
import { Steps } from '@/components/Steps/Steps'
import { TextField } from '@/components/TextField/TextField'
import {
  TERMS,
  finishFirstRun,
  missedTerms,
  readStore,
  recordResult,
  recordReviewResult,
  resetStore,
  startReview,
  useMounted,
  type ScriptedOutcome,
  type Status,
} from '@/lib/recall-session'

// Session is one route with many internal sub-states. Every term, in both a
// first run and a review run, can be answered by voice or by typing, and the
// two can be mixed inside one term (a voice first attempt, a typed retry).
//
// What a term ends on is scripted (see `TERMS` in `@/lib/recall-session`): a
// normal attempt resolves by term number, 1 Recalled, 2 Hinted, 3 Revealed,
// 4 Recalled; "I don't know" is Revealed; the top-right Skip, live on `idle`
// only, is Skipped. A review run covers the terms not yet recalled; a normal
// attempt in it is Recalled, and Skip and "I don't know" work as in a first
// run, so its Summary shows what was really done. Each result is recorded as its screen appears, so
// Summary and the study plan read the real session.
//
// Frames that come from live Figma: idle, recording, readyToSend, processing,
// resultRecalled, resultHinted1 and its retry chain, resultRevealed,
// typeInput, typeProcessing, typeResultRecalled. The typed Hinted / retry /
// Revealed states have no Figma frame; they are the voice frames with the
// typed text in place of the audio (Mia reviewed them as a preview sheet on
// 2026-09-21; the sheet was deleted once they were built here).
type SubState =
  | 'idle'
  | 'recording'
  | 'readyToSend'
  | 'processing'
  | 'resultRecalled'
  | 'resultHinted1'
  | 'hinted2Recording'
  | 'hinted2ReadyToSend'
  | 'hinted2Processing'
  | 'resultHinted1Recalled'
  | 'resultRevealed'
  | 'typeInput'
  | 'typeProcessing'
  | 'typeResultRecalled'
  | 'typeResultHinted'
  | 'typeRetryInput'
  | 'typeRetryProcessing'
  | 'typeResultHinted1Recalled'
  | 'typeResultRevealed'

// Real "x-close" asset (component 3248:81244), confirmed via
// `get_design_context` on the live Learning-idle frame — this screen
// uses a real X, unlike Primer/Summary's own leftIconButtonOnly rows,
// which turned out to use `arrow-left` instead once checked directly.
// Recolored from its hardcoded `fill="#F4F2FF"` to `currentColor`,
// tinted via `text/primary` on the caller.
const CLOSE_ICON = (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
    <path
      d="M17.293 5.29297C17.6835 4.90244 18.3165 4.90244 18.707 5.29297C19.0976 5.68349 19.0976 6.31651 18.707 6.70703L13.4141 12L18.707 17.293C19.0976 17.6835 19.0976 18.3165 18.707 18.707C18.3165 19.0976 17.6835 19.0976 17.293 18.707L12 13.4141L6.70703 18.707C6.31651 19.0976 5.68349 19.0976 5.29297 18.707C4.90244 18.3165 4.90244 17.6835 5.29297 17.293L10.5859 12L5.29297 6.70703C4.90244 6.31651 4.90244 5.68349 5.29297 5.29297C5.68349 4.90244 6.31651 4.90244 6.70703 5.29297L12 10.5859L17.293 5.29297Z"
      fill="currentColor"
    />
  </svg>
)

// The "badge (XP/lightning counter)" pattern design-system.md documents
// as hand-built independently on 9 real screens (Primer-micDenied +
// every Learning-*), inline here for the first of those 9 to actually
// get built. Same real lightning asset Summary's own sessionStats used,
// but recolored differently here — this instance's own two paths bind
// `accent/blue/on-subtle` and `accent/blue/subtle` (confirmed via the
// asset's own literal fills, `#7BA8F2`/`#0A1635`, both real token
// matches), not the `accent/blue/bold`/`on-bold` pair Summary's boxed
// version used — a muted pairing fitting this badge's plain, unboxed
// placement in the appBar row.
function LightningIcon() {
  return (
    <svg viewBox="0 0 17.9338 22" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <path
        d="M4.76562 22C3.82994 22 2.94682 21.4981 2.45269 20.6864C1.95857 19.8748 1.91651 18.8816 2.34756 18.0165C3.13606 16.4146 3.75635 15.1757 4.22945 14.2146C3.77737 14.2146 3.27273 14.2146 2.70501 14.2146C1.55906 14.2146 0.560296 13.5097 0.171303 12.4204C-0.228203 11.3311 0.0871968 10.135 0.949289 9.38738C3.23068 7.41165 8.69761 3.03301 11.757 0.587379C12.2406 0.202913 12.8188 0 13.4181 0C14.3958 0 15.3 0.54466 15.7836 1.40971C16.2567 2.26408 16.2357 3.33204 15.731 4.17573L13.8702 7.28349H15.2264C16.3618 7.28349 17.3606 7.98835 17.7601 9.06699C18.1596 10.1456 17.8547 11.3417 17.0031 12.1L6.54238 21.3165C6.04825 21.7544 5.41745 21.9893 4.77614 21.9893L4.76562 22Z"
        fill="var(--semantic-color-accent-blue-on-subtle)"
      />
      <path
        d="M4.755 20.4194C4.51319 20.4194 4.26087 20.334 4.05061 20.1738C3.60905 19.8321 3.48289 19.234 3.73521 18.7321C5.34375 15.4855 6.24789 13.6486 6.8051 12.6127C5.96403 12.6447 4.67089 12.6447 2.69439 12.6447C2.21078 12.6447 1.79024 12.3457 1.62203 11.8864C1.45382 11.4272 1.57998 10.9146 1.95846 10.5942C4.21882 8.63984 9.67523 4.27188 12.7241 1.83693C13.1657 1.4845 13.7649 1.50586 14.1854 1.87965C14.606 2.26411 14.7006 2.87285 14.4062 3.36411L11.105 8.87479H15.2368C15.7204 8.87479 16.1409 9.17382 16.3091 9.63304C16.4774 10.0923 16.3512 10.5942 15.9832 10.9253L5.52247 20.1418C5.30169 20.334 5.03886 20.4301 4.77603 20.4301L4.755 20.4194ZM8.24542 12.4097C8.03516 12.8262 7.25717 14.3748 5.00732 18.9243L14.995 10.1243H10.9368C10.5268 10.1243 10.1378 9.90003 9.93807 9.52625C9.73831 9.16314 9.74883 8.7146 9.95909 8.35149L13.1026 3.1078C10.0537 5.53207 5.05989 9.54761 2.84158 11.4486C6.02711 11.3952 7.41487 11.3738 7.65668 11.3631C7.74078 11.3311 7.81438 11.3418 7.909 11.3631C8.18234 11.4272 8.3821 11.6835 8.3821 11.9719C8.3821 12.1748 8.3821 12.3136 8.23491 12.4097H8.24542Z"
        fill="var(--semantic-color-accent-blue-subtle)"
      />
    </svg>
  )
}

// Real "Icon M/Delete" asset for the Redo button below — recolored
// from its hardcoded `#FF6B6B` to `currentColor` (matches `feedback/
// error/bold` exactly).
function DeleteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <path
        d="M10.0002 6.00002H14.0002C14.0002 5.46958 13.7895 4.96087 13.4145 4.5858C13.0394 4.21073 12.5307 4.00002 12.0002 4.00002C11.4698 4.00002 10.9611 4.21073 10.586 4.5858C10.211 4.96087 10.0002 5.46958 10.0002 6.00002ZM8.00024 6.00002C8.00024 4.93915 8.42167 3.92173 9.17182 3.17159C9.92196 2.42144 10.9394 2.00002 12.0002 2.00002C13.0611 2.00002 14.0785 2.42144 14.8287 3.17159C15.5788 3.92173 16.0002 4.93915 16.0002 6.00002H21.0002C21.2655 6.00002 21.5198 6.10537 21.7074 6.29291C21.8949 6.48045 22.0002 6.7348 22.0002 7.00002C22.0002 7.26523 21.8949 7.51959 21.7074 7.70712C21.5198 7.89466 21.2655 8.00002 21.0002 8.00002H20.1182L19.2322 18.34C19.1471 19.3385 18.6902 20.2686 17.9521 20.9464C17.214 21.6241 16.2483 22.0001 15.2462 22H8.75424C7.75215 22.0001 6.78652 21.6241 6.04839 20.9464C5.31027 20.2686 4.85342 19.3385 4.76824 18.34L3.88224 8.00002H3.00024C2.73503 8.00002 2.48067 7.89466 2.29314 7.70712C2.1056 7.51959 2.00024 7.26523 2.00024 7.00002C2.00024 6.7348 2.1056 6.48045 2.29314 6.29291C2.48067 6.10537 2.73503 6.00002 3.00024 6.00002H8.00024ZM15.0002 12C15.0002 11.7348 14.8949 11.4804 14.7074 11.2929C14.5198 11.1054 14.2655 11 14.0002 11C13.735 11 13.4807 11.1054 13.2931 11.2929C13.1056 11.4804 13.0002 11.7348 13.0002 12V16C13.0002 16.2652 13.1056 16.5196 13.2931 16.7071C13.4807 16.8947 13.735 17 14.0002 17C14.2655 17 14.5198 16.8947 14.7074 16.7071C14.8949 16.5196 15.0002 16.2652 15.0002 16V12ZM10.0002 11C10.2655 11 10.5198 11.1054 10.7074 11.2929C10.8949 11.4804 11.0002 11.7348 11.0002 12V16C11.0002 16.2652 10.8949 16.5196 10.7074 16.7071C10.5198 16.8947 10.2655 17 10.0002 17C9.73503 17 9.48067 16.8947 9.29314 16.7071C9.1056 16.5196 9.00024 16.2652 9.00024 16V12C9.00024 11.7348 9.1056 11.4804 9.29314 11.2929C9.48067 11.1054 9.73503 11 10.0002 11ZM6.76024 18.17C6.80285 18.6694 7.03141 19.1346 7.40069 19.4735C7.76996 19.8124 8.25303 20.0003 8.75424 20H15.2462C15.7471 19.9998 16.2297 19.8117 16.5985 19.4728C16.9674 19.134 17.1957 18.6691 17.2382 18.17L18.1102 8.00002H5.89024L6.76024 18.17Z"
        fill="currentColor"
      />
    </svg>
  )
}

// Real "check" asset for the Send button below.
function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <path
        d="M19.293 5.29297C19.6835 4.90244 20.3165 4.90244 20.707 5.29297C21.0976 5.68349 21.0976 6.31651 20.707 6.70703L9.70703 17.707C9.31651 18.0976 8.68349 18.0976 8.29297 17.707L3.29297 12.707C2.90244 12.3165 2.90244 11.6835 3.29297 11.293C3.68349 10.9024 4.31651 10.9024 4.70703 11.293L9 15.5859L19.293 5.29297Z"
        fill="currentColor"
      />
    </svg>
  )
}

// Real "alert-circle" asset — the same one `SpeechBubble`'s own
// `Warning` state renders internally, reused here since
// `Learning-topic 2-result-Hinted1-recalled`'s own Hint 1 block collapses
// to plain text (no bubble chrome, no tail — see the component's own doc
// comment on this exact "collapsed" treatment) rather than a second
// `SpeechBubble` instance.
function AlertCircleIcon() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12ZM12.0098 15C12.5621 15 13.0098 15.4477 13.0098 16C13.0098 16.5523 12.5621 17 12.0098 17H12C11.4477 17 11 16.5523 11 16C11 15.4477 11.4477 15 12 15H12.0098ZM11 12V8C11 7.44772 11.4477 7 12 7C12.5523 7 13 7.44772 13 8V12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12ZM23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12Z"
        fill="currentColor"
      />
    </svg>
  )
}

// Real "play-pause" asset for the Resume button below.
function PlayPauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <path
        d="M17.25 6V18C17.25 18.1989 17.171 18.3897 17.0303 18.5303C16.8897 18.671 16.6989 18.75 16.5 18.75C16.3011 18.75 16.1103 18.671 15.9697 18.5303C15.829 18.3897 15.75 18.1989 15.75 18V6C15.75 5.80109 15.829 5.61032 15.9697 5.46967C16.1103 5.32902 16.3011 5.25 16.5 5.25C16.6989 5.25 16.8897 5.32902 17.0303 5.46967C17.171 5.61032 17.25 5.80109 17.25 6ZM21 5.25C20.8011 5.25 20.6103 5.32902 20.4697 5.46967C20.329 5.61032 20.25 5.80109 20.25 6V18C20.25 18.1989 20.329 18.3897 20.4697 18.5303C20.6103 18.671 20.8011 18.75 21 18.75C21.1989 18.75 21.3897 18.671 21.5303 18.5303C21.671 18.3897 21.75 18.1989 21.75 18V6C21.75 5.80109 21.671 5.61032 21.5303 5.46967C21.3897 5.32902 21.1989 5.25 21 5.25ZM13.5 12C13.5004 12.2495 13.4376 12.4951 13.3174 12.7138C13.1972 12.9325 13.0236 13.1172 12.8128 13.2506L4.545 18.5147C4.32002 18.6585 4.06054 18.7393 3.79367 18.7487C3.5268 18.758 3.26232 18.6955 3.02784 18.5677C2.79336 18.44 2.59748 18.2516 2.46066 18.0223C2.32383 17.7929 2.25108 17.5311 2.25 17.2641V6.73594C2.25108 6.4689 2.32383 6.20706 2.46066 5.97774C2.59748 5.74842 2.79336 5.56004 3.02784 5.43226C3.26232 5.30449 3.5268 5.242 3.79367 5.25133C4.06054 5.26067 4.32002 5.34147 4.545 5.48531L12.8128 10.7494C13.0236 10.8828 13.1972 11.0675 13.3174 11.2862C13.4376 11.5049 13.5004 11.7505 13.5 12ZM11.9831 12L3.75 6.7575V17.2434L11.9831 12Z"
        fill="currentColor"
      />
    </svg>
  )
}

// Which status a result screen records for its term. A Hinted term that then
// succeeds on the retry stays Hinted; giving up from the hint overwrites it
// with Revealed (resultRevealed).
const RESULT_STATUS: Partial<Record<SubState, Status>> = {
  resultRecalled: 'Recalled',
  typeResultRecalled: 'Recalled',
  resultHinted1: 'Hinted',
  typeResultHinted: 'Hinted',
  resultHinted1Recalled: 'Hinted',
  typeResultHinted1Recalled: 'Hinted',
  resultRevealed: 'Revealed',
  typeResultRevealed: 'Revealed',
}

function SessionContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  // `?review=1` (Summary's "Review what you missed", the study plan's
  // "Review"/"Continue"): the run over every term not recalled yet, per Mia
  // (2026-09-21). A normal attempt in it is Recalled (unaided), while Skip and
  // "I don't know" still work and record what they are, so its Summary shows
  // what the person actually did. The list is fixed at
  // mount, since recording a result shrinks what is "missed" mid-run. With
  // nothing recorded it is terms 2-4, the frames Figma draws.
  const isReview = searchParams.get('review') === '1'
  const [run] = useState<number[]>(() => (isReview ? missedTerms(readStore()) : TERMS.map((_, i) => i)))
  const [pos, setPos] = useState(0)
  // Mia, 2026-09-21: the input mode sticks. Typing on one term means the next
  // term opens on the typing screen too, until the person switches to voice
  // (or records). Set by "Type instead" / "Switch to voice" / a recording.
  const [inputMode, setInputMode] = useState<'voice' | 'text'>(() => (searchParams.get('entry') === 'text' ? 'text' : 'voice'))
  // SPEC.md: "Tap 'I can't talk right now' (on Primer-intro) → /session
  // (term 1, text mode), bypassing the mic-permission prompt entirely."
  // Same landing for micDenied's own "Continue with text." Primer links
  // here with `?entry=text`.
  const [subState, setSubState] = useState<SubState>(() =>
    searchParams.get('entry') === 'text' ? 'typeInput' : 'idle',
  )
  // Live Figma (2026-09-20): the review frames read "Topics 1 of 3" / "2 of 3"
  // / "3 of 3" and carry a "6" badge, since the run skips term 1 — the count
  // states its own scope, and the XP goal is 2 per term the run covers (Mia,
  // 2026-09-19: 2 XP per Recalled term; the badge is that goal, static).
  const runTermCount = run.length
  const xpGoal = 2 * runTermCount
  const termIndex = run[pos] ?? 0
  const term = TERMS[termIndex]
  // Mia, 2026-09-21: a normal attempt resolves by term number, 1 Recalled, 2
  // Hinted, 3 Revealed, 4 Recalled; a review attempt is always Recalled.
  const outcome: ScriptedOutcome = isReview ? 'Recalled' : term.scriptedOutcome
  // The text-path frames (typeInput, typeProcessing, typeResult…) drop "out
  // loud" from the prompt in live Figma (2026-09-20): "Explain the term
  // “Inspiration”, in your own words." — no one is speaking on that path.
  const textPrompt = term.prompt.replace(' out loud', '')
  const hasNextTerm = pos + 1 < runTermCount
  // Skip is live before an attempt starts: the voice `idle` and the typing screen.
  const isBeforeAttempt = subState === 'idle' || subState === 'typeInput'
  const isFinalReviewResult = isReview && !hasNextTerm && RESULT_STATUS[subState] !== undefined
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  // SPEC.md: Hinted1's "Try again" re-attempt keeps the first attempt around —
  // `Learning-topic 2-result-Hinted1-recalled` shows both. A first attempt is
  // either a recording (`firstAttemptAudioUrl`) or typed text
  // (`firstAttemptText`); the retry can then be either too, so a term's
  // history renders per attempt rather than per screen.
  const [isPlayingFirstAttempt, setIsPlayingFirstAttempt] = useState(false)
  const [firstAttemptAudioUrl, setFirstAttemptAudioUrl] = useState<string | null>(null)
  const [firstAttemptText, setFirstAttemptText] = useState<string | null>(null)
  // True once a voice "Try again" has been tapped for this term — tells the
  // recorder to route to the hinted2 screens instead of the first-attempt ones.
  const [isRetry, setIsRetry] = useState(false)
  // The typed answer for the current attempt. SPEC.md: "TextField has no
  // value/onChange... this screen needs its own plain native input/textarea as
  // the actual typing surface... TextField supplies the chrome, not the
  // capture."
  const [typedAnswer, setTypedAnswer] = useState('')
  const streamRef = useRef<MediaStream | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const audioElRef = useRef<HTMLAudioElement | null>(null)
  const firstAttemptAudioElRef = useRef<HTMLAudioElement | null>(null)
  // The URL built from the current take so far. "Resume" adds to the same take,
  // so each stop replaces (and revokes) the previous snapshot of it.
  const takeUrlRef = useRef<string | null>(null)
  const scrollRef = useRef<HTMLElement | null>(null)
  // Set by a stop tap: runs once the recorder has flushed what it has captured.
  const flushRef = useRef<(() => void) | null>(null)

  // The middle scrolls (Mia, 2026-09-21); each new screen shows its newest row,
  // and a new term starts at the top.
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = subState === 'idle' || subState === 'typeInput' ? 0 : el.scrollHeight
  }, [subState, pos])

  // A first run starts from nothing; a review keeps what the first run left.
  // A review with nothing left to review has nowhere to go but back.
  useEffect(() => {
    if (run.length === 0) router.replace('/')
    else if (isReview) startReview(run)
    else resetStore()
  }, [isReview, run, router])

  // Records each term's status as its result screen appears, so leaving the
  // session anywhere (Close included) leaves the study plan an accurate count.
  useEffect(() => {
    const status = RESULT_STATUS[subState]
    if (!status) return
    if (isReview) recordReviewResult(termIndex, status)
    else recordResult(termIndex, status)
  }, [subState, termIndex, isReview])

  // SPEC.md: "The mic really requests OS permission via getUserMedia
  // and really records; AudioScrubber plays back that real audio."
  // Requests the real stream, then really records into it with
  // MediaRecorder — denial isn't handled here since Primer's own
  // mic-permission gate already covers that path before a student ever
  // reaches Session. Shared by the first attempt (`handleMicTap`, → the
  // generic `recording`) and Hinted1's re-attempt (`handleRetry`, → the real
  // `Learning-topic 2-result-Hinted1-recording` frame instead).
  async function startRecording(isRetryAttempt: boolean) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      chunksRef.current = []
      takeUrlRef.current = null
      const recorder = new MediaRecorder(stream)
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data)
        flushRef.current?.()
        flushRef.current = null
      }
      recorder.start()
      recorderRef.current = recorder
      if (isRetryAttempt) {
        keepFirstAttempt()
        setIsRetry(true)
      }
      setSubState(isRetryAttempt ? 'hinted2Recording' : 'recording')
    } catch {
      // Denied mid-session isn't handled yet — no built destination for it.
    }
  }

  // Moves whatever the first attempt was (a recording, or typed text) into the
  // history slot the retry screens read, leaving the current-attempt slots free.
  function keepFirstAttempt() {
    if (subState === 'typeResultHinted') {
      setFirstAttemptText(typedAnswer)
      setFirstAttemptAudioUrl(null)
    } else {
      setFirstAttemptText(null)
      setFirstAttemptAudioUrl(audioUrl)
    }
  }

  function handleMicTap() {
    setInputMode('voice')
    void startRecording(false)
  }

  // SPEC.md: Hinted1's "Try again" → real re-attempt, looping back
  // through `hinted2Recording` → `hinted2ReadyToSend` → `hinted2Processing`.
  function handleRetry() {
    setInputMode('voice')
    void startRecording(true)
  }

  // Mia, 2026-09-21: a hint can be retried by typing too, after either kind of
  // first attempt.
  function handleTypeRetry() {
    setInputMode('text')
    keepFirstAttempt()
    setTypedAnswer('')
    setSubState('typeRetryInput')
  }

  // "Switch to voice" on the typed retry goes back to the Hinted screen the
  // first attempt came from, which is where the mic's "Try again" lives.
  function handleSwitchToVoiceFromRetry() {
    setInputMode('voice')
    if (firstAttemptText !== null) {
      setTypedAnswer(firstAttemptText)
      setFirstAttemptText(null)
      setSubState('typeResultHinted')
    } else {
      setSubState('resultHinted1')
    }
  }

  // `recording`'s own mic tap ends the take for now: the recorder is paused
  // (not stopped, so "Resume" can carry on the same take), what it has
  // captured is flushed into one playable URL, and the screen moves to
  // `readyToSend` (or, on a re-attempt, `hinted2ReadyToSend`). Doesn't revoke
  // the previous `audioUrl` — on a Hinted1 re-attempt that is the first
  // attempt's own recording, already kept in `firstAttemptAudioUrl`. The
  // stream stays open until the take is sent, redone or left (`stopCapture`).
  function handleStopRecording() {
    const recorder = recorderRef.current
    if (!recorder) return
    flushRef.current = () => {
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType })
      if (takeUrlRef.current) URL.revokeObjectURL(takeUrlRef.current)
      takeUrlRef.current = URL.createObjectURL(blob)
      setAudioUrl(takeUrlRef.current)
      setSubState(isRetry ? 'hinted2ReadyToSend' : 'readyToSend')
    }
    recorder.pause()
    recorder.requestData()
  }

  // Mia, 2026-09-21: "Resume" carries the same take on. Same `recording`
  // screen as the first press, no new visual; stopping again replaces the
  // snapshot with the longer take.
  function handleResume() {
    const recorder = recorderRef.current
    if (!recorder || recorder.state !== 'paused') return
    audioElRef.current?.pause()
    setIsPlaying(false)
    recorder.resume()
    setSubState(isRetry ? 'hinted2Recording' : 'recording')
  }

  // Releases the recorder and the microphone once a take is finished with.
  function stopCapture() {
    const recorder = recorderRef.current
    if (recorder && recorder.state !== 'inactive') recorder.stop()
    streamRef.current?.getTracks().forEach((track) => track.stop())
    recorderRef.current = null
    streamRef.current = null
  }

  // SPEC.md: tap "Switch to voice" → `idle` (voice mode, same term).
  // Clears whatever was typed so far, since going back to `idle` re-offers
  // both entry points fresh rather than leaving a stale draft behind.
  function handleSwitchToVoice() {
    setInputMode('voice')
    setTypedAnswer('')
    setSubState('idle')
  }

  // SPEC.md: tap "Submit" (on `typeInput`) → `typeProcessing`. No
  // minimum-length or content check, same as the voice path's own
  // recording — the outcome is scripted, not read from what was typed.
  function handleSubmitTyped() {
    setSubState('typeProcessing')
  }

  function handleSubmitTypedRetry() {
    setSubState('typeRetryProcessing')
  }

  function handleTogglePlayback() {
    const audioEl = audioElRef.current
    if (!audioEl) return
    if (isPlaying) {
      audioEl.pause()
    } else {
      void audioEl.play()
    }
  }

  // The first attempt plays back through its own hidden `<audio>` element,
  // independent of the one above (which plays the second/current attempt).
  function handleToggleFirstAttemptPlayback() {
    const audioEl = firstAttemptAudioElRef.current
    if (!audioEl) return
    if (isPlayingFirstAttempt) {
      audioEl.pause()
    } else {
      void audioEl.play()
    }
  }

  // Discards the term's captured audio and typed text so the next term (or a
  // restart of this one) starts clean.
  function resetAttempt() {
    stopCapture()
    if (audioUrl) URL.revokeObjectURL(audioUrl)
    if (firstAttemptAudioUrl) URL.revokeObjectURL(firstAttemptAudioUrl)
    setAudioUrl(null)
    setFirstAttemptAudioUrl(null)
    setFirstAttemptText(null)
    setIsPlaying(false)
    setIsPlayingFirstAttempt(false)
    setIsRetry(false)
    setTypedAnswer('')
  }

  // SPEC.md: tap Redo → back to `idle` (re-record) — restarts the term from
  // scratch, so a later first-attempt recording doesn't resolve as a re-attempt.
  function handleRedo() {
    resetAttempt()
    setSubState('idle')
  }

  // SPEC.md: tap "Send" → `processing`. A re-attempt (after Hinted1's "Try
  // again") goes to `hinted2Processing` instead, which keeps the first
  // attempt's history on screen.
  function handleSend() {
    stopCapture()
    setSubState(isRetry ? 'hinted2Processing' : 'processing')
  }

  // Ends a run: the first run's Summary, or the review run's own (which
  // reads "all recalled" only if every reviewed term really was).
  function finishRun() {
    finishFirstRun()
    router.push(isReview ? '/summary?variant=review' : '/summary')
  }

  // SPEC.md: every result's "Continue" advances to the next term's `idle`;
  // the last term's goes to Summary instead.
  // The next term opens in the current input mode.
  function handleContinue(mode: 'voice' | 'text' = inputMode) {
    if (!hasNextTerm) {
      finishRun()
      return
    }
    resetAttempt()
    setPos((p) => p + 1)
    setSubState(mode === 'text' ? 'typeInput' : 'idle')
  }

  // Mia, 2026-09-21: top-right "Skip" is a Skipped term, live only before an
  // attempt (`idle`, or the typing screen), in a review run too.
  function handleSkip() {
    if (isReview) recordReviewResult(termIndex, 'Skipped')
    else recordResult(termIndex, 'Skipped')
    handleContinue()
  }

  // Mia, 2026-09-21: "I don't know" is a Revealed term, from `idle` or from a
  // Hinted result, in a review run too.
  function handleDontKnow() {
    setSubState('resultRevealed')
  }

  // Revokes on unmount only (e.g. navigating away mid-session via
  // Close) — reads through refs rather than depending on the state
  // values directly, since `audioUrl`/`firstAttemptAudioUrl` both need
  // to survive being reassigned while the other one stays alive.
  const audioUrlRef = useRef<string | null>(null)
  const firstAttemptAudioUrlRef = useRef<string | null>(null)
  useEffect(() => {
    audioUrlRef.current = audioUrl
  }, [audioUrl])
  useEffect(() => {
    firstAttemptAudioUrlRef.current = firstAttemptAudioUrl
  }, [firstAttemptAudioUrl])
  useEffect(() => {
    return () => {
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current)
      if (firstAttemptAudioUrlRef.current) URL.revokeObjectURL(firstAttemptAudioUrlRef.current)
      const recorder = recorderRef.current
      if (recorder && recorder.state !== 'inactive') recorder.stop()
      streamRef.current?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  // SPEC.md's real ~2-3s auto-advance timer, branching by which processing
  // screen this is and by the term's outcome. `processing`/`typeProcessing`
  // are first attempts; the retry versions always succeed, per SPEC.md.
  useEffect(() => {
    const next: Partial<Record<SubState, SubState>> = {
      processing: outcome === 'Hinted' ? 'resultHinted1' : outcome === 'Revealed' ? 'resultRevealed' : 'resultRecalled',
      hinted2Processing: 'resultHinted1Recalled',
      typeProcessing: outcome === 'Hinted' ? 'typeResultHinted' : outcome === 'Revealed' ? 'typeResultRevealed' : 'typeResultRecalled',
      typeRetryProcessing: 'typeResultHinted1Recalled',
    }
    const target = next[subState]
    if (!target) return
    const timer = setTimeout(() => setSubState(target), 1500)
    return () => clearTimeout(timer)
  }, [subState, outcome])

  // One row of a term's history: a recording plays back, typed text echoes as
  // the `Input` bubble `typeResultRecalled` already uses.
  const firstAttemptRow =
    firstAttemptText !== null ? (
      <SpeechBubble state="Input" message={firstAttemptText} className="w-full" />
    ) : (
      <AudioScrubber state={isPlayingFirstAttempt ? 'Playing' : 'Default'} onClick={handleToggleFirstAttemptPlayback} />
    )

  // The history stack shared by every Hinted retry screen (`hinted2Processing`,
  // `resultHinted1Recalled`, and their typed twins): the prompt, the first
  // attempt, the Hint 1 header collapsed to plain text, and — once the second
  // attempt exists — that attempt's row. Live frames 13727:15363 and
  // 13673:13893 for the voice version.
  const hintedHistoryTop = (isTextRetry: boolean) => (
    <>
      <p
        className="w-full"
        style={{
          margin: 0,
          fontFamily: 'var(--type-scale-headline-xs-regular-font-family)',
          fontWeight: 'var(--type-scale-headline-xs-regular-font-weight)',
          fontSize: 'var(--type-scale-headline-xs-regular-font-size)',
          lineHeight: 'var(--type-scale-headline-xs-regular-line-height)',
          letterSpacing: 'var(--type-scale-headline-xs-regular-letter-spacing)',
          color: 'var(--semantic-color-text-primary)',
        }}
      >
        {isTextRetry ? textPrompt : term.prompt}
      </p>

      {firstAttemptRow}

      <div className="flex w-full flex-col items-start" style={{ gap: 'var(--size-space-100)' }}>
        <div className="flex w-full flex-col items-start" style={{ gap: 2 }}>
          <div className="inline-flex shrink-0 items-center" style={{ gap: 4 }}>
            <IconSlot size="300" icon={<AlertCircleIcon />} style={{ color: 'var(--semantic-color-text-warning)' }} />
            <p
              style={{
                margin: 0,
                color: 'var(--semantic-color-text-warning)',
                fontFamily: "'Greed VF-TRIAL', sans-serif",
                fontWeight: 700,
                fontSize: 20,
                lineHeight: 'normal',
              }}
            >
              Not quite yet.
            </p>
          </div>
          <p
            className="w-full"
            style={{ margin: 0, color: 'var(--semantic-color-text-secondary)', fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 12, lineHeight: 'normal' }}
          >
            Hint 1 of 2
          </p>
        </div>
        <p
          className="w-full"
          style={{
            margin: 0,
            color: 'var(--semantic-color-text-primary)',
            fontFamily: 'var(--type-scale-headline-xs-regular-font-family)',
            fontWeight: 'var(--type-scale-headline-xs-regular-font-weight)',
            fontSize: 'var(--type-scale-headline-xs-regular-font-size)',
            lineHeight: 'var(--type-scale-headline-xs-regular-line-height)',
            letterSpacing: 'var(--type-scale-headline-xs-regular-letter-spacing)',
          }}
        >
          No worries. Think about the very first step, before you start narrowing down to your favourite idea.
        </p>
      </div>
    </>
  )

  const secondAttemptRow = (isTextRetry: boolean) =>
    isTextRetry ? (
      <SpeechBubble state="Input" message={typedAnswer} className="w-full" />
    ) : (
      <AudioScrubber state={isPlaying ? 'Playing' : 'Default'} onClick={handleTogglePlayback} />
    )

  // `Learning-topic 2-result-Hinted1-processing` and `-recalled` (and the
  // typed twins) only diverge on the final row: bare `thinking` pose +
  // `SpeechBubble state="Loading"` while processing, vs. the full `MascotSlot`
  // + `SpeechBubble state="Success"` once resolved. `subtitle="Hint 1 of 2"`
  // — this term only ever needs one hint. Terminal — single "Continue".
  const hintedRetryResult = (isTextRetry: boolean, isProcessing: boolean) => (
    <div className="flex w-full flex-col items-end" style={{ gap: 'var(--size-space-400)' }}>
      {hintedHistoryTop(isTextRetry)}
      {secondAttemptRow(isTextRetry)}

      {isProcessing ? (
        <div className="flex w-full items-center" style={{ gap: 'var(--size-space-200)' }}>
          <Image src="/images/thinking.svg" alt="" width={70} height={70} style={{ flexShrink: 0 }} />
          <SpeechBubble state="Loading" className="flex-1" />
        </div>
      ) : (
        <div className="flex w-full items-center" style={{ gap: 'var(--size-space-200)' }}>
          <MascotSlot size="XL" pose="approving" />
          <SpeechBubble state="Success" title="Nice!" subtitle="Hint 1 of 2" message={term.recalledMessage} className="flex-1" />
        </div>
      )}
    </div>
  )

  // `Learning-topic 2-result-Hinted1` (node 13622:17189) and
  // `Learning-topic 2-result-Hinted1-recording` (node 13728:15704) share this
  // identical row — the full mascot + `SpeechBubble state="Warning"`, not the
  // collapsed-to-plain-text treatment the retry history uses.
  const hintedWarningRow = (
    <div className="flex w-full items-center" style={{ gap: 'var(--size-space-200)' }}>
      <MascotSlot size="XL" pose="approving" />
      <SpeechBubble
        state="Warning"
        title="Not quite yet."
        subtitle="Hint 1 of 2"
        message="No worries. Think about the very first step, before you start narrowing down to your favourite idea."
        className="flex-1"
      />
    </div>
  )

  // The typing surface `typeInput` and `typeRetryInput` share: `TextField`
  // chrome with a native `<input>` layered over its own field box (same
  // background/border/radius/type scale, so it reads as one continuous pill)
  // to actually capture keystrokes. `showCaption={false}` because the live
  // caption binds `text/tertiary`, not the `text/secondary` `TextField`'s own
  // caption slot always uses — hand-built as its own paragraph instead.
  const typeField = (
    <div className="flex w-full flex-col items-start" style={{ gap: 'var(--size-space-050)' }}>
      <div className="relative w-full">
        <TextField variant="Placeholder" showTitle={false} showCaption={false} showLeadingIcon={false} placeholder="Type a short answer..." />
        <input
          type="text"
          value={typedAnswer}
          onChange={(event) => setTypedAnswer(event.target.value)}
          placeholder="Type a short answer..."
          aria-label="Type a short answer"
          className="absolute inset-0 w-full placeholder:text-(--semantic-color-text-secondary)"
          style={{
            boxSizing: 'border-box',
            padding: 'var(--size-space-300)',
            borderRadius: 'var(--size-radius-400)',
            background: 'var(--semantic-color-background-input)',
            border: '1px solid var(--semantic-color-border-default)',
            outline: 'none',
            fontFamily: "'Inter Variable', sans-serif",
            fontWeight: 'var(--type-scale-headline-xxs-bold-font-weight)' as unknown as number,
            fontSize: 14,
            lineHeight: 'var(--type-scale-headline-xxs-bold-line-height)',
            letterSpacing: 'var(--type-scale-headline-xxs-bold-letter-spacing)',
            color: 'var(--semantic-color-text-primary)',
          }}
        />
      </div>
      <p
        className="w-full"
        style={{
          margin: 0,
          fontFamily: 'var(--type-scale-caption-m-regular-font-family)',
          fontWeight: 'var(--type-scale-caption-m-regular-font-weight)',
          fontSize: 'var(--type-scale-caption-m-regular-font-size)',
          lineHeight: 'var(--type-scale-caption-m-regular-line-height)',
          letterSpacing: 'var(--type-scale-caption-m-regular-letter-spacing)',
          color: 'var(--semantic-color-text-tertiary)',
        }}
      >
        A couple of sentences is enough, you don&apos;t need to retype the full explanation.
      </p>
    </div>
  )

  // The plain-text prompt every result-shaped frame drops to.
  const promptText = (text: string) => (
    <p
      className="w-full"
      style={{
        margin: 0,
        fontFamily: 'var(--type-scale-headline-xs-regular-font-family)',
        fontWeight: 'var(--type-scale-headline-xs-regular-font-weight)',
        fontSize: 'var(--type-scale-headline-xs-regular-font-size)',
        lineHeight: 'var(--type-scale-headline-xs-regular-line-height)',
        letterSpacing: 'var(--type-scale-headline-xs-regular-letter-spacing)',
        color: 'var(--semantic-color-text-primary)',
      }}
    >
      {text}
    </p>
  )

  return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--semantic-color-background-page)' }}>
      <div className="relative flex w-full max-w-[390px] flex-col overflow-hidden" style={{ height: 844 }}>
        <StatusBar />

        {/* Mounted once, persistently, rather than scoped inside any
            one subState's own block — an `<audio>` scoped to e.g.
            `readyToSend`'s block would unmount (losing its ref) the
            moment `subState` moved on to `processing`/`resultRecalled`/
            `resultHinted1`, silently breaking those screens' own
            `AudioScrubber` taps. Both stay mounted across every
            subState that might show either scrubber. */}
        {audioUrl && (
          <audio
            ref={audioElRef}
            src={audioUrl}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          />
        )}
        {firstAttemptAudioUrl && (
          <audio
            ref={firstAttemptAudioElRef}
            src={firstAttemptAudioUrl}
            onPlay={() => setIsPlayingFirstAttempt(true)}
            onPause={() => setIsPlayingFirstAttempt(false)}
            onEnded={() => setIsPlayingFirstAttempt(false)}
          />
        )}

        <AppBar variant="leftIconButtonOnly" leftIcon={CLOSE_ICON} leftLabel="Close" onLeftClick={() => router.push('/')}>
          <div className="flex h-full w-full items-center" style={{ gap: 'var(--size-space-200)', padding: '10px 0' }}>
            <div className="flex-1">
              {/* Caps at 75%, not 100%, once on term 4 — confirmed by
                  comparing the live fill fractions across screens rather
                  than assuming a straight `(termIndex+1)*25`: term 1 is 25%,
                  term 2 50%, term 3 75%, and term 4 is *also* 75%, since
                  100 is reserved for the end of a run. The one exception
                  is a review run's last result (live frame `Learning-topic
                  4-result-unaided`, node 13737:17501), which shows a full
                  100% bar — that run ends on Summary-all recalled. */}
              <ProgressIndicator
                variant="Primary"
                thickness="16"
                progress={(isFinalReviewResult ? '100' : String(Math.min(termIndex + 1, 3) * 25)) as ProgressIndicatorProgress}
                label="Topic progress"
              />
            </div>
            <div
              className="inline-flex shrink-0 items-center"
              style={{ gap: 'var(--size-space-100)', padding: '0 var(--size-space-100)' }}
            >
              <span style={{ width: 17.934, height: 22, display: 'inline-flex' }}>
                <LightningIcon />
              </span>
              <span
                style={{
                  fontFamily: 'var(--type-scale-headline-xs-bold-font-family)',
                  fontWeight: 'var(--type-scale-headline-xs-bold-font-weight)',
                  fontSize: 'var(--type-scale-headline-xs-bold-font-size)',
                  lineHeight: 'var(--type-scale-headline-xs-bold-line-height)',
                  letterSpacing: 'var(--type-scale-headline-xs-bold-letter-spacing)',
                  color: 'var(--semantic-color-accent-blue-on-subtle)',
                }}
              >
                {xpGoal}
              </span>
            </div>
          </div>
        </AppBar>

        {/* Mia, 2026-09-21: the status bar, appBar, `Steps` row and the bottom
            content stay put and only the middle scrolls, so a long history
            never pushes the buttons out of the 390 x 844 frame. `Steps` is 48px
            tall and sits flush under the appBar; the content below starts
            16px under it on every frame, 24px on Learning-topic 1-result
            (synced 2026-09-19). */}
        {/* `Steps` (Figma node 13764:16058): "Topics N of M" + Skip. Skip is
            live only before an attempt, on `idle` and `typeInput` (Mia,
            2026-09-21); everywhere else it is in Button's Disabled state. */}
        <div className="w-full shrink-0" style={{ padding: '0 var(--size-space-400)' }}>
          <Steps
            current={pos + 1}
            total={runTermCount}
            onSkip={isBeforeAttempt ? handleSkip : undefined}
            skipDisabled={!isBeforeAttempt}
          />
        </div>

        <main
          ref={scrollRef}
          className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{
            padding: `${subState === 'resultRecalled' ? 'var(--size-space-600)' : 'var(--size-space-400)'} var(--size-space-400) var(--size-space-400)`,
          }}
        >
          <div className="flex w-full flex-col items-center">
            {subState === 'hinted2Processing' || subState === 'resultHinted1Recalled' ? (
              hintedRetryResult(false, subState === 'hinted2Processing')
            ) : subState === 'typeRetryProcessing' || subState === 'typeResultHinted1Recalled' ? (
              hintedRetryResult(true, subState === 'typeRetryProcessing')
            ) : subState === 'processing' ||
              subState === 'resultRecalled' ||
              subState === 'resultHinted1' ||
              subState === 'hinted2Recording' ||
              subState === 'hinted2ReadyToSend' ||
              subState === 'resultRevealed' ? (
              // `Learning-processing`, `Learning-result-Recalled`,
              // `Learning-result-Hinted1`, `Learning-topic 2-result-Hinted1-
              // recording`, `Learning-topic 2-result-Hinted1-ready to send`, and
              // `Learning-result-Revealed` all share this same
              // restructured layout: the mascot+tail prompt bubble drops
              // to plain text (the question has already been "said"; it
              // now reads as a caption of what was asked), with an
              // `AudioScrubber` above a second mascot+bubble row.
              // Right-aligned (`items-end`) to match all six live
              // frames; the plain-text block and the header row above
              // are full-width regardless, so this only visibly affects
              // the non-full-width `AudioScrubber`.
              <div className="flex w-full flex-col items-end" style={{ gap: 'var(--size-space-400)' }}>
                <p
                  className="w-full"
                  style={{
                    margin: 0,
                    fontFamily: 'var(--type-scale-headline-xs-regular-font-family)',
                    fontWeight: 'var(--type-scale-headline-xs-regular-font-weight)',
                    fontSize: 'var(--type-scale-headline-xs-regular-font-size)',
                    lineHeight: 'var(--type-scale-headline-xs-regular-line-height)',
                    letterSpacing: 'var(--type-scale-headline-xs-regular-letter-spacing)',
                    color: 'var(--semantic-color-text-primary)',
                  }}
                >
                  {term.prompt}
                </p>

                {subState === 'hinted2Recording' || subState === 'hinted2ReadyToSend' ? (
                  // `Learning-topic 2-result-Hinted1-recording`'s and
                  // `Learning-topic 2-result-Hinted1-ready to send`'s own top
                  // scrubber both play back the *first* attempt — bound
                  // to `firstAttemptAudioUrl`, not the generic
                  // `audioUrl`. By `hinted2ReadyToSend`, `audioUrl`
                  // already holds the *second* attempt's own URL (set by
                  // `handleStopRecording`), so using it here would show
                  // the wrong clip — confirmed from the live frame,
                  // which has its own separate second `AudioScrubber`
                  // for that one, down in `bottomContent` below.
                  // A typed first attempt shows as the `Input` bubble instead
                  // (`firstAttemptRow`).
                  firstAttemptRow
                ) : subState === 'resultRevealed' ? (
                  // `Learning-result-Revealed`'s own live frame (node
                  // 13669:17091) has no `AudioScrubber` at all — term 3's
                  // real attempt is revealed straight away, never
                  // replayed. Confirmed absent, not an oversight to fill
                  // in.
                  null
                ) : (
                  <AudioScrubber state={isPlaying ? 'Playing' : 'Default'} onClick={handleTogglePlayback} />
                )}

                {subState === 'processing' ? (
                  <div className="flex w-full items-center" style={{ gap: 'var(--size-space-200)' }}>
                    {/* SPEC.md: bare `pose="thinking"` instance, not through
                        `MascotSlot`'s usual size+pose swap — design-system.md's
                        own flagged gap, reproduced exactly rather than routed
                        through the component it deliberately bypasses on this
                        one screen. */}
                    <Image src="/images/thinking.svg" alt="" width={70} height={70} style={{ flexShrink: 0 }} />
                    <SpeechBubble state="Loading" className="flex-1" />
                  </div>
                ) : subState === 'resultRecalled' ? (
                  // `Learning-result-Recalled`'s own live frame goes back
                  // to the normal `MascotSlot` wrapper (not the bare
                  // `thinking` pose `processing` uses), with a `Success`
                  // `SpeechBubble` — title "Nice!", subtitle "Unaided",
                  // and a message that echoes back what the student
                  // "said". SPEC.md's own mocked-recall section says no
                  // transcript is ever shown anywhere in the loop; the
                  // live frame shows one anyway. Per Mia's explicit call
                  // (asked directly, since this is a real conflict with
                  // an explicitly-reasoned constraint, not a stale-prose
                  // gap): built to match the frame exactly, flagged in
                  // component-gaps.md.
                  <div className="flex w-full items-center" style={{ gap: 'var(--size-space-200)' }}>
                    <MascotSlot size="XL" pose="approving" />
                    <SpeechBubble
                      state="Success"
                      title="Nice!"
                      subtitle="Unaided"
                      message={term.recalledMessage}
                      className="flex-1"
                    />
                  </div>
                ) : subState === 'resultRevealed' ? (
                  // `Learning-result-Revealed`'s own live frame (node
                  // 13669:17091): same normal `MascotSlot` wrapper again,
                  // with a `Error` `SpeechBubble` — real title/subtitle/
                  // message confirmed from the frame, not SPEC.md's
                  // generic "state=Error, showing the correct term"
                  // alone. `SpeechBubble`'s own `Error` state already
                  // supplies the x-circle icon/title color internally.
                  <div className="flex w-full items-center" style={{ gap: 'var(--size-space-200)' }}>
                    <MascotSlot size="XL" pose="approving" />
                    <SpeechBubble
                      state="Error"
                      title="Here’s the answer."
                      subtitle="Revealed"
                      message={term.revealMessage}
                      className="flex-1"
                    />
                  </div>
                ) : (
                  // `Learning-result-Hinted1` (node 13622:17189) and
                  // `Learning-topic 2-result-Hinted1-recording` (node
                  // 13728:15704) share the identical `hintedWarningRow`
                  // — same normal `MascotSlot` wrapper as Recalled, with
                  // a `Warning` `SpeechBubble` instead. Confirmed
                  // independently from each live frame, not assumed to
                  // carry over.
                  hintedWarningRow
                )}
              </div>
            ) : subState === 'typeInput' ? (
              // `Learning-topic 1-typeInput` (node 13622:18322): the same
              // mascot+tailed `Prompt` bubble row `idle` uses, plus the
              // real `TextField` chrome below it. SPEC.md: "TextField has
              // no value/onChange... its Default variant's displayed text
              // is a hardcoded literal, not a prop" — `showCaption={false}`
              // here rather than SPEC.md's literal `showCaption` prop
              // value, since the real caption on this live frame binds
              // `text/tertiary`, not the muted `text/secondary`
              // `TextField`'s own caption slot always uses (confirmed via
              // `get_design_context`, not assumed) — hand-built as its own
              // paragraph below instead of forcing the wrong color through
              // the real prop. A real native `<input>` is layered exactly
              // over `TextField`'s own field box (same background/border/
              // radius/type scale, so it reads as one continuous pill) to
              // actually capture keystrokes, per SPEC.md's own note that
              // `TextField` "supplies the chrome, not the capture."
              <div className="flex w-full flex-col items-start" style={{ gap: 'var(--size-space-400)' }}>
                <div className="flex w-full items-center" style={{ gap: 'var(--size-space-200)' }}>
                  <MascotSlot size="XL" pose="approving" />
                  <SpeechBubble state="Prompt" message={textPrompt} className="flex-1" />
                </div>

                {typeField}
              </div>
            ) : subState === 'typeProcessing' ? (
              // `Learning-topic 1-typeProcessing` (node 13673:13599).
              // SPEC.md: "Same as processing above, plus SpeechBubble
              // state="Input" showSubtitle echoing back what was typed,
              // shown alongside the Loading bubble." The live frame's own
              // echo isn't `SpeechBubble`'s `Input` state, though —
              // `Input` drops the tail for a plain bubble (per that
              // component's own doc), but this echo keeps the same
              // "You typed" title + bordered box shape `TextField` uses
              // on `typeInput` itself, not a second bubble. Reproduced to
              // match the live frame: hand-built inline reusing the same
              // real tokens `TextField`'s own title/field literals
              // already use (see component-gaps.md), not a `SpeechBubble`
              // instance. The prompt drops to the same bare plain-text
              // treatment the voice path's `processing` already uses.
              <div className="flex w-full flex-col items-end" style={{ gap: 'var(--size-space-400)' }}>
                <p
                  className="w-full"
                  style={{
                    margin: 0,
                    fontFamily: 'var(--type-scale-headline-xs-regular-font-family)',
                    fontWeight: 'var(--type-scale-headline-xs-regular-font-weight)',
                    fontSize: 'var(--type-scale-headline-xs-regular-font-size)',
                    lineHeight: 'var(--type-scale-headline-xs-regular-line-height)',
                    letterSpacing: 'var(--type-scale-headline-xs-regular-letter-spacing)',
                    color: 'var(--semantic-color-text-primary)',
                  }}
                >
                  {textPrompt}
                </p>

                <div className="flex w-full flex-col items-start" style={{ gap: 'var(--size-space-200)' }}>
                  {/* Matches `TextField`'s own `FIELD_TEXT_STYLE` literal
                      exactly (Inter Variable, headline-xxs-bold weight/
                      line-height/tracking, 14px — none of it a real bound
                      Figma text style, per that component's own doc
                      comment) rather than reinventing a slightly-different
                      literal for the same real title copy. */}
                  <p
                    className="w-full"
                    style={{
                      margin: 0,
                      fontFamily: "'Inter Variable', sans-serif",
                      fontWeight: 'var(--type-scale-headline-xxs-bold-font-weight)' as unknown as number,
                      fontSize: 14,
                      lineHeight: 'var(--type-scale-headline-xxs-bold-line-height)',
                      letterSpacing: 'var(--type-scale-headline-xxs-bold-letter-spacing)',
                      color: 'var(--semantic-color-text-primary)',
                    }}
                  >
                    You typed
                  </p>
                  <div className="flex w-full flex-col items-start" style={{ gap: 'var(--size-space-050)' }}>
                    <div
                      className="w-full"
                      style={{
                        boxSizing: 'border-box',
                        padding: 'var(--size-space-300)',
                        borderRadius: 'var(--size-radius-400)',
                        background: 'var(--semantic-color-background-input)',
                        border: '1px solid var(--semantic-color-border-default)',
                      }}
                    >
                      {/* Real Figma run is "Inter:Regular" 14px, unlike
                          the SemiBold title/field literal above — a
                          genuinely different weight on this live frame,
                          not a copy-paste of the title's own style. */}
                      <p
                        style={{
                          margin: 0,
                          fontFamily: "'Inter Variable', sans-serif",
                          fontWeight: 400,
                          fontSize: 14,
                          lineHeight: 'normal',
                          color: 'var(--semantic-color-text-primary)',
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {typedAnswer}
                      </p>
                    </div>
                    <p
                      className="w-full"
                      style={{
                        margin: 0,
                        fontFamily: 'var(--type-scale-caption-m-regular-font-family)',
                        fontWeight: 'var(--type-scale-caption-m-regular-font-weight)',
                        fontSize: 'var(--type-scale-caption-m-regular-font-size)',
                        lineHeight: 'var(--type-scale-caption-m-regular-line-height)',
                        letterSpacing: 'var(--type-scale-caption-m-regular-letter-spacing)',
                        color: 'var(--semantic-color-text-tertiary)',
                      }}
                    >
                      A couple of sentences is enough, you don&apos;t need to retype the full explanation.
                    </p>
                  </div>
                </div>

                <div className="flex w-full items-center" style={{ gap: 'var(--size-space-200)' }}>
                  <Image src="/images/thinking.svg" alt="" width={70} height={70} style={{ flexShrink: 0 }} />
                  <SpeechBubble state="Loading" className="flex-1" />
                </div>
              </div>
            ) : subState === 'typeResultRecalled' ? (
              // `Learning-topic 1-typeResult-Recalled` (node
              // 13622:18425). Its own designer note: "Unaided correct
              // result on the text-fallback path. What the student typed
              // shows as plain body copy rather than an audio bubble."
              // The live frame's echo turns out to be a real `speechBubble`
              // after all, though (bg/surface fill, no tail) — exactly
              // `SpeechBubble`'s own documented `Input` state (design-
              // system.md: "real instances on Learning-typeResult-Recalled
              // and Learning-typeProcessing"), not the `TextField`-shaped
              // bordered box `typeProcessing`'s own frame used for the
              // same echo (see that screen's own component-gaps.md entry
              // — the two live frames genuinely use two different shapes
              // for what SPEC.md describes as the identical echo). Built
              // with the real component here since this frame's shape
              // matches it exactly. The outcome bubble below reuses
              // `SpeechBubble`'s own real `Success` defaults — same
              // "Nice!"/"Unaided"/"You said: ..." copy as the voice
              // path's own `resultRecalled`, copied verbatim from the
              // live frame even though the "You said" phrasing reads
              // like an unedited carryover from the voice screen on a
              // typed-answer result — flagged, not silently reworded.
              <div className="flex w-full flex-col items-end" style={{ gap: 'var(--size-space-400)' }}>
                <p
                  className="w-full"
                  style={{
                    margin: 0,
                    fontFamily: 'var(--type-scale-headline-xs-regular-font-family)',
                    fontWeight: 'var(--type-scale-headline-xs-regular-font-weight)',
                    fontSize: 'var(--type-scale-headline-xs-regular-font-size)',
                    lineHeight: 'var(--type-scale-headline-xs-regular-line-height)',
                    letterSpacing: 'var(--type-scale-headline-xs-regular-letter-spacing)',
                    color: 'var(--semantic-color-text-primary)',
                  }}
                >
                  {textPrompt}
                </p>

                <SpeechBubble state="Input" message={typedAnswer} className="w-full" />

                <div className="flex w-full items-center" style={{ gap: 'var(--size-space-200)' }}>
                  <MascotSlot size="XL" pose="approving" />
                  <SpeechBubble
                    state="Success"
                    title="Nice!"
                    subtitle="Unaided"
                    message={term.recalledMessage}
                    className="flex-1"
                  />
                </div>
              </div>
            ) : subState === 'typeResultHinted' ? (
              // Mia, 2026-09-21: no Figma frame. `Learning-topic 2-result-Hinted1`
              // with the typed answer in place of the scrubber — see
              // the voice screen's layout.
              <div className="flex w-full flex-col items-end" style={{ gap: 'var(--size-space-400)' }}>
                {promptText(textPrompt)}
                <SpeechBubble state="Input" message={typedAnswer} className="w-full" />
                {hintedWarningRow}
              </div>
            ) : subState === 'typeRetryInput' ? (
              // The hint retry by typing (preview frames 2 and 5): history, then the field.
              <div className="flex w-full flex-col items-end" style={{ gap: 'var(--size-space-400)' }}>
                {hintedHistoryTop(true)}
                {typeField}
              </div>
            ) : subState === 'typeResultRevealed' ? (
              // `Learning-topic 3-result-Revealed` plus the typed answer (preview frame 6).
              <div className="flex w-full flex-col items-end" style={{ gap: 'var(--size-space-400)' }}>
                {promptText(textPrompt)}
                <SpeechBubble state="Input" message={typedAnswer} className="w-full" />
                <div className="flex w-full items-center" style={{ gap: 'var(--size-space-200)' }}>
                  <MascotSlot size="XL" pose="approving" />
                  <SpeechBubble state="Error" title="Here’s the answer." subtitle="Revealed" message={term.revealMessage} className="flex-1" />
                </div>
              </div>
            ) : (
              <div className="flex w-full items-center" style={{ gap: 'var(--size-space-200)' }}>
                <MascotSlot size="XL" pose="approving" />
                <SpeechBubble state="Prompt" message={term.prompt} className="flex-1" />
              </div>
            )}
          </div>
        </main>

        {/* `Learning-recording`'s own real node adds a full-bleed
            `background/scrim` dim behind the bottom content (its own
            fallback hex reads opaque `#0a0a0a`, but the real bound
            token is `rgba(10,10,10,0.5)` — bound to that, not the
            literal). Positioned absolute so the mic button below still
            paints above it. `Learning-topic 2-result-Hinted1-recording`'s own
            live frame (node 13728:15704) has the identical scrim layer
            — confirmed independently, not assumed to carry over from
            `recording`. */}
        {(subState === 'recording' || subState === 'hinted2Recording') && (
          <div className="pointer-events-none absolute inset-0" style={{ background: 'var(--semantic-color-background-scrim)' }} />
        )}

        <div className="relative flex w-full shrink-0 flex-col items-center" style={{ gap: 'var(--size-space-400)', padding: 'var(--size-space-700)' }}>
          {subState === 'idle' && (
            <>
              {/* Mia, 2026-09-21: every term can be answered by voice or by
                  typing, and "I don't know" (a Revealed term) works on any
                  term of a first run. A review run is always correct, so its
                  "I don't know" stays inert. */}
              <MicButton state="Idle" showLabel onClick={handleMicTap} />
              <div className="flex items-start" style={{ gap: 'var(--size-space-600)' }}>
                <Button
                  variant="Tertiary"
                  size="S"
                  cta="Type instead"
                  onClick={() => {
                    setInputMode('text')
                    setSubState('typeInput')
                  }}
                />
                <Button
                  variant="Tertiary"
                  size="S"
                  cta="I don’t know"
                  onClick={handleDontKnow}
                />
              </div>
            </>
          )}

          {(subState === 'recording' || subState === 'hinted2Recording') && (
            <MicButton state="Recording" onClick={handleStopRecording} />
          )}

          {(subState === 'readyToSend' || subState === 'hinted2ReadyToSend') && (
            // `Learning-topic 2-result-Hinted1-ready to send`'s own bottomContent
            // (node 13728:15886) is identical to the generic
            // `Learning-ready to send`'s — same `AudioScrubber` (playing
            // the just-finished second attempt, via the generic
            // `audioUrl`/`isPlaying` pair), `StatusIndicator`, and
            // Redo/Send/Resume row. Confirmed from the live frame, not
            // assumed — its only real difference from the generic screen
            // is the extra history kept in `middleContent` above.
            <>
              <AudioScrubber state={isPlaying ? 'Playing' : 'Default'} onClick={handleTogglePlayback} />
              <StatusIndicator status="Ready" />
              <div className="flex items-start" style={{ gap: 'var(--size-space-400)' }}>
                <div className="flex flex-col items-center" style={{ gap: 'var(--size-space-400)' }}>
                  {/* No `ButtonIcon` variant produces this destructive
                      red-on-dark-red fill — Primary/Secondary/Tertiary
                      map to interactive/primary, background/surface, and
                      no fill respectively, per `shared/buttonVariants.ts`.
                      Built inline, matching `ButtonIcon`'s own L-size
                      shape (56px circle, 24px icon, bottom bevel) with
                      real bound colors (`feedback/error/on-bold` fill,
                      `feedback/error/bold` icon) instead. */}
                  <button
                    type="button"
                    aria-label="Redo"
                    onClick={handleRedo}
                    className="relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full"
                    style={{ width: 56, height: 56, background: 'var(--semantic-color-feedback-error-on-bold)' }}
                  >
                    <span style={{ width: 24, height: 24, color: 'var(--semantic-color-feedback-error-bold)' }}>
                      <DeleteIcon />
                    </span>
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 rounded-full"
                      style={{ boxShadow: 'inset 0 -4px 0 0 rgba(0,0,0,0.15)' }}
                    />
                  </button>
                  <span
                    style={{
                      fontFamily: 'var(--type-scale-headline-xxs-bold-font-family)',
                      fontWeight: 'var(--type-scale-headline-xxs-bold-font-weight)',
                      fontSize: 'var(--type-scale-headline-xxs-bold-font-size)',
                      lineHeight: 'var(--type-scale-headline-xxs-bold-line-height)',
                      letterSpacing: 'var(--type-scale-headline-xxs-bold-letter-spacing)',
                      color: 'var(--semantic-color-text-secondary)',
                    }}
                  >
                    Redo
                  </span>
                </div>

                <div className="flex flex-col items-center" style={{ gap: 'var(--size-space-400)' }}>
                  <ButtonIcon variant="Primary" size="L" icon={<CheckIcon />} label="Send" onClick={handleSend} />
                  <span
                    style={{
                      fontFamily: 'var(--type-scale-headline-xxs-bold-font-family)',
                      fontWeight: 'var(--type-scale-headline-xxs-bold-font-weight)',
                      fontSize: 'var(--type-scale-headline-xxs-bold-font-size)',
                      lineHeight: 'var(--type-scale-headline-xxs-bold-line-height)',
                      letterSpacing: 'var(--type-scale-headline-xxs-bold-letter-spacing)',
                      color: 'var(--semantic-color-text-secondary)',
                    }}
                  >
                    Send
                  </span>
                </div>

                <div className="flex flex-col items-center" style={{ gap: 'var(--size-space-400)' }}>
                  <ButtonIcon variant="Secondary" size="L" icon={<PlayPauseIcon />} label="Resume" onClick={handleResume} />
                  <span
                    style={{
                      fontFamily: 'var(--type-scale-headline-xxs-bold-font-family)',
                      fontWeight: 'var(--type-scale-headline-xxs-bold-font-weight)',
                      fontSize: 'var(--type-scale-headline-xxs-bold-font-size)',
                      lineHeight: 'var(--type-scale-headline-xxs-bold-line-height)',
                      letterSpacing: 'var(--type-scale-headline-xxs-bold-letter-spacing)',
                      color: 'var(--semantic-color-text-secondary)',
                    }}
                  >
                    Resume
                  </span>
                </div>
              </div>
            </>
          )}

          {subState === 'processing' && <MicButton state="Processing" showLabel />}

          {subState === 'hinted2Processing' && <MicButton state="Processing" showLabel />}

          {/* Every result's bottom content is a single full-width "Continue"
              (SPEC.md), which moves to the next term's `idle`, or to Summary
              after the run's last term. */}
          {(subState === 'resultRecalled' ||
            subState === 'resultHinted1Recalled' ||
            subState === 'resultRevealed' ||
            subState === 'typeResultHinted1Recalled' ||
            subState === 'typeResultRevealed') && (
            <Button variant="Primary" size="L" cta="Continue" className="w-full" onClick={() => handleContinue()} />
          )}

          {subState === 'typeResultHinted' && inputMode === 'text' && (
            <>
              {/* Mia, 2026-09-21: the second attempt follows the input mode, so
                  after a typed first attempt the retry is typing, not the mic.
                  Same shape as the voice screen below with the roles swapped: a
                  Primary "Try again" opens the typed retry, "Switch to voice"
                  puts the mic back, "I don't know" gives up on the hint. No
                  Figma frame. */}
              <Button variant="Primary" size="L" cta="Try again" className="w-full" onClick={handleTypeRetry} />
              <div className="flex items-start" style={{ gap: 'var(--size-space-600)' }}>
                <Button variant="Tertiary" size="S" cta="Switch to voice" onClick={() => setInputMode('voice')} />
                <Button variant="Tertiary" size="S" cta="I don’t know" onClick={handleDontKnow} />
              </div>
            </>
          )}

          {(subState === 'resultHinted1' || (subState === 'typeResultHinted' && inputMode === 'voice')) && (
            <>
              {/* SPEC.md: "MicButton state=Idle (real precedent for a
                  re-attempt entry point here)." Caption "Try again" (via
                  MicButton's `label` override) starts a real second
                  recording. Mia, 2026-09-21: "Type instead" retries by
                  typing, and "I don't know" gives up on the hint, a
                  Revealed term. */}
              <MicButton state="Idle" showLabel label="Try again" onClick={handleRetry} />
              <div className="flex items-start" style={{ gap: 'var(--size-space-600)' }}>
                <Button variant="Tertiary" size="S" cta="Type instead" onClick={handleTypeRetry} />
                <Button variant="Tertiary" size="S" cta="I don’t know" onClick={handleDontKnow} />
              </div>
            </>
          )}

          {subState === 'typeInput' && (
            // SPEC.md: "tap 'Submit' → typeProcessing. Tap 'Switch to
            // voice' → idle (voice mode, same term)." The live frame's
            // own `buttonGroup` (node 13702:14138) pairs a filled Submit
            // with "Switch to voice" — `Primary` + `Secondary`, exactly
            // `ButtonGroup`'s own `Vertical` shape.
            <ButtonGroup
              variant="Vertical"
              size="L"
              primary={{
                cta: 'Submit',
                onClick: handleSubmitTyped,
                // Mia 2026-09-21: an empty answer can't be submitted.
                state: typedAnswer.trim() === '' ? 'Disabled' : 'Default',
              }}
              secondary={{ cta: 'Switch to voice', onClick: handleSwitchToVoice }}
            />
          )}

          {subState === 'typeRetryInput' && (
            <ButtonGroup
              variant="Vertical"
              size="L"
              primary={{
                cta: 'Submit',
                onClick: handleSubmitTypedRetry,
                state: typedAnswer.trim() === '' ? 'Disabled' : 'Default',
              }}
              secondary={{ cta: 'Switch to voice', onClick: handleSwitchToVoiceFromRetry }}
            />
          )}

          {(subState === 'typeProcessing' || subState === 'typeRetryProcessing') && (
            // `Learning-topic 1-typeProcessing`'s own designer note:
            // "Submit and Switch to voice are dimmed to read as disabled
            // during the wait" — real `Button` `state="Disabled"` on both,
            // genuinely inert (no `onClick`), same as the voice path's
            // own `processing`.
            <ButtonGroup
              variant="Vertical"
              size="L"
              primary={{ cta: 'Submit', state: 'Disabled' }}
              secondary={{ cta: 'Switch to voice', state: 'Disabled' }}
            />
          )}

          {subState === 'typeResultRecalled' && (
            // Live frame's own bottomContent (node 13622:18567) keeps
            // both "Continue" (Primary/L) and a second, real "Switch to
            // voice" (Secondary/L) — the designer note's own "Switch to
            // voice stays available even after a correct answer." Now
            // wired (Mia, 2026-09-21: typing sticks until switched): it
            // moves on to the next term's voice `idle`, rather than
            // resetting this term, whose outcome is already resolved.
            <div className="flex w-full flex-col items-start" style={{ gap: 'var(--size-space-200)' }}>
              <Button variant="Primary" size="L" cta="Continue" className="w-full" onClick={() => handleContinue()} />
              <Button variant="Secondary" size="L" cta="Switch to voice" className="w-full" onClick={() => handleContinue('voice')} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Session() {
  // The run list and the recorded results come from sessionStorage, so render
  // only once mounted on the client.
  const mounted = useMounted()
  return <Suspense fallback={null}>{mounted ? <SessionContent /> : null}</Suspense>
}
