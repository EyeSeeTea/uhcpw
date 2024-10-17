import { SeriesColumnOptions } from "highcharts";
import { baseLegend } from "../../legends/baseLegend";
import { linearDentalQuintileSeries } from "../../series/linearDentalQuintileSeries";
import { getMaxYAxisAndYTickIntervalForLineAndColumns } from "../../yAxis/getMaxYAxisAndYTickInterval";

export const linearDentalQuintileChart = {
    title: { text: "" },
    legend: baseLegend,
    series: linearDentalQuintileSeries,
    xAxis: { title: { text: "" } },
    sortLegendByLastDataPoint: true,
    getMaxYAxisAndYTickInterval: (series: SeriesColumnOptions[] | undefined) => {
        return getMaxYAxisAndYTickIntervalForLineAndColumns(series);
    },
};
