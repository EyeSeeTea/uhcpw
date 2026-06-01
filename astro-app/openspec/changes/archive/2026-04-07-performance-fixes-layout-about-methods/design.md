## Context

Chrome DevTools traces against `yarn build && yarn preview` show that every page on the site pays the cost of three layout chrome PNGs that are ~20× oversized, plus a duplicated footer DOM that downloads two extra raster images per request. The `/about` page additionally renders 70+ avatar `<img>` elements without intrinsic dimensions or lazy-loading inside `PersonCardReact.tsx`. These are all small, well-scoped fixes — no architectural rework needed — but they touch shared layout components and the spec for `image-optimization`, `header-chrome`, `footer-chrome`, and `person-card`.

Lab measurements (desktop, no throttling, `yarn preview` build):

| Page    | LCP   | CLS  | Notes                                                              |
|---------|-------|------|--------------------------------------------------------------------|
| /about  | 175ms | 0.06 | LCP = WHO blue logo. 70+ eager avatars. 577 KB ExpertsNetworkSelector.js. |
| /methods| 102ms | 0.00 | Lean. Only inherits the layout cost (logos + duplicated footer).   |

LCP and CLS look fine on desktop fiber, but the bytes that drive them (~360 KB of layout PNGs alone) translate directly into seconds on slow mobile networks. The fix is asset-side, not architectural.

## Goals / Non-Goals

**Goals:**
- Cut layout-image payload from ~360 KB to ≤ ~30 KB across all pages by routing logos through Astro's `<Image />` pipeline.
- Eliminate duplicated `<img>` elements in the footer.
- Bring `PersonCardReact.tsx` to parity with `PersonCard.astro` for image attributes (`width`, `height`, `loading="lazy"`, `decoding="async"`).
- Keep the visual rendering identical — no design changes.

**Non-Goals:**
- Reducing the `ExpertsNetworkSelector` JS bundle (577 KB). Tracked separately.
- Font preloading, font subsetting, or font-display tweaks.
- Migrating every `<img>` on the site to `<Image />`. Out of scope; this change covers layout chrome + the React person card avatar.
- Visual redesign of the header or footer. No Pencil mockups required — pixel output is unchanged.

## Decisions

### 1. Source logos from `src/assets/`, not `public/images/`

**Choice:** Move `who-logo-blue.png`, `who-logo-white.png`, `uhcw-home-logo.png`, and `europe-flag.png` from `public/images/` into `src/assets/layout/`. Import them and render via Astro's `<Image />` component.

**Why:** Astro only optimizes images that pass through `astro:assets`. Anything in `public/` is served byte-for-byte. Moving the files into `src/assets/` lets Vite hash, resize, and convert them to `webp`/`avif` automatically, with width/height baked into the output `<img>` (which also helps CLS).

**Alternatives considered:**
- _Pre-process the PNGs manually_ (e.g., commit a 300×164 webp copy alongside the original). Rejected: it bypasses the existing pipeline and forces a manual step the next person will forget.
- _Use `sharp` in a build script_. Rejected: Astro's `<Image />` already wraps `sharp`. Reinventing it adds maintenance.
- _Inline as SVG_. The WHO logo has photographic gradients in its current PNG; converting to SVG is non-trivial and visually risky. Defer.

### 2. Set `widths` and `sizes` to actual rendered sizes

**Choice:** For each `<Image />` invocation, declare `widths={[150, 200, 300]}` and `sizes="(max-width: 600px) 100px, 150px"` (or analogous values per logo) so Astro emits a `srcset` matching the responsive CSS rules already in `Header.astro`/`Footer.astro`.

**Why:** A single fixed-width output would either over-serve desktop or under-serve high-DPR displays. The CSS already encodes the breakpoints (`@media (max-width: 600px) { .who-logo { width: 100px; } }`); we mirror them.

### 3. Mark the header WHO logo as `loading="eager" fetchpriority="high"`

**Choice:** The header WHO logo is the LCP candidate on `/about` (Chrome reports nodeId 57, the `<img class="who-logo">`). Add `fetchpriority="high"` so the browser starts downloading it before any deferred JS or icon fonts compete for bandwidth.

**Why:** Even though our LCP is small in lab, on slower networks the header logo races against the 577 KB ExpertsNetworkSelector bundle. `fetchpriority="high"` is a single-attribute win.

### 4. Eliminate footer DOM duplication by lifting shared images out

**Choice:** Instead of rendering both `<div class="desktop-footer">` and `<div class="mobile-footer">` in the same Astro template (each with their own copies of `who-logo-white` and `europe-flag`), refactor `Footer.astro` so the **WHO logo and the Europe flag are rendered exactly once**. The desktop/mobile difference is structural (grid vs accordions), so we keep two layout containers but reference the shared images via:
- Option A (preferred): a single `<img>` per logo, positioned via CSS Grid `grid-area` differently between desktop and mobile breakpoints.
- Option B (fallback if A creates layout headaches): keep two markup paths but wrap the inactive variant in `<template>` so the browser does not download its images.

Pick A first, fall back to B during implementation if grid reflow becomes painful.

