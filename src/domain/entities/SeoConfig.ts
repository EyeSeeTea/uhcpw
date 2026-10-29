export interface SeoConfig {
    title: string;
    description: string;
    image?: string;
}

export interface SeoRouteConfig {
    [route: string]: SeoConfig;
}

export const defaultSeoConfig: SeoConfig = {
    title: "UHC Watch: tracking affordable access to health care",
    description:
        "UHC Watch monitors progress on universal health coverage tracking unmet need, financial hardship, spending on health and coverage policy in Europe & Central Asia",
    image: "https://apps.who.int/dhis2/uhcwatch/uhcw.png",
};

export const seoRouteConfigs: SeoRouteConfig = {
    "/about": {
        title: "About the WHO Barcelona Office work & the UHC Watch network",
        description:
            "Find out more about the team analysing the evidence that feeds UHC Watch: the UHC Watch network and the WHO Barcelona Office for Health Systems Financing team",
    },
    "/policy-explorer": {
        title: "UHC Watch Policy Explorer: Information on coverage policy",
        description:
            "UHC watch has up-to-date information on population coverage, service coverage, user charges and voluntary health insurance and changes in coverage policy",
    },
    "/indicator-explorer": {
        title: "UHC Watch Indicator Explorer: UHC & health financing data",
        description:
            "UHC Watch has over 50 indicators of financial hardship, unmet need for health care and spending on health across countries.",
    },
    "/resources": {
        title: "UHC Watch resources: financial protection & health financing",
        description:
            "Find on UHC Watch over 200 country-specific and comparative reports on health financing, multimedia files and news articles in several languages.",
    },
    "/resources/news": {
        title: "UHC Watch news: financial protection & health financing",
        description:
            "Read the latest news on financial protection, health financing, coverage policy and affordable access to health care across Europe and Central Asia.",
    },
    "/resources/multimedia": {
        title: "UHC Watch multimedia: financial protection & health financing",
        description:
            "Find on UHC Watch multimedia insights on financial hardship, unmet need, access barriers and health spending across Europe and Central Asia.",
    },
    "/resources/country-analysis": {
        title: "UHC Watch country analysis: financial protection & health financing",
        description:
            "Find on UHC Watch country-specific reports on financial protection, health financing, economy, resilience, spending and voluntary health insurance",
    },
    "/resources/comparative-analysis": {
        title: "UHC Watch comparative analysis: financial protection & health financing",
        description:
            "Find on UHC Watch comparative analysis on financial protection, health financing, economy, resilience, spending and voluntary health insurance",
    },
    "/methods": {
        title: "UHC Watch methods: how do we monitor progress towards UHC?",
        description:
            "Explore how UHC Watch monitors financial hardship, unmet need, coverage policy, and health spending to assess progress toward universal health coverage.",
    },
    "/area-overview": {
        title: "UHC Watch - Area overview",
        description: "Financial-protection status and summary for every country and area tracked by UHC Watch.",
    },
};

/**
 * Returns SEO configuration for a root-relative route, defaulting when absent.
 * Pass `basePath` when `pathname` includes a deployment subpath.
 */
export function getSeoConfigForRoute(pathname: string, basePath = "/"): SeoConfig {
    let cleanPath = pathname.replace("#", "");
    const normalizedBase = basePath.replace(/^\/+|\/+$/g, "");

    if (normalizedBase) {
        const base = `/${normalizedBase}`;
        if (cleanPath === base) {
            cleanPath = "/";
        } else if (cleanPath.startsWith(`${base}/`)) {
            cleanPath = cleanPath.slice(base.length);
        }
    }

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
