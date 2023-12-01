import _ from "lodash";
import { ChartSource } from "../chartOptions";
import { comparativeColumnChartOptions } from "./comparativeColumnChartOptions";

export const comparativeStackedColumnChartOptions: (
    chartSource: ChartSource,
    seriesNames: Record<string, string>,
    seriesColors: Record<string, string>
) => Highcharts.Options = (chartSource, seriesNames, seriesColors) => {
    const options = comparativeColumnChartOptions(chartSource, seriesNames, seriesColors);

    return {
        ...options,
        plotOptions: {
            column: {
                stacking: "normal",
            },
        },
    } as Highcharts.Options;
};
