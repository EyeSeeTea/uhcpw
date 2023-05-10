import { useCallback, useEffect, useState } from "react";
import i18n from "../../../locales";
import { CountryOption } from "../../components/country-selector/CountrySelector";
import { useAppContext } from "../../contexts/app-context";

export function useMultiCountryOptionsV2() {
    const { compositionRoot } = useAppContext();
    const [countryOptions, setCountriesOptions] = useState<CountryOption[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<string[] | undefined>(undefined);
    const [groupedByIncome, setGroupedByIncome] = useState(false);

    useEffect(() => {
        compositionRoot.countries.get.execute().run(
            countries => {
                const countryOptions = countries.map(country => ({
                    id: country.id,
                    name: country.name,
                    parents: [
                        { id: "all", name: i18n.t("All countries") },
                        ...country.parents.filter(parent =>
                            groupedByIncome ? parent.name.includes("income") : !parent.name.includes("income")
                        ),
                    ],
                }));

                setCountriesOptions(countryOptions);
            },
            () => {
                setCountriesOptions([]);
            }
        );
    }, [compositionRoot.countries, groupedByIncome]);

    const onCountryChange = useCallback((country: string[] | undefined) => {
        setSelectedCountry(country);
    }, []);

    const onGroupedByIncomeChange = useCallback((value: boolean) => {
        setGroupedByIncome(value);
    }, []);

    return { countryOptions, selectedCountry, onCountryChange, groupedByIncome, onGroupedByIncomeChange };
}
