import _ from "lodash";
import { baseLegend } from "../customization/legends/baseLegend";
import { ChartSourceMultiple } from "./chartOptions";
import { baseChartOptions } from "./generic/baseChartOptions";
import { yAxisformatNumberLabel } from "../customization/yAxis/formatNumberLabel";
import { getMaxAxisAndTickInterval, sumSeriesData } from "../utils/getMaxAxisAndTickInterval";
import { getMaxYAxisAndYTickInterval, SeriesWithData } from "./utils/getMaxYAxisAndYTickInterval";

const SORTED_SERIES_IDS = ["SYkLkW1TFNu", "ZucMxrA6r2j", "y3QAiY2cQD1", "WmOGqGcov4f"];

const seriesNames: Record<string, string> = {
    WmOGqGcov4f: "Average",
    y3QAiY2cQD1: "65+",
    ZucMxrA6r2j: "65+",
    SYkLkW1TFNu: "<65",
};

const seriesColors: Record<string, string> = {
    WmOGqGcov4f: "#c00001",
    y3QAiY2cQD1: "#FF8739",
    ZucMxrA6r2j: "#2f5597",
    SYkLkW1TFNu: "#8fa2d4",
};

export const chart_AjY0AISVVs5_dVRGqsjce2n_Options: (
    chartSource: ChartSourceMultiple
) => Highcharts.Options = chartSource => {
    const [firstChartAnalyticsResponse, secondChartAnalyticsResponse] = chartSource.analyticsResponse;
    const [firstChartVisualization, secondChartVisualization] = chartSource.visualization;
    const columnDataRows = secondChartAnalyticsResponse?.rows || [];
    const yearsWithData: string[] = [
        ...new Set(columnDataRows.map(row => row[1]).filter((year): year is string => !!year)),
    ].sort();

    const allYears = _([
        ..._.map(firstChartAnalyticsResponse?.rows, row => row[1]),
        ..._.map(secondChartAnalyticsResponse?.rows, row => row[1]),
    ])
        .uniq()
        .filter(year => !!year && yearsWithData.includes(year))
        .compact()
        .orderBy()
        .value();

    const firstChartDataByDx = formatDxGroupsFromRows(firstChartAnalyticsResponse?.rows, allYears);
    const secondChartDataByDx = formatDxGroupsFromRows(secondChartAnalyticsResponse?.rows, allYears);
    const series = [
        ...(firstChartAnalyticsResponse?.metaData.dimensions.dx?.reverse().map(dxId => {
            return {
                id: dxId,
                type: "line",
                color: seriesColors[dxId],
                name: seriesNames[dxId],
                data: firstChartDataByDx[dxId]?.map(row => (row[2] ? +row[2] : null)),
                marker: {
                    enabled: true,
                    symbol: "circle",
                },
                yAxis: 1,
            };
        }) || []),
        ...(secondChartAnalyticsResponse?.metaData.dimensions.dx?.map(dxId => {
            return {
                id: dxId,
                type: "column",
                color: seriesColors[dxId],
                name: seriesNames[dxId],
                data: secondChartDataByDx[dxId]?.map(row => (row[2] ? +row[2] : null)),
                yAxis: 0,
            };
        }) || []),
    ];

    const sortedSeries = _.sortBy(series, s => SORTED_SERIES_IDS.indexOf(s.id));

    const columnSeriesData = sortedSeries.filter(s => s.type === "column").map(s => s.data || []);
    const sumOfColumnSeriesData = sumSeriesData(columnSeriesData);
    const { max: adjustedMaxColumnYAxis, tickInterval: yColumnTickInterval } = getMaxAxisAndTickInterval(
        sumOfColumnSeriesData,
        true
    );

    const lineData = _.compact(_.flatten(sortedSeries.filter(s => s.type === "line").map(s => s.data || [])));
    const { max: adjustedMaxLineYAxis, tickInterval: yLineTickInterval } = getMaxAxisAndTickInterval(lineData);

    return {
        ...baseChartOptions,
        xAxis: {
            categories: allYears,
        },
        yAxis: [
            {
                title: {
                    text: secondChartVisualization?.axes[0]?.title.text,
                    style: { fontSize: "13px" },
                },
                labels: yAxisformatNumberLabel.yAxis?.labels,
                max: adjustedMaxColumnYAxis,
                tickInterval: yColumnTickInterval,
                min: 0,
            },
            {
                title: {
                    text: firstChartVisualization?.axes[0]?.title.text,
                    style: { fontSize: "13px" },
                    rotation: 270,
                    x: 5,
                },
                labels: yAxisformatNumberLabel.yAxis?.labels,
                max: adjustedMaxLineYAxis,
                tickInterval: yLineTickInterval,
                min: 0,
                opposite: true,
            },
        ],
        legend: {
            ...baseLegend,
            width: 150,
            itemStyle: { ...baseLegend.itemStyle, whiteSpace: "normal", textOverflow: "none" },
        },
        series: sortedSeries,
        plotOptions: {
            column: {
                stacking: "normal",
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
                                maxValueUpTo100: typeSelectedSerie === "column",
                            }
                        );

                        this.chart.yAxis.forEach(yAxis => {
                            const isYAxisFromSelectedChartType = yAxis.series.every(
                                s => s.options.type === typeSelectedSerie
                            );

                            if (isYAxisFromSelectedChartType) {
                                yAxis.update(
                                    {
                                        max: adjustedMaxYAxis,
                                        tickInterval: yTickInterval,
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
