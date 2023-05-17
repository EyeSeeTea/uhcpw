import { D2Api } from "@eyeseetea/d2-api/2.36";
import { MockWebServer } from "../../../utils/MockWebServer";
import { Instance } from "../../entities/Instance";
import { OfficeTeamD2Repository, personDataElements, personProgram } from "../OfficeTeamD2Repository";
import { getD2APiFromInstance } from "../../../utils/d2-api";

import officeTeam from "./data/officeTeam.json";
import { Person } from "../../../domain/entities/Person";

let mockWebServer = new MockWebServer();
const instance = new Instance({ url: "/" });
const api = getD2APiFromInstance(instance);
let officeTeamRepository = new OfficeTeamD2Repository(api);

describe("Resource repository", () => {
    beforeAll(() => mockWebServer.start());
    afterEach(() => mockWebServer.resetHandlers());
    afterAll(() => mockWebServer.close());

    it("should return comparative analysis properly", async () => {
        mockWebServer.addRequestHandlers([
            {
                method: "get",
                endpoint: `/api/events`,
                httpStatusCode: 200,
                response: officeTeam,
            },
        ]);

        const response = await officeTeamRepository.get().runAsync();

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

        await officeTeamRepository.get().runAsync();

        const filter = mockWebServer.lastRequest?.params.get("filter");
        const program = mockWebServer.lastRequest?.params.get("program");

        expect(program).toBe(personProgram);
        expect(filter).toBe(`${personDataElements.role}:eq:team`);
    });
});

function verifyPersonIsParsed(person?: Person) {
    if (!person) fail("Person is undefined");

    expect(person.firstName).toBe("Natalia");
    expect(person.lastName).toBe("Riabtseva");
    //TODO: image pending
    //expect(person.image).toBe("Riabtseva")
    expect(person.position).toBe("Co-founder");
    expect(person.country).toBe("Ukraine");
}

export {};
