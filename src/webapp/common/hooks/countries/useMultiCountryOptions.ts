import { useCallback, useEffect, useState } from "react";
import { Option } from "../../../components/dropdown/Option";
import { useAppContext } from "../../../contexts/app-context";

// NOTICE: This hook is not used
export function useMultiCountryOptions() {
    const { countries } = useAppContext();
    const [countryOptions, setCountriesOptions] = useState<Option<string>[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<string[] | undefined>(undefined);

    useEffect(() => {
        setCountriesOptions(countries.map(country => ({ value: country.id, text: country.name })));
    }, [countries]);

    const onCountryChange = useCallback((country: string[] | undefined) => {
        setSelectedCountry(country);
    }, []);

    return { countryOptions, selectedCountry, onCountryChange };
}
