import { baseLegend } from "../../legends/baseLegend";
import { createCountrySerie } from "../../builders/buildCountrySerie";
import { ChartCustomization } from "../../types";
import { SeriesColumnOptions } from "highcharts";
import { getMaxYAxisAndYTickIntervalForLineAndColumns } from "../../yAxis/getMaxYAxisAndYTickInterval";
import { setYAxisMaxAxisAndTickIntervalWhenLegendItemClick } from "../../../utils/getMaxAxisAndTickInterval";

export const linearByCountryChart: ChartCustomization = {
    title: { text: "" },
    legend: { ...baseLegend },
    countrySerie: createCountrySerie,
    xAxis: {
        title: { text: "" },
    },
    sortLegendByLastDataPoint: true,
    hideLegendIfNoData: true,
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
