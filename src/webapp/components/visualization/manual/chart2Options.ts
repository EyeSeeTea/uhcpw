import _ from "lodash";
import { baseLegend } from "../customization/legends/baseLegend";
import { rotateXAxis } from "../customization/xAxis/rotateXAxis";
import { ChartSource } from "./chartOptions";

const seriesNames: Record<string, string> = {
    yKxOTGWUr4D: "Impoverished",
    MDhStd9lvOc: "Further impoverished",
};

const seriesColors: Record<string, string> = {
    yKxOTGWUr4D: "#e46c09",
    MDhStd9lvOc: "#c00000",
};

export const chart2Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    const orderRows = _(chartSource.analyticsResponse.rows)
        .orderBy(item => item[3], "asc")
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
        chart: {
            type: "column",
        },
        title: {
            text: "",
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
        plotOptions: {
            column: {
                stacking: "normal",
            },
        },
        credits: { enabled: false },
        exporting: { enabled: false },
    } as Highcharts.Options;
};
