import { buildCountryCategoriesByName } from "./builders/buildCountryCategoriesByName";
import { linearByCountryChart } from "./charts/linearByCountryChart";
import { linearDentalQuintileChart } from "./charts/linearDentalQuintileChart";
import { linearHealthQuintileChart } from "./charts/linearHealthQuintileChart";
import { baseLegend } from "./legends/baseLegend";

import { ChartCustomization } from "./types";
import { yearXAxis } from "./xAxis/yearXAxis";

export const visualizationCustomizations: Record<string, ChartCustomization> = {
    hNU4Lj1xLYO: {
        //1.
        title: { text: "" },
        subtitle: { text: "" },
        legend: { enabled: false },
        allSeries: { color: "#354498" },
        xAxis: [{ title: { text: "" } }],
    },
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
        xAxis: yearXAxis,
    },
    B4CnzUqVR3n: {
        title: { text: "" },
        legend: { enabled: false },
        allSeries: { color: "#00b050", dataLabels: { enabled: false } },
        countryXAxis: (countries, xAxis) => {
            const isNumber = !isNaN(Number(xAxis.categories[0]));

            return isNumber
                ? {}
                : {
                      ...yearXAxis,
                      categories: buildCountryCategoriesByName(countries, xAxis.categories),
                  };
        },
    },
};
