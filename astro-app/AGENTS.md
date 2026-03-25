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

## Gotchas

- **`verbatimModuleSyntax: false`** in tsconfig — Astro's strict config enables this, but parent shared code has 500+ type imports without `type` keyword. Fixing the parent is a separate follow-up.
- **`skipLibCheck: true`** — Parent hand-written `.d.ts` files (`d2-analytics.d.ts`, `d2.d.ts`, `i18n.d.ts`) have type errors under TS 5.x strict mode.
- **`PersonD2Repository.ts` excluded from tsconfig `include`** — It imports a `.png` from `webapp/assets/` which Astro types as `ImageMetadata` instead of `string`. The file is still importable at build time; it's only excluded from proactive type-checking.
- **Parent test files excluded from tsconfig** — `__tests__/`, `*.spec.*`, `*.test.*`, `tests-ui.tsx`, and `data/export/` are excluded to avoid irrelevant type errors from parent test code.

## References

- Migration plan: `./docs/plans/ASTRO_PLAN.md`
- PoC plan: `./docs/plans/ASTRO_POC.md`
- Astro docs: https://docs.astro.build/llms.txt
