import type { APIRoute } from "astro";
import { getSeoConfigForRoute } from "@shared/domain/entities/SeoConfig";
import { getAboutPageData } from "@/data/about/about-data";
import { serializeAboutMarkdown } from "@/lib/llms-txt/serializers";

export const GET: APIRoute = async () => {
    const data = await getAboutPageData();
    const { title } = getSeoConfigForRoute("/about");
    const body = serializeAboutMarkdown(data, title);

    return new Response(body, {
        status: 200,
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
    });
};
