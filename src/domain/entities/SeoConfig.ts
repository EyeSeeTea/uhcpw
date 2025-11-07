export interface SeoConfig {
    title: string;
    description: string;
    image?: string;
}

export interface SeoRouteConfig {
    [route: string]: SeoConfig;
}

export const defaultSeoConfig: SeoConfig = {
    title: "UHC Watch",
    description:
        "UHC Watch monitors unmet need, financial hardship, spending on health and coverage policy in Europe and Central Asia",
    image: "https://apps.who.int/dhis2/uhcwatch/uhcw.png",
};

export const seoRouteConfigs: SeoRouteConfig = {
    "/about": {
        title: "UHC Watch - About",
        description:
            "Find out more about the team behind UHC Watch: the European Financial Protection network and the WHO Barcelona Office for Health Systems Financing",
    },
    "/policy-explorer": {
        title: "UHC Watch - Policy Explorer",
        description:
            "UHC watch has up-to-date information on population coverage, service coverage, user charges and voluntary health insurance and changes in coverage policy over time",
    },
    "/indicator-explorer": {
        title: "UHC Watch - Indicator Explorer",
        description:
            "UHC Watch has over 50 indicators of financial hardship, unmet need for health care and spending on health across countries.",
    },
    "/resources": {
        title: "UHC Watch - Resources",
        description:
            "Find on UHC Watch over 150 country-specific and comparative reports on health financing, multimedia files and news articles in several languages.",
    },
    "/resources/news": {
        title: "UHC Watch - News",
        description:
            "Find on UHC watch multimedia (videos and presentations) insights on financial hardship, unmet need, access barriers and health spending across Europe and Central Asia.",
    },
    "/resources/multimedia": {
        title: "UHC Watch - Multimedia",
        description:
            "Find on UHC watch multimedia (videos and presentations) insights on financial hardship, unmet need, access barriers and health spending across Europe and Central Asia.",
    },
    "/resources/country-analysis": {
        title: "UHC Watch - Country analysis",
        description:
            "Find on UHC Watch country-specific reports on financial protection, health financing, economy, resilience, spending and voluntary health insurance",
    },
    "/resources/comparative-analysis": {
        title: "UHC Watch - Comparative analysis",
        description:
            "Find on UHC Watch comparative analysis on financial protection, health financing, economy, resilience, spending and voluntary health insurance",
    },
    "/methods": {
        title: "UHC Watch - Methods",
        description:
            "Explore how UHC Watch monitors financial hardship, unmet need, coverage policy, and health spending to assess progress toward universal health coverage.",
    },
};

/**
 * Get SEO configuration for a specific route
 * Falls back to default if route not found
 */
export function getSeoConfigForRoute(pathname: string): SeoConfig {
    const cleanPath = pathname.replace("#", "");

    if (seoRouteConfigs[cleanPath]) {
        return { ...defaultSeoConfig, ...seoRouteConfigs[cleanPath] };
    }
    // Try to match parent route
    const parentPath = cleanPath.split("/").slice(0, -1).join("/") || "/";
    if (seoRouteConfigs[parentPath]) {
        return { ...defaultSeoConfig, ...seoRouteConfigs[parentPath] };
    }
    return defaultSeoConfig;
}
