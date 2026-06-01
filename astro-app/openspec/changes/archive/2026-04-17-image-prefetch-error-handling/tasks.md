## 1. Downloader warnings

- [x] 1.1 [BE] In `src/lib/image-downloader.ts`, add `const log = createLogger("image-downloader")` and import from `@/lib/logger`.
- [x] 1.2 [BE] In `fetchImageBuffer`, warn with `{ url, status }` on non-OK responses before returning `null`.
- [x] 1.3 [BE] In `fetchImageBuffer`, distinguish timeout (AbortError from the `AbortController`) from other thrown errors in the catch branch; warn with `{ url, reason: "timeout" }` for the former and `{ url, error: err.message }` for the latter.
- [x] 1.4 [BE] In `downloadAndOptimizeImage`, warn with `{ url, error: err.message }` in the outer catch (sharp / fs failures) before returning `null`.
- [x] 1.5 [BE] Confirm successful downloads remain silent (no per-image info/debug line).

## 2. Home-page placeholder on failure

- [x] 2.1 [BE] In `src/data/home/home-images.ts`, change the remap to `imageMap.get(resource.imageOriginal) ?? ""` so missing entries yield an empty string instead of the original URL.
- [x] 2.2 [CR] Verify `ResourceCard.astro` and `MobileCarousel.tsx` already branch to a placeholder when `imageOriginal` is empty (they do) — no component change needed.

## 3. Tests

- [x] 3.1 [BE] Update `src/data/home/__tests__/home-images.test.ts`: rename the "keeps the original URL when the optimizer returns no mapping" case to assert `imageOriginal === ""` (the placeholder-trigger).
- [x] 3.2 [BE] Add a unit test for `image-downloader.ts` that stubs `fetch` to return a 500 and asserts the logger receives one `warn` call whose payload contains the URL and status. (Use `vi.spyOn` on the logger module export or on `pino`'s child logger.)
- [x] 3.3 [BE] Add a unit test that stubs `fetch` to throw and asserts a `warn` call with the error message.
- [x] 3.4 [BE] Run `yarn test` and `yarn astro check`; both must pass. (yarn test: 79 passed. yarn astro check: 3 pre-existing errors in `HomeMapDesktop.tsx`, unrelated — verified they also appear on HEAD without this change.)

## 4. Split `home-data.ts` to keep the server graph out of client islands

Triggered by running `yarn build`: the island `MobileCarousel.tsx` imported `resourceTagHref` from `home-data.ts`, which transitively pulls in `home-images.ts` → `image-downloader.ts` → `sharp` / `node:crypto`. Vite bundles the chain into the client and breaks on `"createHash" is not exported by "__vite-browser-external"`.

- [x] 4.1 [BE] Create `src/data/home/home-resource.ts` with pure types (`HomeResourceState`, `HomeMarkerCountry`) and pure helpers (`resourceTagHref`, `buildHomeNews`, `buildHomeResources`, `buildMapMarkers`) — no Node / composition-root imports.
- [x] 4.2 [BE] Slim `src/data/home/home-data.ts` to the server orchestration only (`getHomePageData`, `HomePageData`), importing shared pieces from `./home-resource` and `./home-images`.
- [x] 4.3 [BE] Update imports to use `@/data/home/home-resource` in islands (`MobileCarousel.tsx`, `MapView.tsx`, `HomeMap.tsx`, `HomeMapDesktop.tsx`), components (`ResourceCard.astro`, `ResourcesSection.astro`, `MobileResourcesSection.astro`, `MobileNewsSection.astro`), `home-images.ts`, and the two home test files. `src/pages/index.astro` keeps its `home-data` import.
- [x] 4.4 [BE] Run `yarn test` + `yarn build`. Both green.
- [x] 4.5 [CR] Inspect `dist/index.html`: the only remote `src="http…"` values are the analytics script and a YouTube embed — no DHIS2 image URLs leaked.

## 5. End-to-end verification

- [ ] 5.1 [CR] Force a failure for one home resource image (e.g. mangle a URL or block the DHIS2 host); re-run `yarn build` and confirm a `warn` line appears with the URL and that the card renders the placeholder in `dist/**/*.html`.
- [ ] 5.2 [CR] Visual check: `yarn start`, force the same failure, confirm the gradient placeholder renders at the same dimensions as a successful card.

## 6. Documentation

- [x] 6.1 [BE] `AGENTS.md` — add the "Server-only imports and the island boundary" section explaining the pure-leaf / server-module split.
- [x] 6.2 [BE] `docs/migration-caveats.md` — add Phase 5 entry documenting the symptom, fix, and follow-up (ESLint rule).

## 7. Spec housekeeping

- [x] 7.1 [BE] Ensure `openspec/changes/image-prefetch-error-handling/specs/image-optimization/spec.md` matches the shipped behavior before archiving.
