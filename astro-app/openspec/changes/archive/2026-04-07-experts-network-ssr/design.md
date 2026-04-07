## Context

`ExpertsNetwork` is the only interactive island on `/about`. Phase 4 deliberately mounted it with `client:only="react"` because `TreeSelector` pulls in two layered Material-UI providers — `@material-ui/core` (`MuiThemeProvider`) and the legacy `material-ui` v0 (`OldMuiThemeProvider`) — plus `styled-components`. The legacy v0 provider in particular touches browser globals (`window`, `navigator`) during render and crashes Astro's Vite SSR pipeline at build time. The simplest way out at the time was to skip SSR completely.

The cost of `client:only` is that Astro emits an empty `<astro-island>` shell for the entire experts section. The title, subtitle and 30-50 expert cards are absent from the static HTML, hurting first paint, SEO, and visual stability. None of these things actually need MUI to render — only the country `TreeSelector` does.

The data flow is unchanged: `about.astro` calls `getAboutPageData()` and `downloadAboutPersonImages()` at build time and passes the resulting `experts`, `countryTreeOptions`, `parentSortOrder`, `title`, and `subtitle` props to the island. We just want the island itself to be able to render those props on the server.

## Goals / Non-Goals

**Goals:**

- `/about` static HTML contains the experts title, subtitle and the full grid of `PersonCardReact` markup before any JS runs.
- Country `TreeSelector` keeps its current behavior client-side, with no MUI / styled-components code paths executed during the Astro build.
- No layout shift when the TreeSelector hydrates: the placeholder occupies the same space.
- Filtering behavior, props, and styles are unchanged.

**Non-Goals:**

- Rewriting `TreeSelector` or removing the legacy MUI v0 dependency.
- SSRing the `TreeSelector` itself (it would still need `window`).
- Introducing a new SSR theme provider (`ServerStyleSheet`, MUI emotion cache, etc.) for styled-components.
- Changing the build-time data pipeline or composition root.
- Adding analytics, telemetry, or new dependencies.

## Decisions

### 1. Switch directive from `client:only="react"` to `client:load`

**Choice:** In `src/pages/about.astro`, replace `client:only="react"` with `client:load`.

**Alternatives considered:**
- `client:visible` — would defer hydration until the section enters the viewport. Good for perf but the experts section is the page's main interactive content and the user reaches it quickly; we prefer eager hydration to avoid a noticeable swap.
- Keep `client:only` and SSR a separate Astro fragment with the title/subtitle/grid duplicated above the island — duplicates rendering logic and props, fragile to drift.

**Rationale:** `client:load` gives us SSR HTML at build time and immediate hydration on page load, which is exactly the trade-off we want for above-the-fold-ish interactive content.

### 2. Gate MUI providers + TreeSelector behind a `mounted` flag

**Choice:** Inside `ExpertsNetwork.tsx`, introduce `const [mounted, setMounted] = useState(false)` and a `useEffect(() => setMounted(true), [])`. Render the providers + `TreeSelector` only when `mounted === true`. The title, subtitle, and the experts grid render unconditionally.

```tsx
return (
  <section>
    <div className="experts-title-container">…</div>
    <div className="experts-selector-row">
      {mounted ? (
        <MuiThemeProvider theme={muiTheme}>
          <OldMuiThemeProvider muiTheme={muiThemeLegacy}>
            <TreeSelector … />
          </OldMuiThemeProvider>
        </MuiThemeProvider>
      ) : (
        <TreeSelectorPlaceholder />
      )}
    </div>
    <div className="experts-grid" role="list" aria-label="Experts network">
      {filteredExperts.map(…)}
    </div>
  </section>
);
```

**Alternatives considered:**
- Dynamic `import()` of TreeSelector in `useEffect` — adds an async chunk and a code-split boundary for no real gain; the providers still need to be excluded from SSR.
- `typeof window !== 'undefined'` check directly in render — works but causes a hydration mismatch warning because the first client render still has `mounted === false`. Using a `useEffect` flag is the canonical React-safe pattern.
- A separate `<TreeSelectorIsland client:only>` nested inside an SSR `<ExpertsNetwork client:load>` — Astro doesn't support nested `client:*` directives inside React islands.

**Rationale:** The `mounted` flag is the standard React idiom for "render this only after hydration". It guarantees SSR markup matches the first client render (both render the placeholder), then a second client render swaps in the real providers. No hydration warnings, no MUI code on the server, no extra bundles.

