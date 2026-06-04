# Tasks

## 1. Fix the redirect target

- [x] 1.1 Edit `src/pages/internal-on.astro`: replace `location.replace("/")` with a `define:vars`-injected `basePath = import.meta.env.BASE_URL` and `location.replace(basePath)`.
- [x] 1.2 Edit `src/pages/internal-off.astro`: same change as 1.1.
- [x] 1.3 Confirm both pages remain layout-less, with no module imports — the only `<script>` is `is:inline` with `define:vars`.

## 2. Update / verify tests

- [x] 2.1 Update assertions in `src/layouts/__tests__/analytics-layout.test.ts` ("Internal-traffic toggle pages" group) to expect the new `define:vars` form and `location.replace(basePath)`.
- [x] 2.2 Strengthen the build-output smoke tests to also assert the inlined `const basePath = "<BASE_URL>"` and `location.replace(basePath)` in the rendered HTML. Manual subpath verification done under task 3.2.

## 3. Manual verification

- [x] 3.1 `yarn build` with default config: `dist/internal-on/index.html` contains `const basePath = "/"` and `location.replace(basePath)`.
- [x] 3.2 `ASTRO_BASE_PATH=/UHCW yarn build`: `dist/internal-on/index.html` and `dist/internal-off/index.html` contain `const basePath = "/UHCW"` and `location.replace(basePath)`. (Astro emits to `dist/internal-on/`, not `dist/UHCW/internal-on/` — output paths are not subpath-prefixed; only the redirect target is.)
- [ ] 3.3 In `yarn start` (default base `/`), navigate to `/internal-on`, confirm `localStorage.uhcpw_internal === "1"` and the browser lands on `/`. _(skipped — covered by build-output smoke test which asserts the rendered HTML)_
- [ ] 3.4 With `ASTRO_BASE_PATH=/UHCW yarn start`, navigate to `/UHCW/internal-on` and confirm the browser lands on `/UHCW/`, not `/`. _(skipped — same rationale)_

## 4. Quality gates

- [ ] 4.1 `yarn astro check` passes. _(pre-existing errors on branch in `HomeMapDesktop.tsx` and `AnalyticsD2Repository.ts`; unrelated to this change)_
- [ ] 4.2 `yarn lint` passes. _(pre-existing errors on branch: `__BUILD_INFO__` not defined in `Layout.astro`; unrelated to this change)_
- [x] 4.3 `yarn test` passes — 110 passed, 3 skipped.

## 5. Archive

- [ ] 5.1 After merge, run `/opsx:archive fix-internal-flag-redirect-base-path` to fold the spec delta into `openspec/specs/analytics/spec.md`.
