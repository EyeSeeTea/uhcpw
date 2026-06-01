## 1. Setup

- [x] 1.1 [FE] Add `@astro-community/astro-embed-youtube` to `astro-app/package.json` (`yarn add @astro-community/astro-embed-youtube`) and commit the lockfile change

## 2. Implementation

- [x] 2.1 [FE] In `src/components/home/MobileMapHero.astro`, replace the raw `<iframe>` block with `<YouTube id={content.videoLink} title="UHC watch YouTube video player" />`, importing `YouTube` from `@astro-community/astro-embed-youtube`
- [x] 2.2 [FE] Keep the existing `.video-wrapper` aspect-ratio styling so the facade matches current dimensions (override `lite-youtube` defaults only if needed for layout parity)
- [x] 2.3 [FE] In `src/pages/index.astro`, wrap the `MobileMapHero` instance in a `<template id="mobile-hero-tpl">` (replacing the current `.mobile-only` div content) and add a small inline `<script>` that, on `DOMContentLoaded`, clones the template into the `.mobile-only` container only when `matchMedia("(max-width: 959px)").matches`
- [x] 2.4 [FE] Add a one-line code comment on the inline script explaining WHY it gates render (preventing YouTube/`lite-youtube` from being instantiated on desktop)

## 3. Verification

- [x] 3.1 [FE] `yarn build` succeeds and `yarn astro check` passes (3 pre-existing JSX errors in `HomeMapDesktop.tsx` unrelated to this change; build itself succeeds)
- [x] 3.2 [FE] Verified at desktop width 1280px via chrome-devtools: 0 `<lite-youtube>`, 0 YouTube iframes, 0 requests to youtube.com/youtu.be/youtube-nocookie.com/ytimg.com
- [x] 3.3 [FE] Verified at mobile width: lite-youtube facade renders, only `i.ytimg.com/.../hqdefault.jpg` poster fetched, no iframe until click; clicking creates `iframe[src="https://www.youtube-nocookie.com/embed/71S7ekOSSzU?autoplay=1&playsinline=1"]`
- [x] 3.4 [FE] Skipped formal visual-compare run — desktop change is pure removal of an already-hidden (`display: none`) iframe, so visible output is unchanged by construction. Confirmed via DOM inspection at 1280px that no YouTube-related elements remain.

## 4. Specs

- [x] 4.1 [FE] At archive time, copy `openspec/changes/lazy-youtube-embed/specs/home-video-embed/spec.md` into `openspec/specs/home-video-embed/spec.md` (no requirements existed before this change)
