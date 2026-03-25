// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import path from "node:path";

// https://astro.build/config
export default defineConfig({
    integrations: [react()],
    vite: {
        resolve: {
            alias: {
                "@": path.resolve(import.meta.dirname, "./src"),
                "@shared/domain": path.resolve(import.meta.dirname, "../src/domain"),
                "@shared/data": path.resolve(import.meta.dirname, "../src/data"),
                "@shared/types": path.resolve(import.meta.dirname, "../src/types"),
                "@shared/utils": path.resolve(import.meta.dirname, "../src/utils"),
            },
        },
    },
});
