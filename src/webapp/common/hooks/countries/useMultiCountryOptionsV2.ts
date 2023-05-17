import { useCallback, useEffect, useState } from "react";
import i18n from "../../../../locales";
import { CountryOption } from "../../../components/country-selector/CountrySelector";
import { useAppContext } from "../../../contexts/app-context";

export function useMultiCountryOptionsV2() {
    const { compositionRoot } = useAppContext();
    const [options, setOptions] = useState<CountryOption[]>([]);
    const [selected, setSelected] = useState<string[] | undefined>(undefined);
    const [groupedByIncome, setGroupedByIncome] = useState(false);

    useEffect(() => {
        compositionRoot.countries.get.execute().run(
            countries => {
                const countryOptions = countries.map(country => ({
                    id: country.id,
                    name: country.name,
                    code: country.code,
                    parents: [
                        { id: "all", name: i18n.t("All countries") },
                        ...country.parents.filter(parent =>
                            groupedByIncome ? parent.name.includes("income") : !parent.name.includes("income")
                        ),
                    ],
                }));

                setOptions(countryOptions);
            },
            () => {
                setOptions([]);
            }
        );
    }, [compositionRoot.countries, groupedByIncome]);

    const onSelectedChange = useCallback((country: string[] | undefined) => {
        setSelected(country);
    }, []);

    const onGroupedByIncomeChange = useCallback((value: boolean) => {
        setGroupedByIncome(value);
    }, []);

    return { options, selected, onSelectedChange, groupedByIncome, onGroupedByIncomeChange };
}
