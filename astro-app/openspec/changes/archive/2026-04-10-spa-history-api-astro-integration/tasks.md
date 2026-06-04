## 1. SPA Router Migration

- [x] 1.1 [FE] Add `basePath` to `app-config.ts` (read from env var `REACT_APP_BASE_PATH`, default `"/"`)
- [x] 1.2 [FE] Replace `HashRouter` with `BrowserRouter` in `src/webapp/pages/Router.tsx`, passing `basename={appConfig.basePath}`
- [x] 1.3 [FE] Configure webpack-dev-server `historyApiFallback: true` for the SPA dev server (already enabled by react-scripts)
- [x] 1.4 [FE] Verify all existing routes render correctly with BrowserRouter (manual smoke test — requires running dev server)

## 2. Analytics Updates

- [x] 2.1 [FE] Update `AnalyticsEvent.ts` to use `window.location.pathname` instead of `window.location.hash.split("?")[0]`
- [x] 2.2 [FE] Update `GoogleAnalyticsRepository.ts` GA4 config: change `page_location` to use `window.location.pathname`
- [x] 2.3 [FE] Verify `sendPageView()` calls in page components still fire correctly with pathname-based tracking (manual verification)

## 3. Hardcoded URL Cleanup

- [x] 3.1 [FE] Update `generateSitemap.ts` to produce clean URLs without `/#/` prefix
- [x] 3.2 [FE] Update test fixtures in `HomePageContentD2Repository.spec.ts` to use clean URLs (remove `/#/`)

## 4. Tests

- [x] 4.1 [FE] Verify `useUpdateSearchParam` hook works with BrowserRouter's `location.search` (already compatible — uses location.search, not hash)
- [x] 4.2 [FE] Update `tests-ui.tsx` test utility if it creates hash-specific history instances (already uses createMemoryHistory — no hash dependency)
- [x] 4.3 [FE] Run existing test suite and fix any hash-routing assumptions in tests (58 tests pass; 23 suite failures are pre-existing ESM import issues unrelated to this change)

## 5. Docker Compose + Apache Reverse Proxy

- [x] 5.1 [BE] Create `dev/httpd.conf` with Apache config: route `/about`, `/methods` to Astro (4321), `/_astro/*` to Astro, `/api/*` to DHIS2, everything else to SPA (8081) with fallback
- [x] 5.2 [BE] Add CORS and auth header directives to `httpd.conf` mirroring production config
- [x] 5.3 [BE] Create `docker-compose.yml` with Apache service (httpd:2.4 image, port 3000:80, volume mount for httpd.conf)
- [x] 5.4 [BE] Test the full flow: Astro pages load via proxy, SPA pages load via proxy, deep SPA links work, static assets resolve

## 6. Spec Updates

- [x] 6.1 [CR] Update `openspec/specs/analytics/spec.md` with modified page location tracking requirements
