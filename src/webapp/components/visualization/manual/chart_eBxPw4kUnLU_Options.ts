import { ChartSource } from "./chartOptions";
import { orderLatestAvailableYearByAverageAndOther } from "../../../../data/repositories/indicator-explorer/utils/lastAvailableYearHelpers";
import { mapToWhoCountryCode } from "../../../../data/repositories/countries/mapToWhoCountryData";
import { createDotsWithMaxMinVerticalLineChart } from "./generic/dotsWithMaxMinVerticalLineChart";
import { getChartSourceFilteredByLastAvailableYear } from "./utils/getChartSourceFilteredByLastAvailableYear";

type SeriesKey = "more65years" | "average" | "less25years";

const seriesIds: Record<SeriesKey, string> = {
    more65years: "CqwZui9SRJF",
    average: "Wm2v9VGGSuK",
    less25years: "a9BMBz5F1s6",
};

const seriesNames: Record<typeof seriesIds[keyof typeof seriesIds], string> = {
    [seriesIds.more65years]: "65+ Years",
    [seriesIds.average]: "Average",
    [seriesIds.less25years]: "<25 Years",
};

const seriesColors: Record<typeof seriesIds[keyof typeof seriesIds], string> = {
    [seriesIds.more65years]: "#c00000",
    [seriesIds.average]: "#ffc000",
    [seriesIds.less25years]: "#00b050",
};

export const chart_eBxPw4kUnLU_Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    const chartSourceFiltered =
        chartSource.isLatestYearAvailable || chartSource.isLatestCOVID19
            ? getChartSourceFilteredByLastAvailableYear(chartSource)
            : chartSource;

    const currentCountryCode =
        chartSourceFiltered.countries.find(country => country.id === chartSource.currentCountryOrRegion)?.code || "";

    const currentRegion = chartSourceFiltered.regions.find(
        region =>
            region.id === chartSource.currentCountryOrRegion ||
            region.linkedOrgUnitId === chartSource.currentCountryOrRegion
    );

    const orderedCountry = orderLatestAvailableYearByAverageAndOther({
        allRowsFilteredByLAY: chartSourceFiltered.analyticsResponse.rows,
        seriesIds: seriesIds,
        otherKey: "more65years",
    });

    const categories = Object.keys(orderedCountry).map(orgUnitIdOrRegionId => {
        const region = chartSourceFiltered.regions.find(
            region => region.id === orgUnitIdOrRegionId || region.linkedOrgUnitId === orgUnitIdOrRegionId
        );
        const code = region
            ? region.code
            : mapToWhoCountryCode(
                  chartSourceFiltered.analyticsResponse.metaData.items[orgUnitIdOrRegionId]?.code || orgUnitIdOrRegionId
              );

        return `${code} ${orderedCountry[orgUnitIdOrRegionId]}`;
    });

    return createDotsWithMaxMinVerticalLineChart({
        rows: chartSourceFiltered.analyticsResponse.rows,
        seriesIds,
        categories,
        seriesNames,
        seriesColors,
        yAxisTitle: "Population (%)",
        pointFormat: "{point.y}%",
        latestAvailableYearByCountryId: orderedCountry,
        currentCountryOrRegionCode: currentCountryCode || currentRegion?.code,
        currentRegionId: currentRegion?.id,
        isRegionalPage: chartSourceFiltered.isRegionalPage,
        sharedYAxisConfig: chartSourceFiltered.sharedYAxisConfig,
    });
};
