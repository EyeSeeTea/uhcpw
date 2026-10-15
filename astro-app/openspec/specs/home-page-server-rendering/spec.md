## Purpose

Define which Astro homepage content is generated as initial HTML and which behavior remains client-side, while preserving visual and functional parity with the React SPA.

## Requirements

### Requirement: Home page content is available in the initial HTML
The Astro home page SHALL render all non-interactive home-page content into its generated HTML, including the default hero title and description, desktop hero legend and link content, section content, mobile navigation cards, and resource/news slide content. The title SHALL remain a single `<h1>` and follow the SPA's responsive visibility. Content SHALL NOT depend on client-side JavaScript to be inserted into the live document.

#### Scenario: Hero content is present before hydration
- **WHEN** the generated `/index.html` is inspected before JavaScript runs
- **THEN** it contains the CMS hero title as a single `<h1>` and the rendered hero description
- **AND** the title is visible at the same viewport sizes as in the SPA
- **AND** the generated page contains no duplicate hero heading

#### Scenario: Hero content remains available without JavaScript
- **WHEN** a visitor loads the home page with JavaScript disabled
- **THEN** the default hero title and description remain in the page with the same responsive visibility as the SPA
- **AND** the hero's static content is not trapped in a `<template>` awaiting script insertion

#### Scenario: Resource and news content is server-rendered
- **WHEN** the generated `/index.html` is inspected before island hydration
- **THEN** available resource and news items appear as HTML content
- **AND** carousel scrolling and dot selection remain interactive when client behavior loads

### Requirement: Client-only behavior is limited to browser interactions
The Astro home page SHALL keep Mapbox rendering and controls, marker selection, selected-country panel updates, carousel controls, and YouTube playback in browser-side behavior. Server generation SHALL NOT attempt to instantiate Mapbox GL or a live YouTube player.

#### Scenario: Map remains browser-rendered
- **WHEN** the home page is built
- **THEN** the generated HTML contains no Mapbox canvas or runtime map DOM
- **AND** the map island initializes the map in the browser with the existing markers and controls

#### Scenario: Country selection updates the existing side panel
- **WHEN** a visitor hovers a country marker
- **THEN** the country-specific panel appears in the same side-panel area as the default hero panel
- **AND** when the pointer leaves the map, the default hero panel is visible again

#### Scenario: Desktop does not instantiate YouTube content
- **WHEN** the live home page is loaded at a viewport width of 960px or wider
- **THEN** no YouTube custom element or player iframe is present in the live DOM
- **AND** no request is made to a YouTube-owned host

#### Scenario: Mobile video keeps deferred playback
- **WHEN** a visitor loads the page at a viewport width below 960px with a configured video link
- **THEN** the mobile YouTube facade appears in the hero
- **AND** the player iframe is created only after activation of the facade

### Requirement: Astro home page preserves SPA visual parity
The Astro home page SHALL preserve the existing SPA's visible homepage content and presentation at desktop, tablet, and mobile viewport sizes. Server-rendering SHALL NOT change text, order, responsive visibility, breakpoint behavior, colors, typography, spacing, panel dimensions, assets, links, or interaction outcomes.

#### Scenario: Desktop layout parity
- **WHEN** the SPA and Astro home page are viewed at the same desktop viewport width of 960px or wider with equivalent content
- **THEN** their visible default hero panel, map area, page sections, and controls match in layout and styling

#### Scenario: Mobile layout parity
- **WHEN** the SPA and Astro home page are viewed at the same mobile viewport width below 960px with equivalent content
- **THEN** their visible hero, mobile card grid, resources/news presentation, and controls match in layout and styling

#### Scenario: Hydration does not duplicate or move the default panel
- **WHEN** client behavior initializes on the Astro home page with no country selected
- **THEN** the hero title and description appear once and remain in the same side-panel position
- **AND** hydration causes no visible flash or layout shift in the default panel
