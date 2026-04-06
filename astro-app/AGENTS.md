# UHC Watch - Astro PoC

This is a proof of concept of porting the UHC Watch React SPA into a fully static SSG version using Astro.

Only the `methods` and `about` pages are in scope for the initial PoC. The objective is to set a solid base to use as an example to migrate other pages.

## Architecture

- **Astro SSG** with React islands for interactive components.
- **Shared code** from the parent `src/` is imported via `@shared/*` path aliases (domain, data, types, utils).
- **Data fetching** happens at build time using the existing CompositionRoot + a Future-to-Promise bridge.
- **No runtime API calls** — all DHIS2 data is baked into static HTML at build.

## Path aliases

- `@/*` → `astro-app/src/*` (local astro code)
- `@shared/domain/*` → `../src/domain/*`
- `@shared/data/*` → `../src/data/*`
- `@shared/types/*` → `../src/types/*`
- `@shared/utils/*` → `../src/utils/*`

Aliases are defined in `tsconfig.json` (type-checking), `astro.config.mjs` → `vite.resolve.alias` (bundling), and `vitest.config.ts` (tests).

## Commands

```sh
yarn start      # Dev server (astro dev)
yarn build      # Production build (static output to dist/)
yarn preview    # Preview built site
yarn test       # Vitest (run once)
yarn test:watch # Vitest (watch mode)
yarn lint       # ESLint
yarn astro check # Runs diagnostics (such as type-checking within .astro files)
yarn prettify   # Prettier
```

## Key decisions

- TypeScript 5.x (Astro requirement) — root project stays on 4.9 for now.
- React 18 in astro-app (required by `@astrojs/react`). Parent uses React 17 — safe because islands are independently hydrated.
- Shared dependency versions match parent `package.json` exactly to avoid runtime mismatches.
- Frontmatter data fetching for the PoC; Content Collections with a custom DHIS2 loader planned as follow-up.
- Prefer Astro components + scoped styles for static content; React islands only where interactivity is needed.
- Vitest for testing (native Vite/ESM support); Jest stays in the root project for existing `src/` tests.
- ESLint v10 with flat config (`eslint.config.mjs`).

## Migrating a Component or Page

- Look and feel should be a perfect match, except explicitely asked, or agreed because tradeoffs
- Do not make up content. Respect same content as in source.
- Use the visual-compare skill to verify your work can be considered complete.
- If the content is dynamic in source, do not hardcode, unless you are creating a mock - in that case ask the user.

## Caveats & Technical Debt

All migration caveats, workarounds, and technical debt are tracked in [`docs/migration-caveats.md`](./docs/migration-caveats.md). **Keep that file updated** whenever you encounter a new issue, caveat, or workaround during any migration phase.

## References

- Migration plan: `./docs/plans/ASTRO_PLAN.md`
- PoC plan: `./docs/plans/ASTRO_POC.md`
- Astro docs: https://docs.astro.build/llms.txt
