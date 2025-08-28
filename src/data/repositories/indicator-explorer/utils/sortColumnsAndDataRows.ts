import _ from "lodash";

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
    const yearIndex = headerRow.findIndex(header => header === "Year");

    const countryIndex = headerRow.findIndex(header => header === "Country / Area");
    const parameterIndex = headerRow.findIndex(header => header === "Parameter");

    const sortedDataRows = _.orderBy(
        dataRows,
        [
            row => row[yearIndex],
            row => row[countryIndex],
            row => parameterOrder.indexOf(row[parameterIndex]?.toString() || ""),
        ],
        ["asc", "asc", "asc"]
    );
    return sortedDataRows;
}
