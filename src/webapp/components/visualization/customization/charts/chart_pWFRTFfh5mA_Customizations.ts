import { SeriesColumnOptions } from "highcharts";
import { baseLegend } from "../legends/baseLegend";
import { linearHouseholdHealthQuintileSeries } from "../series/linearHouseholdHealthQuintileSeries";
import { ChartCustomization } from "../types";
import { getMaxYAxisAndYTickIntervalForLineAndColumns } from "../yAxis/getMaxYAxisAndYTickInterval";

export const chart_pWFRTFfh5mA_Customizations: ChartCustomization = {
    title: { text: "" },
    legend: baseLegend,
    series: linearHouseholdHealthQuintileSeries,
    xAxis: { title: { text: "" } },
    yAxis: { title: { text: "Household budget (%)" } },
    sortLegendByLastDataPoint: true,
    getMaxYAxisAndYTickInterval: (series: SeriesColumnOptions[] | undefined) => {
        return getMaxYAxisAndYTickIntervalForLineAndColumns(series);
    },
};
