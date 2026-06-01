## Why

The `astro-app/` directory was scaffolded with only bare Astro core — no React integration, no TypeScript tooling, no shared code imports, and no dev infrastructure (linting, testing). Before any page work (Methods, About) can begin, the project needs a production-ready dev environment that proves shared code from the parent `src/` can be imported and used inside Astro, and that React components can render as islands.

## What Changes

- Add `@astrojs/react` integration with React 18 so `.tsx` components render as Astro islands.
- Install TypeScript 5.x in `astro-app/` and configure `tsconfig.json` with path aliases (`@/*` for local, `@shared/*` for parent `src/` code).
- Mirror path aliases in `astro.config.mjs` via `vite.resolve.alias` for build-time resolution.
- Install shared dependencies required by parent code: `@eyeseetea/d2-api`, `fluture`, `purify-ts`, `lodash`, `@dhis2/d2-i18n`.
- Validate that shared domain entities, utilities, and repositories can be imported and built successfully.
- Add ESLint with TypeScript and Astro plugins.
- Add Vitest with React Testing Library and path aliases matching tsconfig.
- Update `AGENTS.md` with dev commands, alias conventions, architecture decisions, and gotchas.

## Capabilities

### New Capabilities

- `react-integration`: Astro React integration setup enabling `.tsx` island rendering.
- `shared-code-imports`: TypeScript path aliases and Vite alias config for importing from parent `src/domain/`, `src/data/`, `src/types/`, `src/utils/`.
- `dev-tooling`: ESLint, Vitest, and Prettier configuration for the Astro project.
- `shared-deps`: Installation and resolution of shared dependencies (`d2-api`, `fluture`, `purify-ts`, `lodash`, `d2-i18n`) so parent code compiles.

### Modified Capabilities

_(none — this is greenfield setup)_

## Impact

- **`astro-app/package.json`**: New dependencies (React, TypeScript 5.x, ESLint, Vitest, shared libs).
- **`astro-app/tsconfig.json`**: Extended with path aliases, JSX config, and include paths for parent `src/`.
- **`astro-app/astro.config.mjs`**: React integration + Vite alias configuration.
- **New config files**: `.eslintrc.cjs`, `vitest.config.ts`.
- **Updated documentation**: `AGENTS.md` with gotchas and setup details.
- **Parent `src/`**: May require minor fixes if TS 5.x surfaces new strictness errors (low risk).
