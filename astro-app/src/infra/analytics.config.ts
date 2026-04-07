// Astro-side analytics configuration. Single source of truth for the GA4 tag
// IDs so that `Analytics.astro` (layout snippet) and `analytics.client.ts`
// (island event emission) can never drift apart.
//
// This module contains no DOM/browser access and is safe to import from both
// server (`.astro` frontmatter) and client contexts.

export const ANALYTICS_PROD_TAG_ID = "G-NMLFDE4DY7";
export const ANALYTICS_DEV_TAG_ID = "G-5DKB563RGC";

export function getAnalyticsTagId(): typeof ANALYTICS_PROD_TAG_ID | typeof ANALYTICS_DEV_TAG_ID {
    return import.meta.env.PROD ? ANALYTICS_PROD_TAG_ID : ANALYTICS_DEV_TAG_ID;
}
