## Context

The React SPA reports to Google Analytics 4 via a single `GoogleAnalyticsRepository` (`src/data/repositories/GoogleAnalyticsRepository.ts`) wrapped by `SendPageViewUseCase` and `SendEventUseCase`. The SPA is a HashRouter app, so it sets `send_page_view: false` and emits page_view manually inside `useEffect` on each page component, plus rich domain events from features (Policy/Indicator Explorer, Visualization, Screenshot modal, etc.). Configuration lives in `src/app-config.ts` (`G-5DKB563RGC` dev / `G-NMLFDE4DY7` prod).

The Astro site is a static MPA (no client-side router): every navigation is a full page load. The base layout `astro-app/src/layouts/Layout.astro` is shared by all pages, and shared SPA code is consumed via the `@shared/*` path aliases established by the `shared-code-imports` capability.

## Goals / Non-Goals

**Goals:**
- Mirror the SPA's GA4 setup so the Astro site reports to the same property with the same dev/prod tag IDs.
- Reuse `GoogleAnalyticsRepository`, `SendPageViewUseCase`, and `SendEventUseCase` from the SPA via `@shared/*` imports — no duplication of analytics logic.
- Emit one `page_view` per Astro page automatically, without requiring per-page wiring.
- Provide a single client-side entry point that React islands can call to emit events using the same `AnalyticsEvent` taxonomy as the SPA.
- Keep the build static: GA must initialize purely on the client; no SSR coupling.

**Non-Goals:**
- Cookie consent / privacy banner (the SPA has none; out of scope for the PoC).
- Tracking new events that don't exist in the SPA.
- Refactoring the SPA's analytics code.
- Porting Explorer/Visualization islands themselves — those land in their own changes; this change only ensures the analytics wiring is ready when they arrive.
- Server-side / build-time analytics (e.g., proxying GA through an Astro endpoint).

## Decisions

### Decision 1: Static MPA → use gtag's native auto page_view, not the SPA's manual emission

**Choice:** Load `gtag.js` with the standard snippet in `BaseLayout.astro` and let `gtag('config', tagId)` fire `page_view` automatically on each full page load.

**Why:** In an MPA every navigation reloads the document, so the gtag bootstrap snippet runs fresh on every page and natively sends a `page_view` with the current `location.href` and `document.title`. The SPA's pattern of `send_page_view: false` + manual `useEffect` emission exists *only* because HashRouter mutates the URL without reloading the document — that constraint does not apply to Astro.

**Alternatives considered:**
- *Mirror the SPA exactly: `send_page_view: false` + call `SendPageViewUseCase` from a client entry on every page.* Rejected because it duplicates what gtag already does for free in an MPA, adds a second JS payload to every page, and creates a race between gtag init and the use case call.
- *View Transitions + `astro:page-load` listener.* Rejected because the site does not use View Transitions and adding them just for analytics is out of scope.

### Decision 2: Reuse `GoogleAnalyticsRepository` for custom events, with a minimal `skipInitialConfig` option

**Choice:** Page views are handled by gtag's auto-config (Decision 1). For custom events emitted from React islands (`file_download`, `resource`, `external_link`, `indicator_explorer*`, `policy_explorer*`, etc.), reuse `GoogleAnalyticsRepository` + `SendEventUseCase` from `@shared/data/...` and `@shared/domain/...`, adding a single backward-compatible constructor option `skipInitialConfig` to the shared repository.

**Why:** The repository's `buildAnalyticsEvent` switch encodes the exact event taxonomy and parameter shapes our GA4 dashboards depend on. Re-implementing it would risk silent drift. However, the repo's `else` branch (when `window.gtag` already exists, which is always the case in Astro because the layout snippet pre-defines it) unconditionally calls `setAnalyticsConfig()`, which pushes a second `gtag('config', tagId, { send_page_view: false })` that would silently disable our layout's auto `page_view`. This directly contradicts Decision 1.

The minimal fix is a `skipInitialConfig` option added to the shared `GoogleAnalyticsRepository` constructor (default `false`, preserving SPA behavior). The Astro client composition root constructs the repo with `{ skipInitialConfig: true }`. No duplication of the event-shape switch, no override of shared state, and the SPA is unaffected.

**Alternatives considered:**
- *Wrap `window.gtag` directly in the islands.* Rejected — bypasses the domain/use-case layer, scatters event-shape knowledge across components, and violates the project's clean-architecture reuse principle.
- *Subclass `GoogleAnalyticsRepository` in astro-app and override `send`.* Rejected — the inner `Analytics` class is private and `buildAnalyticsEvent` is module-private, so a subclass would have to reimplement everything.
- *Leave the shared repo untouched and accept the extra `config` call.* Rejected — it silently disables the auto `page_view` and makes Decision 1 false in practice.

**Alternatives considered:**
- *Wrap `window.gtag` directly in the islands.* Rejected — bypasses the domain/use-case layer, scatters event-shape knowledge across components, and violates the project's clean-architecture reuse principle.

### Decision 3: Client composition root for analytics

**Choice:** Add a tiny client-only module (e.g. `astro-app/src/infra/analytics.client.ts`) that constructs `GoogleAnalyticsRepository`, wraps it in `SendEventUseCase`/`SendPageViewUseCase`, and exposes a singleton (`getAnalytics()`). React islands import this module instead of calling the repo directly.

