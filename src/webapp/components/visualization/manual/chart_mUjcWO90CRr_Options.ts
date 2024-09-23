import _ from "lodash";
import { ChartSource } from "./chartOptions";
import { createScratterChart, getScatterSeries, pos, SerieData, SerieSource } from "./generic/scratterChart";
import { getEU27Label } from "../customization/charts/utils/getEU27Label";
import { EU27Color } from "../customization/palettes/countryPalette";
import { EU27 } from "../../../../domain/entities/Country";

const REST_ID = "REST_ID";

export const chart_mUjcWO90CRr_Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    const rowsByCountry = _(chartSource.analyticsResponse.rows)
        .groupBy(row => row[1])
        .value();

    const currentCountryCode =
        chartSource.countries.find(country => country.id === chartSource.currentCountry)?.code || "";

    const seriesSource: SerieSource[] = [
        {
            name: "",
            id: EU27,
            color: EU27Color,
        },
        {
            name: "",
            id: REST_ID,
            color: "#c00001",
        },
        {
            name: "",
            id: currentCountryCode,
            color: "#00af50",
        },
    ];

    const countriesWithData: SerieData[] = _(rowsByCountry)
        .keys()
        .map(countryId => {
            const xSource = rowsByCountry[countryId]?.find(row => row[0] === "qO6diSOTqhL") || [];
            const ySource = rowsByCountry[countryId]?.find(row => row[0] === "SKi7UzTsnJS") || [];
            const country = chartSource.countries.find(country => country.id === countryId);
            const eur27Code = getEU27Label(countryId);

            const x = xSource[2] ? +xSource[2] : 0;
            const y = ySource[2] ? +ySource[2] : 0;

            return {
                country: country?.code || eur27Code || "",
                x,
                y,
            };
        })
        .value();

    const series = getScatterSeries(seriesSource, countriesWithData, REST_ID);

    const [yAxisTitle = "", xAxisTitle = ""] = chartSource.visualization.axes
        .filter(axis => axis.type === "RANGE")
        .map(axis => axis.title.text);

    const countryPositionsAdjustment = {
        AUT: pos.top,
        ROM: pos.left,
        BEL: pos.topRight,
        MAT: pos.topLeft,
        SWI: pos.bottomLeft,
        CZH: pos.bottom,
        "BIH-R": pos.topLeft,
        CYP: pos.left,
        ICE: pos.topRight,
        MKD: pos.top,
        UZB: pos.bottomLeft,
        UNK: pos.left,
        FRA: pos.bottom,
        MDA: pos.left,
        DEN: pos.left,
        NOR: pos.right,
        ISR: pos.top,
        HUN: pos.bottomLeft,
        POL: pos.bottomRight,
        LTU: pos.topLeft,
        SWE: pos.top,
        SPA: pos.right,
        SRB: pos.bottomLeft,
        GEO: pos.topLeft,
        SMR: pos.topLeft,
        MNE: pos.topLeft,
        ITA: pos.topLeft,
        LVA: pos.topLeft,
        BIH: pos.topLeft,
        NET: pos.bottom,
        EU27: pos.left,
        UKR: pos.right,
        GRE: pos.bottomLeft,
        DEU: pos.bottomLeft,
    };
    return createScratterChart({
        series,
        visualization: chartSource.visualization,
        currentCountryCode,
        xAxisTitle,
        yAxisTitle,
        pointFormat: `{point.country} <br/> ${xAxisTitle}: {point.x} <br/> ${yAxisTitle}: {point.y}%`,
        countriesWithData,
        countryPositions: countryPositionsAdjustment,
        displayTendencyLine: false,
    });
};
