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

### Requirement: ExpertsNetwork is server-rendered with deferred MUI providers

The `ExpertsNetwork` island SHALL be mounted in `about.astro` with the `client:load` directive so that its title, subtitle, and experts grid are emitted as static HTML during `astro build`. The Material-UI providers (`MuiThemeProvider`, `OldMuiThemeProvider`) and the `TreeSelector` SHALL only be rendered after the component has mounted in the browser, gated by a state flag set inside `useEffect`.

#### Scenario: Static HTML contains experts content

- **WHEN** `yarn build` finishes and `dist/about/index.html` is inspected
- **THEN** the file contains the experts title text, subtitle text, and one element per expert in `experts-grid`
- **AND** the file does NOT contain a `client:only` astro-island shell for the experts section

#### Scenario: TreeSelector is absent from SSR markup

- **WHEN** `ExpertsNetwork` is rendered with `react-dom/server`'s `renderToStaticMarkup`
- **THEN** the output contains the `experts-selector-placeholder` element
- **AND** the output does NOT contain any markup produced by `MuiThemeProvider`, `OldMuiThemeProvider`, or `TreeSelector`

#### Scenario: TreeSelector mounts after hydration

- **WHEN** `ExpertsNetwork` is rendered with React Testing Library's `render` (which runs effects)
- **THEN** the `TreeSelector` input becomes available in the DOM
- **AND** the `experts-selector-placeholder` element is no longer rendered

#### Scenario: Filtering still works after hydration

- **WHEN** the user selects a country in the hydrated `TreeSelector`
- **THEN** only experts whose `countryId` matches a selected country remain in the grid

### Requirement: Experts selector placeholder prevents layout shift

While `ExpertsNetwork` is unmounted (server render and first client render), it SHALL render a placeholder element in place of the `TreeSelector`. The placeholder SHALL occupy the same horizontal and vertical space as the hydrated TreeSelector input, defined in `experts-network.css`, and SHALL be marked `aria-hidden="true"`.

#### Scenario: Placeholder reserves space

- **WHEN** `/about` is loaded and JavaScript is disabled
- **THEN** the experts section reserves the same vertical space for the selector as it does after hydration (no layout shift when JS later runs)

#### Scenario: Placeholder is not announced to assistive tech

- **WHEN** a screen reader reads the experts section before hydration
- **THEN** the placeholder element is skipped because of `aria-hidden="true"`
