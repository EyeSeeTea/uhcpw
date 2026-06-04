## Why

The navigation menus in `data/navigation.ts` hardcode the list of countries, regions, and their URLs. The React SPA fetches these dynamically from DHIS2 at startup — countries from organisation units and regions from organisation unit groups — so the nav reflects whatever is configured in the backend. The Astro app should do the same at build time to stay in sync and avoid manual maintenance when countries or regions change.

## What Changes

- Replace the hardcoded `countries` and `regions` arrays in `data/navigation.ts` with data fetched from DHIS2 at build time via the existing server composition root.
- Create a build-time data loader that calls the SPA's `GetCountriesUseCase` and `GetRegionsUseCase` through the already-wired `composition-root.server.ts`.
- Apply the same sorting and filtering rules the SPA uses: countries alphabetical with Kosovo last, regions in a fixed display order, only items flagged for their respective pages.
- Keep the static nav items (Indicator explorer, Policy explorer, Methods, Resources, About us) unchanged.

## Goals

- Navigation menus match the SPA exactly, driven by the same DHIS2 data source.
- No manual updates needed when countries or regions are added/removed in DHIS2.

## Non-goals

- Client-side navigation fetching — this is a static site; data is fetched at build time only.
- Changing the navigation UI components (DesktopNav, MobileNav) beyond updating their data source.
- Adding new pages for countries or regions (those are separate concerns).

## User impact

End users see the same navigation items as the SPA. Content editors only need to update DHIS2 — the Astro build picks up changes automatically.

## Compatibility

- The `NavItem` type and `navItems` export signature remain unchanged — consumers are unaffected.
- Build now requires DHIS2 credentials (already required by other data fetchers in the project).

## Rollback plan

Revert the single commit. The hardcoded arrays can be restored from git history.

## Capabilities

### New Capabilities
- `dynamic-nav-data`: Build-time fetching of countries and regions from DHIS2 to populate navigation menus.

### Modified Capabilities
- `header-chrome`: The dropdown menu requirement changes from hardcoded items to dynamically-fetched items. The UI behavior is unchanged; only the data source changes.

## Impact

- `src/data/navigation.ts` — rewritten from static arrays to async build-time data loader.
- `src/infra/composition-root.server.ts` — no changes needed, already provides access to use cases.
- Header components (`DesktopNav.astro`, `MobileNav.astro`) — may need minor updates if `navItems` becomes async.
- Build process — adds DHIS2 API calls during build, increasing build time slightly.
