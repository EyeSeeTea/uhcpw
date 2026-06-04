## Context

The `astro-app/` directory contains a minimal Astro 6 scaffold (only `astro` and `prettier` installed). The parent project at `../src/` is a React 17 SPA using TypeScript 4.9.4, with shared domain/data/utils layers that the Astro app must import. The parent uses `fluture` (Future monad), `purify-ts`, `@eyeseetea/d2-api`, and `lodash` throughout these layers.

Before any page work can begin, the Astro project needs: React island support, TypeScript 5.x with path aliases to the parent code, all shared dependencies installed, and dev tooling (linting + testing).

## Goals / Non-Goals

**Goals:**

- React `.tsx` components render as Astro islands inside `.astro` pages.
- Shared code from `../src/domain/`, `../src/data/`, `../src/types/`, `../src/utils/` imports and compiles without errors.
- `astro dev` and `astro build` succeed with shared imports.
- ESLint and Vitest are configured and passing.
- `CLAUDE.md` documents the setup for future contributors and AI assistants.

**Non-Goals:**

- Upgrading the root project to TypeScript 5.x (separate follow-up).
- Building any actual pages (Methods, About) — that's Phase 1+.
- Migrating styled-components or Material-UI — only needed when pages use those components.
- Setting up CI/CD pipelines.
- Content Collections or data fetching — Phase 1 scope.

## Decisions

### D1: TypeScript 5.x in astro-app only

Install `typescript@^5.9` locally in `astro-app/`. The root project stays on 4.9.4. Astro 6 requires TS 5.x and won't compile without it.

**Alternative considered:** Upgrade root to TS 5.x. Rejected — too broad for POC scope; shared code is low-risk (no legacy decorators, no risky enum patterns).

**Fallback:** If TS 5.x surfaces errors in shared code that are too invasive to fix, use `skipLibCheck: true` as a stopgap.

### D2: Dual-namespace path aliases (`@/*` + `@shared/*`)

- `@/*` → `astro-app/src/*` (local code)
- `@shared/domain/*` → `../src/domain/*` (parent shared code)
- `@shared/data/*` → `../src/data/*`
- `@shared/types/*` → `../src/types/*`
- `@shared/utils/*` → `../src/utils/*`

Aliases are configured in both `tsconfig.json` (for type-checking) and `astro.config.mjs` → `vite.resolve.alias` (for bundling).

**Alternative considered:** Single `@/` namespace pointing to parent. Rejected — creates ambiguity between local and shared code.

### D3: React 18 for islands

Install `react@18` and `react-dom@18` in astro-app. The parent project uses React 17, but Astro's React integration requires 18+. This is safe because:
- Astro islands are independently hydrated — no shared React tree with the parent.
- React 18 is backward-compatible for component APIs used in the shared code.

**Alternative considered:** React 19. Rejected — too new, potential compatibility issues with Material-UI 4 (needed later for island reuse).

**Why not React 17?** `@astrojs/react` requires React 18+. Running two React versions simultaneously is not feasible — it causes hooks errors and context mismatches. This is safe because: (1) Astro islands are independently hydrated with no shared React tree with the parent SPA; (2) shared `@shared/*` imports are domain/data/utils code with no React dependency; (3) React 18 is backward-compatible for standard component APIs, so parent React components can be reused as islands in Phase 2+ without modification; (4) Material-UI 4 works on React 18.

### D4: Vitest over Jest

Vitest is the natural choice for Astro/Vite projects — native ESM, shared Vite config, fast. Jest stays for the root project's existing tests.

### D5: ESLint v10 with flat config

Use `eslint` v10 + `typescript-eslint` + `eslint-plugin-astro` with flat config format (`eslint.config.mjs`). ESLint v10 dropped legacy `.eslintrc` support.

### D6: Validation via throwaway test page

Create a temporary `.astro` page that imports shared domain entities, utilities, and a repository to prove the import chain works end-to-end. This page is deleted after validation.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| CJS/ESM mismatch when importing shared code via Vite | Use `vite.ssr.noExternal` or `vite.optimizeDeps.include` to force Vite to bundle problematic CJS deps |
| TS 5.x strictness breaks shared code compilation | Validate early in Step 0.2; `skipLibCheck: true` as escape hatch |
| React 17→18 API differences in shared components | Islands are isolated; React 18 is backward-compatible for class/function components |
| `fluture` or `d2-api` reference Node built-ins that Vite can't resolve | Add Vite polyfills or `vite.ssr.external` for Node-only deps (only relevant at build-time in SSG) |
| Dual TypeScript versions (4.9 root, 5.x astro-app) cause IDE confusion | Workspace-aware editors (VS Code) resolve per-project `tsconfig.json`; document in CLAUDE.md |
