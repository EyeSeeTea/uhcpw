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
import { ResourceD2Repository, resourceDataElements, resourcesProgram } from "../ResourceD2Repository";
import comparativeAnalysis from "./data/ComparativeAnalysis.json";
import news from "./data/News.json";
import multimedia from "./data/Multimedia.json";
import countryAnalysis from "./data/CountryAnalysis.json";

const mockWebServer = new MockWebServer();
const api = getD2APiFromInstance(new Instance({ url: "/" }));
const resourceRepository = new ResourceD2Repository(api);

describe("Resource repository", () => {
    beforeAll(() => mockWebServer.start());
    afterEach(() => mockWebServer.resetHandlers());
    afterAll(() => mockWebServer.close());

    describe("should send expected parameter", () => {
        it("program", async () => {
            givenAComparativeAnalysis();

            await resourceRepository.get({ category: "comparative-analysis" }).runAsync();

            expect(mockWebServer.lastRequest?.params.get("program")).toBe(resourcesProgram);
        });

        it("theme in filter", async () => {
            givenAComparativeAnalysis();

            await resourceRepository
                .get({ category: "comparative-analysis", theme: "Financial Protection" })
                .runAsync();

            expect(mockWebServer.lastRequest?.params.get("filter")).toContain(
                `${resourceDataElements.theme}:like:Financial Protection`
            );
        });
        it("searchTerm in filter", async () => {
            givenAComparativeAnalysis();

            await resourceRepository.get({ category: "comparative-analysis", searchTerm: "can" }).runAsync();

            expect(mockWebServer.lastRequest?.params.get("filter")).toContain(`${resourceDataElements.title}:like:can`);
        });
        it("start date and end date in filter", async () => {
            givenAComparativeAnalysis();

            await resourceRepository.get({ category: "comparative-analysis", years: ["2020", "2022"] }).runAsync();

            expect(mockWebServer.lastRequest?.params.get("startDate")).toBe("2020-01-01");
            expect(mockWebServer.lastRequest?.params.get("endDate")).toBe("2022-12-31");
        });

        it("favourite true in filter", async () => {
            givenAComparativeAnalysis();

            await resourceRepository.get({ category: "comparative-analysis", favourite: true }).runAsync();

            expect(mockWebServer.lastRequest?.params.get("filter")).toContain(
                `${resourceDataElements.favourite}:eq:true`
            );
        });

        it("favourite false in filter", async () => {
            givenAComparativeAnalysis();

            await resourceRepository.get({ category: "comparative-analysis", favourite: false }).runAsync();

            expect(mockWebServer.lastRequest?.params.get("filter")).toContain(
                `${resourceDataElements.favourite}:eq:false`
            );
        });

        it("order in filter", async () => {
            givenAComparativeAnalysis();

            await resourceRepository.get({ category: "comparative-analysis" }).runAsync();

            expect(mockWebServer.lastRequest?.params.get("order")).toContain("eventDate:desc");
        });

        it("skipPaging equal to true if count is not passed", async () => {
            givenAComparativeAnalysis();

            await resourceRepository.get({ category: "comparative-analysis" }).runAsync();

            expect(mockWebServer.lastRequest?.params.get("skipPaging")).toContain("true");
        });
        it("skipPaging equal to false if count is passed", async () => {
            givenAComparativeAnalysis();

            await resourceRepository.get({ category: "comparative-analysis", count: 6 }).runAsync();

            expect(mockWebServer.lastRequest?.params.get("skipPaging")).toContain("false");
        });
        it("pageSize equal to count", async () => {
            givenAComparativeAnalysis();

            await resourceRepository.get({ category: "comparative-analysis", count: 6 }).runAsync();

            expect(mockWebServer.lastRequest?.params.get("pageSize")).toContain("6");
        });
    });

    describe("Comparative analysis", () => {
        it("should return comparative analysis properly", async () => {
            givenAComparativeAnalysis();

            const response = await resourceRepository.get({ category: "comparative-analysis" }).runAsync();

            const comparativeAnalysisItems = (response.data || []) as ComparativeAnalysis[];

            verifyComparativeAnalysis(comparativeAnalysisItems[0]);
        });
        it("should send expected filter for comparative-analysis", async () => {
            givenAComparativeAnalysis();

            await resourceRepository.get({ category: "comparative-analysis" }).runAsync();

            expect(mockWebServer.lastRequest?.params.get("filter")).toBe(
                `${resourceDataElements.comparativeAnalysisCategory}:eq:true`
            );
        });
    });
    describe("News", () => {
        it("should return news properly", async () => {
            givenANews();

            const response = await resourceRepository.get({ category: "news" }).runAsync();

            const news = (response.data || []) as News[];

            verifyNews(news[0]);
        });
        it("should send expected filter for news", async () => {
            givenANews();

            await resourceRepository.get({ category: "news" }).runAsync();

            expect(mockWebServer.lastRequest?.params.get("filter")).toBe(
                `${resourceDataElements.newsCategory}:eq:true`
            );
        });
    });
    describe("Multimedia", () => {
        it("should return multimedia properly", async () => {
            givenAMultimedia();

            const response = await resourceRepository.get({ category: "multimedia" }).runAsync();

            const multimedia = (response.data || []) as Multimedia[];

            verifyMultimedia(multimedia[0]);
        });
        it("should send expected filter for multimedia", async () => {
            givenAMultimedia();

            await resourceRepository.get({ category: "multimedia" }).runAsync();

            expect(mockWebServer.lastRequest?.params.get("filter")).toBe(
                `${resourceDataElements.multimediaCategory}:eq:true`
            );
        });
    });
    describe("Country Analysis", () => {
        it("should return country analysis properly", async () => {
            givenACountryAnalysis();

            const response = await resourceRepository.get({ category: "country-analysis" }).runAsync();

            const countryAnalysis = (response.data || []) as CountryAnalysis[];

            verifyCountryAnalysis(countryAnalysis[0]);
        });
        it("should send expected filter for multimedia", async () => {
            givenACountryAnalysis();

            await resourceRepository.get({ category: "country-analysis" }).runAsync();

            expect(mockWebServer.lastRequest?.params.get("filter")).toBe(
                `${resourceDataElements.countryAnalysisCategory}:eq:true`
            );
        });
    });

    describe("favourite and favouriteSection", () => {
        it("when favourite true in filter then should return all favourite resources", async () => {
            givenAComparativeAnalysis();

            const response = await resourceRepository
                .get({ category: "comparative-analysis", favourite: true })
                .runAsync();

            const comparativeAnalysisItems = (response.data || []) as ComparativeAnalysis[];

            verifyFavouriteResources(comparativeAnalysisItems);
        });

        it("when favouriteSection true in filter then should return all favouriteSection resources", async () => {
            givenAComparativeAnalysis();

            const response = await resourceRepository
                .get({ category: "comparative-analysis", favouriteSection: true })
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
            endpoint: `/api/events`,
            httpStatusCode: 200,
            response: comparativeAnalysis,
        },
    ]);
}

function givenANews() {
    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: `/api/events`,
            httpStatusCode: 200,
            response: news,
        },
    ]);
}

