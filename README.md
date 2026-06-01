# App for the Universal Health Coverage in the WHO European Region

Digital platform to
monitor Universal Health Coverage in the WHO European Region (UHCPW).

## Setup

Install dependencies:

```
$ yarn install
```

## Development

Start the development server:

```
$ PORT=8081 REACT_APP_DHIS2_BASE_URL="http://localhost:8080" yarn start
```

Now in your browser, go to `http://localhost:8081`.

Notes:

-   Requests to DHIS2 will be transparently proxied (see `src/setupProxy.js`) from `http://localhost:8081/dhis2/path` to `http://localhost:8080/path` to avoid CORS and cross-domain problems.

-   The optional environment variable `REACT_APP_DHIS2_AUTH=USERNAME:PASSWORD` forces some credentials to be used by the proxy. This variable is usually not set, so the app has the same user logged in at `REACT_APP_DHIS2_BASE_URL`.

-   The optional environment variable `REACT_APP_PROXY_LOG_LEVEL` can be helpful to debug the proxyfied requests (accepts: "warn" | "debug" | "info" | "error" | "silent")

-   The optional environment variable `REACT_APP_BASE_PATH` sets the basename for the SPA router. Defaults to `"/"` for local development. Set to `/dhis2/uhcwatch` for production deployment under a sub-path.

-   Create a file `.env.local` (copy it from `.env`) to customize environment variables so you can simply run `yarn start`.

-   [why-did-you-render](https://github.com/welldone-software/why-did-you-render) is installed, but it does not work when using standard react scripts (`yarn start`). Instead, use `yarn start-profiling` to debug re-renders with WDYR. Note that hot reloading does not work out-of-the-box with [craco](https://github.com/gsoft-inc/craco).

## Integrated development (SPA + Astro)

To run the SPA and Astro site side-by-side behind a single reverse proxy:

1. Start the SPA dev server (port 8081):

```
$ yarn start
```

2. Start the Astro dev server (port 4321):

```
$ cd astro-app && yarn start
```

3. Start the Apache reverse proxy (port 3000):

```
$ docker compose up
```

Then open `http://localhost:3000`. The proxy routes `/about` and `/methods` to Astro, and everything else to the SPA.

To add more Astro pages to the proxy, edit `dev/httpd.conf` and add `ProxyPass`/`ProxyPassReverse` entries before the SPA catch-all block.

## Tests

### Unit tests

```
$ yarn test
```

### Integration tests (Cypress)

Create the required users for testing (`cypress/support/App.ts`) in your instance and run:

```
$ export CYPRESS_EXTERNAL_API="http://localhost:8080"
$ export CYPRESS_ROOT_URL=http://localhost:8081

# non-interactive
$ yarn cy:e2e:run

# interactive UI
$ yarn cy:e2e:open
```

## Build app ZIP

For production:

```
$ yarn build:prod
# or an alias:
$ yarn build
```

For test:

```
$ yarn build:test
```

## Some development tips

### Structure

-   `i18n/`: Contains literal translations (gettext format)
-   `public/`: Main app folder with a `index.html`, exposes the APP.
-   `src/pages`: Main React components.
-   `src/domain`: Domain layer of the app (clean architecture)
-   `src/data`: Data of the app (clean architecture)
-   `src/components`: Reusable React components.
-   `src/types`: `.d.ts` file types for modules without TS definitions.
-   `src/utils`: Misc utilities.
-   `src/locales`: Auto-generated, do not update or add to the version control.
-   `cypress/integration/`: Cypress integration tests.

### i18n

```
$ yarn localize
```

### App context

The file `src/contexts/app-context.ts` holds some general context so typical infrastructure objects (`api`, `d2`, ...) are readily available. Add your own global objects if necessary.

### Scripts

#### generate-sitemap

Generates a sitemap and outputs by default to the `public` directory. The routes config is defined in `src/scripts/generateSitemap.ts`.

```
yarn run generate-sitemap --base-url "https://apps.who.int/dhis2/uhcwatch/" --auth "user:password"
# or use env variables REACT_APP_DHIS2_BASE_URL REACT_APP_DHIS2_AUTH instead of args
```

#### update-sitemap

Takes an existing sitemap as parameter, and updates the lastmod of each url.
This script is intended to include it as a build step to keep dates fresh, without needing to require credentials to regenerate the sitemap with `generate-sitemap` on each run.

```
yarn run update-sitemap
```
