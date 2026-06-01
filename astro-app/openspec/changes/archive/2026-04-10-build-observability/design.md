## Context

The Astro build is currently silent — server-side code (composition root, data fetching, future bridge) produces no diagnostic output. Debugging build failures or performance regressions requires manually adding `console.log` and rebuilding. We need structured, centralized logging that runs only during site generation.

## Goals / Non-Goals

**Goals:**
- Single logger instance shared across all server-side code
- Structured JSON output (machine-parseable in CI, human-readable in dev)
- Timing instrumentation for data-fetching operations
- Build-level start/end timing via an Astro integration hook
- Server-only — never bundled into client islands

**Non-Goals:**
- Client-side error reporting
- Log shipping to external services
- Replacing Astro's own build output

## Decisions

### D1: Pino as the logging library

**Decision:** Use `pino` for structured logging and `pino-pretty` (dev dependency) for human-readable output during development.

**Why pino:**
- Fastest structured logger in the Node.js ecosystem
- Zero native dependencies (important for CI reproducibility)
- Built-in support for child loggers (namespaced context per module)
- JSON output by default — ideal for CI log parsing
- `pino-pretty` provides colored, readable output for local dev

**Alternative considered:** `winston` — heavier, slower, more features than needed. `console.*` with a wrapper — no structured output, no levels, no child loggers.

### D2: Logger module at `src/lib/logger.ts`

**Decision:** Create a single module that exports a pre-configured root logger and a `createLogger(name)` factory for child loggers. Each module (composition root, data layer, future bridge) creates its own child logger with a descriptive name.

```ts
// src/lib/logger.ts
import pino from "pino";

const logger = pino({
    level: process.env.LOG_LEVEL ?? "info",
    transport: process.env.LOG_PRETTY === "true"
        ? { target: "pino-pretty", options: { colorize: true } }
        : undefined,
});

export function createLogger(name: string) {
    return logger.child({ module: name });
}

export { logger };
```

**Log level control:** `LOG_LEVEL` env var (default: `info`). Set to `debug` for verbose output, `silent` to suppress.

**Pretty printing:** Opt-in via `LOG_PRETTY=true`. Since `NODE_ENV` is always `production` during `astro build`, a separate env var avoids the ambiguity.

### D3: Instrument at the infrastructure boundary, not inside domain code

**Decision:** Add logging at the Astro-specific infrastructure layer — not inside the shared domain code in `../src`. This means:

1. **`src/infra/composition-root.server.ts`** — log initialization and timing
2. **`src/infra/future-bridge.ts`** — wrap `runFuture` to log each future's start/end/duration/error (this is the single chokepoint for all DHIS2 API calls)
3. **`src/data/about/about-data.ts`** — log the `getAboutPageData` aggregate call with timing
4. **Page frontmatter** — no changes needed; instrumentation in the layers above covers all page data fetching

**Why not instrument pages directly:** Pages call `runFuture` and `getAboutPageData`, which are already instrumented. Adding logs in pages would duplicate output.

**Why not instrument shared code in `../src`:** That code belongs to the React SPA. Modifying it for Astro logging would violate the project boundary and could affect the SPA.

### D4: Timing utility via `performance.now()`

**Decision:** Use a lightweight `startTimer()` function that returns an `endTimer()` callback which logs elapsed time. No separate module — it's a few lines inside `logger.ts`.

```ts
export function startTimer(log: pino.Logger, message: string) {
    const start = performance.now();
    return () => {
        const ms = (performance.now() - start).toFixed(1);
        log.info({ durationMs: ms }, `${message} completed`);
    };
}
```

**Alternative considered:** Separate `build-timer.ts` — unnecessary abstraction for a 5-line utility.

### D5: Astro integration for build lifecycle logging

**Decision:** Add a small inline Astro integration in `astro.config.mjs` that hooks into `astro:build:start` and `astro:build:done` to log total build duration.

```js
function buildLogger() {
    let start;
    return {
        name: "build-logger",
        hooks: {
            "astro:build:start": () => { start = performance.now(); },
            "astro:build:done": () => {
                const ms = (performance.now() - start).toFixed(1);
                // Import logger dynamically to avoid top-level TS in config
                import("./src/lib/logger.ts").then(m =>
                    m.logger.info({ durationMs: ms }, "Build completed")
                );
            },
        },
    };
}
```

**Alternative considered:** Separate integration file — overkill for a 10-line hook.

### D6: Server-only guarantee

**Decision:** Enforce server-only usage through two mechanisms:

1. **File naming convention:** `logger.ts` lives in `src/lib/` (server-side utilities), not `src/components/` or `src/islands/`
2. **Vite guard:** If needed, add `logger.ts` to Vite's `ssr.external` or use `import.meta.env.SSR` guard. However, since pino targets Node.js and would fail to bundle for the browser anyway, Vite/Astro will naturally error if a client island tries to import it — this is sufficient.

No special build configuration needed. Pino's Node.js-only APIs act as a natural firewall.

## Data Flow

```
astro build
  │
  ├─ astro:build:start hook → logger.info("Build started")
  │
  ├─ Page render (methods.astro, about.astro, 404.astro)
  │     │
  │     ├─ getServerCompositionRoot()
  │     │     └─ logger.info("Composition root initialized", { durationMs })
  │     │
  │     ├─ runFuture(future)  ← instrumented chokepoint
  │     │     ├─ logger.debug("Fetching...", { operation })
  │     │     ├─ logger.info("Fetched", { operation, durationMs })
  │     │     └─ logger.error("Failed", { operation, error })
  │     │
  │     └─ getAboutPageData()
  │           └─ logger.info("About page data loaded", { durationMs })
  │
  └─ astro:build:done hook → logger.info("Build completed", { durationMs })
```

## Risks / Trade-offs

- **`pino-pretty` as dev dep:** Adds a dependency, but only in dev. If undesirable, can be dropped — JSON output is still readable, just less pretty.
- **`runFuture` instrumentation:** Adding a label parameter to `runFuture` changes its signature slightly. Callers need updating, but it's a small internal API with ~6 call sites.
- **Log noise in tests:** Tests that hit server code will now see log output. Mitigate by setting `LOG_LEVEL=silent` in test scripts.
