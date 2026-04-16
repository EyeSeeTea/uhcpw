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
        // Astro's define:vars injects `const gaTagId = "..."` and the script
        // references the variable, so match either the literal or variable form.
        expect(html).toMatch(
            new RegExp(`gtag\\(["']config["'],\\s*(?:["']${PROD_TAG}["']|gaTagId)\\)`),
        );
    });
});
