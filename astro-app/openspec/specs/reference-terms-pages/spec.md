# Reference terms pages

## Purpose

Provide searchable glossary and abbreviation references from DHIS2 as static Astro pages, while retaining the site's existing visual conventions.

## Requirements

### Requirement: Fetch reference data at build time

The Astro data module SHALL fetch glossary and abbreviation entries through the shared composition root and repository use cases at build time. The abbreviation repository SHALL fetch its category option set from DHIS2, retaining the option labels and sort order. The generated pages SHALL not require runtime DHIS2 requests.

#### Scenario: DHIS2 content is available

- **WHEN** Astro builds the reference pages with valid DHIS2 data
- **THEN** the generated pages contain the fetched glossary entries and abbreviations
- **AND** abbreviation categories follow the option-set sort order

#### Scenario: Invalid or unavailable reference data

- **WHEN** a reference fetch fails, a required entry field is empty, or an abbreviation category is absent from the option set
- **THEN** the build fails instead of silently omitting the invalid entry

### Requirement: Glossary supports finding and reading definitions

The `/glossary` page SHALL display terms alphabetically, with definitions expanded by default and available through native expandable controls. Search SHALL match terms and definitions without regard to case or accents, and an initial-letter filter SHALL narrow the displayed terms. Users SHALL be able to clear active filters using a control beside the search field and expand or collapse all definitions using a control above the entries.

#### Scenario: Search and letter filter are combined

- **WHEN** a user enters a search and selects an initial letter
- **THEN** only terms matching both filters are displayed
- **AND** the page indicates when no entries match

#### Scenario: Definition is expanded

- **WHEN** a user opens a term's definition
- **THEN** its definition is visible and the control offers to hide it

### Requirement: Abbreviations are grouped by category

The `/abbreviations` page SHALL display abbreviation meanings in groups named and ordered using DHIS2 category options. Entries within each group SHALL be sorted alphabetically. Search SHALL match abbreviations and meanings without regard to case or accents. Category links SHALL use readable, unique fragment identifiers.

#### Scenario: Search narrows groups

- **WHEN** a user searches for an abbreviation or meaning
- **THEN** nonmatching entries, groups with no matching entries, and their category links are hidden
- **AND** a clear-search control is available while the search field contains text

#### Scenario: Category link is followed

- **WHEN** a user follows a category link
- **THEN** the browser navigates to the corresponding category section
- **AND** an active search is preserved if that section is visible
- **AND** filters are cleared if they hide the linked section

### Requirement: Reference pages remain usable without JavaScript

Entries and definitions SHALL be present in the generated HTML. Interactive filtering and bulk expansion SHALL enhance the static content when JavaScript is available. Each entry SHALL have a unique fragment link, and a glossary entry reached by its fragment SHALL open its definition when JavaScript is available.

#### Scenario: JavaScript is unavailable

- **WHEN** either page is opened without JavaScript
- **THEN** its entries and their meanings or expandable definitions remain accessible

#### Scenario: Glossary entry link is opened

- **WHEN** a user opens a glossary entry fragment with JavaScript enabled
- **THEN** the entry is revealed and its definition is expanded

### Requirement: Reference pages follow the approved presentation

The pages SHALL use the shared site layout and title banner, rounded search controls and buttons, and unshaded rows separated by lines. The glossary SHALL show entries in two columns on desktop, ordered left to right across rows, and one column at widths of 960px or less. On mobile, the initial-letter filter SHALL use a compact selector. Its definition controls SHALL follow the Methods page's read-more treatment. Pages SHALL not display introductory copy or entry totals and subtotals.

#### Scenario: Reference page renders

- **WHEN** a reference page is displayed
- **THEN** it has a page title and its reference controls and entries
- **AND** it has no introductory paragraph or entry counts

### Requirement: Reference pages are discoverable

The glossary and abbreviations pages SHALL use their shared route-specific SEO configuration and appear in the production sitemap.

#### Scenario: Reference page is built

- **WHEN** either reference page is generated
- **THEN** its title and description come from the shared SEO configuration
- **AND** its public URL appears in the sitemap

### Requirement: SPA reference links open the Astro pages

The SPA header, mobile footer and Methods page SHALL link to the glossary and abbreviations pages at the configured application base path. Links SHALL navigate in the same tab and allow the destination page to record its own page view.

#### Scenario: A reference link is followed from the SPA

- **WHEN** a user selects Glossary or Abbreviations in the SPA
- **THEN** the browser opens the corresponding Astro page under the configured base path
- **AND** no additional SPA page view is recorded for the destination
