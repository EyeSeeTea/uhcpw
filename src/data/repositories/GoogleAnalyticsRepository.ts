import { appConfig } from "../../app-config";
import { AnalyticsEvent } from "../../domain/entities/AnalyticsEvent";
import { AnalyticsRepository } from "../../domain/repositories/AnalyticsRepository";

declare global {
    interface Window {
        gtag: (...args: any[]) => void;
        dataLayer: any[];
    }
}

export class GoogleAnalyticsRepository implements AnalyticsRepository {
    private analytics?: Analytics;

    send(event: AnalyticsEvent) {
        if (!this.analytics) this.analytics = new Analytics(event);
        this.analytics.sendAnalytics(event);
    }
}

class Analytics {
    constructor(event: AnalyticsEvent) {
        if (!window.gtag) this.intialize();
        window.gtag("js", new Date());
        this.setAnalyticsConfig(event);
    }

    sendAnalytics(event: AnalyticsEvent) {
        console.debug("GA4: send analytics event", event.name, buildAnalyticsEvent(event));
        window.gtag("event", event.name, buildAnalyticsEvent(event));
    }

    setAnalyticsConfig(event: AnalyticsEvent) {
        /** When using HashRouter, set send_page_view to false to avoid sending dynamic page
         * events. When HashRouter is not used, set to true to avoid duplicated events.
         * */
        console.debug("GA4: config", appConfig.gaTagId, { ...buildAnalyticsEvent(event), send_page_view: false });
        window.gtag("config", appConfig.gaTagId, { ...buildAnalyticsEvent(event), send_page_view: false });
    }

    private intialize() {
        const script = document.createElement("script");
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${appConfig.gaTagId}`;
        document.body.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        window.gtag = function gtag(...args: any[]) {
            window.dataLayer.push(args);
        };
    }
}

function buildAnalyticsEvent(event: AnalyticsEvent) {
    switch (event.name) {
        case "file_download":
            return {
                file_name: event.filename,
            };
        case "page_view":
            return {
                page_location: event.pageLocation,
                page_title: event.pageTitle,
            };
        default:
            return {};
    }
}
