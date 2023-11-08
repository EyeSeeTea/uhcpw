import { useCallback, useEffect, useState } from "react";
import { generateYears } from "../../../../domain/usecases/utils/generateYears";
import { Option } from "../../../components/dropdown/Option";
import { useAppContext } from "../../../contexts/app-context";
import { ResourcesFiltersState } from "./ResourcesFiltersState";
import { useMultiCountryOptionsV2 } from "../../../common/hooks/countries/useMultiCountryOptionsV2";

export function useResourcesFilters(category?: string, countries?: string[], theme?: string): ResourcesFiltersState {
    const { compositionRoot, themes } = useAppContext();
    const countryFilter = useMultiCountryOptionsV2(countries);

    const [searchTerm, setSearchTerm] = useState<string>("");

    const [categoryFilters, setCategoryFilters] = useState<Option[]>([]);
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | undefined>("");

    const [themeFilters, setThemeFilters] = useState<Option[]>([]);
    const [selectedThemeFilter, setSelectedThemeFilter] = useState<string | undefined>();

    const [yearFilters, setYearFilters] = useState<Option[]>([]);
    const [selectedYearFilter, setSelectedYearFilter] = useState<string[] | undefined>();

    useEffect(() => {
        setSelectedCategoryFilter(category);
        setSelectedThemeFilter(theme);

        if (countries?.length === 0) {
            countryFilter.onSelectedChange([]);
        }
    }, [category, countries, countryFilter, theme]);

    useEffect(() => {
        compositionRoot.resources.getCategories.execute().run(
            categories => setCategoryFilters(categories.map(cat => ({ value: cat.code, text: cat.name }))),
            () => {
                setCategoryFilters([]);
            }
        );
    }, [compositionRoot.resources]);

    useEffect(() => {
        setThemeFilters(themes.map(theme => ({ value: theme.code, text: theme.name })));
    }, [themes]);

    useEffect(() => {
        setYearFilters(generateYears(new Date().getFullYear()).map(year => ({ value: year.id, text: year.id })));
    }, []);

    const onSearchTermChange = useCallback((value: string) => {
        setSearchTerm(value);
    }, []);

    const onChangeCategoryFilter = useCallback((value: string | undefined) => {
        setSelectedCategoryFilter(value);
    }, []);

    const onChangeThemeFilter = useCallback((value: string | undefined) => {
        setSelectedThemeFilter(value);
    }, []);

    const onChangeYearFilter = useCallback((value: string[] | undefined) => {
        setSelectedYearFilter(value);
    }, []);

    return {
        search: {
            term: searchTerm,
            onTermChange: onSearchTermChange,
        },
        country: countryFilter,
        category: {
            options: categoryFilters,
            selected: selectedCategoryFilter,
            onSelectedChange: onChangeCategoryFilter,
        },
        theme: {
            options: themeFilters,
            selected: selectedThemeFilter,
            onSelectedChange: onChangeThemeFilter,
        },
        year: {
            options: yearFilters,
            selected: selectedYearFilter,
            onSelectedChange: onChangeYearFilter,
        },
    };
}
