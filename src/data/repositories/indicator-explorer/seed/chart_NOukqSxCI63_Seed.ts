import { VisualizationExtra } from "../../../../domain/entities/indicator-explorer/Visualization";
import { LatestAvailable, LatestCOVID19 } from "../../../../domain/entities/Year";
import { sortedCategoryNames, sortedSubcategoryNames } from "./utils";

export const chart_NOukqSxCI63_Seed: VisualizationExtra = {
    categoryName: sortedCategoryNames.financialHardship,
    categoryTag: "International comparison",
    friendlyName: "households with catastrophic health spending",
    isComparative: true,
    subcategoryName: sortedSubcategoryNames.comparative,
    allowedYears: [LatestAvailable, LatestCOVID19],
    selectedYearsByDefault: [LatestAvailable],
    isYearSingleSelection: true,
};
