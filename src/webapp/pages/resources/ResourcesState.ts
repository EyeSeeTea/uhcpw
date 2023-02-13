import { DropdownItem } from "@eyeseetea/d2-ui-components";

export type ResourcesState = {
    countryAnalysis: CountryAnalysisItem[];
    filters: ResourcesFiltersState;
    comparativeAnalysis: ComparativeAnalysisState[];
    news: NewsItem[];
};

export type ResourcesFiltersState = {
    countryFilters: DropdownItem<string>[];
    selectedCountryFilter: string | undefined;
    onChangeCountryFilter: (value: string | undefined) => void;
    categoryFilters: DropdownItem<string>[];
    selectedCategoryFilter: string | undefined;
    onChangeCategoryFilter: (value: string | undefined) => void;
    themeFilters: DropdownItem<string>[];
    selectedThemeFilter: string | undefined;
    onChangeThemeFilter: (value: string | undefined) => void;
    yearFilters: DropdownItem<string>[];
    selectedYearFilter: string | undefined;
    onChangeYearFilter: (value: string | undefined) => void;
};

export type CountryAnalysisItem = {
    name: string;
    image: string;
    code: string;
    category: string;
    theme: string;
    year: string;
};

export type ComparativeAnalysisState = {
    text: string;
    tag: string;
    image: string;
    language: string;
    year: string;
};

export type NewsItem = {
    title: string;
    img: string;
    date: string;
};
