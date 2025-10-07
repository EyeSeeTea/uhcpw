import { VisualizationExtra } from "../../../../domain/entities/indicator-explorer/Visualization";
import { sortedCategoryNames, sortedSubcategoryNames } from "./utils";

export const chart_iMI82inOBiD_Seed: VisualizationExtra = {
    categoryName: sortedCategoryNames.healthSpending,
    categoryTag: "International comparison",
    friendlyName: "Public spending on health as a share of government spending (bar chart)",
    countryPageName: "public spending on health as a share of government spending",
    regionalPageName: "Public spending on health as a share of government spending, latest available year",
    isComparative: true,
    subcategoryName: sortedSubcategoryNames.comparative,
    hasEURegion: true,
    isOrgUnitRegions: true,
    isYearSingleSelection: true,
    hideBosniaAndHerzegovinaRegions: true,
    showYearInDownloadFile: true,
    yearsFilterUpTo2YearsAgo: true,
};
