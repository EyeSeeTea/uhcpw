import { Country } from "../../../../../domain/entities/Country";
import { getEU27Label } from "../charts/utils/getEU27Label";
import { countryPalette, EU27Color } from "../palettes/countryPalette";

export function createCountrySerie(countries: Country[], serie: { id: string; name: string }) {
    const country = countries.find(country => country.id === serie.id);
    const eur27Code = getEU27Label(serie.id);
    const color = country ? countryPalette[countries.indexOf(country)] : eur27Code ? EU27Color : undefined;

    return {
        id: serie.id,
        name: country?.code || eur27Code || serie.name,
        color: color,
        marker: { enabled: true, symbol: "circle" },
        dataLabels: {
            enabled: false,
        },
    };
}
