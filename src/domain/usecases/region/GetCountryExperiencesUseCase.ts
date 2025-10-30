import { FutureData } from "../../entities/Future";
import { CountryExperience } from "../../entities/region/CountryExperience";
import { CountryExperienceRepository } from "../../repositories/region/CountryExperienceRepository";

export class GetCountryExperiencesUseCase {
    constructor(private countryExperienceRepository: CountryExperienceRepository) {}

    public execute(): FutureData<CountryExperience[]> {
        return this.countryExperienceRepository.getAll();
    }
}
