import { SeriesColumnOptions } from "highcharts";
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
    sortSerieData?: (
        series: SeriesColumnOptions[] | undefined,
        categories: string[]
    ) => SeriesColumnOptions[] | undefined;
};

export type LegendCustomization = {
    enabled: boolean;
    align?: "center" | "left" | "right";
    verticalAlign?: "bottom" | "middle" | "top";
    layout?: "horizontal" | "proximate" | "vertical";
    reversed?: boolean;
    itemMarginTop?: number;
    itemStyle?: CSSProperties;
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
    labels?: { rotation?: number; style?: CSSProperties; step?: number };
    categories?: string[];
    lineWidth?: number;
};

export type ChartPropertyCustomization = {
    events?: { load: (this: Highcharts.Chart) => void; render: (this: Highcharts.Chart) => void };
};
