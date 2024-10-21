import { SeriesColumnOptions } from "highcharts";
import { baseLegend } from "../../legends/baseLegend";
import { linearHealthQuintileSeries } from "../../series/linearHealthQuintileSeries";
import { getMaxYAxisAndYTickIntervalForLineAndColumns } from "../../yAxis/getMaxYAxisAndYTickInterval";
import { setYAxisMaxAxisAndTickIntervalWhenLegendItemClick } from "../../../utils/getMaxAxisAndTickInterval";

export const linearHealthQuintileChart = {
    title: { text: "" },
    legend: baseLegend,
    series: linearHealthQuintileSeries,
    xAxis: { title: { text: "" } },
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
