import { SeriesColumnOptions } from "highcharts";
import { baseLegend } from "../legends/baseLegend";
import { ChartCustomization } from "../types";
import { yAxisformatNumberLabel } from "../yAxis/formatNumberLabel";
import { getMaxYAxisAndYTickIntervalForLineAndColumns } from "../yAxis/getMaxYAxisAndYTickInterval";

export const chart_OB4SCQfCzwz_Customizations: ChartCustomization = {
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
    ...yAxisformatNumberLabel,
    sortLegendByLastDataPoint: true,
    currencyOfCountryYAxis: (countryCurrencyCode: string) => {
        return { title: { text: `Constant LAY ${countryCurrencyCode} per person` } };
    },
    getMaxYAxisAndYTickInterval: (series: SeriesColumnOptions[] | undefined) => {
        return getMaxYAxisAndYTickIntervalForLineAndColumns(series);
    },
};
