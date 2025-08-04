import { LatestAvailable, LatestCOVID19 } from "../../../../domain/entities/Year";
import { sortedCategoryNames, sortedSubcategoryNames } from "./utils";
import { sortColumnsRowByColumnsOrder, sortDataRowsByParameterOrder } from "../utils/sortColumnsAndDataRows";
import { VisualizationExtra } from "../../../../domain/entities/indicator-explorer/Visualization";

const COLUMNS_ORDER = ["Country", "Year", "Parameter", "Value"];
const PARAMETER_ORDER = ["Poorest", "Total", "Richest"];

export const chart_EtHaEt6bnm5_nlYSkEMZxgN_Seed: VisualizationExtra = {
    categoryName: sortedCategoryNames.unmetNeed,
    friendlyName:
        "Unmet need for health care due to cost, distance and waiting time (poorest quintile, total, richest quintile)",
    countryPageName: "unmet need for health care due to cost, distance and waiting time by income quintile",
    isComparative: true,
    subcategoryName: sortedSubcategoryNames.comparative,
    allowedYears: [LatestAvailable, LatestCOVID19],
    selectedYearsByDefault: [LatestAvailable],
    isYearSingleSelection: true,
    hasEURegion: true,
    isOrgUnitRegions: true,
    sortColumns: (headerRow: string[]) => sortColumnsRowByColumnsOrder(headerRow, COLUMNS_ORDER),
    sortDataRows: (headerRow: string[], dataRows: string[][]) =>
        sortDataRowsByParameterOrder(headerRow, dataRows, PARAMETER_ORDER),
};
