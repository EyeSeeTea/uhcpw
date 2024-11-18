import _ from "lodash";
import { mapToWhoCountryCode } from "../../../../../data/repositories/countries/mapToWhoCountryData";
import { baseLegend } from "../../customization/legends/baseLegend";
import { ChartSource } from "../chartOptions";
import { baseChartOptions } from "./baseChartOptions";
import { getMaxAxisAndTickInterval } from "../../utils/getMaxAxisAndTickInterval";
import { EU27 } from "../../../../../domain/entities/Country";
import { EU27Color } from "../../customization/palettes/countryPalette";

export const comparativeSingleYearColumnChartOptions: (params: {
    chartSource: ChartSource;
    seriesNames: Record<string, string>;
    seriesColors: Record<string, string>;
    currentYear?: string;
    currentSerieColor?: string;
    orderByValueInSerie?: string;
    stackedValuesUpTo100?: boolean;
    highlightEU27?: boolean;
}) => Highcharts.Options = ({
    chartSource,
    seriesNames,
    seriesColors,
    currentYear,
    currentSerieColor,
    orderByValueInSerie,
    stackedValuesUpTo100,
    highlightEU27,
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

                const colorUE27 = EU27 === orgUnitId && highlightEU27 ? { color: EU27Color } : undefined;

                const color =
                    currentCountryCode === orgUnit && currentSerieColor ? { color: currentSerieColor } : colorUE27;

                return {
                    name: `${orgUnit} ${currentYear ?? ""}`,
                    y: value,
                    ...color,
                };
            }),
        };

        return stackedValuesUpTo100 ? { ...serie, stacking: "percent" } : serie;
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
            max: adjustedMaxYAxis,
            tickInterval: yTickInterval,
        },
        legend: baseLegend,
        series,
    } as Highcharts.Options;
};

function getMaxYAxisAndYTickInterval(
    series: {
        data: {
            color?: string | undefined;
            name: string;
            y: number;
        }[];
    }[],
    stackedValuesUpTo100?: boolean
) {
    if (stackedValuesUpTo100) {
        return {
            max: 100,
            tickInterval: 20,
        };
    } else {
        const allYDataValues = series.flatMap(serie => serie.data.map(data => data?.y || 0));
        return getMaxAxisAndTickInterval(allYDataValues);
    }
}