**Why:** Today the footer has four `<img>` elements when only two are visible; the browser fires HTTP requests for the hidden two and burns parse time on them. Lifting them out is invisible to users and saves both bytes and DOM nodes.

**Alternatives considered:**
- _Render desktop or mobile via JS based on viewport_. Rejected: breaks SSR, adds hydration cost, and triggers a layout shift on first paint.
- _Use CSS `content-visibility: hidden` or `display: none` on the inactive `<img>` source_. Doesn't help — `display: none` on an `<img>` does **not** prevent the browser from downloading it.

### 5. Fix `PersonCardReact.tsx` avatar attributes

**Choice:** Add `width={200} height={200} loading="lazy" decoding="async"` to the `<img className="person-card-image">`. The CSS already enforces a fixed `200×200` (`150×150` on `<600px`) box, so the intrinsic attributes match the layout exactly and prevent the browser from reflowing once the image loads.

**Why:** This is the same fix that already exists in `PersonCard.astro`. The React variant drifted. Without intrinsic dimensions, every avatar on `/about` is a CLS contributor; with `loading="lazy"`, only the avatars in the viewport download eagerly.

### 6. Eagerly load the about-page office hero with `fetchpriority="high"`

**Choice:** In `OfficeHeader.astro`, change the office image `<img>` from `loading="lazy"` to `loading="eager"`, add `fetchpriority="high"` and `decoding="async"`, and declare intrinsic `width`/`height` matching the actual file. To know the height (the width is fixed at 770 by `OFFICE_IMAGE_OPTIONS`, but the height varies per source image), extend `downloadOfficeImage` to read the `sharp` output metadata and return `{ src, width, height }` instead of just a string. Thread the dimensions through `about.astro` into `OfficeHeader`.

**Why:** The office image is the visually dominant above-the-fold element on `/about`. Marking it lazy is the inverse of what we want — it disqualifies the image from being an LCP candidate, and the page perceives as blank until the lazy load fires. Browsers do not consider lazy-loaded images for LCP, so currently the much-smaller WHO header logo is "winning" LCP while the user actually waits on the office hero. Switching to eager + high fetchpriority lets the browser race that image alongside the critical resources.

**Alternatives considered:**
- _Keep `loading="lazy"` but add `fetchpriority="high"`_. Rejected: the two attributes conflict in spec terms; some browsers honor one, some the other, and the resulting behavior is muddled. Above-the-fold images should never be lazy.
- _Hardcode the `height` based on a fixed aspect ratio_. Rejected: the office image is editorial content that may change. Reading actual dimensions from sharp's metadata is cheap and accurate.
- _Use Astro's `<Image />` instead of a raw `<img>`_. Rejected for now: `<Image />` requires a static import or a `getImage()` call against a known asset. The file path here is computed at build time inside `downloadOfficeImage` from a remote DHIS2 URL. We could route it through `getImage()` after the download, but that doubles the build work for marginal gain — `downloadOfficeImage` already produces an optimized webp.

### 7. Do **not** touch the `ExpertsNetworkSelector` bundle in this change

The 577 KB JS is the largest single piece of waste on `/about`, but it deserves its own analysis (which Recharts/MUI sub-imports are pulling weight, code-splitting strategy, dynamic import boundaries, etc.). Bundling that into this change would inflate scope and delay the easy wins.

## Risks / Trade-offs

- **[Risk] Astro `<Image />` output dimensions might differ from the raw PNG dimensions and visually shift the header.**
  → _Mitigation:_ run `visual-compare` against the SPA at desktop/tablet/mobile after the change. The CSS already pins logo widths in pixels, so the rendered box should be identical.

- **[Risk] Lifting footer images out into shared markup may break the existing CSS grid/flex layout on mobile.**
  → _Mitigation:_ Option B fallback documented above. Worst case, we keep two markup paths and use `<template>` to suppress one set of `<img>`s.

- **[Risk] `loading="lazy"` on the avatar may cause the first viewport-visible avatars to load slightly later than today.**
  → _Mitigation:_ acceptable trade-off — current behavior eagerly loads 70 avatars regardless of viewport, which is strictly worse. Browsers correctly prioritize in-viewport lazy images.

- **[Risk] Moving files out of `public/images/` could break any hard-coded references (e.g., in `about-data.ts` or markdown content).**
  → _Mitigation:_ grep for each filename before deleting. `who-logo-blue.png` and `uhcw-home-logo.png` are only referenced from `Header.astro`. `who-logo-white.png` and `europe-flag.png` only from `Footer.astro`. `avatar-empty.png` is referenced from data + tests and stays in `public/`.

- **[Risk] `downloadOfficeImage` returning a richer object (`{ src, width, height }`) breaks any other consumers.**
  → _Mitigation:_ grep confirms only `about.astro` consumes its return value. Update the call site in lockstep with the function signature change.

- **[Risk] Astro `<Image />` requires `sharp`, which is a dev dependency installed by Astro itself — but the build environment must support it.**
  → _Mitigation:_ The site already uses `<Image />` in `src/pages/methods.astro`, so this is already known to work.
