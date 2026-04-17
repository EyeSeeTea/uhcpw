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

## Source Directory Structure

```
src/
├── data/<feature>/       # Page-specific data fetching, shaping, validation
├── infra/                # Framework glue: API init, adapter patterns
├── lib/                  # Generic reusable utilities (no domain knowledge)
├── islands/<feature>/    # React islands grouped by feature/page
├── components/<feature>/ # Astro components grouped by feature/page
├── pages/                # Astro page routes
├── layouts/              # Astro layout wrappers
├── styles/               # Global CSS and design tokens
└── types/                # TypeScript type declarations
```

**Where to put new files:**
- Data fetching/shaping for a page → `data/<feature>/` (e.g., `data/about/about-data.ts`)
- Framework plumbing (composition root, adapters) → `infra/`
- Generic utility with no domain knowledge → `lib/`
- React island for a page → `islands/<feature>/`
- Astro component for a page → `components/<feature>/`

**Test convention:** All tests go in `__tests__/` subfolders within their parent directory (e.g., `data/about/__tests__/about-data.test.ts`). Do not colocate test files as siblings.

**Import convention:** Use `@/` absolute imports for cross-directory references (e.g., `@/data/about/about-data`, `@/infra/composition-root.server`). Use relative imports only within the same module (e.g., `../about-data` from `__tests__/`, `./PersonCardReact` from a sibling). This is enforced by ESLint via `no-restricted-imports`.

## Data Layer Convention

Astro pages must not call the composition root or future bridge directly. All data fetching goes through modules in `src/data/<feature>/`.

**Pattern:**

```
Page (.astro frontmatter)
  → Data module (src/data/<feature>/<feature>-data.ts)
    → Composition root + runFuture (src/infra/)
      → Shared use cases (../src/)
```

**Example:** The methods page calls `getMethodsPageData()` from `src/data/methods/methods-data.ts`, which internally uses the composition root and returns a typed `MethodsPageData`. The page never imports from `@/infra/`.

**Why:** Consistent entry points make the codebase navigable and testable. Pages stay focused on rendering; data modules own fetching and transformation.

**Enforcement:** ESLint `no-restricted-imports` prevents `src/pages/**/*.astro` from importing `@/infra/composition-root.server` or `@/infra/future-bridge`. If you need to fetch data in a page, create or extend a data module in `src/data/`.

**When adding a new page:**
1. Create `src/data/<feature>/<feature>-data.ts` with a `get<Feature>PageData()` function
2. The function calls `getServerCompositionRoot()` and `runFuture()` internally
3. Return a typed result object — the page destructures it in frontmatter
4. Shared data (like `generalContent`) can use existing modules (e.g., `getGeneralContent()` from `@/data/general-content`)

### Server-only imports and the island boundary

Anything that reaches for Node APIs (`node:fs`, `node:crypto`, `sharp`, etc.) or the composition root is **server-only** and must never end up in a client bundle.

Vite follows value imports transitively. If a React island imports a single value from a module that (directly or indirectly) imports a server-only module, the entire chain gets pulled into the client bundle and the build fails with errors like `"createHash" is not exported by "__vite-browser-external"`. Type-only imports are erased by the TypeScript transform and are safe.

**Rule:** keep `<feature>-data.ts` (server orchestration: composition root, build-time fetching, image downloads) separate from `<feature>-resource.ts` / `<feature>-types.ts` (pure types + pure helpers with no runtime deps). Islands and components import from the pure leaf; only pages import from the server module.

```
data/<feature>/
├── <feature>-data.ts      ← server only: getXxxPageData, composition root, image prefetch
├── <feature>-resource.ts  ← pure: types, tag helpers, build* functions (no node:*, no sharp, no composition root)
├── <feature>-images.ts    ← server only: downloadXxxImages (imports image-downloader)
```

When adding a helper that an island needs, put it in the pure leaf, not the `-data` module.

## Caveats & Technical Debt

All migration caveats, workarounds, and technical debt are tracked in [`docs/migration-caveats.md`](./docs/migration-caveats.md). **Keep that file updated** whenever you encounter a new issue, caveat, or workaround during any migration phase.

## References

- Migration plan: `./docs/plans/ASTRO_PLAN.md`
- PoC plan: `./docs/plans/ASTRO_POC.md`
- Astro docs: https://docs.astro.build/llms.txt
