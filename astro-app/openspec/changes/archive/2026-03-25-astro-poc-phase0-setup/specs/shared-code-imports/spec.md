## ADDED Requirements

### Requirement: TypeScript path aliases resolve shared code

The `tsconfig.json` SHALL define path aliases mapping `@shared/domain/*`, `@shared/data/*`, `@shared/types/*`, and `@shared/utils/*` to the corresponding directories in the parent `../src/`. The local alias `@/*` SHALL map to `./src/*`.

#### Scenario: TypeScript resolves shared domain import
- **WHEN** an `.astro` or `.ts` file imports from `@shared/domain/entities/Method`
- **THEN** `astro check` resolves the import without type errors

#### Scenario: TypeScript resolves local import
- **WHEN** a file imports from `@/lib/some-module`
- **THEN** `astro check` resolves the import to `astro-app/src/lib/some-module`

### Requirement: Vite resolves path aliases at build time

The `astro.config.mjs` SHALL configure `vite.resolve.alias` mirroring all `tsconfig.json` path aliases so that Vite can bundle shared code at build time.

#### Scenario: Vite bundles shared code during build
- **WHEN** `astro build` is run with a page importing `@shared/domain/entities/Method`
- **THEN** the build completes successfully and the shared code is included in the output

### Requirement: TypeScript 5.x is installed in astro-app

The project SHALL use TypeScript ^5.9 as a dev dependency. The `tsconfig.json` SHALL extend `astro/tsconfigs/strict` and configure `jsx: "react-jsx"` with `jsxImportSource: "react"`.

#### Scenario: TypeScript version is 5.x
- **WHEN** `npx tsc --version` is run in `astro-app/`
- **THEN** the reported version is 5.9.x or higher

### Requirement: Shared code compiles under TypeScript 5.x

Shared code from `../src/domain/`, `../src/data/`, `../src/types/`, and `../src/utils/` SHALL compile without errors under TypeScript 5.x (or with `skipLibCheck: true` as an accepted stopgap).

#### Scenario: astro check passes with shared imports
- **WHEN** `astro check` is run after importing shared entities
- **THEN** no type errors are reported for the shared code imports

### Requirement: Include paths cover shared source directories

The `tsconfig.json` `include` array SHALL contain glob patterns for `../src/domain/**/*`, `../src/data/**/*`, `../src/types/**/*`, and `../src/utils/**/*` so the type checker processes shared files.

#### Scenario: Shared files are included in type checking
- **WHEN** `astro check` is run
- **THEN** files in `../src/domain/` are type-checked (not skipped)
