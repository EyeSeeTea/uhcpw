## Why

The Astro SSG app (Phase 0) can import shared code and resolve dependencies, but has no way to fetch data from DHIS2 at build time. Pages need real data baked into static HTML — without a server-side composition root and a Future-to-Promise bridge, no page can render actual content. This is the critical path for Phase 2+ (layouts, Methods page, About page).

## What Changes

- Create a server-side composition root (`composition-root.server.ts`) that instantiates `D2Api` and `getCompositionRoot()` using environment variables, independent of the React app runtime.
- Create a Future-to-Promise bridge (`future-bridge.ts`) so Astro's async frontmatter can `await` the shared `FutureData<T>` values.
- Add `.env.example` documenting required DHIS2 env vars (`DHIS2_BASE_URL`, `DHIS2_USERNAME`, `DHIS2_PASSWORD`).
- Validate the full pipeline with a throwaway test page that fetches and renders real DHIS2 data at build time.

## Capabilities

### New Capabilities

- `server-composition-root`: Server-side singleton that creates `D2Api` + `getCompositionRoot()` from env vars, usable in Astro frontmatter without browser or DHIS2 app runtime dependencies.
- `future-bridge`: Utility to convert `FutureData<T>` (Fluture-based) into standard `Promise<T>` for use in async/await Astro frontmatter.
- `build-time-data-fetch`: End-to-end validation that `astro build` produces static HTML containing real DHIS2 data fetched via the shared data layer.

### Modified Capabilities

_(none — this phase introduces new server-side plumbing without changing existing specs)_

## Impact

- **New files in `astro-app/`**: `src/lib/composition-root.server.ts`, `src/lib/future-bridge.ts`, `.env.example`, and a validation test page.
- **Dependencies**: No new packages — uses `@eyeseetea/d2-api`, `fluture`, and shared code already installed in Phase 0.
- **Environment**: Builds now require `DHIS2_BASE_URL`, `DHIS2_USERNAME`, `DHIS2_PASSWORD` env vars (or a `.env` file).
- **Shared code**: Read-only consumption — no changes to `src/domain/`, `src/data/`, or `src/CompositionRoot.ts`.
