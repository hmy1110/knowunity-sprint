'use client'

import { Suspense } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { AppBar } from '@/components/AppBar/AppBar'
import { Button } from '@/components/Button/Button'
import { Chips } from '@/components/Chips/Chips'
import { IconSlot } from '@/components/IconSlot/IconSlot'
import { MascotSlot } from '@/components/MascotSlot/MascotSlot'
import { StatusBar } from '@/components/StatusBar/StatusBar'
import { TopicNode } from '@/components/TopicNode/TopicNode'

// AppBar's own confirmed "Real Usage Study Plan" story content (see
// AppBar.stories.tsx / Storybook docs) — the kebab-menu icon, already
// validated against this exact screen, not re-derived here.
const KEBAB_ICON = (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
    <circle cx="12" cy="5" r="1.5" fill="currentColor" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    <circle cx="12" cy="19" r="1.5" fill="currentColor" />
  </svg>
)

// Figma's own real "arrow_forward" asset on the Speak button (Material
// 3 Design Kit component via Code Connect, no raw asset URL in the
// design-context response — pulled directly via the Desktop Bridge
// plugin's `exportAsync` instead). Recolored from its Material-default
// `fill="#1D1B20"` to the real bound token this button's label already
// uses (`interactive/on-primary`), since this icon only ever appears on
// this one Primary/S button, not passed via `currentColor` inheritance
// (`Button` doesn't wire icon color to the label's own color style).
const ARROW_FORWARD_ICON = (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
    <path
      d="M10.7834 8.6665H2.66675V7.33317H10.7834L7.05008 3.59984L8.00008 2.6665L13.3334 7.99984L8.00008 13.3332L7.05008 12.3998L10.7834 8.6665Z"
      fill="var(--semantic-color-interactive-on-primary)"
    />
  </svg>
)

// StudyPlan-finish's own real "redo" Material asset on its demoted Redo
// button (Code Connect-mapped, exported directly via get_design_context's
// raw asset URL this time rather than the Desktop Bridge plugin's
// exportAsync ARROW_FORWARD_ICON needed). Fill is already the exact real
// bound token value (#F4F2FF === --semantic-color-interactive-on-secondary
// below), recolored onto that token rather than left as a hardcoded hex.
const REDO_ICON = (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
    <path
      d="M6.6 12.6667C5.52222 12.6667 4.59722 12.3167 3.825 11.6167C3.05278 10.9167 2.66667 10.0444 2.66667 9C2.66667 7.95556 3.05278 7.08333 3.825 6.38333C4.59722 5.68333 5.52222 5.33333 6.6 5.33333H10.8L9.06667 3.6L10 2.66667L13.3333 6L10 9.33333L9.06667 8.4L10.8 6.66667H6.6C5.9 6.66667 5.29167 6.88889 4.775 7.33333C4.25833 7.77778 4 8.33333 4 9C4 9.66667 4.25833 10.2222 4.775 10.6667C5.29167 11.1111 5.9 11.3333 6.6 11.3333H11.3333V12.6667H6.6Z"
      fill="var(--semantic-color-interactive-on-secondary)"
    />
  </svg>
)

