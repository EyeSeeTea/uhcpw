# react-integration Specification

## Purpose
TBD - created by archiving change astro-poc-phase0-setup. Update Purpose after archive.
## Requirements
### Requirement: Astro React integration is installed and configured

The project SHALL have `@astrojs/react`, `react`, and `react-dom` installed as dependencies. The `astro.config.mjs` SHALL include the `react()` integration.

#### Scenario: React integration in Astro config
- **WHEN** `astro.config.mjs` is inspected
- **THEN** it imports `@astrojs/react` and includes `react()` in the `integrations` array

### Requirement: React TSX components render as Astro islands

A `.tsx` React component SHALL render inside an `.astro` page using a `client:*` directive. The component MUST hydrate and be interactive in the browser. Island files SHALL be organized under `src/islands/<feature>/`.

#### Scenario: TSX island renders from feature subdirectory
- **WHEN** a `.astro` page imports a `.tsx` component from `islands/about/ExpertsNetwork`
- **THEN** the component renders correctly with `client:load` or `client:visible`

#### Scenario: TSX island renders in production build
- **WHEN** `astro build` is run with a page containing a `.tsx` island from `islands/about/`
- **THEN** the build succeeds and the generated HTML includes the hydration script for the island

### Requirement: ExpertsNetwork CSS in a separate file
ExpertsNetwork island styles SHALL be defined in a dedicated CSS file imported at the Astro page level, not injected as a `<style>` string at hydration time.

#### Scenario: No FOUC on experts section
- **WHEN** the about page loads
- **THEN** ExpertsNetwork styles are available in the document before JS hydrates

#### Scenario: CSS uses design token variables
- **WHEN** ExpertsNetwork styles define font-family
- **THEN** they use `var(--font-family-base)` instead of hardcoded font stacks

### Requirement: PersonCardReact uses shared constant
PersonCardReact SHALL import AVATAR_FALLBACK from `data/about/constants.ts`.

#### Scenario: Fallback imported from shared location
- **WHEN** PersonCardReact needs the avatar fallback path
- **THEN** it imports from `data/about/constants.ts`
