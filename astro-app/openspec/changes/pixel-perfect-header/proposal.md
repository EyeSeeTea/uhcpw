## Why

The Astro header has visual discrepancies compared to the React SPA that break the goal of pixel-perfect parity. Desktop navigation items have narrower horizontal margins (8px vs 16px) and the top toolbar right padding differs (64px vs 60px). On mobile, the "Countries & areas" submenu expands inline as an accordion, while the SPA opens it as a separate floating popup menu — a fundamentally different UX pattern.

## What Changes

- Fix desktop nav item horizontal margins from `8px` to `16px` to match the SPA's `MenuButton` styled component (`margin: 16px 16px`).
- Fix top toolbar right padding from `64px` to `60px` to match the SPA's `paddingRight: theme.spacing(7.5)`.
- Replace the inline `<details>` accordion for "Countries & areas" on mobile with a separate floating popup menu that matches the SPA's `MobileMenuSubItem` behavior (a scrollable popup anchored to the toggle button).

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `header-chrome`: Desktop nav item spacing changes and mobile "Countries & areas" submenu behavior changes from inline accordion to floating popup menu.

## Impact

- **Files affected**: `Header.astro`, `DesktopNav.astro`, `MobileNav.astro`
- **Visual**: Desktop header spacing will shift slightly wider between nav items; mobile country list will appear as a popup overlay instead of expanding the menu height.
- **Behavior**: Mobile "Countries & areas" tap will open a separate scrollable popup rather than expanding inline. Close-on-outside-click and close-on-selection behavior must be preserved.
- **No breaking changes** to navigation data, URLs, or build process.

## Goals

- Achieve pixel-perfect spacing parity with the SPA header on desktop viewports.
- Match the SPA's mobile UX for the "Countries & areas" submenu (floating popup).

## Non-goals

- Refactoring header architecture or component structure beyond what's needed for these fixes.
- Changing the "Regional overview" mobile behavior (already uses a modal dialog matching the SPA).
- Adding new navigation items or changing navigation data.

## Compatibility

All changes are CSS value adjustments and a mobile submenu rendering change. No API, data, or URL changes. Fully backward-compatible.

## Rollback plan

Revert the CSS margin/padding values and restore the `<details>` accordion for "Countries & areas" in `MobileNav.astro`.
