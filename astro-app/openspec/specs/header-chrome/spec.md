## ADDED Requirements

### Requirement: Header displays logos
The Header SHALL display the WHO logo and the UHC Data Portal logo. Both logos SHALL link to the site home page (`/`). Logo sizes SHALL match the SPA (~82px WHO, ~72px UHC on desktop).

#### Scenario: Logos render with correct links
- **WHEN** the Header renders
- **THEN** the WHO logo is visible and links to `/`
- **AND** the UHC logo is visible and links to `/`

#### Scenario: Logos visible on mobile
- **WHEN** the viewport is 960px or narrower
- **THEN** both logos remain visible (WHO logo at reduced size)

### Requirement: Header displays top bar with office title and reference links
The Header SHALL display a gradient top bar containing the office title "WHO Barcelona Office for Health Systems Financing" (white text, 16px) on the left and "Abbreviations" and "Glossary" links (black text) on the right. The Abbreviations and Glossary link URLs SHALL be sourced from `GeneralContent` fetched at build time, not hardcoded. If a URL is not available, the corresponding link SHALL not be rendered.

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

### Requirement: Header displays desktop navigation
On viewports wider than the small-screen breakpoint (960px), the Header SHALL display a horizontal navigation bar with all SPA navigation items: Indicator explorer, Policy explorer, Regional overview, Countries & areas, Methods, Resources, About us.

#### Scenario: Desktop nav visible on wide viewport
- **WHEN** the viewport width is greater than 960px
- **THEN** the desktop navigation bar is visible with all 7 navigation items

#### Scenario: Desktop nav hidden on narrow viewport
- **WHEN** the viewport width is 960px or less
- **THEN** the desktop navigation bar is hidden

### Requirement: Dropdown menus for Regional overview and Countries & areas
The "Regional overview" and "Countries & areas" navigation items SHALL be buttons (not links) with a caret icon. Clicking the button SHALL toggle a dropdown menu with hardcoded items. Clicking outside the menu or clicking another dropdown SHALL close the current menu. The caret SHALL rotate when the menu is open. Items link to placeholder pages (dynamic data population is deferred).

Regional overview items: European Union (EU), Western Balkans (WB), Eastern Europe & Central Asia (EECA), European Region (ER).

Countries & areas items: Albania, Belgium, BIH (the Federation of Bosnia and Herzegovina), BIH (the Republika Srpska), Bulgaria, Croatia, Estonia, Georgia, Kyrgyzstan, Monaco, Montenegro, North Macedonia, Republic of Moldova, Romania, Spain, Tajikistan, Ukraine, Kosovo*.

#### Scenario: Dropdown opens on click
- **WHEN** the user clicks "Regional overview" or "Countries & areas"
- **THEN** a dropdown menu appears below the button with the corresponding items
- **AND** the caret icon rotates to point upward

#### Scenario: Dropdown closes on outside click
- **WHEN** the dropdown is open and the user clicks outside of it
- **THEN** the dropdown menu closes and the caret rotates back down

#### Scenario: Only one dropdown open at a time
- **WHEN** the "Regional overview" dropdown is open and the user clicks "Countries & areas"
- **THEN** the "Regional overview" dropdown closes and the "Countries & areas" dropdown opens

### Requirement: Header displays mobile navigation
On viewports at or below the small-screen breakpoint (960px), the Header SHALL display a hamburger menu icon that toggles a mobile navigation menu containing all navigation items.

#### Scenario: Mobile menu toggle
- **WHEN** the viewport is 960px or narrower and the user activates the hamburger icon
- **THEN** the mobile navigation menu expands showing all navigation items

#### Scenario: Mobile menu closes on link click
- **WHEN** the mobile menu is open and the user clicks a navigation link
- **THEN** the mobile menu closes

### Requirement: Header is responsive
The Header SHALL adapt its layout across breakpoints without horizontal overflow or content clipping. The header SHALL NOT have a box-shadow at the bottom.

#### Scenario: No overflow at tablet width
- **WHEN** the viewport is between 600px and 960px
- **THEN** the header content fits without horizontal scrollbar

#### Scenario: No overflow at mobile width
- **WHEN** the viewport is below 600px
- **THEN** the header content fits without horizontal scrollbar

### Requirement: Header hides UHC home logo on home page desktop
The Header SHALL hide the UHC Data Portal logo (`uhcw-home-logo.png`) on desktop viewports when the current page is the home page (`/`). On mobile viewports or on non-home pages, the logo SHALL be visible. This matches the React SPA behavior.

#### Scenario: UHC logo hidden on desktop home page
- **WHEN** the current page is `/` and the viewport is wider than 960px
- **THEN** the UHC Data Portal logo is not visible

#### Scenario: UHC logo visible on desktop non-home page
- **WHEN** the current page is `/about` and the viewport is wider than 960px
- **THEN** the UHC Data Portal logo is visible

#### Scenario: UHC logo visible on mobile home page
- **WHEN** the current page is `/` and the viewport is 960px or narrower
- **THEN** the UHC Data Portal logo is visible

### Requirement: DesktopNav uses scoped styles
DesktopNav.astro SHALL use Astro scoped styles instead of `is:global`, with selective `:global()` only for dynamic state classes toggled by scripts.

#### Scenario: Styles are scoped by default
- **WHEN** DesktopNav renders
- **THEN** its `<style>` block does NOT use `is:global`

#### Scenario: Dynamic state class remains global
- **WHEN** the dropdown script toggles the `.open` class
- **THEN** the `.open` selector uses `:global(.open)` within the scoped style block

### Requirement: Navigation items from shared data
DesktopNav and MobileNav SHALL import navigation items from `data/navigation.ts` instead of defining them inline.

#### Scenario: DesktopNav uses shared data
- **WHEN** DesktopNav renders nav links
- **THEN** it imports `navItems` from `data/navigation.ts`

#### Scenario: MobileNav uses shared data
- **WHEN** MobileNav renders nav links
- **THEN** it imports `navItems` from `data/navigation.ts`
