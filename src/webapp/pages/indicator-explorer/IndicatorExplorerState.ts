import { Visualization } from "../../../domain/entities/Visualization";
import { Option } from "../../components/dropdown/Option";

export type IndicatorExplorerState = {
    filters: IndicatorExplorerFiltersState;
    visualization?: Visualization;
};

export type IndicatorExplorerFiltersState = {
    countryFilters: Option<string>[];
    selectedCountryFilter: string[] | undefined;
    onChangeCountryFilter: (value: string[] | undefined) => void;
    categoryFilters: Option<string>[];
    selectedCategoryFilter: string | undefined;
    onChangeCategoryFilter: (value: string | undefined) => void;
    yearFilters: Option<string>[];
    selectedYearFilter: string | undefined;
    onChangeYearFilter: (value: string | undefined) => void;
};
