## Context

Phase 3 delivered the Methods page as pure static HTML. The About page is structurally different: it has a static office header, a static team grid, and an **interactive** experts section with country filtering via TreeSelector. The existing TreeSelector is a complex React component tree (~6 files) that depends on Material-UI, styled-components, and several custom components (DropdownTextField, SelectedChip, FullScreenDialog). Rewriting it is out of POC scope — reusing it as-is validates the React island pattern for future pages that also use TreeSelector (Indicator Explorer, Policy Explorer, Resources).

The About page also introduces person images from DHIS2 — remote URLs that may be missing or return 404. Astro's image pipeline can optimize remote images at build time, but failed fetches would break the build without proper fallback handling.

**Current state:** `about.astro` is a stub (`<h1>UHC Watch - About</h1>`). The shared data layer (`compositionRoot.about.getPersons`, `compositionRoot.about.getOfficeInfo`) is validated — `test-data.astro` already fetches all three data sets at build time.

## Goals / Non-Goals

**Goals:**

- Render `/about` as a static Astro page with real DHIS2 data baked in at build time.
- Achieve visual parity with the React SPA About page.
- Reuse the existing TreeSelector component as a React island for country filtering.
- Optimize person/office images at build time with fallback for missing/broken images.
- Ship zero JS for static sections (header, team). Ship JS only for the experts island.
- Pre-compute all data (persons, countries, tree options) at build time — zero runtime API calls.

**Non-Goals:**

- Rewriting TreeSelector as an Astro component (complex MUI dependency tree, used on multiple future pages).
- Analytics tracking (Google Analytics is a separate concern).
- Content Collections / Zod schema validation (planned follow-up).
- Rewriting shared domain/data layer code.
- i18n — hardcode English strings for the POC.
- Upgrading MUI or styled-components versions.

## Decisions

### 1. Three-zone architecture: static header + static team + interactive experts island

**Choice:** Split the About page into three rendering zones:
- **Office header** — pure Astro component (static HTML + optimized image).
- **Team section** — pure Astro component (static grid of person cards).
- **Experts section** — React island (`client:visible`) containing TreeSelector + filtered person cards.

**Alternatives considered:**
- Wrap the entire About page as one React island → ships all of MUI + styled-components + data for every section. Defeats the SSG goal.
- Make team and experts both React islands → unnecessary JS for team section which has no interactivity.
- Make person cards Astro everywhere, experts filtering via vanilla JS → TreeSelector is too complex to rewrite; would also need to rewrite the `useMultiCountryOptionsV2` logic.

**Rationale:** Only the experts section needs client-side interactivity (filter by country). The header and team sections are purely static. This minimizes shipped JS while proving the React island pattern works with complex shared components.

### 2. Pre-compute TreeSelector options at build time

**Choice:** Compute the `TreeOption[]` array in the Astro frontmatter at build time, using countries from `compositionRoot.country.get.execute()` and the same transformation logic as `useMultiCountryOptionsV2`. Pass the pre-computed options as a serialized prop to the experts island.

**Alternatives considered:**
- Use `useMultiCountryOptionsV2` hook inside the island → requires `useAppContext()` which provides countries/regions from a React context that doesn't exist in the Astro app. Would need to set up AppContext with all its dependencies (compositionRoot, general content, etc.).
- Provide a minimal AppContext in the island → pulls in the entire context provider chain plus compositionRoot (which includes the D2Api client — a server-side dependency).

**Rationale:** The country options are static data that can be computed once at build time. Pre-computing avoids the need for AppContext in the island, keeping the island's dependency tree minimal: just TreeSelector + its immediate component tree + the filtering logic. The island receives `experts: PersonState[]`, `countryOptions: TreeOption[]`, and `countryGroupings: string[]` as props and manages only the selection state client-side.

### 3. Experts island: self-contained React component with extracted filtering logic

**Choice:** Create `astro-app/src/islands/ExpertsNetwork.tsx` — a new React component that:
- Receives pre-computed `experts`, `countryOptions`, `parentSort` groupings, and display strings as props.
- Manages `selectedCountries` state internally.
- Filters experts client-side using the same logic as `useAbout.ts`.
- Renders TreeSelector (imported from shared code) and person cards.
- Does NOT depend on `useAppContext`, `useAbout`, or any React context from the SPA.

