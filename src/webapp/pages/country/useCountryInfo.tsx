import { useAppContext } from "../../contexts/app-context";
import { Country } from "../../../domain/entities/Country";

export function useCountryInfo(countryId: string): Country | undefined {
    const { countriesAndRegions } = useAppContext();

    return countriesAndRegions.find(({ id }) => id === countryId);
}
