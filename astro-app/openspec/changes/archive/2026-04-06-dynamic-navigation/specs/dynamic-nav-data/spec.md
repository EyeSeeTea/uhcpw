## ADDED Requirements

### Requirement: Navigation data fetched from DHIS2 at build time
The navigation module SHALL export an async `getNavItems()` function that fetches countries and regions from DHIS2 via the server composition root and returns a `ReadonlyArray<NavItem>`.

#### Scenario: getNavItems returns complete navigation
- **WHEN** `getNavItems()` is called during build
- **THEN** it returns an array containing all 7 top-level nav items: Indicator explorer, Policy explorer, Regional overview, Countries & areas, Methods, Resources, About us
- **AND** "Regional overview" has a `children` array populated from DHIS2 regions
- **AND** "Countries & areas" has a `children` array populated from DHIS2 countries

### Requirement: Countries filtered to country-page entries only
The countries list SHALL include only countries where `isInCountryPage` is true, plus sub-regions (children of countries, e.g., BIH Federation and Republika Srpska).

#### Scenario: Non-country-page entries excluded
- **WHEN** DHIS2 returns a country with `isInCountryPage === false`
- **THEN** that country does not appear in the "Countries & areas" dropdown

#### Scenario: Sub-regions included
- **WHEN** a country has `children` (e.g., Bosnia and Herzegovina)
- **THEN** the children appear as separate entries in the "Countries & areas" dropdown

### Requirement: Countries sorted alphabetically with Kosovo last
The countries list SHALL be sorted alphabetically by name, with Kosovo forced to the end of the list.

#### Scenario: Alphabetical sort
- **WHEN** the countries list is built
- **THEN** entries are in case-insensitive alphabetical order, except Kosovo which appears last

### Requirement: Regions filtered to regional-page entries only
The regions list SHALL include only regions where `isInRegionalPage` is true.

#### Scenario: Non-regional-page entries excluded
- **WHEN** DHIS2 returns a region with `isInRegionalPage === false` (e.g., EU Candidate Countries)
- **THEN** that region does not appear in the "Regional overview" dropdown

### Requirement: Regions sorted in fixed display order
The regions list SHALL be sorted in this fixed order: European Union, Western Balkans, Eastern Europe & Central Asia, European Region. This matches the SPA's `REGIONS_ORDER`.

#### Scenario: Region display order
- **WHEN** the regions list is built
- **THEN** EU appears first, then WB, then EECA, then ER

### Requirement: Region labels include code
Each region label SHALL follow the format `"<name> (<code>)"`, matching the SPA's `useRegionFilterOptions` output.

#### Scenario: Region label format
- **WHEN** a region has name "European Union" and code "EU"
- **THEN** its nav item label is "European Union (EU)"

### Requirement: Navigation URLs match SPA format
Each nav item href SHALL be generated using the SPA's `formatCountryOrRegionParamName` function, producing root-level URLs (e.g., `/<FormattedName>`). This ensures URL parity with the React SPA.

#### Scenario: Simple country URL
- **WHEN** a country named "Albania" is fetched
- **THEN** its href is `/Albania`

#### Scenario: Multi-word country URL
- **WHEN** a country named "North Macedonia" is fetched
- **THEN** its href is `/NorthMacedonia`

#### Scenario: Kosovo URL strips asterisk
- **WHEN** Kosovo is fetched (displayed as "Kosovo*")
- **THEN** its href is `/Kosovo`

#### Scenario: BIH sub-region URLs
- **WHEN** the BIH sub-region "BIH (the Federation of Bosnia and Herzegovina)" is fetched
- **THEN** its href is `/BIH-FederationofBosniaandHerzegovina`

#### Scenario: Region URL strips code parentheses
- **WHEN** a region labeled "European Union (EU)" is fetched
- **THEN** its href is `/EuropeanUnion`

#### Scenario: EECA region URL uses special case
- **WHEN** a region labeled "Eastern Europe & Central Asia (EECA)" is fetched
- **THEN** its href is `/EasternEuropeAndCentralAsia`

### Requirement: NavItem type unchanged
The `NavItem` interface SHALL remain unchanged. The module SHALL continue to export the `NavItem` type for consumers.

#### Scenario: Type compatibility
- **WHEN** `getNavItems()` resolves
- **THEN** its return type is `ReadonlyArray<NavItem>` with the same shape as the previous static `navItems`

### Requirement: Static nav items preserved
The non-dynamic nav items (Indicator explorer, Policy explorer, Methods, Resources, About us) SHALL remain hardcoded with unchanged labels and hrefs.

#### Scenario: Static items unchanged
- **WHEN** `getNavItems()` resolves
- **THEN** the array includes `{ label: "Indicator explorer", href: "/indicator-explorer" }` and the other 4 static items with their original hrefs
