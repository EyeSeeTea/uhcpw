import {
    BasicResource,
    ComparativeAnalysis,
    CountryAnalysis,
    Multimedia,
    News,
} from "../../../../domain/entities/resources/Resource";
import { getD2APiFromInstance } from "../../../../utils/d2-api";
import { MockWebServer } from "../../../../utils/MockWebServer";
import { Instance } from "../../../entities/Instance";
import {
    FavoriteResources,
    ResourceD2Repository,
    resourceDataElements,
    resourcesProgram,
} from "../ResourceD2Repository";
import comparativeAnalysis from "./data/ComparativeAnalysis.json";
import news from "./data/News.json";
import multimedia from "./data/Multimedia.json";
import countryAnalysis from "./data/CountryAnalysis.json";
import favoritesResponse from "./data/favoritesResponse.json";
import favoritesResources from "./data/favoritesResources.json";

const mockWebServer = new MockWebServer();
const api = getD2APiFromInstance(new Instance({ url: "/" }));
const resourceRepository = new ResourceD2Repository(api);

describe("Resource repository", () => {
    beforeAll(() => mockWebServer.start());
    afterEach(() => mockWebServer.resetHandlers());
    afterAll(() => mockWebServer.close());

    describe("should send expected parameter", () => {
        it("program", async () => {
            givenFavoritesResources();
            givenAComparativeAnalysis();

            await resourceRepository.get({ category: "comparative-analysis" }).runAsync();

            expect(mockWebServer.lastRequest?.params.get("program")).toBe(resourcesProgram);
        });

        it("theme in filter", async () => {
            givenFavoritesResources();
            givenAComparativeAnalysis();

            await resourceRepository
                .get({ category: "comparative-analysis", theme: "Financial Protection" })
                .runAsync();

            expect(mockWebServer.lastRequest?.params.get("filter")).toContain(
                `${resourceDataElements.theme}:like:Financial Protection`
            );
        });
        it("searchTerm in filter", async () => {
            givenFavoritesResources();
            givenAComparativeAnalysis();

            await resourceRepository.get({ category: "comparative-analysis", searchTerm: "can" }).runAsync();

            expect(mockWebServer.lastRequest?.params.get("filter")).toContain(`${resourceDataElements.title}:like:can`);
        });
        it("start date and end date in filter", async () => {
            givenFavoritesResources();
            givenAComparativeAnalysis();

            await resourceRepository.get({ category: "comparative-analysis", years: ["2020", "2022"] }).runAsync();

            expect(mockWebServer.lastRequest?.params.get("startDate")).toBe("2020-01-01");
            expect(mockWebServer.lastRequest?.params.get("endDate")).toBe("2022-12-31");
        });

        it("if isFavouriteHome true then has eventIds in event filter", async () => {
            const favoriteResources = givenFavoritesResources();
            givenAComparativeAnalysis();

            await resourceRepository.get({ category: "comparative-analysis", isFavouriteHome: true }).runAsync();
            const favoriteHomeResourcesIds = favoriteResources.homePage.map(favorite => favorite.resourceId);

            expect(mockWebServer.lastRequest?.params.get("event")).toContain(favoriteHomeResourcesIds.join(";"));
        });

        it("if isFavouriteHome false then event filter is undefined", async () => {
            givenFavoritesResources();
            givenAComparativeAnalysis();

            await resourceRepository.get({ category: "comparative-analysis", isFavouriteHome: false }).runAsync();

            expect(mockWebServer.lastRequest?.params.get("event")).toBeNull();
        });

        it("order in filter", async () => {
            givenFavoritesResources();
            givenAComparativeAnalysis();

            await resourceRepository.get({ category: "comparative-analysis" }).runAsync();

            expect(mockWebServer.lastRequest?.params.get("order")).toContain("eventDate:desc");
        });

        it("skipPaging equal to true if count is not passed", async () => {
            givenFavoritesResources();
            givenAComparativeAnalysis();

            await resourceRepository.get({ category: "comparative-analysis" }).runAsync();

            expect(mockWebServer.lastRequest?.params.get("skipPaging")).toContain("true");
        });
        it("skipPaging equal to false if count is passed", async () => {
            givenFavoritesResources();
            givenAComparativeAnalysis();

            await resourceRepository.get({ category: "comparative-analysis", pageSize: 6 }).runAsync();

            expect(mockWebServer.lastRequest?.params.get("skipPaging")).toContain("false");
        });
        it("pageSize equal to count", async () => {
            givenFavoritesResources();
            givenAComparativeAnalysis();

            await resourceRepository.get({ category: "comparative-analysis", pageSize: 6 }).runAsync();

            expect(mockWebServer.lastRequest?.params.get("pageSize")).toContain("6");
        });
    });

    describe("Comparative analysis", () => {
        it("should return comparative analysis properly", async () => {
            givenFavoritesResources();
            givenAComparativeAnalysis();

            const response = await resourceRepository.get({ category: "comparative-analysis" }).runAsync();

            const comparativeAnalysisItems = (response.data || []) as ComparativeAnalysis[];

            verifyComparativeAnalysis(comparativeAnalysisItems[0]);
        });
        it("should send expected filter for comparative-analysis", async () => {
            givenFavoritesResources();
            givenAComparativeAnalysis();

            await resourceRepository.get({ category: "comparative-analysis" }).runAsync();

            expect(mockWebServer.lastRequest?.params.get("filter")).toBe(
                `${resourceDataElements.comparativeAnalysisCategory}:eq:true`
            );
        });
    });
    describe("News", () => {
        it("should return news properly", async () => {
            givenFavoritesResources();
            givenANews();

            const response = await resourceRepository.get({ category: "news" }).runAsync();

            const news = (response.data || []) as News[];

            verifyNews(news[0]);
        });
        it("should send expected filter for news", async () => {
            givenFavoritesResources();
            givenANews();

            await resourceRepository.get({ category: "news" }).runAsync();

            expect(mockWebServer.lastRequest?.params.get("filter")).toBe(
                `${resourceDataElements.newsCategory}:eq:true`
            );
        });
    });
    describe("Multimedia", () => {
        it("should return multimedia properly", async () => {
            givenFavoritesResources();
            givenAMultimedia();

            const response = await resourceRepository.get({ category: "multimedia" }).runAsync();

            const multimedia = (response.data || []) as Multimedia[];

            verifyMultimedia(multimedia[0]);
        });
        it("should send expected filter for multimedia", async () => {
            givenFavoritesResources();
            givenAMultimedia();

            await resourceRepository.get({ category: "multimedia" }).runAsync();

            expect(mockWebServer.lastRequest?.params.get("filter")).toBe(
                `${resourceDataElements.multimediaCategory}:eq:true`
            );
        });
    });
    describe("Country Analysis", () => {
        it("should return country analysis properly", async () => {
            givenFavoritesResources();
            givenACountryAnalysis();

            const response = await resourceRepository.get({ category: "country-analysis" }).runAsync();

            const countryAnalysis = (response.data || []) as CountryAnalysis[];

            verifyCountryAnalysis(countryAnalysis[0]);
        });
        it("should send expected filter for multimedia", async () => {
            givenFavoritesResources();
            givenACountryAnalysis();

            await resourceRepository.get({ category: "country-analysis" }).runAsync();

            expect(mockWebServer.lastRequest?.params.get("filter")).toBe(
                `${resourceDataElements.countryAnalysisCategory}:eq:true`
            );
        });
    });

    describe("isFavouriteSection", () => {
        it("when isFavouriteSection is true in filter then should return all favouriteSection resources", async () => {
            givenFavoritesResources();
            givenAComparativeAnalysis();

            const response = await resourceRepository
                .get({ category: "comparative-analysis", isFavouriteSection: true })
                .runAsync();

            const comparativeAnalysisItems = (response.data || []) as ComparativeAnalysis[];

            verifyFavouriteSectionResources(comparativeAnalysisItems);
        });
    });
});

