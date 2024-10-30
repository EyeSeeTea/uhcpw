import { LatestAvailable, LatestCOVID19 } from "../../../../domain/entities/Year";
import { sortedCategoryNames } from "./utils";

export const kIpnMBaBvZ9_yAxisHouseholds = "WmOGqGcov4f";
export const kIpnMBaBvZ9_xAxisOutOfPocket = "S8OMD0f9IZp";

export const chart_kIpnMBaBvZ9_Seed = {
    categoryName: sortedCategoryNames.comparative,
    friendlyName:
        "households with catastrophic health spending and out-of-pocket payments as a share of current spending on health in Europe and central Asia",
    downloadedFileName:
        "households with catastrophic health spending and out-of-pocket payments in Europe and central Asia",
    isComparative: true,
    allowedYears: [LatestAvailable, LatestCOVID19],
    selectedYearsByDefault: [LatestAvailable],
    isYearSingleSelection: true,
    isScatter: true,
    xAxis: kIpnMBaBvZ9_xAxisOutOfPocket,
    yAxis: kIpnMBaBvZ9_yAxisHouseholds,
};
