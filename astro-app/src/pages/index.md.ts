import type { APIRoute } from "astro";
import homeSummary from "@/lib/llms-txt/home-summary.md?raw";
import { getSeoConfigForRoute } from "@shared/domain/entities/SeoConfig";
import { serializeHomeMarkdown } from "@/lib/llms-txt/serializers";

export const GET: APIRoute = async () => {
    const { title } = getSeoConfigForRoute("/");
    const body = serializeHomeMarkdown(homeSummary, title);

    return new Response(body, {
        status: 200,
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
    });
};
