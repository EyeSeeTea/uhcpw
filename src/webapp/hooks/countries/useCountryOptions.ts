import { useEffect, useState } from "react";
import { Option } from "../../components/dropdown/Dropdown";
import { useAppContext } from "../../contexts/app-context";

export function useCountryOptions() {
    const { compositionRoot } = useAppContext();
    const [countryOptions, setCountriesOptions] = useState<Option<string>[]>([]);

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

    return countryOptions;
}
