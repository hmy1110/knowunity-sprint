'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppBar } from '@/components/AppBar/AppBar'
import { ButtonGroup } from '@/components/ButtonGroup/ButtonGroup'
import { IconSlot } from '@/components/IconSlot/IconSlot'
import { InlineAlert } from '@/components/InlineAlert/InlineAlert'
import { MascotSlot } from '@/components/MascotSlot/MascotSlot'
import { ProgressIndicator } from '@/components/ProgressIndicator/ProgressIndicator'
import { ArrowLeftIcon } from '@/components/shared/icons'
import { StatusBar } from '@/components/StatusBar/StatusBar'
import { TextBlock } from '@/components/TextBlock/TextBlock'

type Screen = 'intro' | 'micDenied'

// Real "x-close" asset (component 3248:81244) — same one Session's own
// AppBar uses, confirmed via the live Primer-micDenied frame (node
// 13615:5335): its own appBar is X-close + a real ProgressIndicator/XP
// badge pair, not the arrow-left-plus-empty-slot shape `intro`'s own
// live frame uses below. The two Primer states genuinely have different
// appBars, not a shared one — checked independently rather than assumed.
const CLOSE_ICON = (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
    <path
      d="M17.293 5.29297C17.6835 4.90244 18.3165 4.90244 18.707 5.29297C19.0976 5.68349 19.0976 6.31651 18.707 6.70703L13.4141 12L18.707 17.293C19.0976 17.6835 19.0976 18.3165 18.707 18.707C18.3165 19.0976 17.6835 19.0976 17.293 18.707L12 13.4141L6.70703 18.707C6.31651 19.0976 5.68349 19.0976 5.29297 18.707C4.90244 18.3165 4.90244 17.6835 5.29297 17.293L10.5859 12L5.29297 6.70703C4.90244 6.31651 4.90244 5.68349 5.29297 5.29297C5.68349 4.90244 6.31651 4.90244 6.70703 5.29297L12 10.5859L17.293 5.29297Z"
      fill="currentColor"
    />
  </svg>
)

// The "badge (XP/lightning counter)" pattern design-system.md documents
// as hand-built independently on 9 real screens (this one + every
// Learning-*), same real asset/token pairing Session's own copy uses
// (`accent/blue/on-subtle` + `accent/blue/subtle`) — kept as its own
// inline copy here rather than shared yet, per that note's own "rebuilt
// independently on every screen" description of the current state.
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

