import _ from "lodash";
import { Analytics } from "../../../../domain/entities/indicator-explorer/Analytics";
import { Visualization } from "../../../../domain/entities/indicator-explorer/Visualization";
import { baseLegend } from "../customization/legends/baseLegend";
import { rotateXAxis } from "../customization/xAxis/rotateXAxis";

const seriesNames: Record<string, string> = {
    "SpTdfmqlzNj.JGYECk6mKHE": "Diagnostic tests",
    "SpTdfmqlzNj.xFBx8HXhRn6": "Outpatient care",
    "SpTdfmqlzNj.NYLedCi0SnS": "Inpatient care",
    "SpTdfmqlzNj.WZQNt5d1TGm": "Medical products",
    "SpTdfmqlzNj.bHGxnqq0s6M": "Dental care",
    "SpTdfmqlzNj.CgeNM5PZBLy": "Medicines",
};

const seriesColors: Record<string, string> = {
    "SpTdfmqlzNj.JGYECk6mKHE": "#7030a0",
    "SpTdfmqlzNj.xFBx8HXhRn6": "#ffc000",
    "SpTdfmqlzNj.NYLedCi0SnS": "#00b050",
    "SpTdfmqlzNj.WZQNt5d1TGm": "#ed7d31",
    "SpTdfmqlzNj.bHGxnqq0s6M": "#0000c0",
    "SpTdfmqlzNj.CgeNM5PZBLy": "#c00000",
};

export const chart7Options: (analiticsResponse: Analytics, visualization: Visualization) => Highcharts.Options = (
    analiticsResponse,
    _visualization
) => {
    const orderRows = _(analiticsResponse.rows)
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
                const orgUnit = analiticsResponse.metaData.items[orgUnitId]?.code || "";
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
