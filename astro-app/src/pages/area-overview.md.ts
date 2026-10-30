import type { APIRoute } from "astro";
import { getSeoConfigForRoute } from "@shared/domain/entities/SeoConfig";
import { getCountries } from "@/data/countries";
import { buildMapMarkers } from "@/data/home/home-resource";
import { serializeAreaOverviewMarkdown } from "@/lib/llms-txt/serializers";

export const GET: APIRoute = async () => {
    const markers = buildMapMarkers(await getCountries());
    const { title } = getSeoConfigForRoute("/area-overview");
    const body = serializeAreaOverviewMarkdown(markers.features, title);

    return new Response(body, {
        status: 200,
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
    });
};
