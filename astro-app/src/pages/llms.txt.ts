import type { APIRoute } from "astro";
import { getSeoConfigForRoute, defaultSeoConfig } from "@shared/domain/entities/SeoConfig";
import { getGeneralContent, resolveGeneralContentUrls } from "@/data/general-content";
import { serializeLlmsTxt, type LlmsTxtExternalResource, type LlmsTxtPageEntry } from "@/lib/llms-txt/serializers";
import { href } from "@/lib/href";

const PAGE_ROUTES: ReadonlyArray<{ route: string; markdownHref: string }> = [
    { route: "/", markdownHref: "/index.md" },
    { route: "/about", markdownHref: "/about.md" },
    { route: "/methods", markdownHref: "/methods.md" },
    { route: "/area-overview", markdownHref: "/area-overview.md" },
];

export const GET: APIRoute = async () => {
    const generalContent = await getGeneralContent();
    const { abbreviationsUrl, glossaryUrl } = resolveGeneralContentUrls(generalContent);

    const pages: ReadonlyArray<LlmsTxtPageEntry> = PAGE_ROUTES.map(({ route, markdownHref }) => {
        const seo = getSeoConfigForRoute(route);
        return { href: href(markdownHref), title: seo.title, description: seo.description };
    });

    const externalResources: ReadonlyArray<LlmsTxtExternalResource> = [
        { href: abbreviationsUrl, label: "Abbreviations" },
        { href: glossaryUrl, label: "Glossary" },
    ];

    const body = serializeLlmsTxt({
        title: defaultSeoConfig.title,
        summary: defaultSeoConfig.description,
        pages,
        externalResources,
    });

    return new Response(body, {
        status: 200,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
};
