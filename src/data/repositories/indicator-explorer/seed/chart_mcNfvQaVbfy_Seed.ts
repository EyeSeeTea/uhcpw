import { VisualizationExtra } from "../../../../domain/entities/indicator-explorer/Visualization";
import { LatestAvailable } from "../../../../domain/entities/Year";
import { sortedCategoryNames, sortedSubcategoryNames } from "./utils";

export const chart_mcNfvQaVbfy_Seed: VisualizationExtra = {
    categoryName: sortedCategoryNames.financialHardship,
    categoryTag: "International comparison",
    friendlyName: "breakdown of catastrophic health spending by type of care in the poorest quintile",
    regionalPageName:
        "Breakdown of catastrophic health spending by type of care in the poorest consumption quintile, latest available year",
    isComparative: true,
    subcategoryName: sortedSubcategoryNames.comparative,
    selectedYearsByDefault: [LatestAvailable],
    isYearSingleSelection: true,
    hasEURegion: true,
    hasEuropeanRegion: true,
    hasEECARegion: true,
    hasWesternBalkansRegion: true,
    hasEUCandidatesRegion: true,
    isOrgUnitRegions: true,
    includeLatestCOVID19: true,
    includeLatestAvailableYear: true,
};
