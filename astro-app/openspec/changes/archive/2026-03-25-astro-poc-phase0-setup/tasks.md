## 1. React Integration

- [x] 1.1 [FE] Install `@astrojs/react`, `react@18`, `react-dom@18` and their type packages
- [x] 1.2 [FE] Update `astro.config.mjs` to include the `react()` integration
- [x] 1.3 [FE] Create a trivial `.tsx` island component and render it in an `.astro` page with `client:load` to confirm it works

## 2. TypeScript & Path Aliases

- [x] 2.1 [FE] Install `typescript@^5.9` as a dev dependency in `astro-app/`
- [x] 2.2 [FE] Update `tsconfig.json`: extend `astro/tsconfigs/strict`, set `jsx: "react-jsx"`, `jsxImportSource: "react"`, add `baseUrl` and path aliases (`@/*`, `@shared/domain/*`, `@shared/data/*`, `@shared/types/*`, `@shared/utils/*`)
- [x] 2.3 [FE] Add `include` entries for `../src/domain/**/*`, `../src/data/**/*`, `../src/types/**/*`, `../src/utils/**/*`
- [x] 2.4 [FE] Mirror all path aliases in `astro.config.mjs` → `vite.resolve.alias`
- [x] 2.5 [FE] Run `astro check` and fix any TS 5.x errors in shared code (use `skipLibCheck: true` as stopgap if needed)

## 3. Shared Dependencies

- [x] 3.1 [FE] Install shared dependencies pinned to the same versions as the parent `package.json`: `@eyeseetea/d2-api@1.13.1`, `fluture@14.0.0`, `purify-ts@1.2.0`, `lodash@4.17.21`, `@dhis2/d2-i18n@1.1.0`
- [x] 3.2 [FE] Install type packages: `@types/lodash` and any other missing `@types/*`
- [x] 3.3 [FE] Configure `vite.ssr.noExternal` or `vite.optimizeDeps.include` for CJS dependencies that fail to bundle (not needed — all deps bundle fine)

## 4. Validate Shared Code Import

- [x] 4.1 [FE] Create a throwaway `.astro` page that imports a domain entity, a utility, and a repository from `@shared/*`
- [x] 4.2 [FE] Run `astro dev` and confirm no build/resolution errors
- [x] 4.3 [FE] Run `astro build` and confirm static output is generated successfully
- [x] 4.4 [FE] Remove the throwaway validation page

## 5. ESLint

- [x] 5.1 [FE] Install `eslint`, `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`, `eslint-plugin-astro`
- [x] 5.2 [FE] Create `eslint.config.mjs` (flat config for ESLint v10) extending recommended configs for TypeScript and Astro
- [x] 5.3 [FE] Add `"lint": "eslint src/"` script to `package.json`
- [x] 5.4 [FE] Run `yarn lint` and fix any violations

## 6. Vitest

- [x] 6.1 [FE] Install `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`
- [x] 6.2 [FE] Create `vitest.config.ts` with path aliases matching `tsconfig.json` and `jsdom` environment
- [x] 6.3 [FE] Create a trivial test that imports a shared domain entity and asserts something
- [x] 6.4 [FE] Add `"test": "vitest run"` and `"test:watch": "vitest"` scripts to `package.json`
- [x] 6.5 [FE] Run `yarn test` and confirm it passes

## 7. Documentation

- [x] 7.1 [FE] Update `AGENTS.md` with dev commands, path alias conventions, architecture decisions (SSG-only, React islands, shared code strategy), and gotchas discovered during setup

## 8. Final Validation

- [x] 8.1 [FE] Confirm `yarn start` (astro dev) works
- [x] 8.2 [FE] Confirm `yarn build` (astro build) succeeds
- [x] 8.3 [FE] Confirm `yarn test` passes
- [x] 8.4 [FE] Confirm `yarn lint` passes