**Alternatives considered:**
- Reuse `ExpertsNetwork.tsx` from the SPA directly → depends on `useAppContext` for `generalContent` strings and `useBreakpoint` for responsive image sizing. Too many SPA-specific dependencies.
- Fork `useMultiCountryOptionsV2` entirely into the island → duplicates complex logic. Instead, we extract just the tree-building logic into a shared utility that both the SPA hook and the Astro build-time code can use.

**Rationale:** A clean island boundary. The SPA's ExpertsNetwork depends on contexts and hooks that assume a full SPA environment. The Astro island gets the same data via props, keeping the dependency surface small. TreeSelector itself is imported unchanged from `../src/webapp/components/tree-selector/`.

### 4. Person card: Astro component for team, React component for experts island

**Choice:**
- **Team section:** Astro component `PersonCard.astro` — renders circular image, name, position (as markdown), institution, country. Pure static HTML.
- **Experts island:** React component `PersonCard.tsx` inside the island — same visual output but as React JSX since it lives inside a React island context.

**Alternatives considered:**
- Single React `ItemPerson` reuse for both → ships React + MUI Typography + styled-components for the static team section.
- Single Astro component for both → can't use Astro components inside a React island.

**Rationale:** Team cards have zero interactivity — pure Astro avoids JS. Expert cards must live inside the React island because they're dynamically filtered. Both components produce the same HTML structure and styles; only the authoring format differs.

### 5. Image optimization with build-time validation and avatar fallback

**Choice:** Create an image utility that:
1. At build time, validates each person's image URL by attempting a HEAD request.
2. For valid URLs: use Astro's `<Image>` component (team section) or pass the validated URL to the React island.
3. For missing/404 URLs: substitute with an inline SVG placeholder (a simple silhouette avatar).

The SVG placeholder is embedded inline rather than loaded as a separate asset — it's small (~500 bytes) and avoids an extra network request.

**Alternatives considered:**
- Use `<img>` with `onerror` handler to swap to fallback → requires client JS, defeats zero-JS goal for team section.
- Use Astro's `getImage()` and let build fail on 404 → build breaks on any missing person photo.
- Use CSS `background-image` fallback → doesn't work well with circular `object-fit: cover` styling.
- Pre-download all images at build time into `src/assets/` → adds build complexity, cache management, and repository bloat.

**Rationale:** HEAD requests are fast and non-destructive. We validate at build time, so the decision (real image vs. placeholder) is baked into the static HTML. For the team section (Astro), we can use `<Image>` with the validated URL for optimization. For the experts island (React), we pass the URL string and handle fallback in the React component with an `onError` handler (acceptable since the island already ships JS).

### 6. Remote image configuration for Astro

**Choice:** Configure `image.remotePatterns` in `astro.config.mjs` to allow the DHIS2 domain:

```js
image: {
    remotePatterns: [{ hostname: "**.who.int" }],  // or the specific DHIS2 hostname from env
}
```

**Rationale:** Astro requires explicit opt-in for remote image optimization. This allows `<Image>` to download and optimize DHIS2 person photos at build time.

### 7. TreeSelector dependencies: `client:only="react"` to skip SSR

**Choice:** Render the experts island with `client:only="react"` instead of `client:visible`.

**Alternatives considered:**
- `client:visible` → attempts server-side rendering first. Material-UI's `Menu` component and styled-components require browser APIs (`window`, `document`) and SSR setup (ServerStyleSheet) that Astro's build doesn't provide. Would cause build errors or flash of unstyled content.
- `client:load` → also attempts SSR first.

**Rationale:** `client:only="react"` skips SSR entirely — the island renders only in the browser. This sidesteps all MUI/styled-components SSR issues. The trade-off is a brief flash of empty space before hydration, but since experts are typically below the fold, this is acceptable. The `<section>` container can have a CSS `min-height` to prevent layout shift.

### 8. Office header image: Astro `<Image>` with remote URL

**Choice:** Fetch `officeInfo.officeImage` at build time and render with Astro's `<Image>` component for automatic format conversion (WebP/AVIF) and responsive `srcset`.

**Rationale:** The office image is a hero-style image above the fold. Astro optimization reduces page weight significantly. The video link wraps the image — use an `<a>` tag around `<Image>`.

### 9. Markdown rendering for position/institution text

