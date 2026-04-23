## MODIFIED Requirements

### Requirement: Canonical URL construction
`SeoHead.astro` SHALL emit `<link rel="canonical">` and `<meta property="og:url">` tags whose URL is constructed from `Astro.url.pathname` (which already includes the configured `base`) resolved against the origin of `Astro.site`. Any path portion of `Astro.site` is ignored by this construction (URL constructor behavior when the first argument is absolute), so operators MUST keep `SITE_URL` and `ASTRO_BASE_PATH` consistent — either both encode the subpath or neither does.

#### Scenario: Consistent site + base produces correct canonical
- **WHEN** the site is built with `SITE_URL=https://apps.who.int/dhis2/uhcwatch` and `ASTRO_BASE_PATH=/dhis2/uhcwatch`, and the `/about` page renders
- **THEN** the canonical URL is `https://apps.who.int/dhis2/uhcwatch/about`

#### Scenario: Root deploy with origin-only SITE_URL
- **WHEN** the site is built with `SITE_URL=https://example.com` (no path) and `ASTRO_BASE_PATH` unset, and the `/about` page renders
- **THEN** the canonical URL is `https://example.com/about`

#### Scenario: Missing Astro.site
- **WHEN** `site` is not configured
- **THEN** no `<link rel="canonical">` or `og:url` meta tag is emitted

### Requirement: Default OG image is bundled
`SeoHead.astro` SHALL use a bundled asset (`src/assets/uhcw.png`) as the default Open Graph and Twitter image when `seo.image` is not provided. The bundled asset SHALL be imported via `?url` and resolved to an absolute URL against `Astro.site` so social platforms can fetch it.

#### Scenario: Default image is bundled and fingerprinted
- **WHEN** a page renders without an explicit `seo.image`
- **THEN** `og:image` and `twitter:image` point to an absolute URL under `Astro.site` whose path contains a fingerprinted `/_astro/uhcw.<hash>.png`

#### Scenario: Explicit image overrides default
- **WHEN** a page provides `seo.image = "https://example.com/custom.png"`
- **THEN** `og:image` and `twitter:image` emit that value unchanged
