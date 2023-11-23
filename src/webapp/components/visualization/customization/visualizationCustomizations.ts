import { baseLegend } from "./baseLegend";
import { linearByCountryChart, linearQuintileChart } from "./commonCustomizationCharts";
import { ChartCustomization } from "./types";

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
    d3kq9OCv8tH: linearByCountryChart,
    rT39aStYqI3: linearQuintileChart,
    nhaxK33nlhb: linearQuintileChart,
    jFtGKQIQTGp: {
        title: { text: "" },
        legend: { ...baseLegend, reversed: true },
        series: [
            {
                id: "yYSS1uBgnTE",
                name: "Further impoverished",
                color: "#c00000",
            },
            {
                id: "WsUM8TQ7cEh",
                name: "Impoverished",
                color: "#e46c09",
            },
        ],
        xAxis: { title: { text: "" } },
    },
    geNXcoXc3mf: {
        title: { text: "" },
        legend: { ...baseLegend, reversed: true },
        series: [
            {
                id: "GeiKSyJLeKt",
                name: "Poorest",
                color: "#203864",
            },
            {
                id: "GuypYXqveWn",
                name: "2nd",
                color: "#2f5597",
            },
            {
                id: "ii0MC8x9D7i",
                name: "3rd",
                color: "#4472c4",
            },
            {
                id: "O0MXmTdpf4m",
                name: "4th",
                color: "#8fa2d4",
            },
            {
                id: "yiucIy5NIAw",
                name: "Richest",
                color: "#bac4e2",
            },
        ],
        xAxis: { title: { text: "" } },
    },
    hpO1ZyFXpCz: {
        title: { text: "" },
        legend: { ...baseLegend, reversed: true },
        series: [
            {
                id: "OEK4dKvUsOe",
                name: "Inpatient care",
                color: "#00b050",
            },
            {
                id: "qgE5NJ9Nyaq",
                name: "Medicines",
                color: "#c00000",
            },
            {
                id: "ykAPKvVQusS",
                name: "Outpatient care",
                color: "#ffc000",
            },
            {
                id: "a2u2ccahVJL",
                name: "Dental care",
                color: "#0070c0",
            },
            {
                id: "OuiKmOeXUWQ",
                name: "Medical products",
                color: "#ed7d31",
            },
            {
                id: "qy4W8ZY2g5M",
                name: "Diagnostic tests",
                color: "#7030a0",
            },
        ],
        xAxis: { title: { text: "" } },
    },
};
