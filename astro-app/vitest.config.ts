import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
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
    test: {
        environment: "jsdom",
        include: ["src/**/*.test.{ts,tsx}"],
        setupFiles: ["./src/test-setup.ts"],
    },
});
