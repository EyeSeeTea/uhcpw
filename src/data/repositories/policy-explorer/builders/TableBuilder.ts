import { DataValueSetsDataValue } from "@eyeseetea/d2-api/api";
import { PolicyExplorerCell } from "../../../../domain/entities/policy-explorer/PolicyExplorer";
import { D2DataSet } from "../PolicyExplorerD2Repository";
import { TableBuilderByTypeOfHealthcare } from "./TableBuilderByTypeOfHealthcare";
import { TableBuilderDefault } from "./TableBuilderDefault";
import {
    CATEGORY_BY_TYPE_OF_HEALTHCARE,
    CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID,
} from "../PolicyExplorerCategoryD2Repository";

export interface TableBuilder {
    buildColumns(
        policyExplorerCategoryId: string,
        policyExplorerSubcategoriesIds: string[],
        dataSet?: D2DataSet
    ): PolicyExplorerCell[];
    buildRows(params: {
        currentRowsInTable: PolicyExplorerCell[][];
        policyExplorerCategoryId: string;
        policyExplorerSubcategoriesIds: string[];
        dataValuesByGroup: DataValueSetsDataValue[];
        orgUnitName: string;
        period?: string;
        references: string;
        dataSet?: D2DataSet;
    }): PolicyExplorerCell[][];
}

export function getTableBuilder(policyExplorerCategoryId: string) {
    const isPeriodColumnHeaderType = Object.values(CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID).includes(
        policyExplorerCategoryId
    );
    switch (policyExplorerCategoryId) {
        case CATEGORY_BY_TYPE_OF_HEALTHCARE.USER_CHARGES:
        case CATEGORY_BY_TYPE_OF_HEALTHCARE.TYPES_OF_USER_CHARGES:
            return new TableBuilderByTypeOfHealthcare(policyExplorerCategoryId);
        default:
            return new TableBuilderDefault(isPeriodColumnHeaderType);
    }
}
