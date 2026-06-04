## Context

The About and Methods pages validated the SSG pipeline and the React island pattern. The home page is structurally different from both: it is section-based (not content-block-based), features a full-viewport interactive Mapbox GL map as its hero, and has a completely different mobile layout (2-column card grid vs. linear section flow). The SPA switches between `DesktopHomePage` and `MobileHomePage` at the component level using `useIsSmallScreen()`.

The map is the most complex interactive element in the entire application. It depends on Mapbox GL JS, 12 pin icon SVGs, country GeoJSON data, and three overlay panels (`HomePagePanel`, `CountryPanel`, `RegionMapPanel`). These panels transitively depend on `useAnalytics()` which calls `useAppContext()` — a React context that doesn't exist in Astro.

The six content sections below the map (explorers, analysis, methods, resources, newsletter, dividers) are purely presentational — they receive text/links from DHIS2 and render colored column layouts with bubble pattern decorations. These can be fully static.

**Current state:** No `index.astro` exists. The shared composition root already exposes `home.getPageContent`, `resources.get`, and `country.get` for build-time use. The Astro analytics client (`src/infra/analytics.client.ts`) provides browser-side analytics without `useAppContext`.

## Goals / Non-Goals

**Goals:**

- Render `/` as a static Astro page with real DHIS2 content baked in at build time.
- Achieve visual parity with the React SPA home page at desktop and mobile viewports.
- Ship the map as a React island wrapping Mapbox GL directly (a purpose-built `MapView`), with the SPA's side-panel components reused for parity.
- Ship zero JS for all static sections (explorers, analysis, methods, newsletter, dividers).
- Pre-compute all data at build time — zero runtime API calls for content sections.
- Render resources at build time with images, titles, dates, and tags.
- Implement responsive mobile layout using CSS media queries for static sections and island props for the map.

**Non-Goals:**

- Rewriting HomePagePanel, CountryPanel, or their dependency chains.
- Full mobile parity for carousels — ResourcesCarousel and news carousel depend on Swiper and SPA routing; defer to a follow-up.
- Analytics event tracking on resource card clicks (analytics integration for resource clicks requires the SPA routing context; link-level tracking is sufficient for POC).
- Content Collections / Zod schema validation (planned follow-up).
- i18n — hardcode English strings for the POC.
- The "Regional overview" mobile popup dialog (depends on `generalContent.regionalPageMobilePopUp` and `PopUp` component with SPA context).

## Decisions

### 1. Four-zone rendering: map island + static sections + resources + newsletter

**Choice:** Split the home page into distinct rendering zones:
- **Map section** — React island (`client:only="react"`): Mapbox GL map with panels and controls.
- **Content sections** (explorers, analysis, methods) — pure Astro components: static HTML with scoped CSS.
- **Resources section** — pure Astro: static cards with build-time data. No interactivity beyond links.
- **Newsletter button** — pure Astro: fixed-position styled link.

**Alternatives considered:**
- Entire page as a React island → ships all of MUI + styled-components + Mapbox GL for every section. Defeats SSG.
- Static map with an image fallback → loses the core interactive experience (country hover, panels, zoom).
- Resources as a React island for analytics tracking → unnecessary JS for what are essentially link cards.

**Rationale:** Only the map requires client-side interactivity (marker hover, country selection, zoom). Everything else is static content with links. This minimizes shipped JS to only Mapbox GL + the map's React component tree.

### 2. Map island: purpose-built `MapView` + reused SPA panels + analytics adapter

