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

export interface GoogleAnalyticsRepositoryOptions {
    /**
     * When true, skip the initial `gtag('config', ...)` call that the repository
     * would normally issue on first construction. Useful when the host app has
     * already emitted its own `config` call (e.g., from a server-rendered layout
     * snippet in an MPA) and does not want the repository to override it with
     * `send_page_view: false`.
     */
    skipInitialConfig?: boolean;
}

/* Set accessToConsole key in localStorage to see debug logs */
export class GoogleAnalyticsRepository implements AnalyticsRepository {
    private analytics?: Analytics;

    constructor(private options: GoogleAnalyticsRepositoryOptions = {}) {}

    send(event: AnalyticsEvent) {
        if (!this.analytics) this.analytics = new Analytics(this.options);
        this.analytics.sendAnalytics(event);
    }
}

type MappedAnalyticsEvent = ReturnType<typeof buildAnalyticsEvent>;

class Analytics {
    initialized = false;
    queue: MappedAnalyticsEvent[] = [];
    accessToConsole = false;

    constructor(private options: GoogleAnalyticsRepositoryOptions) {
        this.accessToConsole = localStorage.getItem("accessToConsole") === "true";

        if (!window.gtag) this.intialize().then(() => this.queue.forEach(e => this.sendMappedAnalytics(e)));
        else {
            this.initialized = true;
            if (!this.options.skipInitialConfig) this.setAnalyticsConfig();
        }
    }

    sendAnalytics(event: AnalyticsEvent) {
        const mappedEvent = buildAnalyticsEvent(event);
        if (this.accessToConsole) console.debug("GA4: send analytics event", event.name, mappedEvent);
        if (!this.initialized) {
            this.queue.push(mappedEvent);
            return;
        }
        this.sendMappedAnalytics(mappedEvent);
    }

    private sendMappedAnalytics(mappedEvent: MappedAnalyticsEvent) {
        const { name, ...rest } = mappedEvent;
        window.gtag("event", name, rest);
    }

    setAnalyticsConfig() {
        /** Manual page view tracking is used (explicit sendPageView() calls per page component),
         * so send_page_view remains false to avoid duplicate events. */
        const configParams: Record<string, unknown> = {
            send_page_view: false,
        };

        if (isInternalTraffic()) configParams.traffic_type = "internal";

        if (this.accessToConsole) console.debug("GA4: config", appConfig.gaTagId, configParams);

        window.gtag("config", appConfig.gaTagId, configParams);
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
                if (!this.options.skipInitialConfig) this.setAnalyticsConfig();
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
                name: event.name,
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
                name: event.name,
                href: event.href,
                text: event.text,
            } as const;
        case "indicator_explorer_summary":
            return {
                name: event.name,
                indicator: event.indicator,
                all_countries_selected: booleanToYesNo(event.allCountriesSelected),
                all_years_selected: booleanToYesNo(event.allYearsSelected),
                years: event.yearsSelected.join(", "),
                most_recent_year_selected: event.yearsSelected.sort().reverse()[0],
                eu_27_average_selected: booleanToYesNo(event.eu27average),
                number_of_countries: event.numberOfCountries,
            } as const;
        case "indicator_explorer":
            return {
                name: event.name,
                indicator: event.indicator,
                country: event.country,
                year: event.year,
            } as const;
        case "policy_explorer_summary":
            return {
                name: event.name,
                number_of_policy_categories: event.numberOfCategories,
                number_of_policy_subcategories: event.numberOfSubcategories,
                all_countries_selected: booleanToYesNo(event.allCountriesSelected),
                number_of_countries: event.numberOfCategories,
                year: event.year,
            } as const;
        case "policy_explorer_category":
            return {
                name: event.name,
                policy_category: event.category,
                policy_subcategory: event.subcategory,
                country: event.country,
                year: event.year,
            } as const;
        default:
            return {};
    }
}

function booleanToYesNo(value: boolean) {
    return value ? "yes" : "no";
}

function isInternalTraffic(): boolean {
    try {
        return window.localStorage.getItem("uhcpw_internal") === "1";
    } catch {
        return false;
    }
}
