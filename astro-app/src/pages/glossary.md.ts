import type { APIRoute } from "astro";
import { getSeoConfigForRoute } from "@shared/domain/entities/SeoConfig";
import { getGlossaryPageData } from "@/data/reference-terms/reference-terms-data";
import { serializeGlossaryMarkdown } from "@/lib/llms-txt/serializers";

export const GET: APIRoute = async () => {
    const data = await getGlossaryPageData();
    const { title } = getSeoConfigForRoute("/glossary");
    return new Response(serializeGlossaryMarkdown(data, title), {
        status: 200,
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
    });
};
