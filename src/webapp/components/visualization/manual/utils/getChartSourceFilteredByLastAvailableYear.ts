import { ChartSource } from "../chartOptions";
import { filterRowsByLastAvailableYear } from "../../../../../data/repositories/indicator-explorer/utils/filterRowsByLastAvailableYear";

export function getChartSourceFilteredByLastAvailableYear(chartSource: ChartSource): ChartSource {
    return {
        ...chartSource,
        analyticsResponse: {
            ...chartSource.analyticsResponse,
            rows: filterRowsByLastAvailableYear(chartSource.analyticsResponse.rows),
        },
    };
}
