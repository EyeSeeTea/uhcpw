import { useCallback, useEffect, useState } from "react";
import { Option } from "../../../components/dropdown/Option";
import { useAppContext } from "../../../contexts/app-context";

const ID_BULGARIA = "AjeCGGb8H76";

export function useCountryOptionsOnlyBulgaria() {
    const { countries } = useAppContext();
    const [countryOptions, setCountriesOptions] = useState<Option<string>[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<string | undefined>(undefined);

    useEffect(() => {
        setCountriesOptions(
            countries
                .filter(country => country.id === ID_BULGARIA)
                .map(country => ({ value: country.id, text: country.name }))
        );
    }, [countries]);

    const onCountryChange = useCallback((country: string | undefined) => {
        setSelectedCountry(country);
    }, []);

    return { countryOptions, selectedCountry, onCountryChange };
}
