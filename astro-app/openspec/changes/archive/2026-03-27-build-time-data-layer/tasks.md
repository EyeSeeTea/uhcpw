## 1. Future-to-Promise Bridge

- [x] 1.1 Create `astro-app/src/lib/future-bridge.ts` with `runFuture<T>(future: FutureData<T>): Promise<T>` that delegates to `future.toPromise()`
- [x] 1.2 Add a Vitest unit test for `runFuture` covering both success and error cases using `Future.success()` and `Future.error()`

## 2. Server-Side Composition Root

- [x] 2.1 Create `astro-app/.env.example` with `DHIS2_BASE_URL`, `DHIS2_USERNAME`, `DHIS2_PASSWORD` placeholder values and descriptions
- [x] 2.2 Create `astro-app/src/lib/composition-root.server.ts` with `getServerCompositionRoot()` that reads env vars via `import.meta.env`, validates they are set, instantiates `D2Api` and `getCompositionRoot()`, and caches the result as a singleton

## 3. Build-Time Data Validation

- [x] 3.1 Create `astro-app/src/pages/test-data.astro` that fetches methods, team persons, expert persons, and office info via the composition root + future bridge, and renders each as JSON in static HTML
- [x] 3.2 Run `astro build` with real DHIS2 credentials and verify the generated HTML in `dist/` contains actual DHIS2 data
- [x] 3.3 Run `astro check` and `yarn lint` to confirm no type or lint errors in the new files
