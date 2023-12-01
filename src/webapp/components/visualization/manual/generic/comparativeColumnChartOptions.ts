import _ from "lodash";
import { baseLegend } from "../../customization/legends/baseLegend";
import { rotateXAxis } from "../../customization/xAxis/rotateXAxis";
import { ChartSource } from "../chartOptions";
import { baseChartOptions } from "./baseChartOptions";

export const comparativeColumnChartOptions: (
    chartSource: ChartSource,
    seriesNames: Record<string, string>,
    seriesColors: Record<string, string>
) => Highcharts.Options = (chartSource, seriesNames, seriesColors) => {
    const orderRows = _(chartSource.analyticsResponse.rows)
        .orderBy(item => (item[3] ? +item[3] : 0), "asc")
        .value();

    const groupByDx = _(orderRows)
        .groupBy(row => row[0])
        .value();

    const keys = _(groupByDx)
        .keys()
        .sortBy(key => _(seriesNames).keys().indexOf(key))
        .value();

    const series = keys.map(dxId => {
        const dataSource = groupByDx[dxId] || [];

        return {
            id: dxId,
            type: "column",
            name: seriesNames[dxId],
            color: seriesColors[dxId],
            data: dataSource.map(row => {
                const orgUnitId = row[1]?.toString() || "";
                const orgUnit = chartSource.analyticsResponse.metaData.items[orgUnitId]?.code || "";
                const year = row[2] || "";
                const value = row[3] ? +row[3] : 0;

                return { name: `${orgUnit} ${year} `, y: value };
            }),
        };
    });

    return {
        ...baseChartOptions,
        chart: {
            type: "column",
        },
        xAxis: {
            ...rotateXAxis,
            type: "category",
        },
        yAxis: {
            title: {
                text: "Households (%)",
            },
        },
        legend: { ...baseLegend, itemMarginTop: 20 },
        series,
    } as Highcharts.Options;
};
