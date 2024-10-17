import { SeriesColumnOptions } from "highcharts";
import { baseLegend } from "../legends/baseLegend";
import { ChartCustomization } from "../types";
import { getMaxYAxisAndYTickIntervalForStackedColumns } from "../yAxis/getMaxYAxisAndYTickInterval";

export const chart_NOR4oxtMVxP_Customizations: ChartCustomization = {
    title: { text: "" },
    legend: { ...baseLegend, reversed: true },
    series: [
        {
            id: "OQ4P2FX0ApA",
            name: "Further impoverished",
            color: "#c00000",
            dataLabels: {
                enabled: false,
            },
        },
        {
            id: "CMKOYzqDIZD",
            name: "Impoverished",
            color: "#e46c0b",
            dataLabels: {
                enabled: false,
            },
        },
        {
            id: "yg2nhfDkKpJ",
            name: "At risk of impoverishment",
            color: "#fec000",
            dataLabels: {
                enabled: false,
            },
        },
    ],
    xAxis: {
        title: { text: "" },
    },
    getMaxYAxisAndYTickInterval: (series: SeriesColumnOptions[] | undefined) => {
        return getMaxYAxisAndYTickIntervalForStackedColumns(series);
    },
};
