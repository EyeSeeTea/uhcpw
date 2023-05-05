type VisualizationCustomization = Record<string, SerieCustomization>;

interface SerieCustomization {
    orders: Record<string, number>;
    colors: Record<string, string>;
}

export const visualizationCustomizations: VisualizationCustomization = {
    xEPgElBSAjK: {
        orders: {
            yiucIy5NIAw: 1,
            O0MXmTdpf4m: 2,
            ii0MC8x9D7i: 3,
            GuypYXqveWn: 4,
            GeiKSyJLeKt: 5,
        },
        colors: {
            yiucIy5NIAw: "#DCEDF9",
            O0MXmTdpf4m: "#C2E3F5",
            ii0MC8x9D7i: "#79C3E8",
            GuypYXqveWn: "#018bd6",
            GeiKSyJLeKt: "#0360A6",
        },
    },
};
