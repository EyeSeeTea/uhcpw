## ADDED Requirements

### Requirement: Resources section renders a grid of resource cards
The resources section SHALL render a `SectionHeader` titled "Resources" followed by a responsive grid of `ResourceCard` components. On desktop the grid is three columns; on mobile the cards stack in a single column.

#### Scenario: Desktop grid
- **WHEN** the resources section renders at viewport >= 960px
- **THEN** resource cards are arranged in a 3-column grid

#### Scenario: Mobile stacking
- **WHEN** the viewport is < 960px
- **THEN** resource cards stack in a single column

### Requirement: Resource card contents
Each `ResourceCard` SHALL display, in order: the resource image (covering its container via `object-fit: cover` with a gradient fallback), the resource title (as a link to the resource URL), the formatted date, and a category tag that links to `/resources/{kind}`.

#### Scenario: Card displays all fields
- **WHEN** a `HomeResourceState` with `title: "T"`, `date: 2024-05-01`, `kind: "news"`, and `url: "https://..."` is passed to `ResourceCard`
- **THEN** the card renders an `<img>` for `imageOriginal`, a linked `<a>` wrapping "T" pointing to the URL, a formatted date "May 2024" style string, and a tag link to `/resources/news` labeled "News"

### Requirement: Resource card ships zero JS
The `ResourceCard` SHALL be authored as an `.astro` component with no client directives and no React dependencies — replacing the SPA's `SimpleResourceItem` which depends on `useAnalytics`, `useHistory`, and styled-components.

#### Scenario: No client directives
- **WHEN** `ResourceCard.astro` is inspected
- **THEN** it has no `client:*` directive and imports no React components
