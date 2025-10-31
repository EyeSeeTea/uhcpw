export interface SeoConfig {
    title: string;
    description: string;
    image?: string;
}

export interface SeoRouteConfig {
    [route: string]: SeoConfig;
}

export const defaultSeoConfig: SeoConfig = {
    title: "UHC watch – tracking progress on affordable access to health care",
    description:
        "UHC watch monitors unmet need, financial hardship, spending on health and coverage policy in Europe and central Asia",
    image: "/uhcw-home-logo.png",
};

export const seoRouteConfigs: SeoRouteConfig = {
    "/about": {
        title: "About - UHC watch",
        description: "About us",
    },
    "/policy-explorer": {
        title: "Policy Explorer - UHC watch",
        description: "Explore health policies",
    },
    "/indicator-explorer": {
        title: "Indicator Explorer - UHC watch",
        description: "Discover and analyze key health indicators related to universal health coverage ",
    },
    "/country-page": {
        title: "Country Profiles - UHC watch",
        description: "Access detailed country profiles with data on universal health coverage",
    },
    "/regional-page": {
        title: "Regional Analysis - UHC watch",
        description: "Explore regional analysis and comparisons of universal health coverage indicators ",
    },
    "/resources": {
        title: "Resources - UHC watch",
        description: "Access publications, multimedia, news, and analysis on universal health coverage",
    },
    "/resources/news": {
        title: "News Resources - UHC watch",
        description: "Stay updated with the latest news and updates on universal health coverage",
    },
    "/resources/multimedia": {
        title: "Multimedia Resources - UHC watch",
        description:
            "Explore multimedia content including videos, infographics, and interactive content on universal health coverage.",
    },
    "/resources/country-analysis": {
        title: "Country Analysis Resources - UHC watch",
        description: "Access in-depth country analysis and reports on universal health coverage implementation",
    },
    "/resources/comparative-analysis": {
        title: "Comparative Analysis Resources - UHC watch",
        description: "Compare health systems and universal health coverage progress across countries",
    },
    "/methods": {
        title: "Methodology - UHC watch",
        description:
            "Learn about the methodologies, data sources, and indicators used to assess universal health coverage",
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
