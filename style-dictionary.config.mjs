// Style Dictionary build config.
// Reads the DTCG tokens in tokens/ and writes CSS custom properties to build/css/tokens.css.
// Run it with: npm run tokens

/** Banner written at the top of every generated file. */
const generatedFileHeader = () => [
  'GENERATED FILE - DO NOT EDIT BY HAND.',
  '',
  'Every value here is built from tokens/tokens.json by Style Dictionary.',
  'Editing this file directly will be overwritten on the next `npm run tokens`.',
  'To change a value, change the token, then re-run the build.',
];

/**
 * Tracking (letterSpacing) is stored as a percent of the font size, so the
 * token value -1 means -1%. CSS `letter-spacing` does not accept percentages
 * in any shipping browser, but `em` means exactly the same thing there -- a
 * multiple of the current font size -- so -1% is written as -0.01em.
 * Without this the values come out as a bare `-1`, which browsers ignore.
 */
const trackingPercentToEm = {
  name: 'letterSpacing/percentToEm',
  type: 'value',
  // Matches the tracking primitives and the letterSpacing lifted out of each
  // text style by `expand` below.
  filter: (token) => {
    const path = token.path ?? [];
    return (
      path[path.length - 1] === 'letterSpacing' ||
      (path[0] === 'typography' && path[1] === 'tracking')
    );
  },
  transform: (token) => {
    const value = token.$value ?? token.value;
    // Leave anything already carrying a unit alone.
    if (typeof value === 'string' && !/^-?[\d.]+$/.test(value.trim())) return value;
    const percent = Number(value);
    if (!Number.isFinite(percent)) return value;
    return `${percent / 100}em`;
  },
};

const config = {
  // Where the tokens live. A glob, so more files dropped into tokens/ are picked up automatically.
  source: ['tokens/**/*.json'],

  // Custom conversions this build adds on top of the built-in ones.
  hooks: {
    transforms: {
      [trackingPercentToEm.name]: trackingPercentToEm,
    },
  },

  // Tell Style Dictionary the tokens use the DTCG spec ($value / $type), not its own legacy shape.
  usesDtcg: true,

  platforms: {
    css: {
      // Ready-made set of conversions for the web: kebab-case names, px sizes, CSS colours.
      transformGroup: 'css',

      // Runs after the group above, so tracking gets its unit.
      transforms: [trackingPercentToEm.name],

      // Folder the generated file is written into.
      buildPath: 'build/css/',

      // Text styles hold several values in one token. Split each into its own variable
      // so nothing (notably letterSpacing) is lost to the CSS `font` shorthand.
      expand: {
        include: ['typography'],
        // Keep each sub-value's type matching what tokens.json declares, so sizes
        // keep their units instead of collapsing to "[object Object]".
        typesMap: {
          typography: {
            fontFamily: 'fontFamily',
            fontWeight: 'fontWeight',
            fontSize: 'dimension',
            lineHeight: 'dimension',
            letterSpacing: 'number',
          },
        },
      },

      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: {
            fileHeader: generatedFileHeader,
          },
        },
      ],
    },
  },
};

export default config;
