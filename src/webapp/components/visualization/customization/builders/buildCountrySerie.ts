import { Country } from "../../../../../domain/entities/Country";
import { countryPalette } from "../palettes/countryPalette";

export function createCountrySerie(countries: Country[], serie: { id: string; name: string }) {
    const country = countries.find(country => country.id === serie.id);

    const color = country ? countryPalette[countries.indexOf(country)] : undefined;

    return {
        id: serie.id,
        name: country?.code || serie.name,
        color,
        marker: { enabled: true, symbol: "circle" },
        dataLabels: {
            enabled: false,
        },
    };
}
