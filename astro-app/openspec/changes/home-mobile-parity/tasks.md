## 1. Map mobile variant

- [x] 1.1 [FE] Add `isMobile` state to `HomeMap.tsx` driven by `matchMedia("(max-width: 959px)")`, subscribed to the `change` event for live updates
- [x] 1.2 [FE] Pass `isMobile` from `HomeMap` to `MapView` and to `HomePagePanel`
- [x] 1.3 [FE] In `MapView.tsx`, gate the marker iteration and `mouseleave`-clear handler on `!isMobile`
- [x] 1.4 [FE] Verify in the browser at 390px: no markers, no "UHC watch" `<h2>`, no umbrella legend, YouTube `<iframe>` rendered in the panel

## 2. Mobile box-grid parity

- [x] 2.1 [FE] In `MobileCardGrid.astro`, add `max-width: none` to the `.bubble-img` selector so the bubble PNG renders at its natural aspect ratio (`width: auto; height: 100%`)
- [x] 2.2 [FE] Bump small-box `min-height` and big-box content spacing to match the SPA's effective box heights (target 58px small, 188px big at 390px viewport, ±2px)
- [x] 2.3 [FE] Verify visually at 390px and 360px that small and big boxes match SPA heights and the dotted bubble pattern is visible inside both big boxes

## 3. News data slice

- [x] 3.1 [FE] In `home-data.ts`, add `buildHomeNews(items)` that filters `kind === "news" && favouriteSection`, orders by `favouriteSectionOrder`, and returns up to 6
- [x] 3.2 [FE] Surface `news: ReadonlyArray<HomeResourceState>` on `HomePageData`; populate it in `getHomePageData`
- [x] 3.3 [FE] Add Vitest tests for `buildHomeNews`: filter by kind, filter by `favouriteSection`, sort by `favouriteSectionOrder`, cap at 6

## 4. Mobile carousel island

- [x] 4.1 [FE] Create `src/islands/home/MobileCarousel.tsx` — CSS scroll-snap track, dot pagination, scroll → active-dot sync via `requestAnimationFrame`, no third-party deps
- [x] 4.2 [FE] Style scoped: gray container background (#E5E5EA, 24px padding), white card slide (border-radius 10px, max-width 500px), tag/year/title styling that matches `SimpleResourceItem`, dots with `colors.darkBlue` active state
- [x] 4.3 [FE] Hide the native scrollbar (`::-webkit-scrollbar { display: none }`, `scrollbar-width: none`)
- [x] 4.4 [FE] Accept `items`, `ariaLabel`, and `hideTag` props; render one `<ResourceSlide>` per item; dot count = item count

## 5. Mobile carousel sections

- [x] 5.1 [FE] Create `src/components/home/MobileResourcesSection.astro` — section title "Resources", renders `<MobileCarousel client:media="(max-width: 959px)">` with the resources items
- [x] 5.2 [FE] Create `src/components/home/MobileNewsSection.astro` — same pattern with `news` data, `hideTag` prop set
- [x] 5.3 [FE] Both sections must be `display: none` at `>= 960px` and `display: block` at `< 960px`
- [x] 5.4 [FE] Update `src/pages/index.astro` to render the two sections after `MobileCardGrid` and before `NewsletterButton`, passing `resources` and `news` from `getHomePageData()`

## 6. Validation

- [x] 6.1 [FE] Visual diff at 390px between Astro and SPA: map panel matches, big-box dotted pattern visible, small-box height ≥ 56px, carousels render with dots
- [ ] 6.2 [FE] Visual diff at 360px and 768px: regressions check
- [ ] 6.3 [FE] Verify `astro build` produces identical desktop HTML for the box grid and map sections
- [x] 6.4 [FE] Run `yarn lint` and `yarn test` — all pass (74/74 tests)
- [ ] 6.5 [CR] Code review: confirm carousel island is dependency-free, no SPA context leaks, desktop bundle unchanged

## 7. Specs

- [x] 7.1 [FE] Update `specs/home-map-island/spec.md` — `isMobile` rendering mode (no markers, no title, no legend, iframe panel)
- [x] 7.2 [FE] Update `specs/home-mobile-layout/spec.md` — remove the no-carousels non-goal; add bubble-pattern aspect-ratio requirement; add box-height parity scenarios; add carousel scenarios
- [x] 7.3 [FE] Update `specs/home-data-fetching/spec.md` — `news` slice derivation alongside `resources`
