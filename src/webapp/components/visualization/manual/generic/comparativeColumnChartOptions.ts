import _ from "lodash";
import { mapToWhoCountryCode } from "../../../../../data/repositories/countries/mapToWhoCountryData";
import { baseLegend } from "../../customization/legends/baseLegend";
import { ChartSource } from "../chartOptions";
import { baseChartOptions } from "./baseChartOptions";
import { setYAxisMaxAxisAndTickIntervalWhenLegendItemClick } from "../../utils/getMaxAxisAndTickInterval";
import { getMaxYAxisAndYTickInterval } from "../utils/getMaxYAxisAndYTickInterval";

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
}) => {
    const orderRows = _(chartSource.analyticsResponse.rows)
        .groupBy(row => {
            const orgUnitId = row[1]?.toString() || "";
            const orgUnit = chartSource.analyticsResponse.metaData.items[orgUnitId]?.code || "";
            const year = row[2] || "";

            return `${orgUnit} ${year} `;
        })
        .orderBy(items => {
            if (orderByValueInSerie) {
                const item = items.find(row => row[0] === orderByValueInSerie);

                return item ? (item[3] ? +item[3] : 0) : 0;
            } else {
                return _(items).sumBy(row => (row[3] ? +row[3] : 0));
            }
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
        chartSource.countries.find(country => country.id === chartSource.currentCountry)?.code || "";

    const maxLengthInDx = Math.max(...keys.map(key => (groupByDx[key] || []).length));
    const groupByDxWithMaxLength =
        Object.values(groupByDx).find(groupOfDx => (groupOfDx || []).length === maxLengthInDx) || [];

    const series = keys.map(dxId => {
        const dataSource = groupByDx[dxId] || [];

        const filledDataSourceWithEmptyData =
            dataSource.length < maxLengthInDx && !!orderByValueInSerie
                ? groupByDxWithMaxLength.reduce((acc: Array<string[]>, row) => {
                      const countryId = row[1]?.toString() || "";
                      const year = row[2] || "";
                      const currentDataSourceFound = dataSource.find(row => row[1] === countryId && row[2] === year);
                      return currentDataSourceFound
                          ? [...acc, currentDataSourceFound]
                          : [...acc, [dxId, countryId, year, "0"]];
                  }, [])
                : dataSource;

        const serie = {
            id: dxId,
            type: "column",
            name: seriesNames[dxId],
            color: seriesColors[dxId],
            data: filledDataSourceWithEmptyData.map(row => {
                const orgUnitIdOrCategoryId = row[1]?.toString() || "";
                const orgUnitCodeOrCategory = mapToWhoCountryCode(
                    chartSource.analyticsResponse.metaData.items[orgUnitIdOrCategoryId]?.code || ""
                );
                const year = row[2] || "";
                const value = row[3] ? +row[3] : 0;

                const color =
                    currentCountryCode === orgUnitCodeOrCategory && currentSerieColor
                        ? { color: currentSerieColor }
                        : undefined;

                return {
                    name: hideYear ? orgUnitCodeOrCategory : `${orgUnitCodeOrCategory} ${year} `,
                    y: value,
                    categoryId: row[1] || "",
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
                rotation: -90,
                formatter: function () {
                    const countryLabel = (this.value as string).split(" ")[0];

                    return countryLabel === currentCountryCode
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
