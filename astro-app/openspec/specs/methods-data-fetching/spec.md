## ADDED Requirements

### Requirement: Fetch methods at build time

The Methods page SHALL fetch all method sections by calling `compositionRoot.method.get.execute()` through the `runFuture()` bridge in the Astro frontmatter. The data MUST be fetched at build time (SSG) — no runtime API calls.

#### Scenario: Successful methods fetch

- **WHEN** `astro build` runs with valid DHIS2 credentials
- **THEN** the generated HTML contains all method section names and content from DHIS2

#### Scenario: Build fails on DHIS2 error

- **WHEN** `astro build` runs and the DHIS2 API is unreachable or returns an error
- **THEN** the build fails with a descriptive error message (not a silent empty page)

### Requirement: Fetch general content for shared layout

The Methods page SHALL fetch general content by calling `compositionRoot.general.getContent.execute()` through the `runFuture()` bridge for the shared layout. This fetch SHALL run in parallel with the methods fetch using `Promise.all`.

#### Scenario: Parallel data fetching

- **WHEN** the Methods page frontmatter executes during build
- **THEN** both `method.get` and `general.getContent` calls are initiated concurrently via `Promise.all`

### Requirement: Reuse shared composition root

The Methods page SHALL use `getServerCompositionRoot()` from `@/lib/composition-root.server` — the same singleton composition root used by other Astro pages. It SHALL NOT create its own API client or repository instances.

#### Scenario: Shared composition root usage

- **WHEN** the Methods page fetches data
- **THEN** it uses the existing `getServerCompositionRoot()` singleton, not a custom D2Api instance
