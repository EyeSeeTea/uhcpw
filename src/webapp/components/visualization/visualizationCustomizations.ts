export type VisualizationCustomization = Record<string, ChartCustomization>;

export type ChartCustomization = {
    legend: LegendCustomization;
    series?: SerieCustomization[];
    allSeries?: AllSeriesCustomization;
    title?: TitleCustomization;
};

export type LegendCustomization = {
    enabled: boolean;
    align?: "center" | "left" | "right";
    verticalAlign?: "bottom" | "middle" | "top";
    layout?: "horizontal" | "proximate" | "vertical";
};

export type TitleCustomization = {
    text?: string;
};

export type SerieCustomization = {
    id: string;
    color: string;
};

export type AllSeriesCustomization = {
    color: string;
};

const baseLegend = {
    enabled: true,
    align: "right",
    verticalAlign: "middle",
    layout: "vertical",
} as LegendCustomization;

export const visualizationCustomizations: VisualizationCustomization = {
    iRWXr9Ql9B5: {
        title: { text: "" },
        legend: { enabled: false },
        allSeries: { color: "#354498" },
    },
};
