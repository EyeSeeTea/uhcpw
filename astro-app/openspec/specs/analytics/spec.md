# analytics Specification

## Purpose
TBD - created by archiving change analytics. Update Purpose after archive.
## Requirements
### Requirement: Google Analytics 4 loads on every page

The Astro site SHALL include the Google Analytics 4 (`gtag.js`) loader and bootstrap snippet in the `<head>` of the shared base layout, so that every page served by the site initializes GA4 before first paint.

#### Scenario: gtag loader present in rendered HTML
- **WHEN** any page built by Astro is served
- **THEN** the rendered HTML `<head>` contains a `<script>` tag whose `src` matches `https://www.googletagmanager.com/gtag/js?id=<tag-id>`
- **AND** the rendered HTML `<head>` contains an inline script that defines `window.dataLayer`, defines `window.gtag`, and calls `gtag('config', '<tag-id>')`

#### Scenario: gtag is available before islands hydrate
- **WHEN** a React island hydrates on any page
- **THEN** `typeof window.gtag === "function"` is true at the moment the island's mount code runs

### Requirement: Tag ID is selected by build mode

The base layout SHALL select the Google Analytics tag ID based on the Astro build mode, using `G-NMLFDE4DY7` for production builds and `G-5DKB563RGC` for non-production (dev/preview) builds. These IDs SHALL match the SPA's `appConfig.gaTagId` values.

#### Scenario: Production build uses production tag
- **WHEN** the site is built with `astro build` (production)
- **THEN** the `<script src>` and inline `gtag('config', ...)` call both reference `G-NMLFDE4DY7`

#### Scenario: Dev server uses dev tag
- **WHEN** the site is served with `astro dev`
- **THEN** the `<script src>` and inline `gtag('config', ...)` call both reference `G-5DKB563RGC`

### Requirement: One page_view per page navigation

Each full page navigation SHALL result in exactly one `page_view` event being sent to GA4 for the visited URL.

#### Scenario: Initial page load emits one page_view
- **WHEN** a user loads any page in the Astro site
- **THEN** exactly one `page_view` event is recorded in GA4 with `page_location` equal to the current URL and `page_title` equal to the document title

#### Scenario: Client-side navigation between Astro pages
- **WHEN** a user clicks an internal link and the browser performs a full document navigation to another Astro page
- **THEN** exactly one new `page_view` event is recorded for the destination page
- **AND** no duplicate `page_view` is recorded for the source page

### Requirement: Custom events reuse the SPA analytics use case

React islands in the Astro site SHALL emit custom analytics events by calling the same `SendEventUseCase` and `GoogleAnalyticsRepository` used by the React SPA, imported via the `@shared/*` path aliases. The Astro site SHALL NOT define a parallel analytics repository or duplicate the event-shape switch.

#### Scenario: Reused use case is the only sender
- **WHEN** a React island needs to emit a custom analytics event
- **THEN** it does so exclusively by calling `getAnalytics().sendEvent(...)` from `@/infra/analytics.client`, which delegates to `SendEventUseCase` → `GoogleAnalyticsRepository`, rather than calling `window.gtag` directly

#### Scenario: Shared repository import resolves
- **WHEN** the analytics client module imports `GoogleAnalyticsRepository` from `@shared/data/repositories/GoogleAnalyticsRepository`
- **THEN** `astro check` resolves the import without type errors and the build succeeds

### Requirement: Client-side analytics composition root

The Astro site SHALL provide a single client-only module that constructs `GoogleAnalyticsRepository`, wraps it in `SendEventUseCase` (and `SendPageViewUseCase` if needed by future changes), and exposes a singleton accessor. This module SHALL be the sole entry point used by React islands to emit analytics events.

#### Scenario: Singleton is reused across calls
- **WHEN** the analytics accessor is called more than once during a single page lifetime
- **THEN** the same `GoogleAnalyticsRepository` instance is returned each time

#### Scenario: Module is client-only
- **WHEN** the analytics client module is imported from any `.astro` file's frontmatter (server context)
- **THEN** the build SHALL fail or the module SHALL be tree-shaken out of the server bundle, ensuring no `localStorage`/`document` access occurs at build time

### Requirement: Event taxonomy matches the SPA

When a React island in the Astro site emits an analytics event, the event name and parameter shape SHALL be identical to the corresponding event emitted by the React SPA, as defined by the `AnalyticsEvent` discriminated union and the `buildAnalyticsEvent` switch in `GoogleAnalyticsRepository`.

#### Scenario: file_download from a ported island
- **WHEN** a React island ported to Astro triggers a file download analogous to the SPA's Policy Explorer / chart export / screenshot flows
- **THEN** the island calls `sendEvent({ name: "file_download", pageTitle, contentType, contentGroup, contentId })`
- **AND** GA4 receives an event named `file_download` with parameters `page_title`, `content_type`, `content_group`, and `content_id`

#### Scenario: external_link click
- **WHEN** a user clicks an external link tracked by a ported island
- **THEN** the island calls `sendEvent({ name: "external_link", href, text })`
- **AND** GA4 receives an event named `external_link` with parameters `href` and `text`

