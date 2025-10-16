import { VisualizationExtra } from "../../../../domain/entities/indicator-explorer/Visualization";
import { sortColumnsRowByColumnsOrder, sortDataRowsByParameterOrder } from "../utils/sortColumnsAndDataRows";
import { sortedCategoryNames, sortedSubcategoryNames } from "./utils";

const COLUMNS_ORDER = ["Country / Area", "Year", "Parameter", "Value"];
const PARAMETER_ORDER = ["Poorest", "Total", "Richest"];

export const chart_MfLZYD6QCPy_Seed: VisualizationExtra = {
    categoryName: sortedCategoryNames.unmetNeed,
    friendlyName: "Unmet need for prescribed medicines due to cost (poorest quintile, average, richest quintile)",
    countryPageName: "unmet need for prescribed medicines due to cost by income quintile",
    isComparative: true,
    subcategoryName: sortedSubcategoryNames.comparative,
    selectedYearsByDefault: [{ id: "2019" }],
    allowedYears: [{ id: "2014" }, { id: "2019" }],
    hasEURegion: true,
    isOrgUnitRegions: true,
    isOnlyEu27Comparison: true,
    sortColumns: (headerRow: string[]) => sortColumnsRowByColumnsOrder(headerRow, COLUMNS_ORDER),
    sortDataRows: (headerRow: string[], dataRows: string[][]) =>
        sortDataRowsByParameterOrder(headerRow, dataRows, PARAMETER_ORDER),
};
