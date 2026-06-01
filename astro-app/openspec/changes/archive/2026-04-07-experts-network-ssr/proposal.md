## Why

The `ExpertsNetwork` island is currently rendered with `client:only="react"`, which skips SSR entirely. As a result the experts section is invisible until JavaScript hydrates, the static HTML is empty (bad for SEO and perceived performance on the about page), and we get a flash of empty space below the fold. The reason it's `client:only` is that the legacy Material-UI v0 / `@material-ui/core` providers used by `TreeSelector` touch browser-only APIs during render and crash the Astro build. We want to keep the same TreeSelector behavior client-side but emit real SSR HTML for the rest of the section at build time.

## What Changes

- Switch `ExpertsNetwork` from `client:only="react"` to `client:load` in `src/pages/about.astro` so Astro renders the component during static build and hydrates it in the browser.
- Refactor `src/islands/about/ExpertsNetwork.tsx` so the Material-UI providers (`MuiThemeProvider`, `OldMuiThemeProvider`) and `TreeSelector` are mounted only after the component has hydrated in the browser (gated behind a `useEffect` / `mounted` flag), while the title, subtitle and experts grid render unconditionally on both server and client.
- During SSR / first client render (pre-hydration), render a placeholder in place of the TreeSelector that preserves the layout (same height/width) so there is no layout shift when the real selector mounts.
- Keep all existing props, filtering behavior, and CSS untouched. No change to the build-time data pipeline in `about.astro`.

Non-breaking: the public island props stay the same; only the internal rendering strategy and the `client:*` directive change.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `react-integration`: ExpertsNetwork must server-render via `client:load` instead of `client:only`, with browser-only providers gated behind post-mount state.

## Impact

- Affected files:
  - `src/pages/about.astro` (directive change)
  - `src/islands/about/ExpertsNetwork.tsx` (provider gating + placeholder)
  - `src/islands/about/__tests__/ExpertsNetwork.test.tsx` (assertions for pre-mount markup)
  - `openspec/specs/react-integration/spec.md` (delta)
- No new dependencies. No changes to shared SPA code under `../src/`.
- Build output: `/about` HTML now contains the experts section markup (title, subtitle, grid of person cards) instead of an empty `<astro-island>` shell.
- Risk: a brief visual change between SSR markup and hydrated TreeSelector — mitigated by a placeholder that matches the selector's footprint.
