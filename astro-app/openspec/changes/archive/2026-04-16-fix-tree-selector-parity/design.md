## Context

The experts section on `/about` hydrates a React island (`ExpertsNetwork.tsx`) that, after mount, dynamically imports `ExpertsNetworkSelector.tsx` and renders the shared SPA component `@shared/webapp/components/tree-selector/TreeSelector`. That shared component uses two styling systems:

1. **`styled-components` v5.3.5** — for most structural styles (`Container`, `StyledMenu`, `StyledDropdownTextField`, `StyledButton`, `StyledButtonClear`, `SelectedChip`).
2. **`makeStyles` from `@material-ui/styles` v4.11.5 (JSS)** — for `SearchInput` (root padding, icon margin, input sizing).

Both are single instances resolved from the monorepo root `node_modules/` (confirmed — no duplicate installs under `astro-app/node_modules/`). The island is `client:visible` and the selector import is additionally deferred with a dynamic `import()` inside `useEffect`, so neither library runs during Astro's SSR pass.

Despite that, the rendered output on `/about` in Astro shows:

- `SearchInput` ≈ 22px tall vs 42px in SPA (input height 20px × 1, with border but **no** 10px padding applied). This points to the `makeStyles` `root` class rule (`padding: 10px`) not being applied — the inline `style={{ height: "20px", ... }}` is visible (background, border), but the JSS-generated class is absent.
- "Select all" / "Clear all" / "Clear" buttons render as uppercase + gray (MUI `Button` defaults). The SPA's `StyledButton` rule (`color: orange; text-transform: none; padding: 0; font-weight: 400;`) is not applied.
- Selected chips render without the `#cfe9f7` background. The SPA's `SelectedChip = styled(Chip)` override is not applied.
- The floating "Clear" button (visible when `selectedIds.length > 0`) is positioned in-flow instead of at `top: -35px; right: -15px;`. The `StyledButtonClear` absolute-positioning rule is not applied.
- The `(N selected)` placeholder has less left spacing than the SPA.

The common symptom across all five points: **rules defined via `styled-components` and `makeStyles` inside the shared TreeSelector subtree are missing at runtime**, while inline `style={...}` props and vanilla CSS classes still work.

The most plausible causes, in order of likelihood:

1. **Vite's Rolldown/SSR pipeline is tree-shaking or double-bundling `styled-components`/`@material-ui/styles`**, creating a second runtime instance inside the island chunk that doesn't share the global stylesheet (even though the package on disk is single-copy). The symptom is consistent with styled-components' `StyleSheet` singleton being re-instantiated — rules are generated into one sheet, lookups happen against another.
2. **`StyleSheetManager` / `StylisProvider` missing** in the island. Normally not required in SPA root, but Astro's client boundary can split module-level singletons.
3. Astro strips or reorders `<style>` tags emitted by JSS/styled-components during hydration on the experts island.

We don't need to be 100% sure of the cause to produce a pixel-perfect result. We do need a decision about whether to fix the underlying library application or override at the CSS layer.

## Goals / Non-Goals

**Goals:**
- Make the TreeSelector in the experts island render pixel-identically to the SPA at desktop, tablet, and mobile viewports for the five symptoms listed in the proposal.
- Keep the shared `TreeSelector` component unchanged — it remains the single source of truth reused by both the SPA and Astro.
- Prefer a root-cause fix (libraries apply their rules correctly) if it is local and low-risk; fall back to scoped CSS overrides otherwise.

**Non-Goals:**
- Refactoring the TreeSelector or its dependencies.
- Migrating away from `styled-components` / `@material-ui/styles` in the SPA.
- Fixing library application for other islands beyond the experts selector.
- Adding a broad global stylesheet that shadow-restyles MUI across the app.

## Decisions

### Decision 1 — Investigate library application first, fall back to CSS overrides

Before patching with CSS, spend up to ~30 minutes investigating why `styled-components` and `makeStyles` rules are missing from the rendered DOM. Concretely:

1. Open the `/about` page in the browser dev server (`yarn start` on port 4321). In DevTools, inspect the rendered DOM under the experts selector.
2. Confirm which styles are missing: search `<head>` for `<style data-styled>` (styled-components) and `<style data-jss>` (JSS/makeStyles). If absent → the runtime instance never attached to the document; if present but with wrong rules → a duplicate instance is emitting.
3. Check `window.__STYLED_COMPONENTS_VERSIONS__` / `sc.g_` — if more than one version is reported, it's a duplicate-instance issue.
4. Verify Vite `optimizeDeps` / `ssr.noExternal` is not double-bundling. If duplicate instances are confirmed, add Vite `resolve.dedupe: ["styled-components", "@material-ui/styles"]` (and `react`, `react-dom` for completeness) in `astro.config.mjs`.

