## Why

The `port-home-page` change shipped the home page with the SPA's mobile carousels, the SPA's mobile map variant, and the mobile box-grid pixel parity explicitly out of scope. Visual review at 390px showed three concrete gaps against the SPA: (1) the map island still renders the desktop side panel on mobile (markers visible, "UHC watch" title visible, legend icons instead of a YouTube `<iframe>`); (2) the mobile big boxes are missing their bubble-pattern decoration because the global `img { max-width: 100% }` rule squishes the 625×227 PNG; (3) the SPA's Resources and News carousels are absent. This change closes those gaps so that the Astro home page reaches the same mobile UX as the SPA.

## What Changes

- Make `HomeMap` desktop-only: it reads `matchMedia("(min-width: 960px)")` and renders `null` below the breakpoint, lazy-importing `HomeMapDesktop` (Mapbox GL + MUI) only on desktop. Mobile renders a static PNG backdrop (`src/assets/mapbox-map-background.png`, extracted from the SPA's Mapbox view) plus a new `MobileMapHero.astro` component that reproduces the SPA's mobile panel — description + YouTube iframe — over a `#0089d6` overlay at `opacity: 0.9`, with SPA-matching padding (24px outer + 16px inner) and Lato 16px/24px typography.
- Override the global `img { max-width: 100% }` constraint for `.bubble-img` in `MobileCardGrid.astro` so the bubble pattern renders at its natural aspect ratio (`width: auto; height: 100%; max-width: none`). Also tune the small-box `min-height` and big-box content spacing to match the SPA's effective box heights.
- Add a Resources carousel and a News carousel section, rendered only on mobile (`< 960px`), as a small purpose-built React island. The island ships a CSS scroll-snap track with bullet-dot pagination and pointer/touch swipe — no Swiper dependency. Each card reuses the existing `ResourceCard` visual treatment.
- Extend `home-data.ts` to also pre-compute the `news` slice (kind === `news` AND `favouriteSection`, ordered by `favouriteSectionOrder`, capped at 6) so both carousels are fully build-time data.

## Capabilities

### Modified Capabilities

- `home-map-island`: adds an `isMobile` rendering mode that skips marker/hover wiring and switches the side panel to the SPA's mobile variant (no title, no legend, embedded YouTube iframe).
- `home-mobile-layout`: removes the explicit "no carousels" non-goal; the mobile layout now also includes a Resources carousel and a News carousel below the box grid. Adds a bubble-pattern aspect-ratio guarantee.
- `home-data-fetching`: adds the `news` derivation to the build-time orchestrator alongside the existing `resources` slice.

## Impact

- **Components**: New `src/components/home/MobileResourcesSection.astro` (wraps the carousel island for "Resources") and `MobileNewsSection.astro` (for "News"). New island `src/islands/home/MobileCarousel.tsx` (CSS scroll-snap + dots, no third-party deps).
- **Islands**: `HomeMap.tsx` adds an `isMobile` state via `matchMedia`; `MapView.tsx` accepts `isMobile` and skips marker rendering when `true`; the existing `HomePagePanel` `isMobile` prop is now wired through.
- **Styles**: `MobileCardGrid.astro` `.bubble-img { max-width: none; }`. Small/big box `min-height` adjustments. Scoped CSS in the new mobile carousel components.
- **Data**: `home-data.ts` now returns a `news: ReadonlyArray<HomeResourceState>` field alongside `resources`, sorted by `favouriteSectionOrder`. `getHomePageData` adds the news derivation; `index.astro` passes both into the new mobile sections.
- **Pages**: `index.astro` adds the two mobile carousel sections after `MobileCardGrid` and before `NewsletterButton`.
- **Tests**: Vitest tests for the news derivation (filter by kind, sort by `favouriteSectionOrder`, limit 6) added alongside the existing `buildHomeResources` tests.
- **Bundle**: One new island (~3KB) for the mobile carousel; no Swiper / SwipeableViews dependency added.
- **Compatibility**: Desktop renders unchanged — the carousel sections are `display: none` at `>= 960px`, the map island reads `isMobile` lazily so server-emitted HTML is identical.
