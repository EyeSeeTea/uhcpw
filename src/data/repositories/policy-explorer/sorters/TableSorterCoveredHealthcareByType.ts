import { PolicyExplorerCell, PolicyExplorerCellType } from "../../../../domain/entities/policy-explorer/PolicyExplorer";
import { KOSOVO } from "../../utils";
import { TableSorter } from "./TableSorter";

export class TableSorterCoveredHealthcareByType implements TableSorter {
    cleanAndSort(columns: PolicyExplorerCell[], rows: PolicyExplorerCell[][]): PolicyExplorerCell[][] {
        if (rows.length <= 1) return rows;

        const sortedDataRows = rows.sort((rowA, rowB) => {
            const countryA = this.getCountryFromRow(rowA);
            const countryB = this.getCountryFromRow(rowB);

            if (countryA === KOSOVO && countryB === KOSOVO) return 0;
            if (countryA === KOSOVO) return 1;
            if (countryB === KOSOVO) return -1;

            const rowAValueCount = rowA.filter(cell => cell.value !== "no").length;
            const rowBValueCount = rowB.filter(cell => cell.value !== "no").length;

            return rowAValueCount < rowBValueCount ? 1 : -1;
        });

        return this.filterColumnsWithNoData(columns, sortedDataRows);
    }

    private getCountryFromRow(row: PolicyExplorerCell[]): string {
        const firstCell = row[0];

        if (firstCell && firstCell.type === PolicyExplorerCellType.DATA) {
            return firstCell.value;
        }

        return "";
    }

    private filterColumnsWithNoData(columns: PolicyExplorerCell[], rows: PolicyExplorerCell[][]) {
        const indexesToRemove = columns.reduce((accIndexesToRemove: number[], _column, columnIndex) => {
            const hasRowsWithoutData = rows.every(row => row[columnIndex]?.value === "no");
            return hasRowsWithoutData ? [...accIndexesToRemove, columnIndex] : accIndexesToRemove;
        }, []);

        const filteredColumns = columns.filter((_column, index) => !indexesToRemove.includes(index));
        const filteredRows = rows.map(row => row.filter((_cell, index) => !indexesToRemove.includes(index)));

        return filteredColumns.length ? [filteredColumns, ...filteredRows] : [];
    }
}
