import _ from "lodash";
import { mapToWhoCountryCode } from "../../../../../data/repositories/countries/mapToWhoCountryData";
import { baseLegend } from "../../customization/legends/baseLegend";
import { ChartSource } from "../chartOptions";
import { baseChartOptions } from "./baseChartOptions";
import { setYAxisMaxAxisAndTickIntervalWhenLegendItemClick } from "../../utils/getMaxAxisAndTickInterval";
import { getMaxYAxisAndYTickInterval } from "../utils/getMaxYAxisAndYTickInterval";
import { ORG_UNIT_GROUP_IDS } from "../../../../../domain/entities/region/Region";
import { getColorOfRegionByRegionCode } from "../../../../pages/regional-page/getColorOfRegion";
import { fillDataSourceWithEmptyData } from "../utils/fillDataSourceWithEmptyData";
import { getOrgUnitKey } from "../utils/getOrgUnitKey";

function getCountriesAndYearInRows(rows: string[][]): string[] {
    const groupByCountryIdAndYear = _(rows)
        .groupBy(row => {
            const orgUnitId = row[1]?.toString() || "";
            const year = row[2] || "";

            return `${orgUnitId}_${year}`;
        })
        .value();
    return Object.keys(groupByCountryIdAndYear);
}

export const comparativeColumnChartOptions: (params: {
    chartSource: ChartSource;
    seriesNames: Record<string, string>;
    seriesColors: Record<string, string>;
    currentSerieColor?: string;
    orderByValueInSerie?: string;
    stackedValuesUpTo100?: boolean;
    isStacked?: boolean;
    maxValueUpTo100?: boolean;
    categoryIdsOrder?: string[];
    hideYear?: boolean;
    useRegionColors?: boolean;
    isDescOrder?: boolean;
}) => Highcharts.Options = ({
    chartSource,
    seriesNames,
    seriesColors,
    currentSerieColor,
    orderByValueInSerie,
    stackedValuesUpTo100,
    isStacked,
    maxValueUpTo100,
    categoryIdsOrder,
    hideYear,
    useRegionColors,
    isDescOrder,
}) => {
    const orderRows = _(chartSource.analyticsResponse.rows)
        .groupBy(row => {
            const orgUnitId = row[1]?.toString() || "";
            const orgUnit = getOrgUnitKey(chartSource, orgUnitId);

            const year = row[2] || "";

            return `${orgUnit} ${year}`;
        })
        .orderBy(
            items => {
                if (orderByValueInSerie) {
                    const item = items.find(row => row[0] === orderByValueInSerie);

                    return item ? (item[3] ? +item[3] : 0) : 0;
                } else {
                    return _(items).sumBy(row => (row[3] ? +row[3] : 0));
                }
            },
            isDescOrder ? "desc" : "asc"
        )
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

    const countriesAndYearInXaxis = getCountriesAndYearInRows(chartSource.analyticsResponse.rows);
    const sortedCountriesAndYear = orderByValueInSerie
        ? getCountriesAndYearInRows(groupByDx[orderByValueInSerie] || [])
        : undefined;

    const series = keys.map(dxId => {
        const dataSource = groupByDx[dxId] || [];

        const filledDataSourceWithEmptyData =
            dataSource.length < countriesAndYearInXaxis.length && !!orderByValueInSerie && sortedCountriesAndYear
                ? fillDataSourceWithEmptyData(
                      dataSource,
                      countriesAndYearInXaxis,
                      dxId,
                      sortedCountriesAndYear,
                      isDescOrder
                  )
                : dataSource;

        const serie = {
            id: dxId,
            type: "column",
            name: seriesNames[dxId],
            color: seriesColors[dxId],
            data: filledDataSourceWithEmptyData.map(row => {
                const orgUnitIdOrCategoryId = row[1]?.toString() || "";
                const region = chartSource.regions.find(
                    region => region.id === orgUnitIdOrCategoryId || region.linkedOrgUnitId === orgUnitIdOrCategoryId
                );
                const code = region
                    ? region.code
                    : mapToWhoCountryCode(
                          chartSource.analyticsResponse.metaData.items[orgUnitIdOrCategoryId]?.code || ""
                      );

                const year = row[2] || "";
                const value = row[3] ? +row[3] : 0;

                const regionCodeColor =
                    useRegionColors && region?.code ? { color: getColorOfRegionByRegionCode(region?.code) } : undefined;

                const color =
                    (currentCountryCode === code || code === currentRegion?.code) && currentSerieColor
                        ? { color: currentSerieColor }
                        : regionCodeColor ?? undefined;

                return {
                    name: hideYear ? code : `${code} ${year}`,
                    y: value,
                    categoryId: row[1] || "",
                    id: code,
                    ...color,
                };
            }),
        };

        return stackedValuesUpTo100 ? { ...serie, stacking: "percent" } : serie;
    });

    const { max: adjustedMaxYAxis, tickInterval: yTickInterval } = getMaxYAxisAndYTickInterval(series, {
        isStacked,
        stackedValuesUpTo100,
        maxValueUpTo100,
    });

    const sortedSeries = categoryIdsOrder
        ? series.map(serie => {
              const sortedData = serie.data.sort((a, b) => {
                  const aIndex = categoryIdsOrder.indexOf(a?.categoryId);
                  const bIndex = categoryIdsOrder.indexOf(b?.categoryId);

                  return aIndex - bIndex;
              });
              return {
                  ...serie,
                  data: sortedData,
              };
          })
        : series;

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

            //format: "{point.country}",
            labels: {
                rotation: noRotateLabels ? 0 : -90,
                formatter: function () {
                    if (!this.value || typeof this.value !== "string") {
                        return this.value || "";
                    }

                    const parts = this.value.split(" ");
                    if (parts.length === 0) return this.value || "";

                    const countryLabel = parts[0];

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
        series: sortedSeries,
        plotOptions: {
            column: {
                stacking: "normal",
                events: {
                    legendItemClick: function (this: Highcharts.Series) {
                        return setYAxisMaxAxisAndTickIntervalWhenLegendItemClick(this, {
                            isStacked,
                            stackedValuesUpTo100,
                            maxValueUpTo100,
                        });
                    },
                },
            },
        },
    } as Highcharts.Options;
};
