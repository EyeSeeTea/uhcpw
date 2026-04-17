## ADDED Requirements

### Requirement: Map island renders only on desktop
The `HomeMap` island SHALL evaluate `window.matchMedia("(min-width: 960px)")` after hydration and render `null` when `matches` is false. Mapbox GL and the MUI-backed `MapView` / `HomePagePanel` bundles SHALL be lazy-imported only on the desktop branch so that mobile viewports download zero map JavaScript.

#### Scenario: No map JS on mobile
- **WHEN** the viewport is < 960px at hydration
- **THEN** `HomeMap` returns `null`, no Mapbox GL canvas is created, and the lazy `HomeMapDesktop` chunk is never fetched

#### Scenario: Live upgrade to desktop on resize
- **WHEN** the viewport crosses from < 960px to ≥ 960px at runtime
- **THEN** `HomeMap` lazy-loads `HomeMapDesktop` and mounts the interactive map

### Requirement: Mobile map section uses a static image backdrop
On mobile, `index.astro` SHALL render a static image (`src/assets/mapbox-map-background.png`, exported from the SPA's Mapbox view) inside `.map-section` via Astro's `<Image>` component with `widths={[480, 768, 960]}` and `sizes="(max-width: 959px) 100vw, 0px"`. The image SHALL be `position: absolute; inset: 0; object-fit: cover` and visible only below 960px.

#### Scenario: Static map backdrop on mobile
- **WHEN** the page renders at viewport < 960px
- **THEN** `.mobile-map-static` is `display: block`, covers the map section, and the hydrated `HomeMap` island is absent from the DOM
