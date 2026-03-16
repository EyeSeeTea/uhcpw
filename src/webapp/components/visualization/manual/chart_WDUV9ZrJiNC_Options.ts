import { ChartSource } from "./chartOptions";
import { getChartSourceFilteredByLastAvailableYear } from "./utils/getChartSourceFilteredByLastAvailableYear";
import _ from "lodash";
import { mapToWhoCountryCode } from "../../../../data/repositories/countries/mapToWhoCountryData";
import { getMaxYAxisAndYTickInterval } from "./utils/getMaxYAxisAndYTickInterval";
import { baseChartOptions } from "./generic/baseChartOptions";
import { baseLegend } from "../customization/legends/baseLegend";
import { setYAxisMaxAxisAndTickIntervalWhenLegendItemClick } from "../utils/getMaxAxisAndTickInterval";
import { ORG_UNIT_GROUP_IDS } from "../../../../domain/entities/region/Region";
import { getOrgUnitKey } from "./utils/getOrgUnitKey";

const orderByValueInSerie = "WmOGqGcov4f";

const seriesNames: Record<string, string> = {
    WmOGqGcov4f: "All households",
    WRiCOxrLDOS: "Poorest consumption quintile",
};

const seriesColors: Record<string, string> = {
    WmOGqGcov4f: "#8fa2d4",
    WRiCOxrLDOS: "#2f5597",
};

export const chart_WDUV9ZrJiNC_Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    const chartSourceWithFilteredRowsByLAY = getChartSourceFilteredByLastAvailableYear(chartSource);
    const hideYear = !chartSource.isLatestYearAvailable && !chartSource.isLatestCOVID19;

    const orderRows = _(chartSourceWithFilteredRowsByLAY.analyticsResponse.rows)
        .groupBy(row => {
            const orgUnitId = row[1]?.toString() || "";
            const orgUnit = getOrgUnitKey(chartSource, orgUnitId);
            const year = row[2] || "";

            return `${orgUnit} ${year} `;
        })
        .orderBy(items => {
            const item = items.find(row => row[0] === orderByValueInSerie);

            return item ? (item[3] ? +item[3] : 0) : 0;
        })
        .value()
        .flat();

    const groupByDx = _(orderRows)
        .groupBy(row => row[0])
        .value();

    const keys = _(groupByDx)
        .keys()
        .sortBy(key => _(seriesNames).keys().indexOf(key))
        .value();

    const currentCountryCode =
        chartSource.countries.find(country => country.id === chartSource.currentCountryOrRegion)?.code || "";

    const currentRegion = chartSource.regions.find(
        region =>
            region.id === chartSource.currentCountryOrRegion ||
            region.linkedOrgUnitId === chartSource.currentCountryOrRegion
    );

    const series = keys.map(dxId => {
        const dataSource = groupByDx[dxId] || [];

        return {
            id: dxId,
            type: "column",
            name: seriesNames[dxId],
            color: seriesColors[dxId],
            data: dataSource.map(row => {
                const orgUnitIdOrRegionId = row[1]?.toString() || "";
                const region = chartSource.regions.find(
                    region => region.id === orgUnitIdOrRegionId || region.linkedOrgUnitId === orgUnitIdOrRegionId
                );
                const code = region
                    ? region.code
                    : mapToWhoCountryCode(
                          chartSourceWithFilteredRowsByLAY.analyticsResponse.metaData.items[orgUnitIdOrRegionId]
                              ?.code || ""
                      );

                const year = row[2] || "";
                const value = row[3] ? +row[3] : 0;

                return {
                    name: hideYear ? code : `${code} ${year} `,
                    y: value,
                };
            }),
        };
    });

    const { max: adjustedMaxYAxis, tickInterval: yTickInterval } = getMaxYAxisAndYTickInterval(series);

    const noRotateLabels =
        chartSource.isRegionalPage &&
        (currentRegion?.id === ORG_UNIT_GROUP_IDS.EASTERN_EUROPE_AND_CENTRAL_ASIA ||
            currentRegion?.id === ORG_UNIT_GROUP_IDS.WESTERN_BALKANS);

    return {
        ...baseChartOptions,
        chart: {
            type: "column",
        },
        xAxis: {
            title: "",
            type: "category",
            labels: {
                rotation: noRotateLabels ? 0 : -90,
                formatter: function () {
                    const countryLabel = (this.value as string).split(" ")[0];

                    return countryLabel === currentCountryCode || countryLabel === currentRegion?.code
                        ? `<strong style="color:#49abe2;">${this.value}</strong>`
                        : this.value;
                },
            },
        },
        yAxis: {
            title: {
                text: "Households (%)",
                style: { fontSize: "13px" },
            },
            max: adjustedMaxYAxis,
            tickInterval: yTickInterval,
        },
        legend: baseLegend,
        series,
        plotOptions: {
            column: {
                events: {
                    legendItemClick: function (this: Highcharts.Series) {
                        return setYAxisMaxAxisAndTickIntervalWhenLegendItemClick(this);
                    },
                },
            },
        },
    } as Highcharts.Options;
};
