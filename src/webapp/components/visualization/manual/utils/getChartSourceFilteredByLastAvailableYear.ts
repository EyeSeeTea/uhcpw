import { filterRowsByLastAvailableYear } from "../../../../../data/repositories/indicator-explorer/utils/lastAvailableYearHelpers";
import { ChartSource } from "../chartOptions";

export function getChartSourceFilteredByLastAvailableYear(chartSource: ChartSource): ChartSource {
    return {
        ...chartSource,
        analyticsResponse: {
            ...chartSource.analyticsResponse,
            rows: filterRowsByLastAvailableYear(chartSource.analyticsResponse.rows, chartSource.isLatestCOVID19),
        },
    };
}
