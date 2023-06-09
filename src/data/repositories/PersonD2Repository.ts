import { FutureData } from "../../domain/entities/Future";
import { Person } from "../../domain/entities/Person";
import { PersonRepository } from "../../domain/repositories/PersonRepository";
import { D2Api } from "../../types/d2-api";
import { apiToFuture } from "../../utils/futures";
import avatarEmpty from "../../webapp/assets/avatar-empty.png";

export const personDataElements: Record<string, string> = {
    image: "qftOoaAVxOr",
    firstName: "j70ChBwbiYb",
    lastName: "uurvrpEppNr",
    position: "r6uQvsaezay",
    country: "Cc5CRlEhngk",
    role: "fh1bVZ8tXSw",
    institution: "lRCUBf6ubH6",
};

export const personProgram = "CPJ2fSvd8T5";

export class PersonD2Repository implements PersonRepository {
    constructor(private api: D2Api) {}

    get(isOfficeTeam: boolean): FutureData<Person[]> {
        //2:38 has a bug filtering events by data element value using eq operator. Like works!
        return apiToFuture(
            this.api.events.get({
                fields: eventsFields,
                skipPaging: true,
                program: personProgram,
                filter: `${personDataElements.role}:like:${isOfficeTeam ? "team" : "expert"}`,
                order: `${personDataElements.firstName}:asc`,
            })
        ).map(response => this.buildPersons(response.events));
    }

    private buildPersons(events: D2Event[]): Person[] {
        return events.map(event => {
            const firstName = event.dataValues.find(dv => dv.dataElement === personDataElements.firstName)?.value || "";
            const lastName = event.dataValues.find(dv => dv.dataElement === personDataElements.lastName)?.value || "";
            const position = event.dataValues.find(dv => dv.dataElement === personDataElements.position)?.value || "";
            const countryId = event.dataValues.find(dv => dv.dataElement === personDataElements.country)?.value || "";
            const image = event.dataValues.find(dv => dv.dataElement === personDataElements.image)?.value;
            const institution =
                event.dataValues.find(dv => dv.dataElement === personDataElements.institution)?.value || "";

            return {
                firstName,
                lastName,
                image: image
                    ? `${this.api.baseUrl}/api/events/files?dataElementUid=${personDataElements.image}&eventUid=${event.event}`
                    : avatarEmpty,
                position,
                institution,
                countryId,
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
