## Why

The Astro static site needs to deploy under varying URL prefixes depending on target:
production lives at `https://apps.who.int/dhis2/uhcwatch/` (subpath), preview environments
(`/preview/pr-N`) use arbitrary subpaths, and local dev runs at the root (`/`). Hardcoded
absolute-path links (`/about`, `/favicon.ico`, `url("../assets/fonts/...")`) are not
portable across these contexts, and the React SPA islands hydrated into the page also
need a matching `basename` so their client-side routing agrees with the prerendered
markup.

We also had latent issues: SEO canonical URLs silently produced the wrong value when
`SITE_URL` and the base path drifted apart; the preloaded font URL did not match the
URL the `@font-face` rule requested (different Vite fingerprints), wasting the preload
hint; and static assets in `public/` were not fingerprinted and required a helper to
be prefixed at every call site.

## Goals

- Make the configured base path a single source of truth that flows to Astro's router,
  Vite-processed asset URLs, the SPA's `BrowserRouter`, and any hand-authored links.
- Move bundler-friendly assets (fonts, favicon, OG image, map pins) into `src/assets/`
  so Vite handles fingerprinting and base-prefixing automatically.
- Provide one helper (`href()`) for the few remaining cases where a runtime path string
  is needed (client islands, hand-authored `href` values) and make it safe to apply
  uniformly (absolute URLs pass through unchanged).
- Document the `SITE_URL` / `ASTRO_BASE_PATH` relationship so canonical URLs remain
  correct across environments.

## Non-goals

- Introducing per-page or per-locale base paths. A single base path applies to the
  whole build.
- Runtime base-path detection from the browser (already handled separately for the
  DHIS2-hosted SPA in `src/webapp`; see `detect DHIS2 base path at runtime` commit).
- Changing the SPA's routing strategy. Islands continue to read
  `process.env.REACT_APP_BASE_PATH` as before.

## User impact

- Deployers can point the site at any subpath by setting `ASTRO_BASE_PATH` at build
  time; no source edits required.
- Canonical/OG URLs, favicon, and preloaded fonts resolve correctly regardless of
  deployment path.
- Browser no longer double-downloads Lato fonts (preload now hits the same URL as the
  `@font-face` request).

## Compatibility

- `ASTRO_BASE_PATH` is optional and defaults to `/`, preserving existing dev behavior.
- `SITE_URL` default is unchanged (`https://apps.who.int/dhis2/uhcwatch`).
- `href()` accepts any internal path; absolute URLs and non-HTTP schemes
  (`mailto:`, `data:`, `blob:`, protocol-relative `//…`) pass through unchanged, so
  callers can apply it uniformly without pre-checking.
- Assets moved from `public/` into `src/assets/` (`favicon.ico`, `uhcw.png`, fonts,
  map pins) are now served from hashed `/_astro/…` URLs. External deep-links to the
  old unhashed paths (e.g. `/favicon.ico`) will 404 — acceptable because no external
  system is known to link to them.

## Rollback plan

- Revert the commits introducing `astro.config.mjs`'s `basePath` wiring, the `href()`
  helper, and the `src/assets/` moves. `ASTRO_BASE_PATH` becomes a no-op; the site
  falls back to root-relative paths.
- No migrations, persisted state, or external integrations are affected.

## What Changes

- **Add** `ASTRO_BASE_PATH` env var support in `astro.config.mjs`, with validation
  (leading slash normalized, trailing slash stripped, invalid characters rejected).
  Propagated to Vite `define` as `process.env.REACT_APP_BASE_PATH` so hydrated SPA
  islands share the same basename.
- **Add** `src/lib/href.ts` exporting `href(path)` and `isActivePath(current, target)`.
  `href()` prefixes internal paths with `import.meta.env.BASE_URL` and passes absolute
  URLs and non-HTTP schemes through unchanged.
- **Move** `public/fonts/` → `src/assets/fonts/`, `public/assets/map/` →
  `src/assets/map-pins/`, `public/assets/map-background.jpg` → `src/assets/`,
  `public/favicon.ico` → `src/assets/`, `public/uhcw.png` → `src/assets/`. All
  referenced via `?url` imports or relative CSS `url()` so Vite fingerprints them.
- **Move** `@font-face` declarations from `theme.css` into `Layout.astro` so their
  `src` URLs are fingerprinted by Vite and match the `<link rel="preload">` URLs.
- **Fix** `SeoHead.astro` default OG image to use the bundled `uhcw.png` resolved
  against `Astro.site`; document the `SITE_URL` / `ASTRO_BASE_PATH` consistency
  requirement inline.
- **Update** all hand-authored internal links in layouts/components/islands to go
  through `href()`.
- **Document** `ASTRO_BASE_PATH` and `SITE_URL` in `README.md`.
- **Document** the `href()` helper rule in `AGENTS.md`.

## Capabilities

### New Capabilities

- `base-path` — configurable deployment base path, single source of truth for
  Astro router, Vite assets, and SPA islands.

### Modified Capabilities

- `base-layout` — `@font-face` now lives in `Layout.astro` (not `theme.css`) so
  preload URLs match font-face URLs.
- `seo-meta-tags` — canonical and OG image URLs now resolve correctly under a
  non-root base path; default OG image is bundled (`src/assets/uhcw.png`).
