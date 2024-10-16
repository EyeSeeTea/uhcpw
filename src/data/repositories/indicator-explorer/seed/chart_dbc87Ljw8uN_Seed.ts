import { LatestAvailable, LatestCOVID19 } from "../../../../domain/entities/Year";
import { sortedCategoryNames } from "./utils";

export const chart_dbc87Ljw8uN_Seed = {
    categoryName: sortedCategoryNames.comparative,
    categoryTag: "International comparison",
    friendlyName: "households with impoverishing health spending",
    isComparative: true,
    allowedYears: [LatestAvailable, LatestCOVID19],
    selectedYearsByDefault: [LatestAvailable],
    isYearSingleSelection: true,
};
