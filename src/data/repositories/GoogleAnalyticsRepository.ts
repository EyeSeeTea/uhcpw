import _ from "lodash";
import { appConfig } from "../../app-config";
import { AnalyticsEvent, getCurrentPageLocation } from "../../domain/entities/AnalyticsEvent";
import { AnalyticsRepository } from "../../domain/repositories/AnalyticsRepository";

declare global {
    interface Window {
        gtag: (...args: any[]) => void;
        dataLayer: any[];
    }
}

/* Set accessToConsole key in localStorage to see debug logs */
export class GoogleAnalyticsRepository implements AnalyticsRepository {
    private analytics?: Analytics;

    send(event: AnalyticsEvent) {
        if (!this.analytics) this.analytics = new Analytics();
        this.analytics.sendAnalytics(event);
    }
}

class Analytics {
    initialized = false;
    queue: AnalyticsEvent[] = [];
    accessToConsole = false;

    constructor() {
        this.accessToConsole = localStorage.getItem("accessToConsole") === "true";

        if (!window.gtag) this.intialize().then(() => this.queue.forEach(e => this.sendAnalytics(e)));
        else {
            this.initialized = true;
            this.setAnalyticsConfig();
        }
    }

    sendAnalytics(event: AnalyticsEvent) {
        if (!this.initialized) {
            this.queue.push(event);
            return;
        }

        if (this.accessToConsole) console.debug("GA4: send analytics event", event.name, buildAnalyticsEvent(event));

        const mappedEvent = buildAnalyticsEvent(event);
        const { name, ...rest } = mappedEvent;

        window.gtag("event", name, rest);
    }

    setAnalyticsConfig() {
        /** When using HashRouter, set send_page_view to false to avoid sending dynamic page
         * events. When HashRouter is not used, set to true to avoid duplicated events.
         * */
        if (this.accessToConsole)
            console.debug("GA4: config", appConfig.gaTagId, {
                page_title: "Config",
                page_location: window.location.pathname,
                send_page_view: false,
            });

        window.gtag("config", appConfig.gaTagId, {
            page_title: "Config",
            page_location: window.location.pathname,
            send_page_view: false,
        });
    }

    private async intialize() {
        const script = document.createElement("script");
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${appConfig.gaTagId}`;
        document.body.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        window.gtag = function gtag() {
            // eslint-disable-next-line prefer-rest-params
            window.dataLayer.push(arguments);
        };

        await new Promise<void>((resolve, reject) => {
            script.onload = () => {
                if (this.accessToConsole) console.debug("GA4: script loaded");
                window.gtag("js", new Date());
                this.setAnalyticsConfig();
                this.initialized = true;
                resolve();
            };
            script.onerror = reject;
        });
    }
}

function buildAnalyticsEvent(event: AnalyticsEvent) {
    switch (event.name) {
        case "file_download":
            return {
                name: event.name,
                page_title: event.pageTitle,
                content_type: event.contentType,
                content_group: event.contentGroup,
                content_id: event.contentId,
            } as const;
        case "page_view":
            return {
                name: event.name,
                page_location: event.pageLocation,
                page_title: event.pageTitle,
            } as const;
        case "country_page_view":
            return {
                name: "page_view",
                page_title: event.pageTitle,
                page_location: getCurrentPageLocation(),
                selected_country: event.country,
            } as const;
        case "resource_kind_page_view":
            return {
                name: "page_view",
                page_title: event.pageTitle,
                page_location: getCurrentPageLocation(),
                category: _.startCase(event.category),
            } as const;
        case "resource":
            return {
                name: "resource",
                page_title: event.pageTitle,
                page_location: getCurrentPageLocation(),
                category: _.startCase(event.category),
                resource_name: event.resourceName,
                resource_theme: event.theme,
                year: event.year,
                lang: event.language,
                country: event.country,
            } as const;
        case "external_link":
            return {
                name: "external_link",
                href: event.href,
                text: event.text,
            } as const;
        default:
            return {};
    }
}