// Header/roadmap icons — real Figma assets, single-use on this screen.
// `chevron-down` and `search-lg`/`ai-quiz` (navbar) bind `fill="white"
// fill-opacity="0.68"` (`#ffffffad`) on the real node — confirmed via
// `get_variable_defs` to be a stray "text/secondary" variable distinct
// from our real `--semantic-color-text-secondary` (`#f5f3ffad`), the
// same kind of duplicate-variable gap this file already documents
// elsewhere (TextField's caption color, ScoreBreakdown's dot colors) —
// bound to our real token here rather than reproducing the stray value,
// per that same established call. `calendar`/`target-04` (header chip
// icons) bind a genuine unbound literal (`white` at 24% opacity, no
// token matches) — reproduced as that literal, not forced into a token.
function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <path
        d="M23.0573 11.0573C23.578 10.5366 24.422 10.5366 24.9427 11.0573C25.4634 11.578 25.4634 12.422 24.9427 12.9427L16.9427 20.9427C16.422 21.4634 15.578 21.4634 15.0573 20.9427L7.05729 12.9427C6.53659 12.422 6.53659 11.578 7.05729 11.0573C7.57799 10.5366 8.42201 10.5366 8.94271 11.0573L16 18.1146L23.0573 11.0573Z"
        fill="currentColor"
      />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <path
        d="M10 5.5H2V8.6001C2 9.02829 2.00017 9.31941 2.01855 9.54443C2.03646 9.76364 2.06904 9.8759 2.10889 9.9541C2.20475 10.1422 2.35777 10.2952 2.5459 10.3911C2.6241 10.431 2.73636 10.4635 2.95557 10.4814C3.18058 10.4998 3.47171 10.5 3.8999 10.5H8.1001C8.52829 10.5 8.81941 10.4998 9.04443 10.4814C9.26364 10.4635 9.3759 10.431 9.4541 10.3911C9.64223 10.2952 9.79525 10.1422 9.89111 9.9541C9.93096 9.8759 9.96354 9.76364 9.98145 9.54443C9.99983 9.31941 10 9.02829 10 8.6001V5.5ZM7.5 3V2.5H4.5V3C4.5 3.27614 4.27614 3.5 4 3.5C3.72386 3.5 3.5 3.27614 3.5 3V2.50146C3.27727 2.50303 3.10235 2.50657 2.95557 2.51855C2.73636 2.53646 2.6241 2.56904 2.5459 2.60889C2.35777 2.70475 2.20475 2.85777 2.10889 3.0459C2.06904 3.1241 2.03646 3.23636 2.01855 3.45557C2.00017 3.68059 2 3.97171 2 4.3999V4.5H10V4.3999C10 3.97171 9.99983 3.68059 9.98145 3.45557C9.96354 3.23636 9.93096 3.1241 9.89111 3.0459C9.79525 2.85777 9.64223 2.70475 9.4541 2.60889C9.3759 2.56904 9.26364 2.53646 9.04443 2.51855C8.89765 2.50657 8.72273 2.50303 8.5 2.50146V3C8.5 3.27614 8.27614 3.5 8 3.5C7.72386 3.5 7.5 3.27614 7.5 3ZM11 8.6001C11 9.01184 11.0005 9.35079 10.978 9.62598C10.9551 9.907 10.9059 10.1656 10.7822 10.4082C10.5905 10.7845 10.2845 11.0905 9.9082 11.2822C9.66555 11.4059 9.407 11.4551 9.12598 11.478C8.85079 11.5005 8.51184 11.5 8.1001 11.5H3.8999C3.48816 11.5 3.14921 11.5005 2.87402 11.478C2.593 11.4551 2.33445 11.4059 2.0918 11.2822C1.71554 11.0905 1.40951 10.7845 1.21777 10.4082C1.09414 10.1656 1.04494 9.907 1.02197 9.62598C0.999489 9.35079 1 9.01184 1 8.6001V4.3999C1 3.98816 0.999489 3.64921 1.02197 3.37402C1.04494 3.093 1.09414 2.83445 1.21777 2.5918C1.40951 2.21554 1.71554 1.90951 2.0918 1.71777C2.33445 1.59414 2.593 1.54494 2.87402 1.52197C3.05443 1.50723 3.26227 1.5031 3.5 1.50146V1C3.5 0.723858 3.72386 0.5 4 0.5C4.27614 0.5 4.5 0.723858 4.5 1V1.5H7.5V1C7.5 0.723858 7.72386 0.5 8 0.5C8.27614 0.5 8.5 0.723858 8.5 1V1.50146C8.73773 1.5031 8.94557 1.50723 9.12598 1.52197C9.407 1.54494 9.66555 1.59414 9.9082 1.71777C10.2845 1.90951 10.5905 2.21554 10.7822 2.5918C10.9059 2.83445 10.9551 3.093 10.978 3.37402C11.0005 3.64921 11 3.98816 11 4.3999V8.6001Z"
        fill="white"
        fillOpacity="0.24"
      />
    </svg>
  )
}

function TargetChipIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <path
        d="M0.5 6C0.5 2.96243 2.96243 0.5 6 0.5C6.27614 0.5 6.5 0.723858 6.5 1C6.5 1.27614 6.27614 1.5 6 1.5C3.51472 1.5 1.5 3.51472 1.5 6C1.5 8.48528 3.51472 10.5 6 10.5C8.48528 10.5 10.5 8.48528 10.5 6C10.5 5.72386 10.7239 5.5 11 5.5C11.2761 5.5 11.5 5.72386 11.5 6C11.5 9.03757 9.03757 11.5 6 11.5C2.96243 11.5 0.5 9.03757 0.5 6ZM3 6C3 4.34315 4.34315 3 6 3C6.27614 3 6.5 3.22386 6.5 3.5C6.5 3.77614 6.27614 4 6 4C4.89543 4 4 4.89543 4 6C4 7.10457 4.89543 8 6 8C7.10457 8 8 7.10457 8 6C8 5.72386 8.22386 5.5 8.5 5.5C8.77614 5.5 9 5.72386 9 6C9 7.65685 7.65685 9 6 9C4.34315 9 3 7.65685 3 6ZM9.58008 0.506348C9.73872 0.532092 9.87539 0.632613 9.94727 0.776367L10.3726 1.62695L11.2236 2.05273C11.3674 2.12461 11.4679 2.26128 11.4937 2.41992C11.5194 2.57855 11.4671 2.73988 11.3535 2.85352L9.85352 4.35352C9.75975 4.44728 9.6326 4.49999 9.5 4.5H8.20703L6.35352 6.35352C6.15826 6.54877 5.84175 6.54876 5.64648 6.35352C5.45123 6.15826 5.45123 5.84175 5.64648 5.64648L7.5 3.79297V2.5C7.5 2.36739 7.55272 2.24025 7.64648 2.14648L9.14648 0.646484L9.19141 0.606934C9.30058 0.52121 9.44129 0.483828 9.58008 0.506348ZM8.5 2.70703V3.5H9.29297L10.1558 2.63672L9.77637 2.44727C9.67961 2.39889 9.60112 2.32039 9.55273 2.22363L9.36279 1.84375L8.5 2.70703Z"
        fill="white"
        fillOpacity="0.24"
      />
    </svg>
  )
}

