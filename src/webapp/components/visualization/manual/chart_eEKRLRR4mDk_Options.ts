import _ from "lodash";
import { ChartSource } from "./chartOptions";
import { createScratterChart, SerieData } from "./generic/scratterChart";

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
            data: serieData,
        };
    });

    return createScratterChart(
        series,
        chartSource.visualization,
        currentCountryCode,
        "GDP per person in current purchasing power parities",
        "Public spending on health as a share of GDP (%)",
        "{point.country} <br/> GDP per person in current purchasing power parities: {point.x} <br/> Public spending on health as a share of GDP (%): {point.y}%"
    );
};
