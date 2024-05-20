import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import XlsxPopulate from "@eyeseetea/xlsx-populate";

const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const fileExtension = ".xlsx";

export type Tab = {
    data: string[][];
    name: string;
};

export const exportToCSV = (tabs: Tab[], fileName: string) => {
    const xlsxTabs = tabs.map(tab => ({
        ...tab,
        xlsx: XLSX.utils.aoa_to_sheet(tab.data),
    }));
    const Sheets = xlsxTabs.reduce((acc, tab) => ({ ...acc, [tab.name]: tab.xlsx }), {});
    const wb = {
        Sheets,
        SheetNames: tabs.map(tab => tab.name),
    };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
};

export const exportToCSVWithStyles = async (tabs: Tab[], fileName: string) => {
    const workbook = await XlsxPopulate.fromBlankAsync();

    tabs.forEach(tab => {
        const sheet = workbook.addSheet(tab.name);
        tab.data.forEach((row, rowIndex) => {
            const rowNumber = rowIndex + 1;
            row.forEach((cell, columnIndex) => {
                const column = String.fromCharCode("A".charCodeAt(0) + columnIndex);
                const cellRef = `${column}${rowNumber}`;

                if (cellRef === "A1") {
                    const cellStyle = {
                        fontSize: 16,
                        fontFamily: "Calibri",
                        bold: true,
                        fill: {
                            type: "solid",
                            color: "FFFFFF",
                        },
                        fontColor: "0089d6",
                    };
                    sheet.cell(cellRef).value(cell).style(cellStyle);
                } else {
                    const cellStyle = {
                        verticalAlignment: "top",
                        fill: {
                            type: "solid",
                            color: rowIndex === 1 || columnIndex === 0 ? "d3e5f5" : "f4f8fc",
                        },
                        fontFamily: "Calibri",
                        fontSize: 11,
                        fontColor: "000000",
                        bold: rowIndex === 1 && columnIndex !== 0,
                    };
                    sheet.cell(cellRef).value(cell).style(cellStyle);
                }
            });
        });
    });
    workbook.deleteSheet("Sheet1");

    const blob = await workbook.outputAsync();

    const data = new Blob([blob], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
};
