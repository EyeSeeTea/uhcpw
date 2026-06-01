## Why

The Astro mobile header menu currently flattens "Regional overview" and "Countries & areas" into plain links, dropping behavior the React SPA has on small viewports: clicking "Regional overview" should open a disclaimer modal (sourced from the DHIS2 CMS), and "Countries & areas" should expand inline into a list of countries with a caret indicator. Users navigating on phones lose discoverability of the country list and never see the regional disclaimer.

## What Changes

- Modify `MobileNav.astro` so menu items with `children` render as an inline accordion (caret toggle) that expands to show the child links — applied to "Countries & areas".
- Add a "Regional overview" mobile entry that opens a modal disclaimer instead of being a plain link or accordion. Closing the modal returns focus to the trigger.
- Extend `general-content.ts` to expose `regionalPageMobilePopUp` (disclaimer markdown, button text, button URL) from the existing shared `GeneralContent` entity, fetched at build time.
- Add a small client-side script to manage accordion expand/collapse state and modal open/close (native `<dialog>` element, no new dependencies).
- Render the modal markdown content using the existing markdown renderer used in the Astro app.
- Update `header-chrome` spec to describe the new mobile submenu and modal behavior.

## Goals

- Visual and behavioral parity with the SPA's mobile menu for "Regional overview" and "Countries & areas".
- Zero new runtime dependencies; reuse `GeneralContent` data already fetched server-side.
- Keep the implementation framework-free (Astro + minimal vanilla JS), consistent with the existing `MobileNav.astro` pattern.

## Non-Goals

- Refactoring `DesktopNav.astro` (desktop already has carets and dropdowns).
- Replacing the Astro mobile menu's `<details>` toggle with a Material-UI Drawer.
- Adding the regional submenu accordion variant the SPA shows when already on the regional page (the user-visible behavior to replicate is: regional → modal, countries → accordion).
- Building a generic modal component library; the mobile disclaimer modal can live inline in the header.

## User Impact

- Mobile users gain access to the country list directly from the header (currently only reachable from the desktop dropdown or by typing URLs).
- Mobile users see the regional disclaimer the SPA already shows them, keeping CMS-managed messaging consistent across builds.
- No change to desktop navigation.

## Compatibility

- Backwards compatible at the data layer: `regionalPageMobilePopUp` already exists on the shared `GeneralContent` entity; only the Astro `general-content.ts` projection needs to expose it.
- `NavItem.children` is already populated for "Regional overview" and "Countries & areas"; the regional children are unused after this change but kept for desktop.
- No URL or routing changes.

## Rollback Plan

Revert the `MobileNav.astro` changes, the `general-content.ts` field addition, and the `header-chrome` spec delta. No data migrations or build-config changes are involved.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `header-chrome`: mobile navigation gains submenu accordion behavior for items with children, and a modal disclaimer trigger for "Regional overview".

## Impact

- **Code**: `astro-app/src/components/layout/MobileNav.astro` (template, styles, script), `astro-app/src/data/general-content.ts` (expose mobile popup fields), `astro-app/src/components/layout/Header.astro` (pass popup data to `MobileNav`).
- **Specs**: `openspec/specs/header-chrome/spec.md` (modify "Header displays mobile navigation" requirement, add submenu + modal scenarios).
- **Data**: relies on existing DHIS2 data elements `jp8z6xMOMh3` (disclaimer), `IoywoGPlD3X` (button text), `qj7OHq9zy30` (button URL); no new fetches.
- **Dependencies**: none added.
- **Tests**: visual-compare run against the SPA mobile menu at the small breakpoint to verify parity.
