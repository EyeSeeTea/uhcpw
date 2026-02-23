import { VisualizationExtra } from "../../../../domain/entities/indicator-explorer/Visualization";
import { sortColumnsRowByColumnsOrder, sortDataRowsByParameterOrder } from "../utils/sortColumnsAndDataRows";
import { sortedCategoryNames, sortedSubcategoryNames } from "./utils";

const COLUMNS_ORDER = ["Country / Area", "Year", "Parameter", "Value"];
const PARAMETER_ORDER = ["65+ Years", "Average", "<25 Years"];

export const chart_oaYpnZIdm5C_Seed: VisualizationExtra = {
    categoryName: sortedCategoryNames.unmetNeed,
    friendlyName: "Unmet need for prescribed medicines due to cost (<25 years, average, 65+ years)",
    isComparative: true,
    isYearSingleSelection: true,
    subcategoryName: sortedSubcategoryNames.comparative,
    selectedYearsByDefault: [{ id: "2019" }],
    allowedYears: [{ id: "2019" }],
    hasEURegion: true,
    hasEuropeanRegion: true,
    hasEECARegion: true,
    hasWesternBalkansRegion: true,
    hasEUCandidatesRegion: true,
    isOrgUnitRegions: true,
    sortColumns: (headerRow: string[]) => sortColumnsRowByColumnsOrder(headerRow, COLUMNS_ORDER),
    sortDataRows: (headerRow: string[], dataRows: string[][]) =>
        sortDataRowsByParameterOrder(headerRow, dataRows, PARAMETER_ORDER),
};