// Same real "ai-quiz" asset, fixed magenta fill, used on every
// `TopicNode` on this screen — see that component's own doc comment.
function AiQuizIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <path
        d="M9.33008 10C9.60616 10.0001 9.83008 10.2239 9.83008 10.5C9.83008 10.7761 9.60616 10.9999 9.33008 11H9.3252C9.04905 11 8.8252 10.7761 8.8252 10.5C8.8252 10.2239 9.04905 10 9.3252 10H9.33008ZM9.15088 8.52588C9.15144 8.52568 9.1533 8.52529 9.15576 8.52441C9.16072 8.52265 9.16917 8.51951 9.18066 8.51514C9.2041 8.50621 9.23982 8.49194 9.2832 8.47266C9.37136 8.43347 9.48509 8.37615 9.59521 8.30273C9.84587 8.13561 9.9345 7.98524 9.93457 7.87598V7.875C9.93477 7.72765 9.88297 7.5849 9.78809 7.47217C9.69316 7.3594 9.56129 7.28371 9.41602 7.25879C9.27074 7.23387 9.12122 7.26125 8.99414 7.33594C8.86708 7.41062 8.7706 7.52796 8.72168 7.66699C8.63004 7.92749 8.34448 8.06429 8.08398 7.97266C7.82357 7.88097 7.6867 7.59541 7.77832 7.33496C7.90559 6.97332 8.15681 6.66843 8.4873 6.47412C8.81797 6.27979 9.20694 6.20861 9.58496 6.27344C9.963 6.33828 10.3062 6.53469 10.5532 6.82812C10.8001 7.12139 10.935 7.49266 10.9346 7.87598L10.9292 7.99316C10.8761 8.56655 10.4417 8.94022 10.1499 9.13477C9.97907 9.24866 9.81156 9.33223 9.68896 9.38672C9.62705 9.41423 9.57462 9.43523 9.53662 9.44971C9.51767 9.45693 9.50222 9.46271 9.49072 9.4668C9.48505 9.46881 9.48023 9.47042 9.47656 9.47168C9.47476 9.4723 9.47296 9.47271 9.47168 9.47314C9.47103 9.47336 9.47024 9.47395 9.46973 9.47412H9.46875C9.20679 9.56144 8.92327 9.42016 8.83594 9.1582C8.7541 8.91268 8.87353 8.64852 9.10449 8.54443L9.15088 8.52588ZM5 7C5.27614 7 5.5 7.22386 5.5 7.5C5.5 7.77614 5.27614 8 5 8H4C3.72386 8 3.5 7.77614 3.5 7.5C3.5 7.22386 3.72386 7 4 7H5ZM7 5C7.27614 5 7.5 5.22386 7.5 5.5C7.5 5.77614 7.27614 6 7 6H4C3.72386 6 3.5 5.77614 3.5 5.5C3.5 5.22386 3.72386 5 4 5H7ZM9.5 4.75V3.3999C9.5 2.97171 9.49983 2.68058 9.48145 2.45557C9.46354 2.23636 9.43096 2.1241 9.39111 2.0459C9.29525 1.85777 9.14223 1.70475 8.9541 1.60889C8.8759 1.56904 8.76364 1.53646 8.54443 1.51855C8.31941 1.50017 8.02829 1.5 7.6001 1.5H4.3999C3.97171 1.5 3.68058 1.50017 3.45557 1.51855C3.23636 1.53646 3.1241 1.56904 3.0459 1.60889C2.85777 1.70475 2.70475 1.85777 2.60889 2.0459C2.56904 2.1241 2.53646 2.23636 2.51855 2.45557C2.50017 2.68058 2.5 2.97171 2.5 3.3999V8.6001C2.5 9.02829 2.50017 9.31941 2.51855 9.54443C2.53646 9.76364 2.56904 9.8759 2.60889 9.9541C2.70475 10.1422 2.85777 10.2952 3.0459 10.3911C3.1241 10.431 3.23636 10.4635 3.45557 10.4814C3.68058 10.4998 3.97171 10.5 4.3999 10.5H7C7.27614 10.5 7.5 10.7239 7.5 11C7.5 11.2761 7.27614 11.5 7 11.5H4.3999C3.98816 11.5 3.64921 11.5005 3.37402 11.478C3.093 11.4551 2.83445 11.4059 2.5918 11.2822C2.21554 11.0905 1.90951 10.7845 1.71777 10.4082C1.59414 10.1656 1.54494 9.907 1.52197 9.62598C1.49949 9.35079 1.5 9.01184 1.5 8.6001V3.3999C1.5 2.98816 1.49949 2.64921 1.52197 2.37402C1.54494 2.093 1.59414 1.83445 1.71777 1.5918C1.90951 1.21554 2.21554 0.909508 2.5918 0.717773C2.83445 0.594136 3.093 0.544937 3.37402 0.521973C3.64921 0.499489 3.98816 0.5 4.3999 0.5H7.6001C8.01184 0.5 8.35079 0.499489 8.62598 0.521973C8.907 0.544937 9.16555 0.594136 9.4082 0.717773C9.78446 0.909508 10.0905 1.21554 10.2822 1.5918C10.4059 1.83445 10.4551 2.093 10.478 2.37402C10.5005 2.64921 10.5 2.98816 10.5 3.3999V4.75C10.5 5.02614 10.2761 5.25 10 5.25C9.72386 5.25 9.5 5.02614 9.5 4.75ZM8 3C8.27614 3 8.5 3.22386 8.5 3.5C8.5 3.77614 8.27614 4 8 4H4C3.72386 4 3.5 3.77614 3.5 3.5C3.5 3.22386 3.72386 3 4 3H8Z"
        fill="var(--semantic-color-accent-magenta-bold)"
      />
    </svg>
  )
}

