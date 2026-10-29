## Context

The Astro homepage already fetches `HomePageContent`, resources, news, map markers, and general content in `getHomePageData()` during static generation. The explorers, analysis, methods, resource cards, mobile card grid, and newsletter button are Astro markup already. The main exception is the hero: the desktop map and its default `HomePagePanel` are under a `client:only="react"` island, while the mobile hero is placed in a `<template>` and copied into the live DOM by a viewport-gated script. The visible hero title and description therefore are not ordinary initial page content.

The SPA is the visual and behavioral reference. Its desktop and mobile home pages use different responsive composition, while Astro currently uses CSS breakpoints. The existing `home-video-embed` requirement also forbids any live YouTube custom element or YouTube network request on desktop.

## Goals / Non-Goals

**Goals:**

- Put all non-interactive home-page content in the generated HTML, including the visible hero title and CMS description.
- Keep exactly one hero `<h1>`, visible at the same viewport sizes as in the SPA, and prevent duplicate title/description content after hydration.
- Leave browser-dependent map, marker selection, map controls, carousel controls, and video playback client-side.
- Preserve Astro/SPA visual parity at desktop and mobile breakpoints, including text, order, visibility, layout, dimensions, typography, colors, spacing, assets, links, and interaction outcomes.
- Keep shared domain contracts and the SPA rendering strategy unchanged unless a concrete parity need requires a narrowly scoped shared change.

**Non-Goals:**

- Rendering Mapbox GL on the server.
- Changing homepage content, breakpoints, or interaction behavior.
- Refactoring unrelated React islands or changing other pages.
- Adding a design mockup; the requester has explicitly waived the repository's Pencil mockup step for this task.

## Decisions

### 1. Render the hero's default, content-only state from Astro

**Choice:** Render the CMS title and Markdown description as live Astro markup in the hero panel. Use the title as the page's only `<h1>` and retain its responsive visibility from the SPA. Render this markup in the page rather than inside the existing `<template>`. On mobile, retain the current responsive hero container and video mounting gate; only the non-interactive text moves to normal page markup. On desktop, place the Astro-rendered default panel at the exact existing map-panel coordinates and preserve its typography and panel styling.

The browser-only map island remains responsible for the map canvas and map interactions. When a marker is selected, the island displays the selected country's panel in the same side-panel region; with no country selected, it does not render a second copy of the default title and description. The existing desktop financial-protection legend and video link must remain visible and in the same positions; implementation should reuse or relocate their presentation without changing their content or analytics behavior.

**Alternatives considered:**

- Keep a hidden `<h1>` and leave the visible title client-rendered — rejected because the user-visible title and description would remain absent from the initial page content and the page would contain a detached duplicate heading.
- Switch the complete map island to SSR/hydration — rejected because Mapbox GL requires browser APIs and the island deliberately uses `client:only`.
- Render the hero panel twice and hide one copy after hydration — rejected because it risks duplicate accessibility content and a visible flash.

### 2. Preserve interactions as narrow client behavior

**Choice:** Keep Mapbox, zoom buttons, marker hover and selected-country state client-side. Keep the mobile YouTube facade out of desktop's live DOM and only mount it at the mobile breakpoint, following `home-video-embed`. Keep carousel scrolling and dot selection interactive. Their slide content should remain in initial HTML; `client:media` React components currently support server rendering and should not be changed to `client:only`.

**Alternatives considered:**

- Make the carousels or hero text `client:only` islands — rejected because their readable content does not require browser APIs and client-only output would remove it from the initial HTML.
- Instantiate the YouTube custom element on all viewports and rely on CSS hiding — rejected because this violates the existing desktop no-YouTube requirement.

### 3. Use the SPA as a parity contract without changing its UI

**Choice:** Keep shared data entities and the React SPA unchanged. Reproduce the existing panel's rendered appearance in Astro using current tokens, font rules, breakpoints, source assets, and CMS values. Preserve the current Astro section order and responsive behavior. During implementation, compare Astro and SPA at representative desktop, tablet, and mobile viewport sizes, including both the default map panel and a selected-country panel.

The requester requires exact UI parity and has waived Pencil artifacts, so this design records the existing UI as the target and makes side-by-side rendered comparisons an implementation task rather than introducing a new visual design.

**Alternatives considered:**

- Change the SPA panel to fit the Astro implementation — rejected unless implementation proves a narrowly scoped shared change is necessary, because this task is to bring Astro's rendering boundary in line with existing UI, not redesign both products.
- Accept approximate visual parity — rejected because the requester explicitly requires the Astro and SPA UI to remain the same.

### 4. Keep data flow in existing architecture layers

At build time, `getHomePageData()` continues to call the server composition root and return typed home content, resources, news, map markers, initial map settings, and general content. Astro page frontmatter passes this data to `.astro` components, which generate the static HTML. Only interaction data needed by the map/carousel/video client behavior crosses into React props or a small browser script. No browser request is introduced for CMS page content, and no domain entity or repository interface changes are planned.

## Risks / Trade-offs

- **Panel content could shift when removed from the React island** → Match the existing panel's computed geometry and typography at all breakpoints; compare default and country-selected states against the SPA before considering implementation complete.
- **Default and selected-country panels could overlap or flash during island startup** → Make the server-rendered default panel the sole default panel and show the client country panel only while a country is selected; preserve the current panel dimensions and z-order.
- **Astro Markdown output could differ from ReactMarkdown** → Reuse the existing `renderMarkdown` utility and verify representative paragraphs, links, and lists against the SPA rendering.
- **Analytics on the home video link could be lost when its presentation moves** → Preserve the existing analytics event and redirect semantics through an interaction-only handler; keep href and target behavior unchanged.
- **Desktop YouTube loading could regress when mobile hero markup leaves `<template>`** → Keep video facade mounting viewport-gated and validate the live desktop DOM/network behavior against `home-video-embed`.
- **Generated markup could drift from the SPA over time** → Treat SPA desktop/mobile screenshots and responsive checks as parity evidence and keep the Astro markup scoped to the existing page rather than changing the shared SPA implementation.

## Migration Plan

1. Implement the server-rendered default hero panel and remove the hidden-heading workaround and template-based text insertion.
2. Keep the map and its browser interactions in the client-only island; show the country panel only in the selected-country state.
3. Confirm resource/news slide markup remains present before hydration and preserve carousel behavior.
4. Compare Astro and SPA at agreed desktop, tablet, and mobile sizes and correct visual differences before completion.
5. Check the generated HTML for one `<h1>`, the CMS description, and no duplicate default panel content; verify the desktop YouTube restriction.

Rollback is a source-level revert: restore the current client-rendered default panel, mobile hero template insertion, and hidden `<h1>` if the parity-preserving server-rendered panel cannot be shipped safely. No persisted data or migration is involved.

## Open Questions

- During implementation, confirm whether the static Astro panel should be a dedicated `.astro` component or composed directly in `index.astro`; choose the smaller structure that best preserves existing styles.
- Confirm from rendered output whether mobile carousel slide markup is already emitted by the installed Astro React integration with `client:media`; if not, render the slide content in Astro and retain client behavior only for scrolling and dots.
