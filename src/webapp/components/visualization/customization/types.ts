import { Country } from "../../../../domain/entities/Country";

export type VisualizationCustomization = Record<string, ChartCustomization>;

export type ChartCustomization = {
    legend: LegendCustomization;
    series?: SerieCustomization[];
    allSeries?: AllSeriesCustomization;
    countrySerie?: (countries: Country[], serie: { id: string; name: string }) => SerieCustomization;
    title?: TitleCustomization;
    xAxis?: AxisCustomization;
    yAxis?: AxisCustomization;
};

export type LegendCustomization = {
    enabled: boolean;
    align?: "center" | "left" | "right";
    verticalAlign?: "bottom" | "middle" | "top";
    layout?: "horizontal" | "proximate" | "vertical";
    reversed?: boolean;
    itemMarginTop?: number;
};

export type TitleCustomization = {
    text?: string;
};

export type SerieCustomization = {
    id: string;
    color?: string;
    name?: string;
    marker?: { enabled: boolean; symbol: "circle" | string };
    dataLabels?: {
        enabled: boolean;
    };
};

export type AllSeriesCustomization = {
    color: string;
    marker?: { enabled: boolean; symbol: "circle" | string };
};

export type AxisCustomization = {
    title?: TitleCustomization;
    labels?: { rotation?: number };
};
