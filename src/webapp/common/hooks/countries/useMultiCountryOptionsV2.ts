import { useCallback, useEffect, useState } from "react";
import i18n from "../../../../locales";
import { CountryOption } from "../../../components/country-selector/CountrySelector";
import { useAppContext } from "../../../contexts/app-context";

export function useMultiCountryOptionsV2(selectedCountries?: string[], countryOptionsToSelect?: string[]) {
    const { countries } = useAppContext();
    const [options, setOptions] = useState<CountryOption[]>([]);
    const [selected, setSelected] = useState<string[] | undefined>([]);

    useEffect(() => {
        setSelected(selectedCountries);
    }, [selectedCountries]);

    useEffect(() => {
        const countryOptions = countries.map(country => ({
            id: country.id,
            name: country.name,
            code: country.code,
            parents: [
                { id: "all", name: i18n.t("All countries") },
                ...country.parents.filter(parent => !parent.name.includes("income")),
            ],
        }));

        setOptions(
            countryOptionsToSelect
                ? countryOptions.filter(({ id }) => countryOptionsToSelect?.includes(id))
                : countryOptions
        );
    }, [countries, countryOptionsToSelect]);

    const onSelectedChange = useCallback((country: string[] | undefined) => {
        setSelected(country);
    }, []);

    return { options, selected, onSelectedChange };
}
