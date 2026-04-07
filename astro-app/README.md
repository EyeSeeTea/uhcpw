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
