import _ from "lodash";
import { mapToWhoCountryCode } from "../../../../../data/repositories/countries/mapToWhoCountryData";
import { baseLegend } from "../../customization/legends/baseLegend";
import { ChartSource } from "../chartOptions";
import { baseChartOptions } from "./baseChartOptions";
import { getMaxAxisAndTickInterval } from "../../utils/getMaxAxisAndTickInterval";
import { getOrgUnitKey } from "../utils/getOrgUnitKey";

export const comparativeGroupedColumnChartOptions: (params: {
    chartSource: ChartSource;
    seriesNames: Record<string, string>;
    seriesColors: Record<string, string>;
    defaultColor?: string;
    isOnlyOneYearSelected?: boolean;
    orderByValueInSerie?: string;
    isDescOrder?: boolean;
}) => Highcharts.Options = params => {
    const {
        chartSource,
        seriesNames,
        seriesColors,
        defaultColor,
        isOnlyOneYearSelected,
        orderByValueInSerie,
        isDescOrder,
    } = params;
    const orderRows = _(chartSource.analyticsResponse.rows)
        .groupBy(row => {
            const orgUnitId = row[1]?.toString() || "";
            const orgUnit =
                chartSource.analyticsResponse.metaData.items[orgUnitId]?.[isOnlyOneYearSelected ? "name" : "code"] ||
                "";
            return orgUnit || getOrgUnitKey(chartSource, orgUnitId);
        })
        .orderBy(
            items => {
                if (orderByValueInSerie) {
                    const item = items.find(row => row[0] === orderByValueInSerie);
                    return item ? (item[2] ? +item[2] : 0) : 0;
                } else {
                    return _(items).sumBy(row => (row[2] ? +row[2] : 0));
                }
            },
            isDescOrder ? "desc" : "asc"
        )
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
            color: isOnlyOneYearSelected && defaultColor ? defaultColor : seriesColors[dxId],
            data: dataSource.map(row => {
                const orgUnitId = row[1]?.toString() || "";
                const region = chartSource.regions.find(
                    region => region.id === orgUnitId || region.linkedOrgUnitId === orgUnitId
                );
                const orgUnit = region
                    ? region.code
                    : mapToWhoCountryCode(chartSource.analyticsResponse.metaData.items[orgUnitId]?.code || "");

                const value = row[2] ? +row[2] : 0;

                return {
                    name: orgUnit,
                    y: value,
                    id: orgUnit,
                };
            }),
        };
    });

    const allYDataValues = series.flatMap(serie => serie.data.map(data => data?.y || 0));
    const { max: adjustedMaxYAxis, tickInterval: yTickInterval } = getMaxAxisAndTickInterval(allYDataValues);

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
                text: chartSource.visualization.axes[0]?.title.text,
                style: { fontSize: "13px" },
            },
            max: adjustedMaxYAxis,
            tickInterval: yTickInterval,
        },
        legend: isOnlyOneYearSelected ? { enabled: false } : baseLegend, // Hide legend if filtering on one year
        series,
        plotOptions: {
            series: {
                grouping: true,
            },
        },
    } as Highcharts.Options;
};
