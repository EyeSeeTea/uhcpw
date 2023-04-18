import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";

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
