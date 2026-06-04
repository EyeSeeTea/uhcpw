## ADDED Requirements

### Requirement: Build-time data fetching produces static HTML with real data
The system SHALL fetch data from DHIS2 at build time and bake it into static HTML output. No runtime API calls SHALL be made for data that was fetched during the build.

#### Scenario: Methods data fetched at build time
- **WHEN** `astro build` runs with valid DHIS2 credentials
- **THEN** the generated HTML SHALL contain method data fetched from `compositionRoot.method.get.execute()`

#### Scenario: About page data fetched at build time
- **WHEN** `astro build` runs with valid DHIS2 credentials
- **THEN** the generated HTML SHALL contain person data from `compositionRoot.about.getPersons.execute()` and office info from `compositionRoot.about.getOfficeInfo.execute()`

#### Scenario: Build fails gracefully when DHIS2 is unreachable
- **WHEN** `astro build` runs and the DHIS2 server is unreachable or credentials are invalid
- **THEN** the build SHALL fail with a clear error message indicating the DHIS2 connection problem

### Requirement: Validation test page
A test page (`src/pages/test-data.astro`) SHALL exist that renders fetched DHIS2 data as JSON to verify the end-to-end pipeline during development.

#### Scenario: Test page renders all data sources
- **WHEN** `astro dev` or `astro build` runs with valid credentials
- **THEN** `/test-data` SHALL display JSON output from `method.get`, `about.getPersons` (team and experts), and `about.getOfficeInfo`

#### Scenario: Test page uses no client-side JavaScript
- **WHEN** the test page is built
- **THEN** the output SHALL be pure static HTML with zero client-side JS bundles
