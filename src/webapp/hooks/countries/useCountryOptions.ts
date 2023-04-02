import { useCallback, useEffect, useState } from "react";
import { Option } from "../../components/dropdown/Option";
import { useAppContext } from "../../contexts/app-context";

export function useCountryOptions() {
    const { compositionRoot } = useAppContext();
    const [countryOptions, setCountriesOptions] = useState<Option<string>[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<string | undefined>(undefined);

    useEffect(() => {
        compositionRoot.countries.get.execute().run(
            countries => {
                setCountriesOptions(countries.map(country => ({ value: country.code, text: country.name })));
            },
            () => {
                setCountriesOptions([]);
            }
        );
    }, [compositionRoot.countries]);

    const onCountryChange = useCallback((country: string | undefined) => {
        setSelectedCountry(country);
    }, []);

    return { countryOptions, selectedCountry, onCountryChange };
}
