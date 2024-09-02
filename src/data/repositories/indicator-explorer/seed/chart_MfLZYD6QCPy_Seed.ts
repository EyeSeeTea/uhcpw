import { sortColumnsRowByColumnsOrder, sortDataRowsByParameterOrder } from "../utils/sortColumnsAndDataRows";
import { sortedCategoryNames } from "./utils";

const COLUMNS_ORDER = ["Country", "Year", "Parameter", "Value"];
const PARAMETER_ORDER = ["Poorest", "Average", "Richest"];

export const chart_MfLZYD6QCPy_Seed = {
    categoryName: sortedCategoryNames.unmetNeed,
    friendlyName: "unmet need for prescribed medicines due to cost by income quintile",
    selectedYearsByDefault: [{ id: "2019" }],
    allowedYears: [{ id: "2014" }, { id: "2019" }],
    hasEur27: true,
    maxCountryFilter: 2,
    isOnlyEu27Comparison: true,
    sortColumns: (headerRow: string[]) => sortColumnsRowByColumnsOrder(headerRow, COLUMNS_ORDER),
    sortDataRows: (headerRow: string[], dataRows: string[][]) =>
        sortDataRowsByParameterOrder(headerRow, dataRows, PARAMETER_ORDER),
};
