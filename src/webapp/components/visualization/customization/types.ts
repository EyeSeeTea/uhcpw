import { CSSProperties } from "react";
import { Country } from "../../../../domain/entities/Country";

export type VisualizationCustomization = Record<string, ChartCustomization>;

export type ChartCustomization = {
    legend: LegendCustomization;
    series?: SerieCustomization[];
    allSeries?: AllSeriesCustomization;
    countrySerie?: (countries: Country[], serie: { id: string; name: string }) => SerieCustomization;
    title?: TitleCustomization;
    subtitle?: TitleCustomization;
    xAxis?: AxisCustomization | AxisCustomization[];
    countryXAxis?: (countries: Country[], xAxis: { categories: string[] }) => AxisCustomization;
    yAxis?: AxisCustomization;
    hideLegendIfNoData?: boolean;
    sortLegendByLastDataPoint?: boolean;
    chart?: ChartPropertyCustomization;
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
    style?: CSSProperties;
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
    dataLabels?: {
        enabled: boolean;
    };
};

export type AxisCustomization = {
    title?: TitleCustomization;
    labels?: { rotation?: number };
    categories?: string[];
    lineWidth?: number;
};

export type ChartPropertyCustomization = {
    events?: { load: (this: Highcharts.Chart) => void };
};
