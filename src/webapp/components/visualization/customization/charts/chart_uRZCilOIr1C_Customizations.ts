import { SeriesColumnOptions } from "highcharts";
import { baseLegend } from "../legends/baseLegend";
import { ChartCustomization } from "../types";
import { yAxisformatNumberLabel } from "../yAxis/formatNumberLabel";
import { getMaxYAxisAndYTickIntervalForLineAndColumns } from "../yAxis/getMaxYAxisAndYTickInterval";
import { setYAxisMaxAxisAndTickIntervalWhenLegendItemClick } from "../../utils/getMaxAxisAndTickInterval";

export const chart_uRZCilOIr1C_Customizations: ChartCustomization = {
    title: { text: "" },
    legend: baseLegend,
    series: [
        {
            id: "EheQZwstMjp",
            name: "Poorest",
            color: "#4f6a3e",
            dataLabels: {
                enabled: false,
            },
            marker: {
                enabled: true,
                symbol: "circle",
            },
        },
        {
            id: "kdWJFtrGEFf",
            name: "2nd",
            color: "#578338",
            dataLabels: {
                enabled: false,
            },
            marker: {
                enabled: true,
                symbol: "circle",
            },
        },
        {
            id: "VlNBzORnvGY",
            name: "3rd",
            color: "#85bc60",
            dataLabels: {
                enabled: false,
            },
            marker: {
                enabled: true,
                symbol: "circle",
            },
        },
        {
            id: "psqjehrDbVQ",
            name: "4th",
            color: "#add393",
            dataLabels: {
                enabled: false,
            },
            marker: {
                enabled: true,
                symbol: "circle",
            },
        },
        {
            id: "couVaadwbqJ",
            name: "Richest",
            color: "#d3e6c5",
            dataLabels: {
                enabled: false,
            },
            marker: {
                enabled: true,
                symbol: "circle",
            },
        },
        {
            id: "ojHibIxNuQ6",
            name: "Total",
            color: "#ca312d",
            dataLabels: {
                enabled: false,
            },
            marker: {
                enabled: true,
                symbol: "circle",
            },
        },
    ],
    xAxis: { title: { text: "" } },
    ...yAxisformatNumberLabel,
    sortLegendByLastDataPoint: true,
    currencyOfCountryYAxis: (countryCurrencyCode: string) => {
        return { title: { text: countryCurrencyCode } };
    },
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
