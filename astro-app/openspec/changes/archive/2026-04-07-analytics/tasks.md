## 1. Verify shared imports

- [x] 1.1 [FE] Confirm `@shared/data/repositories/GoogleAnalyticsRepository`, `@shared/domain/usecases/SendEventUseCase`, `@shared/domain/usecases/SendPageViewUseCase`, `@shared/domain/entities/AnalyticsEvent`, and `@shared/app-config` resolve from `astro-app/` via `astro check`. **Found:** `@shared/app-config` alias does not exist in tsconfig.json / astro.config.mjs / vitest.config.ts — must be added (only `@shared/{domain,data,types,utils,CompositionRoot,webapp}` exist today).
- [x] 1.2 [FE] Verify `appConfig.gaTagId` resolves correctly. **Found:** `src/app-config.ts` hardcodes `gaTagId: "G-NMLFDE4DY7"` (prod). The SPA never actually switched at runtime — the dev tag was only documented in a comment. Override path in task 3.2 is therefore required.

## 2. Inject gtag in the base layout

- [x] 2.1 [FE] In `astro-app/src/layouts/Layout.astro`, add a `<script>` tag in `<head>` that loads `https://www.googletagmanager.com/gtag/js?id=<tag-id>` asynchronously, where `<tag-id>` is selected from `import.meta.env.PROD` (`G-NMLFDE4DY7` for prod, `G-5DKB563RGC` otherwise).
- [x] 2.2 [FE] Add an inline `<script is:inline>` immediately after the loader that sets `window.dataLayer = window.dataLayer || []`, defines `window.gtag` to push to `dataLayer`, and calls `gtag('js', new Date())` followed by `gtag('config', '<tag-id>')` (use the same tag ID injected via Astro's `define:vars`).
- [x] 2.3 [FE] Verified in `astro dev` — collect requests show `tid=G-5DKB563RGC` (dev tag).
- [x] 2.4 [FE] Verified via live `/g/collect` inspection: exactly one `en=page_view` event per navigation. The additional `en=user_engagement` request observed alongside it is GA4's built-in engagement ping, not a duplicate page_view.

## 3. Client analytics composition root

- [x] 3.1 [FE] Create `astro-app/src/infra/analytics.client.ts` that exports a `getAnalytics()` singleton accessor returning an object with `sendEvent(event: AnalyticsEvent)` (and `sendPageView(...)` for future use), constructed by wiring `new GoogleAnalyticsRepository()` into `new SendEventUseCase(...)` (and `new SendPageViewUseCase(...)`), all imported from `@shared/*`. Required adding a new `@shared/app-config` alias to `tsconfig.json`, `astro.config.mjs`, and `vitest.config.ts`.
- [x] 3.2 [FE] Override `appConfig.gaTagId` from `analytics.client.ts` (mutated to `import.meta.env.PROD ? "G-NMLFDE4DY7" : "G-5DKB563RGC"` before constructing the repository) because the shared `app-config.ts` hardcodes the prod tag.
- [x] 3.3 [FE] `analytics.client.ts` is documented as client-only via a header comment; no `.astro` frontmatter imports it (verified by grep).

## 4. Tests

- [x] 4.1 [FE] Vitest unit test at `src/infra/__tests__/analytics.client.test.ts` covers singleton identity, `sendEvent` forwarding to a mocked `GoogleAnalyticsRepository`, and the `appConfig.gaTagId` override.
- [x] 4.2 [FE] Smoke test at `src/layouts/__tests__/analytics-layout.test.ts` asserts `Layout.astro` source contains the loader/config snippet and (when `dist/` exists) that `dist/index.html` contains the prod loader and `gtag('config', 'G-NMLFDE4DY7')`. The dist check uses `it.skipIf` so the suite stays fast in CI runs that have not built yet.
- [x] 4.3 ~~Grep-based guard~~ **Dropped during code review** — the walk-based regex check was removed as noisy and low-value (false-positive risk for colocated tests, gave false confidence because the shared `GoogleAnalyticsRepository` still issues `gtag('config', ...)` indirectly). The invariant is instead upheld by Decision 2 in the design (skipInitialConfig) and the unit test that asserts the repo is constructed with `{ skipInitialConfig: true }`.

## 5. Documentation & spec sync

- [x] 5.1 [FE] No spec divergence — all ADDED requirements still describe the implemented behavior. The `appConfig.gaTagId` override is an implementation detail of the "Client-side analytics composition root" requirement and does not change observable behavior.
- [x] 5.2 [FE] `astro-app/README.md` now documents the GA4 setup, dev/prod tag IDs, and the `localStorage.setItem("accessToConsole", "true")` debug toggle.

## 6. Review & merge

- [x] 6.1 [CR] Code review completed (agent + user). Blocker/important findings addressed: `skipInitialConfig` option added to the shared repo to prevent the second `gtag('config', ...)` call; `@shared/app-config` no longer reused — replaced by Astro-owned `analytics.config.ts` as single source of truth for tag IDs; grep guard test removed per user directive; canonical `arguments`-based gtag stub restored after observing no `/collect` requests fired.
- [x] 6.2 [FE] `yarn lint`, `yarn astro check`, and `yarn test` all pass. `yarn build` not run as part of this task because the build performs live DHIS2 fetches at build time and may fail offline; reviewer should run it before merge.
