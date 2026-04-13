## Context

The Astro app has an established data layer pattern in `src/data/`:

```
Page (.astro frontmatter)
  → Data module (src/data/<feature>/<feature>-data.ts)
    → Composition root (src/infra/composition-root.server.ts)
      → Use cases (shared domain)
        → Repositories → D2Api
```

The about page follows this pattern via `getAboutPageData()`. The methods page skips the data module layer and calls the composition root directly. Navigation data (`getNavItems()`) also follows the convention.

## Goals / Non-Goals

**Goals:**
- Make all pages consistent in how they access data: always through `src/data/<feature>/`.
- Document the convention so future pages follow it by default.
- Enforce the convention via lint rules so violations are caught at dev time.

**Non-Goals:**
- Adding caching, content collections, or Zod validation (separate concerns).
- Refactoring pages not yet migrated.
- Adding tests for trivial data pass-through modules.

## Decisions

### 1. Methods data module

Create `src/data/methods/methods-data.ts` exporting `getMethodsPageData()`. This function:
- Calls `getServerCompositionRoot()` internally.
- Fetches methods and generalContent via `runFuture()`.
- Returns a typed `MethodsPageData` object.

Even though the methods page currently needs no data transformation, the data module provides a consistent entry point and a natural place to add transformation if needed later (without touching the page).

### 2. Page frontmatter imports only from `src/data/`

`.astro` page files should import data functions from `@/data/*`, not from `@/infra/*`. The infra modules (`composition-root.server`, `future-bridge`) are implementation details of the data layer.

Image operations that need `D2Api` (like about page image downloads) are handled inside the data module. `getAboutPageData()` calls `getServerD2Api()` internally and returns fully-resolved image paths — the page never imports from `@/infra/`.

### 3. ESLint enforcement

Add a `no-restricted-imports` rule scoped to `src/pages/**/*.astro` that disallows:
- `@/infra/composition-root.server`
- `@/infra/future-bridge`

This catches violations at lint time. The error message directs developers to create a data module in `src/data/<feature>/`.

### 4. Documentation updates

- **AGENTS.md**: Add a "Data Layer Convention" section explaining the pattern, with a concrete example.
- **CLAUDE.md** (project-level): Add a rule that pages must not import infra modules directly.

## Data Flow

```
methods.astro                    about.astro
     │                                │
     ▼                                ▼
getMethodsPageData()          getAboutPageData()
(src/data/methods/)           (src/data/about/)
     │                                │
     ▼                                ▼
getServerCompositionRoot() + runFuture()
(src/infra/)
     │
     ▼
Shared CompositionRoot use cases
(../src/CompositionRoot.ts)
```

## Risks / Trade-offs

- **Boilerplate for simple pages**: The methods data module is thin — just two `runFuture` calls and a return. Accepted trade-off for consistency. The alternative (allowing direct infra imports for "simple" pages) creates a judgment call on every new page.
- **ESLint rule scope**: Only targets `.astro` files in `pages/`. Data modules and other non-page files can freely import infra modules — they are the intended consumers.
