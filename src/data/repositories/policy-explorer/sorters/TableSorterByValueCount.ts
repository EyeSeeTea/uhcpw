import { PolicyExplorerCell, PolicyExplorerCellType } from "../../../../domain/entities/policy-explorer/PolicyExplorer";
import { TableSorter } from "./TableSorter";

export class TableSorterByValueCount implements TableSorter {
    constructor(private valueToExclude = "", private emptyValues: string[] = []) {}
    cleanAndSort(columns: PolicyExplorerCell[], rows: PolicyExplorerCell[][]): PolicyExplorerCell[][] {
        const sortedDataRows = rows.sort((rowA, rowB) => {
            const countryA = this.getCountryFromRow(rowA);
            const countryB = this.getCountryFromRow(rowB);
            const compareByCountry = countryA.localeCompare(countryB, "und", { sensitivity: "base" });

            const emptyRowA = this.isEmpty(rowA);
            const emptyRowB = this.isEmpty(rowB);

            if (emptyRowA || emptyRowB) {
                return emptyRowA && emptyRowB ? compareByCountry : emptyRowA ? -1 : 1;
            }

            const valueCountDiff = this.getValueCount(rowB) - this.getValueCount(rowA);
            return valueCountDiff !== 0 ? valueCountDiff : compareByCountry;
        });

        return [columns, ...sortedDataRows];
    }

    private getValueCount(row: PolicyExplorerCell[]): number {
        return row.filter(cell => cell.value !== this.valueToExclude).length;
    }

    private isEmpty(row: PolicyExplorerCell[]): boolean {
        return row.slice(1).every(cell => this.emptyValues.includes(cell.value));
    }

    private getCountryFromRow(row: PolicyExplorerCell[]): string {
        const firstCell = row[0];

        if (firstCell && firstCell.type === PolicyExplorerCellType.DATA) {
            return firstCell.value;
        }

        return "";
    }
}
