## ADDED Requirements

### Requirement: Page location tracking uses pathname
The analytics system SHALL use `window.location.pathname` (instead of `window.location.hash`) to determine the current page location for all analytics events.

#### Scenario: Page view event includes clean path
- **WHEN** a user navigates to `/about` and a page view event is sent
- **THEN** the event's page location is `/about` (not `#/about`)

#### Scenario: Country page view tracks pathname
- **WHEN** a user navigates to `/brazil` and a country page view event is sent
- **THEN** the event's page location is `/brazil`

### Requirement: GA4 configuration compatible with BrowserRouter
The GA4 initialization SHALL be configured for standard pathname-based routing. The `send_page_view` config option SHALL reflect that manual page view tracking is used (explicit `sendPageView()` calls per page component).

#### Scenario: GA4 initializes with correct config
- **WHEN** the GA4 tracking script initializes
- **THEN** `page_location` uses `window.location.pathname` (not `window.location.hash`)

### Requirement: Manual page view calls use pathname
Each page component's `sendPageView()` call SHALL derive page location from `window.location.pathname` combined with `window.location.search`, not from the URL hash.

#### Scenario: sendPageView on indicator-explorer
- **WHEN** IndicatorExplorerPage mounts and calls `sendPageView()`
- **THEN** the tracked location is `/indicator-explorer` plus any query string
