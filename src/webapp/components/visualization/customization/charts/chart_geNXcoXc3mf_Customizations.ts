import { SeriesColumnOptions } from "highcharts";
import { baseLegend } from "../legends/baseLegend";
import { ChartCustomization } from "../types";
import { getMaxYAxisAndYTickIntervalForStackedColumns } from "../yAxis/getMaxYAxisAndYTickInterval";

export const chart_geNXcoXc3mf_Customizations: ChartCustomization = {
    title: { text: "" },
    legend: { ...baseLegend, reversed: true },
    series: [
        {
            id: "GeiKSyJLeKt",
            name: "Poorest",
            color: "#203864",
            dataLabels: { enabled: false },
        },
        {
            id: "GuypYXqveWn",
            name: "2nd",
            color: "#2f5597",
            dataLabels: { enabled: false },
        },
        {
            id: "ii0MC8x9D7i",
            name: "3rd",
            color: "#4472c4",
            dataLabels: { enabled: false },
        },
        {
            id: "O0MXmTdpf4m",
            name: "4th",
            color: "#8fa2d4",
            dataLabels: { enabled: false },
        },
        {
            id: "yiucIy5NIAw",
            name: "Richest",
            color: "#bac4e2",
            dataLabels: { enabled: false },
        },
    ],
    xAxis: { title: { text: "" } },
    getMaxYAxisAndYTickInterval: (series: SeriesColumnOptions[] | undefined) => {
        return getMaxYAxisAndYTickIntervalForStackedColumns(series);
    },
};
