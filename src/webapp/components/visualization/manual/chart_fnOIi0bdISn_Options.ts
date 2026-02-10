import _ from "lodash";
import { ChartSource } from "./chartOptions";
import { createScatterChart, getScatterSeries, pos, SerieData, SerieSource } from "./generic/createScatterChart";
import { ORG_UNIT_IDS, REGION_CODES } from "../../../../domain/entities/region/Region";
import { getColorOfRegionByRegionCode } from "../../../pages/regional-page/getColorOfRegion";
import { getChartSourceFilteredByLastAvailableYear } from "./utils/getChartSourceFilteredByLastAvailableYear";

const REST_ID = "REST_ID";

export const chart_fnOIi0bdISn_Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    const chartSourceWithFilteredRowsByLAY = getChartSourceFilteredByLastAvailableYear(chartSource, {
        isScatter: chartSource.visualization.isScatter || false,
        xAxis: chartSource.visualization.xAxis,
        yAxis: chartSource.visualization.yAxis,
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
            color: getColorOfRegionByRegionCode(REGION_CODES.EUROPEAN_REGION),
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

    const seriesWithCountryAndRegionData: SerieData[] = _(rowsByCountryOrRegion)
        .keys()
        .map(countryOrRegionId => {
            const xSource =
                rowsByCountryOrRegion[countryOrRegionId]?.find(row => row[0] === chartSource.visualization.xAxis) || [];
            const ySource =
                rowsByCountryOrRegion[countryOrRegionId]?.find(row => row[0] === chartSource.visualization.yAxis) || [];

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
        xAxisTitle: "Public spending on health as a share of GDP (%)",
        yAxisTitle,
        pointFormat: `{point.country} {point.commonYear} <br/> {point.yearX} ${xAxisTitle}: {point.x} <br/> {point.yearY} ${yAxisTitle}: {point.y}%`,
        seriesWithCountryAndRegionData: seriesWithCountryAndRegionData,
        countryPositions: countryPositionsAdjustment,
        displayTendencyLine: false,
    });
};
