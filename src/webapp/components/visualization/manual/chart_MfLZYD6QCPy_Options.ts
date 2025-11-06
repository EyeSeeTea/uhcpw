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
    const currentCountryCode =
        chartSource.countries.find(country => country.id === chartSource.currentCountryOrRegion)?.code || "";

    const currentRegion = chartSource.regions.find(
        region =>
            region.id === chartSource.currentCountryOrRegion ||
            region.linkedOrgUnitId === chartSource.currentCountryOrRegion
    );

    const orderedCountry = orderLatestAvailableYearByAverageAndPoorest({
        allRowsFilteredByLAY: chartSource.analyticsResponse.rows,
        seriesIds,
    });

    const categories = Object.keys(orderedCountry).map(orgUnitIdOrRegionId => {
        const region = chartSource.regions.find(
            region => region.id === orgUnitIdOrRegionId || region.linkedOrgUnitId === orgUnitIdOrRegionId
        );
        const code = region
            ? region.code
            : mapToWhoCountryCode(
                  chartSource.analyticsResponse.metaData.items[orgUnitIdOrRegionId]?.code || orgUnitIdOrRegionId
              );

        return chartSource.isRegionalPage ? `${code} ${orderedCountry[orgUnitIdOrRegionId]}` : code;
    });

    return createDotsWithMaxMinVerticalLineChart({
        rows: chartSource.analyticsResponse.rows,
        seriesIds,
        categories,
        seriesNames,
        seriesColors,
        yAxisTitle: chartSource.visualization.axes[0]?.title.text || "",
        pointFormat: "{point.y}%",
        latestAvailableYearByCountryId: orderedCountry,
        currentCountryOrRegionCode: currentCountryCode || currentRegion?.code,
        currentRegionId: currentRegion?.id,
        isRegionalPage: chartSource.isRegionalPage,
    });
};
