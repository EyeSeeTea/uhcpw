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
