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
The "Regional overview" and "Countries & areas" navigation items SHALL be buttons (not links) with a caret icon. Clicking the button SHALL toggle a dropdown menu with dynamically-fetched items from DHIS2. Clicking outside the menu or clicking another dropdown SHALL close the current menu. The caret SHALL rotate when the menu is open.

Regional overview items: fetched from DHIS2 regions where `isInRegionalPage` is true, sorted in fixed display order (EU, WB, EECA, ER), with labels in `"name (code)"` format.

Countries & areas items: fetched from DHIS2 countries where `isInCountryPage` is true (including sub-regions), sorted alphabetically with Kosovo last.

#### Scenario: Dropdown opens on click
- **WHEN** the user clicks "Regional overview" or "Countries & areas"
- **THEN** a dropdown menu appears below the button with dynamically-fetched items
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
DesktopNav and MobileNav SHALL receive navigation items as a prop from the page layout, which fetches them via `getNavItems()` at build time. The items are no longer imported as a static constant.

#### Scenario: DesktopNav receives nav items as prop
- **WHEN** DesktopNav renders nav links
- **THEN** it uses `navItems` passed as a prop from the layout

#### Scenario: MobileNav receives nav items as prop
- **WHEN** MobileNav renders nav links
- **THEN** it uses `navItems` passed as a prop from the layout

#### Scenario: Layout fetches nav items at build time
- **WHEN** the base layout renders
- **THEN** it calls `getNavItems()` in its frontmatter and passes the result to DesktopNav and MobileNav
## Requirements
### Requirement: Header logos are served through Astro's image pipeline
The WHO logo and the UHC home logo in `Header.astro` SHALL be sourced from `src/assets/` and rendered with the Astro `<Image />` component, not as raw `<img src="/images/...png">` from the public directory. The generated `<img>` SHALL include explicit `width` and `height` attributes matching the rendered display size, and SHALL emit a `srcset` covering the responsive widths declared by the existing CSS breakpoints.

#### Scenario: WHO logo is optimized
- **WHEN** the Header renders the WHO logo
- **THEN** the rendered HTML contains an `<img>` whose `src`/`srcset` points to a hashed asset under `/_astro/` (not `/images/who-logo-blue.png`)
- **AND** the `<img>` has explicit `width` and `height` attributes
- **AND** the served format is `webp` (or `avif`) on browsers that accept it

#### Scenario: UHC logo is optimized
- **WHEN** the Header renders the UHC home logo
- **THEN** the rendered HTML contains an optimized `<img>` from the Astro image pipeline
- **AND** the served bytes for a 180×72 display size are an order of magnitude smaller than the original PNG

### Requirement: Header WHO logo is marked as a high-priority resource
Because the WHO logo is the LCP candidate on most pages, the `<Image />` for the header WHO logo SHALL declare `loading="eager"` and `fetchpriority="high"` so the browser fetches it before deferred scripts.

#### Scenario: WHO logo has high fetch priority
- **WHEN** the Header renders
- **THEN** the WHO logo `<img>` element has `fetchpriority="high"` and is not lazy-loaded

