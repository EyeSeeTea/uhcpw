## Why

Remote image prefetching fails silently today: when a build-time download errors out, nothing is logged (so operators have no signal something went wrong), and on the home page the original remote URL is written into the HTML as a fallback `src`. That leaks DHIS2 URLs to the browser and defeats the point of the prefetch pipeline (the browser then tries to load the same URL the server just failed to fetch).

## What Changes

- Log a warning (with the failing URL and a short reason) whenever `fetchImageBuffer` / `downloadAndOptimizeImage` fails to obtain a usable buffer for a remote image.
- Home resource data (`downloadHomeResourceImages`) SHALL NOT fall back to the original remote URL when a download fails. Instead it SHALL mark the image as missing (e.g. empty `imageOriginal`) so the UI renders the existing placeholder container.
- `ResourceCard.astro` and `MobileCarousel.tsx` already branch on `imageOriginal` truthiness to render a placeholder — that path becomes the official fallback and is exercised on download failure.
- The about-page flows (`downloadAboutPersonImages`, `downloadOfficeImage`) already fall back to local assets (`AVATAR_FALLBACK`, default dimensions) rather than the original URL; no behavior change there, only the new warning log.

## Capabilities

### New Capabilities
_(none)_

### Modified Capabilities
- `image-optimization`: Adds requirements for (a) logging on remote image prefetch failure and (b) never emitting the original remote URL as a client-visible `src` when the prefetch failed — the home resource card must render its placeholder instead.

## Impact

- Code:
  - `astro-app/src/lib/image-downloader.ts` — add warning logs in the catch / non-ok branches.
  - `astro-app/src/data/home/home-images.ts` — drop the `?? resource.imageOriginal` fallback; leave the field empty when not remapped.
  - `astro-app/src/data/home/__tests__/home-images.test.ts` — update the "keeps the original URL" test to assert the new behavior (empty string, so UI renders placeholder).
- APIs / dependencies: none.
- User-visible: home resource cards whose remote image failed to prefetch now show the gradient placeholder instead of a broken or slow client-side image fetch. Build logs gain one warning per failed image.
