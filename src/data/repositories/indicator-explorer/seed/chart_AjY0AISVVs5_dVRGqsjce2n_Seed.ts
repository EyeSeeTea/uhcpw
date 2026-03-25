import { VisualizationExtra } from "../../../../domain/entities/indicator-explorer/Visualization";
import { sortDataRowsByParameterOrder } from "../utils/sortColumnsAndDataRows";
import { sortedCategoryNames, sortedSubcategoryNames } from "./utils";

const PARAMETER_ORDER = ["<65", "65+", "65+", "Average"];
const COLUMN_ROWS = ["ZucMxrA6r2j", "SYkLkW1TFNu"];

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
    getYearsWithData: (dataRows: string[][]): string[] => {
        const yearsWithData: string[] = [
            ...new Set(
                dataRows
                    .filter(row => row[0] && COLUMN_ROWS.includes(row[0]))
                    .map(row => row[1])
                    .filter((year): year is string => !!year)
            ),
        ].sort();

        return yearsWithData;
    },
};
