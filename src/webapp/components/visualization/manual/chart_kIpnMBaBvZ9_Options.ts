import _ from "lodash";

import { ChartSource } from "./chartOptions";
import { createScatterChart, pos } from "./generic/createScatterChart";
import { getChartSourceFilteredByLastAvailableYear } from "./utils/getChartSourceFilteredByLastAvailableYear";
import {
    kIpnMBaBvZ9_xAxisOutOfPocket,
    kIpnMBaBvZ9_yAxisHouseholds,
} from "../../../../data/repositories/indicator-explorer/seed/chart_kIpnMBaBvZ9_Seed";
import {
    filterRowsByYearIndicatorAndCountry,
    getGroupedYearsByCountryInTwoDataIds,
} from "../../../../data/repositories/indicator-explorer/utils/lastAvailableYearHelpers";

export const chart_kIpnMBaBvZ9_Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    const { hasCustomFilterXAxisAndYAxisByLastAvailableYear } = chartSource.visualization;
    const chartSourceWithFilteredRowsByLAY = getChartSourceFilteredByLastAvailableYear(chartSource, {
        isScatter: true,
        xAxis: kIpnMBaBvZ9_xAxisOutOfPocket,
        yAxis: kIpnMBaBvZ9_yAxisHouseholds,
        customFilterXAxisAndYAxisByLastAvailableYear: hasCustomFilterXAxisAndYAxisByLastAvailableYear
            ? customFilterXAxisAndYAxisByLastAvailableYear
            : undefined,
    });

    const rowsByCountryOrRegion = _(chartSourceWithFilteredRowsByLAY.analyticsResponse.rows)
        .groupBy(row => row[1])
        .value();

    const currentCountryCode =
        chartSourceWithFilteredRowsByLAY.countries.find(
            country => country.id === chartSourceWithFilteredRowsByLAY.currentCountryOrRegion
        )?.code || "";

    const currentRegionCode =
        chartSourceWithFilteredRowsByLAY.regions.find(
            region =>
                region.id === chartSourceWithFilteredRowsByLAY.currentCountryOrRegion ||
                region.linkedOrgUnitId === chartSourceWithFilteredRowsByLAY.currentCountryOrRegion
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

    const seriesWithCountryAndRegionData: SerieData[] = _(rowsByCountryOrRegion)
        .keys()
        .map(countryOrRegionId => {
            const xSource =
                rowsByCountryOrRegion[countryOrRegionId]?.find(row => row[0] === kIpnMBaBvZ9_xAxisOutOfPocket) || [];
            const ySource =
                rowsByCountryOrRegion[countryOrRegionId]?.find(row => row[0] === kIpnMBaBvZ9_yAxisHouseholds) || [];

            const country = chartSourceWithFilteredRowsByLAY.countries.find(
                country => country.id === countryOrRegionId
            );
            const region = chartSourceWithFilteredRowsByLAY.regions.find(
                region => region.id === countryOrRegionId || region.linkedOrgUnitId === countryOrRegionId
            );

            const x = xSource[3] ? +xSource[3] : 0;
            const y = ySource[3] ? +ySource[3] : 0;
            const isCommonYear = xSource[2] === ySource[2];
            return {
                countryCode: country?.code || "",
                regionCode: region?.code || "",
                yearX: isCommonYear ? "" : `${xSource[2]}`,
                yearY: isCommonYear ? "" : `${ySource[2]}`,
                commonYear: isCommonYear ? xSource[2] || "" : "",
                x,
                y,
            };
        })
        .value();

    const series = seriesSource.map(serie => {
        const serieData = seriesWithCountryAndRegionData.filter(serieWithCountryAndRegionData =>
            filterByValue(serie.id, serieWithCountryAndRegionData)
        );

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

    const scatterChart = createScatterChart({
        series,
        visualization: chartSourceWithFilteredRowsByLAY.visualization,
        currentCountryCode,
        currentRegionCode: currentRegionCode,
        xAxisTitle: "Out-of-pocket payments as a share of current spending on health (%)",
        yAxisTitle: "Households with catastrophic health spending (%)",
        pointFormat:
            "{point.country} {point.commonYear} <br/> {point.yearX} Out-of-pocket payments as a share of current spending on health: {point.x}% <br/> {point.yearY} Households with catastrophic health spending (%): {point.y}%",
        seriesWithCountryAndRegionData: seriesWithCountryAndRegionData,
        countryPositions: countryPositionsAdjustment,
        xTickInterval: 15,
        yTickInterval: 5,
    });

    return {
        ...scatterChart,
        chart: {
            ...scatterChart.chart,
            height: "55%",
        },
        xAxis: {
            ...scatterChart.xAxis,
            min: 0,
            tickInterval: 15,
        },
    };
};

type SerieData = {
    countryCode: string;
    regionCode: string;
    yearX: string;
    yearY: string;
    commonYear: string;
    x: number;
    y: number;
};

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

function customFilterXAxisAndYAxisByLastAvailableYear(
    rows: Array<string[]>,
    xAxis: string,
    yAxis: string,
    isUpTo2019?: boolean
): Array<string[]> {
    const yearByIndicatorAndCountry = getYearByIndicatorAndCountry(rows, xAxis, yAxis, isUpTo2019);

    return filterRowsByYearIndicatorAndCountry(rows, xAxis, yAxis, yearByIndicatorAndCountry);
}

// Custom: Get Year By Indicator And Country
export function getYearByIndicatorAndCountry(
    rows: Array<string[]>,
    xAxis: string,
    yAxis: string,
    isUpTo2019?: boolean
): Record<
    string,
    {
        xYears: string;
        yYears: string;
    }
> {
    const groupedYearsByCountry = getGroupedYearsByCountryInTwoDataIds({ rows, dataId1: xAxis, dataId2: yAxis });

    return Object.keys(groupedYearsByCountry).reduce(
        (acc, countryId): Record<string, { xYears: string; yYears: string }> => {
            const filteredXYears = [...(groupedYearsByCountry[countryId]?.dataId1Years || [])].filter(year => {
                return isUpTo2019 ? Number(year) <= 2019 : true;
            });
            const filteredYYears = [...(groupedYearsByCountry[countryId]?.dataId2Years || [])].filter(year => {
                return isUpTo2019 ? Number(year) <= 2019 : true;
            });

            // If kIpnMBaBvZ9_yAxisHouseholds has 2023 or 2024, we take this year from yAxis and the latest year from xAxis
            const sortedYYears = [...filteredYYears].sort((a, b) => parseInt(b) - parseInt(a));
            const hasY2023Or2024AsLAY = sortedYYears[0] === "2023" || sortedYYears[0] === "2024";

            if (hasY2023Or2024AsLAY) {
                const sortedXYears = [...filteredXYears].sort((a, b) => parseInt(b) - parseInt(a));
                return {
                    ...acc,
                    [countryId]: {
                        xYears: sortedXYears[0] || "",
                        yYears: sortedYYears[0] || "",
                    },
                };
            } else {
                const commonYears = filteredXYears
                    .filter(year => filteredYYears.includes(year))
                    .sort((a, b) => parseInt(b) - parseInt(a));

                const commonYear = commonYears.length > 0 ? commonYears[0] || "" : "";
                return {
                    ...acc,
                    [countryId]: {
                        xYears: commonYear,
                        yYears: commonYear,
                    },
                };
            }
        },
        {}
    );
}
