## Why

Chrome DevTools performance traces against the production build (`yarn build && yarn preview`) of `/about` and `/methods` reveal three categories of waste that hit every page on the site:

1. **Massively oversized raster logos in the layout**. `who-logo-blue.png` and `who-logo-white.png` are each 162 KB PNGs at 3000×1639 natural resolution but render at 150×82 — roughly **20× the pixels needed**. `uhcw-home-logo.png` is 32 KB at 1398×560, also rendered at 180×72. These three images alone account for ~360 KB of payload on every page load and are served straight from `/public/images` without ever passing through Astro's image pipeline.
2. **Footer duplicates its entire DOM** for desktop and mobile, hiding one with CSS. Both `who-logo-white.png` and `europe-flag.png` exist twice in the DOM on every page (the inactive copy is a real `<img>` with rendered box `0×0`). The browser still parses both `<img>` elements and downloads both images on initial load.
3. **About page ships a 577 KB JS bundle (`ExpertsNetworkSelector`) and 70+ eager-loaded `<img>`s without `width`/`height` or `loading="lazy"`** in `PersonCardReact.tsx`, contributing to a measurable CLS (0.06 in lab, will be worse on slower devices) and unnecessary main-thread work above the fold.
4. **The about-page hero (`OfficeHeader.astro`) is the wrong way around.** The office image is the largest above-the-fold visual element on `/about` — the natural LCP candidate — yet it is rendered with `loading="lazy"`, no `width`/`height`, and no `fetchpriority`. Lazy-loading disqualifies it from being the LCP element, so the browser falls back to the (much smaller) header WHO logo as LCP, while the user perceives the page as "blank" until the hero finally loads. The image itself is already build-time-optimized to a 770px-wide `webp` by `downloadOfficeImage`; the fix is purely in `<img>` attributes plus knowing the intrinsic dimensions.

These issues are easy to fix and the savings are largely shared across the whole site, so the layout changes alone improve every page — including `/methods`, which is otherwise lean.

## What Changes

- **Header logos** (`Header.astro`): replace raw `<img src="/images/who-logo-blue.png">` and `/images/uhcw-home-logo.png` with Astro `<Image />` components sourced from `src/assets/`, generating responsive `webp` at sizes that match actual usage. Add `width`/`height` attributes and `fetchpriority="high"` to the LCP-eligible logos. Add `loading="eager"` (default) and `decoding="async"`.
- **Footer logos** (`Footer.astro`): same treatment for `who-logo-white.png` and `europe-flag.png`.
- **Footer DOM duplication** (`Footer.astro`): stop rendering both desktop and mobile footers in the DOM. Either (a) collapse to a single responsive markup, or (b) keep two variants but ensure the inactive one is not present in the DOM at render time (e.g., via `Astro.props` driven by a CSS-derived breakpoint, or by using `<picture>`-style conditional rendering with `display: contents` + a single shared `<img>`). Investigate during design.
- **PersonCardReact.tsx**: add `width="200" height="200" loading="lazy" decoding="async"` to `<img className="person-card-image">` to mirror the Astro `PersonCard.astro` version and eliminate the avatar contribution to CLS.
- **OfficeHeader.astro** + **about-images.ts**: change the office image `<img>` to `loading="eager" fetchpriority="high" decoding="async"`, and add intrinsic `width`/`height` attributes so the browser reserves the box before the bytes arrive. To get the dimensions, extend `downloadOfficeImage` to return `{ src, width, height }` (read from `sharp`'s metadata after the build-time download) and thread the size through to `OfficeHeader`.
- **Image optimization spec coverage**: extend the existing `image-optimization` spec so that all layout/chrome images go through Astro's image pipeline (`src/assets/` + `<Image />`), not raw `/public/images/*.png`.
- **Methods page**: nothing page-specific needed; it inherits the layout fixes. Verify post-fix that `/methods` LCP and CLS remain ≤ current values.

Out of scope (deliberately deferred):
- Reducing the `ExpertsNetworkSelector` 577 KB bundle. That deserves its own change after we measure.
- Preloading fonts. Not currently a measured bottleneck.
- Migrating the entire site to `<Image />`. This change only covers layout chrome + the avatar in `PersonCardReact`.

## Capabilities

### New Capabilities
_None._

### Modified Capabilities
- `header-chrome`: header logos must use Astro's image pipeline with explicit `width`/`height` and high fetch priority.
- `footer-chrome`: footer logos must use Astro's image pipeline; the footer must render its desktop and mobile variants without duplicating image elements in the DOM.
- `image-optimization`: layout chrome images (logos, flags, decorative patterns) must be sourced from `src/assets/` and rendered via the Astro `<Image />` component, not served raw from `/public/images/`.
- `person-card`: the React variant (`PersonCardReact.tsx`) must declare intrinsic `width`/`height` on its avatar `<img>` and use `loading="lazy"` to match the Astro variant.
- `about-page-rendering`: the office header image must be eagerly loaded with `fetchpriority="high"` and intrinsic `width`/`height` so it becomes the LCP element on `/about`. `downloadOfficeImage` must return `{ src, width, height }` rather than just a path.

## Impact

- **Code**: `src/components/layout/Header.astro`, `src/components/layout/Footer.astro`, `src/islands/about/PersonCardReact.tsx`, `src/components/about/OfficeHeader.astro`, `src/data/about/about-images.ts`, `src/pages/about.astro` (signature change for `downloadOfficeImage`), possibly `src/lib/image-downloader.ts` (to surface dimensions), and new files under `src/assets/` (moved from `public/images/`).
- **Assets**: `public/images/who-logo-blue.png`, `who-logo-white.png`, `uhcw-home-logo.png`, `europe-flag.png` either moved into `src/assets/` or replaced with smaller optimized sources. The `public/images/` originals can be deleted once nothing else references them.
- **Tests**: `src/islands/about/__tests__/PersonCardReact.test.tsx` may need updates to assert the new `<img>` attributes.
- **No API or behavioral changes** for users beyond faster loads, less CLS, and lower bandwidth.
- **No new dependencies** — Astro's built-in `astro:assets` / `<Image />` is already used elsewhere (`src/pages/methods.astro` imports from `@/assets/`).
- **Rollback**: revert the commit. No data migrations, no config changes.
