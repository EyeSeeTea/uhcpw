## Context

The Astro app completed Phase 0 (project setup) and Phase 1 (build-time data layer). Pages can fetch DHIS2 data at build time via the shared composition root. However, all pages are bare HTML stubs — no shared header, footer, navigation, or styling.

The React SPA's layout layer is heavily coupled to MUI v4, styled-components, and React Router. Porting these dependencies into the Astro app would negate the SSG benefits (large JS bundles, hydration overhead). The SPA header alone pulls in MUI AppBar, Toolbar, Hidden, Menu, MenuItem, Button, and multiple icons.

The POC plan (Phase 2, Steps 2.1–2.3) recommends rewriting header/footer as Astro components with scoped styles when they are "mostly static HTML/CSS". Analysis confirms: the header is navigation chrome (logos + links + dropdowns), the footer is informational content. Neither requires React state management for the static site's needs.

## Goals / Non-Goals

**Goals:**
- Establish a reusable `Layout.astro` shell that all pages share
- Port the SPA's visual design (colors, typography, spacing, breakpoints) as CSS custom properties
- Recreate header navigation with responsive desktop/mobile variants using zero-JS or minimal inline JS
- Recreate footer with responsive desktop/mobile variants using native HTML elements
- Copy required static assets (logos, flags) into `public/`

**Non-Goals:**
- Full interactive parity with the SPA header (e.g., country/region dropdown filtering with live data) — the static site only needs links to the pages defined in the POC scope
- MUI or styled-components in the Astro app
- Dark mode or theme switching
- Analytics/tracking integration (reference links with GA events)
- Accessibility audit beyond semantic HTML (full a11y is a follow-up)

## Decisions

### D1: Rewrite header/footer as Astro components (not React islands)

**Choice**: Pure `.astro` components with scoped `<style>` blocks.

**Alternative considered**: Wrap existing React `AppHeader`/`AppFooter` as `client:load` islands. This would pull MUI v4 + styled-components into the client bundle (~150KB+ gzipped), defeating SSG goals. It also requires solving MUI SSR hydration mismatches.

**Rationale**: The header and footer are navigation/information chrome. Their "interactivity" is limited to menu toggles and accordion expand/collapse — achievable with `<details>`/`<summary>` and a small inline `<script>` for the mobile menu. Zero framework JS shipped for layout.

### D2: CSS custom properties for theming (not Tailwind, not CSS modules)

**Choice**: A single `theme.css` file defining CSS custom properties (`--color-accent-primary`, `--font-family-base`, etc.) imported globally in the Layout.

**Alternative considered**: Tailwind CSS — adds a build dependency and utility-class paradigm foreign to this codebase. CSS modules — good for isolation but custom properties already provide the shared token layer, and Astro's scoped `<style>` handles component isolation.

**Rationale**: CSS custom properties are zero-runtime, work everywhere (Astro scoped styles, inline styles, future React islands), and map 1:1 from the SPA's theme constants. Lowest friction path.

### D3: Mobile menu via `<details>`/`<summary>` + inline script

**Choice**: Use a `<details>` element for the mobile menu container. A small inline `<script>` handles closing the menu when clicking outside or on a link.

**Alternative considered**: Pure CSS `:target` or checkbox hack — limited control over close behavior. React island with `client:load` — overkill for a toggle.

**Rationale**: Native HTML disclosure element is accessible by default (keyboard, screen reader). The inline script is ~15 lines, scoped to the component, and doesn't require a framework.

### D4: Full navigation with placeholder links

**Choice**: The header navigation includes all SPA navigation items (Indicator explorer, Policy explorer, Regional overview, Countries & areas, Methods, Resources, About us). "Regional overview" and "Countries & areas" have CSS hover-based dropdown menus with caret icons. Dropdown items link to placeholder pages; dynamic data population (country/region lists) is deferred.

**Alternative considered**: Only including links to pages that exist in the Astro app. This was rejected to maintain visual parity with the SPA header during the POC.

**Rationale**: The header should look like the SPA. Placeholder links are acceptable for a POC; they become real links as pages are built.

### D6: Self-hosted Lato font (not Google Fonts)

**Choice**: Copy the Lato woff2/woff files from the SPA's `public/includes/fonts/` into `astro-app/public/fonts/` and use `@font-face` declarations in `theme.css`.

**Alternative considered**: Google Fonts `<link>` — simpler setup but introduces an external dependency, privacy implications, and doesn't match the SPA's approach.

**Rationale**: Matches the SPA's self-hosted font strategy. No external requests. Fonts are available offline and during build.

### D5: File organization

```
src/
├── layouts/
│   └── Layout.astro          # Base HTML shell
├── components/
│   └── layout/
│       ├── Header.astro       # Full header with nav
│       ├── Footer.astro       # Full footer
│       ├── DesktopNav.astro   # Desktop navigation bar
│       └── MobileNav.astro    # Mobile hamburger menu
├── styles/
│   └── theme.css              # CSS custom properties + resets
public/
├── images/
│   ├── who-logo.svg
│   ├── uhc-logo.svg
│   └── eu-flag.svg
```

**Rationale**: Mirrors the SPA's `components/layout/` convention. Separating DesktopNav/MobileNav keeps each component focused and under ~100 lines.

## Risks / Trade-offs

**[Visual drift from SPA]** → The Astro components will match the SPA's visual design at the time of implementation, but future SPA changes won't propagate automatically. Mitigation: this is acceptable for a POC; long-term the Astro site replaces the SPA for these pages.

**[Incomplete navigation]** → POC header only links to Home/Methods/About. Users navigating from the static site won't find other pages. Mitigation: clearly scoped as POC; additional nav items are a config change when pages are added.

**[No JS fallback testing]** → The mobile menu uses a small inline script. If JS is disabled, `<details>`/`<summary>` still works for expand/collapse but the "close on outside click" behavior won't fire. Mitigation: acceptable degradation; core navigation remains functional.

**[Static asset sourcing]** → Logo/flag images must be copied from the SPA's `public/` directory. If originals change, Astro copies become stale. Mitigation: copy once for POC; long-term, consider a shared assets directory or CDN.
