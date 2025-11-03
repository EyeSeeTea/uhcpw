import { command, run, string, option } from "cmd-ts";
import path from "path";
import fs from "fs";
import { D2Api } from "../types/d2-api";
import { CountryD2Repository } from "../data/repositories/countries/CountryD2Repository";
import { RegionD2Repository } from "../data/repositories/regions/RegionD2Repository";
import { formatCountryOrRegionParamName } from "../webapp/utils/formatCountryOrRegionParamName";
import { GetCountriesUseCase } from "../domain/usecases/GetCountriesUseCase";
import { GetRegionsUseCase } from "../domain/usecases/region/GetRegionsUseCase";

interface SitemapUrl {
    loc: string;
    lastmod?: string;
    changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
    priority?: number;
}

const currentDate = new Date().toISOString().split("T")[0];

async function getStaticRoutes(): Promise<SitemapUrl[]> {
    return [
        {
            loc: `/`,
            lastmod: currentDate,
            changefreq: "weekly",
            priority: 1.0,
        },
        {
            loc: `/#/about`,
            lastmod: currentDate,
            changefreq: "monthly",
            priority: 0.8,
        },
        {
            loc: `/#/policy-explorer`,
            lastmod: currentDate,
            changefreq: "weekly",
            priority: 0.9,
        },
        {
            loc: `/#/indicator-explorer`,
            lastmod: currentDate,
            changefreq: "weekly",
            priority: 0.9,
        },
        {
            loc: `/#/resources`,
            lastmod: currentDate,
            changefreq: "weekly",
            priority: 0.8,
        },
        {
            loc: `/#/resources/news`,
            lastmod: currentDate,
            changefreq: "weekly",
            priority: 0.7,
        },
        {
            loc: `/#/resources/multimedia`,
            lastmod: currentDate,
            changefreq: "monthly",
            priority: 0.7,
        },
        {
            loc: `/#/resources/country-analysis`,
            lastmod: currentDate,
            changefreq: "monthly",
            priority: 0.7,
        },
        {
            loc: `/#/resources/comparative-analysis`,
            lastmod: currentDate,
            changefreq: "monthly",
            priority: 0.7,
        },
        {
            loc: `/#/methods`,
            lastmod: currentDate,
            changefreq: "monthly",
            priority: 0.6,
        },
    ];
}

async function getDynamicRoutes(baseUrl: string, auth: string): Promise<SitemapUrl[]> {
    const baseRoute: SitemapUrl = {
        loc: `/#/`,
        lastmod: currentDate,
        changefreq: "monthly" as const,
        priority: 0.7,
    };
    try {
        const [username, password] = auth.split(":");
        if (!username || !password) {
            throw new Error("Auth must be in format 'username:password'");
        }

        const api = new D2Api({
            baseUrl,
            backend: "fetch",
            auth: { username, password },
        });

        const countryRepository = new CountryD2Repository(api);
        const regionRepository = new RegionD2Repository(api);
        const getCountriesUseCase = new GetCountriesUseCase(countryRepository);
        const getRegionsUseCase = new GetRegionsUseCase(regionRepository);

        const countriesResult = await getCountriesUseCase.execute().runAsync();
        const regionsResult = await getRegionsUseCase.execute().runAsync();

        const dynamicRoutes: SitemapUrl[] = [
            ...(countriesResult.data ?? []).filter(country => country.isInCountryPage),
            ...(regionsResult.data ?? []).filter(region => region.isInRegionalPage),
        ].map(country => {
            const countryOrRegionParam = formatCountryOrRegionParamName(country.name);
            return {
                ...baseRoute,
                loc: baseRoute.loc + countryOrRegionParam,
            };
        });

        return dynamicRoutes;
    } catch (error) {
        console.error("Error fetching dynamic routes:", error);
        return [];
    }
}

function generateSitemapXml(urls: SitemapUrl[]): string {
    const urlset = urls
        .map(url => {
            const lastmod = url.lastmod ? `\n    <lastmod>${url.lastmod}</lastmod>` : "";
            const changefreq = url.changefreq ? `\n    <changefreq>${url.changefreq}</changefreq>` : "";
            const priority = url.priority !== undefined ? `\n    <priority>${url.priority}</priority>` : "";

            return `  <url>
    <loc>${url.loc}</loc>${lastmod}${changefreq}${priority}
  </url>`;
        })
        .join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>`;
}

function main() {
    const cmd = command({
        name: path.basename(__filename),
        description: "Generate a sitemap.xml",
        args: {
            baseUrl: option({
                type: string,
                long: "base-url",
                short: "b",
                description: "Base URL of the website. Example: https://example.com",
                env: "REACT_APP_DHIS2_BASE_URL",
            }),
            auth: option({
                type: string,
                long: "auth",
                short: "a",
                description: "Authentication credentials in format 'username:password' (required)",
                env: "REACT_APP_DHIS2_AUTH",
            }),
            output: option({
                type: string,
                long: "output",
                short: "o",
                defaultValue: () => path.join(__dirname, "../../public/sitemap.xml"),
                description: "Output path for sitemap.xml file",
            }),
        },
        handler: async args => {
            console.debug("Fetching static routes...");
            const staticRoutes = await getStaticRoutes();

            console.debug("Fetching dynamic routes (countries and regions)...");
            const dynamicRoutes = await getDynamicRoutes(args.baseUrl, args.auth);

            const allRoutes = [...staticRoutes, ...dynamicRoutes];

            const routesWithFullUrls = allRoutes.map(route => ({
                ...route,
                loc: `${args.baseUrl.replace(/\/+$/, "")}${route.loc.startsWith("/") ? route.loc : `/${route.loc}`}`,
            }));
            const sitemapContent = generateSitemapXml(routesWithFullUrls);

            const outputDir = path.dirname(args.output);
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }
            fs.writeFileSync(args.output, sitemapContent, "utf-8");
            console.debug(`Sitemap successfully generated at: ${args.output}`);
            console.debug(
                `Total URLs: ${allRoutes.length} (${staticRoutes.length} static + ${dynamicRoutes.length} dynamic)`
            );
        },
    });

    run(cmd, process.argv.slice(2));
}

main();
