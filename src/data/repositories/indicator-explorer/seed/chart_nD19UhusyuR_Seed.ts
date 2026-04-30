import { VisualizationExtra } from "../../../../domain/entities/indicator-explorer/Visualization";
import { LatestAvailable } from "../../../../domain/entities/Year";
import { sortedCategoryNames, sortedSubcategoryNames } from "./utils";

export const chart_nD19UhusyuR_Seed: VisualizationExtra = {
    categoryName: sortedCategoryNames.healthSpending,
    subcategoryName: sortedSubcategoryNames.comparative,
    isComparative: true,
    friendlyName: "Voluntary health spending as a share of current spending on health (single year, bar chart)",
    minCountryFilter: 1,
    isOrgUnitRegions: true,
    hasEURegion: true,
    hasEuropeanRegion: true,
    hasEECARegion: true,
    hasWesternBalkansRegion: true,
    hasEUCandidatesRegion: true,
    isYearSingleSelection: true,
    allowedYears: [LatestAvailable],
    selectedYearsByDefault: [LatestAvailable],
};
