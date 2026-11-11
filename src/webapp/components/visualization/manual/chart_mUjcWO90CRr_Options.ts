import _ from "lodash";
import { ChartSource } from "./chartOptions";
import { createScatterChart, getScatterSeries, pos, SerieData, SerieSource } from "./generic/createScatterChart";
import { getEU27Label } from "../customization/charts/utils/getEU27Label";
import { ORG_UNIT_IDS, REGION_CODES } from "../../../../domain/entities/region/Region";
import { getColorOfRegionByRegionCode } from "../../../pages/regional-page/getColorOfRegion";

const REST_ID = "REST_ID";

export const chart_mUjcWO90CRr_Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    const rowsByCountryAndRegion = _(chartSource.analyticsResponse.rows)
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
            id: ORG_UNIT_IDS.EU_CANDIDATE_COUNTRIES,
            color: getColorOfRegionByRegionCode(REGION_CODES.EU_CANDIDATE_COUNTRIES),
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

    const seriesWithCountryAndRegionData: SerieData[] = _(rowsByCountryAndRegion)
        .keys()
        .map(countryOrRegionId => {
            const xSource = rowsByCountryAndRegion[countryOrRegionId]?.find(row => row[0] === "qO6diSOTqhL") || [];
            const ySource = rowsByCountryAndRegion[countryOrRegionId]?.find(row => row[0] === "SKi7UzTsnJS") || [];
            const country = chartSource.countries.find(country => country.id === countryOrRegionId);
            const region = chartSource.regions.find(
                region => region.id === countryOrRegionId || region.linkedOrgUnitId === countryOrRegionId
            );
            const x = xSource[2] ? +xSource[2] : 0;
            const y = ySource[2] ? +ySource[2] : 0;

            const eur27Code = getEU27Label(countryOrRegionId);
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
    return createScatterChart({
        series,
        visualization: chartSource.visualization,
        currentCountryCode: currentCountryCode,
        currentRegionCode: currentRegionCode,
        xAxisTitle,
        yAxisTitle,
        pointFormat: `{point.country} {point.year} <br/> ${xAxisTitle}: {point.x} <br/> ${yAxisTitle}: {point.y}%`,
        seriesWithCountryAndRegionData: seriesWithCountryAndRegionData,
        countryPositions: countryPositionsAdjustment,
        displayTendencyLine: false,
    });
};
