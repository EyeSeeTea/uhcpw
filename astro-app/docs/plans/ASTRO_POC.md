# Astro SSG Proof of Concept — About & Methods Pages

## Objective

Deliver a fully-working static replica of the **About** and **Methods** pages using Astro SSG, with data fetched at build time from DHIS2. The POC must demonstrate that:

1. Shared code from `src/domain/`, `src/data/`, `src/types/`, and `src/utils/` can be imported and used inside `astro-app/`.
2. Existing React components can be rendered as Astro islands.
3. The project tooling (TypeScript, linting, testing, formatting) is solid from day one.
4. The architecture supports future page additions without rework.

---

## Phase 0 — Project Setup

Everything in this phase happens inside `astro-app/`. The goal is a production-ready dev environment before writing any page code.

### Step 0.1: Add React integration

- `yarn add @astrojs/react react react-dom`
- Update `astro.config.mjs` to include `react()` integration.
- Confirm a trivial `.tsx` island renders inside an `.astro` page.

### Step 0.2: Resolve TypeScript version mismatch

The root project uses **TypeScript 4.9.4**. Astro 6 requires **TypeScript ^5.9.3**. The shared code in `src/` was written against 4.9 — compiling it under 5.x may surface new strictness errors.

**Action:**
- Install TypeScript 5.x explicitly in `astro-app/`: `yarn add -D typescript@^5.9`.
- Run `astro check` (Astro's built-in type checker) against the shared imports.
- Fix any new TS 5.x errors in the shared code. Known low-risk: the shared code does not use legacy decorators (the `@cache` decorator in `utils/cache.ts` is defined but unused). Main things to watch for:
    - `enum` behavior changes (TS 5.0+).
    - Stricter generic inference.
    - `moduleResolution: "bundler"` (new in 5.0) — Astro's strict tsconfig may set this, which changes how bare specifiers resolve.
- If shared code fixes are too invasive, use `skipLibCheck: true` in astro-app's tsconfig as a stopgap.

> **Note:** Upgrading the root project to TS 5.x is the long-term right answer but is outside POC scope. Track it as a follow-up.

### Step 0.3: Configure TypeScript path aliases

Update `astro-app/tsconfig.json` so the Astro app can import from the parent `src/`:

```jsonc
{
    "extends": "astro/tsconfigs/strict",
    "compilerOptions": {
        "baseUrl": ".",
        "jsx": "react-jsx",
        "jsxImportSource": "react",
        "paths": {
            "@/*": ["./src/*"],
            "@shared/domain/*": ["../src/domain/*"],
            "@shared/data/*": ["../src/data/*"],
            "@shared/types/*": ["../src/types/*"],
            "@shared/utils/*": ["../src/utils/*"]
        }
    },
    "include": [".astro/types.d.ts", "src/**/*", "../src/domain/**/*", "../src/data/**/*", "../src/types/**/*", "../src/utils/**/*"],
    "exclude": ["node_modules", "dist"]
}
```

Mirror path aliases in `astro.config.mjs` → `vite.resolve.alias` so Vite resolves them at build time.

### Step 0.4: Install shared dependencies

The shared code (`src/data/`, `src/domain/`) depends on libraries that must also be available in `astro-app/`:

- `@eyeseetea/d2-api` — DHIS2 API client
- `fluture` — Future monad used everywhere in the data layer
- `purify-ts` — Codec/Either types used in `src/utils/codec.ts`
- `lodash` — used in repositories and utilities
- `@dhis2/d2-i18n` — i18n strings in components

Install these (and their types) in `astro-app/package.json`.

### Step 0.5: Validate shared code import

**This is the critical-path validation.** Create a throwaway `.astro` page that:

1. Imports a domain entity (e.g. `Person` from `@shared/domain/Person.ts`).
2. Imports a utility (e.g. `getUid` from `@shared/utils/uid.ts`).
3. Imports a repository (e.g. `MethodD2Repository`) and instantiates it.
4. Runs `astro dev` — confirm no build errors.

If this step fails (module resolution, CJS/ESM mismatch, missing types), fix it here before continuing. Common issues:
- **CJS vs ESM**: Some DHIS2 libs may need `vite.ssr.noExternal` or `vite.optimizeDeps.include` config.
- **Node built-ins**: Fluture or d2-api may reference Node APIs that Vite needs polyfilled.
- **Type conflicts**: Astro's strict tsconfig may flag issues the original tsconfig allowed.

> **Exit criterion:** `astro dev` and `astro build` succeed with shared imports.

### Step 0.6: Add ESLint

- Install `eslint`, `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`, `eslint-plugin-astro`.
- Create `astro-app/.eslintrc.cjs` extending recommended configs.
- Add `"lint": "eslint src/ --ext .ts,.tsx,.astro"` script.

### Step 0.7: Add Vitest

- Install `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`.
- Create `astro-app/vitest.config.ts` with path aliases matching tsconfig.
- Create a trivial test that imports a shared domain entity and asserts something.
- Add `"test": "vitest run"` and `"test:watch": "vitest"` scripts.

### Step 0.8: Add CLAUDE.md

Create `astro-app/CLAUDE.md` documenting:
- How to run dev / build / test / lint.
- Path alias conventions (`@/*` = astro-app local, `@shared/*` = parent src).
- Architecture decisions (SSG-only, React islands pattern, shared code strategy).
- Any gotchas discovered in earlier steps.

---

## Phase 1 — Build-Time Data Layer

### Content Collections vs. Frontmatter Fetching

Astro offers two ways to get data into pages at build time:

**Frontmatter fetching** — async code directly in the `.astro` page frontmatter:
```astro
---
const methods = await runFuture(compositionRoot.method.get.execute());
---
```
Simple and direct. No schema validation, no caching between builds, re-fetches on every build.

**Content Collections with a custom loader** (Astro 5+) — define collections in `src/content.config.ts` with Zod schemas and a loader that fetches from any source:
```ts
const methods = defineCollection({
    loader: dhis2Loader({ useCase: "method.get" }),
    schema: z.object({
        sectionName: z.string(),
        shortText: z.string(),
        text: z.string(),
    }),
});
```
Gives you Zod validation (catches DHIS2 data shape issues at build time), type-safe `getCollection()` / `getEntry()` queries, and potential incremental build caching.

**Decision for the POC:** Start with **frontmatter fetching**. It is simpler and validates the shared import path faster. Content Collections with a custom DHIS2 loader is the right long-term architecture — plan it as a follow-up after the POC confirms the data layer works.

### Step 1.1: Create the server-side CompositionRoot

Create `astro-app/src/lib/composition-root.server.ts`:

- Instantiate `D2Api` using env vars (`DHIS2_BASE_URL`, `DHIS2_USERNAME`, `DHIS2_PASSWORD`).
- Reuse `getCompositionRoot()` from `@shared/CompositionRoot`.
- Export a singleton getter: `getServerCompositionRoot()`.

Create `astro-app/.env.example` documenting required env vars.

### Step 1.2: Create a Future-to-Promise bridge

Astro frontmatter is async/await. The shared data layer returns `FutureData<T>`. Create a helper:

```typescript
// astro-app/src/lib/future-bridge.ts
import { FutureData } from "@shared/domain/Future";

export function runFuture<T>(future: FutureData<T>): Promise<T> {
    return new Promise((resolve, reject) => {
        future.run(resolve, reject);
    });
}
```

### Step 1.3: Validate data fetching at build time

Create a test `.astro` page that:

1. Calls `getServerCompositionRoot().method.get.execute()` via `runFuture()`.
2. Renders the returned `Method[]` as raw JSON in the HTML.
3. Run `astro build` → inspect the generated HTML → confirm real DHIS2 data is baked in.

Do the same for `about.getPersons` and `about.getOfficeInfo`.

> **Exit criterion:** `astro build` produces static HTML containing real data from DHIS2.

---

## Phase 2 — Astro Layout & Shared Chrome

### Step 2.1: Create the base Layout

Create `astro-app/src/layouts/Layout.astro`:

- `<html>`, `<head>` with meta tags, viewport, fonts.
- Slot for page content.
- Minimal global CSS (resets, font imports, CSS custom properties for the theme).

### Step 2.2: Migrate AppHeader and AppFooter

These are the shared chrome visible on every page. Two approaches (pick based on complexity):

**Option A — Rewrite as Astro components** (preferred if they are mostly static HTML/CSS):
- `astro-app/src/components/layout/Header.astro`
- `astro-app/src/components/layout/Footer.astro`
- Port the HTML structure, replace styled-components with scoped `<style>` blocks.
- Navigation links become plain `<a href>` (no React Router).

**Option B — Wrap existing React components as islands** (if they have complex interactivity):
- Import the existing `AppHeader`/`AppFooter` from `src/webapp/components/layout/`.
- Render with `client:load`.
- This pulls in Material-UI and styled-components — acceptable for POC but not ideal long-term.

### Step 2.3: Add responsive breakpoints

Port the breakpoint constants (`BREAKPOINT_WIDTH_SMALL_SCREEN = 600`) as CSS custom properties or a shared TS constant used by both Astro scoped styles and React islands.

---

## Phase 3 — Methods Page

The Methods page is simpler (no interactivity beyond expand/collapse), making it a good first target.

### Step 3.1: Create `astro-app/src/pages/methods.astro`

Frontmatter:
```astro
---
import Layout from "@/layouts/Layout.astro";
import { getServerCompositionRoot } from "@/lib/composition-root.server";
import { runFuture } from "@/lib/future-bridge";

const compositionRoot = getServerCompositionRoot();
const methods = await runFuture(compositionRoot.method.get.execute());
---
```

### Step 3.2: Render static content

- Title section with gradient/bubble background (use Astro scoped styles).
- Two-column grid of method sections rendered as static HTML + markdown.
- Download links for Abbreviations and Glossary.

### Step 3.3: Add expand/collapse interactivity

The "Read more / Read less" toggle is the only interactive element. Options:

**Option A — Vanilla JS + `<details>`/`<summary>`** (simplest, no React needed):
```html
<details>
    <summary>Read more</summary>
    <div set:html={fullMarkdown} />
</details>
```

**Option B — Small React island** for each expandable section:
```astro
<MethodSection client:visible method={method} />
```

Option A is preferred for the POC — it avoids shipping any JS for this page.

### Step 3.4: Markdown rendering

Methods content comes as markdown strings. Use Astro's `set:html` with a markdown-to-HTML utility, or install `marked` / reuse `react-markdown` in an island.

### Step 3.5: Test the Methods page

- **Unit test**: Vitest test that the `runFuture` bridge works with a mocked `MethodD2Repository`.
- **Visual check**: `astro dev` → navigate to `/methods` → compare with the current React version.

> **Exit criterion:** `/methods` renders identically to the React version, with zero client-side JS (or minimal for expand/collapse).

---

## Phase 4 — About Page

The About page is more complex: team listing, experts network with country filtering, office info with video link.

### Step 4.1: Create `astro-app/src/pages/about.astro`

Frontmatter fetches all data:
```astro
---
const compositionRoot = getServerCompositionRoot();
const [team, experts, officeInfo] = await Promise.all([
    runFuture(compositionRoot.about.getPersons.execute(true)),
    runFuture(compositionRoot.about.getPersons.execute(false)),
    runFuture(compositionRoot.about.getOfficeInfo.execute()),
]);
---
```

### Step 4.2: Static sections

- **Header section**: Office image, video link, markdown description → all static Astro HTML.
- **Team section**: Grid of `ItemPerson` cards → static Astro component or a simple React island.

### Step 4.3: Create the ItemPerson component

Evaluate whether to rewrite as Astro or reuse the React component:

- The existing `ItemPerson.tsx` uses Material-UI Grid, styled-components, and react-markdown.
- **For POC**: Wrap the existing React component as an island (`client:load`) to validate reuse.
- **For production**: Consider rewriting as an Astro component with scoped styles.

### Step 4.4: Experts Network with country filtering (React island)

This is the first truly interactive section — users filter experts by country using a `TreeSelector` dropdown.

- Create `astro-app/src/islands/ExpertsNetwork.tsx` (or reuse the existing component).
- Pass the full `experts` array and `countries` list as props from the Astro frontmatter.
- Render with `client:visible` (defer hydration until user scrolls to this section).
- Filtering happens client-side on the pre-fetched data — no API calls needed at runtime.

### Step 4.5: Test the About page

- **Unit test**: Vitest test for the ExpertsNetwork island filtering logic.
- **Visual check**: Compare with the current React version.

> **Exit criterion:** `/about` renders identically to the React version. Static sections have zero JS. Experts filtering works client-side.

---

## Phase 5 — Polish & Validation

### Step 5.1: Responsive design

- Test both pages at mobile (< 600px), tablet, and desktop widths.
- Ensure grid layouts collapse correctly.
- Verify the header/footer are responsive.

### Step 5.2: SEO & meta tags

- Add proper `<title>`, `<meta description>`, Open Graph tags per page.
- Port `SeoMetaTags` logic as Astro head content (no browser APIs needed at build time).

### Step 5.3: Performance audit

- Run `astro build` and check the output:
    - Methods page should be ~0 KB JS (if using `<details>` for expand/collapse).
    - About page JS should only include the ExpertsNetwork island + its deps.
- Compare total page weight vs the current React SPA bundle.

### Step 5.4: Full build validation

- `yarn lint` passes.
- `yarn test` passes.
- `yarn build` succeeds.
- Generated HTML in `dist/` contains real DHIS2 data.
- Pages are navigable by opening `dist/` files directly (no server needed).

---

## Decision Log

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | Use `@shared/*` aliases (not `@/domain`) | Avoids ambiguity with astro-app's own `@/*` namespace |
| 2 | Methods page first | Simpler (no interactivity), validates data pipeline faster |
| 3 | `<details>` over React for expand/collapse | Zero JS for a static page; can always upgrade later |
| 4 | Reuse React components as islands for POC | Proves the import path works; rewrite to Astro later |
| 5 | All data fetched at build time | Matches SSG model; no runtime API calls for these pages |
| 6 | Vitest over Jest for astro-app | Native Vite/ESM support; Jest stays for the original `src/` tests |
| 7 | TypeScript 5.x in astro-app, 4.9 in root | Astro 6 requires TS 5.x; shared code is low-risk for upgrade; root upgrade is a separate follow-up |
| 8 | Frontmatter fetching for POC, Content Collections later | Simpler to validate the shared data path; Content Collections with a custom DHIS2 loader is the right long-term pattern for schema validation and caching |

---

## Risk Register

| Risk | Impact | Mitigation |
|------|--------|------------|
| CJS/ESM mismatch when importing shared code | Blocks everything | Validate in Step 0.5 before any page work; use `vite.ssr.noExternal` as escape hatch |
| TypeScript 5.x breaks shared code compilation | Blocks shared imports | Validate in Step 0.2; use `skipLibCheck: true` as stopgap; shared code doesn't use risky TS 4→5 patterns (no legacy decorators) |
| Fluture Futures don't resolve in Astro build context | Blocks data fetching | Future-to-Promise bridge (Step 1.2); if Fluture causes issues, write thin Promise wrappers around repositories |
| Material-UI SSR issues in islands | Broken styles | Use `client:only="react"` to skip SSR for MUI components; or rewrite with scoped CSS |
| DHIS2 API unavailable during build | Build fails | Cache build data locally; add env flag to use fixtures for dev builds |
| Styled-components flash of unstyled content in islands | Visual glitch | Use `client:load` (not `client:visible`) for above-fold styled islands; long-term migrate to scoped CSS |
| No schema validation on DHIS2 data (frontmatter approach) | Silent data shape bugs | Acceptable for POC; Content Collections with Zod schemas is the planned follow-up |

---

## Success Criteria

- [ ] `astro build` completes with zero errors.
- [ ] `/about` and `/methods` pages render with real DHIS2 data baked into static HTML.
- [ ] Visual parity with the current React SPA pages (verified by side-by-side comparison).
- [ ] Experts country filter works client-side on the About page.
- [ ] Methods page ships zero (or near-zero) client-side JavaScript.
- [ ] All tests pass (`vitest run`).
- [ ] ESLint passes with no errors.
- [ ] Shared code imports from `src/domain/`, `src/data/`, `src/utils/`, `src/types/` work without duplication.
- [ ] Adding a new page (e.g. Resources) would not require changes to the infrastructure built here.
