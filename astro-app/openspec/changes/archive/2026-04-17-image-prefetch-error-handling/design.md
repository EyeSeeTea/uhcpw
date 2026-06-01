## Context

`src/lib/image-downloader.ts` fetches remote images during Astro's static build, optimizes them with sharp, and writes WebP files under `public/images/`. Callers receive a `Map<remoteUrl, localPath>` for successful downloads. Failures are swallowed: `fetchImageBuffer` returns `null` on timeout / non-OK status, and `downloadAndOptimizeImage` returns `null` from its outer try/catch. No log line is produced.

Call-sites handle a missing entry inconsistently:

- `src/data/home/home-images.ts:25` — `imageMap.get(url) ?? resource.imageOriginal`. When the prefetch fails, the resource keeps its original DHIS2 URL, which is then rendered directly as `<img src="http://dhis2…">` by `ResourceCard.astro` and `MobileCarousel.tsx`. This leaks internal URLs to the browser and makes the client re-attempt a fetch that the server already failed.
- `src/data/about/about-images.ts:50` — falls back to `AVATAR_FALLBACK` (a local SVG).
- `src/data/about/about-images.ts:76` — falls back to the original URL, but only if it was already local (the remote branch is guarded by `isRemoteImageUrl` earlier).

`ResourceCard.astro:15-24` and `MobileCarousel.tsx:96-105` already have a placeholder branch: they render `<div class="image-placeholder">` when `imageOriginal` is falsy. That branch is currently unused at runtime because `home-images.ts` always keeps a truthy value.

A project-level pino logger is available via `createLogger(name)` in `src/lib/logger.ts`.

## Goals / Non-Goals

**Goals:**
- Every remote image prefetch failure produces exactly one `warn` log line, with the URL and a reason (timeout, HTTP status, or thrown error message).
- No home page HTML contains a `src` pointing to a remote DHIS2 URL. If the prefetch succeeded, the optimized local path is used; if it failed, the existing placeholder renders instead.
- Preserve current behavior for about-page flows (they already fall back to local assets); only add logging.

**Non-Goals:**
- Retrying failed downloads. One attempt, log, move on.
- Failing the build on image errors. Prefetch failures remain non-fatal.
- Changing the on-disk caching scheme or the shape of `ImageMap`.
- Touching layout-chrome images (logos, flags) — they're bundled, not prefetched.

## Decisions

### 1. Logging lives inside `image-downloader.ts`

The downloader is the only place that knows *why* a fetch failed (timeout vs. non-2xx vs. thrown). Emitting the warning there keeps the signal close to the cause and means every caller benefits automatically.

- Add `const log = createLogger("image-downloader")` at module top.
- In `fetchImageBuffer`: warn on non-OK HTTP (`{ url, status }`), and warn in the catch branch (`{ url, error: err.message }`). The `AbortError` from the timeout path falls through the catch — surface it as "timeout" in the message.
- In `downloadAndOptimizeImage`: warn from its outer catch when sharp or fs operations throw (`{ url, error: err.message }`). This path is distinct — the fetch succeeded but post-processing failed.

One warning per failed URL. Successful downloads stay silent (they're already covered by the pipeline's overall timing log).

**Alternative considered:** logging at each caller (home-images, about-images). Rejected — it duplicates logic and each caller would need to re-derive the reason from a `null`.

### 2. Home data drops the "fall back to original URL" branch

Change `home-images.ts:25` from:

```ts
imageOriginal: imageMap.get(resource.imageOriginal) ?? resource.imageOriginal,
```

to:

```ts
imageOriginal: imageMap.get(resource.imageOriginal) ?? "",
```

The empty string triggers the existing placeholder branches in `ResourceCard.astro` and `MobileCarousel.tsx`, which both check `item.imageOriginal ? <img/> : <placeholder/>`. The `HomeResourceState.imageOriginal` type stays `string` — no type change needed.

**Alternative considered:** introducing a discriminated `ImageState = { kind: "local", src: string } | { kind: "missing" }`. Rejected as overkill for a PoC; the existing truthiness check already models the two states.

**Alternative considered:** keeping the original URL and letting the client retry. Rejected — this is exactly the leak the proposal is fixing.

### 3. About-page flows unchanged (except logging)

`downloadAboutPersonImages` already uses `AVATAR_FALLBACK` for misses, and `downloadOfficeImage` only reaches its fallback with local paths. Both are already safe from the "leak original URL" concern. They get the logging benefit for free via decision #1.

### 4. Logging level: `warn`, not `error`

A failed image is a degraded-but-functional state (the page still renders with a placeholder). `error` would imply the build is broken; `warn` correctly signals "something to investigate" without triggering any CI/monitoring that treats errors as fatal.

## Risks / Trade-offs

- **Log noise if a DHIS2 endpoint is flaky** → one warning per failed URL per build. Acceptable; the count is bounded by the number of prefetched images (handfuls, not thousands).
- **Tests that assumed the original URL fallback will break** → `home-images.test.ts` has one such test ("keeps the original URL when the optimizer returns no mapping") — update it to assert the empty-string behavior.
- **Visual regression if placeholders look different from broken images** → placeholder is a gradient block with the same dimensions as the image slot, so layout doesn't shift. Visually cleaner than a broken image icon.

### 5. Split `home-data.ts` into a pure leaf + server orchestrator

Uncovered while verifying the build: `MobileCarousel.tsx` (a client island) imported `resourceTagHref` from `home-data.ts`. That module imports `./home-images` → `@/lib/image-downloader` → `sharp` + `node:crypto`. Vite follows value imports transitively into the client bundle, so the client build breaks on `"createHash" is not exported by "__vite-browser-external"` — unrelated to the logging work but blocking the same file set.

Fix: create `src/data/home/home-resource.ts` containing only pure types and helpers (`HomeResourceState`, `HomeMarkerCountry`, `resourceTagHref`, `buildHomeNews`, `buildHomeResources`, `buildMapMarkers`). Shrink `home-data.ts` to the server orchestrator (`getHomePageData`, `HomePageData`). Islands and components import from `home-resource`; only `src/pages/index.astro` imports from `home-data`.

Same pattern generalized in `AGENTS.md` and `docs/migration-caveats.md` so future features adopt `<feature>-resource.ts` vs `<feature>-data.ts` splits up front. A follow-up ESLint rule (`no-restricted-imports` for `src/islands/**` importing values from `@/data/**/*-data`) is noted as the long-term guardrail.

## Migration Plan

Single-PR change. No runtime migration — effects are visible on next `yarn build`. Rollback: revert the PR; no data or persisted state is affected.
