import { useCallback, useEffect, useMemo, useState } from "react";
import i18n from "../../../../locales";
import { useAppContext } from "../../../contexts/app-context";

export function useMultiCountryOptionsFake(
    selectedCountries?: string[],
    countryFilterIds?: string[],
    maxCountriesToSelect?: number
) {
    const { countries } = useAppContext();
    const [selected, setSelected] = useState<string[] | undefined>([]);
    const [groupedByIncome, setGroupedByIncome] = useState(false);

    useEffect(() => {
        setSelected(selectedCountries);
    }, [selectedCountries]);

    const options = useMemo(() => {
        const filteredCountries = countries.filter(
            country => countryFilterIds === undefined || countryFilterIds.includes(country.id)
        );

        const countryOptions = filteredCountries.map(country => ({
            id: country.id,
            name: country.name,
            code: country.code,
            parents: [
                { id: "all", name: i18n.t("All countries and areas") },
                ...country.parents.filter(parent =>
                    groupedByIncome ? parent.name.includes("income") : !parent.name.includes("income")
                ),
            ],
        }));

        return countryOptions;
    }, [countries, countryFilterIds, groupedByIncome]);

    const onSelectedChange = useCallback(
        (toSelect: string[] | undefined) => {
            if (toSelect !== undefined && maxCountriesToSelect !== undefined && toSelect?.length > maxCountriesToSelect)
                return;

            setSelected(toSelect);
        },
        [maxCountriesToSelect]
    );

    const onGroupedByIncomeChange = useCallback((value: boolean) => {
        setGroupedByIncome(value);
    }, []);

    return { options, selected, onSelectedChange, groupedByIncome, onGroupedByIncomeChange };
}
