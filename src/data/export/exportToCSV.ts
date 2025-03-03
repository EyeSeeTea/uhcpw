import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import XlsxPopulate from "@eyeseetea/xlsx-populate";
import {
    GENERAL_INFOMRATION_TAB_NAME,
    REFERENCES_TAB_NAME,
} from "../repositories/policy-explorer/PolicyExplorerD2Repository";
import { addDataValue, getCellStyles, setHeight, setWidth } from "./utils";
import {
    CHART_TAB_NAME,
    DATA_TAB_NAME,
    NOTES_TAB_NAME,
} from "../repositories/indicator-explorer/AnalyticsD2Repository";
import { columnLimitForDataChartById } from "./data-chart-builder/visualizationsExportedDataChartBuilder";

const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const fileExtension = ".xlsx";

export type Tab = {
    data: string[][];
    name: string;
};

export type TabsWithStringOrNumbers = {
    data: (string | number | null)[][];
    name: string;
};

export const exportToCSV = (tabs: Tab[], fileName: string) => {
    const tabsWithNumbers = tabs.map(tab => {
        if (tab.name === DATA_TAB_NAME) {
            return {
                ...tab,
                data: tab.data.map(row => row.map(cell => parseDataValueFromStringToNumber(cell))),
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

        tab.data.forEach((row, rowIndex) => {
            const rowNumber = rowIndex + 1;
            row.forEach((cell, columnIndex) => {
                const column = String.fromCharCode("A".charCodeAt(0) + columnIndex);
                const cellRef = `${column}${rowNumber}`;
                addDataValue(sheet, cell, cellRef);
                const cellStyle = getCellStyles(sheet, tab.name, rowIndex, columnIndex);
                sheet.cell(cellRef).style(cellStyle);
                setWidth(sheet, tab.name, columnIndex);
            });
        });
        setHeight(sheet, tab.data);
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

    const chartSheet = workbook.sheet(CHART_TAB_NAME);
    const chartTab = tabs.find(tab => tab.name === CHART_TAB_NAME);
    if (chartTab) {
        addDataToSheet(chartSheet, chartTab.data);
        const columnLimit =
            columnLimitForDataChartById && columnLimitForDataChartById[chartId]
                ? columnLimitForDataChartById[chartId]
                : undefined;
        if (columnLimit) {
            hideEmptyColumn(chartSheet, columnLimit);
        }
    }

    const notesTab = tabs.find(tab => tab.name === NOTES_TAB_NAME);
    const notesSheet = workbook.sheet(NOTES_TAB_NAME);
    if (notesTab) {
        addDataToSheet(notesSheet, notesTab?.data);
    }

    const dataTab = tabs.find(tab => tab.name === DATA_TAB_NAME);
    const dataSheet = workbook.sheet(DATA_TAB_NAME);
    if (dataTab) {
        addDataToSheet(dataSheet, dataTab?.data);
    }

    const blob = await workbook.outputAsync();
    FileSaver.saveAs(new Blob([blob], { type: fileType }), fileName + fileExtension);
};

function addDataToSheet(sheet: XlsxPopulate.Sheet, data: TabsWithStringOrNumbers["data"]) {
    try {
        data.forEach((row, rowIndex) => {
            const rowNumber = rowIndex + 1;
            row.forEach((cell, columnIndex) => {
                const column = getColumnLetter(columnIndex);
                const cellRef = `${column}${rowNumber}`;
                sheet.cell(cellRef).value(cell);
            });
        });
    } catch (error) {
        console.error("Error adding data to sheet", error);
    }
}

function getColumnLetter(columnIndex: number): string {
    return columnIndex >= 0
        ? getColumnLetter(Math.floor(columnIndex / 26) - 1) + String.fromCharCode((columnIndex % 26) + 65)
        : "";
}

function generateExcelColumnsUntilLimit(limit: string): string[] {
    const alphabet = [...Array(26)].map((_, i) => String.fromCharCode(65 + i)); // ["A" - "Z"]

    const columns = [
        ...alphabet,
        ...alphabet.flatMap(a => alphabet.map(b => a + b)), // ["AA" - "ZZ"]
    ];

    return columns.slice(0, columns.indexOf(limit) + 1);
}

function hideEmptyColumn(sheet: XlsxPopulate.Sheet, columnLimit: string) {
    generateExcelColumnsUntilLimit(columnLimit).forEach(columnLetter => {
        const columnValues: TabsWithStringOrNumbers["data"] = sheet.range(`${columnLetter}1:${columnLetter}7`).value();
        const columnIsEmpty = columnValues.every((value: (string | number | null)[]) =>
            value.every(cell => cell === "" || cell === undefined || cell === null)
        );
        if (columnIsEmpty) {
            sheet.column(columnLetter).hidden(true);
        }
    });
}