function givenAComparativeAnalysis() {
    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: "/api/events",
            httpStatusCode: 200,
            response: req => {
                const program = req.url.searchParams.get("program");

                if (program === "QD9npLUMvCG") {
                    return favoritesResponse;
                }

                if (program === "wWo0lhm5GsY") {
                    return comparativeAnalysis;
                }

                return [];
            },
        },
    ]);
}

function givenANews() {
    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: "/api/events",
            httpStatusCode: 200,
            response: req => {
                const program = req.url.searchParams.get("program");

                if (program === "QD9npLUMvCG") {
                    return favoritesResponse;
                }

                if (program === "wWo0lhm5GsY") {
                    return news;
                }

                return [];
            },
        },
    ]);
}

function givenAMultimedia() {
    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: "/api/events",
            httpStatusCode: 200,
            response: req => {
                const program = req.url.searchParams.get("program");

                if (program === "QD9npLUMvCG") {
                    return favoritesResponse;
                }

                if (program === "wWo0lhm5GsY") {
                    return multimedia;
                }

                return [];
            },
        },
    ]);
}

function givenACountryAnalysis() {
    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: "/api/events",
            httpStatusCode: 200,
            response: req => {
                const program = req.url.searchParams.get("program");

                if (program === "QD9npLUMvCG") {
                    return favoritesResponse;
                }

                if (program === "wWo0lhm5GsY") {
                    return countryAnalysis;
                }

                return [];
            },
        },
    ]);
}

