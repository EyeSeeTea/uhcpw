import { LatestAvailable, LatestCOVID19 } from "../../../../domain/entities/Year";
import { sortedCategoryNames } from "./utils";

export const chart_GNUHM5lQMTp_Seed = {
    categoryName: sortedCategoryNames.comparative,
    friendlyName: "out-of-pocket payments as a share of household consumption",
    isComparative: true,
    allowedYears: [LatestAvailable, LatestCOVID19],
    selectedYearsByDefault: [LatestAvailable],
    isYearSingleSelection: true,
};
