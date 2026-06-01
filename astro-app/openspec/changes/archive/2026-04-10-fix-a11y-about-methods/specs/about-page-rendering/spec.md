## MODIFIED Requirements

### Requirement: Title banner with office name
The page SHALL display a title banner with the text "WHO Barcelona Office for Health Systems Financing" as an **H1** heading on a gradient-primary-2 background with white text.

#### Scenario: Title banner renders with H1
- **WHEN** the `/about` page is rendered
- **THEN** a banner with an **H1** heading "WHO Barcelona Office for Health Systems Financing" is visible at the top with `gradientPrimary2` background and white text

#### Scenario: Page has exactly one H1
- **WHEN** the `/about` page is rendered
- **THEN** the document contains exactly one `<h1>` element

### Requirement: Team section renders grid of person cards
The team section SHALL display an **H2** title "The WHO Barcelona Office team", an **H3** subtitle "Staff and consultants", and a responsive grid of person cards for all office team members, sorted alphabetically by first name.

#### Scenario: Team section heading hierarchy
- **WHEN** the team section renders
- **THEN** "The WHO Barcelona Office team" is an `<h2>` element
- **AND** "Staff and consultants" is an `<h3>` element

#### Scenario: Team members sorted by first name
- **WHEN** team data is fetched and rendered
- **THEN** person cards appear in ascending alphabetical order by first name

#### Scenario: Team grid responsive behavior
- **WHEN** viewport is >= 960px
- **THEN** team cards are arranged in a multi-column grid (auto-fill)
- **WHEN** viewport is < 960px
- **THEN** team cards are arranged in a 2-column grid (xs=6)

### Requirement: Experts section renders as a React island
The experts network section SHALL be rendered as a React island with `client:only="react"`. The section title SHALL be an **H2** and the subtitle SHALL be an **H3**.

#### Scenario: Experts section heading hierarchy
- **WHEN** the experts section renders
- **THEN** the experts title is an `<h2>` element
- **AND** the experts subtitle is an `<h3>` element

#### Scenario: Experts island hydrates in browser
- **WHEN** the page loads in a browser
- **THEN** the experts section becomes interactive (TreeSelector is usable) after JS hydrates

#### Scenario: Static sections ship zero JS
- **WHEN** the built page is inspected
- **THEN** only the experts island contributes to the page's JavaScript bundle; header and team sections have no associated JS

## ADDED Requirements

### Requirement: About page heading hierarchy is sequential
The `/about` page SHALL have a sequential heading hierarchy with no skipped levels. The page title SHALL be H1, section titles SHALL be H2, and subtitles SHALL be H3.

#### Scenario: No skipped heading levels
- **WHEN** the `/about` page is rendered
- **THEN** the heading hierarchy is: H1 (page title) → H2 (section titles) → H3 (subtitles)
- **AND** no heading level is skipped (e.g., no H1 → H3 without H2)

#### Scenario: Visual appearance unchanged
- **WHEN** the heading tags are changed
- **THEN** the visual appearance of all headings remains identical to the previous rendering via CSS class selectors
