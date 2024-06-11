import _ from "lodash";
import { mapToWhoCountryCode } from "../../../../../data/repositories/countries/mapToWhoCountryData";
import { baseLegend } from "../../customization/legends/baseLegend";
import { ChartSource } from "../chartOptions";
import { baseChartOptions } from "./baseChartOptions";

export const comparativeColumnChartOptions: (
    chartSource: ChartSource,
    seriesNames: Record<string, string>,
    seriesColors: Record<string, string>,
    currentSerieColor?: string,
    orderByValueInSerie?: string
) => Highcharts.Options = (chartSource, seriesNames, seriesColors, currentSerieColor, orderByValueInSerie) => {
    const orderRows = _(chartSource.analyticsResponse.rows)
        .groupBy(row => {
            const orgUnitId = row[1]?.toString() || "";
            const orgUnit = chartSource.analyticsResponse.metaData.items[orgUnitId]?.code || "";
            const year = row[2] || "";

            return `${orgUnit} ${year} `;
        })
        .orderBy(items => {
            if (orderByValueInSerie) {
                const item = items.find(row => row[0] === orderByValueInSerie);

                return item ? (item[3] ? +item[3] : 0) : 0;
            } else {
                return _(items).sumBy(row => (row[3] ? +row[3] : 0));
            }
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

    const currentCountryCode =
        chartSource.countries.find(country => country.id === chartSource.currentCountry)?.code || "";

    const series = keys.map(dxId => {
        const dataSource = groupByDx[dxId] || [];

        return {
            id: dxId,
            type: "column",
            name: seriesNames[dxId],
            color: seriesColors[dxId],
            data: dataSource.map(row => {
                const orgUnitId = row[1]?.toString() || "";
                const orgUnit = mapToWhoCountryCode(
                    chartSource.analyticsResponse.metaData.items[orgUnitId]?.code || ""
                );
                const year = row[2] || "";
                const value = row[3] ? +row[3] : 0;

                const color =
                    currentCountryCode === orgUnit && currentSerieColor ? { color: currentSerieColor } : undefined;

                return {
                    name: `${orgUnit} ${year} `,
                    y: value,
                    ...color,
                };
            }),
        };
    });

    const maxYAxis = chartSource.visualization.axes.find(({ type }) => type === "RANGE")?.maxValue
        ? { max: chartSource.visualization.axes.find(({ type }) => type === "RANGE")?.maxValue }
        : {};

    return {
        ...baseChartOptions,
        chart: {
            type: "column",
        },
        xAxis: {
            title: "",
            type: "category",

            //format: "{point.country}",
            labels: {
                rotation: -90,
                formatter: function () {
                    const countryLabel = (this.value as string).split(" ")[0];

                    return countryLabel === currentCountryCode
                        ? `<strong style="color:#49abe2;">${this.value}</strong>`
                        : this.value;
                },
            },
        },
        yAxis: {
            title: {
                text: "Households (%)",
                style: { fontSize: "13px" },
            },
            ...maxYAxis,
        },
        legend: baseLegend,
        series,
    } as Highcharts.Options;
};
