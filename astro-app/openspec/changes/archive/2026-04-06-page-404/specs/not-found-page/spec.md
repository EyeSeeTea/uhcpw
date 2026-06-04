## ADDED Requirements

### Requirement: 404 page renders styled header banner
The 404 page SHALL display a header banner section with an orange background (`accentSecondary` / `#fb8c00`), containing the text "Page Not Found" in white and a decorative bubble pattern image overlay at 0.3 opacity.

#### Scenario: Desktop header banner
- **WHEN** a user visits a non-existent URL on a desktop viewport (>600px)
- **THEN** the page displays a header banner with orange background, left-aligned "Page Not Found" text (44px, white, font-weight 400), and a bubble pattern image positioned at the right side

#### Scenario: Mobile header banner
- **WHEN** a user visits a non-existent URL on a mobile viewport (<=600px)
- **THEN** the header banner reduces padding (30px 20px), the title font shrinks to 32px, and the bubble pattern image is hidden

### Requirement: 404 page renders error content section
The 404 page SHALL display a centered content section on a white background containing: a large "404" heading in orange (72px, bold), a descriptive paragraph "The page you are looking for does not exist or has been moved.", and a "Go to Homepage" button.

#### Scenario: Error content display
- **WHEN** a user views the 404 page
- **THEN** the page shows "404" in 72px bold orange text, the descriptive message in 18px grey-black text, and a styled button labeled "Go to Homepage"

#### Scenario: Mobile error content
- **WHEN** a user views the 404 page on a mobile viewport (<=600px)
- **THEN** the "404" text shrinks to 48px and the description text shrinks to 16px

### Requirement: Homepage navigation button
The 404 page SHALL include a "Go to Homepage" button that navigates the user to the site root (`/`). The button MUST be a plain anchor link (no client-side JavaScript required).

#### Scenario: User clicks Go to Homepage
- **WHEN** a user clicks the "Go to Homepage" button
- **THEN** the browser navigates to `/`

#### Scenario: Button styling
- **WHEN** the button is rendered
- **THEN** it displays with orange background (`#fb8c00`), white text, 12px/32px padding, 16px font size, and no text-transform

### Requirement: 404 page uses shared Layout
The 404 page SHALL be wrapped in the shared `Layout` component, rendering the standard Header and Footer chrome around the 404 content.

#### Scenario: Layout integration
- **WHEN** the 404 page is rendered
- **THEN** the page includes the site header with navigation and the site footer with contact information

### Requirement: 404 page SEO metadata
The 404 page SHALL set the page title to "UHC Watch - Page Not Found" via the SEO configuration.

#### Scenario: Page title
- **WHEN** the 404 page is rendered
- **THEN** the HTML `<title>` element contains "UHC Watch - Page Not Found"
