## Why

The home page already renders its lower content as static Astro HTML, but its main title and description are hidden inside client-rendered hero components. Server-rendering all content that does not require browser interaction makes the initial page more complete for search engines and users while preserving the current Astro and SPA appearance at desktop and mobile sizes.

## What Changes

- Render the home hero title and description in the initial Astro HTML, using the title as the single `<h1>` and preserving the SPA's responsive title visibility.
- Keep the interactive map, zoom controls, country-marker selection, country panel, and video playback behavior client-side.
- Ensure responsive resource and news content remains present in initial HTML while carousel scrolling and dot controls remain interactive after hydration.
- Preserve the existing ordering, responsive visibility, typography, spacing, colors, assets, text, links, and behavior so the Astro home page remains visually and functionally aligned with the SPA at supported viewport sizes.
- Avoid changes to shared SPA components or domain interfaces unless implementation proves they are required for parity.

## Goals and Non-goals

### Goals

- Make all non-interactive home page content available in the initial HTML.
- Keep browser-only behavior limited to interactions that require it.
- Preserve the rendered UI between the Astro home page and the SPA on desktop and mobile.
- Keep exactly one home page `<h1>`, preserve when the SPA displays the title at each breakpoint, and avoid duplicate hero content after hydration.

### Non-goals

- Redesigning the homepage or changing its copy, navigation, responsive breakpoints, or interaction behavior.
- Server-rendering Mapbox GL or changing map data fetching.
- Broadly refactoring the SPA or changing its rendering strategy.
- Adding dependencies or replacing the existing YouTube facade.

## Capabilities

### New Capabilities

- `home-page-server-rendering`: Initial HTML contains the home page's static content, including the hero title and description, while browser-dependent interactions remain client-side and the Astro page retains SPA UI parity.

### Modified Capabilities

None. The existing home page capability specifications were introduced by the completed `port-home-page` change but are not present in the canonical `openspec/specs/` directory. This change introduces a focused canonical capability for the new server-rendering contract.

## Impact

- **Affected code:** `src/pages/index.astro`, `src/components/home/MobileMapHero.astro`, the home map island and its side-panel rendering, and potentially `src/components/home/MobileResourcesSection.astro` / `MobileNewsSection.astro` if inspection finds their content is not already server-rendered.
- **Systems:** Astro static generation, React island hydration, home-page accessibility and SEO, and visual parity with the existing React SPA.
- **Dependencies and public interfaces:** No new dependencies or intended public interface changes. `MainMapPanelContent` and other shared domain contracts remain unchanged.

## User Impact

Visitors should see the same homepage at the same viewport sizes. The hero title and description will be present before JavaScript runs, with the title following the SPA's responsive visibility; map selection, map controls, carousel controls, and video playback continue to work as they do today.

## Compatibility

The generated Astro page must preserve the SPA's visible content and layout at desktop and mobile breakpoints. Existing content links, CMS fields, analytics behavior for interactive elements, and the desktop rule that prevents YouTube resources from loading remain intact.

## Rollback Plan

Revert the homepage rendering changes and restore the current client-rendered hero panel and mobile template insertion. No data migration or persistent state change is involved.
