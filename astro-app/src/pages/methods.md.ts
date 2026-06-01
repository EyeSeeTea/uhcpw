import type { APIRoute } from "astro";
import { getSeoConfigForRoute } from "@shared/domain/entities/SeoConfig";
import { getMethodsPageData } from "@/data/methods/methods-data";
import { serializeMethodsMarkdown } from "@/lib/llms-txt/serializers";

export const GET: APIRoute = async () => {
    const data = await getMethodsPageData();
    const { title } = getSeoConfigForRoute("/methods");
    const body = serializeMethodsMarkdown(data, title);

    return new Response(body, {
        status: 200,
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
    });
};
