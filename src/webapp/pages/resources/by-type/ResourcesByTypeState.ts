import { ResourceElement } from "../../../../domain/entities/ResourceElement";
import { Option } from "../../../components/dropdown/Option";

export type ResourcesByTypeState = {
    filters: ResourcesFiltersState;
    items: ResourceElement[];
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
