import { ChartSource } from "./chartOptions";
import { comparativeColumnChartOptions } from "./generic/comparativeColumnChartOptions";
import { getChartSourceFilteredByLastAvailableYear } from "./utils/getChartSourceFilteredByLastAvailableYear";

const seriesNames: Record<string, string> = {
    WmOGqGcov4f: "Households with catastrophic health spending",
};

const seriesColors: Record<string, string> = {
    WmOGqGcov4f: "#185698",
};

export const chart_NOukqSxCI63_Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    const chartSourceWithFilteredRowsByLAY = getChartSourceFilteredByLastAvailableYear(chartSource);

    return {
        ...comparativeColumnChartOptions({ chartSource: chartSourceWithFilteredRowsByLAY, seriesNames, seriesColors }),
        legend: {
            enabled: false,
        },
    };
};
