## 1. Opt-in/opt-out pages

- [x] 1.1 [FE] Create `astro-app/src/pages/internal-on.astro` as a layout-less page that runs an inline script setting `localStorage.setItem("uhcpw_internal", "1")` then `location.replace("/")`, with a `<noscript>` fallback explaining the page requires JavaScript.
- [x] 1.2 [FE] Create `astro-app/src/pages/internal-off.astro` mirroring `internal-on.astro` but calling `localStorage.removeItem("uhcpw_internal")` before redirecting.
- [x] 1.3 [FE] Verify neither page loads the base layout, the GA4 loader, or any analytics snippet (inspect rendered HTML in `dist/` after `yarn build`).

## 2. Astro GA4 bootstrap honors flag

- [x] 2.1 [FE] Update `astro-app/src/components/analytics/Analytics.astro` so the inline bootstrap reads `localStorage.uhcpw_internal` (wrapped in try/catch for Safari private mode) and passes `{ traffic_type: "internal" }` into `gtag("config", gaTagId, ...)` only when set.
- [x] 2.2 [FE] Keep the existing comment about `window.gtag` using `arguments` intact — do not refactor the dataLayer push.

## 3. SPA repository honors flag

- [x] 3.1 [FE] Update `src/data/repositories/GoogleAnalyticsRepository.ts` `setAnalyticsConfig()` to append `traffic_type: "internal"` to the `gtag("config", ...)` params object when `localStorage.getItem("uhcpw_internal") === "1"`.
- [x] 3.2 [FE] Ensure the existing `skipInitialConfig` path and debug-console logging still match the new params object.

## 4. Tests

- [x] 4.1 [FE] Extend `astro-app/src/layouts/__tests__/analytics-layout.test.ts` (or add a sibling) with assertions that the bootstrap source references `localStorage`/`uhcpw_internal` and conditionally passes `traffic_type`.
- [x] 4.2 [FE] Add a unit test covering `GoogleAnalyticsRepository.setAnalyticsConfig()` with the flag set, asserting the `gtag("config", ...)` call includes `traffic_type: "internal"`, and a companion test with the flag absent asserting no such field.
- [x] 4.3 [FE] Add a test (or extend a build-output test) asserting `/internal-on` and `/internal-off` rendered HTML contains neither the gtag loader script nor a `gtag("config", ...)` call.

## 5. Docs and specs

- [x] 5.1 [FE] Update `astro-app/README.md` analytics section to document the `/internal-on` and `/internal-off` URLs, how the flag works, and the fact that the matching GA4 "Internal Traffic" Data Filter must be configured in the GA4 admin for filtering to actually take effect.
- [x] 5.2 [FE] Update `astro-app/openspec/specs/analytics/spec.md` (via archive of this change) so the requirements added here land in the canonical spec.

## 6. Verification

- [x] 6.1 [FE] `cd astro-app && yarn lint && yarn astro check && yarn test && yarn build` all pass.
- [x] 6.2 [FE] Manually verify in a browser: visit `/internal-on`, confirm redirect to `/`, inspect the next GA4 `/g/collect` request and confirm it carries `tt=internal` (or the GA4 debug view shows `traffic_type=internal`). Visit `/internal-off`, repeat, and confirm the parameter is absent.
- [ ] 6.3 [CR] Code review the diff for both apps, confirming the flag is read only at the two bootstrap sites (UI/infra layer) and nowhere in Domain/Application.
