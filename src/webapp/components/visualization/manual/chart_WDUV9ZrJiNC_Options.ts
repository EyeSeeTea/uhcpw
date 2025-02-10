import { ChartSource } from "./chartOptions";
import { getChartSourceFilteredByLastAvailableYear } from "./utils/getChartSourceFilteredByLastAvailableYear";
import _ from "lodash";
import { mapToWhoCountryCode } from "../../../../data/repositories/countries/mapToWhoCountryData";
import { getMaxYAxisAndYTickInterval } from "./utils/getMaxYAxisAndYTickInterval";
import { baseChartOptions } from "./generic/baseChartOptions";
import { baseLegend } from "../customization/legends/baseLegend";
import { setYAxisMaxAxisAndTickIntervalWhenLegendItemClick } from "../utils/getMaxAxisAndTickInterval";

const orderByValueInSerie = "WmOGqGcov4f";

const seriesNames: Record<string, string> = {
    WmOGqGcov4f: "All households",
    WRiCOxrLDOS: "Poorest consumption quintile",
};

const seriesColors: Record<string, string> = {
    WmOGqGcov4f: "#8fa2d4",
    WRiCOxrLDOS: "#2f5597",
};

export const chart_WDUV9ZrJiNC_Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    const chartSourceWithFilteredRowsByLAY = getChartSourceFilteredByLastAvailableYear(chartSource);

    const orderRows = _(chartSourceWithFilteredRowsByLAY.analyticsResponse.rows)
        .groupBy(row => {
            const orgUnitId = row[1]?.toString() || "";
            const orgUnit = chartSourceWithFilteredRowsByLAY.analyticsResponse.metaData.items[orgUnitId]?.code || "";
            const year = row[2] || "";

            return `${orgUnit} ${year} `;
        })
        .orderBy(items => {
            const item = items.find(row => row[0] === orderByValueInSerie);

            return item ? (item[3] ? +item[3] : 0) : 0;
        })
        .value()
        .flat();

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
                const orgUnitIdOrCategoryId = row[1]?.toString() || "";
                const orgUnitCodeOrCategory = mapToWhoCountryCode(
                    chartSourceWithFilteredRowsByLAY.analyticsResponse.metaData.items[orgUnitIdOrCategoryId]?.code || ""
                );
                const year = row[2] || "";
                const value = row[3] ? +row[3] : 0;

                return {
                    name: `${orgUnitCodeOrCategory} ${year} `,
                    y: value,
                };
            }),
        };
    });

    const { max: adjustedMaxYAxis, tickInterval: yTickInterval } = getMaxYAxisAndYTickInterval(series);

    return {
        ...baseChartOptions,
        chart: {
            type: "column",
        },
        xAxis: {
            title: "",
            type: "category",
            labels: {
                rotation: -90,
            },
        },
        yAxis: {
            title: {
                text: "Households (%)",
                style: { fontSize: "13px" },
            },
            max: adjustedMaxYAxis,
            tickInterval: yTickInterval,
        },
        legend: baseLegend,
        series,
        plotOptions: {
            column: {
                events: {
                    legendItemClick: function (this: Highcharts.Series) {
                        return setYAxisMaxAxisAndTickIntervalWhenLegendItemClick(this);
                    },
                },
            },
        },
    } as Highcharts.Options;
};
