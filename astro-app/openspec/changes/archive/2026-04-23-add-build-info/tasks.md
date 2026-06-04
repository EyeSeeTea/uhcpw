## 1. Resolver

- [x] 1.1 [BE] Create `src/lib/build-info.ts` with `getBuildInfo()` returning `{ version, commit, buildDate }` and a shared `BuildInfo` type
- [x] 1.2 [BE] Read `version` from `package.json` with try/catch fallback `"0.0.0"`
- [x] 1.3 [BE] Resolve `commit` via `execSync("git rev-parse --short HEAD")` with try/catch fallback `"unknown"`
- [x] 1.4 [BE] Compute `buildDate` as `new Date().toISOString()`

## 2. Build-time injection

- [x] 2.1 [BE] In `astro.config.mjs`, import the resolver and pass the result to `vite.define` under `__BUILD_INFO__` (stringified)
- [x] 2.2 [BE] Declare the `__BUILD_INFO__` global in a `src/env.d.ts` (or equivalent) so TypeScript recognizes it

## 3. Meta tag in base layout

- [x] 3.1 [FE] Edit `Layout.astro` to render `<meta name="build-info" content={`v${version} / ${commit} / ${buildDate}`}>` inside `<head>`
- [x] 3.2 [FE] Verify via `yarn build` that the meta tag appears in every generated HTML file

## 4. /version.json endpoint

- [x] 4.1 [BE] Create `src/pages/version.json.ts` exporting a `GET` handler that returns `JSON.stringify(__BUILD_INFO__)` with `Content-Type: application/json`
- [x] 4.2 [BE] Verify `dist/version.json` is emitted as a static file after `yarn build`

## 5. Specs & verification

- [x] 5.1 [BE] Run `yarn astro check` — no type errors
- [x] 5.2 [CR] Manual: `curl -s localhost:4321/version.json` returns the expected shape; DevTools shows the meta tag on the home page
- [x] 5.3 [CR] Confirm graceful fallback: temporarily rename `.git`, run `yarn build`, verify `commit: "unknown"` appears in both meta tag and JSON
