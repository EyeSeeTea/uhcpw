import _ from "lodash";
import { ChartSource } from "./chartOptions";
import { createScratterChart, pos, SerieData } from "./generic/scratterChart";
import { getEU27Label } from "../customization/charts/utils/getEU27Label";

const REST_ID = "REST_ID";

type SerieSource = {
    id: string;
    name: string;
    color: string;
};

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

    const series = seriesSource.map(serie => {
        const serieData = countriesWithData.filter(country => serie.id === REST_ID || country.country === serie.id);

        return {
            ...serie,
            data: serieData,
        };
    });
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
    };

    return createScratterChart(
        series,
        chartSource.visualization,
        currentCountryCode,
        "GDP per person in current purchasing power parities",
        "Public spending on health as a share of GDP (%)",
        "{point.country} <br/> GDP per person in current purchasing power parities: {point.x} <br/> Public spending on health as a share of GDP (%): {point.y}%",
        countriesWithData,
        countryPositionsAdjustment
    );
};
