import { MockWebServer } from "../../../../utils/MockWebServer";

export const page = "resources";
export const eventId = "mainPagesEv1";
export const videoFileDataElement = "bzSZLAF1bD5";
export const videoUrlDataElement = "T41zn5w2Wqh";
export const fileResourceId = "fileResour1";
export const eventsEndpoint = "/api/events";
export const eventFilesEndpoint = "/api/events/files";

export function givenAMainPagesEvent(
    mockWebServer: MockWebServer,
    valuesByDataElement: Readonly<Record<string, string>>
): void {
    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: eventsEndpoint,
            httpStatusCode: 200,
            response: {
                events: [
                    {
                        event: eventId,
                        eventDate: "2026-10-27T00:00:00.000",
                        dataValues: Object.entries(valuesByDataElement).map(([dataElement, value]) => ({
                            dataElement,
                            value,
                        })),
                    },
                ],
            },
        },
    ]);
    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: eventFilesEndpoint,
            httpStatusCode: 200,
            response: "video",
        },
    ]);
}
