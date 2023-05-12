import { useCallback, useEffect, useState } from "react";
import { generateYears } from "../../../../domain/usecases/utils/generateYears";
import { Option } from "../../../components/dropdown/Option";
import { useAppContext } from "../../../contexts/app-context";
import { useMultiCountryOptions } from "../../../common/hooks/countries/useMultiCountryOptions";
import { ResourcesFiltersState } from "./ResourcesFiltersState";

export function useResourcesFilters(category?: string): ResourcesFiltersState {
    const { compositionRoot } = useAppContext();
    const {
        countryOptions: countryFilters,
        selectedCountry: selectedCountryFilter,
        onCountryChange: onChangeCountryFilter,
    } = useMultiCountryOptions();

    const [searchTerm, setSearchTerm] = useState<string>("");

    const [categoryFilters, setCategoryFilters] = useState<Option[]>([]);
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | undefined>("");

    const [themeFilters, setThemeFilters] = useState<Option[]>([]);
    const [selectedThemeFilter, setSelectedThemeFilter] = useState<string | undefined>();

    const [yearFilters, setYearFilters] = useState<Option[]>([]);
    const [selectedYearFilter, setSelectedYearFilter] = useState<string | undefined>();

    useEffect(() => {
        setSelectedCategoryFilter(category);
    }, [categoryFilters, category]);

    useEffect(() => {
        compositionRoot.resources.getCategories.execute().run(
            categories => setCategoryFilters(categories.map(cat => ({ value: cat.code, text: cat.name }))),
            () => {
                setCategoryFilters([]);
            }
        );
    }, [compositionRoot.resources]);

    useEffect(() => {
        compositionRoot.resources.getThemes.execute().run(
            themes => setThemeFilters(themes.map(theme => ({ value: theme.code, text: theme.name }))),
            () => {
                setThemeFilters([]);
            }
        );
    }, [compositionRoot.resources]);

    useEffect(() => {
        setYearFilters(generateYears().map(year => ({ value: year.id, text: year.id })));
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

    const onChangeYearFilter = useCallback((value: string | undefined) => {
        setSelectedYearFilter(value);
    }, []);

    return {
        searchTerm,
        onSearchTermChange,
        countryFilters,
        selectedCountryFilter,
        onChangeCountryFilter,
        categoryFilters,
        selectedCategoryFilter,
        onChangeCategoryFilter,
        themeFilters,
        selectedThemeFilter,
        onChangeThemeFilter,
        yearFilters,
        selectedYearFilter,
        onChangeYearFilter,
    };
}
