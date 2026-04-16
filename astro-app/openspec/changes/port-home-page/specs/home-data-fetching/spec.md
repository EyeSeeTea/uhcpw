## ADDED Requirements

### Requirement: Fetch all home page data at build time
The home page SHALL fetch `HomePageContent`, countries, home-favourite resources, and `GeneralContent` at build time using the shared composition root. All fetches run in parallel via `Promise.all`.

#### Scenario: Build-time parallel data fetching
- **WHEN** `astro build` runs the home page
- **THEN** the following are fetched in parallel: `home.getPageContent()`, `countries.get()`, `resources.get({ isFavouriteHome: true })`, and `general.getContent()`

### Requirement: Deduplicate and prioritize home resources
The build-time code SHALL deduplicate resources by id, resolving conflicts with a fixed priority (`comparative-analysis` > `country-analysis` > `multimedia` > `news`), then sort by `favouriteHomeOrder` ascending, limit to the top 6, and map each resource to a serializable `HomeResourceState` (with computed `url` and human-readable `tagLabel`).

#### Scenario: Priority wins on duplicate ids
- **WHEN** two resources share the same id with kinds `"news"` and `"comparative-analysis"`
- **THEN** the deduplicated result keeps the `comparative-analysis` entry

#### Scenario: URL resolution by kind
- **WHEN** a resource has kind `"news"` or `"multimedia"`
- **THEN** its `url` is the resource's own `url` property
- **WHEN** a resource has kind `"comparative-analysis"` or `"country-analysis"`
- **THEN** its `url` is the first entry of its `links` array, or empty string if none

#### Scenario: Hard limit of 6
- **WHEN** more than 6 deduplicated resources exist
- **THEN** only the 6 with the lowest `favouriteHomeOrder` are returned

### Requirement: Build map markers from countries with summary data
The build-time code SHALL filter countries to those with a defined `summary` and transform the result into a GeoJSON `FeatureCollection<Point, Country>` using the existing `countriesToGeoJson()` utility.

#### Scenario: Countries without summary are excluded
- **WHEN** a country has no `summary` field
- **THEN** it does not appear in the rendered marker FeatureCollection

### Requirement: Download and rewrite resource card images at build time
The home-data module SHALL download the images referenced by each `HomeResourceState.imageOriginal` via the shared image downloader and rewrite the URLs to local bundled asset paths before returning the data to the page.

#### Scenario: Remote resource images rewritten to local paths
- **WHEN** a resource card has `imageOriginal` pointing to a DHIS2 API URL
- **THEN** the build downloads the image and the returned `imageOriginal` is a local `/assets/...` path

### Requirement: Return a fixed initial map viewport
The home-data module SHALL return a fixed `initialMapData` object with `center: [13.675063, 51.751569]`, `zoom: 2.5`, `minZoom: 2.5`, and `maxZoom: 8`, consumed by the map island as its starting viewport.

#### Scenario: Initial viewport is centered on Europe
- **WHEN** `getHomePageData()` resolves
- **THEN** the returned `initialMapData` is `{ center: [13.675063, 51.751569], zoom: 2.5, minZoom: 2.5, maxZoom: 8 }`
