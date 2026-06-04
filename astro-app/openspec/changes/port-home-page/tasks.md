## 1. Assets & Configuration

- [x] 1.1 [FE] Copy `bubble-pattern.svg` and `bubble-pattern-white.png` from `../src/webapp/assets/` to `src/assets/`
- [x] 1.2 [FE] Copy `indicator-explorer.svg` and `policy-explorer.svg` from `../src/webapp/assets/` to `src/assets/`
- [x] 1.3 [FE] Copy all 12 map pin SVGs (`pin-*.svg`) from `../src/webapp/assets/map/` to `public/assets/map/` for runtime URL reference by Mapbox GL markers
- [x] 1.4 [FE] Copy map legend icons (`icon-*.svg`) from `../src/webapp/assets/map/` to `src/assets/map/` for Astro `<Image>` use in HomePagePanel
- [x] 1.5 [FE] Verify `mapbox-gl` is in `package.json` dependencies; add if missing. Verify `@types/geojson` is available for TypeScript

## 2. Build-Time Data Layer

- [x] 2.1 [FE] Create `src/data/home/home-data.ts` — export `getHomePageData()` that fetches `homePageContent`, countries, resources, and `generalContent` in parallel via `Promise.all` + `runFuture`
- [x] 2.2 [FE] Implement `buildHomeResources(items, countries, themes)` — apply the same deduplication/priority/sorting logic as `useHomeResources`: filter `isFavouriteHome`, deduplicate by id with priority (`comparative-analysis` > `country-analysis` > `multimedia` > `news`), sort by `favouriteHomeOrder`, limit to 6
- [x] 2.3 [FE] Implement `buildMapMarkers(countries)` — filter countries with summary data, transform to GeoJSON FeatureCollection using the existing `countriesToGeoJson()` utility from `../src/webapp/components/home/map/utils/`
- [x] 2.4 [FE] Add Vitest tests for `buildHomeResources` (deduplication, priority sorting, limit) and `buildMapMarkers` (country filtering, GeoJSON structure)

## 3. Shared Astro Components

- [x] 3.1 [FE] Create `src/components/home/SectionHeader.astro` — centered header with optional subtitle, optional bubble SVG decoration (positioned left or right), and optional link wrapper. Match SPA styles: 150px height with subtitle / 80px without, centered flex layout
- [x] 3.2 [FE] Create `src/components/home/SectionBlock.astro` — title (h4 equivalent) + description text with `font-weight: 300`. Max-width 400px
- [x] 3.3 [FE] Create `src/components/home/SectionDivider.astro` — 20px height bar with `linear-gradient(90deg, #FF9355 1.8%, #FFBC88 100%)` matching the SPA's Divider component

## 4. Explorers Section

- [x] 4.1 [FE] Create `src/components/home/Explorers.astro` — two-column layout (50/50 on desktop, stacked on mobile). Left: Indicator Explorer (`#fe8c4f` orange) with bubble pattern, icon, text, and CTA button. Right: Policy Explorer (`#0089d6` blue) with icon, text, and CTA button
- [x] 4.2 [FE] Style CTA buttons: white background, `accentPrimary` text color, `border-radius: 30px`, `padding: 10px 40px`
- [x] 4.3 [FE] Add scoped responsive CSS: columns stack at `< 960px`, padding adjustments for mobile

## 5. Analysis Section

- [x] 5.1 [FE] Create `src/components/home/AnalysisSection.astro` — two-column layout (50/50). Left: Regional Overview (`#0360a6` dark blue) with bubble pattern, text, and white CTA button. Right: Countries & Areas (`#4fad56` green) with bubble pattern, text, and green CTA button
- [x] 5.2 [FE] Style with `padding: 65px 55px`, positioned bubble pattern images, and responsive stacking at `< 960px`

## 6. Methods Section

- [x] 6.1 [FE] Create `src/components/home/MethodsSection.astro` — three-column layout (33/33/33). Column 1: green gradient (`linear-gradient(90deg, rgba(79,172,86,1) 0%, rgba(161,238,167,1) 100%)`). Column 2: orange (`#fe8c4f`) with bubble pattern. Column 3: blue (`#0360a6`) with bubble pattern
- [x] 6.2 [FE] Each column renders a SectionBlock with title and text from `homePageContent.methods.column1/2/3`
- [x] 6.3 [FE] SectionHeader for methods includes a link wrapper to `content.methods.buttonLink`

## 7. Resources Section

- [x] 7.1 [FE] Create `src/components/home/ResourceCard.astro` — renders resource image (with aspect ratio and fallback), title as link, formatted date, and category tag as link to `/resources/{kind}`
- [x] 7.2 [FE] Create `src/components/home/ResourcesSection.astro` — SectionHeader ("Resources") + 3-column grid of ResourceCard components (stacked single-column on mobile)
- [x] 7.3 [FE] Style resource cards matching SPA: image with `object-fit: cover`, title styling, date in muted color, tag with colored pill background

## 8. Newsletter Button

- [x] 8.1 [FE] Create `src/components/home/NewsletterButton.astro` — fixed-position button at `inset-block-end: 0; inset-inline-end: 20%` with `#ff8d4e` orange background, white text, rounded top corners, box shadow. Links to `content.newsletter.buttonLink` with `target="_blank"`
- [x] 8.2 [FE] Add responsive CSS: adjust `inset-inline-end` to 10% at `< 600px`

