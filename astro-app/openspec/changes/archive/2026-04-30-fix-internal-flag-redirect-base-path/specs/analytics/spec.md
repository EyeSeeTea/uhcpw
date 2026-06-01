## MODIFIED Requirements

### Requirement: Opt-in and opt-out routes

The Astro site SHALL expose two routes, `/internal-on` and `/internal-off`, whose sole purpose is to toggle the internal-traffic flag in `localStorage` and redirect the browser to the configured site base URL (`import.meta.env.BASE_URL`). These routes SHALL NOT render the shared base layout, SHALL NOT load the GA4 tag, and SHALL NOT emit a `page_view` for themselves.

#### Scenario: /internal-on sets the flag and redirects to base URL
- **WHEN** a browser with JavaScript enabled navigates to `<base>/internal-on`
- **THEN** `localStorage.getItem("uhcpw_internal")` equals `"1"` after the page script runs
- **AND** the browser is redirected to the configured base URL (e.g. `/` for a root deployment, `/UHCW` when `ASTRO_BASE_PATH=/UHCW`) via `location.replace`

#### Scenario: /internal-off clears the flag and redirects to base URL
- **WHEN** a browser with JavaScript enabled navigates to `<base>/internal-off`
- **THEN** `localStorage.getItem("uhcpw_internal")` is `null` after the page script runs
- **AND** the browser is redirected to the configured base URL via `location.replace`

#### Scenario: Subpath deployment keeps the user inside the app
- **WHEN** the site is built with a non-root `ASTRO_BASE_PATH` (e.g. `/UHCW`) and a browser navigates to `/UHCW/internal-on` or `/UHCW/internal-off`
- **THEN** the post-toggle redirect target is the value `import.meta.env.BASE_URL` resolved to at build time (`/UHCW` for that example), not the host root `/`

#### Scenario: Toggle pages do not themselves pollute analytics
- **WHEN** a browser navigates to `/internal-on` or `/internal-off`
- **THEN** no `<script src="https://www.googletagmanager.com/gtag/js?id=...">` tag is present in the rendered HTML
- **AND** no `gtag("config", ...)` call runs for the toggle page
