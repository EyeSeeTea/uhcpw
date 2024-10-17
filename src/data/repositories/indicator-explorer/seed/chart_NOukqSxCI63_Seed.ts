import { LatestAvailable, LatestCOVID19 } from "../../../../domain/entities/Year";
import { sortedCategoryNames } from "./utils";

export const chart_NOukqSxCI63_Seed = {
    categoryName: sortedCategoryNames.comparative,
    categoryTag: "International comparison",
    friendlyName: "households with catastrophic health spending",
    isComparative: true,
    allowedYears: [LatestAvailable, LatestCOVID19],
    selectedYearsByDefault: [LatestAvailable],
    isYearSingleSelection: true,
};
