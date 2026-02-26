import { ChartSource } from "./chartOptions";
import { comparativeGroupedColumnChartOptions } from "./generic/comparativeGroupedColumnChartOptions";

const seriesNames: Record<string, string> = {
    "2014": "2014",
    "2019": "2019",
};

const seriesColors: Record<string, string> = {
    "2014": "#8fa2d4",
    "2019": "#2f5597",
};

export const chart_eibYs7QySNk_Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    const filteredYears = chartSource.analyticsResponse.metaData.dimensions.pe || [];
    const isOnlyOneYearSelected = filteredYears.length === 1;
    return comparativeGroupedColumnChartOptions({
        chartSource: chartSource,
        seriesNames: seriesNames,
        seriesColors: seriesColors,
        defaultColor: seriesColors["2019"],
        isOnlyOneYearSelected: isOnlyOneYearSelected,
    });
};
