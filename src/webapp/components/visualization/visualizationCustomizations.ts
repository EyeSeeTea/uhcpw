export type VisualizationCustomization = Record<string, ChartCustomization>;

export interface ChartCustomization {
    series: Record<string, SerieCustomization>;
}

export interface SerieCustomization {
    order?: number;
    color?: string;
}

export const visualizationCustomizations: VisualizationCustomization = {
    xEPgElBSAjK: {
        series: {
            yiucIy5NIAw: { order: 1, color: "#DCEDF9" },
            O0MXmTdpf4m: { order: 2, color: "#C2E3F5" },
            ii0MC8x9D7i: { order: 3, color: "#79C3E8" },
            GuypYXqveWn: { order: 4, color: "#018bd6" },
            GeiKSyJLeKt: { order: 5, color: "#0360A6" },
        },
    },
    D240hYLRs1P: {
        series: {
            H8RixfF8ugH: { color: "lightblue" },
            seHJdofSPcM: { color: "lightblue" },
            wP2zKq0dDpw: { color: "lightblue" },
            yWc1CTszR3s: { color: "lightblue" },
            zXAaAXzwt4M: { color: "lightblue" },
            afomkmfy9xk: { color: "lightblue" },
            RA5zxsbittk: { color: "lightblue" },
            svSQSBLTVz6: { color: "lightblue" },
        },
    },
};
