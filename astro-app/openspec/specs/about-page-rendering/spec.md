## ADDED Requirements

### Requirement: About page renders three sections in order
The `/about` page SHALL render three sections in this order: office header, team grid, experts network. Each section is separated by an orange gradient divider (matching the SPA's `GradientDividerOrange`).

#### Scenario: Page structure matches SPA layout
- **WHEN** the `/about` page is rendered
- **THEN** the page contains: a title banner, an orange gradient divider, the office header section, a team section, an orange gradient divider, and the experts network section — in that order

### Requirement: Title banner with office name
The page SHALL display a title banner with the text "WHO Barcelona Office for Health Systems Financing" as an **H1** heading on a gradient-primary-2 background with white text.

#### Scenario: Title banner renders with H1
- **WHEN** the `/about` page is rendered
- **THEN** a banner with an **H1** heading "WHO Barcelona Office for Health Systems Financing" is visible at the top with `gradientPrimary2` background and white text

#### Scenario: Page has exactly one H1
- **WHEN** the `/about` page is rendered
- **THEN** the document contains exactly one `<h1>` element

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
The team section SHALL display an **H2** title "The WHO Barcelona Office team", an **H3** subtitle "Staff and consultants", and a responsive grid of person cards for all office team members, sorted alphabetically by first name.

#### Scenario: Team members sorted by first name
- **WHEN** team data is fetched and rendered
- **THEN** person cards appear in ascending alphabetical order by first name

#### Scenario: Team grid responsive behavior
- **WHEN** viewport is >= 960px
- **THEN** team cards are arranged in a multi-column grid (auto-fill)
- **WHEN** viewport is < 960px
- **THEN** team cards are arranged in a 2-column grid (xs=6)

### Requirement: Experts section renders as a React island
The experts network section SHALL be rendered as a React island. The section title SHALL be an **H2** and the subtitle SHALL be an **H3**. It includes the TreeSelector for country filtering and a grid of expert person cards.

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

### Requirement: Orange gradient dividers
The page SHALL render orange gradient dividers (linear-gradient from `rgb(255, 141, 78)` to `rgb(255, 223, 190)`, 20px height) between the title/header sections and between the team/experts sections.

#### Scenario: Dividers match SPA appearance
- **WHEN** the page renders
- **THEN** two orange gradient dividers are visible with the specified gradient and height

### Requirement: OfficeHeader uses valid HTML img attributes
The OfficeHeader.astro component SHALL use CSS for image width instead of the invalid HTML `width="100%"` attribute.

#### Scenario: Image uses CSS width
- **WHEN** the office header image renders
- **THEN** it uses `style="width: 100%"` or a CSS class instead of the `width` HTML attribute

### Requirement: Aria labels use human-readable text
Components SHALL use human-readable text for `aria-label` attributes, not kebab-case identifiers.

#### Scenario: Methods page aria labels
- **WHEN** the methods page renders sections with aria-label
- **THEN** labels read as natural language (e.g., "Methods page header" not "methods-page-header")
## Requirements
### Requirement: Office header image is eagerly loaded with high fetch priority
The office image rendered by `OfficeHeader.astro` is the about page's hero element and SHALL be marked as a high-priority above-the-fold resource. The `<img>` SHALL declare `loading="eager"`, `fetchpriority="high"`, and `decoding="async"`. It SHALL NOT use `loading="lazy"`. It SHALL also declare intrinsic `width` and `height` attributes that match the actual dimensions of the build-time-optimized webp file, so the layout reserves the box before the bytes arrive.

#### Scenario: Office image is not lazy-loaded
- **WHEN** the `/about` page renders
- **THEN** the office image `<img>` does not have `loading="lazy"`
- **AND** it has `loading="eager"` and `fetchpriority="high"`

#### Scenario: Office image declares intrinsic dimensions
- **WHEN** the `/about` page renders
- **THEN** the office image `<img>` has numeric `width` and `height` attributes
- **AND** the `width:height` ratio matches the underlying webp file's dimensions

#### Scenario: Office image is the LCP candidate
- **WHEN** Chrome DevTools measures the LCP element on `/about` against the production build
- **THEN** the LCP element is the office image, not the header WHO logo

### Requirement: downloadOfficeImage returns intrinsic dimensions
`downloadOfficeImage` in `src/data/about/about-images.ts` SHALL return `{ src, width, height }` (not just a string), where `width` and `height` are read from the resized webp file's metadata via `sharp`. `about.astro` SHALL pass these dimensions through to `OfficeHeader.astro`.

#### Scenario: downloadOfficeImage returns dimensions
- **WHEN** `downloadOfficeImage` finishes processing a remote DHIS2 image
- **THEN** the returned object has `src`, `width`, and `height` fields
- **AND** `width` is 770 (the configured `OFFICE_IMAGE_OPTIONS.width`) or less
- **AND** `height` reflects the resized image's actual height

### Requirement: About page heading hierarchy is sequential
The `/about` page SHALL have a sequential heading hierarchy with no skipped levels. The page title SHALL be H1, section titles SHALL be H2, and subtitles SHALL be H3.

#### Scenario: No skipped heading levels
- **WHEN** the `/about` page is rendered
- **THEN** the heading hierarchy is: H1 (page title) → H2 (section titles) → H3 (subtitles)
- **AND** no heading level is skipped (e.g., no H1 → H3 without H2)

### Requirement: Office image matches SPA dimensions
The office image in the OfficeHeader component MUST render at the same visual size as the SPA, scaling proportionally to fill its grid column width.

#### Scenario: Desktop viewport
- **WHEN** the /about page is rendered at desktop width (>959px)
- **THEN** the office image width fills its grid column and height scales proportionally (no fixed height attribute distorting aspect ratio)

### Requirement: Text column spacing matches SPA
The `.text-column` content MUST have the same spacing and positioning relative to the image column as the SPA's MUI Grid layout.

#### Scenario: Desktop viewport
- **WHEN** the /about page is rendered at desktop width (>959px)
- **THEN** the gap between the image column and text column visually matches the SPA (MUI Grid spacing={5} equivalent), and the text content has equivalent inner padding to MUI Container maxWidth="sm"

