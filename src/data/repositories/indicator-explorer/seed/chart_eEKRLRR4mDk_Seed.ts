import { VisualizationExtra } from "../../../../domain/entities/indicator-explorer/Visualization";
import { sortColumnsRowByColumnsOrder, sortDataRowsByParameterOrder } from "../utils/sortColumnsAndDataRows";
import { sortedCategoryNames } from "./utils";

const COLUMNS_ORDER = ["Country / Area", "Parameter", "Value"];
const PARAMETER_ORDER = ["GDP per person in current PPP", "Public spending on health as a share of GDP"];

export const chart_eEKRLRR4mDk_Seed: VisualizationExtra = {
    categoryName: sortedCategoryNames.combinedIndicators,
    showCountryTag: true,
    friendlyName: "Public spending on health as a share of GDP and GDP per person",
    isComparative: true,
    isYearSingleSelection: true,
    hasEURegion: true,
    isOrgUnitRegions: true,
    sortColumns: (headerRow: string[]) => sortColumnsRowByColumnsOrder(headerRow, COLUMNS_ORDER),
    sortDataRows: (headerRow: string[], dataRows: string[][]) =>
        sortDataRowsByParameterOrder(headerRow, dataRows, PARAMETER_ORDER),
    hideBosniaAndHerzegovinaRegions: true,
    showYearInDownloadFile: true,
};
