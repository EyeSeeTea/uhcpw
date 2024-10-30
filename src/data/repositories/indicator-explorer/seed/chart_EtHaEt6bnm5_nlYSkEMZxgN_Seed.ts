import { LatestAvailable, LatestCOVID19 } from "../../../../domain/entities/Year";
import { sortedCategoryNames } from "./utils";
import { sortColumnsRowByColumnsOrder, sortDataRowsByParameterOrder } from "../utils/sortColumnsAndDataRows";

const COLUMNS_ORDER = ["Country", "Year", "Parameter", "Value"];
const PARAMETER_ORDER = ["Poorest", "Total", "Richest"];

export const chart_EtHaEt6bnm5_nlYSkEMZxgN_Seed = {
    categoryName: sortedCategoryNames.comparative,
    friendlyName: "unmet need for health care due to cost, distance and waiting time by income quintile",
    isComparative: true,
    allowedYears: [LatestAvailable, LatestCOVID19],
    selectedYearsByDefault: [LatestAvailable],
    isYearSingleSelection: true,
    hasEur27: true,
    sortColumns: (headerRow: string[]) => sortColumnsRowByColumnsOrder(headerRow, COLUMNS_ORDER),
    sortDataRows: (headerRow: string[], dataRows: string[][]) =>
        sortDataRowsByParameterOrder(headerRow, dataRows, PARAMETER_ORDER),
};
