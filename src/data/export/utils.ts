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
    icon: 5,
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

const CENTER_ALIGNMENT = {
    horizontalAlignment: "center",
    verticalAlignment: "center",
};

export const LEGENDS_STYLE = {
    cell: {
        wrapText: false,
        verticalAlignment: "center",
    },
    height: 20,
} as const;

const healthcareTypeToColor: Record<string, string> = {
    "Primary care visits": "f6f000",
    "Outpatient specialist visits": "ffc000",
    "Emergency care": "c78f3d",
    "Outpatient medicines": "c00000",
    "Medical products": "ed7d31",
    "Diagnostics tests": "7030a0",
    "Dental care visits": "00b0f0",
    "Dental care treatment": "0070c0",
    "Inpatient care": "00b050",
    "Inpatient medicines": "385724",
};

export function addDataValue(params: {
    sheet: Sheet;
    value: string | number;
    cellRef: string;
    tab: Tab;
    rowIndex: number;
    columnIndex: number;
}) {
    const { sheet, value, cellRef, tab, rowIndex, columnIndex } = params;
    const isSpecialTable = !!tab.type && ["coverage", "entitlements"].includes(tab.type);
    const isRotatedHeader = isSpecialTable && rowIndex === 1 && columnIndex > 0;

    const stringValue = value?.toString?.() ?? "";
    const finalValue = isRotatedHeader ? `  ${stringValue}` : stringValue;

    sheet.cell(cellRef).value(finalValue);
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

export function generateRowNumbersUntilLimit(limit: number): number[] {
    return Array.from({ length: limit + 1 }, (_, i) => i + 1);
}

export function hideEmptyColumn(sheet: XlsxPopulate.Sheet, columnLimit: string, columnIndexToNotHide?: number) {
    generateColumnLettersUntilLimit(columnLimit).forEach(columnLetter => {
        const columnValues: TabsWithStringOrNumbers["data"] = sheet.range(`${columnLetter}1:${columnLetter}7`).value();
        const columnIsEmpty = columnValues.every((value: (string | number | null)[]) =>
            value.every(cell => cell === "" || cell === undefined || cell === null)
        );
        const columnLetterNotToHide = columnIndexToNotHide ? getColumnLetterByIndex(columnIndexToNotHide) : null;

        if (columnIsEmpty && columnLetter !== columnLetterNotToHide) {
            sheet.column(columnLetter).hidden(true);
        }
    });
}

export function hideEmptyRows(sheet: XlsxPopulate.Sheet, rowLimit: number) {
    generateRowNumbersUntilLimit(rowLimit).forEach(rowNumber => {
        const cellValue = sheet.cell(`A${rowNumber}`).value();
        if (cellValue === "" || cellValue === undefined || cellValue === null) {
            sheet.row(rowNumber).hidden(true);
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
            ...getTabSpecificCellStyles(tab, rowDataIndex, columnDataIndex),
        };
    }

    return {
        ...CELL_STYLES.dataCell,
        fill: {
            ...CELL_STYLES.dataCell.fill,
            color: isTypeOfHealthCareColumn ? CELL_STYLES.headerCell.fill.color : CELL_STYLES.dataCell.fill.color,
        },
        ...getTabSpecificCellStyles(tab, rowDataIndex, columnDataIndex),
    };
}

function getTabSpecificCellStyles(tab: Tab, rowIndex: number, columnIndex: number) {
    if (tab.type && ["coverage", "entitlements"].includes(tab.type) && rowIndex === 1 && columnIndex > 0) {
        return {
            horizontalAlignment: "center",
            verticalAlignment: "bottom",
            textRotation: 90,
        };
    }

    const isCategoryColumn = columnIndex === 0;

    switch (tab.type) {
        case "coverage": {
            const healthCareType = tab.data[rowIndex]?.[0];
            const fontColor = !isCategoryColumn ? healthCareType && healthcareTypeToColor[healthCareType] : undefined;

            const data = tab.data[rowIndex]?.[columnIndex];
            const fontSize = data === "◐" ? 13 : data === "🅧" ? 12 : 11;

            return {
                ...CENTER_ALIGNMENT,
                ...(isCategoryColumn
                    ? {
                          horizontalAlignment: "left",
                          verticalAlignment: "center",
                          indent: 1,
                      }
                    : undefined),
                ...(fontColor ? { fontColor } : undefined),
                ...(fontSize ? { fontSize } : undefined),
            };
        }
        case "entitlements": {
            const data = tab.data[rowIndex]?.[columnIndex];
            const fontSize = data === "◐" ? 13 : data === "🅧" ? 12 : 11;

            return {
                ...CENTER_ALIGNMENT,
                fontColor: !isCategoryColumn ? "0460a7" : undefined,
                ...(isCategoryColumn
                    ? {
                          horizontalAlignment: "left",
                          verticalAlignment: "center",
                          indent: 1,
                      }
                    : undefined),
                ...(fontSize ? { fontSize } : undefined),
            };
        }
    }
    return undefined;
}

function getRowHeight(cellsInRow: string[]): number {
    const totalLinesInCells = cellsInRow.map(cell => cell.split(/\r?\n/).length);
    return DEFAULT_HEIGHT * Math.max(...totalLinesInCells);
}

export function setHeight(sheet: Sheet, tab: Tab) {
    const data = tab.data;
    const rowHeights = data.map(row => {
        return row ? getRowHeight(row) : 0;
    });
    const startRow = tab.legendsRow ? tab.legendsRow.legends.length + 1 : 1;
    data.forEach((_, rowIndex) => {
        sheet.row(rowIndex + startRow).height(rowHeights[rowIndex] || 1);
    });
    setTabSpecificRowHeight(sheet, tab, startRow);
}

function setTabSpecificRowHeight(sheet: Sheet, tab: Tab, row: number) {
    if (tab.type && ["coverage", "entitlements"].includes(tab.type)) {
        sheet.row(row + 1).height(DEFAULT_HEIGHT * 2.5);
    }
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
            return COLUMN_WIDTHS.icon;
        case categoriesNameWithLessThan31Chars.Nx6S3aQkvWe:
            return COLUMN_WIDTHS.icon;
        default:
            return COLUMN_WIDTHS.default;
    }
}

export function setWidth(sheet: Sheet, tabName: string, columnDataIndex: number) {
    const width = getColumnWidth(sheet, tabName, columnDataIndex);
    sheet.column(columnDataIndex + 1).width(width);
}

type AutoWidthOptions = {
    readonly minWidth?: number;
    readonly cappedFromIndex?: number;
    readonly cappedMaxWidth?: number;
    readonly skipFirstRow?: boolean;
};

const DEFAULT_AUTO_WIDTH_MIN = 8;
// Excel width units are based on the "0" glyph; most letters render narrower, so scaling the
// longest-content character count by 0.9 gives a better fit with the default font (Calibri 11).
const CHAR_TO_WIDTH_MULTIPLIER = 0.9;

export function computeAutoColumnWidths(
    rows: ReadonlyArray<ReadonlyArray<string | number | null | undefined>>,
    options: AutoWidthOptions = {}
): number[] {
    const { minWidth = DEFAULT_AUTO_WIDTH_MIN, cappedFromIndex, cappedMaxWidth, skipFirstRow } = options;

    const measuredRows = skipFirstRow ? rows.slice(1) : rows;
    const columnCount = measuredRows.reduce((max, row) => Math.max(max, row.length), 0);

    return Array.from({ length: columnCount }, (_, col) => {
        const longest = measuredRows.reduce((max, row) => {
            const cell = row[col];
            const text = cell === null || cell === undefined ? "" : String(cell);
            return Math.max(max, text.length);
        }, 0);
        const scaled = longest * CHAR_TO_WIDTH_MULTIPLIER;
        const cap = cappedFromIndex !== undefined && col >= cappedFromIndex ? cappedMaxWidth : undefined;
        const widthWithMin = Math.max(scaled, minWidth);
        return cap !== undefined ? Math.min(widthWithMin, cap) : widthWithMin;
    });
}

export function applyAutoWidthsToXlsxPopulateSheet(
    sheet: Sheet,
    rows: ReadonlyArray<ReadonlyArray<string | number | null | undefined>>,
    options?: AutoWidthOptions
): void {
    const widths = computeAutoColumnWidths(rows, options);
    widths.forEach((width, index) => {
        sheet.column(index + 1).width(width);
    });
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
