import { Country } from "../../../../../domain/entities/Country";
import { Region } from "../../../../../domain/entities/region/Region";
import { getColorOfRegionByRegionCode } from "../../../../pages/regional-page/getColorOfRegion";
import { countryPalette, EU27Color } from "../palettes/countryPalette";

export function createCountrySerie(countries: Country[], regions: Region[], serie: { id: string; name: string }) {
    const country = countries.find(country => country.id === serie.id);
    const regionCode = regions.find(region => region.id === serie.id || region.linkedOrgUnitId === serie.id)?.code;

    const countryColor = country ? countryPalette[countries.indexOf(country)] : undefined;
    const regionColor = regionCode ? getColorOfRegionByRegionCode(regionCode) : undefined;

    return {
        id: serie.id,
        name: country?.code || regionCode || serie.name,
        color: countryColor || regionColor || EU27Color,
        marker: { enabled: true, symbol: "circle" },
        dataLabels: {
            enabled: false,
        },
    };
}
