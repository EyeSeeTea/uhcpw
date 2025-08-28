import { useAppContext } from "../../contexts/app-context";
import { Country } from "../../../domain/entities/Country";

export function useCountryInfo(countryId: string): Country | undefined {
    const { countriesAndSubregions } = useAppContext();

    return countriesAndSubregions.find(({ id }) => id === countryId);
}
