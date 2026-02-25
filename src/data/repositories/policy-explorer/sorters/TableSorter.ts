import { PolicyExplorerCell } from "../../../../domain/entities/policy-explorer/PolicyExplorer";
import {
    CATEGORY_BY_TYPE_OF_HEALTHCARE,
    DATASET_ENTITLEMENTS_FOR_UNDOCUMENTED_CATEGORY,
} from "../PolicyExplorerCategoryD2Repository";
import { TableSorterByPriorityColumns } from "./TableSorterByPriorityColumns";
import { TableSorterByValueCount } from "./TableSorterByValueCount";

export interface TableSorter {
    cleanAndSort(columns: PolicyExplorerCell[], rows: PolicyExplorerCell[][]): PolicyExplorerCell[][];
}

class DefaultTableSorter implements TableSorter {
    cleanAndSort(columns: PolicyExplorerCell[], rows: PolicyExplorerCell[][]): PolicyExplorerCell[][] {
        return this.filterColumnsWithNoData(columns, rows);
    }
    private filterColumnsWithNoData(columns: PolicyExplorerCell[], rows: PolicyExplorerCell[][]) {
        const indexesToRemove = columns.reduce((accIndexesToRemove: number[], _column, columnIndex) => {
            const hasRowsWithoutData = rows.every(row => !row[columnIndex]?.value);
            return hasRowsWithoutData ? [...accIndexesToRemove, columnIndex] : accIndexesToRemove;
        }, []);

        const filteredColumns = columns.filter((_column, index) => !indexesToRemove.includes(index));
        const filteredRows = rows.map(row => row.filter((_cell, index) => !indexesToRemove.includes(index)));

        return filteredColumns.length ? [filteredColumns, ...filteredRows] : [];
    }
}

export function getTableSorter(policyExplorerCategoryId: string) {
    switch (policyExplorerCategoryId) {
        case CATEGORY_BY_TYPE_OF_HEALTHCARE.USER_CHARGES_APPLY:
            return new TableSorterByValueCount("yes", ["no", "none"]);
        case DATASET_ENTITLEMENTS_FOR_UNDOCUMENTED_CATEGORY: {
            const priorityHeaders: string[] = [
                "Same entitlements as most people",
                "Entitled to some outpatient care",
                "Entitled to selected care",
                "Entitled to emergency care only",
                "No entitlements",
            ];

            const valuePriority = {
                most: 2,
                some: 1,
            };
            return new TableSorterByPriorityColumns(priorityHeaders, valuePriority);
        }
        default:
            return new DefaultTableSorter();
    }
}
