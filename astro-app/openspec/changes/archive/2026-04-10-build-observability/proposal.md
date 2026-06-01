## Why

The Astro build currently runs completely silent — no structured logs, no timing data, no traceability when something fails or slows down. When a build breaks or degrades, debugging requires adding ad-hoc `console.log` statements, rebuilding, and inspecting terminal output manually. As the site grows (more pages, more data fetches), this lack of observability becomes a real bottleneck for diagnosing issues.

## Goals

- Provide a centralized, structured logging solution for the Astro build pipeline
- Enable traceability of failures with contextual information (which page, which data fetch, what input)
- Surface build timing data so bottlenecks are visible without profiling tools
- Keep logging server-only — zero impact on client bundles
- Make log verbosity configurable (e.g., silent in CI unless failure, verbose in dev)

## Non-goals

- Runtime client-side logging or error reporting
- Log aggregation or shipping to external services (Datadog, Sentry, etc.)
- Custom Astro dev-server request logging
- Replacing Astro's own internal build output

## What Changes

- **Add** `pino` as a dependency (lightweight, structured JSON logger)
- **Create** `src/lib/logger.ts` — centralized logger factory, server-only
- **Create** `src/lib/build-timer.ts` — lightweight timing utility built on the logger
- **Instrument** data-fetching layer (`src/data/`) with structured log calls (debug for start, info for completion with duration, error for failures)
- **Instrument** composition root initialization with timing
- **Add** an Astro integration hook to log build start/end with total duration

## Capabilities

### New Capabilities

- `build-logging`: Structured pino-based logging during site generation with configurable verbosity

### Modified Capabilities

- Data-fetching functions gain log instrumentation (transparent to callers)
- Composition root logs initialization timing

## Impact

- **Files created**: ~3 (logger, build-timer, Astro integration hook)
- **Files modified**: ~5-8 (data-fetching modules, composition root, astro config)
- **New dependency**: `pino` (+ `pino-pretty` as dev dependency for human-readable dev output)
- **No breaking changes**: logging is additive, all existing behavior unchanged
- **No client bundle impact**: logger module is server-only, never imported by islands or client scripts

## User Impact

- Developers see structured, contextual logs during `yarn build` and `yarn start`
- Build failures include enough context to diagnose without re-running
- Build timing breakdown visible at info level

## Compatibility

Fully backward-compatible. Logging is additive instrumentation. No API, URL, or output changes. Pino has zero native dependencies and works in all Node.js environments.

## Rollback Plan

Remove the `pino`/`pino-pretty` dependencies and revert the instrumented files. Since logging calls are additive (no control flow changes), reverting is a clean deletion.
