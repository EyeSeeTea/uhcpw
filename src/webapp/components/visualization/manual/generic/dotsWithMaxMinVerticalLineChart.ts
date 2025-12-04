import { AnalyticsMetadataItem } from "@dhis2/analytics";
import { mapToWhoCountryCode } from "../../../../../data/repositories/countries/mapToWhoCountryData";
import { baseLegend } from "../../customization/legends/baseLegend";
import { baseChartOptions } from "./baseChartOptions";
import { getMaxAxisAndTickInterval, getMaxValuesInSeriesData } from "../../utils/getMaxAxisAndTickInterval";
import { ORG_UNIT_GROUP_IDS } from "../../../../../domain/entities/region/Region";
import { Id } from "../../../../../domain/entities/Ref";

type SerieData = {
    name: string | undefined;
    x: number;
    y: number;
    color: string | undefined;
    marker: {
        enabled: boolean;
        symbol: string;
    };
    countryId?: string;
    year?: string;
};

export const createDotsWithMaxMinVerticalLineChart: (params: {
    rows: Array<string[]>;
    seriesIds: Record<string, string>;
    categories: string[];
    seriesNames: Record<string, string>;
    seriesColors: Record<string, string>;
    yAxisTitle: string;
    pointFormat: string;
    latestAvailableYearByCountryId?: Record<string, string>;
    metadataItems?: Record<string, AnalyticsMetadataItem>;
    currentCountryOrRegionCode?: string;
    currentRegionId?: Id;
    isRegionalPage?: boolean;
}) => Highcharts.Options = ({
    rows,
    seriesIds,
    categories,
    seriesNames,
    seriesColors,
    yAxisTitle,
    pointFormat,
    latestAvailableYearByCountryId,
    metadataItems,
    currentCountryOrRegionCode,
    currentRegionId,
    isRegionalPage,
}) => {
    const series = Object.values(seriesIds).map(serieId => {
        const serieChartRows = rows.filter(row => row[0] === serieId);

        const data: SerieData[] = latestAvailableYearByCountryId
            ? Object.keys(latestAvailableYearByCountryId).map((countryId, index) => {
                  const serieChartRow = serieChartRows.find(row => row[0] === serieId && row[1] === countryId) || [];
                  return {
                      name: seriesNames[serieId],
                      x: index,
                      y: serieChartRow[3] ? +serieChartRow[3] : 0,
                      color: seriesColors[serieId],
                      marker: {
                          enabled: true,
                          symbol: "circle",
                      },
                      countryId,
                      year: latestAvailableYearByCountryId[countryId],
                  };
              })
            : serieChartRows.map((row, index) => ({
                  name: seriesNames[serieId],
                  x: index,
                  y: row[3] ? +row[3] : 0,
                  color: seriesColors[serieId],
                  marker: {
                      enabled: true,
                      symbol: "circle",
                  },
                  countryId: row[1],
                  year: row[2],
              }));

        return {
            id: serieId,
            name: seriesNames[serieId],
            color: seriesColors[serieId],
            type: "scatter",
            data: data,
        };
    });

    const rangeSerie =
        series.length > 1
            ? {
                  name: "",
                  type: "columnrange",
                  showInLegend: false,
                  centerInCategory: true,
                  data: latestAvailableYearByCountryId
                      ? Object.keys(latestAvailableYearByCountryId).map(countryId => {
                            const countryData = series.map(serie => {
                                const countrySerieData = serie.data.find(data => data.countryId === countryId);
                                return countrySerieData?.y || 0;
                            });
                            return [Math.min(...countryData), Math.max(...countryData)];
                        })
                      : categories.map(category => {
                            const dataValuesInCategory = series.map(serie => {
                                const countryCode = category.split(" ")[0];
                                const year = category.split(" ")[1];

                                return (
                                    serie.data.find(data => {
                                        const country = metadataItems ? metadataItems[data.countryId || ""] : undefined;
                                        const code = mapToWhoCountryCode(country?.code || "");

                                        return code === countryCode && data.year === year;
                                    })?.y || 0
                                );
                            });

                            return [Math.min(...dataValuesInCategory), Math.max(...dataValuesInCategory)];
                        }),
              }
            : undefined;

    const seriesData = series.map(serie => serie.data.map(data => data?.y || 0));
    const maxValuesInSeriesData = getMaxValuesInSeriesData(seriesData);
    const { max: adjustedMaxYAxis, tickInterval: yTickInterval } = getMaxAxisAndTickInterval(maxValuesInSeriesData);

    const noRotateLabels =
        isRegionalPage &&
        (currentRegionId === ORG_UNIT_GROUP_IDS.EASTERN_EUROPE_AND_CENTRAL_ASIA ||
            currentRegionId === ORG_UNIT_GROUP_IDS.WESTERN_BALKANS);
    return {
        ...baseChartOptions,
        xAxis: {
            categories: categories,
            labels: {
                rotation: noRotateLabels ? 0 : -90,
                formatter: function () {
                    const countryLabel = (this.value as string).split(" ")[0];

                    return countryLabel === currentCountryOrRegionCode
                        ? `<strong style="color:#49abe2;">${this.value}</strong>`
                        : this.value;
                },
            },
        },
        yAxis: {
            title: {
                text: yAxisTitle,
                style: { fontSize: "13px" },
            },
            max: adjustedMaxYAxis,
            tickInterval: yTickInterval,
        },
        legend: baseLegend,
        series: rangeSerie ? [rangeSerie, ...series] : series,
        plotOptions: {
            columnrange: {
                pointWidth: 1,
                pointPadding: 0,
                borderWidth: 0,
                color: "lightgrey",
            },
            series: {
                marker: {
                    enabled: true,
                    symbol: "circle",
                },
                events: {
                    legendItemClick: function () {
                        const chart = this.chart;
                        const isHide = this.visible;

                        const visibleSeries = chart.series.filter(
                            s =>
                                s.type === "scatter" &&
                                ((!isHide && (s.visible || s.name === this.name)) ||
                                    (isHide && s.name !== this.name && s.visible))
                        );

                        const visibleSeriesData = visibleSeries.map(serie => serie.data.map(data => data?.y || 0));
                        const maxValuesInVisibleSeriesData = getMaxValuesInSeriesData(visibleSeriesData);
                        const { max: adjustedMaxYAxis, tickInterval: yTickInterval } =
                            getMaxAxisAndTickInterval(maxValuesInVisibleSeriesData);

                        this.chart.yAxis.forEach(yAxis => {
                            yAxis.update({
                                max: adjustedMaxYAxis,
                                tickInterval: yTickInterval,
                            });
                        });

                        const rangeSeries = chart.series.find(s => s.type === "columnrange");

                        const data = rangeSeries?.data.map(({ category }) => {
                            const countryData = visibleSeries?.map(serie => {
                                const countrySerieData = serie.data.find(data => data.category === category);
                                return countrySerieData?.y || 0;
                            });
                            return [Math.min(...countryData), Math.max(...countryData)];
                        });

                        rangeSeries?.setData(data as Highcharts.PointOptionsType[]);
                    },
                },
            },
        },
        tooltip: {
            pointFormat: pointFormat,
        },
    } as Highcharts.Options;
};
