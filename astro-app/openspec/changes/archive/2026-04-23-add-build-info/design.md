## Context

Astro builds produce static HTML + assets with no runtime server. To embed build metadata, values must be resolved at build/config time and inlined. The project already uses Astro's Vite pipeline, so `vite.define` is the natural injection point. Git availability is not guaranteed in every build environment (CI shallow clones usually have it, but Docker scratch builds or tarballs may not), so the resolver must degrade gracefully.

## Goals / Non-Goals

**Goals:**
- Single source of truth for build info (one resolver function, used by both the layout and the JSON endpoint).
- Build-time resolution — zero runtime cost, values baked into output.
- Graceful degradation when git/package.json reads fail.

**Non-Goals:**
- Exposing build info via HTTP headers (requires a server; PoC is static).
- Signing or tamper-proofing the build info.
- Historical build info (previous versions); only current build is reported.

## Decisions

### Decision 1: Resolve build info via a helper module, not inline in `astro.config.mjs`

Create `src/lib/build-info.ts` exporting `getBuildInfo(): { version: string; commit: string; buildDate: string }`. `astro.config.mjs` calls it once and passes the result to `vite.define` as a stringified JSON blob under a single key `__BUILD_INFO__`.

**Alternative considered:** inline the three `execSync` + `readFileSync` calls in `astro.config.mjs`. Rejected because the JSON endpoint also needs to read them, and duplicating logic risks the meta tag and JSON drifting.

### Decision 2: Use a single `__BUILD_INFO__` global, not three separate defines

One object is simpler to consume (`import.meta.env` isn't the right channel for non-env values, and multiple defines add noise). Consumers destructure what they need.

### Decision 3: Graceful fallback values

- `version`: read from `package.json`; fallback `"0.0.0"` if read fails (shouldn't happen, but defensive).
- `commit`: `git rev-parse --short HEAD`; on failure (no git, detached state, missing `.git`), fallback `"unknown"`. Wrap in try/catch around `execSync`.
- `buildDate`: `new Date().toISOString()` — always available.

### Decision 4: Meta tag format is human-readable, JSON is structured

Meta tag: `<meta name="build-info" content="v1.4.2 / a3f9c21 / 2026-04-22T14:30:00Z" />` — single tag, scannable in DevTools.

JSON: `{ "version": "1.4.2", "commit": "a3f9c21", "buildDate": "2026-04-22T14:30:00Z" }` — machine-parseable, no "v" prefix on version.

**Alternative considered:** three separate meta tags (`build-version`, `build-commit`, `build-date`). Rejected — more bytes per page, no real benefit when JSON already exists for structured consumption.

### Decision 5: Endpoint as `src/pages/version.json.ts` (static)

Astro treats `.json.ts` pages as static endpoints when the site is prerendered. Returns `new Response(JSON.stringify(...), { headers: { "Content-Type": "application/json" } })`. No dynamic route, no server needed.

## Data Flow

1. **Build time** (in `astro.config.mjs` load):
   - `getBuildInfo()` reads `package.json`, runs `git rev-parse`, captures `Date.now()`.
   - Returns `BuildInfo` object.
   - Passed to Vite via `define: { __BUILD_INFO__: JSON.stringify(info) }`.
2. **Compile time** (Vite transform):
   - `__BUILD_INFO__` references in `Layout.astro` and `version.json.ts` are inlined as literal JS objects.
3. **Output**:
   - Every static HTML page contains the `<meta name="build-info">` tag.
   - `/version.json` is a static file in `dist/`.

## Risks / Trade-offs

- **[Risk]** `git` binary unavailable in some build environments → **Mitigation**: try/catch fallback to `"unknown"`.
- **[Risk]** `astro.config.mjs` runs once per config load — dev server may show stale commit after commits without restart → **Mitigation**: acceptable in dev (commit value is only load-bearing in production builds); document if needed.
- **[Trade-off]** Meta tag is cached with HTML; a user on stale HTML sees old build info → **Mitigation**: `/version.json` can be fetched fresh with cache-busting if a consumer needs real-time info.
- **[Trade-off]** Build date changes every build → breaks content-hash reproducibility for the HTML files. Acceptable for PoC; not a deterministic-build project.

## Migration Plan

- No migration. Add-only change. Deploy is a normal rebuild + publish.
- Rollback: revert the commit.

## Open Questions

- None. All decisions are resolvable from existing Astro/Vite conventions.
