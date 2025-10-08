import { FutureData } from "../../entities/Future";
import { CountryExperience } from "../../entities/region/CountryExperience";

export interface CountryExperienceRepository {
    getAll(): FutureData<CountryExperience[]>;
}
