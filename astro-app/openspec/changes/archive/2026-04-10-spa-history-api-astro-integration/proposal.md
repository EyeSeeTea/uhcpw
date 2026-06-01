## Why

The SPA currently uses `HashRouter`, producing URLs like `/#/methods` instead of clean `/methods` paths. This prevents seamless URL-based routing between the Astro static site and the SPA — both need to share the same URL space (e.g., `/methods` serves the Astro page, while `/indicator-explorer` serves the SPA). Additionally, hash-based URLs hurt SEO, complicate analytics tracking (GA4 page views are sent manually because `send_page_view: false` is required with HashRouter), and make the sitemap generation fragile. A local Apache reverse proxy is also needed so developers can run both sites side-by-side with production-like routing.

## Goals

- Replace `HashRouter` with `BrowserRouter` (History API) in the SPA so all routes use clean paths.
- Provide a Docker Compose + Apache configuration for local development that routes `/methods`, `/about` to Astro (port 4321) and all other paths to the SPA (port 8081).
- Update analytics, sitemap generation, and any hardcoded hash-based URLs.

## Non-goals

- Deploying to production or changing the production Apache config (this change focuses on local dev and SPA code).
- Migrating SPA pages to Astro beyond what already exists (`/about`, `/methods`).
- Changing the SPA's React Router version (staying on v5).

## What Changes

- **BREAKING**: Replace `HashRouter` with `BrowserRouter` in `src/webapp/pages/Router.tsx`. All SPA URLs change from `/#/path` to `/path`.
- Update `GoogleAnalyticsRepository.ts` to remove the HashRouter workaround (`send_page_view: false` and manual page location extraction from `window.location.hash`).
- Update `AnalyticsEvent.ts` to use `window.location.pathname` instead of `window.location.hash.split("?")[0]`.
- Update `generateSitemap.ts` to produce clean URLs without `/#/` prefixes.
- Update test fixtures in `HomePageContentD2Repository.spec.ts` that contain hardcoded `/#/` URLs.
- Add a `basename` prop to `BrowserRouter` to support the `/dhis2/uhcwatch` deployment path.
- Add `docker-compose.yml` and Apache config (`httpd.conf` or similar) for local development reverse proxy.

## Capabilities

### New Capabilities

- `spa-history-routing`: Migration of the SPA from HashRouter to BrowserRouter (History API), including basename support for sub-path deployment.
- `dev-reverse-proxy`: Docker Compose + Apache configuration for local development that routes requests to Astro or SPA based on URL path.

### Modified Capabilities

- `analytics`: GA4 page view tracking must switch from hash-based manual tracking to standard pathname-based tracking now that BrowserRouter is used.

## Impact

- **SPA Router** (`src/webapp/pages/Router.tsx`): Core routing change from HashRouter to BrowserRouter.
- **Analytics** (`src/data/repositories/GoogleAnalyticsRepository.ts`, `src/domain/entities/AnalyticsEvent.ts`): Remove hash-specific workarounds.
- **Sitemap** (`src/scripts/generateSitemap.ts`): URL format changes.
- **Tests** (`src/data/repositories/__tests__/HomePageContentD2Repository.spec.ts`, `src/utils/tests-ui.tsx`): Update test utilities and fixtures.
- **Navigation components**: No code changes needed — `NavLink` and `useHistory()` calls already use relative paths like `/about`, which work with both hash and history routing.
- **Apache/Docker**: New infrastructure files for local dev environment.
- **Bookmarks & shared links**: Existing `/#/path` bookmarks will break — no automatic redirect is planned for this PoC phase.

## User Impact

- Developers get clean URLs and a local dev setup that mirrors production routing.
- End users see cleaner URLs; existing hash-based bookmarks will stop working.

## Compatibility

- React Router v5 `BrowserRouter` is a drop-in replacement for `HashRouter` for route definitions.
- The `basename` prop handles sub-path deployment (`/dhis2/uhcwatch`).
- The SPA's dev server (port 8081) needs a fallback to `index.html` for all routes (standard SPA behavior with history API).

## Rollback Plan

- Revert the Router.tsx change from `BrowserRouter` back to `HashRouter`.
- Revert analytics changes (re-add `send_page_view: false` and hash extraction).
- The Docker Compose file is additive and can simply be removed.
