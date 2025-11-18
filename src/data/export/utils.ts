import XlsxPopulate, { Sheet } from "@eyeseetea/xlsx-populate";
import {
    DATE_OF_DOWNLOAD,
    GENERAL_INFOMRATION_TAB_NAME,
    PERIOD_HEADER_NAME,
    REFERENCES_TAB_NAME,
    categoriesNameWithLessThan31Chars,
} from "../repositories/policy-explorer/PolicyExplorerD2Repository";
import { TYPE_OF_HEALTH_CARE_HEADER_NAME } from "../repositories/policy-explorer/builders/TableBuilderByTypeOfHealthcare";
import { Tab, TabsWithStringOrNumbers } from "./exportToCSV";

const DEFAULT_HEIGHT = 30;

const COLUMN_WIDTHS = {
    firstColumn: 40,
    yearColumn: 8,
    monthColumn: 16,
    typeOfHealthCareColumnOrAreaOfChange: 40,
    userChargesApplyColumn: 25,
    referencesColumn: 250,
    default: 60,
};

const USER_CHARGES_BY_HEALTH_CARE_COLUMN_WIDTHS = {
    firstColumn: 20,
    typeOfHealthCareColumnOrUserChargesApplyColumn: 20,
    default: 40,
};

const CELL_STYLES = {
    tabTitleCell: {
        wrapText: false,
        fontSize: 16,
        fontFamily: "Calibri",
        bold: true,
        fill: {
            type: "solid",
            color: "FFFFFF",
        },
        fontColor: "0089d6",
    },
    dataCell: {
        wrapText: true,
        verticalAlignment: "top",
        fill: {
            type: "solid",
            color: "f4f8fc",
        },
        fontFamily: "Calibri",
        fontSize: 11,
        fontColor: "000000",
        bold: false,
        border: true,
        borderColor: "FFFFFF",
        borderStyle: "thick",
    },
    headerCell: {
        wrapText: true,
        verticalAlignment: "top",
        fill: {
            type: "solid",
            color: "d3e5f5",
        },
        fontFamily: "Calibri",
        fontSize: 11,
        fontColor: "000000",
        bold: true,
        border: true,
        borderColor: "FFFFFF",
        borderStyle: "thick",
    },
    downloadDateCell: {
        wrapText: true,
        verticalAlignment: "top",
        fill: {
            type: "solid",
            color: "FFFFFF",
        },
        fontFamily: "Calibri",
        fontSize: 9,
        fontColor: "0089d6",
        bold: false,
        border: true,
        borderColor: "FFFFFF",
        borderStyle: "thick",
    },
};

const healthcareTypeToColor: Record<string, string> = {
    "Primary care visits": "f6f000",
    "Outpatient specialist visits": "ffc000",
    "Emergency care": "c78f3d",
    "Outpatient prescribed medicines": "c00000",
    "Medical products": "ed7d31",
    "Diagnostics tests": "7030a0",
    "Dental care visits": "00b0f0",
    "Dental care treatment": "0070c0",
    "Inpatient care": "00b050",
    "Inpatient medicines": "385724",
};

export function addDataValue(sheet: Sheet, value: string, cellRef: string) {
    //@ts-ignore Not properly typed
    const richText = new XlsxPopulate.RichText();
    richText.add(value);
    sheet.cell(cellRef).value(value);
}

export function getColumnLetterByIndex(columnIndex: number): string {
    // Convert it to a letter representation (A, B, C, ..., Z, AA, AB, ..., AZ, BA, ..., ZZ, AAA, ...)
    const toLetters = (index: number): string =>
        index < 26
            ? String.fromCharCode(65 + index)
            : toLetters(Math.floor(index / 26) - 1) + String.fromCharCode(65 + (index % 26));

    return toLetters(columnIndex);
}

export function getColumnIndexByLetter(columnLetter: string): number {
    return (
        columnLetter
            .toUpperCase()
            .split("")
            .reduce((acc, char) => acc * 26 + (char.charCodeAt(0) - 64), 0) - 1
    );
}

export function generateColumnLettersUntilLimit(limitLetter: string): string[] {
    const maxIndex = getColumnIndexByLetter(limitLetter);
    return Array.from({ length: maxIndex + 1 }, (_, i) => getColumnLetterByIndex(i));
}

export function hideEmptyColumn(sheet: XlsxPopulate.Sheet, columnLimit: string) {
    generateColumnLettersUntilLimit(columnLimit).forEach(columnLetter => {
        const columnValues: TabsWithStringOrNumbers["data"] = sheet.range(`${columnLetter}1:${columnLetter}7`).value();
        const columnIsEmpty = columnValues.every((value: (string | number | null)[]) =>
            value.every(cell => cell === "" || cell === undefined || cell === null)
        );
        if (columnIsEmpty) {
            sheet.column(columnLetter).hidden(true);
        }
    });
}

