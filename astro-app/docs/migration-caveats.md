# Migration Caveats & Technical Debt

This document tracks caveats, difficulties, and technical debt encountered during the migration from the React SPA to Astro. Each section corresponds to a migration step.

**Keep this file up to date:** whenever you encounter a new issue, caveat, workaround, or technical debt during any migration phase, add it here under the appropriate section.

---

## Phase 0: Project Setup

### `verbatimModuleSyntax: false` in tsconfig

Astro's strict config enables `verbatimModuleSyntax`, but the parent shared code has 500+ type imports without the `type` keyword. Fixing the parent is a separate follow-up.

### `skipLibCheck: true`

Parent hand-written `.d.ts` files (`d2-analytics.d.ts`, `d2.d.ts`, `i18n.d.ts`) have type errors under TS 5.x strict mode.

### `PersonD2Repository.ts` excluded from tsconfig `include`

It imports a `.png` from `webapp/assets/` which Astro types as `ImageMetadata` instead of `string`. The file is still importable at build time; it's only excluded from proactive type-checking.

### Parent test files excluded from tsconfig

`__tests__/`, `*.spec.*`, `*.test.*`, `tests-ui.tsx`, and `data/export/` are excluded to avoid irrelevant type errors from parent test code.

---

## Phase 1: Build-Time Data Layer

### Node version pinned to 22 LTS

**File:** `astro-app/.nvmrc`

The astro-app requires Node 22 LTS (v22.x). Node 24 introduces stricter ESM enforcement (mandatory `with { type: "json" }` for JSON imports) that breaks several shared-code transitive dependencies. Node 22 avoids the worst of these but some issues remain (see below).

**Resolution:** Revisit when `@dhis2/analytics`, `@eyeseetea/d2-ui-components`, and `@eyeseetea/d2-api` publish ESM-compliant versions.

---

### Vite compat plugin for broken ESM dependencies

**File:** `astro.config.mjs` — `compat-shared-deps` plugin

Astro's prerender build externalizes `node_modules`, meaning Node's ESM loader processes them directly at runtime. Several shared-code transitive dependencies have broken ESM that fails under Node's strict resolution:

| Package | Issue | Workaround |
|---|---|---|
| `@eyeseetea/d2-api` (bare import) | CJS package — Node ESM cannot extract named exports | Vite plugin redirects bare import to ESM sub-path `@eyeseetea/d2-api/2.36` |
| `@dhis2/analytics` | Imports JSON files without `with { type: "json" }` attribute | Vite plugin stubs the module (not used by build-time fetching) |
| `@eyeseetea/d2-ui-components/locales` | Imports `moment/locale/es` without `.js` extension | Vite plugin stubs the module (not used by build-time fetching) |

Additionally, `ssr.noExternal` is set for `@dhis2/analytics` and `@eyeseetea/d2-ui-components` so Vite processes them through its own pipeline during dev mode (`yarn start`), where the compat plugin can intercept them.

**Risk:** The stubs are safe because the stubbed packages are not used by the current build-time data fetching use cases (`method.get`, `about.getPersons`, `about.getOfficeInfo`). If future pages use indicator explorer or analytics features, the stubs will need to be replaced with proper fixes.

**Resolution:** Ideally, upstream packages should publish ESM-compliant builds. Alternatively, if the shared code is refactored to lazy-load repositories, `getCompositionRoot()` would no longer pull in all transitive dependencies eagerly.

---

### Patched `apiToFuture` for Fluture + XHR backend compatibility

**File:** `src/lib/futures.ts`
**Vite plugin:** `compat-shared-deps` — redirects `utils/futures` imports to the local patched version

The shared code's `apiToFuture` returns `res.cancel` as the Fluture cancellation function. When using the `xhr` backend (required for Node — see below), `res.cancel` is an axios `CancelToken.cancel(message)` function with `length === 1`. Fluture strictly requires a nullary (0-arg) cancellation function and throws at runtime.

The local `src/lib/futures.ts` wraps it as `() => res.cancel()`.

**Resolution:** Fix in the shared code: change `return res.cancel` to `return () => res.cancel()` in `src/utils/futures.ts`.

---

### D2Api requires `backend: "xhr"` in Node

**File:** `src/lib/composition-root.server.ts`

The `D2Api` class must be instantiated with `backend: "xhr"` when running in Node. The `fetch` backend uses the `abort-controller` npm polyfill which creates a non-native `AbortSignal` instance. Node's native `fetch` rejects it with `Expected signal to be an instance of AbortSignal`.

**Resolution:** `@eyeseetea/d2-api` should use the global `AbortController` when available instead of the polyfill, or provide a Node-compatible fetch backend.

---

### `getCompositionRoot()` eagerly loads all repositories

The shared `getCompositionRoot()` instantiates every repository in the application, pulling in all transitive dependencies (`@dhis2/analytics`, `xlsx`, `file-saver`, `polylabel`, etc.) even when only a subset is needed. This is the root cause of most ESM compat issues above.

**Resolution:** Consider one of:
- Lazy-load repositories in the shared `CompositionRoot` (breaks eagerness but fixes transitive dep issues)
- Create a minimal `getServerCompositionRoot()` in the shared code that only instantiates server-relevant repositories
- Accept the current Vite plugin approach as pragmatic for the migration period

---

## Phase 4: About Page — React Islands with Material-UI

### Material-UI providers crash Astro SSR at module-load time

**Files:** `src/islands/about/ExpertsNetwork.tsx`, `src/islands/about/ExpertsNetworkSelector.tsx`

The shared `TreeSelector` component depends on two layered Material-UI providers — `@material-ui/core` (`MuiThemeProvider`) and the legacy `material-ui` v0 (`OldMuiThemeProvider`). Importing these at module top-level inside a React island used by an SSR'd Astro page crashes the prerender step:

```
Error [ERR_UNSUPPORTED_DIR_IMPORT]: Directory import
'/node_modules/@material-ui/core/styles' is not supported resolving ES modules
Did you mean to import "@material-ui/core/styles/index.js"?
```

The crash is **import-time, not render-time**: Node's ESM loader fails while resolving the directory import, before any JSX is evaluated. Gating the providers behind a `useState` + `useEffect` flag is **not enough** — the imports themselves are evaluated when the island chunk is loaded by the prerender process.

**Workaround:** put the providers + `TreeSelector` subtree in their own module (`ExpertsNetworkSelector.tsx`) and load it via dynamic `import("./ExpertsNetworkSelector")` inside `useEffect`. The dynamic import is only evaluated client-side, so the MUI imports never enter the SSR module graph. Render an `aria-hidden` placeholder until the dynamic import resolves, sized to match the hydrated selector to minimize CLS.

This pattern lets the rest of the island (title, subtitle, experts grid) render with `client:load` and produce real static HTML at build time, instead of falling back to `client:only="react"`.

**Resolution:** None upstream — the legacy `material-ui` v0 package is unmaintained and uses CJS-style directory imports that conflict with strict ESM resolution. Long-term: replace `TreeSelector` with a lightweight alternative that doesn't depend on MUI v0. Any future island that wraps a shared MUI-based component should follow the same dynamic-import-in-`useEffect` pattern.
