# Recording-scrim contrast: how `scrim-contrast.json` was measured

Evidence-04 could not measure the states under the recording scrim (B02, B08). Its
in-page contrast reads composited CSS colors and does not see an overlay painted on
top, so scorecard-04 recorded a hand estimate (~4.45:1 for the prompt) and left the
gate unresolved there.

**Method.** For each text run in the state's own `measure/<id>.json`, sample every
rendered pixel inside that run's first client rect from `screens/<id>.png` (captured
at deviceScaleFactor 2), convert to WCAG relative luminance, sort, and take the 5th
and 95th percentile as the background field and the glyph core. Ratio is
`(L_light + 0.05) / (L_dark + 0.05)`.

**Validation.** The same sampler was run over `B01-t1-idle`, which has no scrim and
whose CSS-composited ratios are known correct. It reproduces them:

| text | sampled | CSS-composited |
| --- | --- | --- |
| `09:41` 15px/600 | 17.63 | 17.63 |
| `8` (XP badge) 18px/600 | 8.10 | 8.10 |
| `Topics` / `of` / `4` 12px/600 | 17.63 | 17.63 |
| `Skip` 14px/600 | 17.63 | 17.63 |
| prompt 18px/400 | 13.95 | 13.95 |
| `Tap to speak` 14px/600 | 8.28 | 8.40 |

Largest divergence 0.12. The scrim figures in `scrim-contrast.json` are therefore
measurements of what is on screen, not estimates.

**What it found.** Under the recording scrim, `nominalRatio` (what the CSS says) and
`pixelRatio` (what renders) diverge sharply — the scrim darkens the text along with
the field behind it. The prompt at 18px/400 measures 4.45:1, the XP badge `8` at
18px/600 measures 2.77:1, and `Not quite yet.` at 20px/700 measures 3.61:1.
`Skip` measures 1.76:1 but renders in Button's Disabled state on that screen, and
disabled controls are excluded from evaluation (Mia, 2026-09-21).

Thresholds are the grader's to apply; this file reports the numbers only.
