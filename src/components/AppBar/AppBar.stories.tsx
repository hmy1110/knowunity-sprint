import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { AppBar, type AppBarVariant } from './AppBar'
import { ProgressIndicator } from '../ProgressIndicator/ProgressIndicator'

// Figma's own component description, verbatim (node 13628:12762, "🎨
// Mascot & components" page, Yummy__Knowie Design System). Read this
// before using or changing the component — see AppBar.tsx for the full
// text with paragraph breaks.
const FIGMA_DESCRIPTION = `**What it is:** 6-variant top nav (back/menu icon button, a stretchable content slot, optional right button or buttons for title/search/actions).

**When to use it:** The top row on every screen in the recall loop, 19 instances across the flow. leftIconButtonOnly (X close, progressIndicator in the stretchable slot) is the top row on every Primer/Learning/Summary screen; leftAndRightIconButton (back arrow plus kebab menu) is the study plan screen's row, used on StudyPlan-notStarted, StudyPlan-inProgress and StudyPlan-finish. The other 4 variants (default, leftAndRightButton, leftAndTwoRightIconButtons, leftAnd2RightButtons) have no real instance anywhere.

**One thing to do:** The stretchable slot holds a progressIndicator cleanly on every screen that uses it. The 4 unused variants have no real-screen precedent, so treat them as untested if a screen ever needs more than one right-side action.

---

**The description says "6-variant" — the live component actually has 7,** confirmed from its own \`componentPropertyDefinitions\`. \`rightIconButtonOnly\` isn't named in the description's own enumeration at all, but is a real built variant; reproduced here since the live structure outranks the prose count.

**Reuses IconSlot** for every icon glyph (confirmed: each icon sits in a nested instance literally named "iconSlot", at exactly \`icon/300\`). **Not built from ButtonIcon** — appBar's own icon buttons are a 40px circle with no fill at all, a size/fill combination no real ButtonIcon variant has.

**No icon system exists in this codebase**, and design-system.md's own real-usage note confirms the left icon is swapped per screen (back arrow vs. X close) — so every icon here takes real content from the caller, same as ButtonIcon/Chips/IconSlot, rather than baking in Figma's own default glyphs.

**The stretchable middle slot is a real Figma \`SLOT\` property** whose 5 \`preferredValues\` all reference an unresolvable library (same kind of gap MascotSlot's Homie swap hit) — but \`allowPreferredValuesOnly: false\` confirms it was never meant to be closed, so it's built as plain \`children\`. The one real-content type both this description and ProgressIndicator's own confirm is ProgressIndicator itself — see the "Real usage" stories below.

**Gaps found building this component:** the bar's 56px height, the 48px icon touch target, the 40px icon circle, and the text-button's 52px/40px wrapper are all unbound literals. The bar's background is a real, bound Figma style ("Gradient/BG Top") with no corresponding token anywhere in tokens.json/tokens.css — reproduced as a gradient from \`background/page\` to the CSS keyword \`transparent\`, not a raw hex or an invented token.`

// Generic placeholder glyphs — no icon system exists in this codebase
// (see the component doc comment), so these are demo content for the
// stories only, not part of the component itself. Shapes chosen to
// roughly match the *role* Figma's own default instances use at each
// position (back arrow / kebab menu / share), not literal icon assets.
const backIcon = (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
    <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const closeIcon = (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)
const menuIcon = (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
    <circle cx="12" cy="5" r="1.5" fill="currentColor" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    <circle cx="12" cy="19" r="1.5" fill="currentColor" />
  </svg>
)
const shareIcon = (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
    <path d="M12 16V4M12 4L7 9M12 4L17 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 14V18C5 19.1046 5.89543 20 7 20H17C18.1046 20 19 19.1046 19 18V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const meta = {
  title: 'Components/AppBar',
  component: AppBar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: FIGMA_DESCRIPTION,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: [
        'default',
        'leftIconButtonOnly',
        'leftAndRightIconButton',
        'leftAndRightButton',
        'leftAndTwoRightIconButtons',
        'leftAnd2RightButtons',
        'rightIconButtonOnly',
      ],
    },
  },
} satisfies Meta<typeof AppBar>

export default meta
type Story = StoryObj<typeof meta>

// One story per Figma variant symbol ("variant=X"), named to match, all
// 7 in the same order Figma's own componentPropertyDefinitions lists
// them.
function variantStory(variant: AppBarVariant, extra: Partial<React.ComponentProps<typeof AppBar>> = {}): Story {
  return {
    name: `variant=${variant}`,
    tags: ['ai-generated'],
    args: { variant, ...extra },
  }
}

export const Default = variantStory('default')
export const LeftIconButtonOnly = variantStory('leftIconButtonOnly', {
  leftIcon: closeIcon,
  leftLabel: 'Close',
})
export const LeftAndRightIconButton = variantStory('leftAndRightIconButton', {
  leftIcon: backIcon,
  leftLabel: 'Back',
  rightIcon: menuIcon,
  rightLabel: 'More options',
})
export const LeftAndRightButton = variantStory('leftAndRightButton', {
  leftIcon: backIcon,
  leftLabel: 'Back',
  rightText: 'Skip',
})
export const LeftAndTwoRightIconButtons = variantStory('leftAndTwoRightIconButtons', {
  leftIcon: backIcon,
  leftLabel: 'Back',
  rightIcon: shareIcon,
  rightLabel: 'Share',
  rightIcon2: menuIcon,
  rightLabel2: 'More options',
})
export const LeftAnd2RightButtons = variantStory('leftAnd2RightButtons', {
  leftIcon: backIcon,
  leftLabel: 'Back',
  rightIcon: menuIcon,
  rightLabel: 'More options',
  rightText: 'Skip',
})
export const RightIconButtonOnly = variantStory('rightIconButtonOnly', {
  rightIcon: menuIcon,
  rightLabel: 'More options',
})

// The same row with `rightDecorative` (Mia, 2026-09-23). Pixel-identical
// to the story above — same 48px box, same 40px circle, same glyph — but
// the icon renders as `<span aria-hidden>` rather than `<button>`, so it
// is not a focus stop and is not announced. This is what the study plan
// at `/` uses: Figma draws the kebab on all three StudyPlan frames and
// gives it no menu to open, so announcing it as a control would promise
// a screen that doesn't exist. Compare the two side by side to confirm
// nothing visual changed.
export const RightIconDecorative = variantStory('rightIconButtonOnly', {
  rightIcon: menuIcon,
  rightDecorative: true,
})

// Real usage per design-system.md and ProgressIndicator's own
// description: leftIconButtonOnly (X close) with a ProgressIndicator,
// showText false, in the stretchable slot — the top row of every
// Primer/Learning/Summary screen.
export const RealUsagePrimerLearningSummary: Story = {
  tags: ['ai-generated'],
  args: {
    variant: 'leftIconButtonOnly',
    leftIcon: closeIcon,
    leftLabel: 'Close',
    children: <ProgressIndicator variant="Primary" thickness="16" progress="50" showText={false} />,
  },
}

// Real usage: rightIconButtonOnly (kebab menu, no left icon), the study
// plan screen's row — updated 2026-09-15, live Figma moved this off
// leftAndRightIconButton (back arrow + kebab menu), which it used to be.
export const RealUsageStudyPlan: Story = {
  tags: ['ai-generated'],
  args: {
    variant: 'rightIconButtonOnly',
    rightIcon: menuIcon,
    rightLabel: 'More options',
  },
}
