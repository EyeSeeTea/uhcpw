## MODIFIED Requirements

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
