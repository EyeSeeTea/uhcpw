## 1. Configure the bundler

- [x] 1.1 In `astro-app/astro.config.mjs`, add
  `vite.build.rollupOptions.output.sanitizeFileName` that replaces any
  `@` (including the `@_@` marker Rollup inserts) with a WAF-safe
  character (e.g. `-`). Preserve the rest of the default sanitization.
- [x] 1.2 Run `yarn build` and confirm `find dist -name '*@*'` returns
  nothing.
- [x] 1.3 Spot-check `dist/index.html` and `dist/about/index.html`:
  their `<link rel="stylesheet">` hrefs reference the new
  `@`-free filenames, and the referenced files exist under
  `dist/_astro/`.
- [x] 1.4 Spot-check source maps (`dist/_astro/*.map`) reference the
  new names and are still loadable. _N/A — project does not emit
  source maps for production builds._

## 2. Add the regression guard

- [x] 2.1 Add a standalone Node script at
  `astro-app/scripts/check-asset-names.mjs` and expose it as its own
  yarn script (`"check:asset-names": "node scripts/check-asset-names.mjs"`)
  so it can be run independently of `yarn build`.
- [x] 2.2 Implement the chosen guard so it reports the list of
  offending paths (not just pass/fail) on failure.
- [x] 2.3 Verify the guard fails when `@` is present (temporarily
  remove the `sanitizeFileName` override and confirm) and passes on
  the fixed build. _Simulated by touching `dist/_astro/fake@_@astro.xyz.css`
  — guard exited 1 with the offending path; removed the fake file,
  guard exited 0._

## 3. Verify end-to-end

- [x] 3.1 Run `yarn build && yarn astro check && yarn test` — all
  green. _Build: ok (guard passes). Tests: 107/107 passing. `astro
  check` has 3 pre-existing errors in `src/islands/home/HomeMapDesktop.tsx`
  (React FC/JSX type mismatches) that also fail on the pre-change
  tree — unrelated to asset naming, out of scope._
- [x] 3.2 Serve `dist/` locally (e.g. `npx serve dist`) and load the
  home and about pages — CSS applies correctly, no 404s in the
  browser network panel. _Verified via `python3 -m http.server`: /,
  /about/, and all three generated CSS files (`index-_-astro…`,
  `about-_-astro…`, `Layout…`) return 200._
- [ ] 3.3 Deploy (or stage) behind the WAF-fronted environment and
  confirm CSS assets return 200 instead of being blocked. _Requires
  deployment access; left for the operator to run after merge._

## 4. Document

- [x] 4.1 Add a short comment next to the `sanitizeFileName` override
  in `astro.config.mjs` explaining *why* it exists (WAF rejects `@`).
  Without the comment, a future cleanup will strip it as dead code.
