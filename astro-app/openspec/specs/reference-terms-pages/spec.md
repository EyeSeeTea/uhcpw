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

The `/glossary` page SHALL display terms alphabetically, with definitions expanded by default and available through native expandable controls. Each definition SHALL start with an upper-case letter, whatever the case of the stored content. Search SHALL match terms and definitions without regard to case or accents, and an initial-letter filter SHALL narrow the displayed terms. Users SHALL be able to clear active filters and expand or collapse all definitions using controls above the entries.

#### Scenario: Search and letter filter are combined

- **WHEN** a user enters a search and selects an initial letter
- **THEN** only terms matching both filters are displayed
- **AND** the page indicates when no entries match

#### Scenario: Definition is expanded

- **WHEN** a user opens a term's definition
- **THEN** its definition is visible and the control offers to hide it

#### Scenario: Stored definition starts in lower case

- **WHEN** a glossary definition is stored starting with a lower-case letter
- **THEN** the page shows it starting with the same letter in upper case

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

Entries and definitions SHALL be present in the generated HTML. Interactive filtering and bulk expansion SHALL enhance the static content when JavaScript is available. Each entry SHALL have a unique fragment link on its term, with no separate link symbol, and a glossary entry reached by its fragment SHALL open its definition when JavaScript is available.

#### Scenario: JavaScript is unavailable

- **WHEN** either page is opened without JavaScript
- **THEN** its entries and their meanings or expandable definitions remain accessible

#### Scenario: Glossary entry link is opened

- **WHEN** a user opens a glossary entry fragment with JavaScript enabled
- **THEN** the entry is revealed and its definition is expanded

#### Scenario: Term is followed as a link

- **WHEN** a user follows the link on a glossary term or an abbreviation
- **THEN** the browser navigates to that entry's fragment

### Requirement: Reference pages follow the approved presentation

The pages SHALL use the shared site layout and title banner, rounded search controls and buttons, and unshaded rows separated by lines. The search field SHALL sit on the bottom edge of the title banner, as on the Resources page. Both pages SHALL show entries the same way: the term as a heading in the Methods page's heading style, with its definition or meaning below, in two columns on desktop with the Methods page's column widths and spacing, ordered left to right across rows, and one column at widths of 600px or less. Abbreviation category headings SHALL use the Methods page's heading style, with no background box. Both pages SHALL offer the site's floating back-to-top button once the user scrolls down. On mobile, the initial-letter filter SHALL use a compact selector. Its definition controls SHALL follow the Methods page's read-more treatment. Pages SHALL not display introductory copy or entry totals and subtotals.

#### Scenario: Reference page renders

- **WHEN** a reference page is displayed
- **THEN** it has a page title and its reference controls and entries
- **AND** it has no introductory paragraph or entry counts

#### Scenario: Search field is in the banner

- **WHEN** a reference page is displayed with JavaScript enabled
- **THEN** its search field is centred on the bottom edge of the title banner

#### Scenario: User scrolls down

- **WHEN** a user scrolls down either reference page
- **THEN** the floating back-to-top button appears
- **AND** following it returns the user to the top of the page

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

