'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { AppBar } from '@/components/AppBar/AppBar'
import { AudioScrubber } from '@/components/AudioScrubber/AudioScrubber'
import { Button } from '@/components/Button/Button'
import { ButtonIcon } from '@/components/ButtonIcon/ButtonIcon'
import { IconSlot } from '@/components/IconSlot/IconSlot'
import { MascotSlot } from '@/components/MascotSlot/MascotSlot'
import { MicButton } from '@/components/MicButton/MicButton'
import { ProgressIndicator, type ProgressIndicatorProgress } from '@/components/ProgressIndicator/ProgressIndicator'
import { SpeechBubble } from '@/components/SpeechBubble/SpeechBubble'
import { StatusBar } from '@/components/StatusBar/StatusBar'
import { StatusIndicator } from '@/components/StatusIndicator/StatusIndicator'
import { TextField } from '@/components/TextField/TextField'

// `Learning-idle`, `Learning-recording`, `Learning-ready to send`,
// `Learning-processing`, `Learning-result-Recalled`,
// `Learning-result-Hinted1`, `Learning-topic 2-result-Hinted1-recording`,
// `Learning-topic 2-result-Hinted1-ready to send`,
// `Learning-topic 2-result-Hinted1-processing`,
// `Learning-topic 2-result-Hinted1-recalled` (node 13673:13893 — corrected
// 2026-09-17, per Mia, from this doc's earlier `Learning-result-Hinted2-
// succeed`; see the `resultHinted1Recalled` block below), `Learning-result-Revealed`,
// `Learning-skipped`, `Learning-topic 1-typeInput`,
// `Learning-topic 1-typeProcessing`, and
// `Learning-topic 1-typeResult-Recalled` are built so far — Session is
// one route with many internal sub-states per SPEC.md ({ termIndex,
// mode, subState }); the Hinted/Revealed/Skipped `typeResult`
// equivalents aren't built yet. `typeProcessing`'s own auto-advance
// timer only branches on `term.outcome === 'Recalled'` for the same
// reason — term 1 is the only outcome with a built `typeResult`
// destination so far.
//
// `topic2ResultUnaided`, `topic3ResultUnaided`, and `topic4ResultUnaided`
// (`Learning-topic 2-result-unaided`, node 13737:17173; `Learning-topic
// 3-result-unaided`, node 13737:17370; `Learning-topic 4-result-unaided`,
// node 13737:17501) are also built below, but — per Mia's explicit call,
// 2026-09-17 — deliberately left unreachable: nothing sets any of the
// three subStates anywhere. Their live Figma frames sit on a separate
// connector chain (`StudyPlan-inProgress -> Learning-topic
// 2-result-unaided -> topic 3-unaided -> topic 4-unaided ->
// Summary-all recalled`) that skips term 1 entirely and ends at a
// different Summary variant — reads as a full alternate "everything
// recalled" demo path, not a branch of this sprint's own fixed script
// (term 2 always resolves `Hinted`, term 3 `Revealed`, term 4 `Skipped`,
// confirmed repeatedly above and in SPEC.md). Wiring any of the three
// into the live flow would contradict that script and would need real
// session-entry-source tracking (fresh vs. resumed-from-inProgress) —
// out of scope, per Mia's same call. `Summary-all recalled` (the chain's
// own destination) is separately built at `/summary?variant=all-recalled`
// — see that file and component-gaps.md. See component-gaps.md for this
// file's own three screens.
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
  | 'topic2ResultUnaided'
  | 'topic3ResultUnaided'
  | 'topic4ResultUnaided'

