import { FutureData } from "../../domain/entities/Future";
import { Person } from "../../domain/entities/Person";
import { PersonRepository } from "../../domain/repositories/PersonRepository";
import { D2Api } from "../../types/d2-api";
import { apiToFuture } from "../../utils/futures";
import avatarEmpty from "../../webapp/assets/avatar-empty.png";

export const personDataElements: Record<string, string> = {
    image: "qftOoaAVxOr",
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
            const image = event.dataValues.find(dv => dv.dataElement === personDataElements.image)?.value;

            return {
                firstName,
                lastName,
                image: image
                    ? `${this.api.baseUrl}/api/events/files?dataElementUid=${personDataElements.image}&eventUid=${event.event}`
                    : avatarEmpty,
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
