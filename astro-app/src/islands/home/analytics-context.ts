import type { AppContextState } from "@shared/webapp/contexts/app-context";
import { getAnalytics } from "@/infra/analytics.client";

function unavailable<T extends object>(field: string): T {
    return new Proxy({} as T, {
        get() {
            throw new Error(
                `AppContextState.${field} is not available in Astro islands. ` +
                    `Only compositionRoot.googleAnalytics is wired up.`,
            );
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
        api: unavailable<AppContextState["api"]>("api"),
        currentUser: unavailable<AppContextState["currentUser"]>("currentUser"),
        countries: [],
        themes: [],
        generalContent: undefined,
        countriesAndSubregions: [],
        regions: [],
        compositionRoot,
    };
}
