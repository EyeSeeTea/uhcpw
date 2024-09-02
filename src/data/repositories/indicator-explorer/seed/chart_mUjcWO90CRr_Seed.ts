import { LatestAvailable } from "../../../../domain/entities/Year";
import { sortColumnsRowByColumnsOrder, sortDataRowsByParameterOrder } from "../utils/sortColumnsAndDataRows";
import { sortedCategoryNames } from "./utils";

const COLUMNS_ORDER = ["Country", "Parameter", "Value"];
const PARAMETER_ORDER = [
    "Out-of-pocket payments as a share of current spending on health (hf3)",
    "Public spending on health as a share of GDP",
];

export const chart_mUjcWO90CRr_Seed = {
    categoryName: sortedCategoryNames.comparative,
    showCountryTag: true,
    friendlyName:
        "Public spending on health as a share of GDP and out-of-pocket payments as a share of current spending on health",
    isComparative: true,
    allowedYears: [LatestAvailable],
    hasEur27: true,
    sortColumns: (headerRow: string[]) => sortColumnsRowByColumnsOrder(headerRow, COLUMNS_ORDER),
    sortDataRows: (headerRow: string[], dataRows: string[][]) =>
        sortDataRowsByParameterOrder(headerRow, dataRows, PARAMETER_ORDER),
};
