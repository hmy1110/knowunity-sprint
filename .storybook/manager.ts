import { addons } from 'storybook/manager-api'
import { themes } from 'storybook/theming'
import { pageBackground } from './design-tokens'

// This controls Storybook's own interface — the sidebar, toolbar, and the
// tool's own light/dark styling. It's separate from .storybook/preview.tsx,
// which controls how the components themselves render. Without this,
// Storybook's UI defaults to a light theme — wrong to sit around a design
// system that is dark mode only.
//
// Storybook's own built-in dark theme still hardcodes its preview-panel
// background (appPreviewBg) to white, on the assumption a component might
// be designed for a light background. Ours never is, so it's overridden
// here with the design system's actual page background token.
addons.setConfig({
  theme: {
    ...themes.dark,
    appPreviewBg: pageBackground,
  },
})
