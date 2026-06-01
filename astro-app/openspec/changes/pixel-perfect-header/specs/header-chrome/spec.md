## MODIFIED Requirements

### Requirement: Header displays top bar with office title and reference links
The Header SHALL display a gradient top bar containing the office title "WHO Barcelona Office for Health Systems Financing" (white text, 16px) on the left and "Abbreviations" and "Glossary" links (black text) on the right. The Abbreviations and Glossary link URLs SHALL be sourced from `GeneralContent` fetched at build time, not hardcoded. If a URL is not available, the corresponding link SHALL not be rendered. The top toolbar SHALL use asymmetric horizontal padding: `64px` on the left and `60px` on the right, matching the SPA's `theme.spacing(8)` / `theme.spacing(7.5)`.

#### Scenario: Top bar renders with title and links
- **WHEN** the Header renders on a desktop viewport
- **THEN** the office title is visible in white text on the left
- **AND** Abbreviations and Glossary links are visible in black text on the right

#### Scenario: Top bar on mobile hides reference links
- **WHEN** the viewport is 960px or narrower
- **THEN** the office title is centered in white text
- **AND** the Abbreviations and Glossary links are hidden

#### Scenario: Reference links use dynamic URLs from GeneralContent
- **WHEN** the Header renders and `GeneralContent` provides abbreviation and glossary URLs
- **THEN** the Abbreviations link href matches the `GeneralContent.abbreviations.url` value
- **AND** the Glossary link href matches the `GeneralContent.glossary.url` value

#### Scenario: Reference link hidden when URL is unavailable
- **WHEN** `GeneralContent.abbreviations.url` is null or undefined
- **THEN** the Abbreviations link is not rendered

#### Scenario: Top bar has correct asymmetric padding
- **WHEN** the Header renders on a desktop viewport wider than 500px
- **THEN** the top toolbar has `padding-left: 64px` and `padding-right: 60px`

### Requirement: Header displays desktop navigation
On viewports wider than the small-screen breakpoint (960px), the Header SHALL display a horizontal navigation bar with all SPA navigation items: Indicator explorer, Policy explorer, Regional overview, Countries & areas, Methods, Resources, About us. Navigation items SHALL have `margin: 16px 16px` (16px vertical, 16px horizontal) matching the SPA's button spacing.

#### Scenario: Desktop nav visible on wide viewport
- **WHEN** the viewport width is greater than 960px
- **THEN** the desktop navigation bar is visible with all 7 navigation items

#### Scenario: Desktop nav hidden on narrow viewport
- **WHEN** the viewport width is 960px or less
- **THEN** the desktop navigation bar is hidden

#### Scenario: Desktop nav items have correct margins
- **WHEN** the desktop navigation renders
- **THEN** each navigation item has `margin: 16px 16px`

### Requirement: Header displays mobile navigation
On viewports at or below the small-screen breakpoint (960px), the Header SHALL display a hamburger menu icon that toggles a mobile navigation menu containing all navigation items. Items that have a `children` list (e.g., "Countries & areas") SHALL render as a button that opens a floating popup menu overlay, matching the SPA's `MobileMenuSubItem` pattern. The popup SHALL be scrollable, positioned relative to the trigger button, and styled consistently with the mobile menu (blue background, white text). The "Regional overview" item SHALL render as a button that opens a modal disclaimer dialog instead of navigating directly or expanding an accordion. Plain items without children SHALL remain as direct links.

#### Scenario: Mobile menu toggle
- **WHEN** the viewport is 960px or narrower and the user activates the hamburger icon
- **THEN** the mobile navigation menu expands showing all navigation items

#### Scenario: Mobile menu closes on link click
- **WHEN** the mobile menu is open and the user clicks a plain (non-popup, non-modal) navigation link
- **THEN** the mobile menu closes

#### Scenario: Countries & areas opens floating popup
- **WHEN** the mobile menu is open and the user taps "Countries & areas"
- **THEN** a floating popup menu appears as an overlay anchored to the button
- **AND** the popup contains the list of country links
- **AND** the popup is scrollable with `max-height: 558px`

#### Scenario: Countries & areas popup closes on selection
- **WHEN** the "Countries & areas" popup is open and the user taps a country link
- **THEN** the browser navigates to that country page
- **AND** the popup closes
- **AND** the mobile menu closes

#### Scenario: Countries & areas popup closes on outside click
- **WHEN** the "Countries & areas" popup is open and the user taps outside the popup
- **THEN** the popup closes

#### Scenario: Countries & areas popup has correct styling
- **WHEN** the "Countries & areas" popup is open
- **THEN** the popup has a blue background (`accentPrimary`), white text, and a border of `1px solid #d3d4d5`

#### Scenario: Regional overview opens disclaimer modal
- **WHEN** the user taps "Regional overview" in the mobile menu
- **THEN** a modal dialog opens displaying the regional disclaimer text from `GeneralContent.regionalPageMobilePopUp`
- **AND** the underlying mobile menu collapses
- **AND** the modal is rendered above page content with a backdrop

#### Scenario: Regional overview modal closes via close button
- **WHEN** the regional disclaimer modal is open and the user activates the close button
- **THEN** the modal closes
- **AND** keyboard focus returns to the mobile menu toggle (hamburger)

#### Scenario: Regional overview modal has correct styling
- **WHEN** the regional disclaimer modal is open
- **THEN** the dialog has `max-width: min(600px, calc(100vw - 64px))`, matching MUI Dialog's responsive sizing
- **AND** the close button is positioned inside the dialog at `top: 10px; right: 10px` with a 44x44px touch target and a blue (`#035fa7`) circular icon
- **AND** the dialog body content has inner padding `16px 16px 8px` matching MUI DialogContent

#### Scenario: Mobile menu items have correct sizing
- **WHEN** the mobile menu is open
- **THEN** each menu item has `padding: 6px 16px`, `min-height: 48px`, `line-height: 1.5`, and `white-space: nowrap`, matching MUI MenuItem defaults

#### Scenario: Outer menu does not close while interacting with submenu popup
- **WHEN** the mobile menu is open and the user taps "Countries & areas" to open its popup
- **THEN** the outer mobile menu remains open
