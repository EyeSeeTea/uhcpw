## Context

Astro's `base` config option is the canonical way to serve a site under a subpath.
When `base` is set:

- Astro prefixes all routes (`Astro.url.pathname` reflects the base).
- Vite's `BASE_URL` is set to the same value and used to prefix any asset URL the
  bundler emits (imports, CSS `url()`, `<img src>` on relative paths, etc.).
- Astro does *not* automatically rewrite string literals in component templates —
  `<a href="/about">` stays as-is and produces a broken link.

We need the configured base to reach four places with a single source of truth:

1. Astro's own router / prerenderer.
2. Vite-emitted asset URLs (automatic once `base` is set).
3. Hydrated React islands that use `BrowserRouter` — the SPA reads
   `process.env.REACT_APP_BASE_PATH` (CRA-style static replacement).
4. Hand-authored `href`/`src` strings in Astro templates.

## Decisions

### Single env var: `ASTRO_BASE_PATH`

`astro.config.mjs` reads `ASTRO_BASE_PATH` via `loadEnv()` and:

- Normalizes it (strip leading/trailing slashes, re-add a single leading slash).
- Validates characters (`[A-Za-z0-9._~\-/]` only); throws on garbage.
- Passes the normalized value to Astro's `base` and to
  `vite.define['process.env.REACT_APP_BASE_PATH']`.

The SPA's own `src/app-config.ts` already expects this env var — this mirrors the
CRA convention and avoids introducing a parallel name. Defaulting to `/` keeps dev
ergonomic.

### `href()` helper, not template interpolation

Options considered:

- **A**: Interpolate `import.meta.env.BASE_URL` at every call site.
- **B** *(chosen)*: Provide a `href()` helper that wraps it.
- **C**: Use a custom Astro integration to rewrite string literals.

(B) is the smallest change with the clearest ergonomics. (C) is magical and hides
behavior. (A) is verbose and error-prone (forgetting to strip a leading slash causes
a double-slash URL).

`href()` also owns two invariants:

- It accepts absolute URLs (`http(s):`, `//…`, `data:`, `blob:`, `mailto:`) and
  returns them unchanged. Without this guard, calling `href(someExternalUrl)` would
  silently produce a broken string like `/UHCW/https://…`.
- It returns the base itself (with trailing slash) for `href("/")`, so
  `<a href={href("/")}>` works on the home page.

### Assets move from `public/` to `src/assets/`

`public/` assets are served verbatim and are *not* fingerprinted or base-prefixed by
Vite. Anything referenced from code should go through the bundler:

- **Fonts** — CSS `url()` in `theme.css` could work, but `theme.css` is imported as
  `?inline` and used with `set:html`, so Vite's url() rewriting in that context
  produces a *different* fingerprint than a `?url` import of the same file. That
  mismatch wastes the `<link rel="preload">`. To guarantee one URL per asset, the
  `@font-face` rules moved into `Layout.astro` where both preload and font-face get
  the same `?url`-imported string.
- **favicon.ico, uhcw.png** — moved and imported via `?url`. The OG image needs an
  absolute URL, so `SeoHead.astro` resolves the `?url` path against `Astro.site`.
- **Map pins, map background, person card images** — moved and referenced via
  relative CSS `url()` or Astro's `<Image>`; Vite handles both.

### Canonical URL construction

`Astro.url.pathname` already includes the configured base. Constructing
`new URL(Astro.url.pathname, Astro.site)` drops any path on `Astro.site` (URL
constructor behavior when the first arg is absolute), which is the right behavior
*only if* `SITE_URL` and `ASTRO_BASE_PATH` are kept in sync (both contain the
subpath or neither does). This is documented inline in `SeoHead.astro` and in
`README.md` rather than enforced in code, because:

- Validating the relationship at build time would require parsing `SITE_URL` and
  comparing it to `ASTRO_BASE_PATH`, and the correct behavior for mismatch is
  unclear (throw? warn? concatenate?).
- The common deployment patterns keep them consistent; the foot-gun only appears
  when an operator edits one without the other.

## Data flow

```
ASTRO_BASE_PATH env var
    ↓ (astro.config.mjs — loadEnv + normalize)
    ├──→ Astro config `base`
    │     ↓
    │     ├──→ Astro router (Astro.url.pathname, route prerendering)
    │     └──→ Vite `BASE_URL`
    │           ↓
    │           ├──→ ?url imports (fonts, favicon, uhcw.png)
    │           ├──→ CSS url() in bundled CSS (map pins, map background)
    │           └──→ <Image> / remote-to-local image downloads
    │
    └──→ vite.define process.env.REACT_APP_BASE_PATH
          ↓
          └──→ Hydrated React islands (BrowserRouter basename)

import.meta.env.BASE_URL
    ↓
    └──→ src/lib/href.ts → href() → hand-authored templates + islands
```

## Constraints

- **`BASE_URL` is compile-time constant.** `href()` is safe to use in client
  islands because Vite statically replaces `import.meta.env.BASE_URL` at build
  time — no runtime server dependency crosses the island boundary.
- **`public/` assets still exist** for files referenced from generated markdown
  companions (`/llms.txt`, `/*.md`) and for assets that must keep stable URLs
  (none today, but `public/images/` stays for now). Those are accessed via
  `href("/images/...")`.
- **SPA islands carrying their own base-path logic** (DHIS2-hosted webapp detects
  its base at runtime) are out of scope; the Astro build path and the DHIS2
  runtime path are independent concerns.
