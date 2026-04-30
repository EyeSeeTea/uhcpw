## Context

`src/pages/internal-on.astro` and `src/pages/internal-off.astro` are intentionally layout-less, scriptless (no module imports), inline-only pages that toggle `localStorage["uhcpw_internal"]` and then `location.replace("/")` to send the user back to the home page. The "no layout, no imports" rule exists so these pages do not load the GA4 tag and do not emit a `page_view` for themselves (see analytics spec, "Toggle pages do not themselves pollute analytics").

Astro is configured with a configurable `base` (`astro.config.mjs:23`, sourced from `ASTRO_BASE_PATH`, normalized to a leading slash with no trailing slash, defaulting to `/`). For non-root deployments — e.g. the WHO host that mounts the app under a subpath, or PR previews under `/preview/pr-123` — the literal `"/"` redirect kicks the user out of the app's URL space.

## Goals / Non-Goals

**Goals:**
- After running the toggle, send the browser to the application root, regardless of the configured `base`.
- Keep the toggle pages layout-less and free of module imports / GA4 loading.
- Keep the change a 1-line edit per page.

**Non-Goals:**
- Refactoring the toggle pages to share code (there's nothing meaningful to extract from a 5-line inline script).
- Introducing a runtime helper that reads `import.meta.env.BASE_URL` from a separate module — that would either still be inlined by Vite or risk pulling additional code into the page.
- Changing the `localStorage` key, value, or scoping behavior.

## Decisions

### Decision: Inline `import.meta.env.BASE_URL` directly into the `<script is:inline>` block

Astro replaces `import.meta.env.BASE_URL` at build time with a string literal — `"/"` for a root deployment and the configured base for subpath deployments (observed: `"/UHCW"`, no trailing slash, when `ASTRO_BASE_PATH=/UHCW`). Embedding it via an Astro template expression in the inline script produces the correct static literal in each emitted HTML file:

```astro
<script is:inline define:vars={{ basePath: import.meta.env.BASE_URL }}>
    try { localStorage.setItem("uhcpw_internal", "1"); } catch {}
    location.replace(basePath);
</script>
```

`define:vars` is the canonical Astro mechanism for passing build-time values into `is:inline` scripts. It JSON-serializes the value as a `const` declaration at the top of the script — no module imports, no extra runtime, compatible with the layout-less requirement.

**Alternative considered:** templating the string directly into the script body (`location.replace("{import.meta.env.BASE_URL}")`). Works, but `define:vars` is the documented Astro pattern and survives prettier/formatter passes more cleanly.

**Alternative considered:** a shared helper module imported from `src/lib/`. Rejected because importing a module from these pages risks pulling additional code into the page bundle, and the analytics spec explicitly requires that no GA4 loader / page_view code runs here. A bare inline literal is the smallest possible footprint.

### Decision: Use `BASE_URL` verbatim

`location.replace` accepts either `"/UHCW"` or `"/UHCW/"`; the browser resolves both to the same final URL. Use whatever Astro gives us without trimming or appending — the form is an Astro implementation detail, not something this code should encode opinions about.

## Risks / Trade-offs

- **Risk**: `define:vars` is converted by Astro to a JSON-encoded `const` injected before the user's script body. → **Mitigation**: this is the documented behavior; verified to work with `is:inline` and to leave the script self-contained (no Vite import graph attached).
- **Risk**: a misconfigured `ASTRO_BASE_PATH` could ship a redirect to an off-site URL. → **Mitigation**: `astro.config.mjs` already validates the env var (`normalizeBasePath` rejects characters outside the path-safe set); a hostile value would fail the build, not the redirect.
- **Trade-off**: the redirect target is frozen at build time. Re-deploying under a new base requires a rebuild — already true for every other base-prefixed link in the app, so this matches existing behavior.

## Migration Plan

Single PR, two-file edit. Deploy normally; no migration steps. Rollback = revert the PR; behavior reverts to the pre-fix state, which is correct for root-mounted deployments and broken (as before) for subpath deployments.
