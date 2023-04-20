import { useCallback, useEffect, useState } from "react";
import { Option } from "../../../components/dropdown/Option";
import { useAppContext } from "../../../contexts/app-context";
import { useMultiCountryOptions } from "../../../hooks/countries/useMultiCountryOptions";
import { ResourcesFiltersState } from "./ResourcesFiltersState";

export function useResourcesFilters(category?: string): ResourcesFiltersState {
    const { compositionRoot } = useAppContext();
    const {
        countryOptions: countryFilters,
        selectedCountry: selectedCountryFilter,
        onCountryChange: onChangeCountryFilter,
    } = useMultiCountryOptions();

    const [categoryFilters, setCategoryFilters] = useState<Option[]>([]);
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | undefined>("");

    const [themeFilters, setThemeFilters] = useState<Option[]>([]);
    const [selectedThemeFilter, setSelectedThemeFilter] = useState<string | undefined>();

    const [yearFilters] = useState<Option[]>(years);
    const [selectedYearFilter, setSelectedYearFilter] = useState<string | undefined>();

    useEffect(() => {
        setSelectedCategoryFilter(category);
    }, [categoryFilters, category]);

    useEffect(() => {
        compositionRoot.resources.getCategories.execute().run(
            categories => setCategoryFilters(categories.map(cat => ({ value: slugify(cat.code), text: cat.name }))),
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

const years = [
    { value: "2023", text: "2023" },
    { value: "2022", text: "2022" },
    { value: "2021", text: "2021" },
    { value: "2020", text: "2020" },
];

const slugify = (text: string) =>
    text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
