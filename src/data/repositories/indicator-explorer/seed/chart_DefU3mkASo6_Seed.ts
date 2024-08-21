import { LatestAvailable } from "../../../../domain/entities/Year";
import { sortedCategoryNames } from "./utils";
import { sortColumnsRowByColumnsOrder, sortDataRowsByParameterOrder } from "../utils/sortColumnsAndDataRows";

const PARAMETER_ORDER = [
    "Further impoverished",
    "Impoverished",
    "At risk of impoverishment",
    "Not at risk of impoverishment",
];

const COLUMNS_ORDER = ["Country", "Year", "Parameter", "Value"];

export const chart_DefU3mkASo6_Seed = {
    categoryName: sortedCategoryNames.comparative,
    friendlyName: "breakdown of households with catastrophic health spending by risk of impoverishment",
    isComparative: true,
    allowedYears: [LatestAvailable],
    sortColumns: (headerRow: string[]) => sortColumnsRowByColumnsOrder(headerRow, COLUMNS_ORDER),
    sortDataRows: (headerRow: string[], dataRows: string[][]) =>
        sortDataRowsByParameterOrder(headerRow, dataRows, PARAMETER_ORDER),
};
