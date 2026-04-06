## ADDED Requirements

### Requirement: About page renders three sections in order
The `/about` page SHALL render three sections in this order: office header, team grid, experts network. Each section is separated by an orange gradient divider (matching the SPA's `GradientDividerOrange`).

#### Scenario: Page structure matches SPA layout
- **WHEN** the `/about` page is rendered
- **THEN** the page contains: a title banner, an orange gradient divider, the office header section, a team section, an orange gradient divider, and the experts network section — in that order

### Requirement: Title banner with office name
The page SHALL display a title banner with the text "WHO Barcelona Office for Health Systems Financing" on a gradient-primary-2 background with white text.

#### Scenario: Title banner renders
- **WHEN** the `/about` page is rendered
- **THEN** a banner with the heading "WHO Barcelona Office for Health Systems Financing" is visible at the top with `gradientPrimary2` background and white text

### Requirement: Office header section with image and text
The header section SHALL display the office image (linked to the video URL, opening in a new tab), a caption, and the office description text rendered as markdown. The layout is two columns on desktop (image left, text right) and single column on mobile.

#### Scenario: Office image links to video
- **WHEN** the office header renders with valid `officeInfo`
- **THEN** the office image is wrapped in an `<a>` tag pointing to `officeInfo.officeVideo` with `target="_blank"`

#### Scenario: Office text renders as markdown
- **WHEN** the office header renders
- **THEN** `officeInfo.officeText` is rendered as HTML from markdown

#### Scenario: Responsive layout collapses
- **WHEN** the viewport is <= 959px
- **THEN** the image and text stack vertically (single column)

### Requirement: Team section renders grid of person cards
The team section SHALL display a title "The WHO Barcelona Office team", subtitle "Staff and consultants", and a responsive grid of person cards for all office team members, sorted alphabetically by first name.

#### Scenario: Team members sorted by first name
- **WHEN** team data is fetched and rendered
- **THEN** person cards appear in ascending alphabetical order by first name

#### Scenario: Team grid responsive behavior
- **WHEN** viewport is >= 960px
- **THEN** team cards are arranged in a multi-column grid (auto-fill)
- **WHEN** viewport is < 960px
- **THEN** team cards are arranged in a 2-column grid (xs=6)

### Requirement: Experts section renders as a React island
The experts network section SHALL be rendered as a React island with `client:only="react"` to avoid SSR issues with Material-UI dependencies. It includes the TreeSelector for country filtering and a grid of expert person cards.

#### Scenario: Experts island hydrates in browser
- **WHEN** the page loads in a browser
- **THEN** the experts section becomes interactive (TreeSelector is usable) after JS hydrates

#### Scenario: Static sections ship zero JS
- **WHEN** the built page is inspected
- **THEN** only the experts island contributes to the page's JavaScript bundle; header and team sections have no associated JS

### Requirement: Orange gradient dividers
The page SHALL render orange gradient dividers (linear-gradient from `rgb(255, 141, 78)` to `rgb(255, 223, 190)`, 20px height) between the title/header sections and between the team/experts sections.

#### Scenario: Dividers match SPA appearance
- **WHEN** the page renders
- **THEN** two orange gradient dividers are visible with the specified gradient and height
