import { VisualizationExtra } from "../../../../domain/entities/indicator-explorer/Visualization";
import { sortDataRowsByParameterOrder } from "../utils/sortColumnsAndDataRows";
import { sortedCategoryNames, sortedSubcategoryNames } from "./utils";

const PARAMETER_ORDER = ["<65", "65+", "65+", "Average"];

export const chart_AjY0AISVVs5_dVRGqsjce2n_Seed: VisualizationExtra = {
    categoryName: sortedCategoryNames.financialHardship,
    friendlyName:
        "Breakdown of catastrophic health spending by age of the head of the household and incidence of catastrophic health spending (average and 65+)",
    isComparative: false,
    subcategoryName: sortedSubcategoryNames.countryLevel,
    showCountryTag: true,
    maxCountryFilter: 1,
    needsToFilterZeroValues: true,
    sortDataRows: (headerRow: string[], dataRows: string[][]) =>
        sortDataRowsByParameterOrder(headerRow, dataRows, PARAMETER_ORDER),
};
