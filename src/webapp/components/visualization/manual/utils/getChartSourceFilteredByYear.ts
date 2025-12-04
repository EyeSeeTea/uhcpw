import { ChartSource } from "../chartOptions";

export function getChartSourceFilteredByYear(chartSource: ChartSource): ChartSource {
    const yearToFilterBy = chartSource.yearToFilterBy;
    const filteredRows = chartSource.analyticsResponse.rows.filter(row => {
        const year = row[2] || "";
        return yearToFilterBy === year;
    });

    return {
        ...chartSource,
        analyticsResponse: {
            ...chartSource.analyticsResponse,
            rows: filteredRows,
        },
    };
}