// Bullet-row icons — real vectors pulled straight from the live
// Primer-intro instance (`Mic`/`Award` via the Desktop Bridge plugin's
// `exportAsync`, since both are Code Connect-mapped instances with no
// raw asset URL in the design-context response; `myai-chat` via its own
// real exported asset URL). Single-use on this screen, so kept inline
// here rather than promoted to `shared/icons.tsx` — see that file's own
// promote-on-second-use rule. All three recolored from their hardcoded
// `#F4F2FF` fill/stroke to `currentColor`, tinted via `text/primary` on
// the shared `IconSlot` wrapper below, same treatment as every other
// real icon asset on this screen.
function MicIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <path
        d="M4.16663 8.3335V10.0002C4.16663 11.5473 4.78121 13.031 5.87517 14.125C6.96913 15.2189 8.45286 15.8335 9.99996 15.8335C11.5471 15.8335 13.0308 15.2189 14.1247 14.125C15.2187 13.031 15.8333 11.5473 15.8333 10.0002V8.3335M9.99996 15.8335V19.1668M6.66663 19.1668H13.3333M9.99996 0.833496C9.33692 0.833496 8.70103 1.09689 8.23219 1.56573C7.76335 2.03457 7.49996 2.67045 7.49996 3.3335V10.0002C7.49996 10.6632 7.76335 11.2991 8.23219 11.7679C8.70103 12.2368 9.33692 12.5002 9.99996 12.5002C10.663 12.5002 11.2989 12.2368 11.7677 11.7679C12.2366 11.2991 12.5 10.6632 12.5 10.0002V3.3335C12.5 2.67045 12.2366 2.03457 11.7677 1.56573C11.2989 1.09689 10.663 0.833496 9.99996 0.833496Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <path
        d="M1.66667 10C1.66667 5.39763 5.39763 1.66667 10 1.66667C10.4602 1.66667 10.8333 2.03976 10.8333 2.5C10.8333 2.96024 10.4602 3.33333 10 3.33333C6.3181 3.33333 3.33333 6.3181 3.33333 10C3.33333 10.8882 3.507 11.7338 3.8208 12.5065C3.87427 12.6382 3.94368 12.8032 3.97786 12.9557C4.00598 13.0812 4.01852 13.1909 4.01855 13.3195C4.01857 13.4743 3.98976 13.6314 3.96973 13.7516L3.514 16.4852L6.24837 16.0303C6.36853 16.0102 6.52571 15.9814 6.6805 15.9814C6.74482 15.9815 6.8044 15.9846 6.86361 15.9912L7.04427 16.0221L7.16064 16.0531C7.27738 16.0897 7.39477 16.1391 7.49349 16.1792C8.26622 16.493 9.11176 16.6667 10 16.6667C13.6819 16.6667 16.6667 13.6819 16.6667 10C16.6667 9.53976 17.0398 9.16667 17.5 9.16667C17.9602 9.16667 18.3333 9.53976 18.3333 10C18.3333 14.6024 14.6024 18.3333 10 18.3333C8.89309 18.3333 7.8346 18.1171 6.86605 17.7238C6.77883 17.6884 6.72834 17.6678 6.69108 17.6538C6.68612 17.6519 6.68159 17.6502 6.67806 17.6489C6.67726 17.649 6.67649 17.6496 6.67562 17.6497C6.64487 17.6539 6.60255 17.6608 6.52262 17.6742L3.55794 18.1689C3.41823 18.1922 3.25797 18.2196 3.12012 18.23C2.9783 18.2407 2.75226 18.2444 2.51383 18.1421C2.21925 18.0157 1.98432 17.7807 1.85791 17.4862C1.75564 17.2477 1.75931 17.0217 1.77002 16.8799C1.78043 16.742 1.80777 16.5818 1.83105 16.4421L2.32585 13.4774C2.33917 13.3974 2.34609 13.3551 2.35026 13.3244C2.35045 13.323 2.3501 13.3216 2.35026 13.3203C2.34911 13.3171 2.34776 13.3131 2.34619 13.3089C2.33219 13.2717 2.31163 13.2212 2.2762 13.134C1.88286 12.1654 1.66667 11.1069 1.66667 10ZM15 0.833333C15.3156 0.833333 15.6043 1.01163 15.7454 1.29395L16.2606 2.3234C16.4959 2.79402 16.5673 2.92976 16.6545 3.04281C16.7419 3.15622 16.8438 3.25812 16.9572 3.34554C17.0702 3.43265 17.206 3.50411 17.6766 3.73942L18.7061 4.25456C18.9884 4.39572 19.1667 4.68436 19.1667 5C19.1667 5.31564 18.9884 5.60428 18.7061 5.74544L17.6766 6.26058C17.206 6.49589 17.0702 6.56735 16.9572 6.65446C16.8438 6.74188 16.7419 6.84378 16.6545 6.95719C16.5673 7.07024 16.4959 7.20597 16.2606 7.67659L15.7454 8.70605C15.6043 8.98837 15.3156 9.16667 15 9.16667C14.6844 9.16667 14.3957 8.98837 14.2546 8.70605L13.7394 7.67659C13.5041 7.20598 13.4327 7.07024 13.3455 6.95719C13.2581 6.84378 13.1562 6.74188 13.0428 6.65446C12.9298 6.56735 12.794 6.49589 12.3234 6.26058L11.2939 5.74544C11.0116 5.60428 10.8333 5.31564 10.8333 5C10.8333 4.68436 11.0116 4.39572 11.2939 4.25456L12.3234 3.73942C12.794 3.50411 12.9298 3.43265 13.0428 3.34554C13.1562 3.25812 13.2581 3.15622 13.3455 3.04281C13.4327 2.92976 13.5041 2.79402 13.7394 2.3234L14.2546 1.29395L14.314 1.19303C14.4681 0.969729 14.7238 0.833333 15 0.833333ZM15 3.51807C14.8922 3.72184 14.7905 3.89869 14.6655 4.06087C14.4908 4.28753 14.2875 4.49078 14.0609 4.66553C13.8987 4.79054 13.7218 4.89223 13.5181 5C13.7218 5.10777 13.8987 5.20946 14.0609 5.33447C14.2875 5.50922 14.4908 5.71247 14.6655 5.93913C14.7904 6.10114 14.8924 6.27762 15 6.48112C15.1076 6.27762 15.2096 6.10114 15.3345 5.93913C15.5092 5.71247 15.7125 5.50922 15.9391 5.33447C16.1011 5.20959 16.2776 5.10765 16.4811 5C16.2776 4.89235 16.1011 4.79041 15.9391 4.66553C15.7125 4.49078 15.5092 4.28753 15.3345 4.06087C15.2095 3.89869 15.1078 3.72184 15 3.51807Z"
        fill="currentColor"
      />
    </svg>
  )
}

function AwardIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <path
        d="M6.84163 11.5752L5.83329 19.1668L9.99996 16.6668L14.1666 19.1668L13.1583 11.5668M15.8333 6.66683C15.8333 9.88849 13.2216 12.5002 9.99996 12.5002C6.7783 12.5002 4.16663 9.88849 4.16663 6.66683C4.16663 3.44517 6.7783 0.833496 9.99996 0.833496C13.2216 0.833496 15.8333 3.44517 15.8333 6.66683Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const BULLETS = [
  { icon: <MicIcon />, text: 'Explain 4 topics from section 1' },
  { icon: <ChatIcon />, text: 'Stuck? Knowie guides you' },
  { icon: <AwardIcon />, text: 'Explain out loud helps you score up to 20% higher on exams' },
]

