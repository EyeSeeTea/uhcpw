import { PolicyExplorerCell, PolicyExplorerCellType } from "../../../../domain/entities/policy-explorer/PolicyExplorer";
import { TableSorter } from "./TableSorter";

export class TableSorterByValueCount implements TableSorter {
    constructor(private emptyValue = "") {}
    cleanAndSort(columns: PolicyExplorerCell[], rows: PolicyExplorerCell[][]): PolicyExplorerCell[][] {
        const sortedDataRows = rows.sort((rowA, rowB) => {
            const countryA = this.getCountryFromRow(rowA);
            const countryB = this.getCountryFromRow(rowB);

            const rowAValueCount = rowA.filter(cell => cell.value !== this.emptyValue).length;
            const rowBValueCount = rowB.filter(cell => cell.value !== this.emptyValue).length;

            if (rowAValueCount !== rowBValueCount) {
                return rowAValueCount < rowBValueCount ? 1 : -1;
            }

            return countryA.localeCompare(countryB, "und", { sensitivity: "base" });
        });

        return [columns, ...sortedDataRows];
    }

    private getCountryFromRow(row: PolicyExplorerCell[]): string {
        const firstCell = row[0];

        if (firstCell && firstCell.type === PolicyExplorerCellType.DATA) {
            return firstCell.value;
        }

        return "";
    }
}
