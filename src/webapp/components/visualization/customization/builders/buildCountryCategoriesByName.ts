import { Country } from "../../../../../domain/entities/Country";

export function buildCountryCategoriesByName(countries: Country[], categories: string[]) {
    return categories.map(category => {
        const country = countries.find(country => country.longName === category);

        return country?.code || category;
    });
}
