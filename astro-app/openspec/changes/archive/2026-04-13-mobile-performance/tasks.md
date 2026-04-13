# Mobile Performance — Tasks

## Tasks

- [x] [FE] Add font preload links to Layout.astro `<head>` for Lato-Regular.woff2 and Lato-Bold.woff2
- [x] [FE] Inline theme CSS (fonts, tokens, reset) via `?inline` import + `set:html` to eliminate render-blocking `Layout.css` request
- [x] [FE] Evaluate `experts-network.css` size and decide: inline or keep external (Decision: keep external — 147 lines, all below-the-fold island styles)
- [x] [FE] Add `<link rel="preload">` for `map-background.jpg` scoped to mobile viewport in methods.astro (via new `head` slot in Layout)
- [x] [FE] Change `ExpertsNetwork` island from `client:load` to `client:visible` on about.astro
- [x] [FE] Verify `<meta charset="UTF-8">` remains first in `<head>` after adding preload tags
- [x] [FE] Rebuild and re-run mobile performance traces on both pages to measure improvement
