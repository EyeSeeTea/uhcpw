## Why

The home page renders a YouTube `<iframe>` inside `MobileMapHero.astro` that is only meant to be visible on mobile (the wrapper `.mobile-only` is hidden via `display: none` above 959px). The iframe's HTML is still emitted on every page load, so desktop visitors pay for a YouTube embed they never see, and mobile visitors block on a heavy third-party player before they can read the hero copy. We want to ship a lighter, click-to-play embed and keep desktop completely free of YouTube traffic.

## What Changes

- Replace the raw `<iframe>` in `src/components/home/MobileMapHero.astro` with `<YouTube>` from `@astro-community/astro-embed-youtube` (lite-youtube facade — renders a poster image and only inserts the iframe on user interaction).
- Add `@astro-community/astro-embed-youtube` as a dependency.
- Ensure the embed is not shipped to desktop visitors: render `MobileMapHero` (and therefore the YouTube facade) only when the mobile breakpoint applies, so the lite-youtube custom element and its poster request never appear in the desktop DOM. Today the component is rendered always and hidden via CSS; that still ships HTML and (in some browsers) triggers iframe fetches.
- Accept a YouTube URL or video ID in `MainMapPanelContent.videoLink` (already a URL) and pass it through to `<YouTube>`.

## Capabilities

### New Capabilities
- `home-video-embed`: lazy, mobile-only YouTube embed for the home page hero panel.

### Modified Capabilities
_None — no existing capability spec covers this behavior._

## Impact

- Affected code: `astro-app/src/components/home/MobileMapHero.astro`, `astro-app/src/pages/index.astro` (gating render of `MobileMapHero`), `astro-app/package.json`.
- New dependency: `@astro-community/astro-embed-youtube` (justified: replaces ad-hoc iframe with maintained lite-youtube facade; no equivalent in current stack).
- No domain/infrastructure changes; `MainMapPanelContent.videoLink` shape unchanged.
- Compatibility: visual output on mobile changes from auto-loaded player to a poster-with-play-button until the user taps it. Desktop output is unchanged (still no video shown). No URL/route changes.
- Rollback plan: revert the commit; the prior `<iframe>` markup is restored and the dependency can be removed with `yarn remove`.

## Goals

- Zero YouTube network requests on desktop home page loads.
- Smaller initial payload and improved LCP/INP on mobile home page.
- Keep mobile UX functionally equivalent (video playable in place).

## Non-goals

- Replacing other embeds elsewhere in the SPA or Astro app.
- Changing the home page content model or CMS source for `videoLink`.
- Adding a custom video player or self-hosting the video.

## User impact

- Desktop users: no visible change; faster/lighter page.
- Mobile users: see a poster + play button; one extra tap to start playback. Saves bandwidth for users who never play the video.

## Compatibility

- Public interfaces unchanged. `MainMapPanelContent.videoLink` continues to accept the same YouTube URL string.
- No breaking change for downstream consumers.
