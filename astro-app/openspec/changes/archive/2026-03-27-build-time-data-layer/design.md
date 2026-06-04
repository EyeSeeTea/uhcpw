## Context

Phase 0 established the Astro SSG project with React integration, shared code imports via `@shared/*` path aliases, and all shared dependencies installed. The shared data layer uses:

- **`getCompositionRoot(api, d2DataEngine, instance, repositoriesToOverwrite?)`** — factory returning organized use cases (`method.get`, `about.getPersons`, `about.getOfficeInfo`, etc.).
- **`D2Api`** from `@eyeseetea/d2-api` — instantiated with `{ baseUrl, auth?, backend }`.
- **`FutureData<T>`** (`Future<string, T>`) — Fluture-based lazy monadic type resolved via `.run(onSuccess, onError)`, `.toPromise()`, or `.runAsync()`.

The existing React app reads DHIS2 credentials from `REACT_APP_DHIS2_BASE_URL` and `REACT_APP_DHIS2_AUTH`. Astro runs in a Node/Vite context at build time — it has no DHIS2 app runtime or `d2DataEngine`, so we need a standalone instantiation path.

## Goals / Non-Goals

**Goals:**
- Enable any `.astro` page to fetch DHIS2 data at build time via the shared composition root.
- Bridge the `FutureData<T>` type to `Promise<T>` for async/await frontmatter.
- Validate the full pipeline end-to-end with a real `astro build`.

**Non-Goals:**
- Content Collections / Zod schema validation (planned follow-up).
- Runtime (client-side) API calls — all data is fetched at build time only.
- Modifying the shared `src/` code or `CompositionRoot.ts`.
- Caching or incremental build support.

## Decisions

### 1. Server-side composition root as a lazy singleton

Create `src/lib/composition-root.server.ts` that reads env vars and returns a cached `CompositionRoot` instance. Use a module-level `let` for the singleton — Astro's build runs in a single Node process, so this avoids re-creating the D2Api on every page.

**`d2DataEngine` parameter**: `getCompositionRoot()` requires a `d2DataEngine` argument (from DHIS2 app runtime). In the server context we don't have one. Pass `null as unknown` — the repositories used by the target use cases (`method.get`, `about.getPersons`, `about.getOfficeInfo`) use `D2Api` directly, not the data engine. This is validated by the test page in Step 1.3.

**Alternative considered**: Forking `getCompositionRoot()` to make `d2DataEngine` optional — rejected because it modifies shared code, which is out of scope.

### 2. Future-to-Promise bridge using `.toPromise()`

The `Future` class already has a `.toPromise()` method that returns a standard `Promise<D>` (rejects on error). A thin wrapper `runFuture<T>(future: FutureData<T>): Promise<T>` delegates to `.toPromise()` for clarity and a stable import path.

**Alternative considered**: Using `.runAsync()` which returns `{ data?, error? }` — rejected because it requires manual error checking at every call site. `.toPromise()` naturally throws on error, which Astro's build will surface.

### 3. Astro-native env vars (not REACT_APP_ prefix)

Use `DHIS2_BASE_URL`, `DHIS2_USERNAME`, `DHIS2_PASSWORD` — accessed via `import.meta.env` (Vite's env system). These are server-only (no `PUBLIC_` prefix), so credentials are never exposed to the client bundle.

**Alternative considered**: Reusing `REACT_APP_DHIS2_*` names — rejected because Vite only exposes `PUBLIC_*` prefixed vars to client code, and `REACT_APP_*` is a CRA convention that doesn't apply here.

### 4. Validation via throwaway test page

Create `src/pages/test-data.astro` that fetches methods, persons, and office info, then renders the results as JSON in static HTML. This page proves the pipeline works and can be removed after validation. It is not gated behind a route guard — it's only built when explicitly requested during development.

## Risks / Trade-offs

- **`d2DataEngine` as null** → If a future use case depends on the data engine, it will fail at runtime. Mitigation: this is explicitly documented; the three target use cases are verified to not use it.
- **DHIS2 unavailable during build** → Build fails. Mitigation: document `.env` setup clearly; future follow-up can add fixture-based builds.
- **Fluture Node compatibility** → Fluture 14 is pure JS and works in Node, but if any transitive dependency uses browser APIs, Vite's SSR transform may fail. Mitigation: already handled by Phase 0's `vite.ssr.noExternal` / `vite.optimizeDeps.include` config.
- **No schema validation** → Malformed DHIS2 data silently produces broken HTML. Mitigation: acceptable for POC; Content Collections with Zod is the planned follow-up.
