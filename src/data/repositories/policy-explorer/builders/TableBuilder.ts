import { DataValueSetsDataValue } from "@eyeseetea/d2-api/api";
import { PolicyExplorerCell } from "../../../../domain/entities/policy-explorer/PolicyExplorer";
import { D2DataSet } from "../PolicyExplorerD2Repository";
import { TableBuilderByTypeOfHealthcare } from "./TableBuilderByTypeOfHealthcare";
import { TableBuilderDefault } from "./TableBuilderDefault";

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

export const CATEGORY_BY_TYPE_OF_HEALTHCARE = {
    USER_CHARGES: "u800TAhsIBY",
    TYPES_OF_USER_CHARGES: "lHk8jtKonPh",
};

export function getTableBuilder(policyExplorerCategoryId: string) {
    switch (policyExplorerCategoryId) {
        case CATEGORY_BY_TYPE_OF_HEALTHCARE.USER_CHARGES:
        case CATEGORY_BY_TYPE_OF_HEALTHCARE.TYPES_OF_USER_CHARGES:
            return new TableBuilderByTypeOfHealthcare(policyExplorerCategoryId);
        default:
            return new TableBuilderDefault();
    }
}
