import { sortedCategoryNames, sortedSubcategoryNames } from "./utils";
import { VisualizationExtra } from "../../../../domain/entities/indicator-explorer/Visualization";

export const chart_eibYs7QySNk_Seed: VisualizationExtra = {
    categoryName: sortedCategoryNames.unmetNeed,
    friendlyName: "Unmet need for prescribed medicines due to cost",
    selectedYearsByDefault: [{ id: "2019" }],
    allowedYears: [{ id: "2014" }, { id: "2019" }],
    hasEur27: true,
    isComparative: false,
    subcategoryName: sortedSubcategoryNames.comparative,
};