function givenAMultimedia() {
    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: `/api/events`,
            httpStatusCode: 200,
            response: multimedia,
        },
    ]);
}

function givenACountryAnalysis() {
    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: `/api/events`,
            httpStatusCode: 200,
            response: countryAnalysis,
        },
    ]);
}

function verifyComparativeAnalysis(comparativeAnalysis?: ComparativeAnalysis) {
    if (!comparativeAnalysis) fail("Comparative analysis is undefined");

    expect(comparativeAnalysis.kind).toBe("comparative-analysis");
    expect(comparativeAnalysis.image).toContain("//api/events/files?dataElementUid=uund7zjS1Yt&eventUid=ESI1B0zxHfk");
    expect(comparativeAnalysis.title).toBe(
        "Can people afford to pay for health care? New evidence on financial protection in Europe: summary"
    );
    expect(comparativeAnalysis.theme).toBe("Financial Protection");

    expect(comparativeAnalysis.date.toISOString()).toBe(new Date("2024-04-01T22:00:00.000Z").toISOString());

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
    expect(comparativeAnalysis.favouriteSectionOrder).toBe(1);
    verifyFavourite(comparativeAnalysis);
}

function verifyNews(newsItem?: News) {
    if (!newsItem) fail("News is undefined");

    expect(newsItem.kind).toBe("news");
    expect(newsItem.image).toContain("//api/events/files?dataElementUid=uund7zjS1Yt&eventUid=ckY8Z4ZmTDe");
    expect(newsItem.title).toBe(
        "New WHO report outlines concrete steps to make health care more accessible for people in Ukraine"
    );
    expect(newsItem.url).toBe(
        "https://www.who.int/europe/news/item/15-06-2023-new-who-report-outlines-concrete-steps-to-make-health-care-more-accessible-for-people-in-ukraine"
    );
    expect(newsItem.date.toISOString()).toBe(new Date("2023-06-14T22:00:00.000Z").toISOString());

    expect(newsItem.favouriteSection).toBe(true);
    expect(newsItem.favouriteSectionOrder).toBe(1);
    verifyFavourite(newsItem);
}

