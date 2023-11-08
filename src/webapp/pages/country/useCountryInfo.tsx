import { useAppContext } from "../../contexts/app-context";
import { Country } from "../../../domain/entities/Country";

export function useCountryInfo(countryId: string): Country | undefined {
    const { countries } = useAppContext();

    return countries.find(country => country.id === countryId);
}
