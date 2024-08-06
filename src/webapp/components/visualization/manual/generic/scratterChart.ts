import _ from "lodash";
import { Visualization } from "../../../../../domain/entities/indicator-explorer/Visualization";
import { baseChartOptions } from "./baseChartOptions";

export type ScratterSerie = {
    id: string;
    name: string;
    color: string;
    data: SerieData[];
};

export interface SerieData {
    country: string;
    x: number;
    y: number;
}

interface CustomPointOptions extends Highcharts.PointOptionsObject {
    country?: string; // Assuming country is optional
}

export const createScratterChart: (
    series: ScratterSerie[],
    visualization: Visualization,
    currentCountryCode: string,
    xAxisTitle: string,
    yAxisTitle: string,
    pointFormat: string,
    countriesWithData: SerieData[],
    countryPositions: Record<string, { x: number; y: number }>
) => Highcharts.Options = (
    series,
    visualization,
    currentCountryCode,
    xAxisTitle,
    yAxisTitle,
    pointFormat,
    countriesWithData,
    countryPositions
) => {
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

    const axeItem = visualization.axes.find(({ type, title }) => type === "RANGE" && title.text === yAxisTitle);

    const maxYAxis = axeItem ? { max: axeItem.maxValue } : {};

    const maxXAxis = getMaxXAxis(countriesWithData);

    const tickInterval = getTickInterval(maxXAxis);

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
            max: maxXAxis,
            tickInterval: tickInterval,
        },
        yAxis: {
            title: {
                text: yAxisTitle,
                margin: 20,
                style: { fontSize: "13px" },
            },
            ...maxYAxis,
        },
        legend: { enabled: false },
        series: [
            ...finalSeries,
            {
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
    right: { x: 30, y: 0 },
    left: { x: -2, y: 0 },
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

const getMaxXAxis = (countriesWithData: SerieData[]) => {
    const maxXValue = Math.max(...countriesWithData.map(data => data.x));
    return Math.ceil(maxXValue / 5) * 5;
};

function getTickInterval(maxXAxis: number) {
    switch (true) {
        case maxXAxis <= 1:
            return 0.2;
        case maxXAxis <= 5:
            return 1;
        case maxXAxis <= 10:
            return 2;
        case maxXAxis <= 24:
            return 4;
        case maxXAxis <= 45:
            return 5;
        case maxXAxis <= 80:
            return 10;
        case maxXAxis <= 90:
            return 15;
        default:
            return 20;
    }
}
