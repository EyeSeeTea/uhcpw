import { LatestAvailable } from "../../../../domain/entities/Year";
import { sortedCategoryNames } from "./utils";
import { sortColumnsRowByColumnsOrder, sortDataRowsByParameterOrder } from "../utils/sortColumnsAndDataRows";

const COLUMNS_ORDER = ["Country", "Year", "Parameter", "Value"];
const PARAMETER_ORDER = ["Poorest", "Average", "Richest"];

export const chart_AophAEpx5e0_BOcLONPSyYS_Seed = {
    categoryName: sortedCategoryNames.comparative,
    friendlyName: "unmet need for dental care due to cost, distance and waiting time by income quintile",
    isComparative: true,
    allowedYears: [LatestAvailable],
    hasEur27: true,
    sortColumns: (headerRow: string[]) => sortColumnsRowByColumnsOrder(headerRow, COLUMNS_ORDER),
    sortDataRows: (headerRow: string[], dataRows: string[][]) =>
        sortDataRowsByParameterOrder(headerRow, dataRows, PARAMETER_ORDER),
};
