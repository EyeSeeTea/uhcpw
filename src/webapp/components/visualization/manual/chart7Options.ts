import _ from "lodash";

import { baseLegend } from "../customization/legends/baseLegend";
import { rotateXAxis } from "../customization/xAxis/rotateXAxis";
import { ChartSource } from "./chartOptions";
import { baseChartOptions } from "./generic/baseChartOptions";

const seriesNames: Record<string, string> = {
    "SpTdfmqlzNj.xFBx8HXhRn6": "Outpatient care",
    "SpTdfmqlzNj.JGYECk6mKHE": "Diagnostic tests",
    "SpTdfmqlzNj.NYLedCi0SnS": "Inpatient care",
    "SpTdfmqlzNj.bHGxnqq0s6M": "Dental care",
    "SpTdfmqlzNj.WZQNt5d1TGm": "Medical products",
    "SpTdfmqlzNj.CgeNM5PZBLy": "Medicines",
};

const seriesColors: Record<string, string> = {
    "SpTdfmqlzNj.xFBx8HXhRn6": "#ffc001",
    "SpTdfmqlzNj.JGYECk6mKHE": "#702fa0",
    "SpTdfmqlzNj.NYLedCi0SnS": "#00b050",
    "SpTdfmqlzNj.bHGxnqq0s6M": "#0071c0",
    "SpTdfmqlzNj.WZQNt5d1TGm": "#ed7d31",
    "SpTdfmqlzNj.CgeNM5PZBLy": "#c00000",
};

export const chart7Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
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
        plotOptions: {
            column: {
                stacking: "normal",
            },
        },
    } as Highcharts.Options;
};
