## Context

`port-home-page` deferred mobile parity for the carousel sections, the mobile map variant, and pixel-level box-grid parity. Visual regression at 390px against the React SPA produced three findings:

1. `HomeMap` never tells `MapView` or `HomePagePanel` it is on mobile, so the desktop side panel renders (markers, "UHC watch" `<h2>`, umbrella legend, "UHC watch video!" pill button) instead of the SPA's mobile panel (no title, no legend, embedded YouTube `<iframe>`, no markers).
2. The Astro big boxes don't show the bubble-pattern decoration. Cause: `theme.css` declares `img { max-width: 100%; height: auto }` globally, which the SPA does not have. The 625×227 PNG, given `height: 100%`, computes to `width: 100% = 169px` (clamped) with `object-fit: fill` defaulting, squashing the aspect ratio and hiding the dot pattern. The SPA's plain `<img>` keeps `max-width: none`, computing the natural-aspect width (~517px at `height: 188`) which extends past the box and is cropped by `overflow: hidden`, producing the visible dotted pattern.
3. The SPA's mobile layout has two carousel sections — Resources (carousel of all home-favourited resources, mixed kinds) and News (carousel of news items only, with `hideTag`). They use `react-swipeable-views` plus the SPA's `useHistory`-driven `ResourceItem`. Neither dep is available in the Astro project.

## Goals / Non-Goals

**Goals:**

- Make the mobile map render the SPA's mobile-variant side panel (no markers, no title, no legend, YouTube `<iframe>`).
- Make the mobile big-boxes show the bubble-pattern decoration at the SPA's aspect ratio.
- Add Resources and News carousels to the mobile layout with pixel-comparable spacing and dot pagination.
- Keep desktop output byte-identical to today's build.

**Non-Goals:**

- Client-side analytics events on individual carousel card clicks (link-level tracking only).
- The SPA's `regionalPageMobilePopUp` dialog (unchanged from `port-home-page` non-goals).
- Touch swipe-with-momentum physics. CSS `scroll-snap` + native touch scrolling is sufficient.
- Adding `react-swipeable-views` or `swiper`. Both bring a transitive React-router or framework dependency that the Astro app deliberately avoids.

## Decisions

### 1. Detect mobile in the `HomeMap` island via `matchMedia`

**Choice:** In `HomeMap.tsx`, after mount, read `window.matchMedia("(max-width: 959px)")` and store its `matches` in state. Subscribe to the `change` event for live updates. Pass the resulting boolean into `MapView` and `HomePagePanel`.

**Why this works:** `HomeMap` is `client:only="react"`, so there is no SSR mismatch. The breakpoint matches the rest of the page (`MobileCardGrid` and `.map-section` both pivot at 959px). Using `matchMedia` avoids the React re-render storm of a `resize` listener and matches the SPA's `useIsSmallScreen` semantics.

**Alternatives considered:**

- A CSS media query that hides/shows two separate panel DOMs → still ships the desktop marker JavaScript, defeats the goal of skipping work on mobile.
- A prop from Astro frontmatter → frontmatter runs at build time and can't know viewport.

### 2. Skip marker rendering when `isMobile`

