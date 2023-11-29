import { chart1Customizations } from "./charts/chart1Customizations";
import { chart2Customizations } from "./charts/chart2Customizations";
import { chart4Customizations } from "./charts/chart4Customizations";
import { chart5Customizations } from "./charts/chart5Customizations";
import { chart6Customizations } from "./charts/chart6Customizations";
import { chart7Customizations } from "./charts/chart7Customizations";
import { linearByCountryChart } from "./charts/generic/linearByCountryChart";
import { linearDentalQuintileChart } from "./charts/generic/linearDentalQuintileChart";
import { linearHealthQuintileChart } from "./charts/generic/linearHealthQuintileChart";
import { baseLegend } from "./legends/baseLegend";

import { ChartCustomization } from "./types";
import { rotateXAxis } from "./xAxis/rotateXAxis";

export const visualizationCustomizations: Record<string, ChartCustomization> = {
    hNU4Lj1xLYO: chart1Customizations,
    dbc87Ljw8uN: chart2Customizations,
    B4CnzUqVR3n: chart4Customizations,
    GimM6ANOKhd: chart5Customizations,
    VB7bdJ8ZXya: chart6Customizations,
    mcNfvQaVbfy: chart7Customizations,
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
    rT39aStYqI3: linearHealthQuintileChart,
    nhaxK33nlhb: linearDentalQuintileChart,
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
    OB4SCQfCzwz: {
        title: { text: "" },
        legend: { ...baseLegend },
        series: [
            {
                id: "OyWweV5ivnF",
                name: "Public spending on health",
                color: "#00b050",
                dataLabels: {
                    enabled: false,
                },
                marker: {
                    enabled: true,
                    symbol: "circle",
                },
            },
            {
                id: "m6Ua21CL6YZ",
                name: "Out-of-pocket payments",
                color: "#c00000",
                dataLabels: {
                    enabled: false,
                },
                marker: {
                    enabled: true,
                    symbol: "circle",
                },
            },
            {
                id: "W22ZL143ENs",
                name: "Voluntary health insurance",
                color: "#ffc112",
                dataLabels: {
                    enabled: false,
                },
                marker: {
                    enabled: true,
                    symbol: "circle",
                },
            },
        ],
        xAxis: rotateXAxis,
    },
};
