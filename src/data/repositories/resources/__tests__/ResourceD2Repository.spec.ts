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

        it("favouriteSection true in filter", async () => {
            givenAComparativeAnalysis();

            await resourceRepository.get({ category: "comparative-analysis", favouriteSection: true }).runAsync();

            expect(mockWebServer.lastRequest?.params.get("filter")).toContain(
                `${resourceDataElements.favouriteSection}:eq:true`
            );
        });

        it("favouriteSection false in filter", async () => {
            givenAComparativeAnalysis();

            await resourceRepository.get({ category: "comparative-analysis", favouriteSection: false }).runAsync();

            expect(mockWebServer.lastRequest?.params.get("filter")).toContain(
                `${resourceDataElements.favouriteSection}:eq:false`
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
                `${resourceDataElements.category}:like:comparative analysis`
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

            expect(mockWebServer.lastRequest?.params.get("filter")).toBe(`${resourceDataElements.category}:like:news`);
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
                `${resourceDataElements.category}:like:multimedia`
            );
        });
    });
    describe("Country Analysis", () => {
        it("should return country analysis properly", async () => {
            givenACountryAnalysis();

            const response = await resourceRepository.get({ category: "country-analysis" }).runAsync();

            const countryAnalysis = (response.data || []) as CountryAnalysis[];

            verifCountryAnalysis(countryAnalysis[0]);
        });
        it("should send expected filter for multimedia", async () => {
            givenACountryAnalysis();

            await resourceRepository.get({ category: "country-analysis" }).runAsync();

            expect(mockWebServer.lastRequest?.params.get("filter")).toBe(
                `${resourceDataElements.category}:like:country analysis`
            );
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
    if (!comparativeAnalysis) fail("Person is undefined");

    expect(comparativeAnalysis.kind).toBe("comparative-analysis");
    expect(comparativeAnalysis.image).toContain("/events/files?dataElementUid=uund7zjS1Yt&eventUid=bT2PACV80QO");
    expect(comparativeAnalysis.title).toBe(
        "Can people afford to pay for health care? New evidence on financial protection in Europe: summary"
    );
    expect(comparativeAnalysis.theme).toBe("Financial Protection");

    expect(comparativeAnalysis.date.toISOString()).toBe(new Date("2019-01-01T00:00:00.000").toISOString());

    const expectedLinks = [
        {
            language: "English",
            url: "https://apps.who.int/iris/bitstream/handle/10665/345512/WHO-EURO-2019-3439-431980-60514-eng.pdf?sequence=1&isAllowed=y",
        },
        {
            language: "Deutsch",
            url: "https://apps.who.int/iris/bitstream/handle/10665/345523/WHO-EURO-2019-3439-431980-60516-ger.pdf?sequence=1&isAllowed=y",
        },
        {
            language: "Castellano",
            url: "https://apps.who.int/iris/bitstream/handle/10665/345524/WHO-EURO-2019-3439-431980-60517-spa.pdf?sequence=1&isAllowed=y",
        },
        {
            language: "Français",
            url: "https://apps.who.int/iris/bitstream/handle/10665/345515/WHO-EURO-2019-3439-431980-60515-fre.pdf?sequence=1&isAllowed=y",
        },
    ];

    comparativeAnalysis.links.forEach((link, index) => {
        const expectedLink = expectedLinks[index];

        expect(link.language).toBe(expectedLink?.language);
        expect(link.url).toBe(expectedLink?.url);
    });

    verifyFavourite(comparativeAnalysis);
}

function verifyNews(newsItem?: News) {
    if (!newsItem) fail("News is undefined");

    expect(newsItem.kind).toBe("news");
    expect(newsItem.image).toContain("/events/files?dataElementUid=uund7zjS1Yt&eventUid=L7pJLhVhB1W");
    expect(newsItem.title).toBe(
        "Countries hosting Ukrainian refugees reaffirm their commitment to meeting their health needs"
    );
    expect(newsItem.url).toBe(
        "https://www.who.int/europe/news/item/03-05-2023-countries-hosting-ukrainian-refugees-reaffirm-their-commitment-to-meeting-their-health-needs"
    );
    expect(newsItem.date.toISOString()).toBe(new Date("2023-05-03T00:00:00.000").toISOString());

    verifyFavourite(newsItem);
}

function verifyMultimedia(multimediaItem?: Multimedia) {
    if (!multimediaItem) fail("Multimedia is undefined");

    expect(multimediaItem.kind).toBe("multimedia");
    expect(multimediaItem.image).toContain("/events/files?dataElementUid=uund7zjS1Yt&eventUid=pqv58NbllXi");
    expect(multimediaItem.title).toBe("Financial protection in Spain: a pillar of universal health coverage");
    expect(multimediaItem.url).toBe("https://www.youtube.com/watch?v=LcltHPiuHqY");

    expect(multimediaItem.date.toISOString()).toBe(new Date("2021-05-09T00:00:00.000").toISOString());

    expect(multimediaItem.theme).toBe("Financial Protection");

    verifyFavourite(multimediaItem);
}

function verifCountryAnalysis(countryAnalysis?: CountryAnalysis) {
    if (!countryAnalysis) fail("countryAnalysis is undefined");

    expect(countryAnalysis.kind).toBe("country-analysis");
    expect(countryAnalysis.image).toContain("/events/files?dataElementUid=uund7zjS1Yt&eventUid=FoBYCO3UUnU");
    expect(countryAnalysis.title).toBe(
        "Can people afford to pay for health care? New evidence on financial protection in Spain"
    );
    expect(countryAnalysis.theme).toBe("Financial Protection");
    expect(countryAnalysis.date.toISOString()).toBe(new Date("2021-01-01T00:00:00.000").toISOString());

    const expectedLinks = [
        {
            language: "English",
            url: "https://apps.who.int/iris/bitstream/handle/10665/347403/9789289056182-eng.pdf?sequence=1&isAllowed=y",
        },
        {
            language: "Castellano",
            url: "https://apps.who.int/iris/bitstream/handle/10665/347895/WHO-EURO-2021-3996-43755-61568-spa.pdf?sequence=1&isAllowed=y",
        },
    ];

    countryAnalysis.links.forEach((link, index) => {
        const expectedLink = expectedLinks[index];

        expect(link.language).toBe(expectedLink?.language);
        expect(link.url).toBe(expectedLink?.url);
    });

    expect(countryAnalysis.countryId).toBe("DVnpk4xiXGJ");

    verifyFavourite(countryAnalysis);
}

function verifyFavourite(item?: BasicResource) {
    if (!item) fail("Resource is undefined");

    expect(item.favourite).toBe(true);
    expect(item.favouriteOrder).toBe(1);
    expect(item.favouriteSection).toBe(true);
    expect(item.favouriteSectionOrder).toBe(1);
}
