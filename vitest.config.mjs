import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { fileURLToPath } from "node:url";

export default defineConfig({
    plugins: [react(), svgr()],
    resolve: {
        alias: [
            {
                find: "react-markdown",
                replacement: fileURLToPath(new URL("./config/reactMarkdownMock.jsx", import.meta.url)),
            },
            {
                find: /^.*\/components\/seo\/SeoMetaTags$/,
                replacement: fileURLToPath(new URL("./config/SeoMetaTagsMock.js", import.meta.url)),
            },
        ],
    },
    define: {
        __UHC_BASE_PATH__: JSON.stringify("/"),
        "import.meta.env.REACT_APP_MAPBOX_TOKEN": JSON.stringify(""),
    },
    test: {
        environment: "jsdom",
        globals: true,
        include: ["src/**/*.{test,spec}.{js,jsx,ts,tsx}", "config/**/*.test.mjs"],
        setupFiles: ["./src/setupTests.js"],
        maxWorkers: 2,
        testTimeout: 100000,
        clearMocks: false,
        coverage: {
            provider: "v8",
            include: ["src/**/*.{ts,tsx}"],
            exclude: ["src/**/*.d.ts", "src/**/__tests__/**", "src/**/*.spec.{ts,tsx}", "src/**/*.test.{ts,tsx}"],
            reporter: ["json", "lcov", "text"],
        },
    },
});
