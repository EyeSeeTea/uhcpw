## ADDED Requirements

### Requirement: Title banner with accent-primary background

The Methods page SHALL render a title banner at the top with the accent-primary background color (`#0089d6`), white text displaying "Methods" as an **H1** heading, and a bubble pattern overlay image positioned to the right. On mobile viewports (≤ 600px), the banner SHALL display a map background image instead of the solid color.

#### Scenario: Desktop title banner with H1

- **WHEN** the Methods page is rendered at a viewport wider than 600px
- **THEN** the title banner displays with accent-primary background, white **H1** "Methods" heading, and bubble pattern overlay

#### Scenario: Mobile title banner

- **WHEN** the Methods page is rendered at a viewport of 600px or narrower
- **THEN** the title banner displays with a map background image instead of the solid color

#### Scenario: Page has exactly one H1

- **WHEN** the Methods page is rendered
- **THEN** the document contains exactly one `<h1>` element

### Requirement: Two-column grid layout for method sections

The page SHALL render method sections in a two-column CSS Grid with `grid-auto-flow: column`, filling items top-to-bottom in each column before wrapping. The grid SHALL calculate `grid-template-rows` based on the number of methods to distribute items evenly. At viewports ≤ 600px, the grid SHALL collapse to a single column with `grid-auto-flow: row`.

#### Scenario: Desktop two-column layout with 5 methods

- **WHEN** 5 method sections are fetched from DHIS2
- **THEN** the grid renders with 2 columns and 3 rows (3 items in column 1, 2 in column 2), filling top-to-bottom

#### Scenario: Mobile single-column layout

- **WHEN** the viewport is 600px or narrower
- **THEN** all method sections stack vertically in a single column

### Requirement: Method section with expand/collapse

Each method section SHALL display the section name as an **H2** heading, followed by the short text (rendered as HTML from markdown). A "Read more" toggle SHALL expand to show the full text content. When expanded, a "Read less" toggle SHALL collapse back to the short text. The toggle MUST use native HTML `<details>`/`<summary>` elements — no client-side JavaScript.

#### Scenario: Method section initially collapsed

- **WHEN** the Methods page loads
- **THEN** each method section shows only the section name and short text with a "Read more" control

#### Scenario: Expanding a method section

- **WHEN** the user clicks "Read more" on a method section
- **THEN** the full method text is revealed and the control changes to "Read less"

#### Scenario: Collapsing an expanded method section

- **WHEN** the user clicks "Read less" on an expanded method section
- **THEN** the section collapses back to showing only the short text

### Requirement: Abbreviations and Glossary download links

The page SHALL render "Abbreviations" and "Glossary" links styled as pill-shaped buttons with accent-primary background. Links SHALL open in a new tab. URLs SHALL come from DHIS2 general content; if the DHIS2 URL is empty/null, the links SHALL fall back to `https://cmyn.short.gy/abbreviations` and `https://cmyn.short.gy/glossary` respectively.

#### Scenario: Download links with DHIS2 URLs

- **WHEN** DHIS2 general content provides URLs for abbreviations and glossary
- **THEN** the links use those DHIS2 URLs

#### Scenario: Download links with fallback URLs

- **WHEN** DHIS2 general content has empty/null URLs for abbreviations or glossary
- **THEN** the links fall back to the hardcoded `cmyn.short.gy` URLs

#### Scenario: Links open in new tab

- **WHEN** a user clicks an Abbreviations or Glossary link
- **THEN** the link opens in a new browser tab

### Requirement: Page content area with consistent padding

The main content area below the title banner SHALL have padding of 80px vertical and 64px horizontal on desktop. On mobile viewports (≤ 600px), padding SHALL reduce to 40px.

#### Scenario: Desktop content padding

- **WHEN** the viewport is wider than 600px
- **THEN** the main content area has 80px top/bottom and 64px left/right padding

#### Scenario: Mobile content padding

- **WHEN** the viewport is 600px or narrower
- **THEN** the main content area has 40px padding on all sides

### Requirement: Zero client-side JavaScript

The rendered Methods page SHALL ship zero client-side JavaScript. All content is static HTML generated at build time. The expand/collapse behavior MUST use native HTML elements, not JS-driven toggles.

#### Scenario: No JS in build output

- **WHEN** `astro build` completes
- **THEN** the generated `/methods/index.html` contains no `<script>` tags (excluding Astro's view transitions or other framework-level scripts if enabled)

### Requirement: Centralized URL resolution for abbreviations and glossary
The methods page SHALL use a shared data-layer function for resolving abbreviations and glossary URLs (including fallbacks and normalization), instead of computing them inline.

#### Scenario: Methods page uses centralized URL resolution
- **WHEN** methods.astro needs abbreviations and glossary URLs
- **THEN** it calls `resolveGeneralContentUrls(generalContent)` from the data layer

#### Scenario: Layout uses same URL resolution
- **WHEN** Layout.astro passes URLs to Header and Footer
- **THEN** it uses the same `resolveGeneralContentUrls` function

#### Scenario: Fallback URLs applied consistently
- **WHEN** generalContent has no abbreviations or glossary URL
- **THEN** fallback URLs are applied by the shared function, ensuring consistency across page content and header/footer

### Requirement: Methods page heading hierarchy is sequential
The Methods page SHALL have a sequential heading hierarchy with no skipped levels. The page title SHALL be H1, and method section names SHALL be H2.

#### Scenario: No skipped heading levels
- **WHEN** the Methods page is rendered
- **THEN** the heading hierarchy is: H1 (page title) → H2 (method section names)
- **AND** no heading level is skipped
