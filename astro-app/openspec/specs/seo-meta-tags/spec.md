## ADDED Requirements

### Requirement: Pages render title and description meta tags
Every page SHALL render a `<title>` tag and a `<meta name="description">` tag in the document `<head>`. Values SHALL be determined by the route using the shared `getSeoConfigForRoute()` function. Pages without a specific config SHALL use the default SEO config (`title: "UHC Watch: tracking affordable access to health care"`, `description: "UHC Watch monitors progress on universal health coverage tracking unmet need, financial hardship, spending on health and coverage policy in Europe & Central Asia"`).

#### Scenario: About page has route-specific title and description
- **WHEN** the `/about` page is built
- **THEN** the HTML `<title>` is "About the WHO Barcelona Office work & the UHC Watch network"
- **AND** the `<meta name="description">` content matches the about route config

#### Scenario: 404 page uses default SEO config
- **WHEN** the `/404` page is built
- **THEN** the HTML `<title>` is "UHC Watch - Page Not Found"
- **AND** the `<meta name="description">` content matches the default config

### Requirement: Pages render Open Graph meta tags
Every page SHALL render Open Graph meta tags in the `<head>`: `og:type` (set to "website"), `og:title`, `og:description`, and `og:image`. Values SHALL be sourced from the route's `SeoConfig`.

#### Scenario: Methods page has OG tags
- **WHEN** the `/methods` page is built
- **THEN** the HTML contains `<meta property="og:title" content="UHC Watch methods: how do we monitor progress towards UHC?">`
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
`SeoHead.astro` SHALL emit `<link rel="canonical">` and `<meta property="og:url">` tags whose URL is constructed from `Astro.url.pathname` (which already includes the configured `base`) resolved against the origin of `Astro.site`. Any path portion of `Astro.site` is ignored by this construction (URL constructor behavior when the first argument is absolute), so operators MUST keep `SITE_URL` and `ASTRO_BASE_PATH` consistent — either both encode the subpath or neither does.

#### Scenario: Consistent site + base produces correct canonical
- **WHEN** the site is built with `SITE_URL=https://apps.who.int/dhis2/uhcwatch` and `ASTRO_BASE_PATH=/dhis2/uhcwatch`, and the `/about` page renders
- **THEN** the canonical URL is `https://apps.who.int/dhis2/uhcwatch/about`

#### Scenario: Root deploy with origin-only SITE_URL
- **WHEN** the site is built with `SITE_URL=https://example.com` (no path) and `ASTRO_BASE_PATH` unset, and the `/about` page renders
- **THEN** the canonical URL is `https://example.com/about`

#### Scenario: Canonical link omitted when site URL is not configured
- **WHEN** `Astro.site` is not configured
- **THEN** no `<link rel="canonical">` or `og:url` meta tag is emitted

### Requirement: Default OG image is bundled
`SeoHead.astro` SHALL use a bundled asset (`src/assets/uhcw.png`) as the default Open Graph and Twitter image when `seo.image` is not provided. The bundled asset SHALL be imported via `?url` and resolved to an absolute URL against `Astro.site` so social platforms can fetch it.

#### Scenario: Default image is bundled and fingerprinted
- **WHEN** a page renders without an explicit `seo.image`
- **THEN** `og:image` and `twitter:image` point to an absolute URL under `Astro.site` whose path contains a fingerprinted `/_astro/uhcw.<hash>.png`

#### Scenario: Explicit image overrides default
- **WHEN** a page provides `seo.image = "https://example.com/custom.png"`
- **THEN** `og:image` and `twitter:image` emit that value unchanged

### Requirement: SeoHead component is reusable across pages
The SEO meta tag rendering SHALL be encapsulated in a single `SeoHead.astro` component that accepts a `SeoConfig` object as props. Pages SHALL pass route-specific config to the Layout, which renders `SeoHead` in the `<head>`.

#### Scenario: Adding SEO to a new page
- **WHEN** a developer creates a new page and passes its route to `getSeoConfigForRoute()`
- **THEN** the page automatically gets all SEO meta tags without additional configuration
