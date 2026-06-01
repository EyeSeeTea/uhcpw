## Context

Phase 2 delivered the Astro layout shell (header, footer, design tokens). The `methods.astro` page exists as a skeleton. The shared data layer is validated — `compositionRoot.method.get.execute()` works at build time via `runFuture()`. The React SPA's Methods page uses Material-UI, styled-components, and ReactMarkdown — all of which we want to avoid shipping to the client in the static version.

## Goals / Non-Goals

**Goals:**

- Render `/methods` as fully static HTML with real DHIS2 data baked in at build time.
- Achieve visual parity with the React SPA Methods page.
- Ship zero (or near-zero) client-side JavaScript.
- Reuse shared domain code (`Method` entity, `GetMethodsUseCase`, `MethodD2Repository`).
- Establish reusable patterns (markdown rendering, two-column grid) for future pages.

**Non-Goals:**

- Analytics tracking (Google Analytics integration is a separate concern).
- Content Collections / Zod schema validation (planned follow-up per POC plan).
- Rewriting shared domain/data layer code.
- i18n — hardcode English strings for the POC, matching the SPA's current behavior.

## Decisions

### 1. Pure Astro components — no React islands on this page

**Choice:** Rewrite all Methods page UI as Astro components with scoped CSS.

**Alternatives considered:**
- Wrap existing React `MethodsPage` as an island → ships MUI, styled-components, ReactMarkdown to client. Defeats the zero-JS goal.
- Hybrid (some Astro, some React islands) → unnecessary complexity for a page with no real interactivity.

**Rationale:** The Methods page has no client-side state beyond expand/collapse, which HTML `<details>`/`<summary>` handles natively. Pure Astro keeps JS at zero.

### 2. `<details>`/`<summary>` for expand/collapse

**Choice:** Use native HTML disclosure elements instead of React state + buttons.

**Alternatives considered:**
- Small React island per section → adds JS bundle, hydration cost for trivial toggle.
- Vanilla `<script>` with custom show/hide → reinvents what `<details>` does natively.

**Rationale:** `<details>`/`<summary>` is semantic, accessible (keyboard/screen reader support built-in), and requires zero JavaScript. Style with CSS to match the SPA's "Read more" / "Read less" appearance.

### 3. `marked` for server-side markdown rendering

**Choice:** Use `marked` library to convert markdown strings to HTML at build time in `.astro` frontmatter.

**Alternatives considered:**
- `react-markdown` in a React island → ships JS, requires hydration.
- Astro's built-in markdown processing → designed for `.md` files, not runtime strings from an API.
- `markdown-it` → similar to `marked`, but `marked` is lighter and sufficient.

**Rationale:** `marked` runs at build time only, produces plain HTML strings usable with Astro's `set:html` directive. Output is baked into static HTML — zero client cost. We'll sanitize output with `DOMPurify` (or rely on `marked`'s default escaping) since the content comes from DHIS2 admins.

### 4. CSS Grid for two-column layout

**Choice:** Use CSS Grid with `grid-auto-flow: column` directly in Astro scoped styles, mirroring the SPA's `ColumnGridContainer` behavior.

**Alternatives considered:**
- Import `ColumnGridContainer` React component → ships MUI Grid + styled-components.
- Flexbox → doesn't natively support the "fill columns top-to-bottom" flow the SPA uses.

**Rationale:** The SPA's `ColumnGridContainer` is essentially a CSS Grid wrapper. Reproduce the same grid properties in scoped CSS — no dependency needed. Responsive collapse to single column at 600px breakpoint matches existing behavior.

### 5. Reference links (Abbreviations/Glossary) from general content

**Choice:** Fetch `compositionRoot.general.getContent.execute()` at build time for the abbreviations and glossary URLs. Fall back to hardcoded `https://cmyn.short.gy/` URLs if DHIS2 values are empty.

**Rationale:** Matches the SPA's `useReferenceLinks` behavior without the analytics tracking (non-goal for POC). Simple conditional in frontmatter.

### 6. Bubble pattern as static asset

**Choice:** Copy `bubble-pattern-white.png` to `astro-app/public/` (or `src/assets/`) and reference it in the title banner's CSS/HTML.

**Rationale:** Astro optimizes images in `src/assets/` at build time. The bubble pattern is a decorative overlay — import it as an Astro image for automatic optimization.

## Risks / Trade-offs

- **`<details>` styling limitations** → The SPA uses MUI icons (ExpandMore/ExpandLess) and custom button styling. CSS-only `<details>` styling varies by browser. **Mitigation:** Use CSS `::marker` / `summary::after` pseudo-elements with chevron characters or inline SVG. Test cross-browser.

- **Markdown output differences** → `marked` may produce slightly different HTML than `react-markdown` (e.g., different class names, wrapping elements). **Mitigation:** Apply typography styles to rendered markdown container via CSS selectors (`p`, `ul`, `li`, `a`) rather than relying on component-level overrides.

- **Grid column flow edge case** → The SPA uses `grid-auto-flow: column` which fills items top-to-bottom, then wraps to next column. With an odd number of methods (5), the last item appears alone in column 2 below the buttons. **Mitigation:** Match the SPA's `grid-template-rows: repeat(N, auto)` calculation in Astro frontmatter.

- **General content fetch adds a second API call** → Adds ~1 extra DHIS2 request at build time. **Mitigation:** Negligible — build time only, and the data is small. Could be parallelized with methods fetch via `Promise.all`.