### 3. Pre-mount placeholder preserves layout

**Choice:** Render a static `<div className="experts-selector-placeholder" aria-hidden="true" />` while `mounted === false`. Style it in `experts-network.css` with the same height and max-width as the hydrated TreeSelector input so the page doesn't jump when the real component appears. No spinner, no skeleton animation — just blank space matching the final footprint.

**Rationale:** Avoids CLS without shipping additional UI. Keeps the SSR HTML minimal and accessible (`aria-hidden` so screen readers skip it; the real selector will be announced after hydration).

### 4. Filtering still runs unfiltered on the server

**Choice:** `selectedCountries` starts as `[]`, so `filteredExperts === experts` on first render (server and client both). The SSR HTML therefore lists every expert, which is also the correct initial state once hydrated. No special-casing needed.

**Rationale:** Free correctness — the existing `useMemo` guard already returns the input array when no countries are selected.

### 5. Test coverage

**Choice:** Add a unit test in `src/islands/about/__tests__/ExpertsNetwork.test.tsx` that renders `ExpertsNetwork` and asserts:
- The title, subtitle, and all expert cards appear in the initial render output (using `renderToStaticMarkup` from `react-dom/server`, which simulates SSR — no `useEffect` runs).
- The placeholder div is present and the MUI provider markup / TreeSelector input is absent in that static output.
- After `render()` (full client render with effects), the TreeSelector input becomes available.

**Rationale:** Locks in the SSR contract so a future refactor can't accidentally re-import MUI at module top-level in a way that breaks the build.

## Data Flow

```
Build time (about.astro frontmatter):
  getAboutPageData() + downloadAboutPersonImages()
        │
        ▼
  <ExpertsNetwork client:load
      experts={…} countryOptions={…}
      parentSortOrder={…} title=… subtitle=… />
        │
        ▼
SSR render (Node, Astro build):
  ExpertsNetwork()
    mounted = false
    → renders <section>
        title + subtitle
        <TreeSelectorPlaceholder/>     ← no MUI imports executed
        experts grid (all experts)
      </section>
        │
        ▼
HTML emitted to /about/index.html (full markup, no astro-island shell hole)
        │
        ▼
Browser load → hydrate → first client render:
  mounted = false (matches SSR, no mismatch)
        │
        ▼
useEffect runs → setMounted(true) → second render:
  mounted = true
    → MuiThemeProvider > OldMuiThemeProvider > TreeSelector
    → user can filter; filteredExperts updates the grid
```

## Risks / Trade-offs

- **MUI / styled-components imports at module top-level still execute on the server.** Even when gated behind `mounted`, the `import` statements at the top of `ExpertsNetwork.tsx` are evaluated by Vite's SSR. → Mitigation: verify with a build that the legacy `material-ui` v0 package's side-effects don't crash on import alone (only on render). If they do, fall back to a `React.lazy` + `Suspense` boundary that defers the import to the client. The previous `client:only` experience suggests render-time crashes, not import-time, but this needs to be validated.
- **Brief visual flicker between placeholder and live TreeSelector.** → Mitigation: identical bounding box via CSS; the placeholder is empty, so there's no content swap, just an input fading in.
- **Hydration mismatch if any prop is non-deterministic between SSR and client.** All props are pre-computed at build time and serialized as JSON, so they're stable. No dates, no `Math.random`, no `Date.now`. Low risk.
- **Test for SSR uses `renderToStaticMarkup`, not Astro's actual SSR pipeline.** It's an approximation. → Mitigation: the project's existing visual-compare workflow + a manual `yarn build && yarn preview` check on `/about/index.html` source confirms the real output.

## Migration Plan

1. Update `ExpertsNetwork.tsx` with the `mounted` gate and placeholder.
2. Update `about.astro` directive.
3. Add CSS for `.experts-selector-placeholder`.
4. Update tests.
5. Run `yarn astro check`, `yarn build`, then inspect `dist/about/index.html` to verify markup.
6. Run `yarn test` for unit coverage.
7. Visual-compare against the SPA at desktop/tablet/mobile.

Rollback: revert the directive to `client:only="react"` and remove the `mounted` gate. No data, no schema, no shared-code changes — single-commit revert.

## Open Questions

- Does importing `material-ui/styles/MuiThemeProvider` at module scope crash Vite SSR by itself? If yes, we need `React.lazy(() => import(...))` for the provider subtree, not just a `mounted` flag.