**Choice:** Create two components in `src/islands/home/`:
- `HomeMap.tsx` — the React island entry point. Receives pre-computed `markers` (GeoJSON), `homePagePanelContent`, and `initialData` as serialized props. Manages `selectedCountry` state internally (the same logic as `useHomePageMap`). Wraps its tree in `StylesProvider injectFirst` + `MuiThemeProvider` (SPA `muiTheme`) so the reused panels render correctly, and provides a minimal `AppContext` adapter that supplies analytics through `src/infra/analytics.client.ts` so the panels' transitive `useAnalytics()` hook resolves.
- `MapView.tsx` — a purpose-built Mapbox GL wrapper. Instantiates `new mapboxgl.Map`, renders GeoJSON features as DOM markers with status-based CSS classes, wires `mouseenter` to select a country and `mouseleave` on the container to clear it, and exposes plain-HTML zoom buttons. The SPA's `HomePagePanel`/`CountryPanel` is rendered as its `children` inside a `.map-side-panel`.

**Why not import the SPA's `Map.tsx`:** An earlier iteration imported `../src/webapp/components/home/map/Map.tsx` directly. It caused several concrete problems in the Astro/Vite build and island boundary:

- `Map.tsx` depends on `require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker")` — a webpack-only loader. Vite cannot resolve it, and replacements (`mapbox-gl-csp-worker` via ESM, `?worker` imports) pulled in worker chunks that were re-fetched at runtime and had CSP implications.
- The SPA's `Map.tsx` uses `styled-components` for styled SVG URLs and MUI `Fab` + `Tooltip` for zoom controls. Both dragged the MUI v4 + `emotion`/`styled-components` surface into the island's bundle twice (once for the map, once for the panels), inflating the hot-path payload substantially.
- The marker rendering path tied markers to React refs in a way that rebroke on every re-render triggered by the Astro island's prop identity. Upstream fixes would have diverged `Map.tsx` from the SPA version — defeating the reuse goal.

A direct `mapbox-gl` wrapper sidesteps all three. It is ~100 lines, fully typed, and consumes the same `FeatureCollection<Point, Country>` and marker CSS classes as the SPA. Region pages, when they are ported, can reuse `MapView` rather than trying to reuse `Map.tsx`.

**What we still reuse from the SPA:**
- `HomePagePanel` and `CountryPanel` — the side-panel components. Rendered as `children` of `MapView`.
- `fullStyle` — the Mapbox style object (`src/webapp/components/home/map/style.ts`).
- `countriesToGeoJson()` — the GeoJSON transformer, called at build time in `home-data.ts`.
- `muiTheme` — the MUI v4 theme object used for panel typography.

**Alternatives considered:**
- Import `Map.tsx` from the SPA → see above.
- Import `DesktopHomePage` directly → pulls in all sections and every MUI/styled-components surface for every section.
- Skip the SPA panels entirely → loses critical UX (the map is meaningless without the side panel explaining what countries represent) and would require re-implementing two more components.
- Mock `useAnalytics` to no-op → loses analytics data. The Astro analytics client already exists and works.

**Rationale:** The map wrapper is a small, isolated piece of code; the panels are large, content-rich components. Reuse the large parts (panels), rewrite the small bridge (`MapView`) against the build system we actually have. The minimal `AppContext` adapter supplies only what `useAnalytics` consumes (`compositionRoot.googleAnalytics.sendPageView`/`sendEvent`), delegating to the Astro analytics client.

### 3. `client:only="react"` for the map island

**Choice:** Use `client:only="react"` instead of `client:visible` or `client:load`.

**Alternatives considered:**
- `client:visible` → SSR would attempt to render Mapbox GL, which requires `window` and `document`. Build would fail.
- `client:load` → also attempts SSR first.

**Rationale:** Mapbox GL requires browser APIs. `client:only="react"` skips SSR entirely. Since the map is the hero section (above the fold), there's no lazy-loading benefit from `client:visible` anyway — it needs to load immediately. The container has a CSS `min-height: 80vh` to prevent layout shift before hydration.

### 4. Pre-compute GeoJSON markers and content at build time

**Choice:** In `src/data/home/home-data.ts`:
1. Fetch `HomePageContent` via `compositionRoot.home.getPageContent.execute()`.
2. Fetch countries via `compositionRoot.country.get.execute()`.
3. Filter countries with summary data and transform to GeoJSON using the existing `countriesToGeoJson()` utility.
4. Fetch resources via `compositionRoot.resources.get.execute({ isFavouriteHome: true })`.
5. Apply resource deduplication and sorting logic (same as `useHomeResources`).
6. Return all data as serializable objects for use in Astro frontmatter and island props.

