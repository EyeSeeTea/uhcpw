import { REGION_CODES } from "../../../../domain/entities/region/Region";
import { regionColors } from "../customization/palettes/countryPalette";
import { ChartSource } from "./chartOptions";
import { comparativeSingleYearColumnChartOptions } from "./generic/comparativeSingleYearColumnChartOptions";

const seriesNames: Record<string, string> = {
    XvkqQfvXFGB: "Other public spending on health",
    Y0Qv2Xawfy4: "Government budget transfers to SHI schemes",
    dwxX1gLVrcF: "SHI contributions",
};

const seriesColors: Record<string, string> = {
    XvkqQfvXFGB: "#D5E2A6",
    Y0Qv2Xawfy4: "#75D68C",
    dwxX1gLVrcF: "#00b050",
};

export const regionColorsBySeries: Record<string, Record<string, string>> = {
    [REGION_CODES.WESTERN_BALKANS]: {
        XvkqQfvXFGB: regionColors.WESTERN_BALKANS.light,
        Y0Qv2Xawfy4: regionColors.WESTERN_BALKANS.medium,
        dwxX1gLVrcF: regionColors.WESTERN_BALKANS.base,
    },
    [REGION_CODES.EUROPEAN_UNION]: {
        XvkqQfvXFGB: regionColors.EUROPEAN_UNION.light,
        Y0Qv2Xawfy4: regionColors.EUROPEAN_UNION.medium,
        dwxX1gLVrcF: regionColors.EUROPEAN_UNION.base,
    },
    [REGION_CODES.EASTERN_EUROPE_AND_CENTRAL_ASIA]: {
        XvkqQfvXFGB: regionColors.EASTERN_EUROPE_AND_CENTRAL_ASIA.light,
        Y0Qv2Xawfy4: regionColors.EASTERN_EUROPE_AND_CENTRAL_ASIA.medium,
        dwxX1gLVrcF: regionColors.EASTERN_EUROPE_AND_CENTRAL_ASIA.base,
    },
    [REGION_CODES.EUROPEAN_REGION]: {
        XvkqQfvXFGB: regionColors.EUROPEAN_REGION.light,
        Y0Qv2Xawfy4: regionColors.EUROPEAN_REGION.medium,
        dwxX1gLVrcF: regionColors.EUROPEAN_REGION.base,
    },
    [REGION_CODES.EU_CANDIDATE_COUNTRIES]: {
        XvkqQfvXFGB: regionColors.EU_CANDIDATE_COUNTRIES.light,
        Y0Qv2Xawfy4: regionColors.EU_CANDIDATE_COUNTRIES.medium,
        dwxX1gLVrcF: regionColors.EU_CANDIDATE_COUNTRIES.base,
    },
};

export const chart_qRl2vEbBY0u_Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    const chart = comparativeSingleYearColumnChartOptions({
        chartSource,
        seriesNames,
        seriesColors,
        currentYear: chartSource.currentYear,
        orderByValueInSerie: "dwxX1gLVrcF",
        stackedValuesUpTo100: true,
        regionColorsBySeries: regionColorsBySeries,
        hideYear: true,
    });

    return {
        ...chart,
        yAxis: {
            ...chart?.yAxis,
            title: {
                text: "Compulsory spending on health (%)",
                style: { fontSize: "13px" },
            },
        },
    };
};
