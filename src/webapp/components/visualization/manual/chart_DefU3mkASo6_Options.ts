import { ChartSource } from "./chartOptions";
import { comparativeStackedColumnChartOptions } from "./generic/comparativeStackedColumnChartOptions";
import { filterRowsByLastAvailableYear } from "../../../../data/repositories/indicator-explorer/utils/filterRowsByLastAvailableYear";

const seriesNames: Record<string, string> = {
    imkocvILz0h: "Not at risk of impoverishment",
    ySqmYZL9k7Q: "At risk of impoverishment",
    WsUM8TQ7cEh: "Impoverished",
    yYSS1uBgnTE: "Further impoverished",
};

const seriesColors: Record<string, string> = {
    imkocvILz0h: "#91cf50",
    ySqmYZL9k7Q: "#fec000",
    WsUM8TQ7cEh: "#e46c0b",
    yYSS1uBgnTE: "#c00000",
};

export const chart_DefU3mkASo6_Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    const chartSourceWithFilteredRows: ChartSource = {
        ...chartSource,
        analyticsResponse: {
            ...chartSource.analyticsResponse,
            rows: filterRowsByLastAvailableYear(chartSource.analyticsResponse.rows),
        },
    };

    return {
        ...comparativeStackedColumnChartOptions({
            chartSource: chartSourceWithFilteredRows,
            seriesNames,
            seriesColors,
            orderByValueInSerie: "yYSS1uBgnTE",
            stackedValuesUpTo100: true,
        }),
    };
};
