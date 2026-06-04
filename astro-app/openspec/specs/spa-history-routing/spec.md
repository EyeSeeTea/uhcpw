# spa-history-routing Specification

## Purpose
TBD - created by archiving change spa-history-api-astro-integration. Update Purpose after archive.
## Requirements
### Requirement: BrowserRouter replaces HashRouter
The SPA SHALL use React Router v5's `BrowserRouter` instead of `HashRouter` so that all application routes use clean URL paths via the History API.

#### Scenario: SPA renders route from pathname
- **WHEN** a user navigates to `/indicator-explorer`
- **THEN** the SPA renders the IndicatorExplorerPage component (not a 404 or blank page)

#### Scenario: Hash-based URLs no longer route
- **WHEN** a user navigates to `/#/indicator-explorer`
- **THEN** the SPA does NOT render IndicatorExplorerPage (the hash fragment is ignored by BrowserRouter)

### Requirement: Configurable basename for sub-path deployment
The SPA SHALL accept a configurable `basename` (via app-config) so it can be deployed under a sub-path like `/dhis2/uhcwatch`. When basename is set, all route matching and link generation SHALL be relative to that base path.

#### Scenario: Routes work under sub-path
- **WHEN** basename is set to `/dhis2/uhcwatch` and a user navigates to `/dhis2/uhcwatch/methods`
- **THEN** the SPA renders the MethodsPage component

#### Scenario: Default basename is root
- **WHEN** no basename is configured
- **THEN** the SPA uses `/` as the basename (local development default)

### Requirement: Programmatic navigation uses History API
All calls to `history.push()` and `history.replace()` SHALL produce clean pathname-based URLs, not hash-based URLs.

#### Scenario: history.push produces clean URL
- **WHEN** SPA code calls `history.push("/resources/news")`
- **THEN** the browser URL changes to `{basename}/resources/news` without a `#` prefix

### Requirement: Query parameters work with BrowserRouter
The `useUpdateSearchParam` hook and any query-string handling SHALL continue to work with BrowserRouter's `location.search`.

#### Scenario: Search params are preserved on navigation
- **WHEN** a user is on `/indicator-explorer?country=BRA` and navigates to change a filter
- **THEN** the URL updates with the new search params in the standard `?key=value` format

### Requirement: SPA dev server supports history fallback
The SPA's development server SHALL serve `index.html` for any route that does not match a static asset, enabling direct URL navigation and page refreshes with BrowserRouter.

#### Scenario: Direct navigation to SPA route
- **WHEN** a developer opens `http://localhost:8081/policy-explorer` directly in the browser
- **THEN** the SPA dev server serves `index.html` and the SPA renders PolicyExplorerPage

### Requirement: Sitemap uses clean URLs
The sitemap generator SHALL produce URLs without `/#/` prefixes.

#### Scenario: Generated sitemap has clean paths
- **WHEN** the sitemap is generated
- **THEN** all URLs use the format `https://apps.who.int/dhis2/uhcwatch/about` (not `https://apps.who.int/dhis2/uhcwatch/#/about`)

### Requirement: Test fixtures use clean URLs
All test fixtures and test utilities SHALL use clean path-based URLs instead of hash-based URLs.

#### Scenario: Test URLs do not contain hash
- **WHEN** test data references internal application URLs
- **THEN** the URLs use the format `https://apps.who.int/dhis2/uhcwatch/indicator-explorer` (not `.../#/indicator-explorer`)

