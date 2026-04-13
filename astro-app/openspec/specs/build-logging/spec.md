# Build Logging

Structured logging for the Astro static site generation pipeline.

## Overview

A pino-based logger provides structured, leveled output during `astro build` and `astro dev`. All logging runs server-side only — it is never included in client bundles.

## Components

- **`src/lib/logger.ts`** — Root logger, `createLogger(name)` factory, `startTimer()` timing utility.
- **Astro integration** (`buildLogger()` in `astro.config.mjs`) — Logs build start/end with total duration.
- **Infrastructure instrumentation** — `composition-root.server.ts` and `future-bridge.ts` emit structured logs with timing for initialization and every DHIS2 API call.
- **Data layer instrumentation** — `about-data.ts` logs aggregate data load timing.

## Configuration

| Env variable | Default | Purpose |
|---|---|---|
| `LOG_LEVEL` | `info` | Pino log level (`debug`, `info`, `warn`, `error`, `silent`) |
| `LOG_PRETTY` | — | Set to `"true"` to format output with `pino-pretty` |

Tests run with `LOG_LEVEL=silent` (set in `package.json` scripts).

## Log output

Each log entry includes:
- `module` — Source module name (e.g., `future-bridge`, `composition-root`, `about-data`)
- `operation` — For data fetches, the operation label (e.g., `methods.get`, `about.getTeam`)
- `durationMs` — Elapsed time in milliseconds
- Standard pino fields: `level`, `time`, `pid`, `hostname`

## Design decisions

- Instrumentation is at the **infrastructure boundary** (future-bridge, composition root), not in shared domain code from `../src`.
- `runFuture` accepts an optional `label` parameter for operation tagging.
- Pino's Node.js-only APIs act as a natural firewall against accidental client bundling.
