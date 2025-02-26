import { DefaultBodyType, MockedRequest, rest } from "msw";
import { SetupServer, setupServer } from "msw/node";

export type Method = "get" | "post" | "put";

export interface MockHandler<T extends DefaultBodyType> {
    method: Method;
    endpoint: string;
    httpStatusCode: number;
    response: T;
}

export interface Request {
    headers: Record<string, string>;
    params: URLSearchParams;
    url: URL;
}

export class MockWebServer {
    server: SetupServer;

    lastRequest?: Request;
    allRequests?: Request[] = [];

    constructor() {
        this.server = setupServer();

        this.server.events.on("request:start", req => {
            const request = this.mapRequest(req);

            this.lastRequest = request;
            this.allRequests?.push(request);
        });
    }

    start(): void {
        this.server.listen();
    }

    resetHandlers(): void {
        this.server.resetHandlers();
    }

    resetRequests(): void {
        this.lastRequest = undefined;
        this.allRequests = [];
    }

    close(): void {
        this.server.close();
    }

    addRequestHandlers<T extends DefaultBodyType>(handlers: MockHandler<T>[]) {
        const mwsHandlers = handlers.map(handler => this.createMwsHandler(handler));
        this.server.use(...mwsHandlers);
    }

    addVerificationListener(assertion: (req: Request) => void) {
        this.server.events.on("request:start", req => {
            const request = this.mapRequest(req);

            assertion(request);
        });
    }

    createMwsHandler<T extends DefaultBodyType>(handler: MockHandler<T>) {
        switch (handler.method) {
            case "get":
                return rest.get(handler.endpoint, (req, res, ctx) => {
                    return res(
                        ctx.status(handler.httpStatusCode),
                        typeof handler.response === "string" ? ctx.text(handler.response) : ctx.json(handler.response)
                    );
                });
            case "post":
                return rest.post(handler.endpoint, (req, res, ctx) => {
                    //this.verifyRequest(handler,req);

                    return res(
                        ctx.status(handler.httpStatusCode),
                        typeof handler.response === "string" ? ctx.text(handler.response) : ctx.json(handler.response)
                    );
                });
            case "put":
                return rest.put(handler.endpoint, (req, res, ctx) => {
                    //this.verifyRequest(handler,req);

                    return res(
                        ctx.status(handler.httpStatusCode),
                        typeof handler.response === "string" ? ctx.text(handler.response) : ctx.json(handler.response)
                    );
                });
        }
    }

    mapRequest(req: MockedRequest<DefaultBodyType>): Request {
        return {
            headers: req.headers.raw(),
            params: req.url.searchParams,
            url: req.url,
        };
    }
}
