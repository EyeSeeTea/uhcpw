import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export interface BuildInfo {
    readonly version: string;
    readonly commit: string;
    readonly buildDate: string;
}

function readVersion(): string {
    try {
        const here = path.dirname(fileURLToPath(import.meta.url));
        const pkgPath = path.resolve(here, "../../package.json");
        const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as { version?: unknown };
        return typeof pkg.version === "string" ? pkg.version : "0.0.0";
    } catch {
        return "0.0.0";
    }
}

function readCommit(): string {
    try {
        return execSync("git rev-parse --short HEAD", { stdio: ["ignore", "pipe", "ignore"] })
            .toString()
            .trim() || "unknown";
    } catch {
        return "unknown";
    }
}

export function getBuildInfo(): BuildInfo {
    return {
        version: readVersion(),
        commit: readCommit(),
        buildDate: new Date().toISOString(),
    };
}
