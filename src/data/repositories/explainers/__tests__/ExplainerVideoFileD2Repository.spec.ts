import { MockWebServer } from "../../../../utils/MockWebServer";
import { Instance } from "../../../entities/Instance";
import { getD2APiFromInstance } from "../../../../utils/d2-api";
import { ExplainerVideoFileD2Repository } from "../ExplainerVideoFileD2Repository";
import {
    eventFilesEndpoint,
    eventId,
    fileResourceId,
    givenAMainPagesEvent,
    page,
    videoFileDataElement,
} from "./helpers";

const mockWebServer = new MockWebServer();
const instance = new Instance({ url: "/" });
const api = getD2APiFromInstance(instance);
const explainerVideoFileRepository = new ExplainerVideoFileD2Repository(api);

describe("Explainer video file repository", () => {
    beforeAll(() => mockWebServer.start());
    afterEach(() => {
        mockWebServer.resetHandlers();
        mockWebServer.resetRequests();
    });
    afterAll(() => mockWebServer.close());

    it("downloads the file of the page data element", async () => {
        givenAMainPagesEvent(mockWebServer, { [videoFileDataElement]: fileResourceId });

        await explainerVideoFileRepository.get(page).runAsync();

        expect(mockWebServer.lastRequest?.url.pathname).toBe(eventFilesEndpoint);
        expect(Object.fromEntries(mockWebServer.lastRequest?.params ?? [])).toEqual({
            dataElementUid: videoFileDataElement,
            eventUid: eventId,
        });
    });
});
