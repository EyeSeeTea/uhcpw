## ADDED Requirements

### Requirement: Map island detects mobile breakpoint at hydration
The `HomeMap` island SHALL evaluate `window.matchMedia("(max-width: 959px)")` at hydration and subscribe to its `change` event. Its current `matches` value drives an `isMobile` flag passed to both `MapView` and `HomePagePanel`.

#### Scenario: Live update on viewport resize
- **WHEN** the viewport crosses the 959px boundary at runtime
- **THEN** the `isMobile` flag flips and the panel re-renders into the corresponding desktop or mobile variant

### Requirement: Mobile map omits markers and the marker hover wiring
When `isMobile` is true, `MapView` SHALL NOT iterate `markers.features`, attach `mouseenter` listeners, or attach the container `mouseleave` clear handler. The map renders as a static decorative backdrop with no marker DOM and no country selection.

#### Scenario: No markers in the mobile DOM
- **WHEN** the island hydrates at viewport < 960px
- **THEN** the `.map-canvas-container` contains zero `.marker` elements

#### Scenario: Side panel never switches to CountryPanel on mobile
- **WHEN** the user interacts with the map on mobile
- **THEN** the side panel always renders `HomePagePanel`, never `CountryPanel`

### Requirement: Mobile side panel hides title, hides legend, embeds video iframe
On mobile, `HomePagePanel` SHALL receive `isMobile={true}` so that its built-in branches (1) hide the `<h2>` title, (2) hide the umbrella legend (`UmbrellaItemsContainer`), and (3) render the YouTube `<iframe>` (sourced from `mainPanelContent.videoLink`) instead of the desktop "UHC watch video!" pill button.

#### Scenario: Mobile panel content
- **WHEN** the island hydrates at viewport < 960px and `mainPanelContent.videoLink` is defined
- **THEN** the panel renders the description text and a YouTube `<iframe>` (no `<h2>` title, no legend, no `VideoLink` pill)
