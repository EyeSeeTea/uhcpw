import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import XlsxPopulate from "@eyeseetea/xlsx-populate";
import {
    GENERAL_INFOMRATION_TAB_NAME,
    REFERENCES_TAB_NAME,
} from "../repositories/policy-explorer/PolicyExplorerD2Repository";
import { addDataValue, getCellStyles, setHeight, setWidth } from "./utils";
import { DATA_TAB_NAME } from "../repositories/indicator-explorer/AnalyticsD2Repository";

const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const fileExtension = ".xlsx";

export type Tab = {
    data: string[][];
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

export const exportToCSVTest = async (arrayBuffer: ArrayBuffer) => {
    const workbook = await XlsxPopulate.fromDataAsync(arrayBuffer);

    const dataSheet = workbook.sheet("Chart");

    const data = [
        [
            "Quintile - Year",
            "Medicines",
            "Outpatient care",
            "Diagnostic tests",
            "Medical products",
            "Inpatient care",
            "Dental care",
        ],
        ["2nd - 2006", 21.7, 7.2, 4.1, 26.4, 0.47, 40.2],
        ["3rd - 2006", 20.4, 6.8, 4.0, 26.9, 2.1, 39.9],
        ["4th - 2006", 18.0, 9.0, 3.5, 24.6, 3.6, 41.3],
        ["2nd - 2007", 23.7, 7.8, 2.7, 28.1, 0.91, 36.8],
        ["3rd - 2007", 22.5, 5.9, 2.9, 29.3, 0.82, 38.6],
        ["4th - 2007", 17.7, 7.7, 4.4, 25.9, 3.1, 43.0],
        ["2nd - 2008", 22.8, 7.6, 3.8, 27.7, 1.8, 36.2],
        ["3rd - 2008", 23.2, 6.3, 3.7, 26.1, 1.1, 39.1],
        ["4th - 2008", 19.2, 6.3, 3.8, 25.1, 2.3, 43.3],
        ["2nd - 2009", 24.7, 5.8, 5.1, 28.9, 0.58, 34.9],
        ["3rd - 2009", 21.0, 5.9, 3.7, 25.9, 3.1, 40.5],
        ["4th - 2009", 19.6, 5.3, 5.0, 25.9, 3.1, 41.0],
    ];

    data.forEach((row, rowIndex) => {
        const rowNumber = rowIndex + 1;
        row.forEach((cell, columnIndex) => {
            const column = String.fromCharCode("A".charCodeAt(0) + columnIndex);
            const cellRef = `${column}${rowNumber}`;
            dataSheet.cell(cellRef).value(cell);
        });
    });

    const blob = await workbook.outputAsync();
    FileSaver.saveAs(new Blob([blob], { type: fileType }), "test_chart" + fileExtension);
};
