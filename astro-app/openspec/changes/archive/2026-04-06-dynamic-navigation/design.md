## Context

The Astro app's `src/data/navigation.ts` currently exports a hardcoded `navItems` array with static country and region lists. The React SPA fetches this data dynamically from DHIS2 at startup via `GetCountriesUseCase` and `GetRegionsUseCase`. The Astro app already has a server composition root (`src/infra/composition-root.server.ts`) that wires up the SPA's use cases for build-time data fetching, used by the About page and Methods page.

The current navigation URLs use an Astro-specific scheme (`/countries/<slug>`, `/regional-overview/<slug>`) that differs from the SPA's root-level PascalCase format (`/Albania`, `/EuropeanUnion(EU)`). This Astro URL scheme must be preserved.

## Goals / Non-Goals

**Goals:**
- Fetch countries and regions from DHIS2 at build time to populate navigation dropdowns.
- Apply the same filtering and sorting rules as the SPA.
- Maintain the existing `NavItem` type and `navItems` export contract.

**Non-Goals:**
- Changing the URL scheme (keep `/countries/<slug>` and `/regional-overview/<slug>`).
- Modifying navigation UI components beyond consuming the new async data source.
- Generating actual country/region pages (separate concern).

## Decisions

### 1. Convert `navigation.ts` to an async data module

**Decision:** Replace the static arrays in `data/navigation.ts` with an async `getNavItems()` function that fetches from DHIS2 via the composition root, following the same pattern as `getAboutPageData()` in `data/about/about-data.ts`.

**Rationale:** This is the established pattern in the codebase. The About page already fetches countries from the same use case. Consistency reduces cognitive overhead.

**Alternative considered:** A separate data-fetching module that `navigation.ts` imports from. Rejected because it adds indirection for no benefit — the navigation module is the right place for this logic.

### 2. Slug generation for Astro URLs

**Decision:** Generate URL slugs by lowercasing the country/region name and replacing spaces/special characters with hyphens. Use a dedicated `toSlug()` helper within the navigation module. Do NOT reuse the SPA's `formatCountryOrRegionParamName` — it produces PascalCase for a different routing scheme.

**Rationale:** The Astro app's URL structure (`/countries/albania`, `/regional-overview/eu`) is intentionally different from the SPA. The slug logic is simple enough to not warrant importing SPA utilities.

**Special cases to handle:**
- Region codes in parentheses: `"European Union (EU)"` → slug `eu` (use the code, not the full name)
- BIH sub-regions: `"BIH (the Federation of Bosnia and Herzegovina)"` → slug `bih-federation`
- Kosovo: `"Kosovo*"` → slug `kosovo`
- `"Republic of Moldova"` → slug `moldova`

These match the existing hardcoded hrefs and must be preserved exactly.

### 3. Country filtering and sorting

**Decision:** Apply the SPA's rules:
- **Filter:** Only countries where `isInCountryPage === true`. Include sub-regions (BIH children) via `country.children`.
- **Sort:** Alphabetical by name, with Kosovo forced to the end (same as `App.tsx` lines 46-50).

### 4. Region filtering and sorting

**Decision:** Apply the SPA's rules:
- **Filter:** Only regions where `isInRegionalPage === true`.
- **Sort:** Fixed display order matching `REGIONS_ORDER`: EU → WB → EECA → ER.
- **Label format:** `"${region.name} (${region.code})"` — matches `useRegionFilterOptions.ts`.

### 5. Consumers become async at the Astro page level

**Decision:** Astro pages/layouts that use `navItems` will call `getNavItems()` in their frontmatter. The `NavItem` type export remains synchronous and unchanged. Components receive `navItems` as a prop.

**Data flow:**
```
Astro page frontmatter
  → getNavItems()
    → getServerCompositionRoot()
      → compositionRoot.countries.get.execute()
      → compositionRoot.regions.get.execute()
    → filter + sort + map to NavItem[]
  → pass navItems as prop to Layout
    → Layout passes to DesktopNav / MobileNav
```

**Rationale:** This matches how the About page passes data through. Astro components can't be async, so data must be fetched in page frontmatter and threaded down as props.

## Risks / Trade-offs

**[Build-time DHIS2 dependency]** → The build now requires a live DHIS2 connection for navigation. Mitigation: This is already the case for About and Methods pages. The composition root already handles credentials.

**[Slug mapping fragility]** → If a country name changes in DHIS2, the generated slug changes and breaks existing links. Mitigation: This is the same as the current hardcoded approach. A slug mapping table could be added later if needed, but is out of scope.

**[Multiple DHIS2 calls for same data]** → Countries are fetched both by navigation and by the About page. Mitigation: The composition root already caches the API instance. The use case results are not cached across calls, but build-time performance is acceptable. If needed later, a data-caching layer can be added.

## Open Questions

None — the approach is straightforward and follows established patterns.
