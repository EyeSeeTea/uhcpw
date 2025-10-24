import _ from "lodash";
import { ChartSource } from "./chartOptions";
import { createScratterChart, getScatterSeries, pos, SerieData, SerieSource } from "./generic/scratterChart";
import { getEU27Label } from "../customization/charts/utils/getEU27Label";
import { ORG_UNIT_IDS, REGION_CODES } from "../../../../domain/entities/region/Region";
import { getColorOfRegionByRegionCode } from "../../../pages/regional-page/getColorOfRegion";

const REST_ID = "REST_ID";

export const chart_eEKRLRR4mDk_Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    const rowsByCountry = _(chartSource.analyticsResponse.rows)
        .groupBy(row => row[1])
        .value();

    const currentCountryCode =
        chartSource.countries.find(country => country.id === chartSource.currentCountryOrRegion)?.code || "";

    const currentRegionCode =
        chartSource.regions.find(
            region =>
                region.id === chartSource.currentCountryOrRegion ||
                region.linkedOrgUnitId === chartSource.currentCountryOrRegion
        )?.code || "";

    const currentYear = chartSource.currentYear;

    const seriesSource: SerieSource[] = [
        {
            name: "",
            id: ORG_UNIT_IDS.EUROPEAN_UNION,
            color: getColorOfRegionByRegionCode(REGION_CODES.EUROPEAN_UNION),
        },
        {
            name: "",
            id: ORG_UNIT_IDS.WESTERN_BALKANS,
            color: getColorOfRegionByRegionCode(REGION_CODES.WESTERN_BALKANS),
        },
        {
            name: "",
            id: ORG_UNIT_IDS.EASTERN_EUROPE_AND_CENTRAL_ASIA,
            color: getColorOfRegionByRegionCode(REGION_CODES.EASTERN_EUROPE_AND_CENTRAL_ASIA),
        },
        {
            name: "",
            id: ORG_UNIT_IDS.EUROPEAN_REGION,
            color: getColorOfRegionByRegionCode(REGION_CODES.EUROPEAN_REGION),
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

    const seriesWithCountryAndRegionData: SerieData[] = _(rowsByCountry)
        .keys()
        .map(countryOrRegionId => {
            const xSource = rowsByCountry[countryOrRegionId]?.find(row => row[0] === "Gquev7KGHWq") || [];
            const ySource = rowsByCountry[countryOrRegionId]?.find(row => row[0] === "qO6diSOTqhL") || [];
            const country = chartSource.countries.find(country => country.id === countryOrRegionId);
            const region = chartSource.regions.find(
                region => region.id === countryOrRegionId || region.linkedOrgUnitId === countryOrRegionId
            );

            const eur27Code = getEU27Label(countryOrRegionId);

            const x = xSource[2] ? +xSource[2] : 0;
            const y = ySource[2] ? +ySource[2] : 0;

            return {
                countryCode: country?.code || "",
                regionCode: eur27Code ? eur27Code : region?.code || "",
                year: currentYear || "",
                x,
                y,
            };
        })
        .value();

    const series = getScatterSeries(seriesSource, seriesWithCountryAndRegionData, REST_ID);

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
        currentCountryCode: currentCountryCode,
        currentRegionCode: currentRegionCode,
        xAxisTitle: "GDP per person in current purchasing power parities",
        yAxisTitle: "Public spending on health as a share of GDP (%)",
        pointFormat:
            "{point.country} {point.year} <br/> GDP per person in current purchasing power parities: {point.x} <br/> Public spending on health as a share of GDP (%): {point.y}%",
        seriesWithCountryAndRegionData: seriesWithCountryAndRegionData,
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
