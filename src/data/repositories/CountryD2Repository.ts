import { Country } from "../../domain/entities/Country";
import { Future, FutureData } from "../../domain/entities/Future";
import { CountryRepository } from "../../domain/repositories/CountryRepository";
import { D2Api } from "../../types/d2-api";

export class CountryD2Repository implements CountryRepository {
    constructor(private api: D2Api) {}

    public get(): FutureData<Country[]> {
        return Future.success([
            {
                name: "Madrid",
                description: "Madrid, Spain",
                color: "red",
                coordinates: [-3.70256, 40.4165],
            },
            {
                name: "Lisbon",
                description: "Lisbon, Portugal",
                color: "green",
                coordinates: [-9.13333, 38.71667],
            },
        ]);
    }
}
