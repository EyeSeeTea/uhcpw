## Why

Deployed static builds are currently indistinguishable from each other — when debugging a production issue or verifying a deploy, there's no way to answer "which version/commit is live right now?" without inspecting the CDN or repo state. Embedding build metadata into the site itself makes every deploy self-identifying for both humans (DevTools) and machines (uptime checks, client-side update banners).

## Goals

- Every deployed page self-reports version, commit SHA, and build date.
- Both human-readable (meta tag in `<head>`) and machine-readable (`/version.json`) access.
- Values injected at build time with no runtime overhead.
- Graceful fallback when git is unavailable (e.g., tarball builds, CI without full clone).

## Non-goals

- Visible on-page UI (badge, footer text) — out of scope; meta tag only.
- Client-side "new version available" banner logic — the JSON endpoint enables it, but the feature is not part of this change.
- Branch name, build number, or CI metadata beyond the three fields listed.

## What Changes

- Compute build info once per build: `version` from `package.json`, `commit` from `git rev-parse --short HEAD` (fallback `"unknown"`), `buildDate` as ISO-8601 UTC.
- Expose values to Astro via `vite.define` (or equivalent) so they're available to both SSR/static pages and endpoints.
- Inject a single `<meta name="build-info" content="v{version} / {commit} / {buildDate}">` tag into the base layout so it appears on every page.
- Add `src/pages/version.json.ts` static endpoint returning `{ version, commit, buildDate }`.

## Capabilities

### New Capabilities
- `build-info`: Build-time injection of version/commit/date metadata, exposed via a `<meta>` tag on every page and a `/version.json` endpoint.

### Modified Capabilities
- `base-layout`: Base layout renders the `<meta name="build-info">` tag in `<head>`.

## User impact

- End users: none visible. Meta tag is not rendered to the page.
- Developers / ops: can read the live build identifier from DevTools → Elements, `curl -s $SITE | grep build-info`, or `curl -s $SITE/version.json`.

## Compatibility

- Non-breaking. Adds one `<meta>` tag (a few dozen bytes per HTML file) and one new static JSON route.
- No existing routes or specs change behavior beyond the base-layout `<head>` addition.

## Rollback plan

- Revert the change commit. No data migrations, no external state. Safe to roll forward or back at any time.

## Impact

- **Code**: `astro.config.mjs` (or a small `scripts/build-info.ts` helper), base layout component, new `src/pages/version.json.ts`.
- **Dependencies**: none. Uses Node built-ins (`child_process`, `fs`) and existing Vite `define`.
- **Build**: adds one `git rev-parse` call at config-load time; negligible.
