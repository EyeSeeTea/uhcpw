import { useCallback, useEffect, useState } from "react";
import { Option } from "../../components/dropdown/Option";
import { useAppContext } from "../../contexts/app-context";
import { useMultiCountryOptions } from "../../hooks/countries/useMultiCountryOptions";
import { IndicatorExplorerState } from "./IndicatorExplorerState";

export function useIndicatorExplorer(): IndicatorExplorerState {
    const { compositionRoot } = useAppContext();
    const { countryOptions, selectedCountry, onCountryChange } = useMultiCountryOptions();

    const [categoryFilters] = useState<Option[]>(categoriesFilters);
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | undefined>();

    const [yearFilters, setYearsFilters] = useState<Option[]>([]);
    const [selectedYearFilter, setSelectedYearFilter] = useState<string | undefined>();

    const onChangeCategoryFilter = useCallback((value: string | undefined) => {
        setSelectedCategoryFilter(value);
    }, []);

    const onChangeYearFilter = useCallback((value: string | undefined) => {
        setSelectedYearFilter(value);
    }, []);

    useEffect(() => {
        compositionRoot.indicatorExplorer.getYears.execute().run(
            years => {
                setYearsFilters(years.map(year => ({ value: year.id, text: year.id })));
            },
            () => {
                setYearsFilters([]);
            }
        );
    }, [compositionRoot.indicatorExplorer]);

    return {
        filters: {
            countryFilters: countryOptions,
            selectedCountryFilter: selectedCountry,
            onChangeCountryFilter: onCountryChange,
            categoryFilters,
            selectedCategoryFilter,
            onChangeCategoryFilter,
            yearFilters,
            selectedYearFilter,
            onChangeYearFilter,
        },
    };
}

const categoriesFilters = [
    { value: "1", text: "Category 1" },
    { value: "2", text: "Category 2" },
];
