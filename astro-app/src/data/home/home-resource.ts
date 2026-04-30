import type { Country } from "@shared/domain/entities/Country";
import type { Resource } from "@shared/domain/entities/resources/Resource";

/** Fields the home-page map UI reads. Anything else is stripped from the
 * marker payload before it's serialized into the SSR HTML. */
export type HomeMarkerCountry = Pick<
    Country,
    "id" | "name" | "status" | "generalSummary" | "homePageSummary" | "coordinates"
>;

export type HomeResourceState = Readonly<{
    id: string;
    title: string;
    imageOriginal: string;
    date: Date;
    kind: "comparative-analysis" | "country-analysis" | "news" | "multimedia";
    url: string;
    favouriteHomeOrder: number;
    tagLabel: string;
}>;

const RESOURCES_PRIORITY: Record<HomeResourceState["kind"], number> = {
    "comparative-analysis": 1,
    "country-analysis": 2,
    multimedia: 3,
    news: 4,
};

const TAG_LABELS: Record<HomeResourceState["kind"], string> = {
    "comparative-analysis": "Comparative analysis",
    "country-analysis": "Country or area analysis",
    news: "News",
    multimedia: "Multimedia",
};

export function resourceTagHref(kind: HomeResourceState["kind"]): string {
    return `/resources/${kind}`;
}

function resourceUrl(resource: Resource): string {
    switch (resource.kind) {
        case "news":
        case "multimedia":
            return resource.url;
        case "comparative-analysis":
        case "country-analysis":
            return resource.links[0]?.url ?? "";
    }
}

function toHomeResourceState(resource: Resource, order: number): HomeResourceState | null {
    const url = resourceUrl(resource);
    if (!url) return null;
    return {
        id: resource.id,
        title: resource.title,
        imageOriginal: resource.imageOriginal,
        date: resource.date,
        kind: resource.kind,
        url,
        favouriteHomeOrder: order,
        tagLabel: TAG_LABELS[resource.kind],
    };
}

export function buildHomeNews(resources: ReadonlyArray<Resource>): ReadonlyArray<HomeResourceState> {
    return resources
        .flatMap(r => {
            if (r.kind !== "news" || !r.favouriteSection) return [];
            const state = toHomeResourceState(r, r.favouriteSectionOrder);
            return state ? [state] : [];
        })
        .sort((a, b) => a.favouriteHomeOrder - b.favouriteHomeOrder)
        .slice(0, 6);
}

export function buildHomeResources(
    resources: ReadonlyArray<Resource>,
    options: { excludeNews?: boolean } = {},
): ReadonlyArray<HomeResourceState> {
    const byId = resources.reduce((acc, resource) => {
        if (!resource.favouriteHome) return acc;
        if (options.excludeNews && resource.kind === "news") return acc;
        const current = acc.get(resource.id);
        if (!current || RESOURCES_PRIORITY[resource.kind] < RESOURCES_PRIORITY[current.kind]) {
            acc.set(resource.id, resource);
        }
        return acc;
    }, new Map<string, Resource>());

    return Array.from(byId.values())
        .flatMap(r => {
            const state = toHomeResourceState(r, r.favouriteHomeOrder);
            return state ? [state] : [];
        })
        .sort((a, b) => a.favouriteHomeOrder - b.favouriteHomeOrder)
        .slice(0, 6);
}

export function buildMapMarkers(
    countries: ReadonlyArray<Country>,
): GeoJSON.FeatureCollection<GeoJSON.Point, HomeMarkerCountry> {
    return {
        type: "FeatureCollection",
        features: countries.flatMap(country =>
            (country.generalSummary || country.homePageSummary) && country.coordinates
                ? [
                      {
                          type: "Feature" as const,
                          properties: {
                              id: country.id,
                              name: country.name,
                              status: country.status,
                              generalSummary: country.generalSummary,
                              homePageSummary: country.homePageSummary,
                              coordinates: country.coordinates,
                          },
                          geometry: {
                              type: "Point" as const,
                              coordinates: country.coordinates,
                          },
                      },
                  ]
                : [],
        ),
    };
}