**Alternatives considered:**
- Fetch data client-side in the island → defeats SSG, adds loading spinners, hurts SEO.
- Only pre-compute content, fetch map data client-side → splits data fetching across two modes unnecessarily.

**Rationale:** All data sources are available via the shared composition root at build time. Pre-computing everything means the page is fully rendered on first paint (except the map canvas which needs Mapbox GL JS). The GeoJSON markers are pure data — serializable as JSON props to the island.

### 5. Static content sections as Astro components

**Choice:** Create individual Astro components matching the SPA structure:
- `SectionHeader.astro` — reusable header with optional bubble SVG decoration, subtitle, link.
- `Explorers.astro` — two-column layout (Indicator orange, Policy blue).
- `AnalysisSection.astro` — two-column layout (Regional dark blue, Countries green).
- `MethodsSection.astro` — three-column layout (green gradient, orange, blue).
- `SectionDivider.astro` — orange gradient divider bar (20px height).
- `NewsletterButton.astro` — fixed-position floating link button.

Each receives its content slice as props from the page frontmatter.

**Alternatives considered:**
- One big `index.astro` with all HTML inline → unmaintainable, can't reuse section header pattern.
- React components for content sections → ships unnecessary JS.

**Rationale:** Astro components produce zero JS. The section pattern (header + colored columns + divider) repeats across explorers, analysis, and methods — a shared `SectionHeader.astro` avoids duplication. Each section is self-contained with scoped CSS.

### 6. Resources section: static build-time cards

**Choice:** Fetch resources at build time, apply the same deduplication/sorting logic as `useHomeResources`, and render as static Astro HTML. Each resource card shows: image (if available), title, date, and category tag. Cards link to the resource URL directly.

**Alternatives considered:**
- React island for resources → the SPA's `SimpleResourceItem` depends on `useAnalytics` and `useHistory`. Would pull in React router and analytics context.
- Skip resources entirely → loses a significant section of the home page.

**Rationale:** Resource cards are fundamentally links with metadata. The interactivity in the SPA (tag click → navigate to category, analytics tracking) can be replaced with plain `<a>` tags. For the POC, direct links to resource URLs are sufficient. Analytics for individual resource clicks can be added later with the Astro analytics client.

### 7. Mobile layout via CSS media queries + responsive island props

**Choice:** For static sections: use CSS media queries to switch between desktop multi-column and mobile stacked layouts. Hide desktop-only elements (bubble decorations, section headers with complex positioning) and show mobile-specific elements (card grid) via `display: none`/`display: block` at breakpoints. For the map island: pass an `isMobile` flag pre-computed from a reasonable breakpoint, but since build time can't know viewport width, default to desktop and let the island detect mobile internally via `matchMedia`.

**Alternatives considered:**
- Two separate pages (desktop/mobile) → code duplication, can't handle dynamic resizing.
- Astro `client:media` directive → only controls when the island loads, not its rendering mode.
- Full mobile parity including carousels → `ResourcesCarousel` depends on Swiper and SPA routing. Out of scope.

**Rationale:** CSS media queries handle responsive layout without JS. The mobile card grid (2-column colored boxes linking to sections) can be rendered as static HTML hidden on desktop. The map island handles its own responsive behavior internally.

### 8. Mobile card grid: static Astro with colored boxes

**Choice:** Render the mobile 2-column card grid as static Astro HTML, hidden on desktop via CSS. Each box is a colored `<a>` linking to the relevant section or page. Boxes use the same color scheme as the SPA: orange (Indicator Explorer), blue (Policy Explorer), dark blue (Regional Overview), green (Countries & Areas, Methods), dark blue (Resources).

