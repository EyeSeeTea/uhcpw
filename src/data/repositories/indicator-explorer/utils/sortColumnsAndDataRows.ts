import _ from "lodash";

export const INDICATOR_COLUMN = "Indicator";
export const PARAMETER_COLUMN = "Parameter";
export const COUNTRY_AREA_COLUMN = "Country / Area";
export const YEAR_COLUMN = "Year";

export function sortColumnsRowByColumnsOrder(headerRow: string[], columnsOrder: string[]): string[] {
    const sortedHeader = _.sortBy(headerRow, header => {
        const index = columnsOrder.indexOf(header);
        return index === -1 ? Infinity : index;
    });

    return sortedHeader;
}

export function sortDataRowsByParameterOrder(
    headerRow: string[],
    dataRows: string[][],
    parameterOrder: string[]
): string[][] {
    const yearIndex = headerRow.findIndex(header => header === YEAR_COLUMN);
    const countryIndex = headerRow.findIndex(header => header === COUNTRY_AREA_COLUMN);
    const indicatorIndex = headerRow.findIndex(header => header === INDICATOR_COLUMN);

    const sortedDataRows = _.orderBy(
        dataRows,
        [
            row => row[yearIndex],
            row => row[countryIndex],
            row => parameterOrder.indexOf(row[indicatorIndex]?.toString() || ""),
        ],
        ["asc", "asc", "asc"]
    );
    return sortedDataRows;
}
