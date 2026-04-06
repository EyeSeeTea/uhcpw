## ADDED Requirements

### Requirement: Fetch all About page data at build time
The About page SHALL fetch team persons, expert persons, office info, countries, and general content at build time using the shared composition root. All fetches run in parallel via `Promise.all`.

#### Scenario: Build-time parallel data fetching
- **WHEN** `astro build` runs the About page
- **THEN** the following are fetched in parallel: `about.getPersons(true)`, `about.getPersons(false)`, `about.getOfficeInfo()`, `country.get()`, and `general.getContent()`

### Requirement: Map persons to PersonState with country names
The build-time code SHALL map each `Person` to a `PersonState` by resolving `countryId` to a `countryName` using the fetched countries list. If no matching country is found, `countryName` defaults to an empty string.

#### Scenario: Country name resolution
- **WHEN** a person has `countryId: "abc123"` and countries include `{ id: "abc123", name: "Spain" }`
- **THEN** the mapped PersonState has `countryName: "Spain"`

#### Scenario: Missing country fallback
- **WHEN** a person has `countryId: "unknown"` and no matching country exists
- **THEN** the mapped PersonState has `countryName: ""`

### Requirement: Sort team members by first name ascending
Team persons SHALL be sorted alphabetically by `firstName` in ascending order.

#### Scenario: Team sorting
- **WHEN** team persons are ["Carlos", "Ana", "Bruno"]
- **THEN** the sorted order is ["Ana", "Bruno", "Carlos"]

### Requirement: Sort experts by Kosovo-last, then country name, then first name
Expert persons SHALL be sorted with Kosovo experts appearing last, then by `countryName` ascending, then by `firstName` ascending.

#### Scenario: Kosovo experts sorted last
- **WHEN** experts include persons from "Spain" and "Kosovo"
- **THEN** all Spain experts appear before all Kosovo experts

### Requirement: Pre-compute TreeSelector options from countries
The build-time code SHALL transform the countries list into `TreeOption[]` using the same logic as `useMultiCountryOptionsV2`: each country gets parents based on its country groupings (filtering out income-based parents), with an "All countries and areas" root node.

#### Scenario: Country options structure
- **WHEN** countries are transformed to tree options
- **THEN** each option has `id`, `name`, `code`, and `parents` array including `{ id: "all", name: "All countries and areas" }` plus the country's grouping parents (prefixed with `parent-`)

### Requirement: Pre-compute parentSort groupings
The build-time code SHALL compute the `parentSort` array from `SORTED_COUNTRY_GROUPINGS` (prefixed with `parent-`) for the TreeSelector's sorting behavior.

#### Scenario: Parent sort order matches SPA
- **WHEN** the parentSort array is computed
- **THEN** it matches the order: `["all", ...SORTED_COUNTRY_GROUPINGS.map(g => "parent-" + g)]`
