import { LatestAvailable, LatestCOVID19 } from "../../../../domain/entities/Year";
import { sortedCategoryNames } from "./utils";

export const chart_mcNfvQaVbfy_Seed = {
    categoryName: sortedCategoryNames.comparative,
    categoryTag: "International comparison",
    friendlyName: "breakdown of catastrophic health spending by type of care in the poorest quintile",
    isComparative: true,
    allowedYears: [LatestAvailable, LatestCOVID19],
    selectedYearsByDefault: [LatestAvailable],
    isYearSingleSelection: true,
};
