import { Analytics } from "../../../domain/entities/indicator-explorer/Analytics";
import { LegendSet } from "../../../domain/entities/indicator-explorer/LegendSet";
import { Visualization } from "../../../domain/entities/indicator-explorer/Visualization";
import { CountryFilterState, OptionsFilterState, OptionsMultiFilterState } from "../../common/state/state";

export type IndicatorExplorerState = {
    filters: IndicatorExplorerFiltersState;
    chartData?: ChartData;
    onGetChart: () => void;
};

export type ChartDataLoaded = {
    kind: "Loaded";
    visualization: Visualization;
    analytics: Analytics;
    legendSets: LegendSet[];
};

export type ChartDataLoading = {
    kind: "Loading";
};

export type ChartDataError = {
    kind: "Error";
    message: string;
};

export type ChartData = ChartDataLoaded | ChartDataLoading | ChartDataError;

export type IndicatorExplorerFiltersState = {
    country: CountryFilterState;
    category: OptionsFilterState;
    year: OptionsMultiFilterState;
};
