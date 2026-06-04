## Why

The Astro static site currently has no analytics, while the React SPA tracks pageviews and rich domain events (Policy Explorer interactions, Indicator Explorer summaries, file downloads, external link clicks, country/resource navigation) via Google Analytics 4. To preserve continuity of data when the static site replaces (or runs alongside) the SPA, the Astro build must mirror the same GA4 setup and emit the same event taxonomy so existing dashboards keep working.

## What Changes

- Add Google Analytics 4 to the Astro site using the same dev/prod tag IDs as the SPA (`G-5DKB563RGC` dev, `G-NMLFDE4DY7` prod), injected once in the base layout.
- Reuse the SPA's analytics use cases (`SendPageViewUseCase`, `SendEventUseCase`) and `GoogleAnalyticsRepository` via the existing shared-code import pattern, instead of duplicating logic.
- Wire up automatic page_view tracking on every Astro route (server-rendered pages emit on the client after hydration), replacing the SPA's `useEffect` + HashRouter approach with a single client-side script that fires on `astro:page-load`.
- Expose a small client-side analytics helper so React islands (Policy Explorer, Indicator Explorer, Visualization plugin, Screenshot modal, etc.) can keep calling the same `sendEvent` API they use in the SPA.
- Mirror the SPA's event taxonomy where the originating component is already ported to Astro: `page_view`, `country_page_view`, `resource_kind_page_view`, `file_download`, `resource`, `external_link`. Explorer/visualization-specific events (`indicator_explorer*`, `policy_explorer*`) will be emitted by their islands once those islands are ported — this proposal ensures the wiring is in place so they need no additional setup.
- No cookie/consent banner is added (the SPA has none either); this stays a non-goal for the PoC.

## Capabilities

### New Capabilities
- `analytics`: GA4 initialization, page_view emission on Astro route changes, and a client-side `sendEvent` API for React islands, all backed by the SPA's existing analytics domain/use cases.

### Modified Capabilities
<!-- None — analytics is a brand-new capability for the Astro site. -->

## Impact

- **New code**: A base-layout script tag for the gtag loader, an Astro client entry that wires `astro:page-load` to `SendPageViewUseCase`, and a tiny composition root that constructs `GoogleAnalyticsRepository` + use cases on the client.
- **Reused code (via shared-code-imports)**: `src/data/repositories/GoogleAnalyticsRepository.ts`, `src/domain/usecases/SendPageViewUseCase.ts`, `src/domain/usecases/SendEventUseCase.ts`, and `src/app-config.ts` (for the GA tag IDs).
- **Affected layouts/pages**: `BaseLayout.astro` (script injection), every page (inherits via base layout), and any future React island that needs to emit events.
- **Dependencies**: None added — gtag is loaded via a `<script>` tag, matching the SPA.
- **Config**: Dev vs. prod tag selection follows `import.meta.env.PROD` (or equivalent Astro env check), mirroring the SPA's `process.env.NODE_ENV` switch.
- **Rollback**: Remove the script tag from `BaseLayout.astro` and the client analytics entry; no data migrations or persistent state involved.
- **User impact**: Invisible to end users (no UI changes, no consent prompt added). Site analysts regain GA4 coverage for the Astro site.
- **Compatibility**: While the SPA and Astro site coexist, both will report to the same GA4 property; events use the same names and parameter shapes so reports remain consistent.
