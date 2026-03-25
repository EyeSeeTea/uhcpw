import { SeriesColumnOptions } from "highcharts";
import { baseLegend } from "../legends/baseLegend";
import { ChartCustomization } from "../types";
import { yAxisformatNumberLabel } from "../yAxis/formatNumberLabel";
import { getMaxYAxisAndYTickIntervalForLineAndColumns } from "../yAxis/getMaxYAxisAndYTickInterval";
import { setYAxisMaxAxisAndTickIntervalWhenLegendItemClick } from "../../utils/getMaxAxisAndTickInterval";

export const chart_flLqTxfuuWI_Customizations: ChartCustomization = {
    title: { text: "" },
    legend: { ...baseLegend },
    series: [
        {
            id: "VlymT6gXw7P",
            name: "Home-based",
            color: "#8fa2d4",
            dataLabels: {
                enabled: false,
            },
            marker: {
                enabled: true,
                symbol: "circle",
            },
        },
        {
            id: "wdLDa12XmHL",
            name: "Inpatient",
            color: "#2f5597",
            dataLabels: {
                enabled: false,
            },
            marker: {
                enabled: true,
                symbol: "circle",
            },
        },
    ],
    ...yAxisformatNumberLabel,
    sortLegendByLastDataPoint: true,
    getMaxYAxisAndYTickInterval: (series: SeriesColumnOptions[] | undefined) => {
        return getMaxYAxisAndYTickIntervalForLineAndColumns(series);
    },
    plotOptions: {
        series: {
            events: {
                legendItemClick: function (this: Highcharts.Series) {
                    return setYAxisMaxAxisAndTickIntervalWhenLegendItemClick(this);
                },
            },
        },
    },
};
