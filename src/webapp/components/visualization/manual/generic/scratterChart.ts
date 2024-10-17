import _ from "lodash";
import { Visualization } from "../../../../../domain/entities/indicator-explorer/Visualization";
import { baseChartOptions } from "./baseChartOptions";
import { EU27 } from "../../../../../domain/entities/Country";
import { getEU27Label, EU27_LABEL } from "../../customization/charts/utils/getEU27Label";
import { NamedRef } from "../../../../../domain/entities/Ref";
import { getMaxAxisAndTickInterval, getMaxAxisValue, getXTickInterval } from "../../utils/getMaxAxisAndTickInterval";

export type ScratterSerie = {
    id: string;
    name: string;
    color: string;
    data: SerieData[];
};

type CreateScratterChartParams = {
    series: ScratterSerie[];
    visualization: Visualization;
    currentCountryCode: string;
    xAxisTitle: string;
    yAxisTitle: string;
    pointFormat: string;
    countriesWithData: SerieData[];
    countryPositions: Record<string, { x: number; y: number }>;
    displayTendencyLine?: boolean;
    xTickInterval?: number;
};

export interface SerieSource extends NamedRef {
    color: string;
}
export interface SerieData {
    country: string;
    x: number;
    y: number;
}

interface CustomPointOptions extends Highcharts.PointOptionsObject {
    country?: string; // Assuming country is optional
}

export const createScratterChart: ({
    series,
    visualization,
    currentCountryCode,
    xAxisTitle,
    yAxisTitle,
    pointFormat,
    countriesWithData,
    countryPositions,
    displayTendencyLine,
    xTickInterval,
}: CreateScratterChartParams) => Highcharts.Options = ({
    series,
    visualization: _visualization,
    currentCountryCode,
    xAxisTitle,
    yAxisTitle,
    pointFormat,
    countriesWithData,
    countryPositions,
    displayTendencyLine = true,
    xTickInterval,
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

    const maxXAxis = getMaxAxisValue(countriesWithData.map(data => data.x));
    const xTickIntervalDefault = xTickInterval ?? getXTickInterval(maxXAxis);
    const adjustedMaxXAxis = getMaxAxisValue(
        countriesWithData.map(data => data.x),
        xTickIntervalDefault
    );

    const { max: adjustedMaxYAxis, tickInterval: yTickInterval } = getMaxAxisAndTickInterval(
        countriesWithData.map(data => data.y)
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
            title: { text: xAxisTitle, margin: 20 },
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
            tickInterval: yTickInterval,
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
                        const countryPoint = (this.point as unknown as SerieData).country;
                        return countryPoint === currentCountryCode
                            ? `<strong style="color:black;">${countryPoint}</strong>`
                            : countryPoint;
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

export const getScatterSeries = (seriesSource: SerieSource[], countriesWithData: SerieData[], REST_ID: string) => {
    return seriesSource.map(serie => {
        // Handle the EU27 series separately
        if (serie.id === EU27) {
            return {
                ...serie,
                data: countriesWithData.filter(country => country.country === getEU27Label(serie.id)),
            };
        }

        return {
            ...serie,
            data: countriesWithData.filter(
                country => (serie.id === REST_ID || country.country === serie.id) && country.country !== EU27_LABEL
            ),
        };
    });
};

function applyDataLabelsPositions(
    series: Highcharts.Series[],
    countryPositions: Record<string, { x: number; y: number }>
) {
    _.forEach(series, serie => {
        _.forEach(serie.points, point => {
            const country = (point as CustomPointOptions).country;
            const positions = countryPositions[country as keyof typeof countryPositions] || pos.left;
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
