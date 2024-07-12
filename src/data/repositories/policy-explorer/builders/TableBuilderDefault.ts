import { DataValueSetsDataValue } from "@eyeseetea/d2-api/api";
import { TableBuilder } from "./TableBuilder";
import { PolicyExplorerCell, PolicyExplorerCellType } from "../../../../domain/entities/policy-explorer/PolicyExplorer";
import { COUNTRY_HEADER_NAME, D2DataSet, EMPTY_DATA, PERIOD_HEADER_NAME } from "../PolicyExplorerD2Repository";
import { CategoryOption } from "../../../../webapp/components/policy-explorer/category-selector/CategorySelector";
import { CHANGES_IN_COVERAGE_POLICY_MERGED_CATEGORIES_ID } from "../PolicyExplorerCategoryD2Repository";

export class TableBuilderDefault implements TableBuilder {
    buildColumns(params: {
        policyExplorerCategoryId: string;
        policyExplorerSubcategoriesIds: string[];
        programCategories?: CategoryOption[];
        dataSet?: D2DataSet;
    }): PolicyExplorerCell[] {
        const { policyExplorerCategoryId, policyExplorerSubcategoriesIds, programCategories, dataSet } = params;

        const programSubcategories = this.getSectionsByCategoryId({
            policyExplorerCategoryId,
            policyExplorerSubcategoriesIds,
            dataSet,
            programCategories,
        });

        return [
            { type: PolicyExplorerCellType.HEADER, value: COUNTRY_HEADER_NAME },
            { type: PolicyExplorerCellType.HEADER, value: PERIOD_HEADER_NAME },
            ...programSubcategories.map(de => ({
                type: PolicyExplorerCellType.HEADER,
                value: "text" in de ? de.text : de.description || de.formName,
            })),
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
        dataSet: D2DataSet;
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
            {
                type: PolicyExplorerCellType.DATA,
                value: period || EMPTY_DATA,
            },
        ];

        const restCellsInRow = dataElementsSection.map(de => {
            const dataValue = dataValuesByGroup.find(dv => dv.dataElement === de.id);
            return {
                type: PolicyExplorerCellType.DATA,
                value: dataValue?.value || EMPTY_DATA,
                references,
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

    private getProgramDataElementsSection(
        policyExplorerCategoryId: string,
        policyExplorerSubcategoriesIds: string[],
        programCategories?: CategoryOption[]
    ) {
        return (
            programCategories
                ?.find(section => section.value === policyExplorerCategoryId)
                ?.subcategories.filter(subcategory => policyExplorerSubcategoriesIds.includes(subcategory.value)) || []
        );
    }

    private getSectionsByCategoryId({
        policyExplorerCategoryId,
        policyExplorerSubcategoriesIds,
        dataSet,
        programCategories,
    }: {
        policyExplorerCategoryId: string;
        policyExplorerSubcategoriesIds: string[];
        dataSet?: D2DataSet;
        programCategories?: CategoryOption[];
    }): Array<{ text: string } | { description?: string; formName: string }> {
        if (policyExplorerCategoryId === CHANGES_IN_COVERAGE_POLICY_MERGED_CATEGORIES_ID) {
            return this.getDataElementsSection(policyExplorerCategoryId, policyExplorerSubcategoriesIds, dataSet);
        } else {
            return this.getProgramDataElementsSection(
                policyExplorerCategoryId,
                policyExplorerSubcategoriesIds,
                programCategories
            );
        }
    }
}