**Choice:** In `MapView.tsx`, gate the `markers.features.forEach(...)` block on `!isMobile` (matching the SPA `Map.tsx`'s pattern). Also skip the `mouseleave`-clears-selection handler since there is no marker to select on mobile.

**Why:** Without markers the side panel never switches to `CountryPanel`, so the `selectedCountry` state stays `undefined` and `HomePagePanel` always renders. This matches the SPA's mobile UX: the map is a decorative backdrop, not an interactive control.

### 3. Wire `isMobile` through to `HomePagePanel`

**Choice:** `HomePagePanel` already accepts `isMobile`. Today `HomeMap` never passes it. The fix is one prop. The panel's existing `!isMobile` guards then correctly hide the title and umbrella legend, and the `isMobile && videoLink` branch renders the iframe.

**Why not re-implement the panel:** The mobile panel branch already exists in the SPA component we reuse. Passing the existing prop is one line. Forking the panel would diverge from `port-home-page`'s reuse principle.

### 4. Override the global `img` rule with scoped CSS, not a global change

**Choice:** Add `max-width: none` (and keep `width: auto; height: 100%`) to the `.bubble-img` selector inside `MobileCardGrid.astro`'s scoped `<style>` block.

**Why scoped, not global:** `theme.css`'s `img { max-width: 100%; height: auto; display: block; }` is a sensible default for content images and removing it could regress other pages. The bubble decoration is the only place that needs to bleed past its container. Scoped override keeps the global default intact.

**Alternatives considered:**

- Use `<img>` instead of Astro's `<Image>` component → loses asset hashing for the PNG. Not a big loss for a decorative image, but the scoped CSS fix is smaller.
- Inline SVG → the bubble pattern is a PNG; inlining would balloon HTML.

### 5. Custom React-island carousel, not Swiper

**Choice:** New `src/islands/home/MobileCarousel.tsx` — a small (~80 LOC) component that:

- Renders children inside a horizontally scrolling track with `scroll-snap-type: x mandatory`.
- Renders bullet dots whose `onClick` calls `track.scrollTo({ left: dotIndex * cardWidth, behavior: "smooth" })`.
- Tracks the active dot by listening to the track's `scroll` event (debounced via `requestAnimationFrame`) and computing `Math.round(scrollLeft / cardWidth)`.
- Accepts an `ariaLabel` prop and one `<div>` child per slide.

**Why a custom island, not Swiper:**

- Bundle: Swiper ships ~70KB minified for the touch+pagination subset. The custom island is a few hundred bytes after gzip.
- Native CSS `scroll-snap` already gives momentum scrolling, swipe gestures, and inertia on every modern mobile browser. The only thing missing is dot pagination, which is trivial to wire up.
- The SPA's `react-swipeable-views` is unmaintained and depends on `react-router`. Carrying that into Astro contradicts the project's dependency-minimization stance.

**Alternatives considered:**

- Pure-Astro + tiny vanilla JS hydration → would still need a `<script type="module">` to wire dots and observe scroll. A React island colocates the small amount of state cleanly with the existing React tooling.
- Server-render dots and let the user scroll without active-dot tracking → no visual feedback for which slide is in view; mismatch with SPA.

### 6. Add `news` slice to the build-time data layer

**Choice:** In `home-data.ts`, after the existing resource derivation, derive `news = items.filter(r => r.kind === "news" && r.favouriteSection).orderBy("favouriteSectionOrder").slice(0, 6)`. Surface it on `HomePageData` alongside `resources`. Pass it into the new `MobileNewsSection`.

**Why a separate field, not a runtime filter:** Same argument as `port-home-page` made for `resources` — keep mobile rendering zero-runtime-fetch. The two slices have different filter rules (`favouriteHome` vs `favouriteSection`) and different sort keys, so they can't be combined.

### 7. Box-grid height parity tuning

**Choice:** Compare measured heights (small box: SPA 58 vs Astro 52; big box: SPA 188 vs Astro 174) and pick concrete `min-height` values that close the gap. Bump small-box `min-height` from `30px` → `36px` so `padding * 2 + min-height = 64px ≥ SPA 58`, then let content settle to 58. For big box: increase content `min-height` so the description row gets the same vertical breathing room as the SPA's MUI `Typography` `body1` (which has a slightly larger effective line-box than a plain `<span>`).

**Why a tweak, not a wholesale switch:** The MUI Typography baseline that produces SPA's 58/188 heights is an artifact of Material-UI 4's default `body1` line-height behavior. Reproducing it exactly in Astro would mean importing MUI for the box grid — far too much weight for cosmetic parity. Matching `min-height` and `padding` to land within ±2px is the pragmatic ceiling.

## Data Flow (deltas only)

```
Build time (home-data.ts):
─────────────────────────
... existing resources derivation ...
+ news = items
+   .filter(kind === "news" && favouriteSection)
+   .orderBy("favouriteSectionOrder")
+   .slice(0, 6)

Runtime (HomeMap island):
─────────────────────────
useEffect → mq = matchMedia("(max-width: 959px)")
isMobile = mq.matches (subscribed to "change")
  │
  ├─ MapView          ── skipMarkers if isMobile
  └─ HomePagePanel    ── isMobile prop drives panel variant
```

## Risks / Trade-offs

- **`matchMedia` evaluated post-hydration causes one-frame flicker on resize across the breakpoint.** Acceptable: users almost never cross the 960px boundary mid-session, and the side panel is opacity 0.9 so the swap is visually subtle.

- **CSS `scroll-snap` carousel does not have programmatic infinite-loop or autoplay.** Acceptable: the SPA's `react-swipeable-views` doesn't autoplay either, and infinite-loop is unused.

- **Box height matching depends on font-rendering parity.** If a future font swap changes the line box, both SPA and Astro shift together — but the offset constants here will need to be re-tuned. Document the measured-vs-target heights in the spec scenario so the next maintainer has a baseline.

- **The mobile carousel ships a small island bundle even on screens that hide it via CSS.** `client:media="(max-width: 959px)"` would skip hydration on desktop, but it also skips the SSR HTML — fine for our case since the carousel is below the fold and not used by SEO. Use `client:media="(max-width: 959px)"` to keep the JS off desktop.
