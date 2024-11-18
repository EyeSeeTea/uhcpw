import _ from "lodash";

import { ChartSource } from "./chartOptions";
import { createScratterChart, pos } from "./generic/scratterChart";
import { getChartSourceFilteredByLastAvailableYear } from "./utils/getChartSourceFilteredByLastAvailableYear";
import {
    kIpnMBaBvZ9_xAxisOutOfPocket,
    kIpnMBaBvZ9_yAxisHouseholds,
} from "../../../../data/repositories/indicator-explorer/seed/chart_kIpnMBaBvZ9_Seed";

export const chart_kIpnMBaBvZ9_Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    const chartSourceWithFilteredRowsByLAY = getChartSourceFilteredByLastAvailableYear(chartSource, {
        isScatter: true,
        xAxis: kIpnMBaBvZ9_xAxisOutOfPocket,
        yAxis: kIpnMBaBvZ9_yAxisHouseholds,
    });

    const rowsByCountry = _(chartSourceWithFilteredRowsByLAY.analyticsResponse.rows)
        .groupBy(row => row[1])
        .value();

    const currentCountryCode =
        chartSourceWithFilteredRowsByLAY.countries.find(
            country => country.id === chartSourceWithFilteredRowsByLAY.currentCountry
        )?.code || "";

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
            const xSource = rowsByCountry[countryId]?.find(row => row[0] === kIpnMBaBvZ9_xAxisOutOfPocket) || [];
            const ySource = rowsByCountry[countryId]?.find(row => row[0] === kIpnMBaBvZ9_yAxisHouseholds) || [];
            const country = chartSourceWithFilteredRowsByLAY.countries.find(country => country.id === countryId);

            const x = xSource[3] ? +xSource[3] : 0;
            const y = ySource[3] ? +ySource[3] : 0;

            return {
                country: country?.code || "",
                year: `${xSource[2]}`,
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

    const countryPositionsAdjustment = chartSource.isLatestCOVID19
        ? {
              NET: pos.bottomLeft,
              SVN: pos.bottomRight,
              IRE: pos.left,
              SWE: pos.top,
              UNK: pos.bottom,
              SPA: pos.left,
              "BIH-R": pos.top,
              "BIH-F": pos.left,
              FRA: pos.bottomLeft,
              LUX: pos.topLeft,
              CRO: pos.topLeft,
              DEU: pos.bottomLeft,
              DEN: pos.top,
              CZH: pos.topLeft,
              TUR: pos.topLeft,
              BEL: pos.left,
              AUT: pos.top,
              FIN: pos.right,
              SWI: pos.left,
              SVK: pos.topLeft,
              SRB: pos.topLeft,
              MDA: pos.left,
          }
        : {
              NET: pos.bottomLeft,
              SVN: pos.bottomRight,
              IRE: pos.left,
              SWE: pos.top,
              UNK: pos.bottom,
              SPA: pos.left,
              "BIH-R": pos.left,
              "BIH-F": pos.topRight,
              FRA: pos.bottomLeft,
              LUX: pos.topLeft,
              CRO: pos.topLeft,
              DEU: pos.bottomLeft,
              DEN: pos.top,
              CZH: pos.topLeft,
              TUR: pos.top,
              BEL: pos.bottomLeft,
              AUT: pos.bottom,
              FIN: pos.right,
              SWI: pos.left,
              SVK: pos.topLeft,
              SRB: pos.topLeft,
              MDA: pos.right,
          };

    const scatterChart = createScratterChart({
        series,
        visualization: chartSourceWithFilteredRowsByLAY.visualization,
        currentCountryCode,
        xAxisTitle: "Out-of-pocket payments as a share of current spending on health (%)",
        yAxisTitle: "Households with catastrophic health spending (%)",
        pointFormat:
            "{point.country} {point.year} <br/> Out-of-pocket payments as a share of current spending on health: {point.x}% <br/> Households with catastrophic health spending (%): {point.y}%",
        countriesWithData,
        countryPositions: countryPositionsAdjustment,
    });

    return {
        ...scatterChart,
        chart: {
            ...scatterChart.chart,
            height: "55%",
        },
    };
};

interface SerieData {
    country: string;
    year: string;
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
            return data.x > 0 && data.y >= 0 && data.y < 2;
        case "medium":
            return data.x > 0 && data.y >= 2 && data.y < 5;
        case "medium-hight":
            return data.x > 0 && data.y >= 5 && data.y < 10;
        case "hight":
            return data.x > 0 && data.y >= 10 && data.y < 15;
        case "extra-hight":
            return data.x > 0 && data.y >= 15;
    }
}
