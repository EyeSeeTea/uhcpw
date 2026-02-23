import { LatestAvailable, LatestCOVID19 } from "../../../../domain/entities/Year";
import { sortedCategoryNames, sortedSubcategoryNames } from "./utils";
import { sortColumnsRowByColumnsOrder, sortDataRowsByParameterOrder } from "../utils/sortColumnsAndDataRows";
import { VisualizationExtra } from "../../../../domain/entities/indicator-explorer/Visualization";

const COLUMNS_ORDER = ["Country / Area", "Year", "Parameter", "Value"];
const PARAMETER_ORDER = ["65+ Years", "Average", "<25 Years"];

export const chart_eBxPw4kUnLU_Seed: VisualizationExtra = {
    categoryName: sortedCategoryNames.unmetNeed,
    friendlyName: "Unmet need for dentalcare due to cost, distance and waiting time (<25 years, average, 65+ years)",
    subcategoryName: sortedSubcategoryNames.comparative,
    isComparative: true,
    allowedYears: [LatestAvailable, LatestCOVID19],
    selectedYearsByDefault: [LatestAvailable],
    isYearSingleSelection: true,
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
