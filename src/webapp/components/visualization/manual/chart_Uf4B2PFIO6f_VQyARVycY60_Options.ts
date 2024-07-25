import _ from "lodash";
import { baseLegend } from "../customization/legends/baseLegend";
import { ChartSourceMultiple } from "./chartOptions";
import { baseChartOptions } from "./generic/baseChartOptions";

const seriesNames: Record<string, string> = {
    Oseqbg7Odmn: "Average household capacity to pay",
    m6YZvOmzqhf: "Cost of meeting basic needs",
    OeK0H8uJwLU: "Share of households living below the basic needs line (%)",
};

const seriesColors: Record<string, string> = {
    Oseqbg7Odmn: "#8fa2d4",
    m6YZvOmzqhf: "#2f5597",
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

    return {
        ...baseChartOptions,
        xAxis: {
            categories: allYears,
        },
        yAxis: [
            {
                title: {
                    text: firstChartVisualization?.axes[0]?.title.text,
                    style: { fontSize: "13px" },
                },
            },
            {
                title: {
                    text: secondChartVisualization?.axes[0]?.title.text,
                    style: { fontSize: "13px" },
                    rotation: 270,
                    x: 5,
                },
                opposite: true,
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
