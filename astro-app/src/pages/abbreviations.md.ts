import type { APIRoute } from "astro";
import { getSeoConfigForRoute } from "@shared/domain/entities/SeoConfig";
import { getAbbreviationsPageData } from "@/data/reference-terms/reference-terms-data";
import { serializeAbbreviationsMarkdown } from "@/lib/llms-txt/serializers";

export const GET: APIRoute = async () => {
    const data = await getAbbreviationsPageData();
    const { title } = getSeoConfigForRoute("/abbreviations");
    return new Response(serializeAbbreviationsMarkdown(data, title), {
        status: 200,
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
    });
};
