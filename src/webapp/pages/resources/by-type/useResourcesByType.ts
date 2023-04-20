import { useCallback, useEffect, useState } from "react";
import { Resource } from "../../../../domain/entities/resources/Resource";
import { Option } from "../../../components/dropdown/Option";
import { useAppContext } from "../../../contexts/app-context";
import { ResourcesByTypeState } from "./ResourcesByTypeState";

export function useResourcesByType(category: string): ResourcesByTypeState {
    const { compositionRoot } = useAppContext();

    const [items, setItems] = useState<Resource[]>([]);

    const [title, setTitle] = useState<string>("");

    const [countryFilters, setCountryFilters] = useState<Option[]>([]);
    const [selectedCountryFilter, setSelectedCountryFilter] = useState<string | undefined>();

    const [categoryFilters, setCategoryFilters] = useState<Option[]>([]);
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | undefined>(category);

    const [themeFilters, setThemeFilters] = useState<Option[]>([]);
    const [selectedThemeFilter, setSelectedThemeFilter] = useState<string | undefined>();

    const [yearFilters] = useState<Option[]>(years);
    const [selectedYearFilter, setSelectedYearFilter] = useState<string | undefined>();

    useEffect(() => {
        const title = categoryFilters.find(cat => cat.value === selectedCategoryFilter)?.text || "";

        setTitle(title);
    }, [categoryFilters, selectedCategoryFilter]);

    useEffect(() => {
        compositionRoot.countries.get.execute().run(
            countries => setCountryFilters(countries.map(country => ({ value: country.code, text: country.name }))),
            () => {
                setCountryFilters([]);
            }
        );
    }, [compositionRoot.countries]);

    useEffect(() => {
        compositionRoot.resources.get.execute(category).run(
            items => setItems(items),
            () => {
                setItems([]);
            }
        );
    }, [compositionRoot.resources, category]);

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
        title,
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
