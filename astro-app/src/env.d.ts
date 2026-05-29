/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
    readonly DHIS2_AUTH?: string;
    readonly DHIS2_BASE_URL?: string;
    readonly PUBLIC_MAPBOX_TOKEN?: string;
}

declare const __BUILD_INFO__: import("@/lib/build-info").BuildInfo;
