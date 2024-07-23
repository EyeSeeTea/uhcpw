import _ from "lodash";
import { baseLegend } from "../customization/legends/baseLegend";
import { ChartSourceMultiple } from "./chartOptions";
import { baseChartOptions } from "./generic/baseChartOptions";

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

    const firstChartDataByDx = formatDxGroupsFromRows(firstChartAnalyticsResponse?.rows, filteredYears);
    const secondChartDataByDx = formatDxGroupsFromRows(secondChartAnalyticsResponse?.rows, filteredYears);
    const series = [
        ...(firstChartAnalyticsResponse?.metaData.dimensions.dx?.reverse().map(dxId => {
            return {
                id: dxId,
                type: "column",
                color: seriesColors[dxId],
                name: firstChartAnalyticsResponse.metaData.items[dxId]?.name.replace("UHCW_", "") || "",
                data: firstChartDataByDx[dxId]?.map(row => (row[2] ? +row[2] : null)),
            };
        }) || []),
        ...(secondChartAnalyticsResponse?.metaData.dimensions.dx?.map(dxId => {
            return {
                id: dxId,
                type: "scatter",
                color: seriesColors[dxId],
                name: secondChartAnalyticsResponse.metaData.items[dxId]?.name.replace("UHCW_", "") || "",
                data: secondChartDataByDx[dxId]?.map(row => (row[2] ? +row[2] : null)),
                yAxis: 1,
            };
        }) || []),
    ];

    return {
        ...baseChartOptions,
        xAxis: {
            categories: filteredYears,
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
        legend: { ...baseLegend, symbolHeight: 10, symbolWidth: 10, symbolRadius: 0 },
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

function formatDxGroupsFromRows(rows: string[][] | undefined, filteredYears: string[]) {
    return _(rows)
        .orderBy(row => row[1])
        .groupBy(row => row[0])
        .mapValues(rows => {
            if (!rows || !rows[0]) {
                return [];
            }
            const dxId = rows[0][0];

            return filteredYears.map(year => _.find(rows, r => r.includes(year)) || [dxId, year, null]);
        })
        .value();
}
