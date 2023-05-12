import { Analytics } from "../../../domain/entities/indicator-explorer/Analytics";
import { Visualization } from "../../../domain/entities/indicator-explorer/Visualization";
import { CountryFilterState, YearFilterState } from "../../common/state/state";
import { Option } from "../../components/dropdown/Option";

export type IndicatorExplorerState = {
    filters: IndicatorExplorerFiltersState;
    visualization?: Visualization;
    analytics?: Analytics;
    onGetChart: () => void;
};

export type IndicatorExplorerFiltersState = {
    country: CountryFilterState;
    category: CategoryFilterState;
    year: YearFilterState;
};

export type CategoryFilterState = {
    options: Option<string>[];
    selected: string | undefined;
    onSelectedChange: (value: string | undefined) => void;
};
