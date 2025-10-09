import { ChartSource } from "./chartOptions";
import { mapToWhoCountryCode } from "../../../../data/repositories/countries/mapToWhoCountryData";
import { createDotsWithMaxMinVerticalLineChart } from "./generic/dotsWithMaxMinVerticalLineChart";
import { orderLatestAvailableYearByAverageAndPoorest } from "../../../../data/repositories/indicator-explorer/utils/lastAvailableYearHelpers";

type SeriesKey = "poorest" | "average" | "richest";

const seriesIds: Record<SeriesKey, string> = {
    poorest: "f3t7eoXUzn8",
    average: "GyiW7dS7BIl",
    richest: "dVcHTdCFpNv",
};

const seriesNames: Record<typeof seriesIds[keyof typeof seriesIds], string> = {
    [seriesIds.poorest]: "Poorest",
    [seriesIds.average]: "Total",
    [seriesIds.richest]: "Richest",
};

const seriesColors: Record<typeof seriesIds[keyof typeof seriesIds], string> = {
    [seriesIds.poorest]: "#c00000",
    [seriesIds.average]: "#ffc000",
    [seriesIds.richest]: "#00b050",
};

export const chart_MfLZYD6QCPy_Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    const orderedCountry = orderLatestAvailableYearByAverageAndPoorest({
        allRowsFilteredByLAY: chartSource.analyticsResponse.rows,
        seriesIds,
    });

    const categories = Object.keys(orderedCountry).map(countryId => {
        return mapToWhoCountryCode(chartSource.analyticsResponse.metaData.items[countryId]?.code || countryId);
    });

    return createDotsWithMaxMinVerticalLineChart({
        rows: chartSource.analyticsResponse.rows,
        seriesIds,
        categories,
        seriesNames,
        seriesColors,
        yAxisTitle: "People needing care (%)",
        pointFormat: "{point.y}%",
        latestAvailableYearByCountryId: orderedCountry,
    });
};
