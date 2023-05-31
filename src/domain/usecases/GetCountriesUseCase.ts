import { Country } from "../entities/Country";
import { FutureData } from "../entities/Future";
import { CountryRepository } from "../repositories/CountryRepository";

export class GetCountriesUseCase {
    constructor(private countryRepository: CountryRepository) {}

    public execute(): FutureData<Country[]> {
        return this.countryRepository.get();
    }
}
