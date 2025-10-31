import { command, run, string, option } from "cmd-ts";
import path from "path";
import fs from "fs";

interface SitemapUrl {
    loc: string;
    lastmod?: string;
    changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
    priority?: number;
}

const currentDate = new Date().toISOString().split("T")[0];

const routes: SitemapUrl[] = [
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
        loc: `/#/country-page`,
        lastmod: currentDate,
        changefreq: "monthly",
        priority: 0.7,
    },
    {
        loc: `/#/regional-page`,
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
            output: option({
                type: string,
                long: "output",
                short: "o",
                defaultValue: () => path.join(__dirname, "../../public/sitemap.xml"),
                description: "Output path for sitemap.xml file",
            }),
        },
        handler: async args => {
            const routesWithFullUrls = routes.map(route => ({
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
            console.debug(`Total URLs: ${routes.length}`);
        },
    });

    run(cmd, process.argv.slice(2));
}

main();
