## ADDED Requirements

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
