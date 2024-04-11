import { MockWebServer } from "../../../utils/MockWebServer";
import { Instance } from "../../entities/Instance";
import { getD2APiFromInstance } from "../../../utils/d2-api";

import mainPagesEvent from "./data/MainPagesEvent.json";
import { HomePageContentD2Repository } from "../HomePageContentD2Repository";
import { HomePageContent } from "../../../domain/entities/HomePageContent";
import { mainPagesProgram } from "../common/getMainPagesContent";

const mockWebServer = new MockWebServer();
const instance = new Instance({ url: "/" });
const api = getD2APiFromInstance(instance);
const homePageContentRepository = new HomePageContentD2Repository(api);

describe("Home Page content repository", () => {
    beforeAll(() => mockWebServer.start());
    afterEach(() => mockWebServer.resetHandlers());
    afterAll(() => mockWebServer.close());

    it("should return home page content", async () => {
        givenAHomePageContent();

        const response = await homePageContentRepository.get().runAsync();

        const content = response.data;

        verifyContentIsParsed(content);
    });

    it("should filter by expected program", async () => {
        givenAHomePageContent();

        await homePageContentRepository.get().runAsync();

        const program = mockWebServer.lastRequest?.params.get("program");

        expect(program).toBe(mainPagesProgram);
    });

    it("should request to evens endpoint", async () => {
        givenAHomePageContent();

        await homePageContentRepository.get().runAsync();

        const pathname = mockWebServer.lastRequest?.url.pathname;

        expect(pathname).toBe("/api/events");
    });
});

function givenAHomePageContent() {
    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: `/api/events`,
            httpStatusCode: 200,
            response: mainPagesEvent,
        },
    ]);
}

function verifyContentIsParsed(homePageContent?: HomePageContent) {
    if (!homePageContent) fail("Home Page Content is undefined");

    expect(homePageContent.explorers.title).toBe("Explorers");
    expect(homePageContent.explorers.subtitle).toBe("Assess the current situation, monitor trends, compare countries");

    expect(homePageContent.explorers.indicator.title).toBe("Indicator explorer");
    expect(homePageContent.explorers.indicator.text).toBe(
        "Over 50 indicators of financial hardship, unmet need for health care and spending on health"
    );
    expect(homePageContent.explorers.indicator.buttonText).toBe("Explore data");

    expect(homePageContent.explorers.policy.title).toBe("Policy explorer");
    expect(homePageContent.explorers.policy.text).toBe(
        "Information on population coverage, service coverage, user charges and voluntary health insurance"
    );
    expect(homePageContent.explorers.policy.buttonText).toBe("Explore data");

    expect(homePageContent.analysis.title).toBe("Analysis");
    expect(homePageContent.analysis.subtitle).toBe("Country-level and comparative analysis of financial protection");

    expect(homePageContent.analysis.countries.title).toBe("Countries in context");
    expect(homePageContent.analysis.countries.text).toBe(
        "Find out about the health system factors that strengthen and undermine financial protection at country level"
    );
    expect(homePageContent.analysis.countries.buttonText).toBe("Country pages");

    expect(homePageContent.analysis.regional.title).toBe("The region at a glance");
    expect(homePageContent.analysis.regional.text).toBe(
        "Compare financial protection indicators, identify gaps in coverage, explore good practice"
    );
    expect(homePageContent.analysis.regional.buttonText).toBe("Regional report");

    expect(homePageContent.methods.title).toBe("Methods");
    expect(homePageContent.methods.subtitle).toBe("How financial protection is monitored matters");

    expect(homePageContent.methods.column1.title).toBe("A focus on equity");
    expect(homePageContent.methods.column1.text).toBe(
        "We measure financial hardship using an approach that accounts for people's capacity to pay for health care"
    );

    expect(homePageContent.methods.column2.title).toBe("Numbers and stories");
    expect(homePageContent.methods.column2.text).toBe(
        "UHC Watch identifies the factors that influence financial protection at country level, drawing on insights from comparative analysis"
    );

    expect(homePageContent.methods.column3.title).toBe("Actionable evidence");
    expect(homePageContent.methods.column3.text).toBe(
        "UHC Watch provides clear guidance for policy by identifying who lacks financial protection, driven by which health services and why"
    );
}

export {};
