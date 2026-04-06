// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import path from "node:path";

// https://astro.build/config
export default defineConfig({
    integrations: [react()],
    image: {
        remotePatterns: [
            { protocol: "https" },
            { protocol: "http" },
        ],
    },
    vite: {
        plugins: [
            // Compat patches for shared-code transitive dependencies with broken ESM.
            // Astro's prerender build externalizes node_modules, and Node's ESM loader then
            // fails on: missing .js extensions, JSON imports without attributes, and CJS
            // named exports. These deps are pulled in by getCompositionRoot() but are not
            // used by the build-time data fetching use cases (method.get, about.getPersons,
            // about.getOfficeInfo), so stubs/redirects are safe.
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
                        return path.resolve(import.meta.dirname, "./src/lib/futures.ts");
                    }
                    return null;
                },
                load(id) {
                    if (id === "\0compat:d2-api") return "export * from '@eyeseetea/d2-api/2.36'; export const getMockApiFromClass = () => () => ({});";
                    if (id === "\0stub:d2-ui-locales") return "export default {};";
                    if (id === "\0stub:dhis2-analytics") return "export const getRelativePeriodsOptionsById = () => ({}); export const WEEKLY = ''; export const DAILY = ''; export class Analytics {} export const layoutGetDimensionItems = () => []; export const DIMENSION_ID_PERIOD = ''; export const WEEKS_THIS_YEAR = ''; export const COLOR_SET_DEFAULT = ''; export const isYearOverYear = () => false;";
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
