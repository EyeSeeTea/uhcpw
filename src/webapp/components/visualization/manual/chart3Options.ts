import _ from "lodash";
import { Analytics } from "../../../../domain/entities/indicator-explorer/Analytics";
import { Visualization } from "../../../../domain/entities/indicator-explorer/Visualization";
import { rotateXAxis } from "../customization/xAxis/rotateXAxis";

export const chart3Options: (analiticsResponse: Analytics, visualization: Visualization) => Highcharts.Options = (
    analiticsResponse,
    _visualization
) => {
    const mappedRows = analiticsResponse.rows.map(row => {
        const dxId = row[0] || "";
        const orgUnitId = row[1] || "";
        const year = row[2] || "";
        const value = row[3] ? +row[3] : 0;

        const dx = analiticsResponse.metaData.items[dxId]?.name || "";
        const orgUnit = analiticsResponse.metaData.items[orgUnitId]?.code || "";

        return [dx, orgUnit, year, value];
    });
    const orderRows = _(mappedRows)
        .orderBy(item => item[3], "asc")
        .value();

    const series = [
        {
            type: "column",
            name: orderRows[0],
            data: orderRows.map(row => {
                return { name: `${row[1]} ${row[2]} `, y: row[3], color: "#5780c9" };
            }),
        },
    ];

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
        legend: {
            enabled: false,
        },
        series,
        credits: { enabled: false },
        exporting: { enabled: false },
    } as Highcharts.Options;
};
