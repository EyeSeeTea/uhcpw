import { ChartSource } from "../chartOptions";
import { comparativeColumnChartOptions } from "./comparativeColumnChartOptions";

export const comparativeStackedColumnChartOptions: (
    chartSource: ChartSource,
    seriesNames: Record<string, string>,
    seriesColors: Record<string, string>,
    orderByValueInSerie?: string
) => Highcharts.Options = (chartSource, seriesNames, seriesColors, orderByValueInSerie) => {
    const options = comparativeColumnChartOptions(
        chartSource,
        seriesNames,
        seriesColors,
        undefined,
        orderByValueInSerie
    );

    return {
        ...options,
        plotOptions: {
            column: {
                stacking: "normal",
            },
        },
    } as Highcharts.Options;
};
