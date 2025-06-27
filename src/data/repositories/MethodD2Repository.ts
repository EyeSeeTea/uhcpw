import i18n from "@eyeseetea/d2-ui-components/locales";
import { FutureData } from "../../domain/entities/Future";
import { Method } from "../../domain/entities/Method";
import { MethodRepository } from "../../domain/repositories/MethodRepository";
import { D2Api } from "../../types/d2-api";
import { getMethodsProgramEvent } from "./common/getMethodsProgramEvent";
import { Maybe } from "../../types/utils";

export const methodDataElements: Record<string, string> = {
    sectionName1: "JhQ6PjEMl55",
    shortText1: "qdRCrFAYOjD",
    text1: "UAzgkOcxuP0",

    sectionName2: "qSBxtA8Pjye",
    shortText2: "B13yTzg5IDu",
    text2: "lj4jhGrQp4P",

    sectionName3: "Lm6prBKeCKH",
    shortText3: "aYlPwFkOqyB",
    text3: "PC7aOMI2tG0",

    sectionName4: "BA4q0P4nSnZ",
    shortText4: "VR6XUVygdAd",
    text4: "TqqoeU8l0wP",

    sectionName5: "DQH9hNce7bi",
    shortText5: "bJYoOfVB7L9",
    text5: "cRkVhIWs4PB",
};

export class MethodD2Repository implements MethodRepository {
    constructor(private api: D2Api) {}

    get(): FutureData<Method[]> {
        return getMethodsProgramEvent(this.api).map(event => this.buildMethods(event));
    }

    private buildMethods(event: Maybe<D2Event>): Method[] {
        if (event) {
            const sectionName1 =
                event.dataValues.find(dv => dv.dataElement === methodDataElements.sectionName1)?.value || "";
            const shortText1 =
                event.dataValues.find(dv => dv.dataElement === methodDataElements.shortText1)?.value || "";
            const text1 = event.dataValues.find(dv => dv.dataElement === methodDataElements.text1)?.value || "";

            const sectionName2 =
                event.dataValues.find(dv => dv.dataElement === methodDataElements.sectionName2)?.value || "";
            const shortText2 =
                event.dataValues.find(dv => dv.dataElement === methodDataElements.shortText2)?.value || "";
            const text2 = event.dataValues.find(dv => dv.dataElement === methodDataElements.text2)?.value || "";

            const sectionName3 =
                event.dataValues.find(dv => dv.dataElement === methodDataElements.sectionName3)?.value || "";
            const shortText3 =
                event.dataValues.find(dv => dv.dataElement === methodDataElements.shortText3)?.value || "";
            const text3 = event.dataValues.find(dv => dv.dataElement === methodDataElements.text3)?.value || "";

            const sectionName4 =
                event.dataValues.find(dv => dv.dataElement === methodDataElements.sectionName4)?.value || "";
            const shortText4 =
                event.dataValues.find(dv => dv.dataElement === methodDataElements.shortText4)?.value || "";
            const text4 = event.dataValues.find(dv => dv.dataElement === methodDataElements.text4)?.value || "";

            const sectionName5 =
                event.dataValues.find(dv => dv.dataElement === methodDataElements.sectionName5)?.value || "";
            const shortText5 =
                event.dataValues.find(dv => dv.dataElement === methodDataElements.shortText5)?.value || "";
            const text5 = event.dataValues.find(dv => dv.dataElement === methodDataElements.text5)?.value || "";

            return [
                {
                    sectionName: sectionName1,
                    shortText: shortText1,
                    text: text1,
                },
                {
                    sectionName: sectionName2,
                    shortText: shortText2,
                    text: text2,
                },
                {
                    sectionName: sectionName3,
                    shortText: shortText3,
                    text: text3,
                },
                {
                    sectionName: sectionName4,
                    shortText: shortText4,
                    text: text4,
                },
                {
                    sectionName: sectionName5,
                    shortText: shortText5,
                    text: text5,
                },
            ];
        } else {
            throw new Error(i18n.t("Error fetching methods"));
        }
    }
}

export interface D2Event {
    event: string;
    dataValues: DataValue[];
    eventDate: string;
}

export interface DataValue {
    dataElement: string;
    value: string;
}
