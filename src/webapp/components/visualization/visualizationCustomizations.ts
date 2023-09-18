export type VisualizationCustomization = Record<string, ChartCustomization>;

export type ChartCustomization = {
    legend: LegendCustomization;
    series: SerieCustomization[];
};

export type LegendCustomization = {
    enabled: boolean;
    align: "center" | "left" | "right";
    verticalAlign: "bottom" | "middle" | "top";
    layout: "horizontal" | "proximate" | "vertical";
};

export type SerieCustomization = {
    id: string;
    color: string;
};

const baseLegend = {
    enabled: true,
    align: "right",
    verticalAlign: "middle",
    layout: "vertical",
} as LegendCustomization;

export const visualizationCustomizations: VisualizationCustomization = {
    xEPgElBSAjK: {
        legend: { ...baseLegend },
        series: [
            { id: "yiucIy5NIAw", color: "#DCEDF9" },
            { id: "O0MXmTdpf4m", color: "#79C3E8" },
            { id: "ii0MC8x9D7i", color: "#018bd6" },
            { id: "GuypYXqveWn", color: "#0360A6" },
        ],
    },
    D240hYLRs1P: {
        legend: { ...baseLegend },
        series: [
            { id: "H8RixfF8ugH", color: "lightblue" },
            { id: "seHJdofSPcM", color: "lightblue" },
            { id: "wP2zKq0dDpw", color: "lightblue" },
            { id: "yWc1CTszR3s", color: "lightblue" },
            { id: "zXAaAXzwt4M", color: "lightblue" },
            { id: "afomkmfy9xk", color: "lightblue" },
            { id: "RA5zxsbittk", color: "lightblue" },
            { id: "svSQSBLTVz6", color: "lightblue" },
        ],
    },
};