The bubble pattern white PNG is used as a positioned background in each box, matching the SPA's mobile layout.

**Alternatives considered:**
- Skip mobile card grid → mobile users lose the navigation overview.
- React island for mobile grid → unnecessary JS for static links.

**Rationale:** The mobile card grid is purely navigational — colored boxes with text and links. No interactivity beyond clicking. Perfect for static Astro.

### 9. Asset handling: copy bubble patterns and map pins

**Choice:**
- Copy `bubble-pattern.svg` and `bubble-pattern-white.png` to `src/assets/`.
- Copy `indicator-explorer.svg` and `policy-explorer.svg` to `src/assets/`.
- Copy all 12 map pin SVGs to `public/assets/map/` for direct URL reference by the Map component (Mapbox GL expects URL strings, not module imports).
- Copy map legend icons to `src/assets/map/` for Astro `<Image>` optimization in the HomePagePanel.

**Alternatives considered:**
- Import from `../src/webapp/assets/` → works but creates fragile cross-project references for static assets.
- Inline all SVGs → some are complex (bubble pattern), and map pins are referenced by URL in Mapbox GL marker configuration.

**Rationale:** Astro's asset pipeline optimizes images in `src/assets/`. Map pins need to be public URLs because Mapbox GL sets them as CSS `background-image` URLs at runtime. Copying into the Astro project makes the dependency explicit.

### 10. SimpleResourceItem: Astro equivalent for resource cards

**Choice:** Create `ResourceCard.astro` — an Astro component that renders the same visual output as `SimpleResourceItem`: image (with aspect ratio), title, date formatted, and category tag. The tag is a link to `/resources/{kind}`. Resource images are referenced via their original URLs (not optimized) since they are external DHIS2-hosted images that may change.

**Alternatives considered:**
- Reuse `SimpleResourceItem` React component → depends on `useAnalytics`, styled-components, and `useHistory`.
- Optimize resource images at build time → resource images are hosted externally and may be updated without rebuilding. Better to reference directly.

**Rationale:** Resource cards are simple HTML (image + text + date + tag link). No interactivity needed. Astro component ships zero JS.

## Data Flow

```
Build time (Astro frontmatter in index.astro):
┌──────────────────────────────────────────────────────────────────┐
│ compositionRoot.home.getPageContent()  → homePageContent         │
│ compositionRoot.resources.get({isFavouriteHome: true}) → items   │
│ compositionRoot.country.get()          → countries[]             │
│ compositionRoot.general.getContent()   → generalContent          │
│                                                                  │
│ ┌─ Transform ──────────────────────────────────────────────────┐ │
│ │ countries.filter(c => c.summary) → countriesToGeoJson()      │ │
│ │   → markers: GeoJSON.FeatureCollection                       │ │
│ │ items → deduplicate + sort → resources[] (max 6)             │ │
│ │ items.filter(news) → news[] (max 6) [mobile only]            │ │
│ └──────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
        │              │              │              │
        ▼              ▼              ▼              ▼
┌──────────────┐ ┌───────────┐ ┌───────────┐ ┌──────────────────┐
│ HomeMap      │ │ Explorers │ │ Analysis  │ │ Methods          │
│ island       │ │ .astro    │ │ .astro    │ │ .astro           │
│ (client:only)│ │ (static)  │ │ (static)  │ │ (static)         │
│              │ │           │ │           │ │                  │
│ props:       │ │ props:    │ │ props:    │ │ props:           │
│  markers     │ │  content. │ │  content. │ │  content.        │
│  panelContent│ │  explorers│ │  analysis │ │  methods         │
│  initialData │ │           │ │           │ │                  │
│              │ │ 0 KB JS   │ │ 0 KB JS   │ │ 0 KB JS          │
│ Client-side: │ └───────────┘ └───────────┘ └──────────────────┘
│  Mapbox GL   │
│  selectedCtry│       ┌───────────┐    ┌──────────────────┐
│  panels      │       │ Resources │    │ Newsletter       │
│  zoom        │       │ .astro    │    │ Button.astro     │
└──────────────┘       │ (static)  │    │ (static)         │
                       │           │    │                  │
                       │ props:    │    │ props:           │
                       │  resources│    │  content.        │
                       │           │    │  newsletter      │
                       │ 0 KB JS   │    │ 0 KB JS          │
                       └───────────┘    └──────────────────┘

Mobile (CSS media query swap):
┌──────────────┐ ┌─────────────────────────────┐
│ HomeMap      │ │ MobileCardGrid.astro        │
│ (shorter)    │ │ (static, hidden on desktop) │
│              │ │                             │
│ 50vh height  │ │ 2-col grid of colored boxes │
│ via CSS      │ │ linking to sections/pages   │
└──────────────┘ └─────────────────────────────┘
```

