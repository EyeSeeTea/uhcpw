import { FutureData } from "../../domain/entities/Future";
import { Person } from "../../domain/entities/Person";
import { OfficeTeamRepository } from "../../domain/repositories/OfficeTeamRepository";
import { D2Api } from "../../types/d2-api";
import { apiToFuture } from "../../utils/futures";

const dataElements: Record<string, string> = {
    image: "",
    firstName: "j70ChBwbiYb",
    lastName: "RGH57Cnanvg",
    position: "r6uQvsaezay",
    country: "Cc5CRlEhngk",
    role: "fh1bVZ8tXSw",
};

const program = "CPJ2fSvd8T5";

export class OfficeTeamD2Repository implements OfficeTeamRepository {
    constructor(private api: D2Api) {}

    get(): FutureData<Person[]> {
        return apiToFuture(
            this.api.events.get({
                fields: eventsFields,
                skipPaging: true,
                program: program,
                filter: `${dataElements.role}:eq:team`,
            })
        ).map(response => this.buildPersons(response.events));
    }

    private buildPersons(events: D2Event[]): Person[] {
        return events.map(event => {
            const firstName = event.dataValues.find(dv => dv.dataElement === dataElements.firstName)?.value || "";
            const lastName = event.dataValues.find(dv => dv.dataElement === dataElements.lastName)?.value || "";
            const position = event.dataValues.find(dv => dv.dataElement === dataElements.position)?.value || "";
            const country = event.dataValues.find(dv => dv.dataElement === dataElements.country)?.value || "";

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
