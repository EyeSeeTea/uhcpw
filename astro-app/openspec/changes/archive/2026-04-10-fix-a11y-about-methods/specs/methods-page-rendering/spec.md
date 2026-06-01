## MODIFIED Requirements

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

### Requirement: Method section with expand/collapse

Each method section SHALL display the section name as an **H2** heading, followed by the short text (rendered as HTML from markdown). A "Read more" toggle SHALL expand to show the full text content. When expanded, a "Read less" toggle SHALL collapse back to the short text. The toggle MUST use native HTML `<details>`/`<summary>` elements — no client-side JavaScript.

#### Scenario: Method section headings are H2
- **WHEN** the Methods page loads
- **THEN** each method section name is rendered as an `<h2>` element

#### Scenario: Method section initially collapsed
- **WHEN** the Methods page loads
- **THEN** each method section shows only the section name and short text with a "Read more" control

#### Scenario: Expanding a method section
- **WHEN** the user clicks "Read more" on a method section
- **THEN** the full method text is revealed and the control changes to "Read less"

#### Scenario: Collapsing an expanded method section
- **WHEN** the user clicks "Read less" on an expanded method section
- **THEN** the section collapses back to showing only the short text

## ADDED Requirements

### Requirement: Methods page heading hierarchy is sequential
The Methods page SHALL have a sequential heading hierarchy with no skipped levels. The page title SHALL be H1, and method section names SHALL be H2.

#### Scenario: No skipped heading levels
- **WHEN** the Methods page is rendered
- **THEN** the heading hierarchy is: H1 (page title) → H2 (method section names)
- **AND** no heading level is skipped

#### Scenario: Visual appearance unchanged
- **WHEN** the heading tags are changed
- **THEN** the visual appearance of all headings remains identical to the previous rendering via CSS class selectors
