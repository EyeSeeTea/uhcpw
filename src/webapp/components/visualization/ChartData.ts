import { Country } from "../../../domain/entities/Country";
import { Analytics } from "../../../domain/entities/indicator-explorer/Analytics";
import { LegendSet } from "../../../domain/entities/indicator-explorer/LegendSet";
import { Visualization } from "../../../domain/entities/indicator-explorer/Visualization";
import { ChartCustomization } from "./customization/types";

export type ChartDataLoaded = {
    kind: "Loaded";
    friendlyName: Visualization["friendlyName"];
    categoryTag: Visualization["categoryTag"];
    visualizations: Visualization[];
    analytics: Analytics[];
    legendSets: LegendSet[];
    customization?: ChartCustomization;
    chartOptions?: Highcharts.Options;
    countries: Country[];
    visualizationDialogInfo?: string;
    isScatter?: boolean;
    xAxis?: string;
    yAxis?: string;
};

export type ChartDataLoading = {
    kind: "Loading";
};

export type ChartDataError = {
    kind: "Error";
    message: string;
};

export type ChartData = ChartDataLoaded | ChartDataLoading | ChartDataError;
