import { VisualizationExtra } from "../../../../domain/entities/indicator-explorer/Visualization";
import { LatestAvailable, LatestCOVID19 } from "../../../../domain/entities/Year";
import { sortedCategoryNames } from "./utils";

export const kIpnMBaBvZ9_yAxisHouseholds = "WmOGqGcov4f";
export const kIpnMBaBvZ9_xAxisOutOfPocket = "S8OMD0f9IZp";

export const chart_kIpnMBaBvZ9_Seed: VisualizationExtra = {
    categoryName: sortedCategoryNames.combinedIndicators,
    friendlyName:
        "Households with catastrophic health spending and out-of-pocket payments as a share of current spending on health",
    downloadedFileName:
        "Households with catastrophic health spending and out-of-pocket payments as a share of current spending on health",
    regionalPageName:
        "Households with catastrophic health spending and out-of-pocket payments as a share of current spending on health, latest available year",
    isComparative: true,
    allowedYears: [LatestAvailable, LatestCOVID19],
    selectedYearsByDefault: [LatestAvailable],
    isYearSingleSelection: true,
    isScatter: true,
    xAxis: kIpnMBaBvZ9_xAxisOutOfPocket,
    yAxis: kIpnMBaBvZ9_yAxisHouseholds,
};