// SPEC.md: "The 4 terms are scripted by index, not by content: term 1
// resolves Recalled, term 2 Hinted, term 3 Revealed, term 4 Skipped."
// Prompt copy confirmed per-term from each term's own live Figma frame,
// not assumed to repeat an earlier term's. Term 3's own real frame
// (Learning-result-Revealed, node 13669:17091) shows no cold-skip
// variant reached from `idle`'s own "I don't know" — its prompt has
// already dropped out of the `Prompt` `SpeechBubble`'s bubble chrome
// into the same bare plain-text treatment `processing`/`resultRecalled`
// use, confirming term 3 really does attempt once via the normal
// `recording` → `readyToSend` → `processing` chain and gets revealed
// directly from there, never offered a hint first — not a separate
// cold-skip mechanic.
//
// **Term 4 ("Visual research," Skipped) turned out to supersede SPEC.md's
// own description, not just extend it.** SPEC.md's Hinted1 section says
// term 4 "attempts once, lands on the hint-shown state, then skips from
// there" via `Learning-result-Hinted1`'s own "I don't know" button,
// landing on a `Learning-result-I don't know` result screen (node
// `13674:14198`) that still exists in Figma with its own connector from
// Hinted1. But a separate, newer frame literally named `Learning-skipped`
// (node `13734:16233`) sits right after `Learning-result-Revealed` in the
// canvas's own term-by-term sequence, with its own explicit connectors:
// `Learning-result-Revealed -> Learning-skipped -> Summary`. Structurally
// it's identical to `Learning-idle` (MicButton Idle, tailed `SpeechBubble
// state="Prompt"`, "Type instead"/"I don't know") — it's term 4's own
// cold-start `idle`, not a post-attempt result screen, and it skips
// straight to Summary with no distinct result frame in between. Built to
// match this newer, positionally-canonical frame: term 4 never routes
// through Hinted1 at all. Flagged in component-gaps.md rather than
// silently picking one, since both frames are real and still connected.
const TERMS: { name: string; outcome: 'Recalled' | 'Hinted' | 'Revealed' | 'Skipped'; prompt: string }[] = [
  { name: 'Inspiration', outcome: 'Recalled', prompt: 'Let’s start. Explain the term “Inspiration” out loud, in your own words.' },
  { name: 'Divergent thinking', outcome: 'Hinted', prompt: 'Explain the term “Divergent thinking” out loud, in your own words.' },
  { name: 'Visual hierarchy', outcome: 'Revealed', prompt: 'Explain the term “visual hierarchy” out loud, in your own words.' },
  { name: 'Visual research', outcome: 'Skipped', prompt: 'Explain the term “Visual research” out loud, in your own words.' },
]

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

