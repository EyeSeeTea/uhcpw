## Context

The home page (`src/pages/index.astro`) renders `MobileMapHero` inside a `.mobile-only` wrapper that is hidden via `display: none` for viewports above 959px. `MobileMapHero.astro` outputs a YouTube `<iframe>` whenever `content.videoLink` is set. Two problems follow:

1. **Desktop waste**: the iframe HTML is shipped on every page, and most browsers initiate the iframe document fetch even when an ancestor is `display: none`. Desktop users never see this video, so the request is pure overhead.
2. **Mobile cost**: even where the embed is visible, the YouTube player is one of the heaviest third-party widgets on the web (~500KB+ JS, multiple subresources). It blocks meaningful render and inflates LCP/INP on mobile devices, which are exactly the constrained clients we serve here.

Astro's static-output model means we have no runtime user-agent gating on the server; the markup is the same for every visitor. The shipped DOM is what we control, plus CSS-driven visibility. So the fix has two layers: (a) avoid emitting the embed at all when it cannot be shown, and (b) when emitted, defer the actual player until interaction.

## Goals / Non-Goals

**Goals:**
- Zero YouTube network activity for desktop visitors of the home page.
- Replace the eager iframe with a lite-youtube facade on mobile so the player loads only on user interaction.
- Keep the data contract (`MainMapPanelContent.videoLink: string`) untouched.
- Minimal new surface area: one component swap, one dependency added.

**Non-Goals:**
- Migrating other parts of the SPA/Astro app to lite embeds.
- Building a custom video player.
- Changing CMS/content shapes or routing.
- Adding a runtime UA-detection layer.

## Decisions

### Decision 1: Use `@astro-community/astro-embed-youtube` (lite-youtube facade)

We adopt the `<YouTube>` component from `@astro-community/astro-embed-youtube`, which wraps Paul Irish's `lite-youtube` web component. It renders a poster image and a play button; the real iframe is mounted only after the user clicks. The custom element ships ~3KB of JS instead of the full YouTube player.

**Alternatives considered:**
- *Hand-rolled facade*: a `<button>` + poster `<img>` that swaps to an iframe on click. Workable but reinvents what astro-embed already maintains, including poster fetching, accessibility, and play-icon styling. Rejected as needless work.
- *`loading="lazy"` on the existing iframe*: only defers off-screen iframes; on mobile the hero is above the fold so it would still load eagerly. Does not solve the desktop problem either. Rejected.
- *Keep iframe, add `srcdoc` trick*: more fragile and less accessible than a maintained facade. Rejected.

### Decision 2: Render `MobileMapHero` only when the mobile breakpoint applies

To eliminate desktop YouTube traffic deterministically, we stop emitting the YouTube facade in the desktop DOM at all. Two viable approaches:

- **A. CSS `@media` + `<template>` hydration**: render markup conditionally via a `<template>` and clone it into the DOM in a tiny inline script when `matchMedia("(max-width: 959px)")` matches. Runs once on page load.
- **B. Container-level CSS gate that prevents subresource fetch**: not actually possible — `display: none` ancestors do not reliably stop iframe loads, and `lite-youtube`'s `connectedCallback` would still run.

We choose **A**. The script is ~10 lines, runs at the bottom of the page, and guarantees the lite-youtube custom element is never connected on desktop. It also keeps the hero copy (the `description` block) above the fold on mobile without delay because the template is parsed inline.

**Alternatives considered:**
- *Two separate Astro builds (mobile vs desktop)*: not aligned with the static-site PoC scope. Rejected.
- *Server-side UA sniffing*: the site is statically generated and CDN-cached; UA branching defeats caching and is unreliable. Rejected.

### Decision 3: Pass the YouTube URL through unchanged

`MainMapPanelContent.videoLink` already holds a YouTube URL. `<YouTube id={videoLink} />` accepts either a full URL or a video ID. We pass the URL as-is — no parsing, no schema change.

## Data flow

1. **Domain → UI**: `home-data` loader returns `homePageContent.mainMapPanel.videoLink` (string URL). Unchanged.
2. **UI render**: `index.astro` includes `<MobileMapHero>` inside a `<template id="mobile-hero-tpl">`. A small inline script checks `matchMedia("(max-width: 959px)")` and, if matched, clones the template into the live `.mobile-only` container. If not matched, nothing is appended and the lite-youtube element is never instantiated.
3. **Mobile interaction**: user taps poster → `lite-youtube` element creates the real `<iframe>` with `autoplay=1` → YouTube player loads.
4. **Resize**: we do not re-render on resize. The page is statically generated; users who resize a desktop window down to mobile width on the same page load will not see the embed until reload. This is acceptable for the PoC.

## Risks / Trade-offs

- **Risk**: Resize from desktop → mobile on the same load shows no video. **Mitigation**: documented behavior; a reload reveals it. Acceptable for PoC; can revisit if real users complain.
- **Risk**: Inline script adds a new pattern to the codebase. **Mitigation**: keep it tiny, scoped to one element, commented with the "why" (preventing third-party fetch on desktop).
- **Risk**: `lite-youtube` poster image is itself a small request. **Mitigation**: only requested on mobile, where the user is the audience for the video; massively smaller than the full player.
- **Risk**: New dependency (`@astro-community/astro-embed-youtube`). **Mitigation**: it is a tiny, focused, actively maintained package within the astro-community org; aligned with the Astro ecosystem the PoC already uses.
- **Trade-off**: Mobile users now need an extra tap to play the video. Acceptable and standard pattern (YouTube itself does this on many surfaces).

## Migration / Rollback

- Migration: single PR — add dependency, swap iframe for `<YouTube>`, gate render via template + inline script. No data backfill, no feature flag needed.
- Rollback: revert the commit; restores prior iframe markup. `yarn remove @astro-community/astro-embed-youtube` if cleaning up dependency.

## Open Questions

- Do we want to preconnect to `i.ytimg.com` / `www.youtube.com` for mobile to shave a few ms when the user does tap? (Probably not worth it for a poster image; defer until measured.)
- Should `MobileMapHero` accept a `poster` override prop in case `videoLink` resolves to a video without a usable thumbnail? (Defer; lite-youtube auto-derives the standard YouTube thumbnail URL, which is fine.)
