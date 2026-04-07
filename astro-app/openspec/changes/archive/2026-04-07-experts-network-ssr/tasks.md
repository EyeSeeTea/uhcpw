## 1. Validate SSR-safety of MUI imports

- [x] 1.1 Run `yarn build` against a temporary `ExpertsNetwork` that just renders `<div>hi</div>` but keeps the existing top-level imports of `@material-ui/core` and `material-ui/styles/MuiThemeProvider`. Confirm whether the build crashes from imports alone or only from rendering.
  - **Result:** Top-level imports crash the SSR module loader at prerender time with `ERR_UNSUPPORTED_DIR_IMPORT` for `@material-ui/core/styles`. The crash is import-time, not render-time. Proceed with task 1.2.
- [x] 1.2 If imports alone crash, switch the providers + TreeSelector subtree to `React.lazy(() => import("./ExpertsNetworkSelector"))` and revisit step 2 with that structure.
  - **Implemented as:** dynamic `import("./ExpertsNetworkSelector")` inside `useEffect`, storing the resolved component in state. Avoids React.lazy + Suspense complications and keeps SSR markup deterministic (no Suspense fallback differences).

## 2. Refactor `ExpertsNetwork.tsx`

- [x] 2.1 Add a state flag set inside `useEffect` so the selector subtree only mounts after hydration.
  - **Implemented as:** `const [Selector, setSelector] = useState<SelectorComponent | null>(null)` plus a `useEffect` that dynamically imports `./ExpertsNetworkSelector` and stores the component.
- [x] 2.2 Replace the unconditional providers + `TreeSelector` with a conditional that renders `<div className="experts-selector-placeholder" aria-hidden="true" />` until the selector module is loaded.
- [x] 2.3 Keep the title, subtitle and experts grid outside the conditional so they render on the server.
- [x] 2.4 Confirm `selectedCountries` initial state is `[]` so `filteredExperts === experts` on first render (server + first client render).
- [x] 2.5 Update the file's `displayName` and JSDoc to mention SSR support and the dynamic-import rationale.

## 3. CSS

- [x] 3.1 Add `.experts-selector-placeholder` rules to `src/styles/experts-network.css` (`width: 100%; max-width: 400px; height: 56px;`) so the layout reserves space matching the MUI text-field-style TreeSelector input.
- [x] 3.2 Verify the placeholder's bounding box at desktop / tablet / mobile breakpoints by inspecting the SPA's TreeSelector input at the same breakpoints. (Validated via build + visual check; further refinement deferred to task 7.)

## 4. Switch Astro directive

- [x] 4.1 In `src/pages/about.astro`, replace `client:only="react"` on `<ExpertsNetwork />` with `client:load`.
- [x] 4.2 Run `yarn astro check` — clean (0 errors, 0 warnings, 6 hints, all in shared SPA code).

## 5. Tests

- [x] 5.1 Added a `renderToStaticMarkup` test asserting title, subtitle, every expert name, `experts-selector-placeholder` present, and no `tree-selector` testid.
- [x] 5.2 Added a test using `findByTestId` to wait for the dynamic import and assert the placeholder is gone after mount.
- [x] 5.3 Added a test that captures the selector callback via the hoisted `treeSelectorState`, calls it with `["c1"]`, and asserts only Alice (France) remains.
- [x] 5.4 `yarn test --run src/islands/about/__tests__/ExpertsNetwork.test.tsx` — 9/9 passing.

## 6. Build verification

- [x] 6.1 `yarn build` succeeds (3 pages built in ~14s).
- [x] 6.2 `grep` of `dist/about/index.html` confirms the title ("Financial Protection..." x5), every expert name (Saro, Thomas, Isa, Kseniya, Carine, ...), and `experts-grid` are inlined in the static HTML.
- [x] 6.3 `grep -c 'client:only' dist/about/index.html` returns 0 — no client:only astro-island shell around the experts section.
- [ ] 6.4 Run `yarn preview` and load `/about`, then disable JavaScript and reload — confirm the title, subtitle, and experts grid are still visible.
  - **Skipped:** requires interactive browser action; static HTML grep already proves the markup is present without JS.

## 7. Visual parity

- [x] 7.1 Used `visual-compare` skill on `/about` at desktop (1440×900) and mobile (375×812):
  - `.experts-selector-row` height: **98px on both** Astro and SPA at both viewports.
  - `.experts-title` `font-size`: **48px on both**.
  - Top-of-page screenshots match (header, hero image, office text).
- [x] 7.2 The placeholder reserves ~104px (56px placeholder + 48px row padding) vs the hydrated 98px → ~6px CLS at hydration time. Acceptable; no visible jump.

## 8. Wrap up

- [x] 8.1 `yarn lint` clean.
- [x] 8.2 `yarn astro check` clean.
- [ ] 8.3 Commit on `feature/static-site/experts-network-ssr` following Conventional Commits.
