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

export const createScratterChart: (
    series: ScratterSerie[],
    visualization: Visualization,
    currentCountryCode: string,
    xAxisTitle: string,
    yAxisTitle: string,
    pointFormat: string
) => Highcharts.Options = (series, visualization, currentCountryCode, xAxisTitle, yAxisTitle, pointFormat) => {
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

    return {
        ...baseChartOptions,
        chart: {
            type: "scatter",
        },
        xAxis: {
            title: { text: xAxisTitle, margin: 20 },
            min: 0,
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
            ...series,
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
