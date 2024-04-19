import { Country, EU27 } from "../../../../../domain/entities/Country";
import { countryPalette, EU27Color } from "../palettes/countryPalette";

const EU27_LABEL = "EU27";

export function createCountrySerie(countries: Country[], serie: { id: string; name: string }) {
    const country = countries.find(country => country.id === serie.id);
    const eur27Code = EU27 === serie.id ? EU27_LABEL : undefined;
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
