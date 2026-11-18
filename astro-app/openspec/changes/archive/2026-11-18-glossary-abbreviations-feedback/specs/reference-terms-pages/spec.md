## MODIFIED Requirements

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
