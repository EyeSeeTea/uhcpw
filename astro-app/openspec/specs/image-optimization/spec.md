## Purpose

Define how the Astro build handles images: which assets go through the Astro image pipeline, how person and office images are downloaded and optimized at build time, what happens when a remote fetch fails, and how client-side fallbacks work.
## Requirements
### Requirement: Avatar fallback for missing or broken images
When a person has no image URL or the image URL returns an HTTP error (e.g. 404), the person card SHALL display an SVG placeholder avatar instead. The placeholder is a neutral silhouette on a light gray background, matching the circular image dimensions.

#### Scenario: Person with no image URL
- **WHEN** a person's `image` field is empty or matches the SPA's fallback asset path
- **THEN** the person card displays the SVG placeholder avatar

#### Scenario: Person image URL returns 404
- **WHEN** a person's image URL is set but the server returns 404 at build time
- **THEN** the person card displays the SVG placeholder avatar

#### Scenario: Valid image URL
- **WHEN** a person's image URL is set and returns a valid image
- **THEN** the person card displays the actual image

### Requirement: Build-time image URL validation
During the build, the system SHALL validate person image URLs using HTTP HEAD requests. Validation runs in parallel for all persons. A URL is considered invalid if the HEAD request returns a non-2xx status or times out.

#### Scenario: Parallel image validation
- **WHEN** the build processes 30 persons
- **THEN** all 30 image HEAD requests execute concurrently (not sequentially)

#### Scenario: Timeout handling
- **WHEN** an image HEAD request does not complete within 5 seconds
- **THEN** the image is treated as invalid and the placeholder is used

### Requirement: Astro Image optimization for team section
In the static team section, valid person images SHALL be rendered using Astro's `<Image>` component for automatic format optimization (WebP/AVIF) and responsive sizing.

#### Scenario: Team images are optimized
- **WHEN** a team person has a valid image
- **THEN** the built HTML contains an optimized `<img>` with `srcset` and modern format

### Requirement: Office header image optimization
The office header image SHALL be rendered using Astro's `<Image>` component with `width="100%"` responsive behavior.

#### Scenario: Office image optimized
- **WHEN** the office header renders
- **THEN** the office image is served in an optimized format via Astro's image pipeline

### Requirement: Remote image patterns configured
The Astro config SHALL include `image.remotePatterns` allowing the DHIS2 server hostname, so that remote images can be optimized at build time.

#### Scenario: Remote pattern allows DHIS2 images
- **WHEN** `astro build` processes a DHIS2 image URL
- **THEN** the image is downloaded and optimized without a "remote image not allowed" error

### Requirement: React island uses img with onerror fallback
In the experts React island, person images SHALL use standard `<img>` tags with an `onError` handler that swaps the `src` to an inline SVG data URI placeholder. This is acceptable since the island already ships JS.

#### Scenario: Expert image loads successfully
- **WHEN** an expert's image loads in the browser
- **THEN** the real image is displayed

#### Scenario: Expert image fails to load in browser
- **WHEN** an expert's image fails to load (network error, 404)
- **THEN** the `onError` handler replaces it with the SVG placeholder

### Requirement: Layout chrome images use Astro's image pipeline
All raster images that are part of the layout chrome — specifically the WHO blue logo, the WHO white logo, the UHC home logo, and the EU flag — SHALL live in `src/assets/` and SHALL be rendered through Astro's `<Image />` component, not served as static files from `/public/images/`.

#### Scenario: Logos are not served from /public/images/
- **WHEN** the production build runs (`yarn build`)
- **THEN** the rendered HTML for any page contains no references to `/images/who-logo-blue.png`, `/images/who-logo-white.png`, `/images/uhcw-home-logo.png`, or `/images/europe-flag.png`
- **AND** these files are not present in `dist/images/` (or are present only as referenced by other components, not by `Header.astro`/`Footer.astro`)

#### Scenario: Layout chrome assets emit srcset
- **WHEN** the production build emits the header and footer
- **THEN** each layout-chrome `<img>` has a `srcset` attribute with multiple `webp` candidates sized for the responsive CSS breakpoints

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


### Requirement: Deduplicate build-time remote image requests

During a production build, requests for the same normalized remote URL and image transformation options SHALL share their in-flight or completed result, including failures. A new build SHALL retry failed images. Development requests SHALL retain their existing retry behavior.

#### Scenario: Repeated missing image
- **WHEN** the same image and transformation are requested more than once during a build and the fetch fails
- **THEN** the build performs one fetch and emits one warning for that request
- **AND** each caller receives the existing fallback result
