import type { AppContextState } from "@shared/webapp/contexts/app-context";
import { getAnalytics } from "@/infra/analytics.client";

// Shared webapp components defensively read fields from AppContext that this
// Astro island doesn't wire up (api, currentUser). Throwing on access surfaces
// as opaque React render errors, so we return undefined and warn once per
// field to keep misuse visible in development without breaking the page.
function stubField<T extends object>(field: string): T {
    const warned = new Set<string>();
    return new Proxy({} as T, {
        get(_target, prop) {
            const key = String(prop);
            if (!warned.has(key)) {
                warned.add(key);
                console.warn(
                    `AppContextState.${field}.${key} is not wired in Astro islands.`,
                );
            }
            return undefined;
        },
    });
}

export function buildAstroAnalyticsContext(): AppContextState {
    const analytics = getAnalytics();

    const compositionRoot = {
        googleAnalytics: {
            sendPageView: {
                execute: (options?: { location?: string; title?: string }) =>
                    analytics.sendPageView(options),
            },
            sendEvent: {
                execute: (event: Parameters<typeof analytics.sendEvent>[0]) =>
                    analytics.sendEvent(event),
            },
        },
    } as AppContextState["compositionRoot"];

    return {
        api: stubField<AppContextState["api"]>("api"),
        currentUser: stubField<AppContextState["currentUser"]>("currentUser"),
        countries: [],
        themes: [],
        generalContent: undefined,
        countriesAndSubregions: [],
        regions: [],
        compositionRoot,
    };
}
