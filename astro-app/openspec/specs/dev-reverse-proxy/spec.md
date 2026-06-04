# dev-reverse-proxy Specification

## Purpose
TBD - created by archiving change spa-history-api-astro-integration. Update Purpose after archive.
## Requirements
### Requirement: Docker Compose provides Apache reverse proxy
A Docker Compose configuration SHALL provide an Apache reverse proxy that routes requests to either the Astro dev server or the SPA dev server based on URL path.

#### Scenario: Docker Compose starts Apache
- **WHEN** a developer runs `docker compose up` from the project root
- **THEN** an Apache container starts and listens on port 3000

### Requirement: Astro pages are served from Astro dev server
The Apache proxy SHALL route requests for Astro-owned paths (`/about`, `/methods`) to the Astro dev server at port 4321.

#### Scenario: /about is served by Astro
- **WHEN** a browser requests `http://localhost:3000/about`
- **THEN** Apache proxies the request to the Astro dev server and returns the Astro-rendered about page

#### Scenario: /methods is served by Astro
- **WHEN** a browser requests `http://localhost:3000/methods`
- **THEN** Apache proxies the request to the Astro dev server and returns the Astro-rendered methods page

### Requirement: SPA routes are served from SPA dev server
The Apache proxy SHALL route all requests that do not match Astro paths or API paths to the SPA dev server at port 8081.

#### Scenario: /indicator-explorer is served by SPA
- **WHEN** a browser requests `http://localhost:3000/indicator-explorer`
- **THEN** Apache proxies the request to the SPA dev server

#### Scenario: Root path is served by SPA
- **WHEN** a browser requests `http://localhost:3000/`
- **THEN** Apache proxies the request to the SPA dev server (homepage)

### Requirement: SPA fallback for client-side routes
The Apache proxy SHALL serve the SPA's `index.html` for any path that is not a static asset, not an API route, and not an Astro path, enabling SPA client-side routing.

#### Scenario: Deep SPA link returns index.html
- **WHEN** a browser requests `http://localhost:3000/resources/news`
- **THEN** Apache proxies to the SPA dev server which returns `index.html`, and the SPA renders the correct route client-side

### Requirement: Static assets are proxied to their origin
Static assets (JS, CSS, images) SHALL be proxied to the correct dev server based on request path.

#### Scenario: SPA static assets load correctly
- **WHEN** the SPA page loads and requests `/static/js/bundle.js`
- **THEN** Apache proxies the request to the SPA dev server and returns the asset

#### Scenario: Astro static assets load correctly
- **WHEN** an Astro page loads and requests `/_astro/styles.css`
- **THEN** Apache proxies the request to the Astro dev server and returns the asset

### Requirement: API requests are proxied
The Apache proxy SHALL forward API requests to the configured DHIS2 backend, mirroring the production proxy pattern.

#### Scenario: API request is proxied to backend
- **WHEN** the SPA makes a request to `http://localhost:3000/api/dataStore`
- **THEN** Apache proxies the request to the DHIS2 backend server

### Requirement: CORS and auth headers are set
The Apache proxy SHALL set appropriate CORS and authorization headers, mirroring the production Apache configuration.

#### Scenario: Responses include CORS headers
- **WHEN** any response is returned through the proxy
- **THEN** the response includes `Access-Control-Allow-Origin: *`

