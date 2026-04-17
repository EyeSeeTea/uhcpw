import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(__dirname, "../../..");
const distDir = path.join(projectRoot, "dist");
const layoutPath = path.join(projectRoot, "src/layouts/Layout.astro");
const analyticsComponentPath = path.join(projectRoot, "src/components/analytics/Analytics.astro");

const PROD_TAG = "G-NMLFDE4DY7";

describe("Analytics.astro snippet", () => {
    it("contains the gtag loader script and config call", () => {
        const source = readFileSync(analyticsComponentPath, "utf8");
        expect(source).toMatch(/googletagmanager\.com\/gtag\/js\?id=/);
        expect(source).toContain('window.gtag("config", gaTagId)');
    });

    it("sources its tag ID from analytics.config", () => {
        const source = readFileSync(analyticsComponentPath, "utf8");
        expect(source).toContain('from "@/infra/analytics.config"');
    });

    it("is rendered by the base layout", () => {
        const layoutSource = readFileSync(layoutPath, "utf8");
        expect(layoutSource).toContain("@/components/analytics/Analytics.astro");
        expect(layoutSource).toMatch(/<Analytics\s*\/?>/);
    });
});

describe("Astro build output (smoke)", () => {
    const indexHtml = path.join(distDir, "index.html");

    it.skipIf(!existsSync(indexHtml))("rendered index.html includes the gtag loader and config", () => {
        const html = readFileSync(indexHtml, "utf8");
        expect(html).toMatch(/<script[^>]*src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-[A-Z0-9]+"/);
        // Astro's define:vars injects `const gaTagId = "G-..."` and the script
        // references the variable. Assert both pieces separately so a build
        // that forgot to substitute the value can't pass by accident.
        expect(html).toMatch(new RegExp(`const\\s+gaTagId\\s*=\\s*["']${PROD_TAG}["']`));
        expect(html).toMatch(/gtag\(["']config["'],\s*gaTagId\)/);
    });
});
