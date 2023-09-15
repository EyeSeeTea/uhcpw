import { Analytics } from "../../../domain/entities/indicator-explorer/Analytics";
import { LegendSet } from "../../../domain/entities/indicator-explorer/LegendSet";
import { Visualization } from "../../../domain/entities/indicator-explorer/Visualization";
import { VisualizationCustomization } from "./visualizationCustomizations";

export type ChartDataLoaded = {
    kind: "Loaded";
    visualization: Visualization;
    analytics: Analytics;
    legendSets: LegendSet[];
    customization?: VisualizationCustomization;
};

export type ChartDataLoading = {
    kind: "Loading";
};

export type ChartDataError = {
    kind: "Error";
    message: string;
};

export type ChartData = ChartDataLoaded | ChartDataLoading | ChartDataError;
