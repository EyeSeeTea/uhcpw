import { useCallback, useEffect, useState } from "react";
import { ResourceElement } from "../../../../domain/entities/ResourceElement";
import { Option } from "../../../components/dropdown/Option";
import { useAppContext } from "../../../contexts/app-context";
import { ResourcesByTypeState } from "./ResourcesByTypeState";

export type ResourceType = "news" | "multimedia" | "country-analysis" | "comparative-analysis";

export function useResourcesByType(type: ResourceType): ResourcesByTypeState {
    const { compositionRoot } = useAppContext();

    const [items, setItems] = useState<ResourceElement[]>(comparativeAnalysis);

    const [countryFilters, setCountryFilters] = useState<Option[]>([]);
    const [selectedCountryFilter, setSelectedCountryFilter] = useState<string | undefined>();

    const [categoryFilters] = useState<Option[]>(categoriesFilters);
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

const categoriesFilters = [
    { value: "1", text: "Category 1" },
    { value: "2", text: "Category 2" },
];

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

const comparativeAnalysis: ResourceElement[] = [
    {
        kind: "comparative-analysis",
        text: "text example 1 text example 1",
        theme: "Resilience and financial sustainability",
        image: "https://apps.who.int/iris/bitstream/handle/10665/44846/9789241564472_eng.pdf.jpg",
        languages: ["English"],
        year: "2022",
    },
    {
        kind: "comparative-analysis",
        text: "text example 1 text example 1",
        theme: "Spending on health",
        image: "https://apps.who.int/iris/bitstream/handle/10665/44846/9789241564472_eng.pdf.jpg",
        languages: ["English"],
        year: "2022",
    },
    {
        kind: "comparative-analysis",
        text: "text example 1 text example 1",
        theme: "Resilience and financial sustainability",
        image: "https://apps.who.int/iris/bitstream/handle/10665/44846/9789241564472_eng.pdf.jpg",
        languages: ["English"],
        year: "2022",
    },
    {
        kind: "comparative-analysis",
        text: "text example 1 text example 1",
        theme: "Resilience and financial sustainability",
        image: "https://apps.who.int/iris/bitstream/handle/10665/44846/9789241564472_eng.pdf.jpg",
        languages: ["English"],
        year: "2022",
    },
    {
        kind: "comparative-analysis",
        text: "text example 1 text example 1",
        theme: "Spending on health",
        image: "https://apps.who.int/iris/bitstream/handle/10665/44846/9789241564472_eng.pdf.jpg",
        languages: ["English"],
        year: "2022",
    },
    {
        kind: "comparative-analysis",
        text: "text example 1 text example 1",
        theme: "Resilience and financial sustainability",
        image: "https://apps.who.int/iris/bitstream/handle/10665/44846/9789241564472_eng.pdf.jpg",
        languages: ["English"],
        year: "2022",
    },
    {
        kind: "comparative-analysis",
        text: "text example 1 text example 1",
        theme: "Resilience and financial sustainability",
        image: "https://apps.who.int/iris/bitstream/handle/10665/44846/9789241564472_eng.pdf.jpg",
        languages: ["English"],
        year: "2022",
    },
    {
        kind: "comparative-analysis",
        text: "text example 1 text example 1",
        theme: "Spending on health",
        image: "https://apps.who.int/iris/bitstream/handle/10665/44846/9789241564472_eng.pdf.jpg",
        languages: ["English"],
        year: "2022",
    },
    {
        kind: "comparative-analysis",
        text: "text example 1 text example 1",
        theme: "Resilience and financial sustainability",
        image: "https://apps.who.int/iris/bitstream/handle/10665/44846/9789241564472_eng.pdf.jpg",
        languages: ["English"],
        year: "2022",
    },
    {
        kind: "comparative-analysis",
        text: "text example 1 text example 1",
        theme: "Resilience and financial sustainability",
        image: "https://apps.who.int/iris/bitstream/handle/10665/44846/9789241564472_eng.pdf.jpg",
        languages: ["English"],
        year: "2022",
    },
    {
        kind: "comparative-analysis",
        text: "text example 1 text example 1",
        theme: "Spending on health",
        image: "https://apps.who.int/iris/bitstream/handle/10665/44846/9789241564472_eng.pdf.jpg",
        languages: ["English"],
        year: "2022",
    },
    {
        kind: "comparative-analysis",
        text: "text example 1 text example 1",
        theme: "Resilience and financial sustainability",
        image: "https://apps.who.int/iris/bitstream/handle/10665/44846/9789241564472_eng.pdf.jpg",
        languages: ["English"],
        year: "2022",
    },
];
