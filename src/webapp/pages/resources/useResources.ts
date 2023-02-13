import { DropdownItem } from "@eyeseetea/d2-ui-components";
import { useCallback, useEffect, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import { CountryAnalysisState, ResourcesState } from "./ResourcesState";

export function useResources(): ResourcesState {
    const { compositionRoot } = useAppContext();

    const [countryAnalysis, setCountryAnalysis] = useState<CountryAnalysisState[]>(countryAnalysisOriginals);

    const [countryFilters, setCountryFilters] = useState<DropdownItem[]>([]);
    const [selectedCountryFilter, setSelectedCountryFilter] = useState<string | undefined>();

    const [categoryFilters] = useState<DropdownItem[]>(categoriesFilters);
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | undefined>();

    const [themeFilters] = useState<DropdownItem[]>(themes);
    const [selectedThemeFilter, setSelectedThemeFilter] = useState<string | undefined>();

    const [yearFilters] = useState<DropdownItem[]>(years);
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
        setCountryAnalysis(
            countryAnalysisOriginals.filter(
                item =>
                    (!selectedCategoryFilter || item.category === selectedCategoryFilter) &&
                    (!selectedThemeFilter || item.theme === selectedThemeFilter) &&
                    (!selectedCountryFilter || item.code === selectedCountryFilter) &&
                    (!selectedYearFilter || item.year === selectedYearFilter)
            )
        );
    }, [selectedCategoryFilter, selectedThemeFilter, selectedCountryFilter, selectedYearFilter]);

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
        countryAnalysis,
        comparativeAnalysis,
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

const countryAnalysisOriginals: CountryAnalysisState[] = [
    {
        name: "Albania",
        image: "https://flagpedia.net/data/flags/h160/al.webp",
        code: "ALB",
        category: "1",
        theme: "1",
        year: "2023",
    },
    {
        name: "Austria",
        image: "https://flagpedia.net/data/flags/w1160/at.png",
        code: "AUT",
        category: "2",
        theme: "2",
        year: "2022",
    },
    {
        name: "Bulgaria",
        image: "https://flagpedia.net/data/flags/h160/bg.webp",
        code: "BGR",
        category: "2",
        theme: "2",
        year: "2022",
    },
    {
        name: "Croacia",
        image: "https://flagpedia.net/data/flags/h160/hr.webp",
        code: "HRV",
        category: "2",
        theme: "2",
        year: "2022",
    },
    {
        name: "Cyprus",
        image: "https://flagpedia.net/data/flags/h160/cy.webp",
        code: "CYP",
        category: "2",
        theme: "1",
        year: "2022",
    },
    {
        name: "Estonia",
        image: "https://flagpedia.net/data/flags/h160/ee.webp",
        code: "EST",
        category: "2",
        theme: "1",
        year: "2022",
    },
    {
        name: "Finland",
        image: "https://flagpedia.net/data/flags/h160/fi.webp",
        code: "",
        category: "2",
        theme: "2",
        year: "2022",
    },
    {
        name: "Georgia",
        image: "https://flagpedia.net/data/flags/h160/ge.webp",
        code: "FIN",
        category: "2",
        theme: "2",
        year: "2020",
    },
    {
        name: "Germany",
        image: "https://flagpedia.net/data/flags/h160/de.webp",
        code: "DEU",
        category: "2",
        theme: "2",
        year: "2021",
    },
    {
        name: "Ireland",
        image: "https://flagpedia.net/data/flags/h160/ie.webp",
        code: "IRL",
        category: "2",
        theme: "1",
        year: "2020",
    },
];

const comparativeAnalysis = [
    {
        text: "text example 1 text example 1",
        tag: "Resilience and financial sustainability",
        image: "https://apps.who.int/iris/bitstream/handle/10665/44846/9789241564472_eng.pdf.jpg",
        language: "English",
        year: "2022",
    },
    {
        text: "text example 1 text example 1",
        tag: "Sprending on health",
        image: "https://apps.who.int/iris/bitstream/handle/10665/44846/9789241564472_eng.pdf.jpg",
        language: "English",
        year: "2022",
    },
    {
        text: "text example 1 text example 1",
        tag: "Resilience and financial sustainability",
        image: "https://apps.who.int/iris/bitstream/handle/10665/44846/9789241564472_eng.pdf.jpg",
        language: "English",
        year: "2022",
    },
];
