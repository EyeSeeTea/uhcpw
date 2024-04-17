import { CountriesRegion } from "../entities/Country";
import { FutureData } from "../entities/Future";
import { CountryRepository } from "../repositories/CountryRepository";

export class GetEurCountriesRegionUseCase {
    constructor(private countryRepository: CountryRepository) {}

    public execute(): FutureData<CountriesRegion | undefined> {
        return this.countryRepository.getEurCountriesRegion();
    }
}
