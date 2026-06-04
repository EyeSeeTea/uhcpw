## ADDED Requirements

### Requirement: ESLint is configured for TypeScript and Astro

The project SHALL have `eslint`, `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`, and `eslint-plugin-astro` installed. An ESLint config file SHALL extend recommended configs for TypeScript and Astro.

#### Scenario: Lint script runs without config errors
- **WHEN** `yarn lint` is run
- **THEN** ESLint processes `.ts`, `.tsx`, and `.astro` files without configuration errors

#### Scenario: ESLint catches TypeScript errors
- **WHEN** a `.ts` file contains an unused variable
- **THEN** `yarn lint` reports the violation

### Requirement: Vitest is configured with React Testing Library

The project SHALL have `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, and `jsdom` installed. A `vitest.config.ts` SHALL exist with path aliases matching `tsconfig.json`.

#### Scenario: Test script runs successfully
- **WHEN** `yarn test` is run
- **THEN** Vitest discovers and executes test files matching `**/*.test.{ts,tsx}`

#### Scenario: Tests can import shared domain entities
- **WHEN** a test file imports from `@shared/domain/entities/Method`
- **THEN** the import resolves and the test compiles without errors

#### Scenario: React Testing Library works in tests
- **WHEN** a test renders a React component using `@testing-library/react`
- **THEN** the test can query rendered elements and make assertions

### Requirement: AGENTS.md documents the project setup

A `AGENTS.md` file SHALL exist at the root of `astro-app/` documenting: dev commands (`yarn start`, `yarn build`, `yarn test`, `yarn lint`), path alias conventions, architecture decisions (SSG-only, React islands, shared code strategy), and any gotchas discovered during setup.

#### Scenario: AGENTS.md exists with required sections
- **WHEN** `AGENTS.md` is read
- **THEN** it contains sections for commands, path aliases, architecture, and known gotchas
