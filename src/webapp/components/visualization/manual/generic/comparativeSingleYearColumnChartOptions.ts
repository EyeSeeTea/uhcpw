import _ from "lodash";
import { mapToWhoCountryCode } from "../../../../../data/repositories/countries/mapToWhoCountryData";
import { baseLegend } from "../../customization/legends/baseLegend";
import { ChartSource } from "../chartOptions";
import { baseChartOptions } from "./baseChartOptions";

export const comparativeSingleYearColumnChartOptions: (params: {
    chartSource: ChartSource;
    seriesNames: Record<string, string>;
    seriesColors: Record<string, string>;
    currentYear?: string;
    currentSerieColor?: string;
    orderByValueInSerie?: string;
    stackedValuesUpTo100?: boolean;
}) => Highcharts.Options = ({
    chartSource,
    seriesNames,
    seriesColors,
    currentYear,
    currentSerieColor,
    orderByValueInSerie,
    stackedValuesUpTo100,
}) => {
    const orderRows = _(chartSource.analyticsResponse.rows)
        .groupBy(row => {
            const orgUnitId = row[1]?.toString() || "";
            const orgUnit = chartSource.analyticsResponse.metaData.items[orgUnitId]?.code || "";
            return `${orgUnit} ${currentYear ?? ""}`;
        })
        .orderBy(items => {
            if (orderByValueInSerie) {
                const item = items.find(row => row[0] === orderByValueInSerie);

                return item ? (item[2] ? +item[2] : 0) : 0;
            } else {
                return _(items).sumBy(row => (row[2] ? +row[2] : 0));
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

        const serie = {
            id: dxId,
            type: "column",
            name: seriesNames[dxId],
            color: seriesColors[dxId],
            data: dataSource.map(row => {
                const orgUnitId = row[1]?.toString() || "";
                const orgUnit = mapToWhoCountryCode(
                    chartSource.analyticsResponse.metaData.items[orgUnitId]?.code || ""
                );
                const value = row[2] ? +row[2] : 0;

                const color =
                    currentCountryCode === orgUnit && currentSerieColor ? { color: currentSerieColor } : undefined;

                return {
                    name: `${orgUnit} ${currentYear ?? ""}`,
                    y: value,
                    ...color,
                };
            }),
        };

        return stackedValuesUpTo100 ? { ...serie, stacking: "percent" } : serie;
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
