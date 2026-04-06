## REMOVED Requirements

### Requirement: apiToFuture utility
**Reason**: `apiToFuture` from `futures.ts` is unused — no file in the project imports it (confirmed via grep). The `future-bridge.ts` module provides the only Future adapter needed (`runFuture`).
**Migration**: Delete `src/lib/futures.ts`. No code changes needed since nothing imports it.

## MODIFIED Requirements

### Requirement: CJS/ESM compatibility for shared dependencies
Dependencies that ship as CommonJS (e.g., `fluture`, `@eyeseetea/d2-api`) SHALL be configured in `vite.ssr.noExternal` or `vite.optimizeDeps.include` as needed so Vite can bundle them correctly. The Future-to-Promise bridge SHALL reside in `src/infra/future-bridge.ts`.

#### Scenario: CJS dependencies bundle without errors
- **WHEN** `astro build` is run and shared code imports a CJS-only dependency
- **THEN** Vite bundles the dependency without "require is not defined" or "default export" errors

#### Scenario: Future bridge is in infra/
- **WHEN** inspecting the location of future-bridge.ts
- **THEN** it SHALL be at `src/infra/future-bridge.ts`
