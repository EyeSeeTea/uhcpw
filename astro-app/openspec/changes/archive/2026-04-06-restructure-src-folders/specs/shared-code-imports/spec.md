## MODIFIED Requirements

### Requirement: TypeScript resolves local import
The local alias `@/*` SHALL map to `./src/*`. Imports using this alias SHALL resolve correctly after the restructuring (e.g., `@/data/about/about-data` instead of `@/lib/about-data`).

#### Scenario: TypeScript resolves local import
- **WHEN** a file imports from `@/data/about/about-data`
- **THEN** `astro check` resolves the import to `astro-app/src/data/about/about-data`

#### Scenario: TypeScript resolves infra import
- **WHEN** a file imports from `@/infra/composition-root.server`
- **THEN** `astro check` resolves the import to `astro-app/src/infra/composition-root.server`
