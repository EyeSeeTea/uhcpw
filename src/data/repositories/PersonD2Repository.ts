import { FutureData } from "../../domain/entities/Future";
import { Person } from "../../domain/entities/Person";
import { PersonRepository } from "../../domain/repositories/PersonRepository";
import { D2Api } from "../../types/d2-api";
import { apiToFuture } from "../../utils/futures";

export const personDataElements: Record<string, string> = {
    image: "",
    firstName: "j70ChBwbiYb",
    lastName: "RGH57Cnanvg",
    position: "r6uQvsaezay",
    country: "Cc5CRlEhngk",
    role: "fh1bVZ8tXSw",
};

export const personProgram = "CPJ2fSvd8T5";

export class PersonD2Repository implements PersonRepository {
    constructor(private api: D2Api) {}

    get(isOfficeTeam: boolean): FutureData<Person[]> {
        return apiToFuture(
            this.api.events.get({
                fields: eventsFields,
                skipPaging: true,
                program: personProgram,
                filter: `${personDataElements.role}:eq:${isOfficeTeam ? "team" : "expert"}`,
            })
        ).map(response => this.buildPersons(response.events));
    }

    private buildPersons(events: D2Event[]): Person[] {
        return events.map(event => {
            const firstName = event.dataValues.find(dv => dv.dataElement === personDataElements.firstName)?.value || "";
            const lastName = event.dataValues.find(dv => dv.dataElement === personDataElements.lastName)?.value || "";
            const position = event.dataValues.find(dv => dv.dataElement === personDataElements.position)?.value || "";
            const country = event.dataValues.find(dv => dv.dataElement === personDataElements.country)?.value || "";

            return {
                firstName,
                lastName,
                image: "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
                position,
                country,
            };
        });
    }
}

const eventsFields = {
    event: true,
    dataValues: { dataElement: true, value: true },
    eventDate: true,
} as const;

export interface D2Event {
    event: string;
    dataValues: DataValue[];
    eventDate: string;
}

export interface DataValue {
    dataElement: string;
    value: string;
}
