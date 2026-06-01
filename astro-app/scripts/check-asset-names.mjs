#!/usr/bin/env node
// Fails the build if any emitted asset path under dist/ contains a character
// the WHO WAF rejects. Today that's just "@" — extend FORBIDDEN if more
// surface. public/ passthroughs are excluded (author-controlled filenames).
import { readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";

const FORBIDDEN = ["@"];
const DIST = new URL("../dist/", import.meta.url).pathname;
const SKIP_TOP_LEVEL = new Set(["public"]);

function walk(dir) {
    return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) {
            const rel = relative(DIST, full).split(sep)[0];
            if (SKIP_TOP_LEVEL.has(rel)) return [];
            return walk(full);
        }
        return [relative(DIST, full)];
    });
}

try {
    const offenders = walk(DIST).filter(p => FORBIDDEN.some(c => p.includes(c)));
    if (offenders.length > 0) {
        console.error(
            `check-asset-names: ${offenders.length} emitted path(s) contain forbidden character(s) ${JSON.stringify(FORBIDDEN)}:`,
        );
        for (const p of offenders) console.error(`  - ${p}`);
        console.error("The deployment WAF rejects these URLs. Fix astro.config.mjs sanitizeFileName.");
        process.exit(1);
    }
    console.log(`check-asset-names: ok (no forbidden chars in dist/)`);
} catch (err) {
    if (err && err.code === "ENOENT") {
        console.error(`check-asset-names: dist/ not found at ${DIST}. Run 'astro build' first.`);
        process.exit(1);
    }
    throw err;
}
