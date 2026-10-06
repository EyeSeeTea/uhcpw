declare const __UHC_BASE_PATH__: string | undefined;

/**
 * Resolves the app's base path for both deploy contexts from a single bundle.
 *
 * In DHIS2 the app is served under `<instance>/api/apps/<app-name>/`, where the
 * instance segment varies per server but the `/api/apps/<app-name>` suffix is
 * fixed by DHIS2 convention. We detect that pattern at runtime so no build-time
 * config is needed for DHIS2 deployments.
 *
 * Outside DHIS2 (public portal, preview branches) the base path is arbitrary
 * and is baked in at build time via `REACT_APP_BASE_PATH`.
 *
 * @returns the detected DHIS2 base path, or `null` when not running under DHIS2.
 */
const detectDhis2BasePath = (): string | null => {
    if (typeof window === "undefined") return null;
    const match = window.location.pathname.match(/^(.*\/api\/apps\/[^/]+)(?=\/|$)/);
    return match?.[1] ?? null;
};

export const appConfig: AppConfig = {
    appKey: "uhcpw-app",
    gaTagId: "G-NMLFDE4DY7", // Prod: G-NMLFDE4DY7, Dev: G-5DKB563RGC
    // Vite injects this public constant. Node scripts and Astro keep their
    // existing process.env fallback without importing browser-only metadata.
    basePath:
        detectDhis2BasePath() ||
        (typeof __UHC_BASE_PATH__ === "string" ? __UHC_BASE_PATH__ : process.env.REACT_APP_BASE_PATH) ||
        "/",
};

export interface AppConfig {
    appKey: string;
    gaTagId: string;
    basePath: string;
}
