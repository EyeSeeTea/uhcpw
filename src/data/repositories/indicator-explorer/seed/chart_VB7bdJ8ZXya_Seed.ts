import { LatestAvailable, LatestCOVID19 } from "../../../../domain/entities/Year";
import { sortedCategoryNames } from "./utils";

export const chart_VB7bdJ8ZXya_Seed = {
    categoryName: sortedCategoryNames.comparative,
    categoryTag: "International comparison",
    friendlyName: "breakdown of catastrophic health spending by type of care",
    isComparative: true,
    allowedYears: [LatestAvailable, LatestCOVID19],
    selectedYearsByDefault: [LatestAvailable],
    isYearSingleSelection: true,
};
