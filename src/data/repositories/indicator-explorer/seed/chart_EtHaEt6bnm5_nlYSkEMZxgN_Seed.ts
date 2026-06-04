import { LatestAvailable } from "../../../../domain/entities/Year";
import { sortedCategoryNames, sortedSubcategoryNames } from "./utils";
import { sortColumnsRowByColumnsOrder, sortDataRowsByParameterOrder } from "../utils/sortColumnsAndDataRows";
import { VisualizationExtra } from "../../../../domain/entities/indicator-explorer/Visualization";

const COLUMNS_ORDER = ["Indicator", "Country / Area", "Year", "Value"];
const PARAMETER_ORDER = ["Poorest", "Average", "Richest"];

export const chart_EtHaEt6bnm5_nlYSkEMZxgN_Seed: VisualizationExtra = {
    categoryName: sortedCategoryNames.unmetNeed,
    friendlyName:
        "Unmet need for health care due to cost, distance and waiting time (poorest quintile, average, richest quintile)",
    countryPageName: "unmet need for health care due to cost, distance and waiting time by income quintile",
    regionalPageName:
        "Unmet need for health care due to cost, distance and waiting time on average and in the poorest and richest income quintiles, latest available year",
    isComparative: true,
    subcategoryName: sortedSubcategoryNames.comparative,
    selectedYearsByDefault: [LatestAvailable],
    isYearSingleSelection: true,
    includeLatestAvailableYear: true,
    includeLatestCOVID19: true,
    hasEURegion: true,
    isOrgUnitRegions: true,
    sortColumns: (headerRow: string[]) => sortColumnsRowByColumnsOrder(headerRow, COLUMNS_ORDER),
    sortDataRows: (headerRow: string[], dataRows: string[][]) =>
        sortDataRowsByParameterOrder(headerRow, dataRows, PARAMETER_ORDER),
};
