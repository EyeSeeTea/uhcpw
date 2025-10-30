import { Country } from "../../../domain/entities/Country";
import { Analytics } from "../../../domain/entities/indicator-explorer/Analytics";
import { LegendSet } from "../../../domain/entities/indicator-explorer/LegendSet";
import { Visualization } from "../../../domain/entities/indicator-explorer/Visualization";
import { Id } from "../../../domain/entities/Ref";
import { Region } from "../../../domain/entities/region/Region";
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
    regions: Region[];
    visualizationDialogInfo?: string;
    isScatter?: boolean;
    xAxis?: string;
    yAxis?: string;
    lastAvailableYearInRegion?: string;
    visualizationIdInIndicatorExplorer?: Id;
};

export type ChartDataLoading = {
    kind: "Loading";
};

export type ChartDataError = {
    kind: "Error";
    message: string;
};

export type ChartData = ChartDataLoaded | ChartDataLoading | ChartDataError;
