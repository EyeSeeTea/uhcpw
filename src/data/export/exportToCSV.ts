import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import XlsxPopulate from "@eyeseetea/xlsx-populate";
import {
    GENERAL_INFOMRATION_TAB_NAME,
    REFERENCES_TAB_NAME,
} from "../repositories/policy-explorer/PolicyExplorerD2Repository";
import {
    addDataValue,
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

export const exportToCSV = (tabs: TabsWithStringOrNumbers[], fileName: string) => {
    const tabsWithNumbers = tabs.map(tab => {
        if (tab.name === DATA_TAB_NAME) {
            return {
                ...tab,
                data: tab.data.map(row =>
                    row.map(cell => (typeof cell === "string" ? parseDataValueFromStringToNumber(cell) : cell))
                ),
            };
        } else {
            return tab;
        }
    });

    const xlsxTabs = tabsWithNumbers.map(tab => ({
        ...tab,
        xlsx: XLSX.utils.aoa_to_sheet(tab.data),
    }));

    const Sheets = xlsxTabs.reduce((acc, tab) => ({ ...acc, [tab.name]: tab.xlsx }), {});
    const wb = {
        Sheets,
        SheetNames: tabsWithNumbers.map(tab => tab.name),
    };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
};

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
        const columnLimit = chartId !== "kIpnMBaBvZ9" ? COLUMN_LIMIT : undefined;
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
