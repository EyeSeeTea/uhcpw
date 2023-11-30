import { baseLegend } from "../legends/baseLegend";
import { ChartCustomization } from "../types";
import { rotateXAxis } from "../xAxis/rotateXAxis";

export const chart17Customizations: ChartCustomization = {
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
};