**Why:** Keeps composition concerns out of the islands, mirrors the SPA's `compositionRoot.googleAnalytics` shape so a hook equivalent to `useAnalytics` can be ported with minimal change, and gives one place to swap the implementation in tests.

**Alternatives considered:**
- *Provide a React context.* Overkill for a singleton with no React state; can be added later if multiple implementations are needed.
- *Construct the repo inline in each island.* Rejected — duplicates wiring and makes mocking harder.

### Decision 4: Tag ID selection via Astro env, in an Astro-owned config module

**Choice:** Define the two tag IDs and the selection helper in a new Astro-owned
module `astro-app/src/infra/analytics.config.ts`, keyed off `import.meta.env.PROD`.
Both `Analytics.astro` (layout snippet) and `analytics.client.ts` (client composition
root) import the selector from this module. The SPA's `@shared/app-config` is **not**
reused.

**Why:** Astro's env is the canonical way to branch dev vs. prod at build time.
During implementation we discovered the SPA's `src/app-config.ts` hardcodes
`gaTagId` to the prod tag — the dev tag was only documented in a comment and
never selected at runtime. Rather than mutating shared SPA state from the
Astro client (which would violate the project's immutability preference and
be order-dependent), we keep an Astro-local config. This also gives us a single
source of truth for the two tag IDs, eliminating drift risk between the layout
snippet and event emission.

### Decision 5: gtag snippet placement — `<head>` of base layout

**Choice:** Put the gtag bootstrap snippet (loader script + inline `gtag('js', ...)` + `gtag('config', tagId)`) in the `<head>` of `BaseLayout.astro` so it runs before the first paint and before any island hydrates.

**Why:** Standard Google recommendation; ensures the auto page_view fires even if the user immediately navigates away, and guarantees `window.gtag` exists by the time islands hydrate (so the repo's `else` branch runs instead of the lazy reload).

## Data Flow

```
Astro page request
  └── BaseLayout.astro renders
        └── <head> includes gtag loader + config(tagId) [auto page_view fires on load]
        └── <body> renders Astro components and React islands
              └── Island hydrates client-side
                    └── imports getAnalytics() from @/infra/analytics.client
                          └── lazily constructs SendEventUseCase(GoogleAnalyticsRepository)
                    └── on user action (download, link click, explorer summary, …)
                          └── analytics.sendEvent({ name: "...", ... })
                                └── SendEventUseCase → GoogleAnalyticsRepository
                                      └── window.gtag("event", name, params)
                                            └── GA4
```

Layer mapping:
- **UI (Astro/React)**: `BaseLayout.astro`, React islands.
- **Application (use cases)**: `SendEventUseCase`, `SendPageViewUseCase` (reused from `@shared/domain/usecases`).
- **Domain (entities)**: `AnalyticsEvent` (reused from `@shared/domain/entities`).
- **Infrastructure (repository)**: `GoogleAnalyticsRepository` (reused from `@shared/data/repositories`).
- **Composition (Astro-side)**: `astro-app/src/infra/analytics.client.ts` (new, client-only).

## Risks / Trade-offs

- **Risk:** `appConfig.gaTagId` is selected via `process.env.NODE_ENV`, which Vite normally inlines, but the value during `astro dev` may not match expectations. → **Mitigation:** smoke-test both `astro dev` and `astro build` and confirm the loaded tag ID via the Network tab; if dev resolves wrong, override `appConfig` from `analytics.client.ts` before constructing the repo.
- **Risk:** Double page_view emission if a future change introduces View Transitions (which keep the document alive). → **Mitigation:** documented in the spec; the change that adds View Transitions must also flip `send_page_view: false` and add an `astro:page-load` listener.
- **Risk:** Co-existence with the SPA on the same GA4 property could double-count users during the migration window. → **Mitigation:** acceptable for the PoC; can be filtered in GA4 by `page_location` host if needed.
- **Risk:** `GoogleAnalyticsRepository`'s `Analytics` class touches `localStorage` and `document` in its constructor, so it must only be instantiated client-side. → **Mitigation:** `analytics.client.ts` is imported only from islands (which are client-only by definition); never imported from `.astro` frontmatter.
- **Trade-off:** We diverge from the SPA's manual page_view pattern. This is intentional (Decision 1) but means the two codebases are not byte-identical for analytics — documented in the design so future readers don't "fix" it back to parity.

## Migration Plan

1. Land this change behind no flag — analytics is additive and invisible to users.
2. Verify in `astro dev` that the dev tag ID loads and an auto page_view appears in GA4 DebugView.
3. Build and preview locally; verify the prod tag ID is selected and a page_view fires.
4. Merge to `feature/static-site`. No production deploy implications until the static site itself is rolled out.
5. **Rollback:** revert the script tag in `BaseLayout.astro` and delete `analytics.client.ts`. Islands that import it will fail to build, surfacing any forgotten consumers immediately.

## Open Questions

- ~~Does `process.env.NODE_ENV` inside `@shared/app-config.ts` get inlined correctly by Vite when imported from Astro?~~ **Resolved during implementation:** the shared `app-config.ts` hardcodes the prod tag unconditionally, so reusing it was never viable. We define the tag IDs in an Astro-owned `analytics.config.ts` instead (see Decision 4).
- The `accessToConsole` developer toggle is now documented in `astro-app/README.md`.
