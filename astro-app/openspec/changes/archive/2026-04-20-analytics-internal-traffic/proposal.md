## Why

UHCW staff and contributors generate a non-trivial share of traffic to the site, which pollutes GA4 reports with visits that don't represent real audience behavior. The client needs a way to exclude internal traffic so analytics reflect actual visitors.

## What Changes

- Add two public Astro pages, `/internal-on` and `/internal-off`, that set or unset a persistent `localStorage` flag (`uhcpw_internal=1`) and then redirect to the home page. They are empty routes whose only purpose is to run a tiny inline script.
- Extend the GA4 bootstrap in both apps so that, when the flag is present, the initial `gtag("config", ...)` call passes `traffic_type: "internal"`:
  - **Astro**: update `src/components/analytics/Analytics.astro` to read the flag before issuing `gtag("config", ...)`.
  - **React SPA**: update `src/data/repositories/GoogleAnalyticsRepository.ts` so `setAnalyticsConfig()` includes the same `traffic_type` field when the flag is set.
- Document the opt-in URLs and the matching GA4 "Internal Traffic" Data Filter setup (done in the GA4 UI, not in code) in the README.

Non-code: configure the GA4 Data Filter in Admin → Data Filters to **exclude** events with `traffic_type=internal` for both the prod (`G-NMLFDE4DY7`) and dev (`G-5DKB563RGC`) streams. Not part of this change's codebase work but required for the feature to actually filter anything.

## Capabilities

### New Capabilities

(none — this extends the existing analytics capability)

### Modified Capabilities

- `analytics`: add a requirement that GA4 events emitted from an opted-in browser must carry `traffic_type=internal`, and define the `/internal-on` / `/internal-off` opt-in/opt-out routes.

## Impact

- **Code touched**:
  - `astro-app/src/components/analytics/Analytics.astro` (conditional `config` params)
  - `astro-app/src/pages/internal-on.astro` (new)
  - `astro-app/src/pages/internal-off.astro` (new)
  - `src/data/repositories/GoogleAnalyticsRepository.ts` (conditional `config` params in SPA-standalone path)
  - `astro-app/README.md` (document opt-in URLs)
  - Tests: `astro-app/src/layouts/__tests__/analytics-layout.test.ts` and `astro-app/src/infra/__tests__/analytics.client.test.ts` updated if they assert the exact `config` shape.
- **Compatibility**: fully backwards compatible. Browsers without the flag behave exactly as today. No change to event shape for regular visitors.
- **Cross-app sharing**: relies on the SPA and Astro being served from the same origin so `localStorage` is shared. This is already the case in this PoC and in production.
- **Rollback plan**: revert the two Astro pages and the two code hunks; the flag becomes inert and no events get tagged as internal. Optionally set the GA4 Data Filter to "Inactive" so any already-tagged events are counted again.
- **User impact**: zero for regular visitors. UHCW staff visit `/internal-on` once per browser to opt out of being counted; `/internal-off` reverses it.
