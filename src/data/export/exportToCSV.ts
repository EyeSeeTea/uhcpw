import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import XlsxPopulate from "@eyeseetea/xlsx-populate";
import {
    GENERAL_INFOMRATION_TAB_NAME,
    REFERENCES_TAB_NAME,
} from "../repositories/policy-explorer/PolicyExplorerD2Repository";
import {
    addDataValue,
    applyAutoWidthsToXlsxPopulateSheet,
    computeAutoColumnWidths,
    getCellStyles,
    getColumnLetterByIndex,
    hideEmptyColumn,
    LEGENDS_STYLE,
    setHeight,
    setWidth,
} from "./utils";
import { DATA_TAB_NAME, NOTES_TAB_NAME } from "../repositories/indicator-explorer/AnalyticsD2Repository";

const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const fileExtension = ".xlsx";

const COLUMN_LIMIT = "CZ";

export type Tab = {
    data: string[][];
    name: string;
    type?: "text" | "coverage" | "entitlements";
    legendsRow?: {
        legends: Array<{
            legend: Array<{
                text: string;
                styles?: {
                    fontColor?: string;
                    fontSize?: number;
                };
            }>;
        }>;
        height?: number;
    };
};

export type TabsWithStringOrNumbers = {
    data: (string | number | null)[][];
    name: string;
};

export const exportToCSV = (tabs: TabsWithStringOrNumbers[], fileName: string): void => {
    const tabsWithNumbers = parseDataTabNumbers(tabs);

    const xlsxTabs = tabsWithNumbers.map(tab => {
        const sheet = XLSX.utils.aoa_to_sheet(tab.data);
        if (tab.name === DATA_TAB_NAME) {
            // skipFirstRow: row 1 is the chart title
            sheet["!cols"] = computeAutoColumnWidths(tab.data, { skipFirstRow: true }).map(wch => ({ wch }));
        }
        return { ...tab, xlsx: sheet };
    });

    const Sheets = xlsxTabs.reduce((acc, tab) => ({ ...acc, [tab.name]: tab.xlsx }), {});
    const wb = {
        Sheets,
        SheetNames: tabsWithNumbers.map(tab => tab.name),
    };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
};

// Pivot output from pivotToCombinedMatrix: [Country, Abbreviation, Year, Abbreviation+Year, ...indicators].
// The first 4 are metadata; anything at or beyond this index is an indicator-data column.
const COMBINED_INDICATOR_DATA_COLUMN_START = 4;
const COMBINED_INDICATOR_DATA_COLUMN_WIDTH = 30;
const COMBINED_INDICATOR_HEADER_ROW_HEIGHT = 35;

export async function exportCombinedIndicatorsToXlsx(tabs: TabsWithStringOrNumbers[], fileName: string): Promise<void> {
    const tabsWithNumbers = parseDataTabNumbers(tabs);
    const workbook = await XlsxPopulate.fromBlankAsync();

    tabsWithNumbers.forEach((tab, tabIndex) => {
        const sheet = tabIndex === 0 ? workbook.sheet(0).name(tab.name) : workbook.addSheet(tab.name);
        addDataToSheet(sheet, tab.data);
        applyCombinedIndicatorStyles(sheet, tab);
    });

    const blob = await workbook.outputAsync();
    FileSaver.saveAs(new Blob([blob], { type: fileType }), fileName + fileExtension);
}

function applyCombinedIndicatorStyles(sheet: XlsxPopulate.Sheet, tab: TabsWithStringOrNumbers): void {
    const columnCount = tab.data.reduce((max, row) => Math.max(max, row.length), 0);
    if (tab.data.length > 0 && columnCount > 0) {
        const lastColumn = getColumnLetterByIndex(columnCount - 1);
        sheet.range(`A1:${lastColumn}${tab.data.length}`).style({ fontFamily: "Calibri", fontSize: 11 });
    }

    if (tab.name !== DATA_TAB_NAME) return;

    applyAutoWidthsToXlsxPopulateSheet(sheet, tab.data, {
        cappedFromIndex: COMBINED_INDICATOR_DATA_COLUMN_START,
        cappedMaxWidth: COMBINED_INDICATOR_DATA_COLUMN_WIDTH,
        skipFirstRow: true,
    });

    const headerRow = tab.data[1];
    if (!headerRow) return;

    const headerRowNumber = 2;
    sheet.row(headerRowNumber).height(COMBINED_INDICATOR_HEADER_ROW_HEIGHT);
    headerRow.forEach((_, columnIndex) => {
        if (columnIndex < COMBINED_INDICATOR_DATA_COLUMN_START) return;
        const cellRef = `${getColumnLetterByIndex(columnIndex)}${headerRowNumber}`;
        sheet.cell(cellRef).style({ wrapText: true });
    });
}

