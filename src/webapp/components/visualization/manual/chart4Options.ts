import _ from "lodash";
import { Analytics } from "../../../../domain/entities/indicator-explorer/Analytics";
import { Visualization } from "../../../../domain/entities/indicator-explorer/Visualization";
import { rotateXAxis } from "../customization/xAxis/rotateXAxis";

const seriesNames: Record<string, string> = {
    Ce6oTgNCapd: "Public spending on health as a share of government spending",
};

const seriesColors: Record<string, string> = {
    Ce6oTgNCapd: "#00b050",
};

export const chart4Options: (analiticsResponse: Analytics, visualization: Visualization) => Highcharts.Options = (
    analiticsResponse,
    _visualization
) => {
    const orderRows = _(analiticsResponse.rows)
        .orderBy(item => (item[3] ? +item[3] : 0), "asc")
        .value();

    const groupByDx = _(orderRows)
        .groupBy(row => row[0])
        .value();

    const series = Object.keys(groupByDx).map(dxId => {
        const dataSource = groupByDx[dxId] || [];

        return {
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
                text: "Government spending (%)",
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
