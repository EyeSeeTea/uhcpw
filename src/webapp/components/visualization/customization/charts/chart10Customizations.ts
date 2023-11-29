import { baseLegend } from "../legends/baseLegend";
import { ChartCustomization } from "../types";

export const chart10Customizations: ChartCustomization = {
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
};
