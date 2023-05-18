import { ComparativeAnalysis } from "../../../../domain/entities/resources/Resource";
import { getD2APiFromInstance } from "../../../../utils/d2-api";
import { MockWebServer } from "../../../../utils/MockWebServer";
import { Instance } from "../../../entities/Instance";
import { ResourceD2Repository, resourceDataElements, resourcesProgram } from "../ResourceD2Repository";
import comparativeAnalysis from "./data/ComparativeAnalysis.json";

let mockWebServer = new MockWebServer();
const instance = new Instance({ url: "/" });
const api = getD2APiFromInstance(instance);
let resourceRepository = new ResourceD2Repository(api);

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
                `${resourceDataElements.theme}:eq:Financial Protection`
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
                `${resourceDataElements.category}:eq:comparative analysis`
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

function verifyComparativeAnalysis(comparativeAnalysis?: ComparativeAnalysis) {
    if (!comparativeAnalysis) fail("Person is undefined");

    expect(comparativeAnalysis.kind).toBe("comparative-analysis");
    expect(comparativeAnalysis.image).toContain("/events/files?dataElementUid=uund7zjS1Yt&eventUid=bT2PACV80QO");
    expect(comparativeAnalysis.text).toBe(
        "Can people afford to pay for health care? New evidence on financial protection in Europe: summary"
    );
    expect(comparativeAnalysis.theme).toBe("Financial Protection");
    expect(comparativeAnalysis.year).toBe("2019");

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
            url: "https://apps.who.int/iris/bitstream/handle/10665/345524/WHO-EURO-2019-3439-431980-60517-spa.pdf?sequence=1&isAllowed=y",
        },
    ];

    comparativeAnalysis.links.forEach((link, index) => {
        const expectedLink = expectedLinks[index];

        expect(link.language).toBe(expectedLink?.language);
        expect(link.url).toBe(expectedLink?.url);
    });
}
