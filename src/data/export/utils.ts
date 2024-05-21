import XlsxPopulate, { Sheet } from "@eyeseetea/xlsx-populate";
import {
    DATE_OF_DOWNLOAD,
    GENERAL_INFOMRATION_TAB_NAME,
    REFERENCES_TAB_NAME,
    categoriesNameWithLessThan31Chars,
} from "../repositories/policy-explorer/PolicyExplorerD2Repository";
import { TYPE_OF_HEALTH_CARE_HEADER_NAME } from "../repositories/policy-explorer/builders/TableBuilderByTypeOfHealthcare";

const DEFAULT_CHAR_SIZE = 1.5;
const DEFAULT_HEIGHT = 30;

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

export function addDataValue(sheet: Sheet, value: string, cellRef: string) {
    //@ts-ignore Not properly typed
    const richText = new XlsxPopulate.RichText();
    richText.add(value);
    sheet.cell(cellRef).value(value);
}

export function getCellStyles(sheet: Sheet, tabName: string, rowDataIndex: number, columnDataIndex: number) {
    const rowNumber = rowDataIndex + 1;
    const column = String.fromCharCode("A".charCodeAt(0) + columnDataIndex);
    const cellRef = `${column}${rowNumber}`;

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
                columnDataIndex !== 0 ||
                tabName === GENERAL_INFOMRATION_TAB_NAME ||
                tabName === REFERENCES_TAB_NAME ||
                tabName === categoriesNameWithLessThan31Chars.CHANGES_IN_COVERAGE_POLICY_MERGED_CATEGORIES_ID ||
                tabName === categoriesNameWithLessThan31Chars.u800TAhsIBY,
            fill: {
                ...CELL_STYLES.headerCell.fill,
                color:
                    rowDataIndex !== 1 &&
                    (tabName === categoriesNameWithLessThan31Chars.CHANGES_IN_COVERAGE_POLICY_MERGED_CATEGORIES_ID ||
                        tabName === categoriesNameWithLessThan31Chars.u800TAhsIBY)
                        ? CELL_STYLES.dataCell.fill.color
                        : CELL_STYLES.headerCell.fill.color,
            },
        };
    }

    return {
        ...CELL_STYLES.dataCell,
        fill: {
            ...CELL_STYLES.dataCell.fill,
            color: isTypeOfHealthCareColumn ? CELL_STYLES.headerCell.fill.color : CELL_STYLES.dataCell.fill.color,
        },
    };
}

function getMaxLineWidth(string: string): number {
    const lines = string.split(/\r?\n/);
    const sizeByLine = lines.map(line => line.length * DEFAULT_CHAR_SIZE);
    return Math.max(...sizeByLine);
}

function getColumnWidth(cellsInColumn: string[], isFirstColumn: boolean): number {
    const widthByCell = cellsInColumn.map(cell => getMaxLineWidth(cell));
    return isFirstColumn ? 50 : Math.max(...widthByCell);
}

function getRowHeight(cellsInRow: string[]): number {
    const totalLinesInCells = cellsInRow.map(cell => cell.split(/\r?\n/).length);
    return DEFAULT_HEIGHT * Math.max(...totalLinesInCells);
}

function getCellSizes(data: string[][]): {
    columnWidths: number[];
    rowHeights: number[];
} {
    const totalColumns = data[1]?.length || 0;
    const columnWidths = Array.from({ length: totalColumns }, (_, columnIndex) => {
        const cellsInColumn = data.map(row => row[columnIndex] || "");
        return getColumnWidth(cellsInColumn, columnIndex === 0);
    });

    const rowHeights = data.map(row => {
        return row ? getRowHeight(row) : 0;
    });

    return {
        columnWidths,
        rowHeights,
    };
}

export function setSizes(sheet: Sheet, data: string[][]) {
    const sizes = getCellSizes(data);

    data.forEach((_, rowIndex) => {
        sheet.row(rowIndex + 1).height(sizes.rowHeights[rowIndex] || 1);
    });

    const columnCount = data[1]?.length || 0;
    Array.from({ length: columnCount }).forEach((_, columnIndex) => {
        sheet.column(columnIndex + 1).width(sizes.columnWidths[columnIndex] || 1);
    });
}
