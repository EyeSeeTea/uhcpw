# Mobile Performance Optimization

## Goals

Improve Lighthouse mobile performance scores on the About and Methods pages by addressing the key bottlenecks identified through performance tracing:

1. **Render-blocking CSS** — External stylesheets (`Layout.D6tuOd2h.css`, `about@_@astro.B1kOKlYF.css`) block first paint, adding ~200ms to FCP/LCP on About
2. **Font loading chain** — Fonts (Lato Regular/Bold woff2) are discovered only after CSS loads, creating a 3-hop dependency chain (HTML → CSS → Font) with ~750ms critical path on Methods
3. **LCP image priority** — Methods page LCP element is `map-background.jpg` (loaded via CSS `background-image` on mobile `@media max-width:600px`), which starts with `Low` priority and has a 422ms load delay because the browser can't discover it until after CSS is parsed
4. **JS dependency chain** — About page has a 4-hop JS chain (`client.js → index.js → ExpertsNetworkSelector.js`) reaching 1,073ms critical path for the `ExpertsNetwork` island

## Non-goals

- Changing visual design or layout
- Removing Google Analytics (3rd party impact is minimal)
- Restructuring the React islands architecture
- Optimizing desktop-only performance (focus is mobile)

## User impact

Faster mobile page loads. The pages are static content pages, so there's no interactive complexity — the performance wins come from network/render optimizations.

## Compatibility

All changes are internal to the Astro build output. No API or behavioral changes.

## Rollback plan

Revert the commits. All changes are in Astro templates and config — no data or infrastructure changes.

## Baseline measurements (mobile emulation: 375x667, 4x CPU throttle, Fast 4G)

| Page    | LCP   | Main bottleneck                        |
|---------|-------|----------------------------------------|
| About   | 439ms | 434ms render delay (render-blocking CSS) |
| Methods | 747ms | 422ms LCP load delay + missing fetchpriority |
