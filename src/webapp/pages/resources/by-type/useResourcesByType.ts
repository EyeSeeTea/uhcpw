import { useCallback, useEffect, useState } from "react";
import { Resource } from "../../../../domain/entities/Resource";
import { Option } from "../../../components/dropdown/Option";
import { useAppContext } from "../../../contexts/app-context";
import { ResourcesByTypeState } from "./ResourcesByTypeState";

export type ResourceTypeParam = "news" | "multimedia" | "country-analysis" | "comparative-analysis";

export function useResourcesByType(type: ResourceTypeParam): ResourcesByTypeState {
    const { compositionRoot } = useAppContext();

    const [items, setItems] = useState<Resource[]>([]);

    const [countryFilters, setCountryFilters] = useState<Option[]>([]);
    const [selectedCountryFilter, setSelectedCountryFilter] = useState<string | undefined>();

    const [categoryFilters, setCategoryFilters] = useState<Option[]>([]);
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | undefined>();

    const [themeFilters] = useState<Option[]>(themes);
    const [selectedThemeFilter, setSelectedThemeFilter] = useState<string | undefined>();

    const [yearFilters] = useState<Option[]>(years);
    const [selectedYearFilter, setSelectedYearFilter] = useState<string | undefined>();

    useEffect(() => {
        compositionRoot.countries.get.execute().run(
            countries => setCountryFilters(countries.map(country => ({ value: country.code, text: country.name }))),
            () => {
                setCountryFilters([]);
            }
        );
    }, [compositionRoot.countries]);

    useEffect(() => {
        compositionRoot.resources.get.execute("Comparative analysis").run(
            items => setItems(items),
            () => {
                setItems([]);
            }
        );
    }, [compositionRoot.resources, type]);

    useEffect(() => {
        compositionRoot.resources.getCategories.execute().run(
            categories => setCategoryFilters(categories.map(cat => ({ value: cat.code, text: cat.name }))),
            () => {
                setCategoryFilters([]);
            }
        );
    }, [compositionRoot.resources, type]);

    const onChangeCountryFilter = useCallback((value: string | undefined) => {
        setSelectedCountryFilter(value);
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
        filters: {
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
        },
        items,
    };
}

const themes = [
    { value: "1", text: "Theme 1" },
    { value: "2", text: "Theme 2" },
];

const years = [
    { value: "2023", text: "2023" },
    { value: "2022", text: "2022" },
    { value: "2021", text: "2021" },
    { value: "2020", text: "2020" },
];
