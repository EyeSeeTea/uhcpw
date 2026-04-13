# Mobile Performance — Design

## Data flow

These are static pages — no runtime data fetching. All data is resolved at build time. The performance bottlenecks are in the network waterfall and resource discovery order during page load.

## Optimizations applied

### 1. Inline theme CSS via `?inline` import

**Problem:** `theme.css` (fonts, design tokens, CSS reset) was emitted as an external render-blocking `Layout.*.css` file (~3.7 KiB). Lighthouse flagged ~2000ms estimated savings.

**Solution:** Import theme CSS as a string using Vite's `?inline` suffix and render it directly into the HTML with `set:html`. This keeps `theme.css` as the single source of truth while eliminating the external request.

```typescript
import themeCSS from "@/styles/theme.css?inline";
```
```html
<style set:html={themeCSS}></style>
```

**File:** `src/layouts/Layout.astro`

### 2. Preload fonts in Layout `<head>`

**Problem:** Fonts (Lato Regular/Bold) were discovered only after the browser downloaded and parsed the CSS file (2-hop chain: HTML → CSS → Font), adding ~300ms to the critical path.

**Solution:** Add `<link rel="preload">` for both woff2 fonts. This makes fonts discoverable from the HTML directly, collapsing the chain to 1 hop.

**Note:** Chrome shows a console warning ("preloaded but not used within a few seconds") — this is a false positive. The performance traces confirmed the font chain was eliminated from the dependency tree.

**File:** `src/layouts/Layout.astro`

### 3. Preload LCP image for methods mobile viewport

**Problem:** On mobile (<=600px), the methods page LCP element is a `.title-banner` div with `background-image: url(/assets/map-background.jpg)`. The browser discovers this image only after CSS is parsed (422ms load delay) and it starts at `Low` priority.

**Solution:** Added a `<slot name="head" />` to Layout for page-specific head content, then used it in methods.astro to inject a preload scoped to mobile viewports:

```html
<link slot="head" rel="preload" href="/assets/map-background.jpg" as="image" media="(max-width: 600px)" fetchpriority="high" />
```

**Files:** `src/layouts/Layout.astro`, `src/pages/methods.astro`

### 4. Defer ExpertsNetwork island hydration

**Problem:** The About page loaded the `ExpertsNetwork` React island with `client:load`, triggering a 4-hop JS chain (1,073ms critical path) immediately on page load. The island is below the fold.

**Solution:** Changed `client:load` to `client:visible` so JS only loads when the user scrolls to it. This removed the entire JS chain from the initial critical path.

**File:** `src/pages/about.astro`

## Results (mobile: 375x667, 4x CPU throttle, Fast 4G)

| Metric | About before | About after | Methods before | Methods after |
|---|---|---|---|---|
| Critical path | 1,073ms | 427ms (-60%) | 750ms | ~415ms (-45%) |
| LCP | 439ms | ~500ms (variable) | 747ms | 542ms (-27%) |
| Font chain | 2-hop | Eliminated | 2-hop | Eliminated |
| JS chain | 4-hop (1,073ms) | Gone | n/a | n/a |
| Render-blocking CSS | 204ms savings | 144ms savings | 137ms savings | 0ms savings |

## Decisions

- **experts-network.css kept external:** 147 lines of below-the-fold island styles. Astro bundles frontmatter CSS imports into external files regardless. The `client:visible` change has more impact.
- **Component CSS stays external:** Astro-scoped styles from Header/Footer/Nav are bundled into a single external file by Astro's build pipeline. This can't be inlined without bypassing Astro's component model.
