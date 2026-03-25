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

## Commands

```sh
yarn start      # Dev server
yarn build      # Production build (static output)
yarn preview    # Preview built site
yarn lint       # ESLint
yarn test       # Vitest
yarn prettify   # Prettier
```

## Key decisions

- TypeScript 5.x (Astro requirement) — root project stays on 4.9 for now.
- Frontmatter data fetching for the PoC; Content Collections with a custom DHIS2 loader planned as follow-up.
- Prefer Astro components + scoped styles for static content; React islands only where interactivity is needed.
- Vitest for testing (native Vite/ESM support); Jest stays in the root project for existing `src/` tests.

## References

- Migration plan: `./docs/plans/ASTRO_PLAN.md`
- PoC plan: `./docs/plans/ASTRO_POC.md`
- Astro docs: https://docs.astro.build/llms.txt