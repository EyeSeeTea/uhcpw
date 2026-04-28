import { VisualizationExtra } from "../../../../domain/entities/indicator-explorer/Visualization";
import { sortedCategoryNames, sortedSubcategoryNames } from "./utils";

export const chart_ToEa2VuZLDt_Seed: VisualizationExtra = {
    categoryName: sortedCategoryNames.healthSpending,
    categoryTag: "International comparison",
    friendlyName: "Voluntary health spending as a share of current spending on health (multiple years, line chart)",
    minCountryFilter: 1,
    isOrgUnitRegions: true,
    hasEURegion: true,
    hasEuropeanRegion: true,
    hasEECARegion: true,
    hasWesternBalkansRegion: true,
    hasEUCandidatesRegion: true,
    allowBreaksInSeries: true,
    isComparative: true,
    subcategoryName: sortedSubcategoryNames.comparative,
    hideBosniaAndHerzegovinaRegions: true,
    yearsFilterUpTo2YearsAgo: true,
};
