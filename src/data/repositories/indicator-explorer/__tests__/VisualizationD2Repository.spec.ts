import { VisualizationD2Repository } from "../VisualizationD2Repository";
import { MockWebServer } from "../../../../utils/MockWebServer";
import { Instance } from "../../../entities/Instance";
import { getD2APiFromInstance } from "../../../../utils/d2-api";
import visualization from "./data/visualization_kIpnMBaBvZ9.json";
import visualization_result from "./data/getVisualization_kIpnMBaBvZ9_result.json";
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
    afterEach(() => {
        mockWebServer.resetRequests();
        mockWebServer.resetHandlers();
    });
    afterAll(() => mockWebServer.close());

    // TODO: Fix test - returned error "TypeError: Only absolute URLs are supported"
    it.skip("should return a expected visualization", async () => {
        givenAVisualization();

        const response = await visualizationRepository.getById("kIpnMBaBvZ9").runAsync();

        const visualization = response.data;

        verifyVisualization(visualization);
    });

    it("should send filter by role equal to team and expected program", async () => {
        givenAVisualization();

        await visualizationRepository.getById("kIpnMBaBvZ9").runAsync();

        const requests = mockWebServer.allRequests;

        expect(requests?.some(r => (r.url.pathname = "/api/visualizations/kIpnMBaBvZ9"))).toBe(true);
        expect(requests?.some(r => (r.url.pathname = "/api/events"))).toBe(true);
        expect(requests?.some(r => (r.url.pathname = "/api/dataElements"))).toBe(true);
        expect(requests?.some(r => (r.url.pathname = "/api/programs"))).toBe(true);
    });
});

function verifyVisualization(visualization?: Visualization) {
    if (!visualization) throw new Error("Visualization is undefined");

    expect(visualization.id).toBe(visualization_result.id);
    expect(visualization.categoryName).toBe(visualization_result.categoryName);
    expect(visualization.friendlyName).toBe(visualization_result.friendlyName);
    expect(visualization.notes).toBe(visualization_result.notes);
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
