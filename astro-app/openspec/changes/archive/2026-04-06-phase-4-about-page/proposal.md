## Why

Phase 3 delivered the Methods page, validating the full SSG pipeline (build-time DHIS2 fetch → static HTML). The About page is the second and more complex content page in the POC — it introduces **person image optimization**, **image fallbacks**, and the first truly **interactive React island** (country-filtering via TreeSelector). Completing it proves that Astro can handle both static content and interactive components reusing shared React code.

## What Changes

- Implement the full About page (`/about`) as a static Astro page with build-time data from DHIS2.
- Render the **office header** section: office image (optimized via Astro `<Image>`), video link thumbnail, and markdown description.
- Render the **team section**: grid of person cards with circular avatar images, names, positions, and institutions.
- Render the **experts network section** as a React island with client-side country filtering via the existing `TreeSelector` component.
- Optimize all person/office images using Astro's built-in image pipeline (`astro:assets`), fetching remote images at build time and generating optimized formats.
- Implement avatar fallback: when a person has no image URL or the DHIS2 server returns 404, display an empty avatar placeholder SVG.
- Reuse the existing `TreeSelector` React component tree as an Astro island (`client:visible`), proving shared React component reuse with full interactivity.

## Capabilities

### New Capabilities

- `about-page-rendering`: Static rendering of the About page — office header, team grid, and experts network sections with responsive layout.
- `about-data-fetching`: Build-time data fetching for persons (team + experts) and office info using the shared composition root.
- `person-card`: Reusable person card component with circular optimized image, avatar fallback, name, position, institution, and country.
- `experts-country-filter`: Interactive React island for filtering experts by country using TreeSelector, hydrated on scroll (`client:visible`).
- `image-optimization`: Remote image fetching and optimization at build time via Astro's image pipeline, with 404/missing fallback to placeholder avatar.

### Modified Capabilities

_(none — this is new page work building on existing infrastructure)_

## Impact

- **Pages**: `src/pages/about.astro` — full rewrite from stub to complete page.
- **Components**: New Astro components for office header, team grid, person card. New React island for experts network with TreeSelector.
- **Styles**: New scoped CSS in Astro components, using existing design tokens from `theme.css`.
- **Dependencies**: TreeSelector and its sub-components imported from `../src/webapp/components/tree-selector/`. The `useMultiCountryOptionsV2` hook and country sorting utilities imported from shared code. Possible new dependency for remote image fetching if Astro's built-in `image()` service needs configuration for DHIS2 URLs.
- **Data layer**: No changes to shared domain/data code; consumes existing `compositionRoot.about.getPersons`, `compositionRoot.about.getOfficeInfo`.
- **Tests**: Vitest tests for person card rendering, image fallback logic, and experts filtering.
- **Compatibility**: TreeSelector is also used on Indicator Explorer, Policy Explorer, and Resources pages — validating its reuse here de-risks those future pages.
