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

    it("reads the internal-traffic opt-in flag and tags the config when set", () => {
        const source = readFileSync(analyticsComponentPath, "utf8");
        expect(source).toContain('localStorage.getItem("uhcpw_internal")');
        expect(source).toMatch(/try\s*{[\s\S]*localStorage\.getItem\("uhcpw_internal"\)[\s\S]*}\s*catch/);
        expect(source).toContain('traffic_type: "internal"');
    });
});

describe("Internal-traffic toggle pages", () => {
    const onPath = path.join(projectRoot, "src/pages/internal-on.astro");
    const offPath = path.join(projectRoot, "src/pages/internal-off.astro");

    it("internal-on sets the flag and redirects", () => {
        const source = readFileSync(onPath, "utf8");
        expect(source).toContain('localStorage.setItem("uhcpw_internal", "1")');
        expect(source).toContain('location.replace("/")');
    });

    it("internal-off clears the flag and redirects", () => {
        const source = readFileSync(offPath, "utf8");
        expect(source).toContain('localStorage.removeItem("uhcpw_internal")');
        expect(source).toContain('location.replace("/")');
    });

    it("toggle pages do not load the base layout or GA4", () => {
        for (const p of [onPath, offPath]) {
            const source = readFileSync(p, "utf8");
            expect(source).not.toContain("@/layouts/Layout.astro");
            expect(source).not.toContain("@/components/analytics/Analytics.astro");
            expect(source).not.toMatch(/googletagmanager\.com/);
            expect(source).not.toMatch(/gtag\(["']config["']/);
        }
    });
});

describe("Astro build output (smoke)", () => {
    const indexHtml = path.join(distDir, "index.html");
    const internalOnHtml = path.join(distDir, "internal-on/index.html");
    const internalOffHtml = path.join(distDir, "internal-off/index.html");

    it.skipIf(!existsSync(indexHtml))("rendered index.html includes the gtag loader and config", () => {
        const html = readFileSync(indexHtml, "utf8");
        expect(html).toMatch(/<script[^>]*src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-[A-Z0-9]+"/);
        // Astro's define:vars injects `const gaTagId = "G-..."` and the script
        // references the variable. Assert both pieces separately so a build
        // that forgot to substitute the value can't pass by accident.
        expect(html).toMatch(new RegExp(`const\\s+gaTagId\\s*=\\s*["']${PROD_TAG}["']`));
        expect(html).toMatch(/gtag\(["']config["'],\s*gaTagId\)/);
    });

    it.skipIf(!existsSync(internalOnHtml))("internal-on/index.html contains no GA4 loader or config", () => {
        const html = readFileSync(internalOnHtml, "utf8");
        expect(html).not.toMatch(/googletagmanager\.com/);
        expect(html).not.toMatch(/gtag\(["']config["']/);
        expect(html).toContain('localStorage.setItem("uhcpw_internal", "1")');
    });

    it.skipIf(!existsSync(internalOffHtml))("internal-off/index.html contains no GA4 loader or config", () => {
        const html = readFileSync(internalOffHtml, "utf8");
        expect(html).not.toMatch(/googletagmanager\.com/);
        expect(html).not.toMatch(/gtag\(["']config["']/);
        expect(html).toContain('localStorage.removeItem("uhcpw_internal")');
    });
});
