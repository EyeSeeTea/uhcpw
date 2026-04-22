import { VisualizationExtra } from "../../../../domain/entities/indicator-explorer/Visualization";
import { LatestAvailable, LatestCOVID19 } from "../../../../domain/entities/Year";
import { sortColumnsRowByColumnsOrder, sortDataRowsByParameterOrder } from "../utils/sortColumnsAndDataRows";
import { sortedCategoryNames } from "./utils";

const COLUMNS_ORDER = ["Indicator", "Country / Area", "Year", "Value"];
const PARAMETER_ORDER = [
    "Out-of-pocket payments as a share of current spending on health (hf3)",
    "Public spending on health as a share of GDP",
];

const fnOIi0bdISn_xAxisPublicSpending = "qO6diSOTqhL";
const fnOIi0bdISn_yAxisOutOfPocket = "SKi7UzTsnJS";

export const chart_fnOIi0bdISn_Seed: VisualizationExtra = {
    categoryName: sortedCategoryNames.combinedIndicators,
    showCountryTag: true,
    friendlyName:
        "Public spending on health as a share of GDP and out-of-pocket payments as a share of current spending on health",
    regionalPageName:
        "Public or compulsory spending on health as a share of GDP and out of pocket payments as a share of current spending on health, latest available year",
    isComparative: true,
    isOrgUnitRegions: true,
    hasEURegion: true,
    hasEuropeanRegion: true,
    hasEECARegion: true,
    hasWesternBalkansRegion: true,
    hasEUCandidatesRegion: true,
    isYearSingleSelection: true,
    allowedYears: [LatestAvailable, LatestCOVID19],
    selectedYearsByDefault: [LatestAvailable],
    isScatter: true,
    xAxis: fnOIi0bdISn_xAxisPublicSpending,
    yAxis: fnOIi0bdISn_yAxisOutOfPocket,
    sortColumns: (headerRow: string[]) => sortColumnsRowByColumnsOrder(headerRow, COLUMNS_ORDER),
    sortDataRows: (headerRow: string[], dataRows: string[][]) =>
        sortDataRowsByParameterOrder(headerRow, dataRows, PARAMETER_ORDER),
    hideBosniaAndHerzegovinaRegions: true,
    showYearInDownloadFile: true,
    hide: true,
};
