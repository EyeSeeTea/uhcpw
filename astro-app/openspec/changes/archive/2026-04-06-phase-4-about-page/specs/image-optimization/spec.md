## ADDED Requirements

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
