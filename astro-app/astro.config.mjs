// @ts-check
/* eslint-disable no-undef -- process and performance are Node.js globals */
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import path from "node:path";
import { loadEnv } from "vite";
import { getBuildInfo } from "./src/lib/build-info.ts";

const env = loadEnv(process.env.NODE_ENV ?? "", process.cwd(), "");
const buildInfo = getBuildInfo();

// Base path the site is served under. Defaults to "/" for dev/root deployments;
// set `ASTRO_BASE_PATH` (e.g. "/UHCW", "/preview/pr-123") for subpath deploys.
// Normalized to a leading slash and no trailing slash ("/" stays as-is) so
// downstream consumers (vite.define, BrowserRouter basename, href() helper)
// see a single canonical form regardless of how the env var was written.
const basePath = normalizeBasePath(env.ASTRO_BASE_PATH);

/** @param {string | undefined} raw */
function normalizeBasePath(raw) {
    if (!raw || raw === "/") return "/";
    const trimmed = raw.replace(/^\/+|\/+$/g, "");
    if (!trimmed) return "/";
    if (!/^[A-Za-z0-9._~\-/]+$/.test(trimmed)) {
        throw new Error(`ASTRO_BASE_PATH contains invalid characters: ${JSON.stringify(raw)}`);
    }
    return "/" + trimmed;
}

// Directory that @shared/webapp resolves to. Used by the SVG plugin below to
// scope its rewrite to shared SPA code only.
const sharedWebappDir = path.resolve(import.meta.dirname, "../src/webapp") + path.sep;
/** Inline Astro integration that logs build start/end with total duration. */
function buildLogger() {
    let start = 0;
    return {
        name: "build-logger",
        hooks: {
            "astro:build:start": () => {
                start = performance.now();
                import("./src/lib/logger.ts").then(m =>
                    m.logger.info("Build started"),
                );
            },
            "astro:build:done": () => {
                const durationMs = (performance.now() - start).toFixed(1);
                import("./src/lib/logger.ts").then(m =>
                    m.logger.info({ durationMs }, "Build completed"),
                );
            },
        },
    };
}

// https://astro.build/config
export default defineConfig({
    site: env.SITE_URL || "https://apps.who.int/dhis2/uhcwatch",
    base: basePath,
    integrations: [react(), buildLogger()],
    image: {
        remotePatterns: [
            { protocol: "https" },
            { protocol: "http" },
        ],
    },
    vite: {
        define: {
            // Shared `src/app-config.ts` reads `process.env.REACT_APP_BASE_PATH`
            // (CRA-style static replacement). Vite does not replace it, so the
            // browser would throw `process is not defined` on first import.
            // Keep this in sync with Astro's `base` so hydrated SPA islands
            // agree with the prerendered links.
            "process.env.REACT_APP_BASE_PATH": JSON.stringify(basePath),
            __BUILD_INFO__: JSON.stringify(buildInfo),
        },
        plugins: [
            // Compat patches for shared-code transitive dependencies with broken ESM.
            // Astro's prerender build externalizes node_modules, and Node's ESM loader then
            // fails on: missing .js extensions, JSON imports without attributes, and CJS
            // named exports. These deps are pulled in by getCompositionRoot() but are not
            // used by the build-time data fetching use cases (method.get, about.getPersons,
            // about.getOfficeInfo), so stubs/redirects are safe.
            // Force ?url for SVG imports from the shared SPA source tree.
            // Without this, Astro's image integration converts SVGs to ImageMetadata
            // objects, which breaks <img src={svg}> in React components like
            // HomePagePanel and CountryPanel.
            {
                name: "shared-svg-url",
                enforce: "pre",
                async resolveId(id, importer) {
                    if (id.endsWith(".svg") && !id.includes("?") && importer?.startsWith(sharedWebappDir)) {
                        const resolved = await this.resolve(id + "?url", importer, { skipSelf: true });
                        return resolved;
                    }
                    return null;
                },
            },
            {
                name: "compat-shared-deps",
                enforce: "pre",
                resolveId(id) {
                    // CJS package — Node ESM can't extract named exports from it.
                    // Redirect to the ESM sub-path export that works.
                    if (id === "@eyeseetea/d2-api") return "\0compat:d2-api";
                    // Imports moment/locale/es without .js extension
                    if (id === "@eyeseetea/d2-ui-components/locales") return "\0stub:d2-ui-locales";
                    // Imports JSON without `with { type: "json" }` attribute
                    if (id === "@dhis2/analytics") return "\0stub:dhis2-analytics";
                    // Wrap cancel fn as nullary for Fluture + XHR backend compat
                    if (id.endsWith("utils/futures") || id.endsWith("utils/futures.ts")) {
                        return "\0compat:futures";
                    }
                    // material-ui v0 Divider requires MuiThemeProvider context.
                    // Stub with a plain <hr> to avoid pulling in the v0 theme system.
                    if (id === "material-ui") return "\0stub:material-ui-v0";
                    return null;
                },
                load(id) {
                    if (id === "\0compat:d2-api") return "export * from '@eyeseetea/d2-api/2.36'; export const getMockApiFromClass = () => () => ({});";
                    if (id === "\0stub:d2-ui-locales") return "export default {};";
                    if (id === "\0stub:dhis2-analytics") return "export const getRelativePeriodsOptionsById = () => ({}); export const WEEKLY = ''; export const DAILY = ''; export class Analytics {} export const layoutGetDimensionItems = () => []; export const DIMENSION_ID_PERIOD = ''; export const WEEKS_THIS_YEAR = ''; export const COLOR_SET_DEFAULT = ''; export const isYearOverYear = () => false;";
                    if (id === "\0compat:futures") return "import { Future } from '@shared/domain/entities/Future'; export function apiToFuture(res) { return Future.fromComputation((resolve, reject) => { res.getData().then(resolve).catch(err => reject(err ? err.message : 'Unknown error')); return () => res.cancel(); }); }";
                    if (id === "\0stub:material-ui-v0") return "import React from 'react'; export const Divider = (props) => React.createElement('hr', { style: { backgroundColor: 'white', border: 'none', height: '1px', ...props.style } });";
                    return null;
                },
            },
        ],
        ssr: {
            // Force Vite to process these through its pipeline (where the compat plugin
            // intercepts them) instead of letting Node's ESM loader handle them directly.
            noExternal: ["@dhis2/analytics", "@eyeseetea/d2-ui-components"],
        },
        resolve: {
            // Force a single React instance. Root node_modules contains React 17
            // (SPA); astro-app/node_modules contains React 18. Without dedupe,
            // MUI (resolved from root) would pull React 17 while the island uses
            // React 18 — breaking context propagation (ThemeProvider → Button).
            dedupe: ["react", "react-dom"],
            alias: {
                "@": path.resolve(import.meta.dirname, "./src"),
                "@shared/domain": path.resolve(import.meta.dirname, "../src/domain"),
                "@shared/data": path.resolve(import.meta.dirname, "../src/data"),
                "@shared/types": path.resolve(import.meta.dirname, "../src/types"),
                "@shared/utils": path.resolve(import.meta.dirname, "../src/utils"),
                "@shared/CompositionRoot": path.resolve(import.meta.dirname, "../src/CompositionRoot"),
                "@shared/webapp": path.resolve(import.meta.dirname, "../src/webapp"),
            },
        },
    },
});
