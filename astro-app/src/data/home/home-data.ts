import { getGeneralContent } from "@/data/general-content";
import { getCountries } from "@/data/countries";
import type { HomePageContent } from "@shared/domain/entities/HomePageContent";
import type { GeneralContent } from "@shared/domain/entities/GeneralContent";
import { getServerCompositionRoot, getServerD2Api } from "@/infra/composition-root.server";
import { runFuture } from "@/infra/future-bridge";
import { createLogger, startTimer } from "@/lib/logger";
import {
    buildHomeNews,
    buildHomeResources,
    buildMapMarkers,
    type HomeMarkerCountry,
    type HomeResourceState,
} from "./home-resource";
import { downloadHomeResourceImages } from "./home-images";

const log = createLogger("home-data");

export type HomePageData = {
    homePageContent: HomePageContent;
    resources: ReadonlyArray<HomeResourceState>;
    mobileResources: ReadonlyArray<HomeResourceState>;
    news: ReadonlyArray<HomeResourceState>;
    markers: GeoJSON.FeatureCollection<GeoJSON.Point, HomeMarkerCountry>;
    initialMapData: { center: [number, number]; maxZoom: number; minZoom: number; zoom: number };
    generalContent: GeneralContent;
};

export async function getHomePageData(): Promise<HomePageData> {
    const endTimer = startTimer(log, "Home page data fetch");
    const compositionRoot = getServerCompositionRoot();

    const [homePageContent, countries, resources, generalContent] = await Promise.all([
        runFuture(compositionRoot.home.getPageContent.execute(), "home.getPageContent"),
        getCountries(),
        runFuture(
            compositionRoot.resources.get.execute({ isFavouriteHome: true }),
            "resources.get(favouriteHome)",
        ),
        getGeneralContent(),
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
