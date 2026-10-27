import { MockWebServer } from "../../../../utils/MockWebServer";
import { Instance } from "../../../entities/Instance";
import { getD2APiFromInstance } from "../../../../utils/d2-api";
import { ExplainerD2Repository } from "../ExplainerD2Repository";
import {
    eventsEndpoint,
    fileResourceId,
    givenAMainPagesEvent,
    page,
    videoFileDataElement,
    videoUrlDataElement,
} from "./helpers";

const mockWebServer = new MockWebServer();
const instance = new Instance({ url: "/" });
const api = getD2APiFromInstance(instance);
const explainerRepository = new ExplainerD2Repository(api);

const embedUrl = "https://worldhealthorg-my.sharepoint.com/personal/embed.aspx?UniqueId=9f030644";

describe("Explainer repository", () => {
    beforeAll(() => mockWebServer.start());
    afterEach(() => {
        mockWebServer.resetHandlers();
        mockWebServer.resetRequests();
    });
    afterAll(() => mockWebServer.close());

    describe("when the page has a video file", () => {
        it("returns a file explainer even if a video URL is also configured", async () => {
            givenAMainPagesEvent(mockWebServer, {
                [videoFileDataElement]: fileResourceId,
                [videoUrlDataElement]: embedUrl,
            });

            const explainers = await explainerRepository.getAll().runAsync();

            expect(explainers.data).toEqual([{ page, video: { type: "file" } }]);
        });

        it("does not download the file", async () => {
            givenAMainPagesEvent(mockWebServer, { [videoFileDataElement]: fileResourceId });

            await explainerRepository.getAll().runAsync();

            expect(mockWebServer.allRequests?.map(request => request.url.pathname)).toEqual([eventsEndpoint]);
        });
    });

    describe("when the page only has a video URL", () => {
        it("returns the URL as it is", async () => {
            givenAMainPagesEvent(mockWebServer, { [videoUrlDataElement]: embedUrl });

            const explainers = await explainerRepository.getAll().runAsync();

            expect(explainers.data).toEqual([{ page, video: { type: "url", url: embedUrl } }]);
        });

        it("returns the embed URL of a YouTube link", async () => {
            givenAMainPagesEvent(mockWebServer, {
                [videoUrlDataElement]: "https://www.youtube.com/watch?v=71S7ekOSSzU",
            });

            const explainers = await explainerRepository.getAll().runAsync();

            expect(explainers.data).toEqual([
                { page, video: { type: "url", url: "https://www.youtube.com/embed/71S7ekOSSzU" } },
            ]);
        });
    });

    describe("when the page has no video", () => {
        it("returns no explainer", async () => {
            givenAMainPagesEvent(mockWebServer, {});

            const explainers = await explainerRepository.getAll().runAsync();

            expect(explainers.data).toEqual([]);
        });
    });
});
