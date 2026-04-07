## 1. Move layout chrome assets into `src/assets/`

- [x] 1.1 [FE] Create `src/assets/layout/` and move `who-logo-blue.png`, `who-logo-white.png`, `uhcw-home-logo.png`, and `europe-flag.png` from `public/images/` into it. Verify with `grep` that no other code references the old paths before deleting the originals from `public/images/`.
- [x] 1.2 [FE] If any reference to those filenames exists outside `Header.astro` and `Footer.astro` (e.g., markdown content, tests, fixtures), update it before the move so nothing 404s.

## 2. Refactor `Header.astro` to use Astro `<Image />`

- [x] 2.1 [FE] Import the WHO blue logo and the UHC home logo from `@/assets/layout/...`. Replace the two `<img>` tags with `<Image />` components from `astro:assets`. Set `widths={[100, 150, 200, 300]}` (WHO) and `widths={[130, 180, 260, 360]}` (UHC) to cover the responsive CSS rules already in the `<style>` block. Set `sizes` to mirror the `@media (max-width: 600px)` rule.
- [x] 2.2 [FE] Add `loading="eager"` and `fetchpriority="high"` to the WHO logo `<Image />`. Add `decoding="async"` to both.
- [x] 2.3 [FE] Verify with `yarn build` that `dist/_astro/` contains the optimized hashed assets and that `dist/index.html`/`dist/about/index.html` reference them via `srcset`.

## 3. Refactor `Footer.astro` to use Astro `<Image />` and remove DOM duplication

- [x] 3.1 [FE] Import the WHO white logo and the EU flag from `@/assets/layout/...`. Replace the four `<img>` tags (two desktop, two mobile) with **two** `<Image />` components total — one per logical image — and use CSS Grid `grid-area` (or equivalent) to position them correctly across desktop and mobile breakpoints. The `.desktop-footer` / `.mobile-footer` CSS toggles for the rest of the footer content can stay as-is; only the image elements are deduplicated.
- [x] 3.2 [FE] If 3.1's CSS-only repositioning conflicts with the existing grid layout in a way that requires significant restructuring, fall back to wrapping the inactive variant's images in `<template>` tags (so they are present in source but not in the live DOM and thus not downloaded). Document the fallback choice in a code comment. _(N/A — used the lifted shared-logos row instead.)_
- [x] 3.3 [FE] Set `widths={[100, 150, 200, 300]}` for the WHO white logo and `widths={[60, 80, 100, 200]}` for the EU flag, mirroring the existing responsive CSS.
- [x] 3.4 [FE] Add `loading="lazy"` and `decoding="async"` to both footer `<Image />` components (the footer is below the fold).

## 4. Fix `PersonCardReact.tsx` avatar attributes

- [x] 4.1 [FE] Add `width={200} height={200} loading="lazy" decoding="async"` to the `<img className="person-card-image">` in `src/islands/about/PersonCardReact.tsx`. Match the existing `PersonCard.astro` exactly.
- [x] 4.2 [FE] Update `src/islands/about/__tests__/PersonCardReact.test.tsx` to assert the new attributes are present.

## 5. Prioritize the about-page office hero image

- [x] 5.1 [FE] In `src/data/about/about-images.ts`, change `downloadOfficeImage` to return `{ src: string, width: number, height: number }` instead of `string`. Read the dimensions from `sharp`'s output metadata after the resize step in `image-downloader.ts` (extend `downloadImages` / `ImageMap` if needed to carry width/height alongside the path, or compute it inline in `downloadOfficeImage` by re-reading the written file's metadata).
- [x] 5.2 [FE] In `src/pages/about.astro`, update the destructure of `downloadOfficeImage(...)` to capture the new shape and pass `officeImage`, `officeImageWidth`, `officeImageHeight` to `OfficeHeader`.
- [x] 5.3 [FE] In `src/components/about/OfficeHeader.astro`: add `width`/`height` props, render them on the `<img>`, swap `loading="lazy"` for `loading="eager"`, and add `fetchpriority="high" decoding="async"`.
- [x] 5.4 [FE] After 5.1–5.3, re-run a Chrome DevTools trace against `/about` (production build) and confirm the LCP element is now the office image (not the header WHO logo) and that LCP timing has not regressed. _LCP element now `IMG e4c301488b8a.webp alt="WHO Barcelona Office"`. LCP 175ms → 111ms. CLS 0.06 → 0.00._

## 6. Verification

- [x] 6.1 [FE] Run `yarn build && yarn preview` and re-run the Chrome DevTools performance trace from the proposal against `/about` and `/methods` (production build, not dev). Confirm:
  - Total layout-image payload (WHO + UHC + EU flag) drops from ~360 KB to ≤ ~30 KB. _Largest WHO logo variant served at 150px is 4–12 KB webp; UHC 2–7 KB; flag <2 KB. ~360 KB → ~25 KB._
  - The footer renders exactly one `<img>` per logical image (no `0×0` duplicates). _Verified — `who-logo-white` count = 1, `europe-flag` count = 1._
  - On `/about`, the LCP element is now the office image (not the header WHO logo). _Confirmed via PerformanceObserver — LCP element is `<img alt="WHO Barcelona Office">`._
  - LCP and CLS for both pages are equal to or better than the baseline in `proposal.md`. _/about: LCP 175→111ms, CLS 0.06→0.00. /methods: LCP 102→91ms, CLS 0→0._
- [x] 6.2 [FE] Run the `visual-compare` skill against `/about` and `/methods` at desktop, tablet, and mobile viewports. Visual output MUST be unchanged from the React SPA baseline. _Verified at 1440/960/375 — all match._
- [x] 6.3 [FE] Run `yarn lint`, `yarn astro check`, and `yarn test` and ensure all pass. _eslint clean; astro check 0 errors/0 warnings; vitest 56 passed._

## 7. Spec & docs

- [x] 7.1 [FE] Confirm the modified spec deltas under `openspec/changes/performance-fixes-layout-about-methods/specs/` accurately reflect the implemented behavior. Adjust if implementation diverged. _Reviewed — specs match implementation. `image-downloader.ts` was not modified after all (dimensions read inline in `downloadOfficeImage` via `sharp(filePath).metadata()`)._
- [x] 7.2 [CR] Self-review the diff before opening a PR. The change should touch only `Header.astro`, `Footer.astro`, `PersonCardReact.tsx` + its test, `OfficeHeader.astro`, `about-images.ts` (and possibly `image-downloader.ts`), `about.astro`, and the asset moves under `src/assets/layout/` and `public/images/`. _Diff scope confirmed: 7 source files modified, 4 PNGs deleted from public/images, 4 added under src/assets/layout. No stray edits._