// Bottom navbar icons — Material-style assets from a separate, generic
// nav-bar frame in Figma (own literal fills, not this file's design
// tokens; `myai-chat`'s brand purple #8E51FF matches no real token
// either). Reproduced as-is rather than forced onto a token that
// doesn't match. `search-lg`/`ai-quiz` (the 2nd/4th nav icons) share
// the same stray-"text/secondary" 68%-white fill the header's
// `chevron-down` does — bound to the real `text/secondary` token here
// too, for the same reason.
function NavChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <path
        d="M2 12C2 6.47715 6.47715 2 12 2C12.5523 2 13 2.44772 13 3C13 3.55228 12.5523 4 12 4C7.58172 4 4 7.58172 4 12C4 13.0659 4.2084 14.0805 4.58496 15.0078C4.64913 15.1658 4.73242 15.3639 4.77344 15.5469C4.80718 15.6975 4.82222 15.8291 4.82227 15.9834C4.82229 16.1692 4.78771 16.3577 4.76367 16.502L4.2168 19.7822L7.49805 19.2363C7.64224 19.2123 7.83085 19.1777 8.0166 19.1777C8.09378 19.1778 8.16528 19.1816 8.23633 19.1895L8.45312 19.2266L8.59277 19.2637C8.73285 19.3076 8.87372 19.3669 8.99219 19.415C9.91947 19.7916 10.9341 20 12 20C16.4183 20 20 16.4183 20 12C20 11.4477 20.4477 11 21 11C21.5523 11 22 11.4477 22 12C22 17.5228 17.5228 22 12 22C10.6717 22 9.40152 21.7406 8.23926 21.2686C8.13459 21.226 8.07401 21.2014 8.0293 21.1846C8.02335 21.1823 8.01791 21.1802 8.01367 21.1787C8.01271 21.1788 8.01178 21.1795 8.01074 21.1797C7.97384 21.1847 7.92306 21.193 7.82715 21.209L4.26953 21.8027C4.10188 21.8307 3.90957 21.8635 3.74414 21.876C3.57396 21.8888 3.30272 21.8932 3.0166 21.7705C2.6631 21.6188 2.38119 21.3369 2.22949 20.9834C2.10677 20.6973 2.11118 20.426 2.12402 20.2559C2.13652 20.0904 2.16932 19.8981 2.19727 19.7305L2.79102 16.1729C2.80701 16.0769 2.81531 16.0261 2.82031 15.9893C2.82054 15.9876 2.82012 15.9859 2.82031 15.9844C2.81893 15.9806 2.81732 15.9757 2.81543 15.9707C2.79863 15.926 2.77395 15.8654 2.73145 15.7607C2.25943 14.5985 2 13.3283 2 12ZM18 1C18.3788 1 18.7251 1.21395 18.8945 1.55273L19.5127 2.78809C19.7951 3.35283 19.8808 3.51571 19.9854 3.65137C20.0903 3.78746 20.2125 3.90974 20.3486 4.01465C20.4843 4.11918 20.6472 4.20493 21.2119 4.4873L22.4473 5.10547C22.786 5.27486 23 5.62123 23 6C23 6.37877 22.786 6.72514 22.4473 6.89453L21.2119 7.5127C20.6472 7.79507 20.4843 7.88082 20.3486 7.98535C20.2125 8.09026 20.0903 8.21254 19.9854 8.34863C19.8808 8.48429 19.7951 8.64717 19.5127 9.21191L18.8945 10.4473C18.7251 10.786 18.3788 11 18 11C17.6212 11 17.2749 10.786 17.1055 10.4473L16.4873 9.21191C16.2049 8.64717 16.1192 8.48429 16.0146 8.34863C15.9097 8.21254 15.7875 8.09026 15.6514 7.98535C15.5157 7.88082 15.3528 7.79507 14.7881 7.5127L13.5527 6.89453C13.214 6.72514 13 6.37877 13 6C13 5.62123 13.214 5.27486 13.5527 5.10547L14.7881 4.4873C15.3528 4.20493 15.5157 4.11918 15.6514 4.01465C15.7875 3.90974 15.9097 3.78747 16.0146 3.65137C16.1192 3.51571 16.2049 3.35283 16.4873 2.78809L17.1055 1.55273L17.1768 1.43164C17.3617 1.16367 17.6685 1 18 1ZM18 4.22168C17.8707 4.4662 17.7486 4.67843 17.5986 4.87305C17.3889 5.14504 17.145 5.38894 16.873 5.59863C16.6784 5.74865 16.4662 5.87068 16.2217 6C16.4662 6.12932 16.6784 6.25135 16.873 6.40137C17.145 6.61106 17.3889 6.85496 17.5986 7.12695C17.7485 7.32137 17.8708 7.53314 18 7.77734C18.1292 7.53315 18.2515 7.32137 18.4014 7.12695C18.6111 6.85496 18.855 6.61106 19.127 6.40137C19.3214 6.25151 19.5331 6.12918 19.7773 6C19.5331 5.87082 19.3214 5.74849 19.127 5.59863C18.855 5.38894 18.6111 5.14504 18.4014 4.87305C18.2514 4.67843 18.1293 4.4662 18 4.22168Z"
        fill="currentColor"
      />
    </svg>
  )
}

function NavSearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <path
        d="M19 11.5C19 7.35786 15.6421 4 11.5 4C7.35786 4 4 7.35786 4 11.5C4 15.6421 7.35786 19 11.5 19C13.5199 19 15.3517 18.1999 16.7002 16.9014C16.7284 16.8638 16.7588 16.8272 16.793 16.793C16.8271 16.7588 16.8638 16.7284 16.9014 16.7002C18.1999 15.3517 19 13.5199 19 11.5ZM21 11.5C21 13.7631 20.2068 15.8398 18.8857 17.4717L21.707 20.293C22.0975 20.6835 22.0976 21.3165 21.707 21.707C21.3165 22.0975 20.6835 22.0976 20.293 21.707L17.4717 18.8857C15.8398 20.2068 13.7631 21 11.5 21C6.25329 21 2 16.7467 2 11.5C2 6.25329 6.25329 2 11.5 2C16.7467 2 21 6.25329 21 11.5Z"
        fill="currentColor"
      />
    </svg>
  )
}

function NavTargetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <path
        d="M1 12C1 5.92487 5.92487 1 12 1C12.5523 1 13 1.44772 13 2C13 2.55228 12.5523 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 11.4477 21.4477 11 22 11C22.5523 11 23 11.4477 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM6 12C6 8.68629 8.68629 6 12 6C12.5523 6 13 6.44772 13 7C13 7.55228 12.5523 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 11.4477 16.4477 11 17 11C17.5523 11 18 11.4477 18 12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12ZM19.1602 1.0127C19.4774 1.06418 19.7508 1.26523 19.8945 1.55273L20.7451 3.25391L22.4473 4.10547C22.7348 4.24923 22.9358 4.52256 22.9873 4.83984C23.0388 5.15711 22.9343 5.47975 22.707 5.70703L19.707 8.70703C19.5195 8.89456 19.2652 8.99999 19 9H16.4141L12.707 12.707C12.3165 13.0975 11.6835 13.0975 11.293 12.707C10.9025 12.3165 10.9025 11.6835 11.293 11.293L15 7.58594V5C15 4.73478 15.1054 4.48051 15.293 4.29297L18.293 1.29297L18.3828 1.21387C18.6012 1.04242 18.8826 0.967655 19.1602 1.0127ZM17 5.41406V7H18.5859L20.3115 5.27344L19.5527 4.89453C19.3592 4.79777 19.2022 4.64079 19.1055 4.44727L18.7256 3.6875L17 5.41406Z"
        fill="currentColor"
      />
    </svg>
  )
}

function NavAiQuizIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <path
        d="M18.6602 20C19.2123 20.0001 19.6602 20.4478 19.6602 21C19.6602 21.5522 19.2123 21.9999 18.6602 22H18.6504C18.0981 22 17.6504 21.5523 17.6504 21C17.6504 20.4477 18.0981 20 18.6504 20H18.6602ZM18.3018 17.0518C18.3029 17.0514 18.3066 17.0506 18.3115 17.0488C18.3214 17.0453 18.3383 17.039 18.3613 17.0303C18.4082 17.0124 18.4796 16.9839 18.5664 16.9453C18.7427 16.8669 18.9702 16.7523 19.1904 16.6055C19.6917 16.2712 19.869 15.9705 19.8691 15.752V15.75C19.8695 15.4553 19.7659 15.1698 19.5762 14.9443C19.3863 14.7188 19.1226 14.5674 18.832 14.5176C18.5415 14.4677 18.2424 14.5225 17.9883 14.6719C17.7342 14.8212 17.5412 15.0559 17.4434 15.334C17.2601 15.855 16.689 16.1286 16.168 15.9453C15.6471 15.7619 15.3734 15.1908 15.5566 14.6699C15.8112 13.9466 16.3136 13.3369 16.9746 12.9482C17.6359 12.5596 18.4139 12.4172 19.1699 12.5469C19.926 12.6766 20.6124 13.0694 21.1064 13.6562C21.6001 14.2428 21.87 14.9853 21.8691 15.752L21.8584 15.9863C21.7521 17.1331 20.8834 17.8804 20.2998 18.2695C19.9581 18.4973 19.6231 18.6645 19.3779 18.7734C19.2541 18.8285 19.1492 18.8705 19.0732 18.8994C19.0353 18.9139 19.0044 18.9254 18.9814 18.9336C18.9701 18.9376 18.9605 18.9408 18.9531 18.9434C18.9495 18.9446 18.9459 18.9454 18.9434 18.9463C18.9421 18.9467 18.9405 18.9479 18.9395 18.9482H18.9375C18.4136 19.1229 17.8465 18.8403 17.6719 18.3164C17.5082 17.8254 17.7471 17.297 18.209 17.0889L18.3018 17.0518ZM10 14C10.5523 14 11 14.4477 11 15C11 15.5523 10.5523 16 10 16H8C7.44772 16 7 15.5523 7 15C7 14.4477 7.44772 14 8 14H10ZM14 10C14.5523 10 15 10.4477 15 11C15 11.5523 14.5523 12 14 12H8C7.44772 12 7 11.5523 7 11C7 10.4477 7.44772 10 8 10H14ZM19 9.5V6.79981C19 5.94342 18.9997 5.36117 18.9629 4.91113C18.9271 4.47272 18.8619 4.2482 18.7822 4.0918C18.5905 3.71555 18.2845 3.40951 17.9082 3.21778C17.7518 3.13809 17.5273 3.07293 17.0889 3.03711C16.6388 3.00035 16.0566 3 15.2002 3H8.79981C7.94342 3 7.36117 3.00035 6.91113 3.03711C6.47272 3.07293 6.2482 3.13809 6.0918 3.21778C5.71555 3.40951 5.40951 3.71555 5.21778 4.0918C5.13809 4.2482 5.07293 4.47272 5.03711 4.91113C5.00035 5.36117 5 5.94342 5 6.79981V17.2002C5 18.0566 5.00035 18.6388 5.03711 19.0889C5.07293 19.5273 5.13809 19.7518 5.21778 19.9082C5.40951 20.2845 5.71554 20.5905 6.0918 20.7822C6.2482 20.8619 6.47272 20.9271 6.91113 20.9629C7.36117 20.9997 7.94342 21 8.79981 21H14C14.5523 21 15 21.4477 15 22C15 22.5523 14.5523 23 14 23H8.79981C7.97632 23 7.29843 23.001 6.74805 22.9561C6.18599 22.9101 5.6689 22.8117 5.1836 22.5645C4.43109 22.181 3.81902 21.5689 3.43555 20.8164C3.18827 20.3311 3.08988 19.814 3.04395 19.252C2.99898 18.7016 3 18.0237 3 17.2002V6.79981C3 5.97632 2.99898 5.29843 3.04395 4.74805C3.08988 4.18599 3.18827 3.6689 3.43555 3.1836C3.81902 2.43109 4.43109 1.81902 5.1836 1.43555C5.6689 1.18827 6.18599 1.08988 6.74805 1.04395C7.29843 0.998979 7.97632 1 8.79981 1H15.2002C16.0237 1 16.7016 0.998979 17.252 1.04395C17.814 1.08988 18.3311 1.18827 18.8164 1.43555C19.5689 1.81902 20.181 2.43109 20.5645 3.1836C20.8117 3.6689 20.9101 4.18599 20.9561 4.74805C21.001 5.29843 21 5.97632 21 6.79981V9.5C21 10.0523 20.5523 10.5 20 10.5C19.4477 10.5 19 10.0523 19 9.5ZM16 6C16.5523 6 17 6.44772 17 7C17 7.55228 16.5523 8 16 8H8C7.44772 8 7 7.55228 7 7C7 6.44772 7.44772 6 8 6H16Z"
        fill="currentColor"
      />
    </svg>
  )
}

