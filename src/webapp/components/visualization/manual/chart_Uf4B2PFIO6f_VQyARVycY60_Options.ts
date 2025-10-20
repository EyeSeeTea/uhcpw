import _ from "lodash";
import { baseLegend } from "../customization/legends/baseLegend";
import { ChartSourceMultiple } from "./chartOptions";
import { baseChartOptions } from "./generic/baseChartOptions";
import { yAxisformatNumberLabel } from "../customization/yAxis/formatNumberLabel";
import { getMaxAxisAndTickInterval, sumSeriesData } from "../utils/getMaxAxisAndTickInterval";
import { getMaxYAxisAndYTickInterval, SeriesWithData } from "./utils/getMaxYAxisAndYTickInterval";

const seriesNames: Record<string, string> = {
    GmjzjDrflLO: "Average household capacity to pay",
    Qcsm1V9aywx: "Cost of meeting basic needs",
    OeK0H8uJwLU: "Share of households living below the basic needs line (%)",
};

const seriesColors: Record<string, string> = {
    GmjzjDrflLO: "#8fa2d4",
    Qcsm1V9aywx: "#2f5597",
    OeK0H8uJwLU: "#c00001",
};

export const chart_Uf4B2PFIO6f_VQyARVycY60_Options: (
    chartSource: ChartSourceMultiple
) => Highcharts.Options = chartSource => {
    const [firstChartAnalyticsResponse, secondChartAnalyticsResponse] = chartSource.analyticsResponse;
    const [firstChartVisualization, secondChartVisualization] = chartSource.visualization;
    const filteredYears = firstChartAnalyticsResponse?.metaData.dimensions.pe || [];

    const allYears = _([
        ..._.map(firstChartAnalyticsResponse?.rows, row => row[1]),
        ..._.map(secondChartAnalyticsResponse?.rows, row => row[1]),
    ])
        .uniq()
        .filter(year => !!year && filteredYears.includes(year))
        .compact()
        .orderBy()
        .value();

    const firstChartDataByDx = formatDxGroupsFromRows(firstChartAnalyticsResponse?.rows, allYears);
    const secondChartDataByDx = formatDxGroupsFromRows(secondChartAnalyticsResponse?.rows, allYears);
    const series = [
        ...(firstChartAnalyticsResponse?.metaData.dimensions.dx?.reverse().map(dxId => {
            return {
                id: dxId,
                type: "column",
                color: seriesColors[dxId],
                name: seriesNames[dxId],
                data: firstChartDataByDx[dxId]?.map(row => (row[2] ? +row[2] : null)),
            };
        }) || []),
        ...(secondChartAnalyticsResponse?.metaData.dimensions.dx?.map(dxId => {
            return {
                id: dxId,
                type: "scatter",
                color: seriesColors[dxId],
                name: seriesNames[dxId],
                data: secondChartDataByDx[dxId]?.map(row => (row[2] ? +row[2] : null)),
                yAxis: 1,
            };
        }) || []),
    ];

    const countryId = firstChartAnalyticsResponse?.metaData.dimensions.ou?.length
        ? firstChartAnalyticsResponse?.metaData.dimensions.ou[0]
        : undefined;
    const currencyCode = _.find(chartSource.countries, { id: countryId })?.currencyCode || "€";

    const columnSeriesData = series.filter(s => s.type === "column").map(s => s.data || []);
    const sumOfColumnSeriesData = sumSeriesData(columnSeriesData);
    const { max: adjustedMaxColumnYAxis, tickInterval: yColumnTickInterval } =
        getMaxAxisAndTickInterval(sumOfColumnSeriesData);

    const scatterData = _.compact(series.find(s => s.type === "scatter")?.data || []);
    const { max: adjustedMaxScatterYAxis, tickInterval: yScatterTickInterval } = getMaxAxisAndTickInterval(scatterData);

    return {
        ...baseChartOptions,
        xAxis: {
            categories: allYears,
        },
        yAxis: [
            {
                title: {
                    text: firstChartVisualization?.axes[0]?.title.text.replace("€", currencyCode),
                    style: { fontSize: "13px" },
                },
                labels: yAxisformatNumberLabel.yAxis?.labels,
                max: adjustedMaxColumnYAxis,
                tickInterval: yColumnTickInterval,
            },
            {
                min: 0,
                title: {
                    text: secondChartVisualization?.axes[0]?.title.text,
                    style: { fontSize: "13px" },
                    rotation: 270,
                    x: 5,
                },
                allowDecimals: Math.max(...scatterData) <= 1,
                opposite: true,
                max: adjustedMaxScatterYAxis,
                tickInterval: yScatterTickInterval,
            },
        ],
        legend: {
            ...baseLegend,
            symbolHeight: 10,
            symbolWidth: 10,
            symbolRadius: 0,
            width: 250,
            itemStyle: { ...baseLegend.itemStyle, whiteSpace: "normal", textOverflow: "none" },
        },
        series,
        plotOptions: {
            column: {
                stacking: "normal",
            },
            scatter: {
                enableMouseTracking: false,
                dataLabels: {
                    enabled: true,
                    formatter: function () {
                        return this.y + "%";
                    },
                    style: {
                        color: "black",
                        fontWeight: "bold",
                        textOutline: "none",
                    },
                },
            },
            series: {
                events: {
                    legendItemClick: function (this: Highcharts.Series) {
                        const isSelectedSerieHide = this.visible;
                        const typeSelectedSerie = this.options.type;
                        const selectedSerieIndex = this.index;
                        const seriesInChart = this.chart.series as SeriesWithData[];

                        const visibleSeries = seriesInChart.filter((serie, index) => {
                            const isSelectedSerie = index === selectedSerieIndex;
                            const isSelectedSerieVisible = !isSelectedSerieHide && isSelectedSerie;
                            const isNotSelectedSeriesVisible = !isSelectedSerie && serie.visible;
                            return (
                                serie.options?.type === typeSelectedSerie &&
                                (isSelectedSerieVisible || isNotSelectedSeriesVisible)
                            );
                        });

                        const { max: adjustedMaxYAxis, tickInterval: yTickInterval } = getMaxYAxisAndYTickInterval(
                            visibleSeries,
                            {
                                isStacked: typeSelectedSerie === "column",
                            }
                        );

                        this.chart.yAxis.forEach(yAxis => {
                            const isYAxisFromSelectedChartType = yAxis.series.every(
                                s => s.options.type === typeSelectedSerie
                            );

                            if (isYAxisFromSelectedChartType) {
                                yAxis.update(
                                    {
                                        max:
                                            typeSelectedSerie === "scatter" && isSelectedSerieHide
                                                ? undefined
                                                : adjustedMaxYAxis,
                                        tickInterval:
                                            typeSelectedSerie === "scatter" && isSelectedSerieHide ? 1 : yTickInterval,
                                    },
                                    true
                                );
                            }
                        });

                        return true;
                    },
                },
            },
        },
    } as Highcharts.Options;
};

function formatDxGroupsFromRows(rows: string[][] | undefined, years: string[]) {
    return _(rows)
        .orderBy(row => row[1])
        .groupBy(row => row[0])
        .mapValues(rows => {
            if (!rows || !rows[0]) {
                return [];
            }
            const dxId = rows[0][0];

            return years.map(year => _.find(rows, r => r.includes(year)) || [dxId, year, null]);
        })
        .value();
}
