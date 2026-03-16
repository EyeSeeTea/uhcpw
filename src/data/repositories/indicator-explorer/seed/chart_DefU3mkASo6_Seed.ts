import { LatestAvailable } from "../../../../domain/entities/Year";
import { sortedCategoryNames, sortedSubcategoryNames } from "./utils";
import { sortColumnsRowByColumnsOrder, sortDataRowsByParameterOrder } from "../utils/sortColumnsAndDataRows";
import { VisualizationExtra } from "../../../../domain/entities/indicator-explorer/Visualization";

const PARAMETER_ORDER = [
    "Further impoverished",
    "Impoverished",
    "At risk of impoverishment",
    "Not at risk of impoverishment",
];

const COLUMNS_ORDER = ["Country / Area", "Year", "Parameter", "Value"];

export const chart_DefU3mkASo6_Seed: VisualizationExtra = {
    categoryName: sortedCategoryNames.financialHardship,
    friendlyName: "breakdown of households with catastrophic health spending by risk of impoverishment",
    isComparative: true,
    subcategoryName: sortedSubcategoryNames.comparative,
    selectedYearsByDefault: [LatestAvailable],
    isYearSingleSelection: true,
    sortColumns: (headerRow: string[]) => sortColumnsRowByColumnsOrder(headerRow, COLUMNS_ORDER),
    sortDataRows: (headerRow: string[], dataRows: string[][]) =>
        sortDataRowsByParameterOrder(headerRow, dataRows, PARAMETER_ORDER),
    includeLatestCOVID19: true,
    includeLatestAvailableYear: true,
};
