import {
    BosniaAndHerzegovina,
    FederationOfBosniaAndHerzegovina,
    RepublikaSrpska,
} from "../../../domain/entities/Country";
import { Id } from "../../../domain/entities/Ref";

const filterBosniaAndHerzegovina = (countries: Id[]) => {
    return countries.filter(countryId => countryId !== BosniaAndHerzegovina);
};

const addBosniaAndHerzegovinaSubRegions = (countries: Id[]) => {
    return [...countries, FederationOfBosniaAndHerzegovina, RepublikaSrpska];
};

export const manageBIHInCountries = (
    action: "addSubRegions" | "filterBIH" | "addSubRegionsAndFilterBIH",
    countries: Id[]
) => {
    switch (action) {
        case "addSubRegions":
            return addBosniaAndHerzegovinaSubRegions(countries);
        case "filterBIH":
            return filterBosniaAndHerzegovina(countries);
        case "addSubRegionsAndFilterBIH":
            return addBosniaAndHerzegovinaSubRegions(filterBosniaAndHerzegovina(countries));
        default:
            return countries;
    }
};
