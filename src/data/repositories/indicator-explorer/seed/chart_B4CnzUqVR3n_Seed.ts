import { VisualizationExtra } from "../../../../domain/entities/indicator-explorer/Visualization";
import { LatestCOVID19 } from "../../../../domain/entities/Year";
import { sortedCategoryNames, sortedSubcategoryNames } from "./utils";

export const chart_B4CnzUqVR3n_Seed: VisualizationExtra = {
    categoryName: sortedCategoryNames.healthSpending,
    categoryTag: "International comparison",
    friendlyName: "Public spending on health as a share of government spending (bar chart)",
    countryPageName: "public spending on health as a share of government spending",
    subcategoryName: sortedSubcategoryNames.comparative,
    isComparative: true,
    hasEur27: true,
    allowedYears: [LatestCOVID19],
    hideBosniaAndHerzegovinaRegions: true,
    hide: true,
};
