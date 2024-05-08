import { Country, CountriesRegion } from "../entities/Country";
import { FutureData } from "../entities/Future";

export interface CountryRepository {
    get(): FutureData<Country[]>;
    getEurCountriesRegion(): FutureData<CountriesRegion | undefined>;
}
