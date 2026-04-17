## ADDED Requirements

### Requirement: Warn on remote image prefetch failure
The build-time image downloader SHALL emit a `warn`-level log entry whenever a remote image cannot be fetched or optimized. The entry SHALL include the remote URL and a short reason describing the failure (HTTP status, timeout, or thrown error message). Successful downloads SHALL NOT produce per-image log output.

#### Scenario: Remote endpoint returns non-2xx
- **WHEN** `fetchImageBuffer` receives a response with `response.ok === false`
- **THEN** the downloader logs one warning at level `warn` containing the URL and the HTTP status
- **AND** the function returns `null` (no change to control flow)

#### Scenario: Remote endpoint times out
- **WHEN** the fetch aborts because `FETCH_TIMEOUT_MS` elapsed
- **THEN** the downloader logs one warning at level `warn` containing the URL and a reason indicating a timeout
- **AND** the function returns `null`

#### Scenario: Fetch throws (DNS, network, TLS)
- **WHEN** `fetch` rejects with an error other than the timeout abort
- **THEN** the downloader logs one warning at level `warn` containing the URL and the error message
- **AND** the function returns `null`

#### Scenario: Sharp / fs post-processing fails
- **WHEN** the fetch succeeds but `sharp().resize().webp().toFile()` or the directory create step throws
- **THEN** `downloadAndOptimizeImage` logs one warning at level `warn` containing the URL and the error message
- **AND** returns `null`

#### Scenario: Successful download stays silent
- **WHEN** an image is fetched and written to disk without error
- **THEN** no per-image log entry is emitted

### Requirement: Remote URLs never leak to the client when prefetch failed
When a home-page resource's remote image fails to prefetch at build time, the generated HTML SHALL NOT contain the original remote URL as an `<img src>`. The resource SHALL instead render the existing placeholder container used when an image is absent.

#### Scenario: Home resource prefetch failed
- **WHEN** `downloadHomeResourceImages` receives an `ImageMap` without an entry for a given resource's remote URL
- **THEN** the returned `HomeResourceState.imageOriginal` is the empty string (not the original URL)

#### Scenario: ResourceCard renders placeholder on failure
- **WHEN** a `HomeResourceState` has an empty `imageOriginal`
- **THEN** `ResourceCard.astro` renders the `.image-placeholder` `<div>` instead of an `<img>` tag
- **AND** the produced HTML contains no reference to any remote DHIS2 URL for that resource

#### Scenario: MobileCarousel renders placeholder on failure
- **WHEN** a `HomeResourceState` has an empty `imageOriginal`
- **THEN** `MobileCarousel`'s slide renders the `.mobile-carousel-image-placeholder` `<div>` instead of an `<img>` tag
- **AND** the produced HTML contains no reference to any remote DHIS2 URL for that resource

#### Scenario: Successful prefetch is unchanged
- **WHEN** `downloadHomeResourceImages` receives an `ImageMap` with a local path for a resource's remote URL
- **THEN** the returned `HomeResourceState.imageOriginal` is that local path
- **AND** the card renders the `<img>` pointing at the local optimized file
