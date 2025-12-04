import { PolicyExplorerCell, PolicyExplorerCellType } from "../../../../domain/entities/policy-explorer/PolicyExplorer";
import { TableSorter } from "./TableSorter";

export class TableSorterByPriorityColumns implements TableSorter {
    constructor(private priorityHeaders: string[] = [], private valuePriority: Record<string, number> = {}) {}

    cleanAndSort(columns: PolicyExplorerCell[], rows: PolicyExplorerCell[][]): PolicyExplorerCell[][] {
        const headerIndexMap = this.buildHeaderIndexMap(columns);

        const sortedRows = [...rows].sort((rowA, rowB) => this.compareRows(rowA, rowB, headerIndexMap));

        return [columns, ...sortedRows];
    }

    private buildHeaderIndexMap(columns: PolicyExplorerCell[]) {
        return columns.reduce<Record<string, number>>((acc, cell, idx) => {
            if (cell.type === PolicyExplorerCellType.HEADER) {
                acc[cell.value] = idx;
            }
            return acc;
        }, {});
    }

    private compareRows(
        rowA: PolicyExplorerCell[],
        rowB: PolicyExplorerCell[],
        headerIndexMap: Record<string, number>
    ): number {
        const priorityComparison = this.priorityHeaders
            .map(header => {
                const index = headerIndexMap[header];

                if (index === undefined) return 0;

                return this.compareEntitlementCells(rowA[index], rowB[index]);
            })
            .find(result => result !== 0);

        if (priorityComparison !== undefined) return priorityComparison;

        return this.getCountry(rowA).localeCompare(this.getCountry(rowB), "und", { sensitivity: "base" });
    }

    private compareEntitlementCells(cellA?: PolicyExplorerCell, cellB?: PolicyExplorerCell): number {
        const valueA = this.getCellValue(cellA);
        const valueB = this.getCellValue(cellB);

        return valueB - valueA;
    }

    private getCellValue(cell?: PolicyExplorerCell): number {
        if (!cell || cell.type !== PolicyExplorerCellType.DATA) return 0;

        const value = cell.value ?? "";

        return this.valuePriority[value] ?? 0;
    }

    private getCountry(row: PolicyExplorerCell[]): string {
        const cell = row[0];
        return cell?.type === PolicyExplorerCellType.DATA ? cell.value ?? "" : "";
    }
}
