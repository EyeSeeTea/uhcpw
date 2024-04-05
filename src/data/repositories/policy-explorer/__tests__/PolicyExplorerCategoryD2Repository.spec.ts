import { MockWebServer } from "../../../../utils/MockWebServer";
import { Instance } from "../../../entities/Instance";
import { getD2APiFromInstance } from "../../../../utils/d2-api";
import policyExplorerDataSet from "./data/policyExplorerDataSet.json";
import infoNotes from "./data/infoNotes.json";
import dataElementsNotes from "./data/dataElementsNotes.json";
import { PolicyExplorerCategoryD2Repository } from "../PolicyExplorerCategoryD2Repository";
import { PolicyExplorerCategory } from "../../../../domain/entities/policy-explorer/PolicyExplorerCategory";

const mockWebServer = new MockWebServer();
const instance = new Instance({ url: "/" });
const api = getD2APiFromInstance(instance);
const policyExplorerCategoryRepository = new PolicyExplorerCategoryD2Repository(api);

describe("Policy explorer category repository", () => {
    beforeAll(() => mockWebServer.start());
    afterEach(() => mockWebServer.resetHandlers());
    afterAll(() => mockWebServer.close());

    it("should return a expected categories", async () => {
        givenADataSet();

        const response = await policyExplorerCategoryRepository.getAll().runAsync();

        const category = response.data?.[0];

        verifyCategory(category);
    });

    it("should request to expected endpoints", async () => {
        givenADataSet();

        await policyExplorerCategoryRepository.getAll().runAsync();

        const requests = mockWebServer.allRequests;

        expect(requests?.some(r => (r.url.pathname = "/api/dataSets"))).toBe(true);
        expect(requests?.some(r => (r.url.pathname = "/api/events"))).toBe(true);
        expect(requests?.some(r => (r.url.pathname = "/api/dataElements"))).toBe(true);
    });
});

function verifyCategory(category?: PolicyExplorerCategory) {
    if (!category) fail("Category is undefined");

    expect(category.id).toBe("uG2PbDfOc0w");
    expect(category.name).toBe("Population Coverage");
    expect(category.description).toBe(
        "This section focuses on the basis for entitlement to publicly financed health care. It describes the basis for entitlement; entitlements for refugees, asylum seekers and undocumented migrants; and the groups of people who lack coverage and their entitlements."
    );
}

export {};

function givenADataSet() {
    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: `/api/dataSets`,
            httpStatusCode: 200,
            response: policyExplorerDataSet,
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
            response: dataElementsNotes,
        },
    ]);
}
