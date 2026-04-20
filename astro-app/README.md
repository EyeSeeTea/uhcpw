# UHCH Watch - Astro PoC

## 🚀 Project Structure

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `yarn install`             | Installs dependencies                            |
| `yarn run dev`             | Starts local dev server at `localhost:4321`      |
| `yarn run build`           | Build your production site to `./dist/`          |
| `yarn run preview`         | Preview your build locally, before deploying     |
| `yarn run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `yarn run astro -- --help` | Get help using the Astro CLI                     |

## Astro Documentation

Feel free to check [Astro documentation](https://docs.astro.build)

## Analytics

The site reports to Google Analytics 4 using the same tag IDs as the React SPA.
Tag selection and the IDs live in `src/infra/analytics.config.ts` (single source
of truth for both the layout snippet and event emission):

- Production builds (`yarn build`): `G-NMLFDE4DY7`
- Dev server (`yarn start`) and previews: `G-5DKB563RGC`

The gtag loader is injected by `src/components/analytics/Analytics.astro`,
rendered from the base layout's `<head>`, so every page emits one `page_view`
automatically on load. React islands emit custom events through the shared
`SendEventUseCase` via `src/infra/analytics.client.ts`
(`getAnalytics().sendEvent(...)`). The client constructs
`GoogleAnalyticsRepository` with `skipInitialConfig: true` so the repository
does not override the layout's auto `page_view` with `send_page_view: false`.

To see GA4 events logged to the browser console while developing, set the developer
toggle once in DevTools and reload:

```js
localStorage.setItem("accessToConsole", "true");
```

### Excluding internal traffic

UHCW staff and contributors can opt out of being counted as regular visitors.
Two layout-less pages toggle a browser-local flag:

- Visit `/internal-on` once per browser to set `localStorage.uhcpw_internal = "1"`.
- Visit `/internal-off` to clear it.

Both pages immediately redirect to `/`. While the flag is set, the site's
`gtag("config", ...)` bootstrap adds `traffic_type: "internal"` to every
GA4 hit emitted from that browser — in both the Astro site and the React SPA
(they share the origin, and therefore the flag, via `localStorage`).

For the tag to actually drop internal events from reports, the matching
**Internal Traffic Data Filter** must be configured in each GA4 data stream
(prod `G-NMLFDE4DY7`, dev `G-5DKB563RGC`). In GA4 Admin:

1. Data Streams → stream → Configure tag settings → Show all →
   Define internal traffic. Add a rule with `traffic_type = internal`
   (optionally also add office IP ranges).
2. Admin → Data Filters → activate the "Internal Traffic" filter. Use
   "Testing" mode first to verify tagging in DebugView, then switch to
   "Active" to exclude the events. Data Filters are **not retroactive** —
   hits recorded before activation stay in reports.

## LLM-friendly endpoints

The build emits an [llms.txt](https://llmstxt.org/) index and markdown
companions so LLM crawlers can read clean page content without HTML chrome:

| Path                    | Content-Type     | Source                                                |
| :---------------------- | :--------------- | :---------------------------------------------------- |
| `/llms.txt`             | `text/plain`     | Auto-generated from SEO + general CMS                 |
| `/index.md`             | `text/markdown`  | `src/lib/llms-txt/home-summary.md`                    |
| `/about.md`             | `text/markdown`  | Same loader as `/about` (`getAboutPageData`)          |
| `/methods.md`           | `text/markdown`  | Same loader as `/methods` (`getMethodsPageData`)      |
| `/area-overview.md`  | `text/markdown`  | Map markers from `getHomePageData()` (no HTML route)  |

Serializer logic lives in `src/lib/llms-txt/serializers.ts`; endpoints are
plain Astro `GET` handlers under `src/pages/`. Editing CMS content
automatically propagates to the markdown companions on the next build.

**Charset:** the endpoints emit `Content-Type: text/markdown; charset=utf-8`
(and `text/plain; charset=utf-8` for `/llms.txt`), but most static hosts apply
their own content type based on file extension. Configure the host so that
`.md` and `.txt` under `dist/` are served with `charset=utf-8` — otherwise
browsers may fall back to Windows-1252 and show mojibake (`â€"` etc.) on
content that contains em-dashes or non-ASCII names.

