## MODIFIED Requirements

### Requirement: React TSX components render as Astro islands
A `.tsx` React component SHALL render inside an `.astro` page using a `client:*` directive. The component MUST hydrate and be interactive in the browser. Island files SHALL be organized under `src/islands/<feature>/`.

#### Scenario: TSX island renders from feature subdirectory
- **WHEN** a `.astro` page imports a `.tsx` component from `../islands/about/ExpertsNetwork`
- **THEN** the component renders correctly with `client:load` or `client:visible`

#### Scenario: TSX island renders in production build
- **WHEN** `astro build` is run with a page containing a `.tsx` island from `islands/about/`
- **THEN** the build succeeds and the generated HTML includes the hydration script for the island
