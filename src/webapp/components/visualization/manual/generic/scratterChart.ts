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
    pointFormat: string,
    countriesWithData: SerieData[]
) => Highcharts.Options = (
    series,
    visualization,
    currentCountryCode,
    xAxisTitle,
    yAxisTitle,
    pointFormat,
    countriesWithData
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

    const adjustedMaxXAxis = getMaxXAxis(countriesWithData, tickInterval);

    return {
        ...baseChartOptions,
        chart: {
            type: "scatter",
        },
        xAxis: {
            title: { text: xAxisTitle, margin: 20 },
            min: 0,
            max: adjustedMaxXAxis,
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

const getMaxXAxis = (countriesWithData: SerieData[], tickInterval = 5) => {
    const maxXValue = Math.max(...countriesWithData.map(data => data.x));
    return Math.ceil(maxXValue / tickInterval) * tickInterval;
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
