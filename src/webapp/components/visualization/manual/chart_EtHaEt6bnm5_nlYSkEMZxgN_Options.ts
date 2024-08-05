import { baseLegend } from "../customization/legends/baseLegend";
import { ChartSourceMultiple } from "./chartOptions";
import { baseChartOptions } from "./generic/baseChartOptions";
import {
    getAllRowsLatestAvailableYearFromTwoCharts,
    getLatestAvailableYearByCountryIdFromTwoCharts,
} from "../../../../data/repositories/indicator-explorer/utils/lastAvailableYearHelpers";
import { mapToWhoCountryCode } from "../../../../data/repositories/countries/mapToWhoCountryData";

type SeriesKey = "poorest" | "average" | "richest";

const seriesIds: Record<SeriesKey, string> = {
    poorest: "GeiKSyJLeKt",
    average: "CQq6HWprR0p",
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

export const chart_EtHaEt6bnm5_nlYSkEMZxgN_Options: (
    chartSource: ChartSourceMultiple
) => Highcharts.Options = chartSource => {
    const [firstChartAnalyticsResponse, secondChartAnalyticsResponse] = chartSource.analyticsResponse;
    const [firstChartVisualization, secondChartVisualization] = chartSource.visualization;

    const latestAvailableYearByCountryId = getLatestAvailableYearByCountryIdFromTwoCharts(
        firstChartAnalyticsResponse?.rows || [],
        secondChartAnalyticsResponse?.rows || []
    );

    const categories = Object.keys(latestAvailableYearByCountryId).map(countryId => {
        const countryCodeFoundInFirst = mapToWhoCountryCode(
            firstChartAnalyticsResponse?.metaData.items[countryId]?.code || ""
        );
        const countryCodeFoundInSecond = mapToWhoCountryCode(
            secondChartAnalyticsResponse?.metaData.items[countryId]?.code || ""
        );
        return `${countryCodeFoundInFirst || countryCodeFoundInSecond} ${latestAvailableYearByCountryId[countryId]}`;
    });

    const allRowsFilteredByLAY = getAllRowsLatestAvailableYearFromTwoCharts(
        firstChartAnalyticsResponse?.rows || [],
        secondChartAnalyticsResponse?.rows || []
    );

    const series = Object.values(seriesIds).map(serieId => {
        const serieChartRows = allRowsFilteredByLAY.filter(row => row[0] === serieId);

        return {
            name: seriesNames[serieId],
            color: seriesColors[serieId],
            type: "scatter",
            data: Object.keys(latestAvailableYearByCountryId).map((countryId, index) => {
                const serieChartRow = serieChartRows.find(row => row[0] === serieId && row[1] === countryId) || [];
                return {
                    x: index,
                    y: serieChartRow[3] ? +serieChartRow[3] : 0,
                    color: seriesColors[serieId],
                    marker: {
                        enabled: true,
                        symbol: "circle",
                    },
                    countryId,
                    year: latestAvailableYearByCountryId[countryId],
                    name: seriesNames[serieId],
                };
            }),
        };
    });

    const rangeSerie = {
        name: "",
        type: "columnrange",
        showInLegend: false,
        centerInCategory: true,
        data: Object.keys(latestAvailableYearByCountryId).map(countryId => {
            const countryData = series.map(serie => {
                const countrySerieData = serie.data.find(data => data.countryId === countryId);
                return countrySerieData?.y || 0;
            });
            return [Math.min(...countryData), Math.max(...countryData)];
        }),
    };

    return {
        ...baseChartOptions,
        xAxis: {
            categories: categories,
            labels: {
                rotation: -90,
            },
        },
        yAxis: {
            title: {
                text: firstChartVisualization?.axes[0]?.title.text || secondChartVisualization?.axes[0]?.title.text,
                style: { fontSize: "13px" },
            },
        },
        legend: baseLegend,
        series: [rangeSerie, ...series],
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

                        const visibleSeries = chart.series.filter(
                            s =>
                                (!this.visible && s.type === "scatter") ||
                                (this.visible && s.type === "scatter" && s.name !== this.name)
                        );
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
            pointFormat: "{point.y}%",
        },
    } as Highcharts.Options;
};