function parseDataTabNumbers(tabs: TabsWithStringOrNumbers[]): TabsWithStringOrNumbers[] {
    return tabs.map(tab => {
        if (tab.name !== DATA_TAB_NAME) return tab;
        return {
            ...tab,
            data: tab.data.map(row =>
                row.map(cell => (typeof cell === "string" ? parseDataValueFromStringToNumber(cell) : cell))
            ),
        };
    });
}

function parseDataValueFromStringToNumber(value: string): string | number {
    if (value === "") {
        return value;
    } else if (!isNaN(Number(value))) {
        return Number(value);
    } else {
        return value;
    }
}

export const exportToCSVWithStyles = async (tabs: Tab[], fileName: string) => {
    const workbook = await XlsxPopulate.fromBlankAsync();

    tabs.forEach(tab => {
        const sheet = workbook.addSheet(tab.name);

        const tabColor =
            tab.name === GENERAL_INFOMRATION_TAB_NAME || tab.name === REFERENCES_TAB_NAME ? "0089d6" : "d3e5f5";
        //@ts-ignore Not properly typed
        sheet.tabColor(tabColor);

        const legendsLength = tab.legendsRow?.legends.length ?? 0;
        const rowStart = legendsLength ? legendsLength + 1 : 1;
        if (legendsLength) {
            tab.legendsRow?.legends.forEach(({ legend }, index) => {
                const rowNumber = index + 1;
                sheet.row(rowNumber).height(tab.legendsRow?.height ?? LEGENDS_STYLE.height);
                const cellRef = `A${rowNumber}`;
                const legendRichText = legend.reduce(
                    (acc, legendItem) => acc.add(legendItem.text, legendItem.styles),
                    new RichText()
                );
                sheet
                    .cell(cellRef)
                    // value can accept RichText at runtime but it's not included in the TS typings
                    .value(legendRichText as any)
                    .style(LEGENDS_STYLE.cell);
            });
        }

        tab.data.forEach((row, rowIndex) => {
            const rowNumber = rowIndex + rowStart;
            row.forEach((cell, columnIndex) => {
                const column = getColumnLetterByIndex(columnIndex);
                const cellRef = `${column}${rowNumber}`;
                addDataValue({ sheet, value: cell, cellRef, tab, rowIndex, columnIndex });
                const cellStyle = getCellStyles(sheet, tab, rowIndex, columnIndex);
                sheet.cell(cellRef).style(cellStyle);
                setWidth(sheet, tab.name, columnIndex);
            });
        });
        setHeight(sheet, tab);
    });
    workbook.deleteSheet("Sheet1");

    const blob = await workbook.outputAsync();

    const data = new Blob([blob], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
};

const CHARTS_WITHOUT_COLUMN_LIMIT = ["kIpnMBaBvZ9", "mUjcWO90CRr", "fnOIi0bdISn", "eEKRLRR4mDk"];

export const exportToCSVIncludingChart = async (params: {
    chartId: string;
    tabs: TabsWithStringOrNumbers[];
    templateArrayBuffer: ArrayBuffer;
    fileName: string;
}) => {
    const { chartId, tabs, templateArrayBuffer, fileName } = params;

    const workbook = await XlsxPopulate.fromDataAsync(templateArrayBuffer);

    const chartSheet = workbook.sheet(DATA_TAB_NAME);
    const chartTab = tabs.find(tab => tab.name === DATA_TAB_NAME);
    if (chartTab) {
        addDataToSheet(chartSheet, chartTab.data);
        const columnLimit = !CHARTS_WITHOUT_COLUMN_LIMIT.includes(chartId) ? COLUMN_LIMIT : undefined;
        if (columnLimit) {
            hideEmptyColumn(chartSheet, columnLimit);
        }
    }

    const notesTab = tabs.find(tab => tab.name === NOTES_TAB_NAME);
    const notesSheet = workbook.sheet(NOTES_TAB_NAME);
    if (notesTab) {
        addDataToSheet(notesSheet, notesTab?.data);
    }

    const blob = await workbook.outputAsync();
    FileSaver.saveAs(new Blob([blob], { type: fileType }), fileName + fileExtension);
};

function addDataToSheet(sheet: XlsxPopulate.Sheet, data: TabsWithStringOrNumbers["data"]) {
    try {
        data.forEach((row, rowIndex) => {
            const rowNumber = rowIndex + 1;
            row.forEach((cell, columnIndex) => {
                const column = getColumnLetterByIndex(columnIndex);
                const cellRef = `${column}${rowNumber}`;
                sheet.cell(cellRef).value(cell);
            });
        });
    } catch (error) {
        console.error("Error adding data to sheet", error);
    }
}

// XlsxPopulate supports RichText values at runtime:
// https://github.com/EyeSeeTea/xlsx-populate#rich-texts
// However, the TypeScript definitions do not include RichText in the Cell.value() overloads.
// We cast here to bypass incomplete typings while preserving runtime behavior.
type RichTextInstance = {
    add(text: string, style?: Partial<any>): RichTextInstance;
};

const RichText = (
    XlsxPopulate as unknown as {
        RichText: new () => RichTextInstance;
    }
).RichText;
