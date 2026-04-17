import _ from "lodash";
import { mapToWhoCountryCode } from "../../../../../data/repositories/countries/mapToWhoCountryData";
import { baseLegend } from "../../customization/legends/baseLegend";
import { ChartSource } from "../chartOptions";
import { baseChartOptions } from "./baseChartOptions";
import { getMaxAxisAndTickInterval } from "../../utils/getMaxAxisAndTickInterval";
import { getColorOfRegionByRegionCode } from "../../../../pages/regional-page/getColorOfRegion";
import { getOrgUnitKey } from "../utils/getOrgUnitKey";

export const comparativeSingleYearColumnChartOptions: (params: {
    chartSource: ChartSource;
    seriesNames: Record<string, string>;
    seriesColors: Record<string, string>;
    currentYear?: string;
    currentSerieColor?: string;
    orderByValueInSerie?: string;
    stackedValuesUpTo100?: boolean;
    useRegionColors?: boolean;
    hideYear?: boolean;
}) => Highcharts.Options = ({
    chartSource,
    seriesNames,
    seriesColors,
    currentYear,
    currentSerieColor,
    orderByValueInSerie,
    stackedValuesUpTo100,
    useRegionColors = true,
    hideYear,
}) => {
    const orderRows = _(chartSource.analyticsResponse.rows)
        .groupBy(row => {
            const orgUnitId = row[1]?.toString() || "";
            const orgUnit = getOrgUnitKey(chartSource, orgUnitId);

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
        chartSource.countries.find(country => country.id === chartSource.currentCountryOrRegion)?.code || "";

    const currentRegion = chartSource.regions.find(
        region =>
            region.id === chartSource.currentCountryOrRegion ||
            region.linkedOrgUnitId === chartSource.currentCountryOrRegion
    );

    const series = keys.map(dxId => {
        const dataSource = groupByDx[dxId] || [];

        const serie = {
            id: dxId,
            type: "column",
            name: seriesNames[dxId],
            color: seriesColors[dxId],
            data: dataSource.map(row => {
                const orgUnitId = row[1]?.toString() || "";
                const region = chartSource.regions.find(
                    region => region.id === orgUnitId || region.linkedOrgUnitId === orgUnitId
                );
                const code = region
                    ? region.code
                    : mapToWhoCountryCode(chartSource.analyticsResponse.metaData.items[orgUnitId]?.code || "");

                const value = row[2] ? +row[2] : 0;

                const color =
                    (currentCountryCode === code || code === currentRegion?.code) && currentSerieColor
                        ? { color: currentSerieColor }
                        : useRegionColors && region?.code
                        ? { color: getColorOfRegionByRegionCode(region?.code) }
                        : undefined;

                return {
                    name: hideYear ? code : `${code} ${currentYear ?? ""}`,
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

                    return countryLabel === currentCountryCode || countryLabel === currentRegion?.code
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
