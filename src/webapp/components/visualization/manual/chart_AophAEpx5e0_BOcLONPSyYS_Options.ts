import { ChartSourceMultiple } from "./chartOptions";
import {
    getAllRowsLatestAvailableYearFromTwoCharts,
    getLatestAvailableYearByCountryIdFromTwoCharts,
    orderLatestAvailableYearByAverageAndPoorest,
} from "../../../../data/repositories/indicator-explorer/utils/lastAvailableYearHelpers";
import { mapToWhoCountryCode } from "../../../../data/repositories/countries/mapToWhoCountryData";
import { createDotsWithMaxMinVerticalLineChart } from "./generic/dotsWithMaxMinVerticalLineChart";

type SeriesKey = "poorest" | "average" | "richest";

const seriesIds: Record<SeriesKey, string> = {
    poorest: "GeiKSyJLeKt",
    average: "Wm2v9VGGSuK",
    richest: "yiucIy5NIAw",
};

const seriesNames: Record<typeof seriesIds[keyof typeof seriesIds], string> = {
    [seriesIds.poorest]: "Poorest",
    [seriesIds.average]: "Average",
    [seriesIds.richest]: "Richest",
};

const seriesColors: Record<typeof seriesIds[keyof typeof seriesIds], string> = {
    [seriesIds.poorest]: "#c00000",
    [seriesIds.average]: "#ffc000",
    [seriesIds.richest]: "#00b050",
};

export const chart_AophAEpx5e0_BOcLONPSyYS_Options: (
    chartSource: ChartSourceMultiple
) => Highcharts.Options = chartSource => {
    const [firstChartAnalyticsResponse, secondChartAnalyticsResponse] = chartSource.analyticsResponse;

    const latestAvailableYearByCountryId = getLatestAvailableYearByCountryIdFromTwoCharts(
        firstChartAnalyticsResponse?.rows || [],
        secondChartAnalyticsResponse?.rows || [],
        chartSource.isLatestCOVID19
    );

    const allRowsFilteredByLAY = getAllRowsLatestAvailableYearFromTwoCharts(
        firstChartAnalyticsResponse?.rows || [],
        secondChartAnalyticsResponse?.rows || [],
        chartSource.isLatestCOVID19
    );

    // By ordering latestAvailableYearByCountryId it order data and labels
    const latestAvailableYearByCountryIdOrdered = orderLatestAvailableYearByAverageAndPoorest({
        latestAvailableYearByCountryId,
        allRowsFilteredByLAY,
        seriesIds,
    });

    const categories = Object.keys(latestAvailableYearByCountryIdOrdered).map(countryId => {
        const countryCodeFoundInFirst = mapToWhoCountryCode(
            firstChartAnalyticsResponse?.metaData.items[countryId]?.code || ""
        );
        const countryCodeFoundInSecond = mapToWhoCountryCode(
            secondChartAnalyticsResponse?.metaData.items[countryId]?.code || ""
        );
        return `${countryCodeFoundInFirst || countryCodeFoundInSecond} ${
            latestAvailableYearByCountryIdOrdered[countryId]
        }`;
    });

    return createDotsWithMaxMinVerticalLineChart({
        rows: allRowsFilteredByLAY,
        seriesIds,
        categories,
        seriesNames,
        seriesColors,
        yAxisTitle: "People 16 years and over (%)",
        pointFormat: "{point.y}%",
        latestAvailableYearByCountryId: latestAvailableYearByCountryIdOrdered,
    });
};