function givenFavoritesResources(): FavoriteResources {
    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: `/api/events?program=QD9npLUMvCG`,
            httpStatusCode: 200,
            response: favoritesResources,
        },
    ]);

    return favoritesResources;
}

function verifyComparativeAnalysis(comparativeAnalysis?: ComparativeAnalysis) {
    if (!comparativeAnalysis) fail("Comparative analysis is undefined");

    expect(comparativeAnalysis.kind).toBe("comparative-analysis");
    expect(comparativeAnalysis.imageOriginal).toContain(
        "//api/events/files?dataElementUid=uund7zjS1Yt&eventUid=ESI1B0zxHfk"
    );
    expect(comparativeAnalysis.title).toBe(
        "Can people afford to pay for health care? New evidence on financial protection in Europe: summary"
    );
    expect(comparativeAnalysis.theme).toBe("Financial Protection");

    expect(comparativeAnalysis.date.toISOString()).toBe(new Date("2024-04-02T00:00:00.000").toISOString());

    const expectedLinks = [
        {
            url: "https://apps.who.int/iris/handle/10665/345512",
            language: "English",
        },
    ];

    expect(comparativeAnalysis.relatedCountries).toStrictEqual(["KwgjnBBpe5b", "DVnpk4xiXGJ"]);

    comparativeAnalysis.links.forEach((link, index) => {
        const expectedLink = expectedLinks[index];

        expect(link.language).toBe(expectedLink?.language);
        expect(link.url).toBe(expectedLink?.url);
    });

    expect(comparativeAnalysis.favouriteSection).toBe(true);
    expect(comparativeAnalysis.favouriteSectionOrder).toBe(3);
    verifyFavouriteHome(comparativeAnalysis, 1);
}

function verifyNews(newsItem?: News) {
    if (!newsItem) fail("News is undefined");

    expect(newsItem.kind).toBe("news");
    expect(newsItem.imageOriginal).toContain("//api/events/files?dataElementUid=uund7zjS1Yt&eventUid=ckY8Z4ZmTDe");
    expect(newsItem.title).toBe(
        "New WHO report outlines concrete steps to make health care more accessible for people in Ukraine"
    );
    expect(newsItem.url).toBe(
        "https://www.who.int/europe/news/item/15-06-2023-new-who-report-outlines-concrete-steps-to-make-health-care-more-accessible-for-people-in-ukraine"
    );
    expect(newsItem.date.toISOString()).toBe(new Date("2023-06-15T00:00:00.000").toISOString());

    expect(newsItem.favouriteSection).toBe(true);
    expect(newsItem.favouriteSectionOrder).toBe(1);
    verifyFavouriteHome(newsItem, 2);
}

