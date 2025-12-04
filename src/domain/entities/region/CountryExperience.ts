import { Id } from "../Ref";

export type CountryExperience = {
    countryId: Id;
    title: string;
    content: string;
    reference: string;
    relatedPolicyChecklistIds: Id[];
};
