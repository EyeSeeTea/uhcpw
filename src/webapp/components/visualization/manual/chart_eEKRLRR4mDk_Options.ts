import _ from "lodash";
import { ChartSource } from "./chartOptions";
import { baseChartOptions } from "./generic/baseChartOptions";

const REST_ID = "REST_ID";

export const chart_eEKRLRR4mDk_Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    const rowsByCountry = _(chartSource.analyticsResponse.rows)
        .groupBy(row => row[1])
        .value();

    const currentCountryCode =
        chartSource.countries.find(country => country.id === chartSource.currentCountry)?.code || "";

    const seriesSource: SerieSource[] = [
        {
            name: "",
            id: REST_ID,
            color: "#00af50",
        },
        {
            name: "",
            id: currentCountryCode,
            color: "#c00001",
        },
    ];

    const countriesWithData: SerieData[] = _(rowsByCountry)
        .keys()
        .map(countryId => {
            const xSource = rowsByCountry[countryId]?.find(row => row[0] === "Gquev7KGHWq") || [];
            const ySource = rowsByCountry[countryId]?.find(row => row[0] === "qO6diSOTqhL") || [];
            const country = chartSource.countries.find(country => country.id === countryId);

            const x = xSource[2] ? +xSource[2] : 0;
            const y = ySource[2] ? +ySource[2] : 0;

            return {
                country: country?.code || "",
                x,
                y,
            };
        })
        .value();

    const series = seriesSource.map(serie => {
        const serieData = countriesWithData.filter(country => serie.id === REST_ID || country.country === serie.id);

        return {
            ...serie,
            type: "scatter",
            data: serieData,
            marker: {
                symbol: "circle",
            },
        };
    });

    const axeItem = chartSource.visualization.axes.find(
        ({ type, title }) => type === "RANGE" && title.text === "Households with catastrophic health spending (%)"
    );

    const maxYAxis = axeItem ? { max: axeItem.maxValue } : {};

    return {
        ...baseChartOptions,
        chart: {
            type: "scatter",
        },
        xAxis: {
            title: { text: "GDP per person in current purchasing power parities", margin: 20 },
            min: 0,
        },
        yAxis: {
            title: {
                text: "Public spending on health as a share of GDP (%)",
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
                data: getTrendLine(countriesWithData),
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
                    //format: "{point.country}",
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
            pointFormat:
                "{point.country} <br/> GDP per person in current purchasing power parities: {point.x} <br/> Public spending on health as a share of GDP (%): {point.y}%",
        },
    } as Highcharts.Options;
};

interface SerieData {
    country: string;
    x: number;
    y: number;
}

type SerieSource = {
    id: string;
    name: string;
    color: string;
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
