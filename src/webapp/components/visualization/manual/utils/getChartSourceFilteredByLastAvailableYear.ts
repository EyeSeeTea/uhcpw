import {
    filterRowsByLastAvailableYear,
    filterRowsByCommonLastAvailableYearInTwoDataIds,
} from "../../../../../data/repositories/indicator-explorer/utils/lastAvailableYearHelpers";
import { ChartSource } from "../chartOptions";

export function getChartSourceFilteredByLastAvailableYear(
    chartSource: ChartSource,
    options?: {
        isScatter?: boolean;
        xAxis?: string;
        yAxis?: string;
        customFilterXAxisAndYAxisByLastAvailableYear?: (
            rows: Array<string[]>,
            xAxis: string,
            yAxis: string,
            isUpTo2019?: boolean
        ) => Array<string[]>;
    }
): ChartSource {
    const { customFilterXAxisAndYAxisByLastAvailableYear, isScatter = false, xAxis, yAxis } = options || {};
    return {
        ...chartSource,
        analyticsResponse: {
            ...chartSource.analyticsResponse,
            rows: getFilteredRows({
                rows: chartSource.analyticsResponse.rows,
                isScatter,
                xAxis,
                yAxis,
                isLatestCOVID19: chartSource.isLatestCOVID19 || false,
                customFilter: customFilterXAxisAndYAxisByLastAvailableYear,
                maxYearToFilterBy: chartSource.maxYearToFilterBy,
            }),
        },
    };
}

function getFilteredRows({
    rows,
    isScatter,
    xAxis,
    yAxis,
    isLatestCOVID19,
    customFilter,
    maxYearToFilterBy,
}: {
    rows: Array<string[]>;
    isScatter: boolean;
    xAxis?: string;
    yAxis?: string;
    isLatestCOVID19: boolean;
    maxYearToFilterBy?: string;
    customFilter?: (
        rows: Array<string[]>,
        xAxis: string,
        yAxis: string,
        isLatestCOVID19: boolean,
        maxYearToFilterBy?: string
    ) => Array<string[]>;
}): Array<string[]> {
    if (isScatter && xAxis && yAxis) {
        return customFilter
            ? customFilter(rows, xAxis, yAxis, isLatestCOVID19, maxYearToFilterBy)
            : filterRowsByCommonLastAvailableYearInTwoDataIds({
                  rows,
                  dataId1: xAxis,
                  dataId2: yAxis,
                  isUpTo2019: isLatestCOVID19,
                  maxYearToFilterBy,
              });
    } else {
        return filterRowsByLastAvailableYear(rows, isLatestCOVID19, maxYearToFilterBy);
    }
}
