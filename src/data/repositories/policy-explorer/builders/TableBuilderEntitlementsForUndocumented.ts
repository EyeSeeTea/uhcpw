import { DataValueSetsDataValue } from "@eyeseetea/d2-api/api";
import { TableBuilder } from "./TableBuilder";
import {
    PolicyExplorerCell,
    PolicyExplorerCellHeader,
    PolicyExplorerCellType,
    PolicyExplorerCellEntitlements,
} from "../../../../domain/entities/policy-explorer/PolicyExplorer";
import { COUNTRY_HEADER_NAME } from "../PolicyExplorerD2Repository";
import { Id } from "../../../../domain/entities/Ref";
import { Maybe } from "../../../../types/utils";

type EntitlementColumns =
    | "Same entitlements as most people"
    | "Entitled to some outpatient care"
    | "Entitled to selected care"
    | "Entitled to emergency care only"
    | "No entitlements";

export const ENTITLEMENTS_FOR_UNDOCUMENTED_DATA_ELEMENT_SECTION_IDS: Record<EntitlementColumns, Id> = {
    "Same entitlements as most people": "zYEg8QUfyO5",
    "Entitled to some outpatient care": "Pa30Ymy7osI",
    "Entitled to selected care": "obFIF0BaS1X",
    "Entitled to emergency care only": "Bol62L1xEQU",
    "No entitlements": "bLuxWkCvFbN",
};

const valueMap = {
    SOME: "some",
    MOST: "most",
    DEFAULT: "none",
} as const;
type ValueMapKey = keyof typeof valueMap;
const isValueMapKey = (v: string): v is ValueMapKey => v in valueMap;

export class TableBuilderEntitlementsForUndocumented implements TableBuilder {
    buildColumns(params: {
        policyExplorerCategoryId: string;
        policyExplorerSubcategoriesIds: string[];
    }): PolicyExplorerCellHeader[] {
        const { policyExplorerSubcategoriesIds } = params;

        const commonColumns: PolicyExplorerCellHeader[] = [
            { type: PolicyExplorerCellType.HEADER, value: COUNTRY_HEADER_NAME },
        ];

        const restColumns = Object.entries(ENTITLEMENTS_FOR_UNDOCUMENTED_DATA_ELEMENT_SECTION_IDS)
            .filter(([_column, dataElementId]) => policyExplorerSubcategoriesIds.includes(dataElementId))
            .map<PolicyExplorerCellHeader>(([columnName, _dataElementIds]) => ({
                type: PolicyExplorerCellType.HEADER,
                value: columnName,
            }));

        return [...commonColumns, ...restColumns];
    }

    buildRows(params: {
        currentRowsInTable: PolicyExplorerCell[][];
        policyExplorerCategoryId: string;
        dataValuesByGroup: DataValueSetsDataValue[];
        orgUnitName: string;
        period?: string;
        references: string;
    }): PolicyExplorerCell[][] {
        const { dataValuesByGroup, orgUnitName, period, references, currentRowsInTable } = params;

        const orgUnitCell = {
            type: PolicyExplorerCellType.DATA,
            value: [orgUnitName, period].join(" "),
        };

        const restCellsInRow: PolicyExplorerCellEntitlements[] = Object.values(
            ENTITLEMENTS_FOR_UNDOCUMENTED_DATA_ELEMENT_SECTION_IDS
        ).map(dataElementId => {
            const dataValue = dataValuesByGroup.find(dv => dv.dataElement === dataElementId);
            const value = dataValue?.value;
            return {
                type: PolicyExplorerCellType.DATA,
                value: value && isValueMapKey(value) ? valueMap[value] : valueMap.DEFAULT,
                references,
                dataType: "entitlements",
            };
        });

        if (restCellsInRow.every(cell => cell.value === valueMap.DEFAULT)) return [...currentRowsInTable];
        else return [...currentRowsInTable, [orgUnitCell, ...restCellsInRow]];
    }

    static fillSubcategories(subcategoriesSelected: Maybe<string[]>) {
        return Object.entries(ENTITLEMENTS_FOR_UNDOCUMENTED_DATA_ELEMENT_SECTION_IDS).reduce(
            (accSubcategories, subcategories) => {
                const [_section, dataElementId] = subcategories;
                return subcategoriesSelected?.includes(dataElementId)
                    ? [...accSubcategories, dataElementId]
                    : accSubcategories;
            },
            [] as string[]
        );
    }
}