If the root cause is a deduplication or provider-wrap issue, fix it there. This is the preferred path because it fixes a whole class of problems (any future shared component using these libraries will Just Work).

If investigation goes beyond ~30 minutes without a clear local fix, switch to Decision 2.

**Rationale:** The visual contract is what matters for this change, but a root-cause fix pays dividends for any later shared component we pull into Astro islands. The 30-minute timebox prevents a rabbit hole.

**Alternatives considered:**
- Skip investigation, go straight to CSS overrides — faster but leaves the underlying bug for the next island to re-discover.
- Fork the TreeSelector into the Astro app — rejected: violates the "keep SPA as single source of truth" principle.

### Decision 2 — Scoped CSS overrides in `experts-network.css` (fallback / supplement)

If the root-cause fix isn't landable in the timebox (or only partially fixes the symptoms), add scoped CSS in `astro-app/src/styles/experts-network.css` targeting the TreeSelector markup inside `.experts-selector-row`. Specifically:

- `.experts-selector-row [role="search"]` → padding, border-radius, height tuning to reproduce the 42px search field.
- `.experts-selector-row .MuiChip-root` → `background: #cfe9f7; border-radius: 20px; min-height: 32px; padding-block: 3px; margin: 1px;`.
- `.experts-selector-row button` (or `.MuiButton-text` scoped) → `color: orange; text-transform: none; font-weight: 400; padding: 0;`.
- `.experts-selector-row .TreeSelector-clear-button` → absolute positioning with `top: -35px; right: -15px;` (the className is already applied in the shared component via `className="TreeSelector-clear-button"`).
- `(N selected)` placeholder spacing — adjust `.MuiInputBase-input` or `.MuiFormControl-root` padding within the scope.

All overrides MUST be scoped under `.experts-selector-row` (or a new wrapping class on the island) to avoid bleeding into other potential consumers of MUI/TreeSelector elsewhere in the Astro app.

**Rationale:** Scoped overrides are safe, reversible, and don't fork shared code. They're uglier than the library-level fix but guaranteed to produce pixel parity.

**Alternatives considered:**
- Global `!important` overrides — rejected: high collision risk, hard to maintain.
- Inline `style={...}` patches in `ExpertsNetworkSelector.tsx` — can't reach nested `Menu` popover DOM (rendered in a portal).

### Decision 3 — Verify pixel parity with the `visual-compare` skill

Use the `visual-compare` skill (computed-style assertions + screenshots at desktop/tablet/mobile) to prove parity between Astro and SPA for the five specific elements: search input, "Select all" button, "Clear all" button, selected chip, and floating "Clear" button (states: empty, one selected, all selected). Document the evidence in the PR description.

**Rationale:** The user memory already records that visual parity must be verified with computed styles, not screenshots alone.

## Risks / Trade-offs

- **Risk: Menu popover styles also broken (not listed in symptoms)** → Mitigation: During browser investigation (Decision 1), open the dropdown and inspect the popover DOM; if issues exist there too, add them to scope before implementation.
- **Risk: Dedupe fix breaks another island that relied on the current (broken) state** → Mitigation: grep for other islands importing shared components and smoke-test them (`/methods`, `/` home) after the change.
- **Risk: Scoped CSS selectors (Decision 2) rely on MUI-generated class names that could change** → Mitigation: MUI v4 class names are stable (`MuiChip-root`, `MuiButton-text`, etc.); pin a comment in the CSS noting the MUI major version.
- **Risk: The floating "Clear" button is rendered as a sibling of the input (in the Container), not inside the portal-mounted Menu** → Verified by reading `TreeSelector.tsx:192-203`: it is a direct sibling of `StyledDropdownTextField`, so scoped CSS under `.experts-selector-row` reaches it.

## Migration Plan

- No data migration. All changes are CSS / config-level.
- **Rollback**: revert the `experts-network.css` additions and any `astro.config.mjs` / `ExpertsNetworkSelector.tsx` edits.

## Open Questions

- Does the fix also resolve similar (currently-unreported) issues in the TreeSelector's dropdown popover (the `StyledMenu` portal content)? To be checked during Decision 1 investigation.
- Are other shared-component islands (if any exist) affected by the same underlying issue? Grep during investigation.

## UI design gate

No new UI affordances — this change only corrects visual styling on an existing UI whose design source of truth is the React SPA rendering. No Pencil wireframes required because the SPA itself serves as the reference design (captured via the `visual-compare` skill).
