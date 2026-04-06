# shared-deps Specification

## Purpose
TBD - created by archiving change astro-poc-phase0-setup. Update Purpose after archive.
## Requirements
### Requirement: Shared dependencies are installed

The project SHALL have the following dependencies installed so that parent shared code compiles: `@eyeseetea/d2-api`, `fluture`, `purify-ts`, `lodash`, `@dhis2/d2-i18n`. Their type packages (e.g., `@types/lodash`) SHALL also be installed where applicable. Each dependency SHALL be pinned to the **same version** as the parent `package.json` to avoid runtime mismatches between shared code expectations and the installed module:

- `@eyeseetea/d2-api`: 1.13.1
- `fluture`: 14.0.0
- `purify-ts`: 1.2.0
- `lodash`: 4.17.21
- `@dhis2/d2-i18n`: 1.1.0

#### Scenario: Shared code dependencies resolve
- **WHEN** `astro build` is run with a file importing `@shared/data/` repositories
- **THEN** all transitive dependencies (`fluture`, `d2-api`, `purify-ts`, `lodash`) resolve without "module not found" errors

#### Scenario: Dependency versions match parent project
- **WHEN** `astro-app/package.json` dependency versions are compared with the root `package.json`
- **THEN** all shared dependencies use the exact same version as the parent project

### Requirement: CJS/ESM compatibility for shared dependencies

Dependencies that ship as CommonJS (e.g., `fluture`, `@eyeseetea/d2-api`) SHALL be configured in `vite.ssr.noExternal` or `vite.optimizeDeps.include` as needed so Vite can bundle them correctly. The Future-to-Promise bridge SHALL reside in `src/infra/future-bridge.ts`.

#### Scenario: CJS dependencies bundle without errors
- **WHEN** `astro build` is run and shared code imports a CJS-only dependency
- **THEN** Vite bundles the dependency without "require is not defined" or "default export" errors

#### Scenario: Future bridge is in infra/
- **WHEN** inspecting the location of future-bridge.ts
- **THEN** it SHALL be at `src/infra/future-bridge.ts`

