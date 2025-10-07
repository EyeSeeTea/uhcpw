import { VisualizationExtra } from "../../../../domain/entities/indicator-explorer/Visualization";
import { LatestAvailable, LatestCOVID19 } from "../../../../domain/entities/Year";
import { sortedCategoryNames, sortedSubcategoryNames } from "./utils";

export const chart_GimM6ANOKhd_Seed: VisualizationExtra = {
    categoryName: sortedCategoryNames.financialHardship,
    friendlyName: "households with catastrophic health spending by consumption quintile",
    regionalPageName: "Households with catastrophic health spending by consumption quintile, latest available year",
    categoryTag: "International comparison",
    isComparative: true,
    subcategoryName: sortedSubcategoryNames.comparative,
    allowedYears: [LatestAvailable, LatestCOVID19],
    selectedYearsByDefault: [LatestAvailable],
    isYearSingleSelection: true,
};
