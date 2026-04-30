## Why

The internal-traffic toggle pages `src/pages/internal-on.astro` and `src/pages/internal-off.astro` hard-code `location.replace("/")` for their post-toggle redirect. On subpath deployments (e.g. `ASTRO_BASE_PATH=/UHCW`), this lands the user at the host root instead of the application root, taking them outside the site (or into a 404 on the WHO host that mounts the app under `/dhis2/uhcwatch`). The redirect must respect Astro's configured `base`.

## What Changes

- Update `internal-on.astro` and `internal-off.astro` to redirect to the configured base path instead of the literal `"/"`.
- The base path is already exposed at build time via `import.meta.env.BASE_URL` (Astro normalizes it to a trailing-slashed string). Inline the value into the toggle scripts so the static HTML emitted to disk contains the correct destination — no runtime helper needed (these pages must remain layout-less and free of any module imports that could pull in the GA4 loader).
- No change to the `localStorage` toggle behavior, opt-out semantics, or the rule that these pages do not load GA4 / emit `page_view`.

## Capabilities

### New Capabilities
- _None_

### Modified Capabilities
- `analytics`: the "Opt-in and opt-out routes" requirement currently mandates a redirect to `/`; tighten it to redirect to the site's base URL so subpath deployments work.

## Rollback plan

Revert the two-file edit; the previous `location.replace("/")` form is restored. No data migration, no persisted state changes, no API surface affected.

## Impact

- Code: `src/pages/internal-on.astro`, `src/pages/internal-off.astro`.
- Tests: `src/layouts/__tests__/analytics-layout.test.ts` may assert against the redirect target — adjust if so.
- User impact: subpath deployments stop kicking visitors out of the app when they hit `/internal-on` or `/internal-off`. Root deployments are unaffected (`BASE_URL` is `"/"`).
- Compatibility: backwards-compatible for root-mounted deployments; fixes a latent bug for any non-root `ASTRO_BASE_PATH`.
