## ADDED Requirements

### Requirement: Astro React integration is installed and configured

The project SHALL have `@astrojs/react`, `react`, and `react-dom` installed as dependencies. The `astro.config.mjs` SHALL include the `react()` integration.

#### Scenario: React integration in Astro config
- **WHEN** `astro.config.mjs` is inspected
- **THEN** it imports `@astrojs/react` and includes `react()` in the `integrations` array

### Requirement: React TSX components render as Astro islands

A `.tsx` React component SHALL render inside an `.astro` page using a `client:*` directive. The component MUST hydrate and be interactive in the browser.

#### Scenario: Trivial TSX island renders in dev mode
- **WHEN** a `.astro` page includes a `.tsx` component with `client:load`
- **THEN** `astro dev` serves the page without errors and the component renders in the browser

#### Scenario: TSX island renders in production build
- **WHEN** `astro build` is run with a page containing a `.tsx` island
- **THEN** the build succeeds and the generated HTML includes the hydration script for the island
