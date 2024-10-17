import { baseLegend } from "../../legends/baseLegend";
import { createCountrySerie } from "../../builders/buildCountrySerie";
import { ChartCustomization } from "../../types";
import { SeriesColumnOptions } from "highcharts";
import { getMaxYAxisAndYTickIntervalForLineAndColumns } from "../../yAxis/getMaxYAxisAndYTickInterval";

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
};
