import _ from "lodash";
import { ChartSource } from "./chartOptions";
import { createScratterChart, getScatterSeries, pos, SerieData, SerieSource } from "./generic/scratterChart";
import { getEU27Label } from "../customization/charts/utils/getEU27Label";
import { EU27 } from "../../../../domain/entities/Country";
import { EU27Color } from "../customization/palettes/countryPalette";

const REST_ID = "REST_ID";

export const chart_eEKRLRR4mDk_Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    const rowsByCountry = _(chartSource.analyticsResponse.rows)
        .groupBy(row => row[1])
        .value();

    const currentCountryCode =
        chartSource.countries.find(country => country.id === chartSource.currentCountry)?.code || "";

    const currentYear = chartSource.currentYear;

    const seriesSource: SerieSource[] = [
        {
            name: "",
            id: EU27,
            color: EU27Color,
        },
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
            const eur27Code = getEU27Label(countryId);

            const x = xSource[2] ? +xSource[2] : 0;
            const y = ySource[2] ? +ySource[2] : 0;

            return {
                country: country?.code || eur27Code || "",
                year: currentYear || "",
                x,
                y,
            };
        })
        .value();

    const series = getScatterSeries(seriesSource, countriesWithData, REST_ID);

    const countryPositionsAdjustment = {
        EST: pos.right,
        "KOS*": pos.right,
        BUL: pos.topLeft,
        AUT: pos.topLeft,
        ROM: pos.right,
        BEL: pos.right,
        CZH: pos.bottomRight,
        ARM: pos.bottomLeft,
        MKD: pos.topLeft,
        UNK: pos.topLeft,
        GRE: pos.bottomLeft,
        ISR: pos.topLeft,
        HUN: pos.bottomLeft,
        POL: pos.topRight,
        SWE: pos.top,
        SPA: pos.topLeft,
        GEO: pos.right,
        TKM: pos.right,
        DEU: pos.right,
        ITA: pos.top,
        LVA: pos.right,
        SVN: pos.bottomLeft,
        EU27: pos.top,
    };

    const scratterChart = createScratterChart({
        series,
        visualization: chartSource.visualization,
        currentCountryCode,
        xAxisTitle: "GDP per person in current purchasing power parities",
        yAxisTitle: "Public spending on health as a share of GDP (%)",
        pointFormat:
            "{point.country} {point.year} <br/> GDP per person in current purchasing power parities: {point.x} <br/> Public spending on health as a share of GDP (%): {point.y}%",
        countriesWithData,
        countryPositions: countryPositionsAdjustment,
        displayTendencyLine: false,
        xTickInterval: 10000,
    });

    return {
        ...scratterChart,
        yAxis: {
            ...scratterChart.yAxis,
            min: 0,
        },
        xAxis: {
            ...scratterChart.xAxis,
            labels: {
                formatter: function () {
                    return `${this.value}`;
                },
            },
        },
    };
};
