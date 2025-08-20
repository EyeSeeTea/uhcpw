import { Country } from "../entities/Country";
import { FutureData } from "../entities/Future";

export interface CountryRepository {
    get(): FutureData<Country[]>;
}
