import type { APIRoute } from "astro";
import { getSeoConfigForRoute } from "@shared/domain/entities/SeoConfig";
import { getHomePageData } from "@/data/home/home-data";
import { serializeAreaOverviewMarkdown } from "@/lib/llms-txt/serializers";

export const GET: APIRoute = async () => {
    const data = await getHomePageData();
    const { title } = getSeoConfigForRoute("/area-overview");
    const body = serializeAreaOverviewMarkdown(data.markers.features, title);

    return new Response(body, {
        status: 200,
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
    });
};
