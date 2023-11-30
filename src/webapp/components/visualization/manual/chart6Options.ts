import _ from "lodash";
import { Analytics } from "../../../../domain/entities/indicator-explorer/Analytics";
import { Visualization } from "../../../../domain/entities/indicator-explorer/Visualization";
import { baseLegend } from "../customization/legends/baseLegend";
import { rotateXAxis } from "../customization/xAxis/rotateXAxis";

const seriesNames: Record<string, string> = {
    ykAPKvVQusS: "Outpatient care",
    qy4W8ZY2g5M: "Diagnostic tests",
    OEK4dKvUsOe: "Inpatient care",
    a2u2ccahVJL: "Dental care",
    OuiKmOeXUWQ: "Medical products",
    qgE5NJ9Nyaq: "Medicines",
};

const seriesColors: Record<string, string> = {
    ykAPKvVQusS: "#ffc001",
    qy4W8ZY2g5M: "#702fa0",
    OEK4dKvUsOe: "#00b050",
    a2u2ccahVJL: "#0071c0",
    OuiKmOeXUWQ: "#ed7d31",
    qgE5NJ9Nyaq: "#c00000",
};

export const chart6Options: (analiticsResponse: Analytics, visualization: Visualization) => Highcharts.Options = (
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
