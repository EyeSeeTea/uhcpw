import type { HomePageContent } from "@shared/domain/entities/HomePageContent";
import type { Country } from "@shared/domain/entities/Country";
import type { GeneralContent } from "@shared/domain/entities/GeneralContent";
import type { Resource } from "@shared/domain/entities/resources/Resource";
import { countriesToGeoJson } from "@shared/webapp/components/home/map/utils/countriesToGeoJson";
import { getServerCompositionRoot, getServerD2Api } from "@/infra/composition-root.server";
import { runFuture } from "@/infra/future-bridge";
import { createLogger, startTimer } from "@/lib/logger";
import { downloadHomeResourceImages } from "./home-images";

const log = createLogger("home-data");

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

export type HomePageData = {
    homePageContent: HomePageContent;
    resources: ReadonlyArray<HomeResourceState>;
    mobileResources: ReadonlyArray<HomeResourceState>;
    news: ReadonlyArray<HomeResourceState>;
    markers: GeoJSON.FeatureCollection<GeoJSON.Point, Country>;
    initialMapData: { center: [number, number]; maxZoom: number; minZoom: number; zoom: number };
    generalContent: GeneralContent;
};

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

export function buildHomeNews(resources: ReadonlyArray<Resource>): ReadonlyArray<HomeResourceState> {
    const states: HomeResourceState[] = [];
    for (const resource of resources) {
        if (resource.kind !== "news") continue;
        if (!resource.favouriteSection) continue;
        const url = resourceUrl(resource);
        if (!url) continue;
        states.push({
            id: resource.id,
            title: resource.title,
            imageOriginal: resource.imageOriginal,
            date: resource.date,
            kind: resource.kind,
            url,
            favouriteHomeOrder: resource.favouriteSectionOrder,
            tagLabel: TAG_LABELS[resource.kind],
        });
    }

    return states.sort((a, b) => a.favouriteHomeOrder - b.favouriteHomeOrder).slice(0, 6);
}

export function buildHomeResources(
    resources: ReadonlyArray<Resource>,
    options: { excludeNews?: boolean } = {},
): ReadonlyArray<HomeResourceState> {
    const byId = new Map<string, Resource>();
    for (const resource of resources) {
        if (!resource.favouriteHome) continue;
        if (options.excludeNews && resource.kind === "news") continue;
        const current = byId.get(resource.id);
        if (!current || RESOURCES_PRIORITY[resource.kind] < RESOURCES_PRIORITY[current.kind]) {
            byId.set(resource.id, resource);
        }
    }

    const states: HomeResourceState[] = [];
    for (const resource of byId.values()) {
        const url = resourceUrl(resource);
        if (!url) continue;
        states.push({
            id: resource.id,
            title: resource.title,
            imageOriginal: resource.imageOriginal,
            date: resource.date,
            kind: resource.kind,
            url,
            favouriteHomeOrder: resource.favouriteHomeOrder,
            tagLabel: TAG_LABELS[resource.kind],
        });
    }

    return states.sort((a, b) => a.favouriteHomeOrder - b.favouriteHomeOrder).slice(0, 6);
}

// The home-page CountryPanel only reads {id, name, status, summary, coordinates}.
// We strip the rest (sliderInfo, children tree, parents, flag, longName, etc.)
// before the GeoJSON is serialized into the SSR HTML so the marker payload
// stays small.
function slimCountryForMarker(country: Country): Country {
    return {
        id: country.id,
        name: country.name,
        status: country.status,
        summary: country.summary,
        coordinates: country.coordinates,
        longName: "",
        code: "",
        iso3Code: "",
        parents: [],
        flag: "",
        showCountryFlag: false,
        sliderInfo: {
            gapsSection: { sectionName: "", sourceText: "", content: [] },
            finProtecSection: { sectionName: "", sourceText: "", content: [] },
        },
        isInCountryPage: false,
        currencyCode: "",
    };
}

export function buildMapMarkers(
    countries: ReadonlyArray<Country>,
): GeoJSON.FeatureCollection<GeoJSON.Point, Country> {
    const markerCountries = countries.filter(c => c.summary).map(slimCountryForMarker);
    return countriesToGeoJson(markerCountries);
}

export async function getHomePageData(): Promise<HomePageData> {
    const endTimer = startTimer(log, "Home page data fetch");
    const compositionRoot = getServerCompositionRoot();

    const [homePageContent, countries, resources, generalContent] = await Promise.all([
        runFuture(compositionRoot.home.getPageContent.execute(), "home.getPageContent"),
        runFuture(compositionRoot.countries.get.execute(), "countries.get"),
        runFuture(
            compositionRoot.resources.get.execute({ isFavouriteHome: true }),
            "resources.get(favouriteHome)",
        ),
        runFuture(compositionRoot.general.getContent.execute(), "generalContent.get"),
    ]);

    const homeResources = buildHomeResources(resources);
    const mobileHomeResources = buildHomeResources(resources, { excludeNews: true });
    const homeNews = buildHomeNews(resources);
    const markers = buildMapMarkers(countries);

    const api = getServerD2Api();
    const [
        { resources: resourcesWithImages },
        { resources: mobileResourcesWithImages },
        { resources: newsWithImages },
    ] = await Promise.all([
        downloadHomeResourceImages(api, homeResources),
        downloadHomeResourceImages(api, mobileHomeResources),
        downloadHomeResourceImages(api, homeNews),
    ]);

    endTimer();

    return {
        homePageContent,
        resources: resourcesWithImages,
        mobileResources: mobileResourcesWithImages,
        news: newsWithImages,
        markers,
        initialMapData: {
            center: [13.675063, 51.751569],
            maxZoom: 8,
            minZoom: 2.5,
            zoom: 2.5,
        },
        generalContent,
    };
}
