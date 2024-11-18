import {
    filterRowsByLastAvailableYear,
    filterXAxisAndYAxisByLastAvailableYear,
} from "../../../../../data/repositories/indicator-explorer/utils/lastAvailableYearHelpers";
import { ChartSource } from "../chartOptions";

export function getChartSourceFilteredByLastAvailableYear(
    chartSource: ChartSource,
    options?: { isScatter?: boolean; xAxis?: string; yAxis?: string }
): ChartSource {
    return {
        ...chartSource,
        analyticsResponse: {
            ...chartSource.analyticsResponse,
            rows:
                options?.isScatter && options?.xAxis && options?.yAxis
                    ? filterXAxisAndYAxisByLastAvailableYear(
                          chartSource.analyticsResponse.rows,
                          options.xAxis,
                          options.yAxis,
                          chartSource.isLatestCOVID19
                      )
                    : filterRowsByLastAvailableYear(chartSource.analyticsResponse.rows, chartSource.isLatestCOVID19),
        },
    };
}
