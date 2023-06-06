import { MockWebServer } from "../../../utils/MockWebServer";
import { Instance } from "../../entities/Instance";
import { PersonD2Repository, personDataElements, personProgram } from "../PersonD2Repository";
import { getD2APiFromInstance } from "../../../utils/d2-api";

import officeTeam from "./data/officeTeam.json";
import experts from "./data/experts.json";
import { Person } from "../../../domain/entities/Person";

const mockWebServer = new MockWebServer();
const instance = new Instance({ url: "/" });
const api = getD2APiFromInstance(instance);
const officeTeamRepository = new PersonD2Repository(api);

describe("Person repository", () => {
    beforeAll(() => mockWebServer.start());
    afterEach(() => mockWebServer.resetHandlers());
    afterAll(() => mockWebServer.close());

    it("should return office team", async () => {
        mockWebServer.addRequestHandlers([
            {
                method: "get",
                endpoint: `/api/events`,
                httpStatusCode: 200,
                response: officeTeam,
            },
        ]);

        const response = await officeTeamRepository.get(true).runAsync();

        const persons = response.data || [];

        expect(persons.length).toBe(2);
        verifyPersonIsParsed(persons[0]);
    });
    it("should return experts", async () => {
        mockWebServer.addRequestHandlers([
            {
                method: "get",
                endpoint: `/api/events`,
                httpStatusCode: 200,
                response: experts,
            },
        ]);

        const response = await officeTeamRepository.get(false).runAsync();

        const persons = response.data || [];

        expect(persons.length).toBe(2);
        verifyPersonIsParsed(persons[0]);
    });

    it("should send filter by role equal to team and expected program", async () => {
        mockWebServer.addRequestHandlers([
            {
                method: "get",
                endpoint: `/api/events`,
                httpStatusCode: 200,
                response: officeTeam,
            },
        ]);

        await officeTeamRepository.get(true).runAsync();

        const filter = mockWebServer.lastRequest?.params.get("filter");
        const program = mockWebServer.lastRequest?.params.get("program");

        expect(program).toBe(personProgram);
        expect(filter).toBe(`${personDataElements.role}:like:team`);
    });
    it("order in filter", async () => {
        mockWebServer.addRequestHandlers([
            {
                method: "get",
                endpoint: `/api/events`,
                httpStatusCode: 200,
                response: officeTeam,
            },
        ]);

        await officeTeamRepository.get(true).runAsync();

        expect(mockWebServer.lastRequest?.params.get("order")).toContain(`${personDataElements.firstName}:asc`);
    });
});

function verifyPersonIsParsed(person?: Person) {
    if (!person) fail("Person is undefined");

    expect(person.firstName).toBe("Natalia");
    expect(person.lastName).toBe("Riabtseva");
    //TODO: image pending
    //expect(person.image).toBe("Riabtseva")
    expect(person.position).toBe("Co-founder");
    expect(person.countryId).toBe("Ukraine");
}

export {};