function verifyMultimedia(multimediaItem?: Multimedia) {
    if (!multimediaItem) fail("Multimedia is undefined");

    expect(multimediaItem.kind).toBe("multimedia");
    expect(multimediaItem.image).toContain("//api/events/files?dataElementUid=uund7zjS1Yt&eventUid=gGIXHvLl5Wl");
    expect(multimediaItem.title).toBe("Financial protection in Belgium");
    expect(multimediaItem.url).toBe(
        "https://who.canto.global/pdfviewer/viewer/viewer.html?share=share%2Calbum%2CGIAIK&column=document&id=gh0m908lst5073jitb2pe52a7f&suffix=pdf&print=1"
    );

    expect(multimediaItem.date.toISOString()).toBe(new Date("2022-12-31T23:00:00.000Z").toISOString());

    expect(multimediaItem.theme).toBe("Financial Protection");

    expect(multimediaItem.favouriteSection).toBe(true);
    expect(multimediaItem.favouriteSectionOrder).toBe(1);
    verifyFavourite(multimediaItem);
}

function verifyCountryAnalysis(countryAnalysis?: CountryAnalysis) {
    if (!countryAnalysis) fail("countryAnalysis is undefined");

    expect(countryAnalysis.kind).toBe("country-analysis");
    expect(countryAnalysis.image).toContain("//api/events/files?dataElementUid=uund7zjS1Yt&eventUid=qgw0lMQo87H");
    expect(countryAnalysis.title).toBe(
        "Can people afford to pay for health care? New evidence on financial protection in Belgium. Summary."
    );
    expect(countryAnalysis.theme).toBe("Financial Protection");
    expect(countryAnalysis.date.toISOString()).toBe(new Date("2023-05-14T22:00:00.000Z").toISOString());

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

    expect(countryAnalysis.favouriteSection).toBe(true);
    expect(countryAnalysis.favouriteSectionOrder).toBe(1);
    verifyFavourite(countryAnalysis);
}

function verifyFavourite(item?: BasicResource) {
    if (!item) fail("Resource is undefined");

    expect(item.favourite).toBe(true);
    expect(item.favouriteOrder).toBe(1);
}

function verifyFavouriteResources(resources: BasicResource[]) {
    if (!resources.length) fail("Resources are undefined");
    const allResourcesAreFavourite = resources.every(({ favourite }) => favourite);
    expect(allResourcesAreFavourite).toBe(true);
}

function verifyFavouriteSectionResources(resources: ComparativeAnalysis[]) {
    if (!resources.length) fail("Resources are undefined");
    const allResourcesAreFavouriteSection = resources.every(({ favouriteSection }) => favouriteSection);
    expect(allResourcesAreFavouriteSection).toBe(true);
}
