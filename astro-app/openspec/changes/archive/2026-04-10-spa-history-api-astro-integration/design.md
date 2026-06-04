## Context

The UHC Watch SPA uses React Router v5's `HashRouter`, which prefixes all routes with `#`. The Astro static site serves pages like `/about` and `/methods` at clean paths. These two apps need to coexist under the same domain, sharing the URL space — Astro handles static pages while the SPA handles dynamic/interactive ones.

Currently in production, Apache proxies all requests under `/dhis2/uhcwatch` to the SPA. The SPA relies on hash routing so the server never needs to distinguish between routes. Moving to History API routing means the server must:
1. Route certain paths to Astro
2. Route remaining paths to the SPA
3. Handle SPA client-side routing (serve `index.html` for unknown SPA paths)

### Current data flow

```
Browser → Apache (prod) → DHIS2 (serves SPA index.html)
SPA loads → HashRouter reads window.location.hash → renders route
SPA → window.location.hash → AnalyticsEvent extracts page → GA4 event
```

### Target data flow

```
Browser → Apache (dev proxy) → Astro (4321) for /about, /methods
                              → SPA (8081) for everything else
SPA loads → BrowserRouter reads window.location.pathname → renders route
SPA → window.location.pathname → AnalyticsEvent extracts page → GA4 event
```

## Goals / Non-Goals

**Goals:**
- Replace HashRouter with BrowserRouter across the SPA
- Support configurable basename for sub-path deployment (`/dhis2/uhcwatch`)
- Provide Docker Compose + Apache for local dev with correct routing between Astro and SPA
- Fix analytics to use pathname instead of hash
- Update sitemap generation and test fixtures

**Non-Goals:**
- Changing the production Apache configuration
- Adding hash-to-clean-URL redirect middleware
- Upgrading React Router to v6
- Handling SSR for the SPA

## Decisions

### 1. BrowserRouter with `basename` prop

**Choice**: Use `<BrowserRouter basename={appConfig.basePath}>` where `basePath` defaults to `"/"` locally and `/dhis2/uhcwatch` in production.

**Why over alternatives**:
- `MemoryRouter`: Only useful for tests, not real navigation.
- `unstable_HistoryRouter` with custom history: Unnecessary complexity for v5.
- Keeping `HashRouter` with URL rewriting: Doesn't achieve clean URL goal.

**Impact**: All `<NavLink to="/about">` and `history.push("/about")` calls continue to work unchanged — React Router v5's `BrowserRouter` uses the same relative path API as `HashRouter`.

### 2. Basename from environment variable

**Choice**: Read basename from `REACT_APP_BASE_PATH` (or the existing app-config mechanism), defaulting to `"/"`.

**Why**: The SPA already has `app-config.ts` for environment-specific configuration. Adding `basePath` there keeps the pattern consistent. In local dev, basename is `/`; in production, it's `/dhis2/uhcwatch`.

### 3. Apache reverse proxy for local dev (Docker Compose)

**Choice**: Single Apache container that routes:
- `/methods`, `/about` → Astro dev server (`host.docker.internal:4321`)
- `/api/*` → DHIS2 backend (proxied like production)
- Everything else → SPA dev server (`host.docker.internal:8081`)
- SPA fallback: any non-file, non-API request not matching Astro paths serves SPA's `index.html`

**Why Apache over Nginx/Caddy**: Production uses Apache with `mod_proxy` and `mod_substitute`. Mirroring this locally reduces surprises during deployment.

**Container setup**:
```
docker-compose.yml
  └── apache service
       ├── ports: 3000:80
       ├── volumes: ./dev/httpd.conf
       └── image: httpd:2.4
```

Developers run `docker compose up` alongside `yarn start` (SPA on 8081) and Astro dev (port 4321), then access everything through `http://localhost:3000`.

### 4. SPA dev server fallback configuration

**Choice**: Configure the SPA's webpack-dev-server with `historyApiFallback: true`.

**Why**: With BrowserRouter, direct navigation to `/indicator-explorer` must serve `index.html` so the SPA can boot and render the correct route. This is standard SPA behavior with History API.

### 5. Analytics: remove hash workaround

**Choice**: In `GoogleAnalyticsRepository.ts`, change `send_page_view: false` to `send_page_view: true` (let GA4 auto-track) and remove the manual hash extraction in `AnalyticsEvent.ts`.

**Why**: With BrowserRouter, `window.location.pathname` already contains the clean path. GA4's automatic page view tracking works correctly with standard URLs. The manual `sendPageView()` calls in each page component can remain for explicit control, but should use `window.location.pathname` instead of `window.location.hash`.

**Trade-off**: Keeping manual `sendPageView()` per page gives fine-grained control over page titles. We keep the manual calls but switch the location source.

### 6. Apache routing rules (priority order)

```
1. /api/*                    → proxy to DHIS2 backend
2. /about, /methods          → proxy to Astro (4321)
3. Static assets (*.js, *.css, *.png, etc.) → proxy to SPA (8081)
4. Everything else           → proxy to SPA (8081) index.html (fallback)
```

The Astro route list is maintained explicitly in the Apache config. As more pages migrate to Astro, entries are added to rule 2.

## Risks / Trade-offs

**[Broken bookmarks]** → Existing `/#/path` bookmarks will 404. Mitigation: This is a PoC; production deployment can add a redirect rule (`RewriteRule ^/#/(.*)$ /$1 [R=301,L]`) in Apache if needed. Not in scope for this change.

**[Dual dev servers required]** → Developers must run three processes (SPA, Astro, Docker). Mitigation: Document the workflow clearly. Could add a `docker-compose.yml` profile or script to start all three.

**[Astro route list maintenance]** → Apache config must be updated when new Astro pages are added. Mitigation: Keep the route list in one clearly-commented block. This is the same pattern production uses.

**[CORS / cookies in local dev]** → Apache proxy should forward headers correctly. Mitigation: Mirror the production `Header` directives in the dev config.

## Open Questions

1. Should we configure the SPA's webpack-dev-server `historyApiFallback` ourselves, or rely entirely on the Apache proxy for fallback? (Recommendation: do both — webpack for standalone SPA dev, Apache for integrated dev.)
2. What DHIS2 backend URL should the local Apache proxy target for API requests? (Need a dev/staging instance URL or mock.)
