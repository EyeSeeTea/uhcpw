import { ChartSource } from "./chartOptions";
import { mapToWhoCountryCode } from "../../../../data/repositories/countries/mapToWhoCountryData";
import { createDotsWithMaxMinVerticalLineChart } from "./generic/dotsWithMaxMinVerticalLineChart";
import { orderLatestAvailableYearByAverageAndPoorest } from "../../../../data/repositories/indicator-explorer/utils/lastAvailableYearHelpers";
import { getChartSourceFilteredByLastAvailableYear } from "./utils/getChartSourceFilteredByLastAvailableYear";

type SeriesKey = "more65years" | "average" | "less25years";

const seriesIds: Record<SeriesKey, string> = {
    more65years: "Kq0QsqIAaUd",
    average: "GyiW7dS7BIl",
    less25years: "xm098yOPFlh",
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

export const chart_oaYpnZIdm5C_Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    const chartSourceFiltered =
        chartSource.isLatestYearAvailable || chartSource.isLatestCOVID19
            ? getChartSourceFilteredByLastAvailableYear(chartSource)
            : chartSource;

    const currentCountryCode =
        chartSourceFiltered.countries.find(country => country.id === chartSourceFiltered.currentCountryOrRegion)
            ?.code || "";

    const currentRegion = chartSourceFiltered.regions.find(
        region =>
            region.id === chartSourceFiltered.currentCountryOrRegion ||
            region.linkedOrgUnitId === chartSourceFiltered.currentCountryOrRegion
    );

    const orderedCountry = orderLatestAvailableYearByAverageAndPoorest({
        allRowsFilteredByLAY: chartSourceFiltered.analyticsResponse.rows,
        seriesIds,
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

        return chartSourceFiltered.isRegionalPage ? `${code} ${orderedCountry[orgUnitIdOrRegionId]}` : code;
    });

    return createDotsWithMaxMinVerticalLineChart({
        rows: chartSourceFiltered.analyticsResponse.rows,
        seriesIds,
        categories,
        seriesNames,
        seriesColors,
        yAxisTitle: chartSourceFiltered.visualization.axes[0]?.title.text || "",
        pointFormat: "{point.y}%",
        latestAvailableYearByCountryId: orderedCountry,
        currentCountryOrRegionCode: currentCountryCode || currentRegion?.code,
        currentRegionId: currentRegion?.id,
        isRegionalPage: chartSourceFiltered.isRegionalPage,
        sharedYAxisConfig: chartSourceFiltered.sharedYAxisConfig,
    });
};
