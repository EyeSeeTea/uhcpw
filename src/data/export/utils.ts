import XlsxPopulate, { Sheet } from "@eyeseetea/xlsx-populate";
import {
    DATE_OF_DOWNLOAD,
    GENERAL_INFOMRATION_TAB_NAME,
    PERIOD_HEADER_NAME,
    REFERENCES_TAB_NAME,
    categoriesNameWithLessThan31Chars,
} from "../repositories/policy-explorer/PolicyExplorerD2Repository";
import { TYPE_OF_HEALTH_CARE_HEADER_NAME } from "../repositories/policy-explorer/builders/TableBuilderByTypeOfHealthcare";

const DEFAULT_HEIGHT = 30;

const COLUMN_WIDTHS = {
    firstColumn: 30,
    yearColumn: 8,
    typeOfHealthCareColumnOrAreaOfChange: 35,
    userChargesApplyColumn: 25,
    referencesColumn: 250,
    default: 60,
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
                rowDataIndex === 1 ||
                tabName === REFERENCES_TAB_NAME ||
                tabName === categoriesNameWithLessThan31Chars.CHANGES_IN_COVERAGE_POLICY_MERGED_CATEGORIES_ID ||
                tabName === categoriesNameWithLessThan31Chars.u800TAhsIBY,
            fill: {
                ...CELL_STYLES.headerCell.fill,
                color:
                    rowDataIndex !== 1 &&
                    (tabName === categoriesNameWithLessThan31Chars.CHANGES_IN_COVERAGE_POLICY_MERGED_CATEGORIES_ID ||
                        tabName === categoriesNameWithLessThan31Chars.u800TAhsIBY ||
                        tabName === REFERENCES_TAB_NAME)
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
        return COLUMN_WIDTHS.firstColumn;
    }

    if (tabName === REFERENCES_TAB_NAME && columnDataIndex === 1) {
        return COLUMN_WIDTHS.referencesColumn;
    }

    const column = String.fromCharCode("A".charCodeAt(0) + columnDataIndex);
    const headerColumnValue = sheet.cell(`${column}2`).value();

    if (
        headerColumnValue === PERIOD_HEADER_NAME ||
        (tabName === categoriesNameWithLessThan31Chars.CHANGES_IN_COVERAGE_POLICY_MERGED_CATEGORIES_ID &&
            !headerColumnValue)
    ) {
        return COLUMN_WIDTHS.yearColumn;
    }

    if (
        tabName === categoriesNameWithLessThan31Chars.CHANGES_IN_COVERAGE_POLICY_MERGED_CATEGORIES_ID &&
        headerColumnValue === "Area of change"
    ) {
        return COLUMN_WIDTHS.typeOfHealthCareColumnOrAreaOfChange;
    }

    if (
        tabName === categoriesNameWithLessThan31Chars.u800TAhsIBY &&
        headerColumnValue === TYPE_OF_HEALTH_CARE_HEADER_NAME
    ) {
        return COLUMN_WIDTHS.typeOfHealthCareColumnOrAreaOfChange;
    }

    if (tabName === categoriesNameWithLessThan31Chars.u800TAhsIBY && headerColumnValue === "User charges apply") {
        return COLUMN_WIDTHS.typeOfHealthCareColumnOrAreaOfChange;
    }

    return COLUMN_WIDTHS.default;
}

export function setWidth(sheet: Sheet, tabName: string, columnDataIndex: number) {
    const width = getColumnWidth(sheet, tabName, columnDataIndex);
    sheet.column(columnDataIndex + 1).width(width);
}
