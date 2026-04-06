## ADDED Requirements

### Requirement: Pages render title and description meta tags
Every page SHALL render a `<title>` tag and a `<meta name="description">` tag in the document `<head>`. Values SHALL be determined by the route using the shared `getSeoConfigForRoute()` function. Pages without a specific config SHALL use the default SEO config (`title: "UHC Watch"`, `description: "UHC Watch monitors unmet need..."`).

#### Scenario: About page has route-specific title and description
- **WHEN** the `/about` page is built
- **THEN** the HTML `<title>` is "UHC Watch - About"
- **AND** the `<meta name="description">` content matches the about route config

#### Scenario: 404 page uses default SEO config
- **WHEN** the `/404` page is built
- **THEN** the HTML `<title>` is "UHC Watch"
- **AND** the `<meta name="description">` content matches the default config

### Requirement: Pages render Open Graph meta tags
Every page SHALL render Open Graph meta tags in the `<head>`: `og:type` (set to "website"), `og:title`, `og:description`, and `og:image`. Values SHALL be sourced from the route's `SeoConfig`.

#### Scenario: Methods page has OG tags
- **WHEN** the `/methods` page is built
- **THEN** the HTML contains `<meta property="og:title" content="UHC Watch - Methods">`
- **AND** the HTML contains `<meta property="og:description">` with the methods description
- **AND** the HTML contains `<meta property="og:type" content="website">`
- **AND** the HTML contains `<meta property="og:image">` with the default image URL

### Requirement: Pages render Twitter Card meta tags
Every page SHALL render Twitter Card meta tags in the `<head>`: `twitter:card` (set to "summary_large_image"), `twitter:title`, `twitter:description`, and `twitter:image`. Values SHALL be sourced from the route's `SeoConfig`.

#### Scenario: About page has Twitter Card tags
- **WHEN** the `/about` page is built
- **THEN** the HTML contains `<meta name="twitter:card" content="summary_large_image">`
- **AND** the HTML contains `<meta name="twitter:title">` with the about title
- **AND** the HTML contains `<meta name="twitter:description">` with the about description

### Requirement: Pages render canonical link
Every page SHALL render a `<link rel="canonical">` tag with the full URL of the page. The base URL SHALL be derived from `Astro.site` or a `SITE_URL` environment variable.

#### Scenario: Canonical link uses site URL and pathname
- **WHEN** the `/methods` page is built and `Astro.site` is configured
- **THEN** the HTML contains `<link rel="canonical" href="{site}/methods">`

#### Scenario: Canonical link omitted when site URL is not configured
- **WHEN** `Astro.site` is not configured
- **THEN** the `<link rel="canonical">` tag is not rendered

### Requirement: SeoHead component is reusable across pages
The SEO meta tag rendering SHALL be encapsulated in a single `SeoHead.astro` component that accepts a `SeoConfig` object as props. Pages SHALL pass route-specific config to the Layout, which renders `SeoHead` in the `<head>`.

#### Scenario: Adding SEO to a new page
- **WHEN** a developer creates a new page and passes its route to `getSeoConfigForRoute()`
- **THEN** the page automatically gets all SEO meta tags without additional configuration
