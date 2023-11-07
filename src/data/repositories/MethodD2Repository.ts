import { FutureData } from "../../domain/entities/Future";
import { Method } from "../../domain/entities/Method";
import { MethodRepository } from "../../domain/repositories/MethodRepository";
import { D2Api } from "../../types/d2-api";
import { apiToFuture } from "../../utils/futures";

export const methodDataElements: Record<string, string> = {
    sectionName: "JhQ6PjEMl55",
    shortText: "qdRCrFAYOjD",
    text: "UAzgkOcxuP0",
    /* section_name_2: "qSBxtA8Pjye",
    short_text_2: "B13yTzg5IDu",
    text_2: "lj4jhGrQp4P",
    section_name_3: "Lm6prBKeCKH",
    short_text_3: "aYlPwFkOqyB",
    text_3: "PC7aOMI2tG0",
    section_name_4: "BA4q0P4nSnZ",
    short_text_4: "VR6XUVygdAd",
    text_4: "TqqoeU8l0wP",
    section_name_5: "DQH9hNce7bi",
    short_text_5: "bJYoOfVB7L9",
    text_5: "cRkVhIWs4PB", */
};

export const methodProgram = "n3h1qR27ZgJ";

export class MethodD2Repository implements MethodRepository {
    constructor(private api: D2Api) {}

    get(): FutureData<Method[]> {
        //2:38 has a bug filtering events by data element value using eq operator. Like works!
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
