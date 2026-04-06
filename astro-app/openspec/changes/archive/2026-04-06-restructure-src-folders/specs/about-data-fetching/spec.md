## MODIFIED Requirements

### Requirement: Fetch all About page data at build time
The About page SHALL fetch team persons, expert persons, office info, countries, and general content at build time using the shared composition root. All fetches run in parallel via `Promise.all`. Data-fetching modules SHALL reside in `src/data/about/`.

#### Scenario: Build-time parallel data fetching
- **WHEN** `astro build` runs the About page
- **THEN** the following are fetched in parallel: `about.getPersons(true)`, `about.getPersons(false)`, `about.getOfficeInfo()`, `country.get()`, and `general.getContent()`

#### Scenario: Data modules live in data/about/
- **WHEN** inspecting the location of about-data.ts and about-images.ts
- **THEN** they SHALL be at `src/data/about/about-data.ts` and `src/data/about/about-images.ts`
