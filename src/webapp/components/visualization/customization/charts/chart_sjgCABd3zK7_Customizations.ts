import { baseLegend } from "../legends/baseLegend";
import { ChartCustomization } from "../types";
import { typeOfCareSeries3 } from "../series/typeOfCareSeries";
import { yAxisformatNumberLabel } from "../yAxis/formatNumberLabel";
import { SeriesColumnOptions } from "highcharts";
import { getMaxYAxisAndYTickIntervalForLineAndColumns } from "../yAxis/getMaxYAxisAndYTickInterval";
import { setYAxisMaxAxisAndTickIntervalWhenLegendItemClick } from "../../utils/getMaxAxisAndTickInterval";

export const chart_sjgCABd3zK7_Customizations: ChartCustomization = {
    title: { text: "" },
    legend: baseLegend,
    series: typeOfCareSeries3,
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
