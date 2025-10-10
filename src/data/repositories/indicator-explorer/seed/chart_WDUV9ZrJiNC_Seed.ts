import { VisualizationExtra } from "../../../../domain/entities/indicator-explorer/Visualization";
import { LatestAvailable, LatestCOVID19 } from "../../../../domain/entities/Year";
import { sortedCategoryNames, sortedSubcategoryNames } from "./utils";
import { sortColumnsRowByColumnsOrder } from "../utils/sortColumnsAndDataRows";

const COLUMNS_ORDER = ["Country / Area", "Year", "Parameter", "Value"];

export const chart_WDUV9ZrJiNC_Seed: VisualizationExtra = {
    categoryName: sortedCategoryNames.financialHardship,
    friendlyName: "Households with catastrophic health spending in total and in the poorest quintile",
    regionalPageName:
        "Households with catastrophic health spending in total and in the poorest consumption quintile, latest available year",
    isComparative: true,
    subcategoryName: sortedSubcategoryNames.comparative,
    allowedYears: [LatestAvailable, LatestCOVID19],
    selectedYearsByDefault: [LatestAvailable],
    isYearSingleSelection: true,
    sortColumns: (headerRow: string[]) => sortColumnsRowByColumnsOrder(headerRow, COLUMNS_ORDER),
};
