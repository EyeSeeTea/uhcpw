import { ChartSourceMultiple } from "./chartOptions";
import {
    getAllRowsLatestAvailableYearFromTwoCharts,
    getLatestAvailableYearByCountryIdFromTwoCharts,
    orderLatestAvailableYearByAverageAndOther,
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
    const currentCountryCode =
        chartSource.countries.find(country => country.id === chartSource.currentCountryOrRegion)?.code || "";

    const currentRegion = chartSource.regions.find(
        region =>
            region.id === chartSource.currentCountryOrRegion ||
            region.linkedOrgUnitId === chartSource.currentCountryOrRegion
    );

    const [firstChartAnalyticsResponse, secondChartAnalyticsResponse] = chartSource.analyticsResponse;

    const latestAvailableYearByCountryId = getLatestAvailableYearByCountryIdFromTwoCharts(
        firstChartAnalyticsResponse?.rows || [],
        secondChartAnalyticsResponse?.rows || [],
        chartSource.isLatestCOVID19,
        chartSource.maxYearToFilterBy
    );

    const allRowsFilteredByLAY = getAllRowsLatestAvailableYearFromTwoCharts(
        firstChartAnalyticsResponse?.rows || [],
        secondChartAnalyticsResponse?.rows || [],
        chartSource.isLatestCOVID19,
        chartSource.maxYearToFilterBy
    );

    // By ordering latestAvailableYearByCountryId it order data and labels
    const latestAvailableYearByCountryIdOrdered = orderLatestAvailableYearByAverageAndOther({
        latestAvailableYearByCountryId: latestAvailableYearByCountryId,
        allRowsFilteredByLAY: allRowsFilteredByLAY,
        seriesIds: seriesIds,
        otherKey: "poorest",
    });

    const categories = Object.keys(latestAvailableYearByCountryIdOrdered).map(orgUnitIdOrRegionId => {
        const region = chartSource.regions.find(
            region => region.id === orgUnitIdOrRegionId || region.linkedOrgUnitId === orgUnitIdOrRegionId
        );
        const codeFoundInFirst = region
            ? region.code
            : mapToWhoCountryCode(firstChartAnalyticsResponse?.metaData.items[orgUnitIdOrRegionId]?.code || "");

        const codeFoundInSecond = region
            ? region.code
            : mapToWhoCountryCode(secondChartAnalyticsResponse?.metaData.items[orgUnitIdOrRegionId]?.code || "");

        return `${codeFoundInFirst || codeFoundInSecond} ${latestAvailableYearByCountryIdOrdered[orgUnitIdOrRegionId]}`;
    });

    return createDotsWithMaxMinVerticalLineChart({
        rows: allRowsFilteredByLAY,
        seriesIds,
        categories,
        seriesNames,
        seriesColors,
        yAxisTitle: "Population (%)",
        pointFormat: "{point.y}%",
        latestAvailableYearByCountryId: latestAvailableYearByCountryIdOrdered,
        currentCountryOrRegionCode: currentCountryCode || currentRegion?.code,
        currentRegionId: currentRegion?.id,
        isRegionalPage: chartSource.isRegionalPage,
        sharedYAxisConfig: chartSource.sharedYAxisConfig,
        hideYear: !chartSource.isLatestYearAvailable && !chartSource.isLatestCOVID19,
    });
};
