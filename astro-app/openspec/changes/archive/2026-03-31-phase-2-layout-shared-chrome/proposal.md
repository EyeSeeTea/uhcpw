## Why

The Astro app has a working build-time data layer (Phase 1) but pages are bare HTML stubs with no shared layout, header, footer, or styling system. Without shared chrome, each page would duplicate boilerplate and there would be no visual consistency or navigation between pages. Phase 2 establishes the layout shell so that Phase 3 (Methods) and Phase 4 (About) can focus purely on page content.

## What Changes

- Create `src/layouts/Layout.astro` — base HTML shell with `<head>`, meta tags, fonts, global CSS resets, and a `<slot>` for page content.
- Create `src/components/layout/Header.astro` — rewrite of the React SPA's `AppHeader` as a static Astro component with scoped styles. Navigation uses plain `<a>` links (no React Router). Responsive behavior via CSS media queries (desktop menu inline, mobile menu via `<details>`/JS toggle). Dropdown menus for "Regional overview" and "Countries & areas" use lightweight vanilla JS or CSS-only patterns.
- Create `src/components/layout/Footer.astro` — rewrite of the React SPA's desktop and mobile footers as a single responsive Astro component. Accordion sections on mobile use `<details>`/`<summary>` elements.
- Establish a CSS custom properties theme (`src/styles/theme.css`) porting the SPA's color palette, typography, and breakpoints so they're available to all Astro components and future React islands.
- Wire the layout into existing stub pages (`about.astro`, `methods.astro`, `404.astro`).

## Capabilities

### New Capabilities
- `base-layout`: Base HTML layout with head, meta, fonts, global resets, and content slot
- `header-chrome`: Static site header with WHO/UHC logos, responsive desktop/mobile navigation, and reference links
- `footer-chrome`: Static site footer with WHO disclaimer, co-funding info, contact details, and mobile accordion variant
- `design-tokens`: CSS custom properties theme porting the SPA's color palette, typography scale, and responsive breakpoints

### Modified Capabilities
_(none — no existing spec-level requirements change)_

## Impact

- **New files**: ~6-8 new `.astro` and `.css` files under `src/layouts/`, `src/components/layout/`, `src/styles/`
- **Modified files**: `about.astro`, `methods.astro`, `404.astro` (wrap content in Layout)
- **Dependencies**: None new — no MUI, no styled-components. Pure Astro scoped styles + CSS custom properties.
- **Static asset files**: WHO logo, UHC Watch logo, EU flag images need to be added to `public/` (sourced from the React SPA's `public/` directory)
- **No client-side JS required**: All interactivity (mobile menu toggle, accordion) handled via CSS or minimal inline `<script>`
