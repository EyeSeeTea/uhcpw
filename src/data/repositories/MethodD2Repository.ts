import { FutureData } from "../../domain/entities/Future";
import { Method } from "../../domain/entities/Method";
import { MethodRepository } from "../../domain/repositories/MethodRepository";
import { D2Api } from "../../types/d2-api";
import { apiToFuture } from "../../utils/futures";

export const methodDataElements: Record<string, string> = {
    sectionName: "JhQ6PjEMl55",
    shortText: "qdRCrFAYOjD",
    text: "UAzgkOcxuP0",
};

export const methodProgram = "ncAcyjKwLSS";

export class MethodD2Repository implements MethodRepository {
    constructor(private api: D2Api) {}

    get(): FutureData<Method[]> {
        return apiToFuture(
            this.api.events.get({
                fields: eventsFields,
                skipPaging: true,
                program: methodProgram,
            })
        ).map(response => this.buildMethods(response.events));
    }

    private buildMethods(events: D2Event[]): Method[] {
        return events.map(event => {
            const sectionName =
                event.dataValues.find(dv => dv.dataElement === methodDataElements.sectionName)?.value || "";
            const shortText = event.dataValues.find(dv => dv.dataElement === methodDataElements.shortText)?.value || "";
            const text = event.dataValues.find(dv => dv.dataElement === methodDataElements.text)?.value || "";

            return {
                sectionName,
                shortText,
                text,
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
