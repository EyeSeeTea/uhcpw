## 1. Base-path config wiring

- [x] 1.1 [FE] Add `ASTRO_BASE_PATH` handling in `astro.config.mjs` — load via `loadEnv`, normalize (strip leading/trailing slashes, re-add single leading slash), validate character set, default to `/`
- [x] 1.2 [FE] Wire normalized `basePath` into Astro's `base` and `vite.define['process.env.REACT_APP_BASE_PATH']`
- [x] 1.3 [FE] Document `ASTRO_BASE_PATH` default and examples in `.env.example`

## 2. `href()` helper

- [x] 2.1 [FE] Create `src/lib/href.ts` with `href(path)` that prefixes `import.meta.env.BASE_URL` and passes absolute URLs / non-HTTP schemes through unchanged
- [x] 2.2 [FE] Add `isActivePath(current, target)` to the same module for nav highlighting
- [x] 2.3 [FE] Replace hand-authored internal `href`/`src` strings in layouts, components, islands, and pages with `href(…)` calls

## 3. Move assets into `src/assets/`

- [x] 3.1 [FE] Move `public/fonts/` → `src/assets/fonts/`
- [x] 3.2 [FE] Move `public/assets/map/` → `src/assets/map-pins/`
- [x] 3.3 [FE] Move `public/assets/map-background.jpg` → `src/assets/`
- [x] 3.4 [FE] Move `public/favicon.ico` → `src/assets/`, import via `?url` in `Layout.astro`
- [x] 3.5 [FE] Move `public/uhcw.png` → `src/assets/`, import via `?url` in `SeoHead.astro`

## 4. Font preload / @font-face consistency

- [x] 4.1 [FE] Move `@font-face` declarations from `theme.css` into `Layout.astro` using `?url` imports for woff2/woff files
- [x] 4.2 [FE] Keep `<link rel="preload">` for Regular + Bold woff2 using the same `?url` imports
- [x] 4.3 [FE] Verify production build emits a single fingerprinted URL per font (preload and font-face match)

## 5. SEO canonical / OG image under a base path

- [x] 5.1 [FE] Update `SeoHead.astro` default OG image to resolve bundled `src/assets/uhcw.png` against `Astro.site`
- [x] 5.2 [FE] Document inline in `SeoHead.astro` that `SITE_URL` and `ASTRO_BASE_PATH` must be kept consistent for canonical URLs to be correct

## 6. Documentation

- [x] 6.1 [FE] Add "Deployment configuration" section to `README.md` documenting `ASTRO_BASE_PATH` and `SITE_URL` (what they do, how they interact, examples)
- [x] 6.2 [FE] Add "Internal links and base path" guidance to `AGENTS.md` explaining when to use `href()` and when Vite handles prefixing automatically

## 7. Specs

- [x] 7.1 [FE] Add `base-path` capability spec
- [x] 7.2 [FE] Update `base-layout` spec — fonts loaded via Layout-level `?url` imports, no longer from `theme.css`
- [x] 7.3 [FE] Update `seo-meta-tags` spec — canonical URL derives from `Astro.url.pathname` + `Astro.site` origin; default OG image is bundled

## 8. Verification

- [x] 8.1 [FE] `yarn build` succeeds with default (`/`) base
- [x] 8.2 [FE] `ASTRO_BASE_PATH=/UHCW yarn build` emits `/UHCW/…` asset URLs and `/UHCW/_astro/favicon.*.ico`
- [x] 8.3 [FE] Preloaded font URL equals the `@font-face` URL in built HTML
