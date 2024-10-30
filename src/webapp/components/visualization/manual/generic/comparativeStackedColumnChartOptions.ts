import { ChartSource } from "../chartOptions";
import { comparativeColumnChartOptions } from "./comparativeColumnChartOptions";

export const comparativeStackedColumnChartOptions: (params: {
    chartSource: ChartSource;
    seriesNames: Record<string, string>;
    seriesColors: Record<string, string>;
    orderByValueInSerie?: string;
    stackedValuesUpTo100?: boolean;
    maxValueUpTo100?: boolean;
}) => Highcharts.Options = ({
    chartSource,
    seriesNames,
    seriesColors,
    orderByValueInSerie,
    stackedValuesUpTo100,
    maxValueUpTo100,
}) => {
    const options = comparativeColumnChartOptions({
        chartSource,
        seriesNames,
        seriesColors,
        orderByValueInSerie,
        stackedValuesUpTo100,
        isStacked: true,
        maxValueUpTo100: maxValueUpTo100,
    });

    return {
        ...options,
        plotOptions: {
            ...options.plotOptions,
            column: {
                stacking: "normal",
                ...options.plotOptions?.column,
            },
        },
    } as Highcharts.Options;
};
