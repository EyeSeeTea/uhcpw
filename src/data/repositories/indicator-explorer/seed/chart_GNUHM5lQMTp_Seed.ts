import { VisualizationExtra } from "../../../../domain/entities/indicator-explorer/Visualization";
import { LatestAvailable, LatestCOVID19 } from "../../../../domain/entities/Year";
import { sortedCategoryNames, sortedSubcategoryNames } from "./utils";

export const chart_GNUHM5lQMTp_Seed: VisualizationExtra = {
    categoryName: sortedCategoryNames.householdHealthSpending,
    friendlyName: "out-of-pocket payments as a share of household consumption",
    isComparative: true,
    subcategoryName: sortedSubcategoryNames.comparative,
    allowedYears: [LatestAvailable, LatestCOVID19],
    selectedYearsByDefault: [LatestAvailable],
    isYearSingleSelection: true,
};
