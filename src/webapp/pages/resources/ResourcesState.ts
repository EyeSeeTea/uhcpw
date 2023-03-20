import { Option } from "../../components/dropdown/Option";

export type ResourcesState = {
    countryAnalysis: CountryAnalysisItem[];
    filters: ResourcesFiltersState;
    comparativeAnalysis: ComparativeAnalysisState[];
    news: NewsItem[];
    multimedia: MultimediaItem[];
};

export type ResourcesFiltersState = {
    countryFilters: Option<string>[];
    selectedCountryFilter: string | undefined;
    onChangeCountryFilter: (value: string | undefined) => void;
    categoryFilters: Option<string>[];
    selectedCategoryFilter: string | undefined;
    onChangeCategoryFilter: (value: string | undefined) => void;
    themeFilters: Option<string>[];
    selectedThemeFilter: string | undefined;
    onChangeThemeFilter: (value: string | undefined) => void;
    yearFilters: Option<string>[];
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

export type MultimediaItem = {
    title: string;
    img: string;
    date: string;
};
