## Context

UHCW staff and contributors account for a meaningful share of traffic in GA4 reports, distorting the picture the client cares about: what real visitors do. GA4 supports a first-class `traffic_type` dimension and a matching "Internal Traffic" Data Filter that drops matching events server-side before they reach reports.

Two GA4 tags are already in use (prod `G-NMLFDE4DY7`, dev `G-5DKB563RGC`) and both are shared across the Astro static site and the React SPA, since both apps are served from the same origin during the static-site migration.

Two tag-emission paths exist:

- `astro-app/src/components/analytics/Analytics.astro` — inline snippet in `<head>` that runs on every Astro page load and calls `gtag("config", gaTagId)` once.
- `src/data/repositories/GoogleAnalyticsRepository.ts` — the SPA's repository, used by both apps for event emission. Its constructor takes `skipInitialConfig`; in the Astro context that flag is set, so the SPA path only issues `config` in pure-SPA navigations (today that's only during local SPA dev or if the user lands first on a SPA-only route).

Because the flag lives in `localStorage` and both apps share the origin, a single opt-in is enough for both runtimes.

## Goals / Non-Goals

**Goals:**
- Give UHCW staff a one-click URL to opt out (and a second to opt back in) that works regardless of which runtime served them first.
- Ensure every `gtag("config", ...)` call emitted by either runtime carries `traffic_type: "internal"` when the flag is set, so GA4's Internal Traffic Data Filter can drop their events.
- Keep the bootstrap path synchronous and free of new dependencies — the inline snippet in `<head>` must still work with CSP `'unsafe-inline'` for analytics (current baseline) and run before the tag script loads.

**Non-Goals:**
- Per-event tagging (we set `traffic_type` once at `config` time — GA4 persists it onto subsequent events for that config).
- Device-independent identity (no account system; the flag is per-browser/per-origin by design).
- Blocking the tag script entirely (`window['ga-disable-<ID>']`) — we want the events to reach GA4 *tagged as internal* so the data is visible to admins via the "Testing" mode of Data Filters before committing to "Active".
- Writing new UI: `/internal-on` and `/internal-off` are empty routes whose only job is to run one line of JS and redirect.

## Decisions

### Decision 1: Use `traffic_type: "internal"` passed at `gtag("config", ...)` time

Set once per page load, not per event. GA4 attaches the value to all events fired under that config. This minimizes touch points (one site in `Analytics.astro`, one site in `GoogleAnalyticsRepository.setAnalyticsConfig`).

**Alternatives considered:**
- `window['ga-disable-G-XXX'] = true`: blocks the tag entirely. Rejected — it also hides internal traffic from admins during the "Testing" phase of the Data Filter, and requires knowing the tag ID at the opt-out site, forcing duplication of both prod/dev IDs.
- Tagging each `gtag("event", ...)` call with `traffic_type`: more surface area for drift, zero functional benefit.

### Decision 2: Opt-in state lives in `localStorage` under key `uhcpw_internal`

- Origin-scoped, so a single visit to `/internal-on` covers Astro pages and SPA pages alike (they share the origin in both dev via the reverse proxy and in production).
- Persistent across sessions without a cookie banner (no tracking-identifying info, just a boolean).
- Readable synchronously from the inline `<head>` snippet — no async waits before `gtag("config", ...)`.

**Alternatives considered:**
- Cookie on parent domain: necessary only if apps ever move to separate subdomains. Not today's problem.
- URL parameter passed on every visit: impractical for staff.

### Decision 3: Opt-in pages are empty `.astro` files with one inline script

- `/internal-on.astro`: sets `localStorage.uhcpw_internal = "1"` then `location.replace("/")`.
- `/internal-off.astro`: removes the key then `location.replace("/")`.
- They render nothing visible (a tiny noscript fallback explains what happened for users with JS disabled, who would also not be generating analytics anyway).
- No layout, no analytics loader — we do *not* want the page itself to send a `page_view` with the pre-flag config.

This matches the user's ask ("very simple empty pages") and keeps them out of sitemap/nav.

### Decision 4: Read the flag inline in `Analytics.astro` before the `config` call

```js
const isInternal = (() => {
    try { return localStorage.getItem("uhcpw_internal") === "1"; }
    catch { return false; }
})();
window.gtag("config", gaTagId, isInternal ? { traffic_type: "internal" } : {});
```

The `try/catch` guards against Safari private mode and embedded-context `SecurityError`s. Kept inline — a separate module would force async loading and a race with the first `config` call.

### Decision 5: Mirror the same check in the SPA repository

`GoogleAnalyticsRepository.setAnalyticsConfig()` passes `traffic_type: "internal"` into its `gtag("config", ...)` call when the flag is set. This matters only when the SPA initializes GA4 itself (i.e., `skipInitialConfig` is falsy) — but keeping both paths consistent prevents drift if the Astro/SPA integration changes.

### Decision 6: Data flow through layers

The flag is a UI-layer concern (browser preference), read only at the two bootstrap sites. It does not enter `Domain` or `Application`. `SendEventUseCase` and `AnalyticsEvent` are untouched. This preserves the boundary: the `traffic_type` dimension is a GA4-infrastructure detail, not part of the domain event taxonomy.

## Risks / Trade-offs

- **Risk:** Staff who use incognito, clear cookies, or switch browsers will be counted as regular visitors until they revisit `/internal-on`. → **Mitigation:** combine this with the GA4 IP-based Internal Traffic rule (done in the GA4 admin, out of scope for code) to catch office IP ranges automatically. The two mechanisms reinforce each other.
- **Risk:** Data Filter set to "Exclude Internal Traffic" is retroactive only going forward — historical data already ingested remains. → **Mitigation:** document this in the README; for the transition window, set the filter to "Testing" first to verify tagging before committing.
- **Risk:** If Astro and SPA ever get served from different origins, the flag will no longer be shared. → **Mitigation:** note in README; revisit by switching to a cookie on the parent domain if that happens.
- **Trade-off:** We still send events for internal users (they're just tagged); someone inspecting the network tab will see `/g/collect` hits. Accepted — this is intentional because it lets us validate filters with "Testing" mode before going "Active". If that later becomes undesirable we can swap to `window['ga-disable-<ID>']` with one line of change.
- **Risk:** The inline snippet grows beyond what's comfortable to keep in `.astro` frontmatter. → **Mitigation:** the addition is ~5 lines; if it ever exceeds ~15, extract to a tiny `public/internal-flag.js` loaded synchronously before the GA loader.

## Migration Plan

1. Land the code change (pages + conditional `config`).
2. In GA4 Admin → Data Streams → both streams: open "Configure tag settings" → "Show all" → "Define internal traffic". Add a rule with `traffic_type = internal` (no IP needed for this mechanism; IP rules can be added separately).
3. Admin → Data Filters → enable the "Internal Traffic" filter with state "Testing" for 24–48h. Verify in DebugView and Reports (via the `Test data filter name` comparison).
4. Switch filter to "Active".
5. Announce the `/internal-on` URL to staff. No client-side rollback needed to revert filtering — toggle the GA4 filter back to "Inactive" to stop excluding.

Code rollback: revert the two pages and the two hunks. The flag becomes inert. Filter in GA4 can stay or be disabled independently.
