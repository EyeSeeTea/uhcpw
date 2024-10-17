import { SeriesColumnOptions } from "highcharts";
import { baseLegend } from "../../legends/baseLegend";
import { linearHealthQuintileSeries } from "../../series/linearHealthQuintileSeries";
import { getMaxYAxisAndYTickIntervalForLineAndColumns } from "../../yAxis/getMaxYAxisAndYTickInterval";

export const linearHealthQuintileChart = {
    title: { text: "" },
    legend: baseLegend,
    series: linearHealthQuintileSeries,
    xAxis: { title: { text: "" } },
    sortLegendByLastDataPoint: true,
    getMaxYAxisAndYTickInterval: (series: SeriesColumnOptions[] | undefined) => {
        return getMaxYAxisAndYTickIntervalForLineAndColumns(series);
    },
};
