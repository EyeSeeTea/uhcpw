## ADDED Requirements

### Requirement: Internal-traffic opt-in flag

The site SHALL honor a browser-local opt-in flag that causes GA4 events originating from that browser to be tagged as internal traffic. The flag SHALL be stored in `localStorage` under the key `uhcpw_internal` with string value `"1"` when set, and SHALL be considered absent when the key is missing or any other value.

#### Scenario: Flag set means internal
- **WHEN** `localStorage.getItem("uhcpw_internal") === "1"` at the time a page loads
- **THEN** the page's `gtag("config", ...)` call includes a parameter `traffic_type` with value `"internal"`

#### Scenario: Flag absent means regular traffic
- **WHEN** `localStorage` does not contain the key `uhcpw_internal` (or its value is not `"1"`)
- **THEN** the page's `gtag("config", ...)` call is made without a `traffic_type` parameter

#### Scenario: localStorage unavailable degrades gracefully
- **WHEN** accessing `localStorage` throws (e.g., sandboxed iframe, privacy mode)
- **THEN** the bootstrap treats the flag as absent and emits `config` without `traffic_type`, without throwing

### Requirement: Opt-in and opt-out routes

The Astro site SHALL expose two routes, `/internal-on` and `/internal-off`, whose sole purpose is to toggle the internal-traffic flag in `localStorage` and redirect the browser to the site root. These routes SHALL NOT render the shared base layout, SHALL NOT load the GA4 tag, and SHALL NOT emit a `page_view` for themselves.

#### Scenario: /internal-on sets the flag and redirects
- **WHEN** a browser with JavaScript enabled navigates to `/internal-on`
- **THEN** `localStorage.getItem("uhcpw_internal")` equals `"1"` after the page script runs
- **AND** the browser is redirected to `/` via `location.replace`

#### Scenario: /internal-off clears the flag and redirects
- **WHEN** a browser with JavaScript enabled navigates to `/internal-off`
- **THEN** `localStorage.getItem("uhcpw_internal")` is `null` after the page script runs
- **AND** the browser is redirected to `/` via `location.replace`

#### Scenario: Toggle pages do not themselves pollute analytics
- **WHEN** a browser navigates to `/internal-on` or `/internal-off`
- **THEN** no `<script src="https://www.googletagmanager.com/gtag/js?id=...">` tag is present in the rendered HTML
- **AND** no `gtag("config", ...)` call runs for the toggle page

### Requirement: SPA-initialized GA4 honors the same flag

When the React SPA's `GoogleAnalyticsRepository` performs its own `gtag("config", ...)` call (i.e., when constructed without `skipInitialConfig`), it SHALL include `traffic_type: "internal"` in the config parameters if and only if `localStorage.getItem("uhcpw_internal") === "1"`.

#### Scenario: SPA config respects flag
- **WHEN** `GoogleAnalyticsRepository` is instantiated in a browser where the flag is set, and its internal `setAnalyticsConfig()` runs
- **THEN** the `gtag("config", ...)` call it issues includes `traffic_type: "internal"`

#### Scenario: SPA config without flag matches existing behavior
- **WHEN** `GoogleAnalyticsRepository` is instantiated in a browser where the flag is absent
- **THEN** its `gtag("config", ...)` call has the same parameters as before this change (`page_title`, `page_location`, `send_page_view`), with no `traffic_type` field
