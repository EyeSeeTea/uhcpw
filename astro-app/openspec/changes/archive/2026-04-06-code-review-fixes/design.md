## Context

The astro-app is a static site PoC built with Astro, reusing shared domain/infra code from the React SPA at `../src`. During rapid development, several patterns were duplicated across files, dead code accumulated, and some HTML/CSS anti-patterns crept in. A code review identified 18 issues across architecture, type safety, DRY, accessibility, and styling.

## Goals / Non-Goals

**Goals:**
- Eliminate duplicated utilities (normalizeUrl, AVATAR_FALLBACK, getAuthHeaders, nav items)
- Remove dead code (image-validation.ts, pointless test)
- Fix type safety in composition root
- Improve accessibility and HTML validity
- Fix CSS scoping and FOUC issues

**Non-Goals:**
- Fetching nav items dynamically from DHIS2 at build time (issue #10 — acknowledged as PoC shortcut)
- Making footer year dynamic via client JS (issue #14 — acceptable for a rebuilt-regularly static site)

## Decisions

### D1: Single `normalizeUrl` in `lib/url.ts`

Three implementations exist with different regex behavior. The Layout/methods version (`/([^:])\/\/+/g`) is correct for URL paths. The image-downloader version uses a different regex that's specific to fixing base URL + API path joins.

**Decision:** Create `lib/url.ts` with the Layout regex as the general `normalizeUrl`. Keep the image-downloader's version as a private `normalizeImageUrl` since it handles protocol-specific double-slash fixing differently. Both callers in Layout and methods will use the shared one.

**Alternative considered:** One function for both — rejected because the image-downloader regex serves a distinct purpose (protocol-aware normalization for DHIS2 API URLs).

### D2: Composition root type fix

`getCompositionRoot(api, d2DataEngine, instance)` — the second param is typed `unknown` in the shared code. Currently passed as `null as unknown`.

**Decision:** Pass `null as unknown as Parameters<typeof getCompositionRoot>[1]` with a comment explaining why null is safe (d2DataEngine is only used by the React SPA runtime, not SSG build). This is the minimal fix that preserves type documentation.

**Alternative considered:** Creating a null-object stub — over-engineering for a parameter that's explicitly `unknown`.

### D3: ExpertsNetwork CSS extraction

The component injects ~125 lines of CSS via a `<style>` string at hydration time, causing FOUC and global name collisions.

**Decision:** Move the CSS to `src/styles/experts-network.css`, imported in `about.astro` via a standard `import`. This ensures styles are in the document before JS hydrates. Keep class names as-is since they're specific enough (`.experts-*`, `.person-card-*`) and the React island needs global classes anyway (it can't use Astro scoped styles).

### D4: DesktopNav style scoping

**Decision:** Remove `is:global` and use Astro's `:global()` selector only for the dynamic `.open` class that the `<script>` toggles, since Astro scripts query by class name. All other styles become scoped.

**Alternative considered:** Full scoping with `data-` attributes for script queries — more correct but higher churn for minimal gain in a PoC.

### D5: Shared navigation data

**Decision:** Create `src/data/navigation.ts` exporting the nav items array with the `NavItem` type. Both `DesktopNav.astro` and `MobileNav.astro` import from it. MobileNav maps to flat items (ignoring children) since mobile doesn't show dropdowns.

### D6: Centralize URL resolution for abbreviations/glossary

**Decision:** Add a helper `resolveGeneralContentUrls(generalContent)` in `src/data/general-content.ts` that applies fallbacks and normalization. Both `methods.astro` and `Layout.astro` call it. This removes the inline fallback URLs from methods.astro and the normalizeUrl calls from Layout.astro.

Data flow: Page fetches generalContent → resolveGeneralContentUrls() → pass to Layout and use in page.

### D7: AVATAR_FALLBACK constant

**Decision:** Export from `src/data/about/constants.ts`. Import in PersonCard.astro, PersonCardReact.tsx, and about-images.ts.

## Risks / Trade-offs

- **DesktopNav partial scoping** — The `:global(.open)` escape hatch means one class remains global. Low risk since it's a specific state class.
- **ExpertsNetwork CSS file** — Moving to a separate file means styles load even if the island doesn't hydrate (e.g., JS disabled). Acceptable trade-off: CSS is small and prevents FOUC.
- **Removing inline onerror** — If image-downloader fails silently for some images, the onerror was a safety net. Since about-images.ts already falls back to AVATAR_FALLBACK for missing images, the runtime handler is redundant. We'll keep PersonCardReact's React `onError` handler since it's proper React code.
