import _ from "lodash";

import { ChartSource } from "./chartOptions";

export const chart1Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    const rowsByCountry = _(chartSource.analyticsResponse.rows)
        .groupBy(row => row[1])
        .value();

    const seriesSource: SerieSource[] = [
        {
            name: "",
            id: "low",
            color: "#00b050",
        },
        {
            name: "",
            id: "medium",
            color: "#ffc001",
        },
        {
            name: "",
            id: "medium-hight",
            color: "#f6862a",
        },
        {
            name: "",
            id: "hight",
            color: "#c00302",
        },
        {
            name: "",
            id: "extra-hight",
            color: "#993300",
        },
    ];

    const countriesWithData: SerieData[] = _(rowsByCountry)
        .keys()
        .map(countryId => {
            const xSource = rowsByCountry[countryId]?.find(row => row[0] === "rX0nLoxvSAi") || [];
            const ySource = rowsByCountry[countryId]?.find(row => row[0] === "kBOh0hUi5bW") || [];
            const country = chartSource.countries.find(country => country.id === countryId);

            const x = xSource[2] ? +xSource[2] : 0;
            const y = ySource[2] ? +ySource[2] : 0;

            return {
                country: country?.name || "",
                x,
                y,
            };
        })
        .value();

    const series = seriesSource.map(serie => {
        const serieData = countriesWithData.filter(country => filterByValue(serie.id, country));

        return {
            ...serie,
            type: "scatter",
            data: serieData,
            marker: {
                symbol: "circle",
            },
        };
    });

    return {
        chart: {
            type: "scatter",
        },
        title: {
            text: "",
        },
        xAxis: {
            text: "Out-of-pocket payments as a share of current spending on health (%)",
        },
        yAxis: {
            title: {
                text: "Households with catastrophic health spending (%)",
            },
        },
        legend: { enabled: false },
        series,
        plotOptions: {
            column: {
                stacking: "normal",
            },
        },
        tooltip: {
            pointFormat:
                "{point.country} <br/> Out-of-pocket payments as a share of current spending on health: {point.x}% <br/> Households with catastrophic health spending (%): {point.y}%",
        },
        credits: { enabled: false },
        exporting: { enabled: false },
    } as Highcharts.Options;
};

interface SerieData {
    country: string;
    x: number;
    y: number;
}

type SerieSource = {
    id: SerieType;
    name: string;
    color: string;
};

type SerieType = "low" | "medium" | "medium-hight" | "hight" | "extra-hight";

function filterByValue(serieId: SerieType, data: SerieData) {
    switch (serieId) {
        case "low":
            return data.y > 0 && data.x > 0 && data.x < 2;
        case "medium":
            return data.y > 0 && data.x >= 2 && data.x < 5;
        case "medium-hight":
            return data.y > 0 && data.x >= 5 && data.x < 10;
        case "hight":
            return data.y > 0 && data.x >= 10 && data.x < 15;
        case "extra-hight":
            return data.y > 0 && data.x >= 15;
    }
}