export default function Session() {
  const router = useRouter()
  const searchParams = useSearchParams()
  // SPEC.md: "Tap 'I can't talk right now' (on Primer-intro) → /session
  // (term 1, text mode), bypassing the mic-permission prompt entirely."
  // Same landing for micDenied's own "Continue with text." Primer links
  // here with `?entry=text` (see its own two buttons) rather than a
  // generic bare `/session`, now that `typeInput` is a real destination
  // to land on instead of the voice-mode `idle` both buttons used to
  // fall back to (previously flagged in component-gaps.md as "SPEC.md's
  // own voice/text distinction isn't wired").
  const [subState, setSubState] = useState<SubState>(() =>
    searchParams.get('entry') === 'text' ? 'typeInput' : 'idle',
  )
  const [termIndex, setTermIndex] = useState(0)
  const term = TERMS[termIndex]
  const hasNextTerm = termIndex + 1 < TERMS.length
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  // SPEC.md: Hinted1's "Try again" re-attempt keeps the first attempt's
  // recording around — `Learning-topic 2-result-Hinted1-recalled` plays
  // back both. Only ever set via `handleRetry`, below.
  const [isPlayingFirstAttempt, setIsPlayingFirstAttempt] = useState(false)
  const [firstAttemptAudioUrl, setFirstAttemptAudioUrl] = useState<string | null>(null)
  // True once "Try again" has been tapped for this term — tells the
  // `processing` timer to resolve to `resultHinted1Recalled` instead of
  // looping back to `resultHinted1`.
  const [isRetry, setIsRetry] = useState(false)
  // `typeInput`'s own real captured keystrokes — SPEC.md: "TextField has
  // no value/onChange... this screen needs its own plain native
  // input/textarea as the actual typing surface, held in local component
  // state... TextField supplies the chrome, not the capture." Not yet
  // consumed anywhere (SpeechBubble's `Input` state at `typeProcessing`/
  // `typeResult` isn't built), but captured now so it's ready once those
  // screens exist.
  const [typedAnswer, setTypedAnswer] = useState('')
  const streamRef = useRef<MediaStream | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const audioElRef = useRef<HTMLAudioElement | null>(null)
  const firstAttemptAudioElRef = useRef<HTMLAudioElement | null>(null)

  // SPEC.md: "The mic really requests OS permission via getUserMedia
  // and really records; AudioScrubber plays back that real audio."
  // Requests the real stream, then really records into it with
  // MediaRecorder — denial isn't handled here since Primer's own
  // mic-permission gate already covers that path before a student ever
  // reaches Session; see SPEC.md's Primer section. Shared by the first
  // attempt (`handleMicTap`, → the generic `recording`) and Hinted1's
  // re-attempt (`handleRetry`, → the real `Learning-topic 2-result-
  // Hinted1-recording` frame instead, confirmed as its own distinct
  // screen — node 13728:15704, keeping the first attempt's history on
  // screen rather than reusing the plain `recording` layout).
  async function startRecording(isRetryAttempt: boolean) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      chunksRef.current = []
      const recorder = new MediaRecorder(stream)
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data)
      }
      recorder.start()
      recorderRef.current = recorder
      if (isRetryAttempt) {
        setFirstAttemptAudioUrl(audioUrl)
        setIsRetry(true)
      }
      setSubState(isRetryAttempt ? 'hinted2Recording' : 'recording')
    } catch {
      // Denied mid-session isn't handled yet — no built destination for it.
    }
  }

  function handleMicTap() {
    void startRecording(false)
  }

  // SPEC.md: Hinted1's "Try again" → real re-attempt, looping back
  // through `hinted2Recording` → `hinted2ReadyToSend` → `hinted2Processing`.
  function handleRetry() {
    void startRecording(true)
  }

  // `recording`'s own mic tap stops the real recorder and stream, turns
  // the captured chunks into a real playable URL, and moves to
  // `readyToSend` (or, on a re-attempt, the real
  // `Learning-topic 2-result-Hinted1-ready to send` frame — node
  // 13728:15886, confirmed as its own distinct screen, not a reuse of
  // the generic one) — the SPEC.md-documented transition, now that a
  // screen exists to receive it. Doesn't revoke the previous `audioUrl`
  // here (unlike a plain overwrite) — on a Hinted1 re-attempt, that
  // previous URL is the first attempt's own recording, already moved to
  // `firstAttemptAudioUrl` by `handleRetry` and still needed for
  // `resultHinted1Recalled`'s two-scrubber playback. Explicit discards
  // (`handleRedo`, `handleContinue`) revoke instead.
  function handleStopRecording() {
    const recorder = recorderRef.current
    if (!recorder) return
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType })
      setAudioUrl(URL.createObjectURL(blob))
      streamRef.current?.getTracks().forEach((track) => track.stop())
      streamRef.current = null
      setSubState(isRetry ? 'hinted2ReadyToSend' : 'readyToSend')
    }
    recorder.stop()
  }

  // SPEC.md: tap "Switch to voice" → `idle` (voice mode, same term).
  // Clears whatever was typed so far, since going back to `idle` re-offers
  // both entry points fresh rather than leaving a stale draft behind.
  function handleSwitchToVoice() {
    setTypedAnswer('')
    setSubState('idle')
  }

  // SPEC.md: tap "Submit" (on `typeInput`) → `typeProcessing`. No
  // minimum-length or content check, same as the voice path's own
  // recording — the outcome is scripted by term position, not by what
  // was actually typed.
  function handleSubmitTyped() {
    setSubState('typeProcessing')
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

  // `resultHinted1Recalled` plays back the first attempt through its own
  // separate hidden `<audio>` element, independent of the one above
  // (which plays the second/current attempt).
  function handleToggleFirstAttemptPlayback() {
    const audioEl = firstAttemptAudioElRef.current
    if (!audioEl) return
    if (isPlayingFirstAttempt) {
      audioEl.pause()
    } else {
      void audioEl.play()
    }
  }

  // SPEC.md: tap Redo → back to `idle` (re-record) — discards this
  // take's audio rather than keeping it around for a re-attempt. Also
  // discards a first attempt kept around by `handleRetry`, if any —
  // Redo restarts the term from scratch, so a subsequent first-attempt
  // recording shouldn't still resolve as a Hinted2 re-attempt.
  function handleRedo() {
    if (audioUrl) URL.revokeObjectURL(audioUrl)
    if (firstAttemptAudioUrl) URL.revokeObjectURL(firstAttemptAudioUrl)
    setAudioUrl(null)
    setFirstAttemptAudioUrl(null)
    setIsPlaying(false)
    setIsPlayingFirstAttempt(false)
    setIsRetry(false)
    setSubState('idle')
  }

  // SPEC.md: tap "Submit"/"Send" → `processing`. A re-attempt (after
  // Hinted1's "Try again") goes to the real `Learning-result-Hinted1-
  // processing` frame instead — same idea, but it keeps the first
  // attempt's history on screen (node 13727:15363), confirmed as its
  // own distinct live frame rather than assumed to reuse `processing`'s.
  function handleSend() {
    setSubState(isRetry ? 'hinted2Processing' : 'processing')
  }

  // SPEC.md: Recalled's and Hinted1-recalled's "Continue" → the next
  // term's `idle` (the last term's would go to `/summary` instead — not
  // reachable yet, since `TERMS` only has 2 real entries, guarded by
  // `hasNextTerm`). Clears this term's captured audio so the next term
  // starts clean.
  function handleContinue() {
    if (audioUrl) URL.revokeObjectURL(audioUrl)
    if (firstAttemptAudioUrl) URL.revokeObjectURL(firstAttemptAudioUrl)
    setAudioUrl(null)
    setFirstAttemptAudioUrl(null)
    setIsPlaying(false)
    setIsPlayingFirstAttempt(false)
    setIsRetry(false)
    setTypedAnswer('')
    setTermIndex((i) => i + 1)
    setSubState('idle')
  }

  // Revokes on unmount only (e.g. navigating away mid-session via
  // Close) — reads through refs rather than depending on the state
  // values directly, since `audioUrl`/`firstAttemptAudioUrl` both need
  // to survive being reassigned while the other one stays alive (see
  // `handleStopRecording`'s own comment above).
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
    }
  }, [])

  // SPEC.md's real ~2-3s auto-advance timer, branching by which
  // processing screen this is. `processing` only ever means a first
  // attempt now (`handleSend` routes retries to `hinted2Processing`
  // instead), so it resolves by this term's scripted outcome alone.
  // `hinted2Processing` always resolves to `resultHinted1Recalled`,
  // scripted to always succeed per SPEC.md.
  //
  // Term 4's canned path is the cold "I don't know" tap on its own
  // `idle` (`Learning-skipped`, below), never through `recording` at
  // all — but the mic button there is still mechanically live, so an
  // actual attempt has to resolve to *something*. No distinct
  // post-attempt result frame exists for term 4 in Figma (unlike
  // Recalled/Hinted1/Revealed) — its own connectors go straight
  // `Learning-skipped -> Summary` with nothing in between — so an
  // attempted `Skipped` outcome routes there too, the same terminal
  // destination as the cold tap, rather than inventing a result screen
  // Figma doesn't have.
  useEffect(() => {
    if (subState === 'processing') {
      if (term.outcome === 'Skipped') {
        const timer = setTimeout(() => router.push('/summary'), 2500)
        return () => clearTimeout(timer)
      }
      const nextSubState = term.outcome === 'Hinted' ? 'resultHinted1' : term.outcome === 'Revealed' ? 'resultRevealed' : 'resultRecalled'
      const timer = setTimeout(() => setSubState(nextSubState), 2500)
      return () => clearTimeout(timer)
    }
    if (subState === 'hinted2Processing') {
      const timer = setTimeout(() => setSubState('resultHinted1Recalled'), 2500)
      return () => clearTimeout(timer)
    }
    // Text path's own wait state. Only `term.outcome === 'Recalled'` has
    // a built `typeResult` destination so far (`typeResultRecalled`) —
    // the Hinted/Revealed/Skipped equivalents aren't built yet, so this
    // intentionally no-ops (stays on `typeProcessing` indefinitely) for
    // those, same "don't advance into a screen that doesn't exist"
    // treatment as every other not-yet-built destination in this file.
    if (subState === 'typeProcessing' && term.outcome === 'Recalled') {
      const timer = setTimeout(() => setSubState('typeResultRecalled'), 2500)
      return () => clearTimeout(timer)
    }
  }, [subState, term.outcome, router])

  // Shared between `hinted2Processing` and `resultHinted1Recalled` —
  // both live frames (13727:15363, 13673:13893 — corrected 2026-09-17,
  // per Mia, from this doc's earlier 13713:14750, the separate hidden
  // two-hint `Learning-result-Hinted2-succeed`) show the identical
  // history stack (prompt, first attempt's `AudioScrubber`, the Hint 1
  // header collapsed to plain text, second attempt's `AudioScrubber`)
  // before diverging on the final row (thinking+Loading vs. the full
  // mascot+Success bubble) and bottom content (Processing vs. Continue).
  const hintedHistory = (
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
        {term.prompt}
      </p>

      <AudioScrubber state={isPlayingFirstAttempt ? 'Playing' : 'Default'} onClick={handleToggleFirstAttemptPlayback} />

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

      <AudioScrubber state={isPlaying ? 'Playing' : 'Default'} onClick={handleTogglePlayback} />
    </>
  )

  // `Learning-result-Hinted1` (node 13622:17189) and
  // `Learning-topic 2-result-Hinted1-recording` (node 13728:15704) share this
  // identical row — the full mascot + `SpeechBubble state="Warning"`,
  // not the collapsed-to-plain-text treatment `hintedHistory` above
  // uses once a second attempt has actually started.
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
                  than assuming a straight `(termIndex+1)*25`: Learning-idle
                  (term 1) is 25%, Learning-result-Hinted1 (term 2) is 50%,
                  Learning-result-Revealed (term 3) is 75%, and
                  Learning-skipped (term 4's own idle) is *also* 75%, not
                  100% — matching design-system.md's own note that 100 has
                  no real example anywhere; that value is reserved for
                  Summary once the whole session is actually done.
                  `topic4ResultUnaided` is the one confirmed exception: its
                  own live frame (node 13737:17501) really does show a
                  full 100% bar, not 75% — this alternate "everything
                  recalled" demo path treats reaching term 4's unaided
                  result as the session's own real end point (it feeds
                  Summary-all recalled next), unlike the main script's
                  term 4, which still caps at 75%. Reproduced as its own
                  real value, not forced to match the main script's
                  formula. */}
              <ProgressIndicator
                variant="Primary"
                thickness="16"
                progress={
                  (subState === 'topic4ResultUnaided' ? '100' : String(Math.min(termIndex + 1, 3) * 25)) as ProgressIndicatorProgress
                }
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
                8
              </span>
            </div>
          </div>
        </AppBar>

        <main className="flex flex-1 flex-col items-center" style={{ padding: 'var(--size-space-200) var(--size-space-400) 0' }}>
          <div className="flex w-full flex-col items-center" style={{ gap: 24 }}>
            <div className="flex w-full items-center justify-between">
              <span
                style={{
                  fontFamily: 'var(--type-scale-caption-m-bold-font-family)',
                  fontWeight: 'var(--type-scale-caption-m-bold-font-weight)',
                  fontSize: 'var(--type-scale-caption-m-bold-font-size)',
                  lineHeight: 'var(--type-scale-caption-m-bold-line-height)',
                  letterSpacing: 'var(--type-scale-caption-m-bold-letter-spacing)',
                  color: 'var(--semantic-color-text-primary)',
                }}
              >
                Topics {termIndex + 1} of 4
              </span>
              {/* Not in SPEC.md's own component list for `idle` — the live
                  Figma frame shows this "Skip" text link in the header row
                  alongside the bottom "I don't know" button, which SPEC.md
                  already documents as the cold-skip action. Shown to match
                  the frame; not wired yet since no built destination exists
                  for either skip path. */}
              <span
                style={{
                  fontFamily: 'var(--type-scale-headline-xxs-bold-font-family)',
                  fontWeight: 'var(--type-scale-headline-xxs-bold-font-weight)',
                  fontSize: 'var(--type-scale-headline-xxs-bold-font-size)',
                  lineHeight: 'var(--type-scale-headline-xxs-bold-line-height)',
                  letterSpacing: 'var(--type-scale-headline-xxs-bold-letter-spacing)',
                  color: 'var(--semantic-color-text-primary)',
                }}
              >
                Skip
              </span>
            </div>

            {subState === 'hinted2Processing' || subState === 'resultHinted1Recalled' ? (
              // `Learning-topic 2-result-Hinted1-processing` (node
              // 13727:15363) and `Learning-topic 2-result-Hinted1-recalled`
              // (node 13673:13893 — corrected 2026-09-17, per Mia: this is
              // the real name/identity of the frame this doc and
              // component-gaps.md previously misattributed to
              // `Learning-result-Hinted2-succeed`, node 13713:14750, a
              // separate two-hint success flow that's now hidden in Figma
              // and out of scope, confirmed by Mia) share the identical
              // history stack above — see `hintedHistory` above — and only
              // diverge on the final row: bare `thinking` pose +
              // `SpeechBubble state="Loading"` while processing (matching
              // `processing`'s own bare-thinking treatment), vs. the full
              // `MascotSlot` + `SpeechBubble state="Success"` once
              // resolved. `subtitle="Hint 1 of 2"` (not "2 of 2" as this
              // screen previously read) — this term only ever needed one
              // hint before succeeding. Terminal — single "Continue," no
              // further retry.
              <div className="flex w-full flex-col items-end" style={{ gap: 'var(--size-space-400)' }}>
                {hintedHistory}

                {subState === 'hinted2Processing' ? (
                  <div className="flex w-full items-center" style={{ gap: 'var(--size-space-200)' }}>
                    <Image src="/images/thinking.svg" alt="" width={70} height={70} style={{ flexShrink: 0 }} />
                    <SpeechBubble state="Loading" className="flex-1" />
                  </div>
                ) : (
                  <div className="flex w-full items-center" style={{ gap: 'var(--size-space-200)' }}>
                    <MascotSlot size="XL" pose="approving" />
                    <SpeechBubble
                      state="Success"
                      title="Nice!"
                      subtitle="Hint 1 of 2"
                      message="Divergent thinking is generating as many different ideas as possible before narrowing down to one."
                      className="flex-1"
                    />
                  </div>
                )}
              </div>
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
                  <AudioScrubber
                    state={isPlayingFirstAttempt ? 'Playing' : 'Default'}
                    onClick={handleToggleFirstAttemptPlayback}
                  />
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
                      message="You said: 'It’s the spark that makes you want to create something'"
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
                      message="Visual hierarchy arranges elements to guide attention and show what matters most."
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
                  <SpeechBubble state="Prompt" message={term.prompt} className="flex-1" />
                </div>

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
                  {term.prompt}
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
                  {term.prompt}
                </p>

                <SpeechBubble state="Input" message={typedAnswer} className="w-full" />

                <div className="flex w-full items-center" style={{ gap: 'var(--size-space-200)' }}>
                  <MascotSlot size="XL" pose="approving" />
                  <SpeechBubble
                    state="Success"
                    title="Nice!"
                    subtitle="Unaided"
                    message="You said: 'It’s the spark that makes you want to create something'"
                    className="flex-1"
                  />
                </div>
              </div>
            ) : subState === 'topic2ResultUnaided' ? (
              // `Learning-topic 2-result-unaided` (node 13737:17173).
              // Deliberately unreachable — see the `SubState` type's own
              // doc comment above and component-gaps.md for why. Same
              // real shape as the voice path's own `resultRecalled`
              // (plain-text prompt, `AudioScrubber` `state="Default"`,
              // mascot + `SpeechBubble state="Success"`), just for term 2
              // instead of term 1 — `term.prompt`/the message below both
              // already read "Divergent thinking" once `termIndex` is 1,
              // so no term-2-specific literals were needed beyond the
              // message text itself. This frame's own `middleContent`
              // gap is a real 24px (`--size-space-600`), not the 16px
              // (`--size-space-400`) every other result-shaped branch
              // above uses — reproduced as the live value, not
              // normalized to match its siblings.
              <div className="flex w-full flex-col items-end" style={{ gap: 'var(--size-space-600)' }}>
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

                <AudioScrubber state="Default" />

                <div className="flex w-full items-center" style={{ gap: 'var(--size-space-200)' }}>
                  <MascotSlot size="XL" pose="approving" />
                  <SpeechBubble
                    state="Success"
                    title="Nice!"
                    subtitle="Unaided"
                    message="Divergent thinking is generating as many different ideas as possible before narrowing down to one."
                    className="flex-1"
                  />
                </div>
              </div>
            ) : subState === 'topic3ResultUnaided' ? (
              // `Learning-topic 3-result-unaided` (node 13737:17370).
              // Deliberately unreachable, same reasoning as
              // `topic2ResultUnaided` immediately above — see the
              // `SubState` type's own doc comment and component-gaps.md.
              // Identical shape: plain-text prompt, `AudioScrubber`
              // `state="Default"`, mascot + `SpeechBubble
              // state="Success"`, just for term 3 — `term.prompt`/the
              // message below both read "Visual hierarchy" once
              // `termIndex` is 2. Same real 24px (`--size-space-600`)
              // middleContent gap as its sibling, confirmed independently
              // on this frame rather than assumed to carry over.
              <div className="flex w-full flex-col items-end" style={{ gap: 'var(--size-space-600)' }}>
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

                <AudioScrubber state="Default" />

                <div className="flex w-full items-center" style={{ gap: 'var(--size-space-200)' }}>
                  <MascotSlot size="XL" pose="approving" />
                  <SpeechBubble
                    state="Success"
                    title="Nice!"
                    subtitle="Unaided"
                    message="Visual hierarchy arranges elements to guide attention and show what matters most."
                    className="flex-1"
                  />
                </div>
              </div>
            ) : subState === 'topic4ResultUnaided' ? (
              // `Learning-topic 4-result-unaided` (node 13737:17501).
              // Deliberately unreachable, same reasoning as
              // `topic2ResultUnaided`/`topic3ResultUnaided` above — see
              // the `SubState` type's own doc comment and
              // component-gaps.md. Identical shape, just for term 4 —
              // `term.prompt`/the message below both read "Visual
              // research" once `termIndex` is 3. Same real 24px
              // (`--size-space-600`) middleContent gap as its siblings,
              // confirmed independently on this frame rather than
              // assumed to carry over.
              <div className="flex w-full flex-col items-end" style={{ gap: 'var(--size-space-600)' }}>
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

                <AudioScrubber state="Default" />

                <div className="flex w-full items-center" style={{ gap: 'var(--size-space-200)' }}>
                  <MascotSlot size="XL" pose="approving" />
                  <SpeechBubble
                    state="Success"
                    title="Nice!"
                    subtitle="Unaided"
                    message="Visual research is the use of images and other visual media to collect, analyze, and present research data."
                    className="flex-1"
                  />
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

        <div className="relative flex w-full flex-col items-center" style={{ gap: 'var(--size-space-400)', padding: 'var(--size-space-700)' }}>
          {subState === 'idle' && (
            <>
              <MicButton state="Idle" showLabel onClick={handleMicTap} />
              <div className="flex items-start" style={{ gap: 'var(--size-space-600)' }}>
                <Button variant="Tertiary" size="S" cta="Type instead" onClick={() => setSubState('typeInput')} />
                {/* SPEC.md (2026-09-16 Figma pass): `Learning-topic 3-I don't
                    know` is a real, distinct connector — term 3 no longer
                    requires a full attempt before Revealed; its cold "I
                    don't know" tap goes straight to `Learning-topic
                    3-result-Revealed`, matching term 4's `Learning-topic
                    4-skipped` shape exactly (visually identical `idle`
                    content, just named for its scripted outcome). An actual
                    attempt is still mechanically live on both terms (the mic
                    still works) and resolves to the same `Revealed`/`Skipped`
                    destination via `processing`'s own outcome branch — this
                    is only the cold-skip shortcut. Terms 1-2's cold-skip
                    stays unwired: no real destination exists for giving up
                    on Recalled/Hinted before ever attempting. */}
                <Button
                  variant="Tertiary"
                  size="S"
                  cta="I don’t know"
                  onClick={
                    term.outcome === 'Revealed'
                      ? () => setSubState('resultRevealed')
                      : !hasNextTerm
                        ? () => router.push('/summary')
                        : undefined
                  }
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
                  <ButtonIcon variant="Secondary" size="L" icon={<PlayPauseIcon />} label="Resume" />
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

          {subState === 'resultRecalled' && (
            // SPEC.md: Recalled's bottom content is a single full-width
            // `Button` `variant="Primary"` `cta="Continue"` — matches
            // exactly. Wired to advance to the next term's `idle` when
            // one exists (`hasNextTerm`) — the last term's "Continue"
            // going to `/summary` instead still isn't reachable,
            // `TERMS` only has 2 entries so far.
            <Button
              variant="Primary"
              size="L"
              cta="Continue"
              className="w-full"
              onClick={hasNextTerm ? handleContinue : undefined}
            />
          )}

          {subState === 'resultHinted1' && (
            <>
              {/* SPEC.md: "MicButton state=Idle (real precedent for a
                  re-attempt entry point here)... Re-attempt loops back
                  through recording → readyToSend → processing, then
                  resolves to the Hinted-success result." Now wired: real
                  caption "Try again" (via MicButton's `label` override)
                  starts a real second recording via `handleRetry`,
                  looping back through `recording` → `readyToSend` →
                  `processing`, which now resolves to
                  `resultHinted1Recalled` instead of looping back here. */}
              <MicButton state="Idle" showLabel label="Try again" onClick={handleRetry} />
              <div className="flex items-start" style={{ gap: 'var(--size-space-600)' }}>
                <Button variant="Tertiary" size="S" cta="Type instead" onClick={() => setSubState('typeInput')} />
                <Button variant="Tertiary" size="S" cta="I don’t know" />
              </div>
            </>
          )}

          {subState === 'resultHinted1Recalled' && (
            // SPEC.md: "Terminal, single 'Continue,' no further retry."
            // Same `hasNextTerm` guard as Recalled's — now real: term 3
            // ("Visual hierarchy," Revealed) is built, so this Continue
            // really does advance once term 2 resolves.
            <Button
              variant="Primary"
              size="L"
              cta="Continue"
              className="w-full"
              onClick={hasNextTerm ? handleContinue : undefined}
            />
          )}

          {subState === 'resultRevealed' && (
            // SPEC.md: "Revealed... Button variant="Primary" cta="Continue"."
            // Same `hasNextTerm` guard — term 4 ("Visual research,"
            // Skipped) isn't built yet, so this no-ops past term 3 until
            // `TERMS` gains a fourth entry.
            <Button
              variant="Primary"
              size="L"
              cta="Continue"
              className="w-full"
              onClick={hasNextTerm ? handleContinue : undefined}
            />
          )}

          {subState === 'typeInput' && (
            // SPEC.md: "tap 'Submit' → typeProcessing. Tap 'Switch to
            // voice' → idle (voice mode, same term)." The live frame's
            // own `buttonGroup` (node 13702:14138) pairs a filled Submit
            // with a no-fill "Switch to voice" — `Primary` + `Tertiary`
            // chrome, not `ButtonGroup`'s own fixed `Vertical` shape
            // (`Primary`+`Secondary`, per `shared/buttonVariants.ts`) —
            // same gap as Primer-intro's own second button (component-
            // gaps.md), built as two direct `Button` instances at that
            // same real `--size-space-200` gap instead.
            <div className="flex w-full flex-col items-start" style={{ gap: 'var(--size-space-200)' }}>
              <Button variant="Primary" size="L" cta="Submit" className="w-full" onClick={handleSubmitTyped} />
              <Button variant="Tertiary" size="L" cta="Switch to voice" className="w-full" onClick={handleSwitchToVoice} />
            </div>
          )}

          {subState === 'typeProcessing' && (
            // `Learning-topic 1-typeProcessing`'s own designer note:
            // "Submit and Switch to voice are dimmed to read as disabled
            // during the wait" — real `Button` `state="Disabled"` on both,
            // matching the voice path's own `processing` (SPEC.md: "Button
            // state=Disabled on whichever CTAs are present"). Genuinely
            // inert, not just visually dimmed — no `onClick` on either,
            // same as `processing`'s own disabled buttons.
            <div className="flex w-full flex-col items-start" style={{ gap: 'var(--size-space-200)' }}>
              <Button variant="Primary" size="L" cta="Submit" state="Disabled" className="w-full" />
              <Button variant="Tertiary" size="L" cta="Switch to voice" state="Disabled" className="w-full" />
            </div>
          )}

          {subState === 'typeResultRecalled' && (
            // Live frame's own bottomContent (node 13622:18567) keeps
            // both "Continue" (Primary/L, wired same as the voice path's
            // own resultRecalled) and a second, real "Switch to voice"
            // (Tertiary/L) — the designer note's own "Switch to voice
            // stays available even after a correct answer." Shown to
            // match the frame, left unwired rather than routed to
            // `handleSwitchToVoice`: that destination resets this term
            // back to a cold `idle`, which would discard an outcome
            // that's already resolved Recalled — a real regression, not
            // just an unbuilt destination. SPEC.md gives no explicit
            // behavior for this button once a result already exists, so
            // flagged rather than guessed either way.
            <div className="flex w-full flex-col items-start" style={{ gap: 'var(--size-space-200)' }}>
              <Button variant="Primary" size="L" cta="Continue" className="w-full" onClick={hasNextTerm ? handleContinue : undefined} />
              <Button variant="Tertiary" size="L" cta="Switch to voice" className="w-full" />
            </div>
          )}

          {subState === 'topic2ResultUnaided' && (
            // Live frame's own bottomContent (node 13737:17209) has only
            // the single "Continue" button — no second "Switch to voice"
            // here, unlike `typeResultRecalled`'s own frame. Left
            // entirely unwired (no `onClick`): this subState is never
            // actually entered anywhere, so there's nothing for
            // "Continue" to meaningfully advance from.
            <Button variant="Primary" size="L" cta="Continue" className="w-full" />
          )}

          {subState === 'topic3ResultUnaided' && (
            // Live frame's own bottomContent (node 13737:17387), same
            // single-"Continue" shape as `topic2ResultUnaided`'s sibling
            // frame — confirmed independently, not assumed to carry
            // over. Left unwired for the same reason: never actually
            // entered anywhere.
            <Button variant="Primary" size="L" cta="Continue" className="w-full" />
          )}

          {subState === 'topic4ResultUnaided' && (
            // Live frame's own bottomContent (node 13737:17518), same
            // single-"Continue" shape as its siblings — confirmed
            // independently, not assumed to carry over. Left unwired
            // for the same reason: never actually entered anywhere.
            <Button variant="Primary" size="L" cta="Continue" className="w-full" />
          )}
        </div>
      </div>
    </div>
  )
}
