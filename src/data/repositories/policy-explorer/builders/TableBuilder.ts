import { DataValueSetsDataValue } from "@eyeseetea/d2-api/api";
import {
    PolicyExplorerCell,
    PolicyExplorerCellHeader,
} from "../../../../domain/entities/policy-explorer/PolicyExplorer";
import { D2DataSet } from "../PolicyExplorerD2Repository";
import { TableBuilderByTypeOfHealthcare } from "./TableBuilderByTypeOfHealthcare";
import { TableBuilderDefault } from "./TableBuilderDefault";
import {
    CATEGORY_BY_TYPE_OF_HEALTHCARE,
    CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID,
    DATASET_ENTITLEMENTS_FOR_UNDOCUMENTED_CATEGORY,
} from "../PolicyExplorerCategoryD2Repository";
import { TableBuilderChangesInCoveragePolicy } from "./TableBuilderChangesInCoveragePolicy";
import { TableBuilderCoveredHealthcareByType } from "./TableBuilderCoveredHealthcareByType";
import { TableBuilderEntitlementsForUndocumented } from "./TableBuilderEntitlementsForUndocumented";

export interface TableBuilder {
    buildColumns(params: {
        policyExplorerCategoryId: string;
        policyExplorerSubcategoriesIds?: string[];
        dataSet?: D2DataSet;
    }): PolicyExplorerCellHeader[];
    buildRows(params: {
        currentRowsInTable: PolicyExplorerCell[][];
        policyExplorerCategoryId: string;
        policyExplorerSubcategoriesIds?: string[];
        dataValuesByGroup: DataValueSetsDataValue[];
        orgUnitName: string;
        period?: string;
        references: string;
        dataSet?: D2DataSet;
    }): PolicyExplorerCell[][];
}

export function getTableBuilder(policyExplorerCategoryId: string) {
    switch (policyExplorerCategoryId) {
        case CATEGORY_BY_TYPE_OF_HEALTHCARE.USER_CHARGES:
        case CATEGORY_BY_TYPE_OF_HEALTHCARE.TYPES_OF_USER_CHARGES:
            return new TableBuilderByTypeOfHealthcare();
        case CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID:
            return new TableBuilderChangesInCoveragePolicy();

        case CATEGORY_BY_TYPE_OF_HEALTHCARE.USER_CHARGES_APPLY:
            return new TableBuilderCoveredHealthcareByType();
        case DATASET_ENTITLEMENTS_FOR_UNDOCUMENTED_CATEGORY:
            return new TableBuilderEntitlementsForUndocumented();
        default:
            return new TableBuilderDefault();
    }
}
