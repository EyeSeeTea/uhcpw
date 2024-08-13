import _ from "lodash";
import { LatestAvailable } from "../../../../domain/entities/Year";
import { sortedCategoryNames } from "./utils";

const SORTED_PARAMETER = [
    "Further impoverished",
    "Impoverished",
    "At risk of impoverishment",
    "Not at risk of impoverishment",
];

const HEADER_ORDER = ["Country", "Year", "Parameter", "Value"];

export const chart_DefU3mkASo6_Seed = {
    categoryName: sortedCategoryNames.comparative,
    friendlyName: "breakdown of households with catastrophic health spending by risk of impoverishment",
    isComparative: true,
    allowedYears: [LatestAvailable],
    sortColumnsInExcel: (headerRow: string[]) => {
        const sortedHeader = _.sortBy(headerRow, header => {
            const index = HEADER_ORDER.indexOf(header);
            return index === -1 ? Infinity : index;
        });

        return sortedHeader;
    },
    sortDataRowsInExcel: (headerRow: string[], dataRows: string[][]) => {
        const yearIndex = headerRow.findIndex(header => header === "Year");

        const countryIndex = headerRow.findIndex(header => header === "Country");
        const parameterIndex = headerRow.findIndex(header => header === "Parameter");

        const sortedDataRows = _.orderBy(
            dataRows,
            [
                row => row[yearIndex],
                row => row[countryIndex],
                row => SORTED_PARAMETER.indexOf(row[parameterIndex]?.toString() || ""),
            ],
            ["asc", "asc"]
        );
        return sortedDataRows;
    },
};
