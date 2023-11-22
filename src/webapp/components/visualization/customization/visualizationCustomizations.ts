import { countryPalette } from "./countryPalette";
import { linearQuintileSeries } from "./linearQuintileSeries";
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
    zkEtsohZTTf: {
        title: { text: "" },
        legend: { ...baseLegend, reversed: true },
        countrySerie: (countries, serie) => {
            const country = countries.find(country => country.id === serie.id);

            const color = country ? countryPalette[countries.indexOf(country)] : undefined;

            return {
                id: serie.id,
                name: country?.code || serie.name,
                color,
                marker: { enabled: true, symbol: "circle" },
                dataLabels: {
                    enabled: false,
                },
            };
        },
        xAxis: {
            labels: {
                rotation: -90,
            },
        },
    },
    ZZAcIv6O9LY: {
        title: { text: "" },
        legend: { ...baseLegend, reversed: true },
        countrySerie: (countries, serie) => {
            const country = countries.find(country => country.id === serie.id);

            const color = country ? countryPalette[countries.indexOf(country)] : undefined;

            return {
                id: serie.id,
                name: country?.code || serie.name,
                color,
                marker: { enabled: true, symbol: "circle" },
                dataLabels: {
                    enabled: false,
                },
            };
        },
        xAxis: {
            labels: {
                rotation: -90,
            },
        },
    },
    rT39aStYqI3: {
        title: { text: "" },
        legend: { ...baseLegend, itemMarginTop: 20 },
        series: linearQuintileSeries,
        xAxis: {
            title: "",
            labels: {
                rotation: -90,
            },
        },
    },
    nhaxK33nlhb: {
        title: { text: "" },
        legend: { ...baseLegend, itemMarginTop: 20 },
        series: linearQuintileSeries,
        xAxis: {
            title: "",
            labels: {
                rotation: -90,
            },
        },
    },
};
