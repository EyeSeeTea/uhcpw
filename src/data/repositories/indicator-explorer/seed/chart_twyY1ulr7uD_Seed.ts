import { sortedCategoryNames, sortedSubcategoryNames } from "./utils";
import { VisualizationExtra } from "../../../../domain/entities/indicator-explorer/Visualization";
import { LatestAvailable, LatestCOVID19 } from "../../../../domain/entities/Year";

export const chart_twyY1ulr7uD_Seed: VisualizationExtra = {
    categoryName: sortedCategoryNames.healthSpending,
    friendlyName: "Out-of-pocket payments as a share of current spending on health (bar chart)",
    selectedYearsByDefault: [LatestAvailable],
    allowedYears: [LatestAvailable, LatestCOVID19],
    hasEURegion: true,
    hasEuropeanRegion: true,
    hasEECARegion: true,
    hasWesternBalkansRegion: true,
    hasEUCandidatesRegion: true,
    isOrgUnitRegions: true,
    isComparative: true,
    subcategoryName: sortedSubcategoryNames.comparative,
};
