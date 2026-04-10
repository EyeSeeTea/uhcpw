## MODIFIED Requirements

### Requirement: Header displays mobile navigation
On viewports at or below the small-screen breakpoint (960px), the Header SHALL display a hamburger menu icon that toggles a mobile navigation menu containing all navigation items. Items that have a `children` list (e.g., "Countries & areas") SHALL render as an inline accordion with a caret indicator that, when activated, expands the menu in place to show the child links. The "Regional overview" item SHALL render as a button that opens a modal disclaimer dialog instead of navigating directly or expanding an accordion. Plain items without children SHALL remain as direct links.

#### Scenario: Mobile menu toggle
- **WHEN** the viewport is 960px or narrower and the user activates the hamburger icon
- **THEN** the mobile navigation menu expands showing all navigation items

#### Scenario: Mobile menu closes on link click
- **WHEN** the mobile menu is open and the user clicks a plain (non-accordion, non-modal) navigation link
- **THEN** the mobile menu closes

#### Scenario: Countries & areas expands inline with caret
- **WHEN** the mobile menu is open and the user taps "Countries & areas"
- **THEN** the item expands inline to show the list of country links
- **AND** a caret next to the label rotates to indicate the expanded state
- **AND** tapping the label again collapses the list

#### Scenario: Countries & areas list is scrollable when long
- **WHEN** the "Countries & areas" submenu is expanded and contains more items than fit in the viewport
- **THEN** the submenu panel is vertically scrollable without forcing the page to scroll horizontally

#### Scenario: Country link navigates and closes the menu
- **WHEN** the user taps a country link inside the expanded "Countries & areas" submenu
- **THEN** the browser navigates to that country page
- **AND** the mobile menu closes

#### Scenario: Regional overview opens disclaimer modal
- **WHEN** the user taps "Regional overview" in the mobile menu
- **THEN** a modal dialog opens displaying the regional disclaimer text from `GeneralContent.regionalPageMobilePopUp`
- **AND** the underlying mobile menu collapses
- **AND** the modal is rendered above page content with a backdrop

#### Scenario: Regional overview modal contains call-to-action button
- **WHEN** the regional disclaimer modal is open and `GeneralContent.regionalPageMobilePopUp` provides `buttonText` and `url`
- **THEN** the modal displays a button labelled with `buttonText` linking to `url`

#### Scenario: Regional overview modal closes via close button
- **WHEN** the regional disclaimer modal is open and the user activates the close button
- **THEN** the modal closes
- **AND** keyboard focus returns to the mobile menu toggle (hamburger)

#### Scenario: Regional overview modal closes via Escape key
- **WHEN** the regional disclaimer modal is open and the user presses the Escape key
- **THEN** the modal closes
- **AND** the outer mobile menu remains in its previous (collapsed) state
- **AND** keyboard focus returns to the mobile menu toggle (hamburger)

#### Scenario: Regional overview falls back to a plain link when disclaimer data is missing
- **WHEN** `GeneralContent.regionalPageMobilePopUp` is unavailable at build time
- **THEN** the "Regional overview" mobile entry renders as a plain link to `/regional-overview`
- **AND** no modal is rendered in the DOM

#### Scenario: Outer menu does not close while interacting with submenu
- **WHEN** the mobile menu is open and the user taps the "Countries & areas" caret to expand it
- **THEN** the outer mobile menu remains open
