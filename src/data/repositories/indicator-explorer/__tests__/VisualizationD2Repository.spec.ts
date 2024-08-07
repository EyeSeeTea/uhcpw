import { VisualizationD2Repository } from "../VisualizationD2Repository";
import { MockWebServer } from "../../../../utils/MockWebServer";
import { Instance } from "../../../entities/Instance";
import { getD2APiFromInstance } from "../../../../utils/d2-api";
import visualization from "./data/visualization_hNU4Lj1xLYO.json";
import infoNotes from "./data/infoNotes.json";
import dataElements from "./data/dataElements.json";
import breaksInSeriesEvents from "./data/breaksInSeriesEvents.json";
import breaksInSeriesProgram from "./data/breaksInSeriesProgram.json";
import { Visualization } from "../../../../domain/entities/indicator-explorer/Visualization";

const mockWebServer = new MockWebServer();
const instance = new Instance({ url: "/" });
const api = getD2APiFromInstance(instance);
const visualizationRepository = new VisualizationD2Repository(api);

describe("Visualization repository", () => {
    beforeAll(() => mockWebServer.start());
    afterEach(() => mockWebServer.resetHandlers());
    afterAll(() => mockWebServer.close());

    //Test parse

    // TODO: Fix test
    it.skip("should return a expected visualization", async () => {
        givenAVisualization();

        const response = await visualizationRepository.getById("hNU4Lj1xLYO").runAsync();

        const visualization = response.data;

        verifyVisualization(visualization);
    });

    it("should send filter by role equal to team and expected program", async () => {
        givenAVisualization();

        await visualizationRepository.getById("hNU4Lj1xLYO").runAsync();

        const requests = mockWebServer.allRequests;

        expect(requests?.some(r => (r.url.pathname = "/api/visualizations/hNU4Lj1xLYO"))).toBe(true);
        expect(requests?.some(r => (r.url.pathname = "/api/events"))).toBe(true);
        expect(requests?.some(r => (r.url.pathname = "/api/dataElements"))).toBe(true);
        expect(requests?.some(r => (r.url.pathname = "/api/programs"))).toBe(true);
    });
});

function verifyVisualization(visualization?: Visualization) {
    if (!visualization) fail("Visualization is undefined");

    expect(visualization.id).toBe("hNU4Lj1xLYO");
    expect(visualization.categoryName).toBe("Comparative");
    expect(visualization.friendlyName).toBe(
        "households with catastrophic health spending and out-of-pocket payments as a share of current spending on health in Europe and central Asia"
    );
    expect(visualization.notes).toBe(
        "Data on catastrophic health spending and out-of-pocket payments are for the same year\n\nSource: Data on catastrophic health spending: WHO Regional Office for Europe; data on out-of-pocket payments: GHED"
    );
}

export {};

function givenAVisualization() {
    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: `/api/visualizations/*`,
            httpStatusCode: 200,
            response: visualization,
        },
    ]);

    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: `/api/events`,
            httpStatusCode: 200,
            response: infoNotes,
        },
    ]);

    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: `/api/dataElements`,
            httpStatusCode: 200,
            response: dataElements,
        },
    ]);

    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: `/api/events`,
            httpStatusCode: 200,
            response: breaksInSeriesEvents,
        },
    ]);

    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: `/api/models/programs`,
            httpStatusCode: 200,
            response: breaksInSeriesProgram,
        },
    ]);
}
