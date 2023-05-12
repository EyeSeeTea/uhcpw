import { Analytics } from "../../../domain/entities/indicator-explorer/Analytics";
import { Visualization } from "../../../domain/entities/indicator-explorer/Visualization";
import { CountryOption } from "../../components/country-selector/CountrySelector";
import { Option } from "../../components/dropdown/Option";

export type IndicatorExplorerState = {
    filters: IndicatorExplorerFiltersState;
    visualization?: Visualization;
    analytics?: Analytics;
    onGetChart: () => void;
};

export type IndicatorExplorerFiltersState = {
    country: {
        options: CountryOption[];
        selected: string[] | undefined;
        onSelectedChange: (value: string[] | undefined) => void;
        groupedByIncome: boolean;
        onGroupedByIncomeChange: (value: boolean) => void;
    };
    category: {
        categoryFilters: Option<string>[];
        selectedCategoryFilter: string | undefined;
        onChangeCategoryFilter: (value: string | undefined) => void;
    };
    year: {
        yearFilters: Option<string>[];
        selectedYearFilter: string[] | undefined;
        onChangeYearFilter: (value: string[] | undefined) => void;
    };
};