## 9. Mobile Card Grid

- [x] 9.1 [FE] Create `src/components/home/MobileCardGrid.astro` — 2-column CSS grid (hidden on desktop via `display: none` at `>= 960px`) with colored card boxes linking to major sections
- [x] 9.2 [FE] Render 6 boxes: Indicator Explorer (orange, large), Policy Explorer (blue, large), Regional Overview (dark blue), Countries & Areas (green), Methods (green), Resources (dark blue). Large boxes span full grid row with icon + description text
- [x] 9.3 [FE] Style with `border-radius: 21px`, bubble pattern white PNG positioned as background, white text, responsive font sizes

## 10. Map Island

- [x] 10.1 [FE] Create `src/islands/home/HomeMap.tsx` — React component receiving `markers` (serialized GeoJSON), `homePagePanelContent`, and `initialData` as props. Manages `selectedCountry` state internally. Wraps its tree in `StylesProvider` + `MuiThemeProvider` (SPA `muiTheme`) so the reused panels render correctly
- [x] 10.2 [FE] Create `src/islands/home/MapView.tsx` — a purpose-built Mapbox GL wrapper (not the SPA's `Map.tsx`, see design §2). Instantiates `new mapboxgl.Map` with `fullStyle`, renders GeoJSON features as DOM markers with status-based CSS classes, wires `mouseenter` on markers to select a country and `mouseleave` on the container to clear, and renders plain-HTML zoom buttons
- [x] 10.3 [FE] Create analytics adapter: wrap the island in `AppContext.Provider` supplying a minimal value with only `compositionRoot.googleAnalytics.sendPageView` / `sendEvent` delegating to the Astro analytics client (`src/infra/analytics.client.ts`), so that `HomePagePanel` and `CountryPanel`'s transitive `useAnalytics()` hook resolves
- [x] 10.4 [FE] Render `HomePagePanel` / `CountryPanel` as `children` of `MapView` so the side-panel swap happens via React state in `HomeMap`, with no import of the SPA's `Map.tsx` (avoiding webpack-only `worker-loader!`, styled-components SVG URLs, and MUI `Fab`/`Tooltip`)
- [x] 10.5 [FE] Add CSS for map container: `height: 80vh; min-height: 620px` on desktop, `height: 50vh` on mobile with responsive min-height reductions. Add a loading skeleton background (`#a3cbe4` ocean blue) to reduce perceived loading time

## 11. Home Page Assembly

- [x] 11.1 [FE] Create `src/pages/index.astro` — frontmatter calls `getHomePageData()`, computes all data needed by sections and island
- [x] 11.2 [FE] Render page structure: Map island (`client:only="react"`) → SectionDivider → Explorers → SectionDivider → Analysis → SectionDivider → Methods → SectionDivider → Resources → NewsletterButton
- [x] 11.3 [FE] Render MobileCardGrid between the map and desktop sections (hidden on desktop)
- [x] 11.4 [FE] Pass serialized props to HomeMap island: pre-computed `markers`, `homePagePanelContent`, `initialData`
- [x] 11.5 [FE] Wrap page in `Layout` component with `seo` from `getSeoConfigForRoute("/")` and `generalContent`

## 12. Validation & Testing

- [x] 12.1 [FE] Run `astro build` and verify `/index.html` contains real DHIS2 data in static sections (explorer titles, analysis text, resource titles)
- [x] 12.2 [FE] Verify map island hydrates and Mapbox GL renders with markers in `astro preview`
- [x] 12.3 [FE] Verify country hover shows CountryPanel with summary data
- [x] 12.4 [FE] Visual comparison with the React SPA home page at desktop (>= 1280px), tablet (768px), and mobile (375px) viewports
- [x] 12.5 [FE] Verify static sections (explorers, analysis, methods, resources, newsletter) contribute zero JS to the bundle
- [x] 12.6 [FE] Run `yarn lint` and `yarn test` — all pass
- [x] 12.7 [CR] Code review: verify island boundary is clean, `MapView` wrapper is solid, no SPA context leaks beyond the analytics adapter

## 13. Specs

- [x] 13.1 [FE] Add `specs/home-page-rendering/spec.md` — section structure, shared header pattern, colored columns (explorers/analysis/methods), newsletter button, dividers, zero-JS requirement for static sections
- [x] 13.2 [FE] Add `specs/home-data-fetching/spec.md` — parallel build-time fetching, resource dedup/priority/sorting, GeoJSON marker filtering, resource image download, fixed initial viewport
- [x] 13.3 [FE] Add `specs/home-map-island/spec.md` — `client:only="react"`, marker rendering with status classes, `HomePagePanel`/`CountryPanel` swap, purpose-built `MapView` (explicitly not SPA `Map.tsx`), minimal `AppContext` analytics adapter
- [x] 13.4 [FE] Add `specs/home-resources-section/spec.md` — grid layout, card contents, zero-JS authoring
- [x] 13.5 [FE] Add `specs/home-mobile-layout/spec.md` — CSS-only breakpoint swap, six navigation boxes, responsive map sizing, scope limits (no carousels, no regional popup)
