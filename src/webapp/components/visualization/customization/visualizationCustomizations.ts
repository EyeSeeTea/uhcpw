import { linearByCountryChart, linearQuintileChart } from "./commonCustomizationCharts";
import { baseLegend, ChartCustomization } from "./types";

export const visualizationCustomizations: Record<string, ChartCustomization> = {
    Y31jQX5PVdI: {
        title: { text: "" },
        legend: { enabled: false },
        allSeries: { color: "#354498" },
    },
    ZxNdsDM8NSb: {
        title: { text: "" },
        legend: { ...baseLegend, reversed: true, itemMarginTop: 20 },
        series: [
            { id: "qgE5NJ9Nyaq", name: "Medicines", color: "#c00000" },
            { id: "OuiKmOeXUWQ", name: "Medical products", color: "#ed7d31" },
            { id: "a2u2ccahVJL", name: "Dental care", color: "#0071c0" },
            { id: "OEK4dKvUsOe", name: "Inpatient care", color: "#00b050" },
            { id: "qy4W8ZY2g5M", name: "Diagnostic tests", color: "#702fa0" },
            { id: "ykAPKvVQusS", name: "Outpatient care", color: "#ffc001" },
        ],
    },
    zkEtsohZTTf: linearByCountryChart,
    ZZAcIv6O9LY: linearByCountryChart,
    BYAT5Woc9EJ: linearByCountryChart,
    rT39aStYqI3: linearQuintileChart,
    nhaxK33nlhb: linearQuintileChart,
};
