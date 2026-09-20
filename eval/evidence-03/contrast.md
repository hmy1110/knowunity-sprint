# Text contrast per state

Two independent numbers per text run. **rendered** = sampled from the screenshot (most common colour in the text box = background, colour farthest from it in luminance = glyph core). **nominal** = computed from CSS colours with alpha and group opacity composited down the DOM chain (does not see scrims/overlays/images). Rows below are every run under 4.5:1 on either number, listed once per state. Antialiasing can pull the rendered figure slightly low on thin glyphs. Full data: `measure/contrast-per-state.json`. Text below the fold in a state with no full-page screenshot has no rendered figure (`n/a`).

| state | text | size/weight | nominal | rendered | rendered fg / bg |
|---|---|---|---|---|---|
| C03-t1-recording-a | 8 | 18px/600 | 8.1 | 2.77 | rgb(66,89,126) / rgb(9,11,17) |
| C03-t1-recording-a | Let’s start. Explain the term “Inspiration” out loud, in your own words. | 18px/400 | 13.95 | 4.45 | rgb(127,126,132) / rgb(22,23,28) |
| C03-t1-recording-b | 8 | 18px/600 | 8.1 | 2.77 | rgb(66,89,126) / rgb(9,11,17) |
| C03-t1-recording-b | Let’s start. Explain the term “Inspiration” out loud, in your own words. | 18px/400 | 13.95 | 4.45 | rgb(127,126,132) / rgb(22,23,28) |
| C09-t2-recording | 8 | 18px/600 | 8.1 | 2.77 | rgb(66,89,126) / rgb(9,11,17) |
| C09-t2-recording | Explain the term “Divergent thinking” out loud, in your own words. | 18px/400 | 13.95 | 4.45 | rgb(127,126,132) / rgb(22,23,28) |
| C13-t2-Hinted1-recording | 8 | 18px/600 | 8.1 | 2.77 | rgb(66,89,126) / rgb(9,11,17) |
| C13-t2-Hinted1-recording | Not quite yet. | 20px/700 | 10.7 | 3.61 | rgb(131,110,43) / rgb(22,23,28) |
| C13-t2-Hinted1-recording | Hint 1 of 2 | 12px/400 | 13.95 | 4.45 | rgb(127,126,132) / rgb(22,23,28) |
| C13-t2-Hinted1-recording | No worries. Think about the very first step, before you start narrowing down to  | 18px/400 | 13.95 | 4.45 | rgb(127,126,132) / rgb(22,23,28) |
| F07-t1-typeProcessing | Submit | 20px/700 | 3.69 | 3.66 | rgb(122,123,130) / rgb(34,36,47) |
| F07-t1-typeProcessing | Switch to voice | 20px/700 | 3.69 | 3.66 | rgb(122,123,130) / rgb(34,36,47) |

12 rows under 4.5:1 across 78 states.
