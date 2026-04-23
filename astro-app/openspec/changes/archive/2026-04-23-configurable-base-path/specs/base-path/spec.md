## ADDED Requirements

### Requirement: Configurable base path via env var
The build SHALL accept an optional `ASTRO_BASE_PATH` environment variable that sets the URL subpath under which the site is served. When unset, the site SHALL be built for root (`/`). The value SHALL be normalized to a single leading slash with no trailing slash (except `/` itself), and invalid characters SHALL cause the build to fail.

#### Scenario: Default root build
- **WHEN** `ASTRO_BASE_PATH` is unset and `yarn build` runs
- **THEN** Astro's `base` is `/` and emitted asset URLs start with `/`

#### Scenario: Subpath build
- **WHEN** `ASTRO_BASE_PATH=/UHCW yarn build` runs
- **THEN** Astro's `base` is `/UHCW`, emitted asset URLs start with `/UHCW/_astro/…`, and internal links in prerendered HTML start with `/UHCW/`

#### Scenario: Value normalization
- **WHEN** `ASTRO_BASE_PATH=UHCW/` (missing leading slash, trailing slash) is provided
- **THEN** the build normalizes it to `/UHCW` and proceeds

#### Scenario: Invalid value rejected
- **WHEN** `ASTRO_BASE_PATH` contains characters outside `[A-Za-z0-9._~\-/]`
- **THEN** the build throws an error identifying the invalid value

### Requirement: Base path reaches hydrated SPA islands
The configured base path SHALL be propagated to hydrated React islands via `process.env.REACT_APP_BASE_PATH` so that `BrowserRouter` basename agrees with the prerendered links. This propagation SHALL happen through Vite's `define` replacement and SHALL use the same normalized value as Astro's `base`.

#### Scenario: Island router basename matches Astro base
- **WHEN** the site is built with `ASTRO_BASE_PATH=/UHCW` and an island with `BrowserRouter` hydrates
- **THEN** the router reads `process.env.REACT_APP_BASE_PATH === "/UHCW"` and does not produce a mismatch between prerendered markup and client routing

### Requirement: `href()` helper for hand-authored paths
The codebase SHALL provide a `href(path)` helper in `src/lib/href.ts` that prefixes internal paths with `import.meta.env.BASE_URL`. The helper SHALL pass absolute URLs (`http:`, `https:`, protocol-relative `//`, `data:`, `blob:`, `mailto:`, and any other scheme) through unchanged so it is safe to apply uniformly to values of unknown origin.

#### Scenario: Internal path is prefixed
- **WHEN** the site is built with `base = /UHCW` and `href("/about")` is called
- **THEN** it returns `/UHCW/about`

#### Scenario: Home path preserves trailing slash
- **WHEN** `href("/")` is called with `base = /UHCW`
- **THEN** it returns `/UHCW/`

#### Scenario: Absolute URL passes through
- **WHEN** `href("https://example.com/x")`, `href("mailto:a@b")`, or `href("//cdn.example.com/x")` is called
- **THEN** the helper returns the input unchanged

### Requirement: Bundler-processed assets auto-prefixed
Assets imported through Vite (`?url` imports, CSS `url()` in bundled CSS, Astro `<Image>`) SHALL be automatically base-prefixed and fingerprinted. Hand-authored asset URLs (paths not going through the bundler) SHALL use the `href()` helper.

#### Scenario: Font URL fingerprinted and prefixed
- **WHEN** the site is built with `base = /UHCW` and `Layout.astro` imports a font via `?url`
- **THEN** the emitted URL has the form `/UHCW/_astro/Lato-Regular.<hash>.woff2`

#### Scenario: Favicon URL fingerprinted and prefixed
- **WHEN** the site is built with `base = /UHCW` and `Layout.astro` imports `favicon.ico` via `?url`
- **THEN** `<link rel="icon">` in the prerendered HTML points to `/UHCW/_astro/favicon.<hash>.ico`
