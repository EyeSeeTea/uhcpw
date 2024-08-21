import { LatestAvailable } from "../../../../domain/entities/Year";
import { sortColumnsRowByColumnsOrder } from "../utils/sortColumnsAndDataRows";
import { sortedCategoryNames } from "./utils";

const COLUMNS_ORDER = ["Country", "Parameter", "Value"];

export const chart_mUjcWO90CRr_Seed = {
    categoryName: sortedCategoryNames.comparative,
    showCountryTag: true,
    friendlyName:
        "Public spending on health as a share of GDP and out-of-pocket payments as a share of current spending on health",
    isComparative: true,
    allowedYears: [LatestAvailable],
    hasEur27: true,
    sortColumns: (headerRow: string[]) => sortColumnsRowByColumnsOrder(headerRow, COLUMNS_ORDER),
};