export default function PrimerIntro() {
  const router = useRouter()
  const [screen, setScreen] = useState<Screen>('intro')

  // SPEC.md: "Start learning" → real getUserMedia call: granted →
  // /session; denied → same route, state flips to micDenied. "Turn on
  // my microphone" on micDenied re-triggers the same call.
  async function requestMic() {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
      router.push('/session')
    } catch {
      setScreen('micDenied')
    }
  }

  return (
    <div className="flex min-h-screen justify-center" style={{ background: 'var(--semantic-color-background-page)' }}>
      <div className="flex min-h-screen w-full max-w-[390px] flex-col">
        <StatusBar />

        {screen === 'intro' ? (
          <>
            <div className="flex w-full flex-col" style={{ gap: 'var(--size-space-100)' }}>
              <AppBar variant="leftIconButtonOnly" leftIcon={<ArrowLeftIcon />} leftLabel="Back" onLeftClick={() => router.push('/')} />
            </div>

            <main
              className="flex flex-1 flex-col items-center justify-center"
              style={{ gap: 'var(--size-space-400)', padding: '0 var(--size-space-400)' }}
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

                <div style={{ width: '100%', textAlign: 'center' }}>
                  <TextBlock variant="L" showCaption={false} title="Explain it to Knowie" />
                </div>
              </div>

              <div className="flex w-full flex-col items-start" style={{ gap: 'var(--size-space-400)' }}>
                {BULLETS.map((bullet) => (
                  <div key={bullet.text} className="flex w-full items-center" style={{ gap: 'var(--size-space-200)' }}>
                    <IconSlot size="250" icon={bullet.icon} style={{ color: 'var(--semantic-color-text-primary)' }} />
                    <span
                      className="flex-1"
                      style={{
                        fontFamily: 'var(--type-scale-body-m-regular-font-family)',
                        fontWeight: 'var(--type-scale-body-m-regular-font-weight)',
                        fontSize: 'var(--type-scale-body-m-regular-font-size)',
                        lineHeight: 'var(--type-scale-body-m-regular-line-height)',
                        letterSpacing: 'var(--type-scale-body-m-regular-letter-spacing)',
                        color: 'var(--semantic-color-text-primary)',
                      }}
                    >
                      {bullet.text}
                    </span>
                  </div>
                ))}
              </div>
            </main>

            <div className="flex w-full flex-col items-start" style={{ gap: 'var(--size-space-200)', padding: 'var(--size-space-700)' }}>
              <ButtonGroup
                variant="Vertical"
                size="L"
                primary={{ cta: 'Start learning', onClick: requestMic }}
                secondary={{ cta: "I can't talk right now", onClick: () => router.push('/session?entry=text') }}
              />
            </div>
          </>
        ) : (
          <>
            {/* Real live frame (node 13615:5335) has its own distinct
                appBar, not a shared one with `intro` — X-close, plus a
                real ProgressIndicator (67.25/269px fill = exactly 25%,
                not the "0, untested" value SPEC.md assumed) and the same
                XP badge pattern Session's own appBar uses. Confirmed via
                the Desktop Bridge plugin directly, not eyeballed. */}
            <AppBar variant="leftIconButtonOnly" leftIcon={CLOSE_ICON} leftLabel="Close" onLeftClick={() => router.push('/')}>
              <div className="flex h-full w-full items-center" style={{ gap: 'var(--size-space-200)', padding: '10px 0' }}>
                <div className="flex-1">
                  <ProgressIndicator variant="Primary" thickness="16" progress="25" label="Topic progress" />
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

            <main
              className="flex flex-1 flex-col items-center"
              style={{ gap: 'var(--size-space-400)', padding: 'var(--size-space-700) var(--size-space-400) 0' }}
            >
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

              <InlineAlert variant="Warning" showDescriptor={false} title="Microphone access is off" />

              {/* Real body copy — confirmed from the live frame, not in
                  SPEC.md's own component list for this screen at all.
                  Binds the same raw 32px/36px/700 primitive pair Summary's
                  own headline already resolved to `--type-scale-headline-l-*`
                  (no named text style matches it in Figma either — same
                  ~1px drift already documented there), not `TextBlock`. */}
              <p
                style={{
                  width: '100%',
                  textAlign: 'center',
                  fontFamily: 'var(--type-scale-headline-l-font-family)',
                  fontWeight: 'var(--type-scale-headline-l-font-weight)',
                  fontSize: 'var(--type-scale-headline-l-font-size)',
                  lineHeight: 'var(--type-scale-headline-l-line-height)',
                  letterSpacing: 'var(--type-scale-headline-l-letter-spacing)',
                  color: 'var(--semantic-color-text-primary)',
                }}
              >
                One tap in Settings, and you&apos;re back to speaking. Nothing else changes.
              </p>
            </main>

            <div className="flex w-full flex-col items-start" style={{ gap: 'var(--size-space-200)', padding: 'var(--size-space-700)' }}>
              <ButtonGroup
                variant="Vertical"
                size="L"
                primary={{ cta: 'Turn on my microphone', onClick: requestMic }}
                secondary={{ cta: 'Continue with text', onClick: () => router.push('/session?entry=text') }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