**Choice:** Reuse the existing `renderMarkdown()` utility (from Phase 3) in the Astro team section. For the React island, use a lightweight inline approach — the position/institution text is simple (mostly `\n`-separated lines), so split on `\n` and render as `<br>` elements rather than pulling in ReactMarkdown.

**Alternatives considered:**
- Import ReactMarkdown in the island → adds ~30KB to the island bundle for trivial text formatting.
- Use `set:html` with `renderMarkdown()` in the island → `set:html` is Astro-only, not available in React.

**Rationale:** The position text from DHIS2 uses `\n` escapes for line breaks, not full markdown. A simple string split is sufficient for the React island. The Astro team section can use `renderMarkdown()` for consistency with other pages.

## Data Flow

```
Build time (Astro frontmatter):
┌─────────────────────────────────────────────────────────┐
│ compositionRoot.about.getPersons(true)  → team[]        │
│ compositionRoot.about.getPersons(false) → experts[]     │
│ compositionRoot.about.getOfficeInfo()   → officeInfo    │
│ compositionRoot.country.get()           → countries[]   │
│ compositionRoot.general.getContent()    → generalContent│
│                                                         │
│ ┌─ Transform ─────────────────────────────────────────┐ │
│ │ team + countries → teamWithCountry[] (sorted)       │ │
│ │ experts + countries → expertsWithCountry[] (sorted)  │ │
│ │ countries → treeOptions[] (pre-computed)             │ │
│ │ Validate image URLs → mark valid/placeholder        │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
          │                    │                    │
          ▼                    ▼                    ▼
┌─────────────┐    ┌───────────────┐    ┌──────────────────┐
│ Header.astro│    │ TeamGrid.astro│    │ ExpertsIsland    │
│ (static)    │    │ (static)      │    │ (client:only)    │
│             │    │               │    │                  │
│ <Image>     │    │ PersonCard x N│    │ props:           │
│ officeText  │    │ (Astro)       │    │  experts[]       │
│ videoLink   │    │               │    │  treeOptions[]   │
│             │    │               │    │  parentSort[]    │
│ 0 KB JS     │    │ 0 KB JS       │    │  strings{}       │
└─────────────┘    └───────────────┘    │                  │
                                        │ Client-side:     │
                                        │  selection state │
                                        │  filter experts  │
                                        │  TreeSelector    │
                                        │  PersonCard x N  │
                                        └──────────────────┘
```

## Risks / Trade-offs

- **MUI + styled-components bundle size in experts island** → The TreeSelector pulls in MUI core (Menu, Button, InputAdornment, icons) and styled-components. This adds significant JS weight to the experts section. **Mitigation:** Acceptable for POC — proves the reuse pattern works. Track bundle size. Long-term: rewrite TreeSelector with lightweight alternatives.

- **`client:only` means no SSR for experts** → Content is invisible until JS loads. Search engines may not index expert names. **Mitigation:** For a POC this is acceptable. If SEO matters, a follow-up could render a static expert list as a `<noscript>` fallback or use `client:visible` with proper MUI SSR setup.

- **Image validation HEAD requests slow down build** → N+1 HTTP requests at build time (1 per person + office image). **Mitigation:** Run validations in parallel with `Promise.allSettled()`. Typical team is ~10 people, experts ~30-50. At ~100ms per HEAD request in parallel, adds <1s to build.

- **TreeSelector imports chain pulls in unexpected SPA deps** → TreeSelector uses `DropdownTextField`, `SelectedChip`, `FullScreenDialog` from the SPA. These may transitively depend on other SPA code or contexts. **Mitigation:** Verify the full import chain at implementation time. If a transitive dependency pulls in `useAppContext` or `compositionRoot`, create a thin adapter or mock.

- **`useMultiCountryOptionsV2` logic duplication** → We're re-implementing the tree option building logic in the Astro frontmatter. If the SPA's logic changes, the Astro version diverges. **Mitigation:** Extract the pure transformation logic (countries → TreeOption[]) into a shared utility in `src/domain/` or `src/utils/` that both the SPA hook and the Astro build can call. This is a refactor of the SPA code, but a safe one (extract function, not change behavior).

- **Country data fetching** → The SPA gets countries from `useAppContext()` which fetches them on app load. In Astro, we need to fetch countries at build time via a use case. **Mitigation:** Verify `compositionRoot.country.get` exists and works at build time (it should — the composition root is already validated).
