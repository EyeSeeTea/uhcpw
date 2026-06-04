## ADDED Requirements

### Requirement: Map renders as a React island with `client:only="react"`
The map SHALL be rendered as a React island using Astro's `client:only="react"` directive. SSR is skipped because Mapbox GL requires `window`/`document`. The containing section has a CSS `min-height` and an ocean-blue (`#a3cbe4`) background so that the layout is stable before hydration.

#### Scenario: No SSR attempt
- **WHEN** `astro build` emits the home page
- **THEN** the static HTML for the map section contains only the island placeholder and the ocean-blue background, with no Mapbox DOM

#### Scenario: Map container dimensions
- **WHEN** the map section renders on desktop (viewport >= 960px)
- **THEN** the section is `height: 80vh; min-height: 620px`
- **WHEN** the viewport is < 960px
- **THEN** the section is `height: 50vh` with min-height reductions at 550px and 500px breakpoints

### Requirement: Pre-computed GeoJSON markers rendered on the map
The island SHALL receive markers as a serialized GeoJSON `FeatureCollection<Point, Country>` prop. On map load, each feature SHALL be rendered as a DOM marker whose CSS class encodes the country's `FinancialProtectionStatus` (`marker marker-<status>`), and a `mouseenter` listener on each marker SHALL set the currently selected country.

#### Scenario: Marker CSS class per status
- **WHEN** a feature's `properties.status` is `"Strong"`
- **THEN** its marker element has classes `marker marker-strong`

#### Scenario: Marker hover selects country
- **WHEN** the user hovers a marker
- **THEN** the side panel switches from the default `HomePagePanel` to a `CountryPanel` for that country

#### Scenario: Leaving the map clears the selection
- **WHEN** the pointer leaves the map container
- **THEN** the side panel returns to `HomePagePanel`

### Requirement: Purpose-built MapView component (not SPA `Map.tsx`)
The island SHALL use a purpose-built `MapView` React component that instantiates `mapbox-gl` directly. The SPA's `Map.tsx` SHALL NOT be imported because it depends on webpack-specific loaders (`worker-loader!…`), styled-components SVG URLs, and MUI `Fab`/`Tooltip` zoom controls that are incompatible with the Astro/Vite build and inflate the island's JS payload.

#### Scenario: Zoom controls
- **WHEN** the map renders on desktop
- **THEN** `+` and `−` plain-HTML buttons positioned at the top-right of the map fly the camera to `zoom * 1.25` and `zoom * 0.8` respectively
- **WHEN** the viewport is < 960px
- **THEN** the zoom controls are hidden

### Requirement: Side panel reuses SPA `HomePagePanel` and `CountryPanel`
The island SHALL reuse the SPA's `HomePagePanel` and `CountryPanel` components as the map side panel. `HomePagePanel` is the default; `CountryPanel` replaces it while a country is selected.

#### Scenario: Default panel is HomePagePanel
- **WHEN** the island mounts with no selected country
- **THEN** the side panel renders `HomePagePanel` with the `mainMapPanel` content from `HomePageContent`

#### Scenario: CountryPanel on selection
- **WHEN** a country is selected
- **THEN** the side panel renders `CountryPanel` for that country, replacing `HomePagePanel`

### Requirement: Minimal `AppContext` adapter for panel analytics
The island SHALL provide a minimal `AppContext` value so that the panels' transitive `useAnalytics()` calls resolve. The adapter supplies `compositionRoot.googleAnalytics.sendPageView` and `sendEvent` by delegating to the Astro analytics client (`src/infra/analytics.client.ts`). Non-analytics `AppContextState` fields used by other SPA screens are absent; the panels must not read them.

#### Scenario: Analytics events fire through the Astro client
- **WHEN** a panel triggers an analytics event via `useAnalytics()`
- **THEN** the event is forwarded to the Astro analytics client, matching the mechanism used by other Astro pages

### Requirement: Mapbox Material-UI theme for panel typography
The island SHALL wrap its tree in `StylesProvider injectFirst` and `MuiThemeProvider` supplying the SPA's `muiTheme`, so that the reused panels' MUI `Typography` renders with the same fonts and colors as in the SPA.

#### Scenario: Panel typography matches SPA
- **WHEN** `HomePagePanel` or `CountryPanel` renders inside the island
- **THEN** its MUI `Typography` elements use the fonts, sizes, and colors defined by the SPA's `muiTheme`
