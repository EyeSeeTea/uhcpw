## 1. Fix /about office image sizing

- [x] 1.1 In `src/components/about/OfficeHeader.astro`, remove the `height` HTML attribute from the `<img>` tag and add `height: auto` to the `.office-image` CSS rule so the image scales proportionally at `width: 100%`

## 2. Fix /about text-column spacing

- [x] 2.1 In `src/components/about/OfficeHeader.astro`, adjust the `.office-grid` and grid item styles to replicate MUI Grid `spacing={5}` item padding (20px per item side) — consider adding padding to `.image-column` and `.text-column` and reducing `gap` accordingly, or matching the net visual spacing
- [x] 2.2 Adjust `.text-content` to account for MUI Container `maxWidth="sm"` padding (24px horizontal) if needed

## 3. Fix /methods title-banner height

- [x] 3.1 In `src/pages/methods.astro`, add `line-height: 1.167` to the `.title-banner h1` rule to match MUI Typography variant="h3"

## 4. Visual verification

- [x] 4.1 Run visual comparison of /about page against SPA at desktop and mobile viewports
- [x] 4.2 Run visual comparison of /methods page against SPA at desktop and mobile viewports

## 5. Post-verification fixes (found during manual QA)

- [x] 5.1 /about desktop: `.header-section` was 15px taller than SPA. Replicate MUI Grid `spacing={5}` negative margin-bottom on `.office-grid` (`margin-bottom: -20px`) to collapse the section bottom
- [x] 5.2 /about desktop: `.caption` was 5px closer to image than SPA. The SPA's inline `<img>` contributes a ~5px line-box descender; global `img { display: block }` in theme.css removes it. Compensate with `.caption { margin-top: 25px }` (was 20px)
- [x] 5.3 /about mobile (xs, <600px): `.text-content` padding-inline reduced to `16px` to match MUI Container xs padding
- [x] 5.4 /about: `.container` in `about.astro` was missing MUI Container padding. Added `padding: 0 24px` (and `0 16px` at xs) so team/experts titles align with SPA at x=56 (desktop) / x=48 (mobile). Compensated `.office-grid` horizontal padding from `36px` to `12px` (a single value works for both breakpoints now) so image x stays at 56/48
- [x] 5.5 /methods mobile: don't override padding or hide `.bubble-img`; SPA keeps `24px 200px 24px 64px` on mobile and shows the dot pattern over the map. Changed background from `center / cover` to `center` so the map tiles at natural size (default `background-size: auto`, `background-repeat: repeat`)
- [x] 5.6 /methods: "Read less" now appears after expanded content (matches SPA). Added `.short-text` class to the short-markdown div, applied `display: flex; flex-direction: column-reverse` to `details` so summary renders after content, and `:has(details[open])` to hide `.short-text` when expanded (avoids duplicating short + long text)
- [x] 5.7 /methods text spacing: `.markdown-content p` / `li` line-height changed from 1.5/1.75 to `1.43` to match MUI Typography `body2` (14px * 1.43 = 20.02px computed)
- [x] 5.8 /methods anchors: removed `padding: 0 3px` from `.markdown-content :global(a)` — SPA's `MarkdownLink` overrides `TextLink` with inline `paddingInline: 0`, so anchors have no horizontal padding
- [x] 5.9 /methods Read more/less chevron: replaced unicode triangles `▾`/`▴` with inline SVGs using MUI's ExpandMore / ExpandLess paths. Sized 20x20 (MUI default), `fill: currentColor`, `margin-inline-start: 4px`, `inset-block-end: 2px` to match SPA's `.MuiButton-endIcon` styling
