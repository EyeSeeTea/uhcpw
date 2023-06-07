import { MockWebServer } from "../../../utils/MockWebServer";
import { Instance } from "../../entities/Instance";
import { getD2APiFromInstance } from "../../../utils/d2-api";

import orgUnits from "./data/orgUnits.json";
import countryInfo from "./data/countryInfo.json";

import { CountryD2Repository } from "../CountryD2Repository";

const mockWebServer = new MockWebServer();
const instance = new Instance({ url: "/" });
const api = getD2APiFromInstance(instance);
const countryD2Repository = new CountryD2Repository(api);

describe("Country repository", () => {
    beforeAll(() => mockWebServer.start());
    afterEach(() => mockWebServer.resetHandlers());
    afterAll(() => mockWebServer.close());

    it("order in filter", async () => {
        givenAOrgUnits();
        givenACountriesInfo();

        await countryD2Repository.get().runAsync();

        const request = mockWebServer.allRequests?.shift();

        expect(request?.params.get("order")).toContain(`shortName:asc`);
    });
});

function givenAOrgUnits() {
    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: `/api/organisationUnits`,
            httpStatusCode: 200,
            response: orgUnits,
        },
    ]);
}

function givenACountriesInfo() {
    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: `/api/events`,
            httpStatusCode: 200,
            response: countryInfo,
        },
    ]);
}

// function verifyPersonIsParsed(person?: Person) {
//     if (!person) fail("Person is undefined");

//     expect(person.firstName).toBe("Natalia");
//     expect(person.lastName).toBe("Riabtseva");
//     //TODO: image pending
//     //expect(person.image).toBe("Riabtseva")
//     expect(person.position).toBe("Co-founder");
//     expect(person.countryId).toBe("Ukraine");
// }

export {};
