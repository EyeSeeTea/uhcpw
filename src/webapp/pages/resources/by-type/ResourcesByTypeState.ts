import { Resource } from "../../../../domain/entities/resources/Resource";
import { Option } from "../../../components/dropdown/Option";

export type ResourcesByTypeState = {
    title: string;
    filters: ResourcesFiltersState;
    items: Resource[];
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
