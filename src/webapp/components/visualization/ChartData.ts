import { Country } from "../../../domain/entities/Country";
import { Analytics } from "../../../domain/entities/indicator-explorer/Analytics";
import { LegendSet } from "../../../domain/entities/indicator-explorer/LegendSet";
import { Visualization } from "../../../domain/entities/indicator-explorer/Visualization";
import { ChartCustomization } from "./visualizationCustomizations";

export type ChartDataLoaded = {
    kind: "Loaded";
    visualization: Visualization;
    analytics: Analytics;
    legendSets: LegendSet[];
    customization?: ChartCustomization;
    countries: Country[];
};

export type ChartDataLoading = {
    kind: "Loading";
};

export type ChartDataError = {
    kind: "Error";
    message: string;
};

export type ChartData = ChartDataLoaded | ChartDataLoading | ChartDataError;
