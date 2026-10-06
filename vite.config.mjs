import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { fileURLToPath } from "node:url";
import { getDhis2Proxy } from "./config/dhis2Proxy.mjs";

export default defineConfig(async ({ command, mode }) => {
    const env = { ...loadEnv(mode, process.cwd(), ""), ...process.env };
    const port = Number(env.PORT || 3000);
    if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("Invalid PORT");

    return {
        base: "./",
        // Separate running servers so they cannot overwrite each other's optimized chunks.
        cacheDir: `node_modules/.vite/spa-${mode}-${port}`,
        optimizeDeps: {
            entries: ["index.html"],
            // The polyfill plugin injects these after scanning. Pre-bundle them
            // up front to avoid regenerating shared chunks during first load.
            include: ["vite-plugin-node-polyfills/shims/buffer", "vite-plugin-node-polyfills/shims/process"],
        },
        // Expose only public SPA variables. Auth/target are consumed by the proxy.
        define: {
            __UHC_BASE_PATH__: JSON.stringify(env.REACT_APP_BASE_PATH || "/"),
            "import.meta.env.REACT_APP_MAPBOX_TOKEN": JSON.stringify(env.REACT_APP_MAPBOX_TOKEN || ""),
        },
        plugins: [
            // md5.js hashes seeded DHIS2 UIDs and requires Buffer/streams.
            nodePolyfills({
                include: ["buffer", "stream", "events", "util", "process"],
                globals: { Buffer: true, global: false, process: true },
            }),
            react({ jsxImportSource: mode === "profiling" ? "@welldone-software/why-did-you-render" : "react" }),
            svgr(),
        ],
        resolve: {
            alias: {
                // Use this package's published browser bundle, preserving export support.
                "@eyeseetea/xlsx-populate": fileURLToPath(
                    new URL("./node_modules/@eyeseetea/xlsx-populate/browser/xlsx-populate.js", import.meta.url)
                ),
            },
        },
        server: {
            host: "127.0.0.1",
            port,
            proxy: command === "serve" ? await getDhis2Proxy(env) : undefined,
        },
        build: {
            outDir: "build",
            // CRA emitted SVG URLs. Inline SVG quotes/parentheses break legacy
            // styled-components CSS url() rules and can discard following styles.
            assetsInlineLimit: file => (file.endsWith(".svg") ? false : undefined),
            sourcemap: env.GENERATE_SOURCEMAP === "true",
        },
    };
});
