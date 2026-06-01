// CLIENT-ONLY: do NOT import this module from `.astro` frontmatter or any
// build-time code path. The constructor of `GoogleAnalyticsRepository` (via its
// inner `Analytics` class) touches `window`, `document`, and `localStorage`,
// which are not available during SSG. Import only from React islands or other
// modules that run exclusively in the browser.

import { GoogleAnalyticsRepository } from "@shared/data/repositories/GoogleAnalyticsRepository";
import { SendEventUseCase } from "@shared/domain/usecases/SendEventUseCase";
import { SendPageViewUseCase } from "@shared/domain/usecases/SendPageViewUseCase";
import type { AnalyticsEvent } from "@shared/domain/entities/AnalyticsEvent";

export interface Analytics {
    readonly sendEvent: (event: AnalyticsEvent) => void;
    readonly sendPageView: (options?: { location?: string; title?: string }) => Promise<void>;
}

function buildAnalytics(): Analytics {
    // `skipInitialConfig: true` prevents the shared repository from re-issuing
    // `gtag('config', ..., { send_page_view: false })` on first event — the
    // Astro layout already calls `gtag('config', ...)` with auto page_view
    // enabled, and we don't want the repository to override it.
    const repository = new GoogleAnalyticsRepository({ skipInitialConfig: true });
    const sendEventUseCase = new SendEventUseCase(repository);
    const sendPageViewUseCase = new SendPageViewUseCase(repository);

    return {
        sendEvent: event => sendEventUseCase.execute(event),
        sendPageView: options => sendPageViewUseCase.execute(options),
    };
}

let instance: Analytics | undefined;

export function getAnalytics(): Analytics {
    if (!instance) instance = buildAnalytics();
    return instance;
}

// Test-only helper: reset the cached singleton between tests.
export function __resetAnalyticsForTests(): void {
    instance = undefined;
}
