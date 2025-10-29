import { Future, FutureData } from "../../../domain/entities/Future";
import { Id } from "../../../domain/entities/Ref";
import { CountryExperience } from "../../../domain/entities/region/CountryExperience";
import { CountryExperienceRepository } from "../../../domain/repositories/region/CountryExperienceRepository";
import { D2Api } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";

const COUNTRY_EXPERIENCE_PROGRAM_ID = "O0jMIuAUqfd";

const COUNTRY_EXPERIENCE_DE_IDS = {
    title: "s5ekPnIAAsN",
    content: "iro8EAg97OE",
    reference: "cGxQC6skwS2",
    relatedPolicyChecklistIds: "TIp8NuxWloL",
} as const;

export class CountryExperienceD2Repository implements CountryExperienceRepository {
    constructor(private api: D2Api) {}

    public getAll(): FutureData<CountryExperience[]> {
        return apiToFuture(
            this.api.events.get({
                fields: eventsFields,
                skipPaging: true,
                program: COUNTRY_EXPERIENCE_PROGRAM_ID,
            })
        ).flatMap(response => {
            if (!response.events[0]) {
                return Future.error("An error has ocurred fetching country experiences");
            }
            const countryExperiences = response.events.map(event => this.buildCountryExperience(event));
            return Future.success(countryExperiences);
        });
    }

    private buildCountryExperience(event: D2Event): CountryExperience {
        const getDataValue = (dataElementId: Id): string =>
            event.dataValues.find(dv => dv.dataElement === dataElementId)?.value || "";

        return {
            countryId: event.orgUnit,
            title: getDataValue(COUNTRY_EXPERIENCE_DE_IDS.title),
            content: getDataValue(COUNTRY_EXPERIENCE_DE_IDS.content),
            reference: getDataValue(COUNTRY_EXPERIENCE_DE_IDS.reference),
            relatedPolicyChecklistIds: getDataValue(COUNTRY_EXPERIENCE_DE_IDS.relatedPolicyChecklistIds).split(","),
        };
    }
}

const eventsFields = {
    event: true,
    orgUnit: true,
    dataValues: { dataElement: true, value: true },
    eventDate: true,
} as const;

export type D2Event = {
    event: string;
    orgUnit: string;
    dataValues: DataValue[];
    eventDate: string;
};

export type DataValue = {
    dataElement: string;
    value: string;
};
