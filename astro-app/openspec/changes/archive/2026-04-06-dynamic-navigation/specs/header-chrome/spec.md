## MODIFIED Requirements

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
