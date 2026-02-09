import _ from "lodash";
import { Visualization } from "../../../../../domain/entities/indicator-explorer/Visualization";
import { baseChartOptions } from "./baseChartOptions";
import { getEU27Label } from "../../customization/charts/utils/getEU27Label";
import { NamedRef } from "../../../../../domain/entities/Ref";
import { getMaxAxisAndTickInterval, getMaxXAxisValue, getXTickInterval } from "../../utils/getMaxAxisAndTickInterval";
import { getRegionCodeByOrgUnitId } from "../../../../../domain/entities/region/Region";

export type ScatterSerie = {
    id: string;
    name: string;
    color: string;
    data: SerieData[];
};

type CreateScatterChartParams = {
    series: ScatterSerie[];
    visualization: Visualization;
    currentCountryCode: string;
    currentRegionCode?: string;
    xAxisTitle: string;
    yAxisTitle: string;
    pointFormat: string;
    seriesWithCountryAndRegionData: SerieData[];
    countryPositions: Record<string, { x: number; y: number }>;
    displayTendencyLine?: boolean;
    xTickInterval?: number;
    yTickInterval?: number;
};

export interface SerieSource extends NamedRef {
    color: string;
}
export interface SerieData {
    countryCode: string;
    regionCode: string;
    x: number;
    y: number;
}

interface CustomPointOptions extends Highcharts.PointOptionsObject {
    countryCode?: string; // Assuming country is optional
    regionCode?: string; // Assuming region is optional
}

export const createScatterChart: ({
    series,
    visualization,
    currentCountryCode,
    currentRegionCode,
    xAxisTitle,
    yAxisTitle,
    pointFormat,
    seriesWithCountryAndRegionData,
    countryPositions,
    displayTendencyLine,
    xTickInterval,
    yTickInterval,
}: CreateScatterChartParams) => Highcharts.Options = ({
    series,
    visualization: _visualization,
    currentCountryCode,
    currentRegionCode,
    xAxisTitle,
    yAxisTitle,
    pointFormat,
    seriesWithCountryAndRegionData,
    countryPositions,
    displayTendencyLine = true,
    xTickInterval,
    yTickInterval,
}) => {
    const finalSeries = series.map(serie => {
        return {
            ...serie,
            type: "scatter",
            marker: {
                symbol: "circle",
            },
        };
    });

    const allData = finalSeries.flatMap(serie => serie.data);

    const maxXAxis = getMaxXAxisValue(seriesWithCountryAndRegionData.map(data => data.x));
    const xTickIntervalDefault = xTickInterval ?? getXTickInterval(maxXAxis);
    const adjustedMaxXAxis = getMaxXAxisValue(
        seriesWithCountryAndRegionData.map(data => data.x),
        xTickIntervalDefault
    );

    const { max: adjustedMaxYAxis, tickInterval: yTickIntervalCalc } = getMaxAxisAndTickInterval(
        seriesWithCountryAndRegionData.map(data => data.y)
    );

    return {
        ...baseChartOptions,
        chart: {
            type: "scatter",
            events: {
                load: function (this: Highcharts.Chart) {
                    applyDataLabelsPositions(this.series, countryPositions);
                },
            },
        },
        xAxis: {
            title: { text: xAxisTitle, margin: 20, style: { fontSize: "13px" } },
            min: 0,
            max: adjustedMaxXAxis,
            tickInterval: xTickIntervalDefault,
        },
        yAxis: {
            title: {
                text: yAxisTitle,
                margin: 20,
                style: { fontSize: "13px" },
            },
            max: adjustedMaxYAxis,
            tickInterval: yTickInterval ?? yTickIntervalCalc,
        },
        legend: { enabled: false },
        series: [
            ...finalSeries,
            displayTendencyLine && {
                type: "line",
                name: "Trend Line",
                color: "lightgrey",
                data: getTrendLine(allData),
                marker: {
                    enabled: false,
                },
                states: {
                    hover: {
                        lineWidth: 0,
                    },
                },
                enableMouseTracking: false,
            },
        ],
        plotOptions: {
            series: {
                dataLabels: {
                    useHTML: true,
                    enabled: true,
                    align: "right",
                    verticalAlign: "middle",
                    allowOverlap: true,
                    overflow: "allow",
                    crop: false,
                    formatter: function () {
                        const countryCodePoint = (this.point as unknown as SerieData).countryCode;
                        const regionCodePoint = (this.point as unknown as SerieData).regionCode;

                        return (currentCountryCode && countryCodePoint === currentCountryCode) ||
                            (currentRegionCode && regionCodePoint === currentRegionCode)
                            ? `<strong style="color:black;">${countryCodePoint || regionCodePoint}</strong>`
                            : countryCodePoint || regionCodePoint;
                    },
                    x: -2,
                    color: "grey",
                    style: {
                        textOutline: "none",
                        fontSize: "13px",
                        fontWeight: "200",
                    },
                },
            },
        },
        tooltip: {
            pointFormat: pointFormat,
        },
    } as Highcharts.Options;
};

export const pos = {
    top: { x: 17, y: -10 },
    bottom: { x: 17, y: 10 },
    topRight: { x: 29, y: -9 },
    topLeft: { x: -1, y: -9 },
    bottomRight: { x: 29, y: 9 },
    bottomLeft: { x: -1, y: 9 },
    right: { x: 37, y: 0 },
    left: { x: -2, y: 0 },
};

export const getScatterSeries = (
    seriesSource: SerieSource[],
    seriesWithCountryAndRegionData: SerieData[],
    REST_ID: string
) => {
    return seriesSource.map(serie => {
        // Handle the region series separately
        const regionCode = getRegionCodeByOrgUnitId(serie.id);
        if (regionCode) {
            const targetRegionCode = getEU27Label(serie.id) || regionCode;

            return {
                ...serie,
                data: seriesWithCountryAndRegionData.filter(d => d.regionCode === targetRegionCode),
            };
        } else {
            return {
                ...serie,
                data: seriesWithCountryAndRegionData.filter(
                    serieWithCountryAndRegionData =>
                        !serieWithCountryAndRegionData.regionCode &&
                        (serie.id === REST_ID ||
                            (!!serieWithCountryAndRegionData.countryCode &&
                                serieWithCountryAndRegionData.countryCode === serie.id))
                ),
            };
        }
    });
};

function applyDataLabelsPositions(
    series: Highcharts.Series[],
    countryPositions: Record<string, { x: number; y: number }>
) {
    _.forEach(series, serie => {
        _.forEach(serie.points, point => {
            const countryCode = (point as CustomPointOptions).countryCode;
            const positions = countryPositions[countryCode as keyof typeof countryPositions] || pos.left;
            point.update(
                {
                    dataLabels: positions,
                },
                false
            ); // Set to 'false' to defer redraw
        });
        serie.chart.redraw();
    });
}

function getTrendLine(data: SerieData[]): number[][] {
    const fixedData = data.filter(item => item.y > 0 && item.x > 0);

    const minX = Math.min(...fixedData.map(({ x }) => x));
    const maxX = Math.max(...fixedData.map(({ x }) => x));
    const minY = Math.min(...fixedData.map(({ y }) => y));
    const maxY = Math.max(...fixedData.map(({ y }) => y));

    const trendline = [
        [minX, minY],
        [maxX, maxY],
    ];

    return trendline;
}
