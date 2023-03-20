import { useCallback, useState } from "react";
import { Option } from "../../components/dropdown/Option";
import { useCountryOptions } from "../../hooks/countries/useCountryOptions";
import { PolicyExplorerState } from "./PolicyExplorerState";

export function usePolicyExplorer(): PolicyExplorerState {
    const countryOptions = useCountryOptions();
    const [selectedCountryFilter, setSelectedCountryFilter] = useState<string[] | undefined>();

    const [categoryFilters] = useState<Option[]>(categoriesFilters);
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | undefined>();

    const [yearFilters] = useState<Option[]>(years);
    const [selectedYearFilter, setSelectedYearFilter] = useState<string | undefined>();

    const onChangeCountryFilter = useCallback((values: string[] | undefined) => {
        setSelectedCountryFilter(values);
    }, []);

    const onChangeCategoryFilter = useCallback((value: string | undefined) => {
        setSelectedCategoryFilter(value);
    }, []);

    const onChangeYearFilter = useCallback((value: string | undefined) => {
        setSelectedYearFilter(value);
    }, []);

    return {
        filters: {
            countryFilters: countryOptions,
            selectedCountryFilter,
            onChangeCountryFilter,
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

const years = [
    { value: "2023", text: "2023" },
    { value: "2022", text: "2022" },
    { value: "2021", text: "2021" },
    { value: "2020", text: "2020" },
];
