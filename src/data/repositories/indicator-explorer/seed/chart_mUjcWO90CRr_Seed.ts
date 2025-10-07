import { VisualizationExtra } from "../../../../domain/entities/indicator-explorer/Visualization";
import { sortColumnsRowByColumnsOrder, sortDataRowsByParameterOrder } from "../utils/sortColumnsAndDataRows";
import { sortedCategoryNames } from "./utils";

const COLUMNS_ORDER = ["Country / Area", "Parameter", "Value"];
const PARAMETER_ORDER = [
    "Out-of-pocket payments as a share of current spending on health (hf3)",
    "Public spending on health as a share of GDP",
];

export const chart_mUjcWO90CRr_Seed: VisualizationExtra = {
    categoryName: sortedCategoryNames.combinedIndicators,
    showCountryTag: true,
    friendlyName:
        "Public spending on health as a share of GDP and out-of-pocket payments as a share of current spending on health",
    regionalPageName:
        "Public or compulsory spending on health as a share of GDP and out of pocket payments as a share of current spending on health, latest available year",
    isComparative: true,
    hasEURegion: true,
    isOrgUnitRegions: true,
    isYearSingleSelection: true,
    sortColumns: (headerRow: string[]) => sortColumnsRowByColumnsOrder(headerRow, COLUMNS_ORDER),
    sortDataRows: (headerRow: string[], dataRows: string[][]) =>
        sortDataRowsByParameterOrder(headerRow, dataRows, PARAMETER_ORDER),
    hideBosniaAndHerzegovinaRegions: true,
    showYearInDownloadFile: true,
    yearsFilterUpTo2YearsAgo: true,
};
