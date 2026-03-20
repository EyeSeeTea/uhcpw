import { VisualizationExtra } from "../../../../domain/entities/indicator-explorer/Visualization";
import { sortDataRowsByParameterOrder } from "../utils/sortColumnsAndDataRows";
import { sortedCategoryNames, sortedSubcategoryNames } from "./utils";

const PARAMETER_ORDER = ["Younger", "Adults only", "Multigenerational", "Older", "Only older", "Only older", "Average"];

export const chart_hEuM5hv2vVg_JljTfo2KUid_Seed: VisualizationExtra = {
    categoryName: sortedCategoryNames.financialHardship,
    friendlyName:
        "Breakdown of catastrophic health spending by household age composition and incidence of catastrophic health spending (average and only older households)",
    isComparative: false,
    subcategoryName: sortedSubcategoryNames.countryLevel,
    showCountryTag: true,
    maxCountryFilter: 1,
    needsToFilterZeroValues: true,
    sortDataRows: (headerRow: string[], dataRows: string[][]) =>
        sortDataRowsByParameterOrder(headerRow, dataRows, PARAMETER_ORDER),
};
