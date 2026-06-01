## ADDED Requirements

### Requirement: Home page renders map and content sections in order
The `/` page SHALL render, in this order on desktop: map section, mobile card grid (hidden via CSS), explorers section, analysis section, methods section, resources section, and a fixed newsletter button. Build-time DHIS2 content populates every section.

#### Scenario: Desktop page structure
- **WHEN** the `/` page is rendered at viewport >= 960px
- **THEN** the DOM contains the map section, then the desktop sections wrapper (`display: block`) holding explorers, analysis, methods and resources in that order, then the newsletter button

#### Scenario: Mobile page structure
- **WHEN** the `/` page is rendered at viewport < 960px
- **THEN** the mobile card grid is visible, the desktop sections wrapper is hidden (`display: none`), and the map and newsletter button remain visible

### Requirement: Shared section header pattern
The page SHALL provide a reusable `SectionHeader` component used by explorers, analysis, methods, and resources sections. The header supports an optional subtitle (increasing the header height from 80px to 150px), an optional bubble SVG decoration positioned left or right, and an optional link wrapper around the title.

#### Scenario: Header with subtitle
- **WHEN** a section renders `SectionHeader` with a subtitle prop
- **THEN** the header is 150px tall and contains the title (centered) above the subtitle

#### Scenario: Header without subtitle
- **WHEN** a section renders `SectionHeader` without a subtitle
- **THEN** the header is 80px tall with the title vertically centered

### Requirement: Explorers section — two colored columns
The explorers section SHALL render as two 50/50 columns on desktop (stacked on mobile at < 960px): left column with orange background (`#fe8c4f`) containing the Indicator Explorer icon, text and CTA; right column with blue background (`#0089d6`) containing the Policy Explorer icon, text and CTA. Both CTAs are white pill buttons (`border-radius: 30px`) with text colored by the section's accent.

#### Scenario: Responsive stacking
- **WHEN** the viewport is < 960px
- **THEN** the two explorer columns stack vertically

### Requirement: Analysis section — two colored columns
The analysis section SHALL render as two 50/50 columns on desktop: left column dark blue (`#0360a6`) for "Regional overview" with a white CTA; right column green (`#4fad56`) for "Countries & Areas" with a green CTA. Both columns render a positioned bubble pattern background and stack at < 960px.

#### Scenario: Two columns with correct backgrounds
- **WHEN** the analysis section renders at desktop width
- **THEN** the left column has `background-color: #0360a6` with a white CTA and the right column has `background-color: #4fad56` with a green CTA

#### Scenario: Mobile stacking
- **WHEN** the viewport is < 960px
- **THEN** the two analysis columns stack vertically

### Requirement: Methods section — three colored columns
The methods section SHALL render as three equal columns on desktop: column 1 green gradient (`linear-gradient(90deg, rgba(79,172,86,1) 0%, rgba(161,238,167,1) 100%)`), column 2 orange (`#fe8c4f`) with bubble pattern, column 3 blue (`#0360a6`) with bubble pattern. Each column renders a `SectionBlock` (title + description, `font-weight: 300`, max-width 400px) fed from `homePageContent.methods.column1/2/3`. The section header links to `homePageContent.methods.buttonLink`.

#### Scenario: Three columns with correct backgrounds
- **WHEN** the methods section renders at desktop width
- **THEN** column 1 has the green gradient background, column 2 is orange, column 3 is blue, and each column renders its `SectionBlock` with the title and text from the matching `homePageContent.methods.columnN`

#### Scenario: Section header links to methods page
- **WHEN** the user clicks the methods section header
- **THEN** the browser navigates to `homePageContent.methods.buttonLink`

### Requirement: Newsletter button fixed to the viewport
The page SHALL render a fixed-position newsletter button at `inset-block-end: 0; inset-inline-end: 20%` with orange background (`#ff8d4e`), white text, rounded top corners and a box shadow. The button links to `homePageContent.newsletter.buttonLink` with `target="_blank"`. On viewports < 600px, `inset-inline-end` adjusts to 10%.

#### Scenario: Fixed position at desktop
- **WHEN** the page renders at viewport >= 600px
- **THEN** the newsletter button is at `inset-block-end: 0; inset-inline-end: 20%` with the orange background

#### Scenario: Repositions on small mobile
- **WHEN** the viewport is < 600px
- **THEN** the newsletter button's `inset-inline-end` is 10%

### Requirement: Orange gradient section dividers
The page SHALL render 20px-tall orange gradient dividers (`linear-gradient(90deg, #FF9355 1.8%, #FFBC88 100%)`) between major sections, matching the SPA's `Divider` component.

#### Scenario: Divider appearance
- **WHEN** a `SectionDivider` renders
- **THEN** it is 20px tall with the specified linear gradient

### Requirement: Static sections ship zero JS
The explorers, analysis, methods, resources, newsletter, and divider components SHALL be authored as `.astro` components with no client directives, contributing zero JavaScript to the page bundle.

#### Scenario: Bundle inspection
- **WHEN** `astro build` completes and the emitted `/index.html` is inspected
- **THEN** only the map island contributes hydrated JavaScript; all content sections are static HTML with scoped CSS
