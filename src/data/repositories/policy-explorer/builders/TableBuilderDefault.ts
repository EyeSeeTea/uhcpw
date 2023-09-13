import { DataValueSetsDataValue } from "@eyeseetea/d2-api/api";
import { TableBuilder } from "./TableBuilder";
import { PolicyExplorerCell, PolicyExplorerCellType } from "../../../../domain/entities/policy-explorer/PolicyExplorer";
import { D2DataSet, EMPTY_DATA } from "../PolicyExplorerD2Repository";

export class TableBuilderDefault implements TableBuilder {
    buildColumns(
        policyExplorerCategoryId: string,
        policyExplorerSubcategoriesIds: string[],
        dataSet?: D2DataSet
    ): PolicyExplorerCell[] {
        const dataElementsSection = this.getDataElementsSection(
            policyExplorerCategoryId,
            policyExplorerSubcategoriesIds,
            dataSet
        );

        return [
            { type: PolicyExplorerCellType.HEADER, value: "Country" },
            { type: PolicyExplorerCellType.HEADER, value: "Period" },
            ...dataElementsSection.map(de => ({ type: PolicyExplorerCellType.HEADER, value: de.formName })),
        ];
    }

    buildRows(params: {
        currentRowsInTable: PolicyExplorerCell[][];
        policyExplorerCategoryId: string;
        policyExplorerSubcategoriesIds: string[];
        dataValuesByGroup: DataValueSetsDataValue[];
        orgUnitName: string;
        period?: string;
        references: string;
        dataSet?: D2DataSet;
    }): PolicyExplorerCell[][] {
        const {
            policyExplorerCategoryId,
            policyExplorerSubcategoriesIds,
            dataSet,
            dataValuesByGroup,
            orgUnitName,
            period,
            references,
            currentRowsInTable,
        } = params;

        const dataElementsSection = this.getDataElementsSection(
            policyExplorerCategoryId,
            policyExplorerSubcategoriesIds,
            dataSet
        );

        const commonCellsInRow = [
            { type: PolicyExplorerCellType.DATA, value: orgUnitName },
            { type: PolicyExplorerCellType.DATA, value: period || EMPTY_DATA },
        ];

        const restCellsInRow = dataElementsSection.map(de => {
            const dataValue = dataValuesByGroup.find(dv => dv.dataElement === de.id);
            return {
                type: PolicyExplorerCellType.DATA,
                value: dataValue?.value ? `${dataValue?.value}\n\n${references}` : EMPTY_DATA,
            };
        });

        const row = [...commonCellsInRow, ...restCellsInRow];

        const isAllRowEmpty = restCellsInRow.every(cell => !cell.value);
        return isAllRowEmpty ? currentRowsInTable : [...currentRowsInTable, row];
    }

    private getDataElementsSection(
        policyExplorerCategoryId: string,
        policyExplorerSubcategoriesIds: string[],
        dataSet?: D2DataSet
    ) {
        return (
            dataSet?.sections
                .find(section => section.id === policyExplorerCategoryId)
                ?.dataElements.filter(
                    de =>
                        (de.valueType === "LONG_TEXT" || de.valueType === "TEXT") &&
                        policyExplorerSubcategoriesIds.includes(de.id)
                ) || []
        );
    }
}