export function getCellStyles(sheet: Sheet, tab: Tab, rowDataIndex: number, columnDataIndex: number) {
    const rowNumber = rowDataIndex + 1;
    const column = getColumnLetterByIndex(columnDataIndex);
    const cellRef = `${column}${rowNumber}`;
    const tabName = tab.name;

    const isDownloadDateCell =
        tabName === GENERAL_INFOMRATION_TAB_NAME && sheet.cell(cellRef).value()?.toString()?.includes(DATE_OF_DOWNLOAD);
    const isTypeOfHealthCareColumn =
        tabName === categoriesNameWithLessThan31Chars.u800TAhsIBY &&
        sheet.cell(`${column}2`).value()?.toString()?.includes(TYPE_OF_HEALTH_CARE_HEADER_NAME);

    if (columnDataIndex === 0 && rowDataIndex === 0) {
        return CELL_STYLES.tabTitleCell;
    }

    if (isDownloadDateCell) {
        return CELL_STYLES.downloadDateCell;
    }

    if (rowDataIndex === 1 || columnDataIndex === 0) {
        return {
            ...CELL_STYLES.headerCell,
            bold:
                rowDataIndex === 1 ||
                tabName === REFERENCES_TAB_NAME ||
                tabName === categoriesNameWithLessThan31Chars.Dg4b8bTfEIr ||
                tabName === categoriesNameWithLessThan31Chars.u800TAhsIBY,
            fill: {
                ...CELL_STYLES.headerCell.fill,
                color:
                    rowDataIndex !== 1 &&
                    (tabName === categoriesNameWithLessThan31Chars.Dg4b8bTfEIr ||
                        tabName === categoriesNameWithLessThan31Chars.u800TAhsIBY ||
                        tabName === REFERENCES_TAB_NAME)
                        ? CELL_STYLES.dataCell.fill.color
                        : CELL_STYLES.headerCell.fill.color,
            },
        };
    }

    return {
        ...CELL_STYLES.dataCell,
        fontColor: getFontColor(tab, columnDataIndex) || CELL_STYLES.dataCell.fontColor,
        fill: {
            ...CELL_STYLES.dataCell.fill,
            color: isTypeOfHealthCareColumn ? CELL_STYLES.headerCell.fill.color : CELL_STYLES.dataCell.fill.color,
        },
    };
}

function getFontColor(tab: Tab, columnIndex: number) {
    if (tab.type === "coverage") {
        const header = tab.data[1]?.[columnIndex];
        return header && healthcareTypeToColor[header];
    }
    return undefined;
}

function getRowHeight(cellsInRow: string[]): number {
    const totalLinesInCells = cellsInRow.map(cell => cell.split(/\r?\n/).length);
    return DEFAULT_HEIGHT * Math.max(...totalLinesInCells);
}

export function setHeight(sheet: Sheet, data: string[][]) {
    const rowHeights = data.map(row => {
        return row ? getRowHeight(row) : 0;
    });

    data.forEach((_, rowIndex) => {
        sheet.row(rowIndex + 1).height(rowHeights[rowIndex] || 1);
    });
}

function getColumnWidth(sheet: Sheet, tabName: string, columnDataIndex: number): number {
    if (columnDataIndex === 0) {
        return categoriesNameWithLessThan31Chars.u800TAhsIBY
            ? USER_CHARGES_BY_HEALTH_CARE_COLUMN_WIDTHS.firstColumn
            : COLUMN_WIDTHS.firstColumn;
    }

    if (tabName === REFERENCES_TAB_NAME && columnDataIndex === 1) {
        return COLUMN_WIDTHS.referencesColumn;
    }

    const column = getColumnLetterByIndex(columnDataIndex);
    const headerColumnValue = sheet.cell(`${column}2`).value();

    if (headerColumnValue === PERIOD_HEADER_NAME) {
        return COLUMN_WIDTHS.yearColumn;
    }

    if (tabName === categoriesNameWithLessThan31Chars.Dg4b8bTfEIr && !headerColumnValue) {
        return COLUMN_WIDTHS.monthColumn;
    }

    if (tabName === categoriesNameWithLessThan31Chars.Dg4b8bTfEIr && headerColumnValue === "Area of change") {
        return COLUMN_WIDTHS.typeOfHealthCareColumnOrAreaOfChange;
    }

    if (
        tabName === categoriesNameWithLessThan31Chars.u800TAhsIBY &&
        (headerColumnValue === "User charges apply" || headerColumnValue === TYPE_OF_HEALTH_CARE_HEADER_NAME)
    ) {
        return USER_CHARGES_BY_HEALTH_CARE_COLUMN_WIDTHS.typeOfHealthCareColumnOrUserChargesApplyColumn;
    }

    switch (tabName) {
        case categoriesNameWithLessThan31Chars.u800TAhsIBY:
            return USER_CHARGES_BY_HEALTH_CARE_COLUMN_WIDTHS.default;
        case categoriesNameWithLessThan31Chars.u800TAhsIBY_Cat:
            return USER_CHARGES_BY_HEALTH_CARE_COLUMN_WIDTHS.typeOfHealthCareColumnOrUserChargesApplyColumn;
        default:
            return COLUMN_WIDTHS.default;
    }
}

export function setWidth(sheet: Sheet, tabName: string, columnDataIndex: number) {
    const width = getColumnWidth(sheet, tabName, columnDataIndex);
    sheet.column(columnDataIndex + 1).width(width);
}

export function parseDataValuesStringToNumber(data: string[][], valueIndex: number): TabsWithStringOrNumbers["data"] {
    return data.map((row, rowNumber) => {
        const value = row[valueIndex];
        if (!value || rowNumber === 0 || rowNumber === 1) {
            return row;
        }

        return [...row.slice(0, valueIndex), Number(value.replace(",", ".")), ...row.slice(valueIndex + 1)];
    });
}
