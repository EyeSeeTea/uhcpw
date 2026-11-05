import type { APIRoute } from "astro";
import { getSeoConfigForRoute, defaultSeoConfig } from "@shared/domain/entities/SeoConfig";
import { serializeLlmsTxt, type LlmsTxtPageEntry } from "@/lib/llms-txt/serializers";
import { href } from "@/lib/href";

const PAGE_ROUTES: ReadonlyArray<{ route: string; markdownHref: string }> = [
    { route: "/", markdownHref: "/index.md" },
    { route: "/about", markdownHref: "/about.md" },
    { route: "/methods", markdownHref: "/methods.md" },
    { route: "/glossary", markdownHref: "/glossary.md" },
    { route: "/abbreviations", markdownHref: "/abbreviations.md" },
    { route: "/area-overview", markdownHref: "/area-overview.md" },
];

export const GET: APIRoute = async () => {
    const pages: ReadonlyArray<LlmsTxtPageEntry> = PAGE_ROUTES.map(({ route, markdownHref }) => {
        const seo = getSeoConfigForRoute(route);
        return { href: href(markdownHref), title: seo.title, description: seo.description };
    });

    const body = serializeLlmsTxt({
        title: defaultSeoConfig.title,
        summary: defaultSeoConfig.description,
        pages,
    });

    return new Response(body, {
        status: 200,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
};
