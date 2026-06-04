## Why

Phase 2 delivered the shared chrome (header, footer) and layout. The Methods page is the simplest content page — no complex interactivity beyond expand/collapse — making it the ideal first target to validate the full SSG data pipeline end-to-end: build-time DHIS2 fetch → domain entities → static HTML with near-zero client JS.

## What Changes

- Replace the skeleton `methods.astro` page with a fully rendered Methods page that fetches `Method[]` from DHIS2 at build time via the shared composition root.
- Render a two-column grid of method sections with markdown content, matching the React SPA layout.
- Implement expand/collapse ("Read more" / "Read less") using `<details>`/`<summary>` — zero client-side JS.
- Render Abbreviations and Glossary download links sourced from DHIS2 general content (with hardcoded fallback URLs).
- Add a title banner with accent-primary background and bubble pattern overlay.
- Parse markdown content from DHIS2 into HTML at build time.
- Add Vitest tests for the data-fetching bridge and page structure.

## Capabilities

### New Capabilities

- `methods-page-rendering`: Static rendering of the Methods page — title banner, two-column grid layout, method sections with markdown content, expand/collapse, and reference download links.
- `methods-data-fetching`: Build-time data fetching for Methods page content using the shared composition root and future bridge.
- `markdown-rendering`: Server-side markdown-to-HTML conversion for DHIS2 content strings, reusable across future pages.

### Modified Capabilities

_(none — this is new page work building on existing infrastructure)_

## Impact

- **Pages**: `src/pages/methods.astro` — full rewrite from skeleton to complete page.
- **Components**: New Astro components for method sections, title banner, and download links.
- **Styles**: New scoped CSS in Astro components, using existing design tokens from `theme.css`.
- **Dependencies**: `marked` (or similar) for server-side markdown parsing — lightweight, no client JS.
- **Data layer**: No changes to shared domain/data code; consumes existing `compositionRoot.method.get` and `compositionRoot.about.getGeneralContent` (for reference links).
- **Tests**: New Vitest tests for markdown rendering and data bridge integration.
