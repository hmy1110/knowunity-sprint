import type { Preview } from '@storybook/nextjs-vite'
import { themes } from 'storybook/theming'
import { pageBackground } from './design-tokens'

// The real app stylesheet: Tailwind, the generated design tokens
// (build/css/tokens.css, via tokens/tokens.json), and the Greed font.
// Importing it here means every story renders with the same design
// system as the real app, not a blank page.
import '../src/app/globals.css'

// The design system is dark mode only (see docs/design-system.md), so
// there is no light/dark toggle to offer here. The tokens are already
// the dark values, and the swatch picker is turned off below so no one
// can accidentally flip a story to a light background.
const MOBILE_VIEWPORT = 'mobile390'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    },

    // No light/dark swatch picker: this design system has only one mode.
    backgrounds: {
      disable: true,
    },

    // The one screen size this prototype is designed for: an iPhone-width
    // viewport (390px wide), matching CLAUDE.md's "Mobile only. 390px."
    // This is the size the Canvas tab (where a single component is shown)
    // opens to by default. It does not affect the Docs tab (the page that
    // lists every variant of a component side by side) — Docs pages render
    // at the full width of the browser window, since a page of swatches
    // needs the room.
    viewport: {
      options: {
        [MOBILE_VIEWPORT]: {
          name: 'Knowunity mobile (390px)',
          styles: { width: '390px', height: '844px' },
          type: 'mobile',
        },
      },
    },

    // The Docs tab (and the card it draws around each live component
    // preview) is drawn by Storybook's own doc-page renderer, which
    // has its own light-by-default theme independent of manager.ts and
    // independent of the CSS this file imports above. Left unset, that
    // card would be a bright white box around our dark components.
    // Overridden here with the same page-background token as manager.ts,
    // so every surface — component, card, and the Storybook chrome
    // around it — agrees on what "dark" means.
    docs: {
      theme: {
        ...themes.dark,
        appPreviewBg: pageBackground,
      },
    },
  },

  initialGlobals: {
    viewport: { value: MOBILE_VIEWPORT, isRotated: false },
  },
};

export default preview;