## Risks / Trade-offs

- **Map island pulls in Mapbox GL + MUI + panel dependencies** → `MapView` itself only adds `mapbox-gl`. The reused `HomePagePanel`/`CountryPanel` add `ReactMarkdown`, MUI v4 Typography, and styled-components. This is still a significant JS bundle for the hero section, but it is smaller than the original plan (which would have added MUI `Fab`/`Tooltip` from `Map.tsx` and a worker chunk). **Mitigation:** Acceptable for POC. Track bundle size; a future phase can fork the panels into Astro-native components if the cost is too high.

- **`useAnalytics` dependency in panels requires AppContext adapter** → `HomePagePanel` and `CountryPanel` use `useAnalytics()` which calls `useAppContext()`. **Mitigation (implemented):** The island wraps its tree in `AppContext.Provider` supplying only `compositionRoot.googleAnalytics.sendPageView` / `sendEvent`, delegating to `src/infra/analytics.client.ts`. Other `AppContextState` fields are either typed-through-casts (`api`, `currentUser`) or provided as empty arrays (`countries`, `themes`, …). The panels are known to read only the analytics slice; the adapter's lie to TypeScript is the tradeoff, revisited if a panel ever reads a non-analytics field.

- **`client:only` means no SSR for the map** → The map section (80vh, above the fold) is blank until JS loads. This is a meaningful first-paint delay. **Mitigation:** CSS `min-height: 80vh` on the container prevents layout shift. A subtle loading skeleton (gradient background matching the map's ocean color `#a3cbe4`) provides visual continuity. The map is inherently JS-dependent (WebGL canvas), so there's no static HTML alternative.

- **Mapbox GL `workerClass` webpack-specific hack (avoided)** → The SPA's `Map.tsx` uses `require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker")`, which is webpack-specific and was the first trigger for dropping the reuse approach. **Resolution:** `MapView` uses `mapbox-gl` v2+ directly without `workerClass`, so there is no webpack loader to translate.

- **Resource image URLs may break at runtime** → Resource images are external URLs from DHIS2 that aren't validated at build time. **Mitigation:** Use `<img>` with a CSS fallback (gradient placeholder) for failed loads. Resources are secondary content below the fold — broken images don't block the page.

- **Mobile carousels deferred** → The SPA's mobile layout includes ResourcesCarousel and news carousel using Swiper. These are deferred to a follow-up. **Mitigation:** Mobile shows the same static resource cards as desktop (stacked single-column). The mobile card grid provides the primary mobile navigation. Carousels are a polish item, not a blocking feature.

- **`mapboxgl.accessToken` is hardcoded** → The Mapbox access token is committed in both the SPA source (`Map.tsx`) and, now, `MapView.tsx`. **Mitigation:** For the POC, reuse the same token. A follow-up should move it to an environment variable and read it from both call sites.

- **Resource deduplication logic duplication** → `useHomeResources` logic is re-implemented in `src/data/home/home-data.ts`. **Mitigation:** The logic is ~20 lines of filter/sort/dedupe. Extract into a shared pure function in `src/domain/` that both the SPA hook and Astro build can call. Same approach used for country tree options in the About page.
