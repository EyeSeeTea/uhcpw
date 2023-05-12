import { Analytics } from "../../../domain/entities/indicator-explorer/Analytics";
import { Visualization } from "../../../domain/entities/indicator-explorer/Visualization";
import { CountryFilterState, OptionsFilterState, OptionsMultiFilterState } from "../../common/state/state";

export type IndicatorExplorerState = {
    filters: IndicatorExplorerFiltersState;
    visualization?: Visualization;
    analytics?: Analytics;
    onGetChart: () => void;
};

export type IndicatorExplorerFiltersState = {
    country: CountryFilterState;
    category: OptionsFilterState;
    year: OptionsMultiFilterState;
};
