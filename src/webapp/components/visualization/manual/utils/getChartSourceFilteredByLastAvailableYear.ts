import {
    filterRowsByLastAvailableYear,
    filterXAxisAndYAxisByLastAvailableYear,
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
}: {
    rows: Array<string[]>;
    isScatter: boolean;
    xAxis?: string;
    yAxis?: string;
    isLatestCOVID19: boolean;
    customFilter?: (rows: Array<string[]>, xAxis: string, yAxis: string, isLatestCOVID19: boolean) => Array<string[]>;
}): Array<string[]> {
    if (isScatter && xAxis && yAxis) {
        const filter = customFilter ?? filterXAxisAndYAxisByLastAvailableYear;
        return filter(rows, xAxis, yAxis, isLatestCOVID19);
    } else {
        return filterRowsByLastAvailableYear(rows, isLatestCOVID19);
    }
}
