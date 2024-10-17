import { ChartSource } from "../chartOptions";
import { comparativeColumnChartOptions } from "./comparativeColumnChartOptions";

export const comparativeStackedColumnChartOptions: (params: {
    chartSource: ChartSource;
    seriesNames: Record<string, string>;
    seriesColors: Record<string, string>;
    orderByValueInSerie?: string;
    stackedValuesUpTo100?: boolean;
}) => Highcharts.Options = ({ chartSource, seriesNames, seriesColors, orderByValueInSerie, stackedValuesUpTo100 }) => {
    const options = comparativeColumnChartOptions({
        chartSource,
        seriesNames,
        seriesColors,
        orderByValueInSerie,
        stackedValuesUpTo100,
        isStacked: true,
    });

    return {
        ...options,
        plotOptions: {
            column: {
                stacking: "normal",
            },
        },
    } as Highcharts.Options;
};
