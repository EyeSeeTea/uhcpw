## Why

Previous phases delivered the About and Methods pages as static Astro pages, validating the SSG pipeline for content-heavy pages and the React island pattern for interactive components (TreeSelector). The home page is the site's primary entry point — the most complex page in the SPA. It combines a **Mapbox GL interactive map** with **six content sections** (explorers, analysis, methods, resources, newsletter) and a **fully distinct mobile layout**. Porting it proves that Astro can handle the project's most demanding page: heavy interactivity (map with country markers, hover panels, zoom controls), build-time data fetching for CMS content, and responsive layout switching — all while shipping zero JS for static sections.

## What Changes

- Create the home page (`/`, `index.astro`) as the Astro site's entry point with build-time data from DHIS2.
- Render the **map section** as a React island (`client:only="react"`) with a purpose-built `MapView` wrapper around Mapbox GL (not the SPA's `Map.tsx` — see design §2) plus the existing `HomePagePanel` and `CountryPanel` components from the SPA as the side panel. Pre-compute country GeoJSON markers at build time.
- Render the **explorers section** as static Astro: two colored columns (Indicator Explorer orange, Policy Explorer blue) with section header, text blocks, CTA buttons, and bubble pattern decorations.
- Render the **analysis section** as static Astro: two colored columns (Regional dark blue, Countries green) with section headers, text blocks, and CTA buttons.
- Render the **methods section** as static Astro: three colored columns (green gradient, orange, blue) with section header and text blocks.
- Render the **resources section** with build-time fetched resource cards in a 3-column grid, displaying image, title, date, and category tag.
- Render the **newsletter button** as a fixed-position static element.
- Implement a **mobile layout** using CSS media queries for static sections and responsive props for the map island, including a 2-column card grid linking to major sections.
- Fetch all page content (`HomePageContent`), resources, and country data at build time via the shared composition root.

## Capabilities

### New Capabilities

- `home-page-rendering`: Static rendering of the home page — section header pattern, colored column sections (explorers, analysis, methods), newsletter button, and responsive layout for desktop and mobile.
- `home-data-fetching`: Build-time data fetching for home page content, resources, and country/map data using the shared composition root.
- `home-map-island`: Interactive Mapbox GL map as a React island with country markers, hover-to-select panels (HomePagePanel, CountryPanel), and zoom controls. Uses a purpose-built `MapView` wrapper around Mapbox GL, reusing the SPA's panel components.
- `home-resources-section`: Build-time resource cards with images, dates, and category tags. Fetches and deduplicates resources marked as home favourites.
- `home-mobile-layout`: Mobile-specific layout with shortened map, 2-column colored card grid, and resource/news carousels as a React island.

### Modified Capabilities

_(none — this is new page work building on existing infrastructure)_

## Impact

- **Pages**: New `src/pages/index.astro` — the site's home page.
- **Components**: New Astro components for section header, explorers, analysis, methods, resources grid, newsletter button, and section divider. New React island (`HomeMap`) that pairs a purpose-built `MapView` (direct Mapbox GL wrapper) with the SPA's `HomePagePanel` and `CountryPanel`.
- **Styles**: New scoped CSS in Astro components using existing design tokens from `theme.css`. Bubble pattern SVG/PNG assets copied or referenced from the SPA.
- **Dependencies**: `HomePagePanel` and `CountryPanel` imported from `../src/webapp/components/home/`. Mapbox GL JS as a runtime dependency. The SPA's `Map.tsx` is intentionally NOT imported — `MapView` wraps Mapbox GL directly. `SimpleResourceItem` is replaced by a new `ResourceCard.astro`. Mobile carousels (`ResourcesCarousel`) are out of scope (see design non-goals).
- **Data layer**: No changes to shared domain/data code; consumes existing `compositionRoot.home.getPageContent`, `compositionRoot.resources.get`, and country data from `compositionRoot.country.get`. New `src/data/home/home-data.ts` module for build-time orchestration.
- **Assets**: Bubble pattern SVG/PNG, indicator/policy explorer SVG icons, map pin SVGs (6 status variants + hover variants), map legend icons.
- **Tests**: Vitest tests for home data fetching logic, resource deduplication/sorting, and GeoJSON transformation.
- **Compatibility**: Region pages use the same Mapbox GL primitives — the `MapView` pattern here (direct `mapbox-gl` usage + reused side panels) is the reference implementation for future map-heavy pages. Reusing the SPA `HomePagePanel`/`CountryPanel` validates the analytics-adapter approach for other pages that pull in panels from the SPA.