// The "Section N: ..." divider row — a line, a text-secondary label,
// another line. Not a Figma component; appears twice on this one
// screen already (Section 1 added 2026-09-16, matching Section 2's
// existing structure exactly), meeting the repeated-pattern bar the
// same way `TopicNode` did.
function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex w-full items-center" style={{ gap: 'var(--size-space-200)' }}>
      <div className="flex-1" style={{ height: 1, background: 'var(--semantic-color-border-strong)' }} />
      <span
        style={{
          fontFamily: 'var(--type-scale-headline-xxs-bold-font-family)',
          fontWeight: 'var(--type-scale-headline-xxs-bold-font-weight)',
          fontSize: 'var(--type-scale-headline-xxs-bold-font-size)',
          lineHeight: 'var(--type-scale-headline-xxs-bold-line-height)',
          letterSpacing: 'var(--type-scale-headline-xxs-bold-letter-spacing)',
          color: 'var(--semantic-color-text-secondary)',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
      <div className="flex-1" style={{ height: 1, background: 'var(--semantic-color-border-strong)' }} />
    </div>
  )
}

// SPEC.md: the 3 study-plan-entry states are "derived from a local
// recall-session record, not fetched." Session doesn't persist one, so
// the state comes from `?state=` instead, set by the screen that leads
// here (Summary's "Continue" → `inProgress`, Summary-all recalled's
// "Continue" → `finish`, per Figma's own arrows); a bare `/` is
// `notStarted`.

function StudyPlanEntryContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const studyPlanState = searchParams.get('state')
  const isInProgress = studyPlanState === 'inProgress'
  const isFinished = studyPlanState === 'finish'

  return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--semantic-color-background-page)' }}>
      <div className="flex w-full max-w-[390px] flex-col overflow-hidden" style={{ height: 844 }}>
        <StatusBar />

        <AppBar variant="rightIconButtonOnly" rightIcon={KEBAB_ICON} rightLabel="More options" />

        {/* Figma's own frame is a fixed 390×844 device size (see "Screen/S -
            Pixel 2" component description: "Default mobile screen size")
            that clips its own content rather than growing taller or
            scrolling — reproduced the same way: `overflow: hidden` here
            (not `overflow-y: auto`), so content past the fold is cut, not
            scrollable. `min-height: 0` lets this flex child actually
            shrink to fit the remaining space instead of forcing the
            844px frame to grow past it. */}
        <main
          className="flex flex-1 flex-col items-center overflow-hidden"
          style={{ padding: 'var(--size-space-200) var(--size-space-400) 0', minHeight: 0 }}
        >
          <div className="flex w-full flex-col items-center" style={{ padding: '0 48px', gap: 'var(--size-space-300)' }}>
            <span style={{ fontSize: 48, lineHeight: '48px' }}>🎨</span>

            <div className="flex w-full flex-col items-center" style={{ gap: 'var(--size-space-300)' }}>
              <div className="flex items-center" style={{ gap: 'var(--size-space-100)' }}>
                <span
                  style={{
                    fontFamily: 'var(--type-scale-headline-l-font-family)',
                    fontWeight: 'var(--type-scale-headline-l-font-weight)',
                    fontSize: 'var(--type-scale-headline-l-font-size)',
                    lineHeight: 'var(--type-scale-headline-l-line-height)',
                    letterSpacing: 'var(--type-scale-headline-l-letter-spacing)',
                    color: 'var(--semantic-color-text-primary)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Art &amp; Design
                </span>
                <span style={{ width: 32, height: 32, color: 'var(--semantic-color-text-secondary)' }}>
                  <ChevronDownIcon />
                </span>
              </div>

              <div className="flex items-center justify-center" style={{ gap: 'var(--size-space-300)' }}>
                <div className="flex items-center" style={{ gap: 'var(--size-space-150)' }}>
                  <span style={{ width: 12, height: 12 }}>
                    <CalendarIcon />
                  </span>
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
                    In 1 day
                  </span>
                </div>
                <div className="flex items-center" style={{ gap: 'var(--size-space-150)' }}>
                  <span style={{ width: 12, height: 12 }}>
                    <TargetChipIcon />
                  </span>
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
                    Grade Goal: A
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col items-center" style={{ gap: 'var(--size-space-600)', paddingTop: 'var(--size-space-600)' }}>
            <SectionDivider label="Section 1: Finding Ideas" />

            <TopicNode label="Finding Ideas" active icon={<AiQuizIcon />} />
            <TopicNode label="Choosing Subjects" active icon={<AiQuizIcon />} />

            <div className="relative w-full">
              {/* Figma's own updated instance (2026-09-16) clips the mascot's
                  own cell to a fixed, short box sitting directly above the
                  card — the card visually "cuts off" the mascot's lower
                  half because the mascot's own container clips there, not
                  because the card paints over it. Reproduced the same way:
                  a fixed-height `overflow: hidden` box, not a taller
                  unclipped mascot. */}
              <div className="absolute overflow-hidden" style={{ left: 32, top: 0, width: 52, height: 40 }}>
                <div className="absolute" style={{ left: -6, top: 0, width: 64, height: 64 }}>
                  <MascotSlot size="XL" pose="standby" />
                </div>
              </div>

              <div
                className="flex w-full flex-col items-start"
                style={{
                  marginTop: 45,
                  padding: 'var(--size-space-300)',
                  borderRadius: 'var(--size-radius-600)',
                  background: 'var(--semantic-color-background-surface)',
                }}
              >
                {/* Non-interactive label (Mia, 2026-09-20). `Chips` always renders a
                    `<button>` and has no static mode, so it is taken out of the tab
                    order and pointer events here. See component-gaps.md. */}
                <Chips
                  color="pro"
                  active
                  text="🔥 +20% exam score"
                  size="XXS"
                  showLeftIcon={false}
                  showRightIcon={false}
                  className="pointer-events-none"
                  tabIndex={-1}
                  role="note"
                />

                {/* Figma's title row (`Frame 2147207767`, all three states) is
                    a fixed 48px, the button instance filling it, so a 32px
                    Button sits with 8px above and below and never touches
                    the progress row underneath. Unbound literal. */}
                <div className="flex w-full items-center justify-between" style={{ height: 48 }}>
                  <span
                    style={{
                      fontFamily: 'var(--type-scale-headline-s-font-family)',
                      fontWeight: 'var(--type-scale-headline-s-font-weight)',
                      fontSize: 'var(--type-scale-headline-s-font-size)',
                      lineHeight: 'var(--type-scale-headline-s-line-height)',
                      letterSpacing: 'var(--type-scale-headline-s-letter-spacing)',
                      color: 'var(--semantic-color-text-primary)',
                    }}
                  >
                    Explain it to Knowie
                  </span>
                  {isFinished ? (
                    // No `Button` variant produces this real instance's fill —
                    // Primary binds interactive/primary+on-primary (the
                    // Speak button above), Secondary binds
                    // background/surface+text/primary (see
                    // `shared/buttonVariants.ts`'s `getFill`) — but
                    // StudyPlan-finish's own live Redo button is bound to
                    // interactive/secondary+on-secondary, a pairing no
                    // variant produces. Same gap shape as Learning-recording's
                    // Redo `ButtonIcon` (component-gaps.md): built inline,
                    // matching `Button`'s own S-size shape/shadow/type scale
                    // with the real bound colors substituted in, rather than
                    // forcing a mismatched variant or inventing a new one.
                    <button
                      type="button"
                      className="inline-flex items-center justify-center"
                      style={{
                        height: 32,
                        paddingInline: 'var(--size-space-300)',
                        borderRadius: 'var(--size-radius-full)',
                        background: 'var(--semantic-color-interactive-secondary)',
                        boxShadow: 'inset 0 -2px 0 0 rgba(0,0,0,0.15)',
                      }}
                      data-hotspot
                      onClick={() => router.push('/session')}
                    >
                      <span className="inline-flex items-center" style={{ gap: 'var(--size-space-150)', paddingBottom: 2 }}>
                        <span
                          style={{
                            color: 'var(--semantic-color-interactive-on-secondary)',
                            fontFamily: 'var(--type-scale-body-s-bold-font-family)',
                            fontWeight: 'var(--type-scale-body-s-bold-font-weight)',
                            fontSize: 'var(--type-scale-body-s-bold-font-size)',
                            lineHeight: 'var(--type-scale-body-s-bold-line-height)',
                            letterSpacing: 'var(--type-scale-body-s-bold-letter-spacing)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Redo
                        </span>
                        <IconSlot size="200" icon={REDO_ICON} />
                      </span>
                    </button>
                  ) : (
                    <Button
                      variant="Primary"
                      size="S"
                      cta={isInProgress ? 'Review' : 'Speak'}
                      data-hotspot
                      showRightIcon
                      rightIcon={ARROW_FORWARD_ICON}
                      onClick={() => router.push(isInProgress ? '/session?review=1' : '/primer')}
                    />
                  )}
                </div>

                {/* StudyPlan-inProgress's own live frame (node 13622:18080)
                    adds this row under the button — SPEC.md's "Redo" label
                    for this state turned out wrong once checked against the
                    live frame: the real instance still reads "Speak," only
                    `StudyPlan-finish` demotes to "Redo" (per that screen's
                    own designer note). The bar itself has no matching
                    ProgressIndicator preset — its 8px fill inside a 2px
                    inset track (`size/space/200` fill height, `size/space/050`
                    inset) is shorter than both real thickness values (16/24)
                    that component supports, so it's hand-built here from the
                    same real tokens rather than forced into a mismatched
                    preset; see component-gaps.md. The "X OF 4" label is a
                    separate text element next to the bar, not the
                    component's own `showText` mode — the same established
                    pattern as the appBar's own "Topics X of 4" count.
                    `StudyPlan-finish`'s own live frame (node 13674:14438)
                    keeps this same row rather than a distinct "complete"
                    treatment: full-width fill, recolored from
                    accent/brand/bold to feedback/success/bold (its own real
                    bound token), "4 OF 4". */}
                {(isInProgress || isFinished) && (
                  <div className="flex w-full" style={{ gap: 'var(--size-space-400)', alignItems: 'flex-start' }}>
                    <div
                      className="flex-1"
                      style={{
                        padding: 'var(--size-space-050)',
                        borderRadius: 'var(--size-radius-full)',
                        background: 'var(--semantic-color-background-stacking)',
                        boxSizing: 'border-box',
                      }}
                    >
                      <div
                        style={{
                          width: isFinished ? '100%' : '25%',
                          height: 'var(--size-space-200)',
                          borderRadius: 'var(--size-radius-full)',
                          background: isFinished
                            ? 'var(--semantic-color-feedback-success-bold)'
                            : 'var(--semantic-color-accent-brand-bold)',
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontFamily: 'var(--type-scale-caption-s-bold-font-family)',
                        fontWeight: 'var(--type-scale-caption-s-bold-font-weight)',
                        fontSize: 'var(--type-scale-caption-s-bold-font-size)',
                        lineHeight: 'var(--type-scale-caption-s-bold-line-height)',
                        letterSpacing: 'var(--type-scale-caption-s-bold-letter-spacing)',
                        color: 'var(--semantic-color-text-secondary)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {isFinished ? '4 OF 4' : '1 OF 4'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <SectionDivider label="Section 2: Mixed Media" />

            <TopicNode label="Artwork Planning" active={false} icon={<AiQuizIcon />} />
          </div>

          <div style={{ height: 'var(--size-space-600)' }} />
        </main>

        <div className="flex w-full flex-col items-start" style={{ background: 'var(--semantic-color-background-page)', padding: '0 var(--size-space-400)' }}>
          <div className="flex w-full items-center justify-between" style={{ paddingTop: 'var(--size-space-200)' }}>
            <span aria-hidden style={{ width: 24, height: 24, padding: 'var(--size-space-200)', boxSizing: 'content-box', color: 'var(--semantic-color-text-secondary)' }}>
              <NavChatIcon />
            </span>
            <span aria-hidden style={{ width: 24, height: 24, padding: 'var(--size-space-200)', boxSizing: 'content-box', color: 'var(--semantic-color-text-secondary)' }}>
              <NavSearchIcon />
            </span>
            {/* Highlighted/active tab — bound to `highlight/border` (Mia
                2026-09-19). Replaces the literal `#A684FF` this used to
                reproduce; that value matched no token. */}
            <span aria-hidden style={{ width: 24, height: 24, padding: 'var(--size-space-200)', boxSizing: 'content-box', color: 'var(--semantic-color-highlight-border)' }}>
              <NavTargetIcon />
            </span>
            <span aria-hidden style={{ width: 24, height: 24, padding: 'var(--size-space-200)', boxSizing: 'content-box', color: 'var(--semantic-color-text-secondary)' }}>
              <NavAiQuizIcon />
            </span>
            <span
              aria-hidden
              className="relative overflow-hidden shrink-0"
              style={{ width: 24, height: 24, borderRadius: 'var(--size-radius-full)' }}
            >
              <Image src="/images/avatar-placeholder.png" alt="" fill sizes="24px" style={{ objectFit: 'cover' }} />
            </span>
          </div>
          <div className="flex w-full items-end justify-center" style={{ height: 34, paddingBottom: 8 }}>
            <div style={{ width: 131, height: 5, borderRadius: 100, background: 'var(--semantic-color-background-inverse)' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function StudyPlanEntry() {
  return (
    <Suspense fallback={null}>
      <StudyPlanEntryContent />
    </Suspense>
  )
}
