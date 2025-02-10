import { VisualizationExtra } from "../../../../domain/entities/indicator-explorer/Visualization";
import { LatestAvailable, LatestCOVID19 } from "../../../../domain/entities/Year";
import { sortedCategoryNames, sortedSubcategoryNames } from "./utils";

export const chart_WDUV9ZrJiNC_Seed: VisualizationExtra = {
    categoryName: sortedCategoryNames.financialHardship,
    friendlyName: "Households with catastrophic health spending on total and in the poorest quintile",
    isComparative: true,
    subcategoryName: sortedSubcategoryNames.comparative,
    allowedYears: [LatestAvailable, LatestCOVID19],
    selectedYearsByDefault: [LatestAvailable],
    isYearSingleSelection: true,
};