function verifyMultimedia(multimediaItem?: Multimedia) {
    if (!multimediaItem) fail("Multimedia is undefined");

    expect(multimediaItem.kind).toBe("multimedia");
    expect(multimediaItem.imageOriginal).toContain(
        "//api/events/files?dataElementUid=uund7zjS1Yt&eventUid=gGIXHvLl5Wl"
    );
    expect(multimediaItem.title).toBe("Financial protection in Belgium");
    expect(multimediaItem.url).toBe(
        "https://who.canto.global/pdfviewer/viewer/viewer.html?share=share%2Calbum%2CGIAIK&column=document&id=gh0m908lst5073jitb2pe52a7f&suffix=pdf&print=1"
    );

    expect(multimediaItem.date.toISOString()).toBe(new Date("2023-01-01T00:00:00.000").toISOString());

    expect(multimediaItem.theme).toBe("Financial Protection");

    expect(multimediaItem.favouriteSection).toBe(true);
    expect(multimediaItem.favouriteSectionOrder).toBe(1);
    verifyFavouriteHome(multimediaItem, 6);
}

function verifyCountryAnalysis(countryAnalysis?: CountryAnalysis) {
    if (!countryAnalysis) fail("countryAnalysis is undefined");

    expect(countryAnalysis.kind).toBe("country-analysis");
    expect(countryAnalysis.imageOriginal).toContain(
        "//api/events/files?dataElementUid=uund7zjS1Yt&eventUid=qgw0lMQo87H"
    );
    expect(countryAnalysis.title).toBe(
        "Can people afford to pay for health care? New evidence on financial protection in Belgium. Summary."
    );
    expect(countryAnalysis.theme).toBe("Financial Protection");
    expect(countryAnalysis.date.toISOString()).toBe(new Date("2023-05-15T00:00:00.000").toISOString());

    const expectedLinks = [
        {
            url: "https://who.canto.global/pdfviewer/viewer/viewer.html?share=share%2Calbum%2CGIAIK&column=document&id=r8a91mnr011up8h6h8jedtn841&suffix=pdf&print=1",
            language: "English",
        },
        {
            url: "https://who.canto.global/pdfviewer/viewer/viewer.html?share=share%2Calbum%2CGIAIK&column=document&id=2k57ep0md925h16799htajrr3c&suffix=pdf&print=1",
            language: "Français",
        },
    ];

    countryAnalysis.links.forEach((link, index) => {
        const expectedLink = expectedLinks[index];

        expect(link.language).toBe(expectedLink?.language);
        expect(link.url).toBe(expectedLink?.url);
    });

    expect(countryAnalysis.countryId).toBe("KwgjnBBpe5b");

    expect(countryAnalysis.favouriteSection).toBe(false);
    expect(countryAnalysis.favouriteSectionOrder).toBe(0);
    verifyFavouriteHome(countryAnalysis, 4);
}

function verifyFavouriteHome(item?: BasicResource, expectedOrder = 0) {
    if (!item) fail("Resource is undefined");

    expect(item.favouriteHome).toBe(true);
    expect(item.favouriteHomeOrder).toBe(expectedOrder);
}

function verifyFavouriteSectionResources(resources: ComparativeAnalysis[]) {
    if (!resources.length) fail("Resources are undefined");
    const allResourcesAreFavouriteSection = resources.every(({ favouriteSection }) => favouriteSection);
    expect(allResourcesAreFavouriteSection).toBe(true);
}
