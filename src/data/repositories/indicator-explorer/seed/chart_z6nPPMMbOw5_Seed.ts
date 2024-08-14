import _ from "lodash";
import { sortedCategoryNames } from "./utils";

const TYPES_OF_CARE = [
    "Dental care",
    "Diagnostic tests",
    "Inpatient care",
    "Medical products",
    "Medicines",
    "Outpatient care",
];

const SORTED_FINANCING_SCHEMES = ["Public spending on health", "Voluntary health insurance", "Out-of-pocket payments"];

export const chart_z6nPPMMbOw5_Seed = {
    categoryName: sortedCategoryNames.healthSpending,
    showCountryTag: true,
    friendlyName: "Breakdown of current spending on health by financing scheme and type of care",
    maxCountryFilter: 1,
    hasEur27: true,
    sortDataRows: (headerRow: string[], dataRows: string[][]) => {
        const yearIndex = headerRow.findIndex(header => header === "Year");
        const sortedByYear = _(dataRows)
            .sortBy(row => row[yearIndex])
            .value();

        const lastYearInRows = sortedByYear.reduce((lastYear, row) => {
            const year = row[yearIndex];
            return year && year > lastYear ? year : lastYear;
        }, "");

        const financingSchemeIndex = headerRow.findIndex(header => header === "Financing scheme");

        const allDataRowsToSort = sortedByYear.filter(
            row => row[yearIndex] === lastYearInRows && row[financingSchemeIndex] === "Out-of-pocket payments"
        );
        const valueIndex = headerRow.findIndex(header => header === "Value");
        const typeOfCareIndex = headerRow.findIndex(header => header === "Type of care");

        const sortedTypesOfCare = _.orderBy(
            allDataRowsToSort,
            row => (!row[valueIndex] ? Infinity : Number(row[valueIndex])),
            ["asc"]
        ).map(row => row[typeOfCareIndex]);

        const missingTypesOfCare = TYPES_OF_CARE.filter(typeOfCare => !sortedTypesOfCare.includes(typeOfCare));
        const allSortedTypesOfCare = [...sortedTypesOfCare, ...missingTypesOfCare];

        const sortedDataRows = _.orderBy(
            dataRows,
            [
                row => row[yearIndex],
                row => allSortedTypesOfCare.indexOf(row[typeOfCareIndex]?.toString() || ""),
                row => SORTED_FINANCING_SCHEMES.indexOf(row[financingSchemeIndex]?.toString() || ""),
            ],
            ["asc", "asc", "asc"]
        );

        return sortedDataRows;
    },
};
