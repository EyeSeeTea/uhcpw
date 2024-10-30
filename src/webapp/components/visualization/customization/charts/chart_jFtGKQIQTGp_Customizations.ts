import { SeriesColumnOptions } from "highcharts";
import { baseLegend } from "../legends/baseLegend";
import { ChartCustomization } from "../types";
import { getMaxYAxisAndYTickIntervalForStackedColumns } from "../yAxis/getMaxYAxisAndYTickInterval";
import { setYAxisMaxAxisAndTickIntervalWhenLegendItemClick } from "../../utils/getMaxAxisAndTickInterval";

export const chart_jFtGKQIQTGp_Customizations: ChartCustomization = {
    title: { text: "" },
    legend: { ...baseLegend, reversed: true },
    series: [
        {
            id: "yYSS1uBgnTE",
            name: "Further impoverished",
            color: "#c00000",
            dataLabels: { enabled: false },
        },
        {
            id: "WsUM8TQ7cEh",
            name: "Impoverished",
            color: "#e46c09",
            dataLabels: { enabled: false },
        },
    ],
    xAxis: { title: { text: "" } },
    getMaxYAxisAndYTickInterval: (series: SeriesColumnOptions[] | undefined) => {
        return getMaxYAxisAndYTickIntervalForStackedColumns(series);
    },
    plotOptions: {
        series: {
            events: {
                legendItemClick: function (this: Highcharts.Series) {
                    return setYAxisMaxAxisAndTickIntervalWhenLegendItemClick(this, {
                        isStacked: true,
                    });
                },
            },
        },
    },
};
